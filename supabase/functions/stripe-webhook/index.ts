// Supabase Edge Function: Stripe Webhook Handler
// Handles subscription lifecycle events from Stripe

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    console.log(`Processing Stripe event: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutComplete(supabase, session)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(supabase, subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(supabase, subscription)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(supabase, invoice)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(supabase, invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

async function handleCheckoutComplete(
  supabase: ReturnType<typeof createClient>,
  session: Stripe.Checkout.Session
) {
  console.log('Checkout completed:', session.id, 'Mode:', session.mode)

  const metadata = session.metadata || {}
  const userId = metadata.user_id
  const orgId = metadata.org_id
  const subscriptionType = metadata.subscription_type // 'individual' or 'org'

  if (!session.customer) {
    console.error('Missing customer in session')
    return
  }

  const customerId = session.customer as string

  // One-time payment for individual access (1-year hard stop)
  if (session.mode === 'payment' && subscriptionType === 'individual' && userId) {
    await supabase.from('stripe_customers').upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      email: session.customer_email || ''
    }, { onConflict: 'user_id' })

    // Look up the price ID from the checkout session line items
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 })
    const priceId = lineItems.data[0]?.price?.id || ''

    const now = new Date()
    const accessEnd = new Date(now)
    accessEnd.setFullYear(now.getFullYear() + 1)

    await supabase.from('subscriptions').upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: session.id, // checkout session ID — there's no Stripe subscription for one-time payments
      stripe_price_id: priceId,
      status: 'active',
      current_period_start: now.toISOString(),
      current_period_end: accessEnd.toISOString(),
      cancel_at_period_end: true, // access does not renew
      canceled_at: null
    }, { onConflict: 'stripe_subscription_id' })

    console.log('Granted 1-year access for user:', userId, 'until', accessEnd.toISOString())
    return
  }

  // Subscription-based flow (org subscriptions, or any legacy individual subscription)
  if (!session.subscription) {
    console.error('Missing subscription in session for subscription-mode checkout')
    return
  }

  const subscriptionId = session.subscription as string
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  if (subscriptionType === 'individual' && userId) {
    await supabase.from('stripe_customers').upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      email: session.customer_email || ''
    }, { onConflict: 'user_id' })

    await upsertIndividualSubscription(supabase, userId, subscription)

  } else if (subscriptionType === 'org' && orgId) {
    await supabase.from('stripe_customers').upsert({
      org_id: orgId,
      stripe_customer_id: customerId,
      email: session.customer_email || ''
    }, { onConflict: 'org_id' })

    await upsertOrgSubscription(supabase, orgId, subscription)
  }
}

async function handleSubscriptionUpdate(
  supabase: ReturnType<typeof createClient>,
  subscription: Stripe.Subscription
) {
  console.log('Subscription updated:', subscription.id, 'Status:', subscription.status)

  const customerId = subscription.customer as string

  // Find if this is individual or org subscription
  const { data: customer } = await supabase
    .from('stripe_customers')
    .select('user_id, org_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!customer) {
    console.error('No customer found for:', customerId)
    return
  }

  if (customer.user_id) {
    await upsertIndividualSubscription(supabase, customer.user_id, subscription)
  } else if (customer.org_id) {
    await upsertOrgSubscription(supabase, customer.org_id, subscription)
  }
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof createClient>,
  subscription: Stripe.Subscription
) {
  console.log('Subscription deleted:', subscription.id)

  // Update status to canceled
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)

  await supabase
    .from('org_subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)
}

async function handlePaymentFailed(
  supabase: ReturnType<typeof createClient>,
  invoice: Stripe.Invoice
) {
  console.log('Payment failed for invoice:', invoice.id)

  if (!invoice.subscription) return

  const subscriptionId = invoice.subscription as string

  // Update status to past_due
  await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId)

  await supabase
    .from('org_subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId)
}

async function handlePaymentSucceeded(
  supabase: ReturnType<typeof createClient>,
  invoice: Stripe.Invoice
) {
  console.log('Payment succeeded for invoice:', invoice.id)

  if (!invoice.subscription) return

  const subscriptionId = invoice.subscription as string

  // Fetch updated subscription to get new period dates
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Update subscription with new period dates
  await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
    })
    .eq('stripe_subscription_id', subscriptionId)

  await supabase
    .from('org_subscriptions')
    .update({
      status: 'active',
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
    })
    .eq('stripe_subscription_id', subscriptionId)
}

async function upsertIndividualSubscription(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  subscription: Stripe.Subscription
) {
  const priceId = subscription.items.data[0]?.price.id || ''

  await supabase.from('subscriptions').upsert({
    user_id: userId,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : null
  }, { onConflict: 'stripe_subscription_id' })

  console.log('Upserted individual subscription for user:', userId)
}

async function upsertOrgSubscription(
  supabase: ReturnType<typeof createClient>,
  orgId: string,
  subscription: Stripe.Subscription
) {
  const priceId = subscription.items.data[0]?.price.id || ''
  const quantity = subscription.items.data[0]?.quantity || 0

  // Calculate tier and price based on seat count
  let tier = 'starter'
  let pricePerSeatCents = 26700

  if (quantity <= 5) {
    tier = 'starter'
    pricePerSeatCents = 26700
  } else if (quantity <= 15) {
    tier = 'team'
    pricePerSeatCents = 19900
  } else if (quantity <= 50) {
    tier = 'clinic'
    pricePerSeatCents = 14900
  } else {
    tier = 'enterprise'
    pricePerSeatCents = 9900
  }

  await supabase.from('org_subscriptions').upsert({
    org_id: orgId,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    status: subscription.status,
    seat_count: quantity,
    current_tier: tier,
    price_per_seat_cents: pricePerSeatCents,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : null
  }, { onConflict: 'org_id' })

  console.log('Upserted org subscription for org:', orgId, 'Seats:', quantity)
}
