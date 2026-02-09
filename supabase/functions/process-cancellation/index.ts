// Supabase Edge Function: Process Subscription Cancellation
// Calculates refund amount server-side and cancels via Stripe API.
// Refund tiers: 100% (days 1-3), 75% (<25%), 50% (25-49%), 25% (50-74%), 0% (75%+)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'
import { corsHeaders } from '../_shared/cors.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const COURSE_PRICE_CENTS = 32700 // $327.00

function calculateRefundCents(daysSinceStart: number, completionPercent: number): number {
  // Days 1-3: full refund
  if (daysSinceStart < 3) return COURSE_PRICE_CENTS

  // Day 4+: based on completion
  if (completionPercent < 25) return Math.round(COURSE_PRICE_CENTS * 0.75)
  if (completionPercent < 50) return Math.round(COURSE_PRICE_CENTS * 0.50)
  if (completionPercent < 75) return Math.round(COURSE_PRICE_CENTS * 0.25)
  return 0
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Verify user with anon key (respects RLS)
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use service role to read subscription data (bypasses RLS for admin queries)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Get the user's active subscription
    const { data: subscription, error: subError } = await adminClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (subError || !subscription) {
      return new Response(
        JSON.stringify({ error: 'No active subscription found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate refund from server-side data (never trust client)
    const startDate = new Date(subscription.current_period_start)
    const now = new Date()
    const msPerDay = 1000 * 60 * 60 * 24
    const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / msPerDay)
    const completionPercent = subscription.completion_percentage || 0

    const refundCents = calculateRefundCents(daysSinceStart, completionPercent)
    const refundDollars = refundCents / 100

    // Cancel the Stripe subscription immediately
    const stripeSubscription = await stripe.subscriptions.cancel(
      subscription.stripe_subscription_id,
      { prorate: false }
    )

    // Issue refund if applicable
    if (refundCents > 0) {
      // Find the latest paid invoice for this subscription
      const invoices = await stripe.invoices.list({
        subscription: subscription.stripe_subscription_id,
        status: 'paid',
        limit: 1,
      })

      if (invoices.data.length > 0 && invoices.data[0].charge) {
        await stripe.refunds.create({
          charge: invoices.data[0].charge as string,
          amount: refundCents,
          reason: 'requested_by_customer',
        })
      }
    }

    // Update subscription record
    await adminClient
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: now.toISOString(),
        cancel_at_period_end: false,
      })
      .eq('id', subscription.id)

    console.log(
      `Cancellation processed for user ${user.id}: ` +
      `${daysSinceStart} days enrolled, ${completionPercent}% complete, ` +
      `refund $${refundDollars}`
    )

    return new Response(
      JSON.stringify({
        success: true,
        refund_amount: refundDollars,
        refund_percent: refundCents > 0 ? Math.round((refundCents / COURSE_PRICE_CENTS) * 100) : 0,
        days_enrolled: daysSinceStart,
        completion_percent: completionPercent,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Cancellation error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
