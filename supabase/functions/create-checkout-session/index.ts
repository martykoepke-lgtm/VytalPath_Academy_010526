// Supabase Edge Function: Create Stripe Checkout Session
// Creates a checkout session for individual or org subscriptions

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'
import { corsHeaders } from '../_shared/cors.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

interface CheckoutRequest {
  price_type: 'individual' | 'org'
  payment_plan?: 'full' | 'installment' // For individual: full ($327) or installment (3x$109)
  org_id?: string
  quantity?: number // For org seats
  success_url?: string
  cancel_url?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    // Verify user
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request
    const body: CheckoutRequest = await req.json()
    const { price_type, payment_plan = 'full', org_id, quantity = 1, success_url, cancel_url } = body

    // Installment plan was removed — individual access is a one-time payment for 1 year
    if (price_type === 'individual' && payment_plan === 'installment') {
      return new Response(
        JSON.stringify({ error: 'Installment plan is no longer offered. Please use the one-time payment option.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get or create Stripe customer
    let customerId: string

    const { data: existingCustomer } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq(price_type === 'org' ? 'org_id' : 'user_id', price_type === 'org' ? org_id : user.id)
      .single()

    if (existingCustomer?.stripe_customer_id) {
      customerId = existingCustomer.stripe_customer_id
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
          ...(org_id && { org_id })
        }
      })
      customerId = customer.id
    }

    // Get price IDs
    const individualPriceId = Deno.env.get('STRIPE_INDIVIDUAL_PRICE_ID')
    const orgSeatPriceId = Deno.env.get('STRIPE_ORG_SEAT_PRICE_ID')

    if (price_type === 'individual' && !individualPriceId) {
      return new Response(
        JSON.stringify({ error: 'Individual price not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (price_type === 'org' && !orgSeatPriceId) {
      return new Response(
        JSON.stringify({ error: 'Organization price not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // For org subscriptions, verify user is org admin
    if (price_type === 'org') {
      if (!org_id) {
        return new Response(
          JSON.stringify({ error: 'org_id required for organization subscriptions' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: membership } = await supabase
        .from('org_members')
        .select('role')
        .eq('org_id', org_id)
        .eq('user_id', user.id)
        .single()

      if (membership?.role !== 'admin') {
        return new Response(
          JSON.stringify({ error: 'Only organization admins can purchase subscriptions' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Build checkout session — different mode for individual (one-time) vs org (subscription)
    const isIndividual = price_type === 'individual'

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: isIndividual ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: isIndividual
        ? [{ price: individualPriceId, quantity: 1 }]
        : [{ price: orgSeatPriceId, quantity }],
      success_url: success_url || `${req.headers.get('origin')}/foundations?checkout=success`,
      cancel_url: cancel_url || `${req.headers.get('origin')}/pricing?checkout=canceled`,
      metadata: {
        user_id: user.id,
        subscription_type: price_type,
        payment_plan: 'full',
        ...(org_id && { org_id })
      },
      allow_promotion_codes: true,
    }

    // subscription_data is only valid for mode='subscription' (org plans)
    if (!isIndividual) {
      sessionParams.subscription_data = {
        metadata: {
          user_id: user.id,
          subscription_type: price_type,
          payment_plan: 'full',
          ...(org_id && { org_id })
        }
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Checkout session error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
