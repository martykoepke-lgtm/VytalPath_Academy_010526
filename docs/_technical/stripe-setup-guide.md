# Stripe Configuration Guide — VytalPath Academy

Complete step-by-step instructions to configure Stripe for VytalPath Academy's subscription billing, webhook processing, customer portal, and cancellation/refund system.

---

## Prerequisites

- A Stripe account (https://dashboard.stripe.com)
- Access to the Supabase project dashboard (https://supabase.com/dashboard)
- The Supabase CLI (optional, for deploying edge functions locally)

---

## Step 1: Create Stripe Products & Prices

### 1a. Individual Subscription Product

1. Go to **Stripe Dashboard → Products → + Add product**
2. Fill in:
   - **Name:** `VytalPath Academy — Individual Access`
   - **Description:** `1 year of full access to all training sections, EHR Practice Lab, and job readiness tools.`
3. Under **Pricing**, click **Add price**:
   - **Pricing model:** Standard
   - **Price:** `$327.00`
   - **Billing period:** `Every 12 months` (Recurring → Yearly)
   - **Currency:** USD
4. Save the product
5. Copy the **Price ID** (starts with `price_...`) — you will need this as `STRIPE_INDIVIDUAL_PRICE_ID`

### 1b. Organization Seat Product (if using org billing)

1. **+ Add product** again:
   - **Name:** `VytalPath Academy — Organization Seat`
   - **Description:** `Per-seat annual access for organization members.`
2. Under **Pricing**, click **Add price**:
   - **Pricing model:** Standard
   - **Price:** `$267.00` (starter tier base — Stripe handles quantity at checkout)
   - **Billing period:** `Every 12 months`
   - **Usage type:** Licensed (per-seat)
3. Save and copy the **Price ID** — this is `STRIPE_ORG_SEAT_PRICE_ID`

> **Note:** The org tier pricing ($267/$199/$149/$99 per seat) is calculated server-side in the webhook handler based on seat quantity. You only need one Stripe price for the org product.

---

## Step 2: Get Your Stripe API Keys

1. Go to **Stripe Dashboard → Developers → API keys**
2. Copy these two keys:

| Key | Where to find it | Where it goes |
|-----|-------------------|---------------|
| **Publishable key** (`pk_live_...` or `pk_test_...`) | "Standard keys" section | `.env` file as `VITE_STRIPE_PUBLISHABLE_KEY` |
| **Secret key** (`sk_live_...` or `sk_test_...`) | Click "Reveal live/test key" | Supabase Edge Function secret as `STRIPE_SECRET_KEY` |

> **Important:** For development/testing, use **test mode** keys (toggle at the top of the Stripe dashboard). Switch to live mode keys only for production.

---

## Step 3: Configure the Stripe Webhook

### 3a. Create the Webhook Endpoint

1. Go to **Stripe Dashboard → Developers → Webhooks**
2. Click **+ Add endpoint**
3. Set the **Endpoint URL** to:
   ```
   https://vwieorhlcapeeamvltqa.supabase.co/functions/v1/stripe-webhook
   ```
4. Under **Select events to listen to**, add these 6 events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
5. Click **Add endpoint**

### 3b. Get the Webhook Signing Secret

1. After creating the endpoint, click on it to view details
2. Under **Signing secret**, click **Reveal**
3. Copy the secret (starts with `whsec_...`) — this is `STRIPE_WEBHOOK_SECRET`

---

## Step 4: Configure the Customer Portal

The customer portal lets students view invoices and update payment methods. Our custom cancellation flow handles cancellations separately, so we disable Stripe's built-in cancel option.

1. Go to **Stripe Dashboard → Settings → Billing → Customer portal**
2. Configure these settings:

| Setting | Value |
|---------|-------|
| **Invoice history** | Enabled |
| **Payment method** | Allow customers to update payment methods |
| **Subscriptions → Cancel** | **Disabled** (cancellations go through our in-app flow) |
| **Subscriptions → Switch plans** | Disabled (single plan) |
| **Subscriptions → Update quantities** | Disabled for individual; optionally enable for org |

3. Under **Business information**:
   - **Business name:** VytalPath Academy
   - **Terms of service URL:** (your terms page URL)
   - **Privacy policy URL:** (your privacy page URL)
4. Under **Redirect**:
   - **Default return URL:** `https://your-domain.com/account`
5. Save changes

> **Why disable cancel in portal?** Our `/account` page has a custom cancellation flow that calculates tiered refunds based on course progress. If students cancel through Stripe's portal directly, they would bypass the refund calculation.

---

## Step 5: Set Supabase Edge Function Secrets

All secrets must be set in the Supabase dashboard (they are NOT stored in the codebase).

1. Go to **Supabase Dashboard → Your Project → Edge Functions → Secrets**
   (or navigate to: Settings → Edge Functions)
2. Add these 4 secrets:

| Secret Name | Value | Used By |
|-------------|-------|---------|
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` | All 4 edge functions |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | stripe-webhook |
| `STRIPE_INDIVIDUAL_PRICE_ID` | `price_...` (from Step 1a) | create-checkout-session |
| `STRIPE_ORG_SEAT_PRICE_ID` | `price_...` (from Step 1b) | create-checkout-session |

> **Note:** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are automatically available to all Supabase edge functions. You do NOT need to set these manually.

---

## Step 6: Deploy Edge Functions

If you haven't deployed the edge functions yet, or need to redeploy after changes:

```bash
# Deploy all 4 Stripe-related edge functions
supabase functions deploy create-checkout-session --no-verify-jwt
supabase functions deploy create-portal-session --no-verify-jwt
supabase functions deploy stripe-webhook --no-verify-jwt
supabase functions deploy process-cancellation --no-verify-jwt
```

> **Why `--no-verify-jwt`?** The webhook function receives requests from Stripe (not authenticated users), so it needs to bypass JWT verification. The other functions verify authentication internally via the `Authorization` header. Using `--no-verify-jwt` at the deploy level and handling auth in code gives more control.

Alternatively, deploy all functions at once:
```bash
supabase functions deploy
```

---

## Step 7: Update Local Environment Variables

In your `.env` file at the project root, ensure these are set:

```env
# Supabase
VITE_SUPABASE_URL=https://vwieorhlcapeeamvltqa.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>

# Stripe (client-side — publishable key only)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_... for dev)
```

> **Security:** The secret key (`sk_...`) must NEVER appear in the `.env` file or any client-side code. It lives only in Supabase edge function secrets.

---

## Step 8: Run the Database Migration

The new cancellation/refund features require a migration that adds `completion_percentage` tracking to the subscriptions table and updates the RPC functions.

### Option A: Via Supabase Dashboard (SQL Editor)

1. Go to **Supabase Dashboard → SQL Editor**
2. Open and run the contents of:
   ```
   supabase/migrations/20260210000000_add_completion_percentage.sql
   ```
3. This adds:
   - `completion_percentage` and `last_progress_sync` columns to `subscriptions`
   - `sync_completion_percentage()` RPC (called by client to persist progress)
   - Updated `get_user_subscription_status()` RPC (now returns `current_period_start`)
   - `get_students_refund_status()` RPC (admin view of all subscribers)

### Option B: Via Supabase CLI

```bash
supabase db push
```

---

## Step 9: Verify the Full Flow

### 9a. Test Checkout (use Stripe test mode)

1. Make sure you're using **test mode** keys (`pk_test_...`, `sk_test_...`)
2. Log into VytalPath Academy as a non-admin user
3. Navigate to the Pricing page and click **Subscribe Now**
4. You should be redirected to a Stripe checkout page
5. Use test card number: `4242 4242 4242 4242` (any future expiry, any CVC)
6. Complete checkout
7. Verify you're redirected back to the app with `?checkout=success`
8. Verify the subscription appears in **Supabase → Table Editor → subscriptions**

### 9b. Test Webhook Processing

1. Go to **Stripe Dashboard → Developers → Webhooks → your endpoint**
2. Check **Recent events** — you should see `checkout.session.completed` and `customer.subscription.created` events with status 200
3. If events show failures, check the **Supabase → Edge Functions → Logs** for the `stripe-webhook` function

### 9c. Test Customer Portal

1. As a subscribed user, go to `/account`
2. Your subscription details should display (status, dates, plan)
3. The portal would be accessible if you add a "Manage Billing" button (optional — currently billing info shows in-app)

### 9d. Test Cancellation Flow

1. As a subscribed user, go to `/account`
2. Click **Cancel My Subscription**
3. The modal should show your estimated refund based on progress and enrollment date
4. Confirm cancellation
5. Verify in Stripe Dashboard that the subscription is cancelled and refund (if applicable) was issued

### 9e. Test Admin Subscriptions View

1. Log in as a super admin
2. Go to `/admin` → click **Subscriptions** tab
3. All active subscribers should appear with progress bars and refund tier badges

---

## Step 10: Go Live Checklist

Before switching to production/live mode:

- [ ] **Stripe products created** with correct prices ($327/year individual)
- [ ] **Live mode API keys** set in Supabase edge function secrets
- [ ] **Live webhook endpoint** created pointing to your Supabase function URL
- [ ] **Webhook signing secret** updated in Supabase secrets
- [ ] **Live price IDs** updated in Supabase secrets
- [ ] **Customer portal** configured with cancel disabled
- [ ] **Database migration** (20260210) applied to production database
- [ ] **Edge functions deployed** to production
- [ ] **`.env`** updated with live publishable key (`pk_live_...`)
- [ ] **Test a real checkout** with a real card (can refund immediately after)

---

## Troubleshooting

### "No active subscription found" after checkout
- **Cause:** Webhook hasn't processed yet, or webhook is failing
- **Fix:** Check Stripe Dashboard → Webhooks → Recent events. Look for failures. Check Supabase Edge Function logs.

### Checkout redirects but subscription doesn't appear
- **Cause:** The `checkout.session.completed` webhook event is failing
- **Fix:** In Stripe webhook dashboard, click the failed event to see the error. Common issues: wrong `STRIPE_WEBHOOK_SECRET`, missing `SUPABASE_SERVICE_ROLE_KEY`.

### "Individual price not configured" error
- **Cause:** `STRIPE_INDIVIDUAL_PRICE_ID` not set in Supabase secrets
- **Fix:** Add the price ID from your Stripe product to Supabase edge function secrets.

### Refund shows $0 when it shouldn't
- **Cause:** `completion_percentage` hasn't synced yet (stays at 0 default)
- **Fix:** The client syncs completion % every 5 seconds when progress changes. Ensure the user has navigated the app after subscribing. Check the `subscriptions` table for the `completion_percentage` and `last_progress_sync` columns.

### Webhook signature verification failed
- **Cause:** `STRIPE_WEBHOOK_SECRET` doesn't match the endpoint
- **Fix:** Each webhook endpoint has its own signing secret. Make sure you copied the secret from the correct endpoint. Re-reveal and re-copy if needed.

---

## Environment Variables Summary

### Client-side (`.env`)
| Variable | Example | Purpose |
|----------|---------|---------|
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | Supabase anonymous key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Stripe publishable key (client-safe) |

### Supabase Edge Function Secrets (dashboard only)
| Secret | Example | Used By |
|--------|---------|---------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | All Stripe edge functions |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | stripe-webhook |
| `STRIPE_INDIVIDUAL_PRICE_ID` | `price_1ABC...` | create-checkout-session |
| `STRIPE_ORG_SEAT_PRICE_ID` | `price_1DEF...` | create-checkout-session |

### Auto-provided by Supabase (no setup needed)
| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Available to all edge functions |
| `SUPABASE_ANON_KEY` | Available to all edge functions |
| `SUPABASE_SERVICE_ROLE_KEY` | Available to all edge functions |

---

## Architecture Reference

```
Student clicks "Subscribe"
    │
    ▼
create-checkout-session (edge fn)
    │  Creates Stripe checkout session
    ▼
Stripe Checkout (hosted page)
    │  Student enters payment
    ▼
stripe-webhook (edge fn)
    │  checkout.session.completed
    │  customer.subscription.created
    │  Writes to: stripe_customers, subscriptions
    ▼
SubscriptionContext (React)
    │  Calls get_user_subscription_status RPC
    │  Sets hasAccess = true
    ▼
Student accesses content
    │
    ▼
ProgressContext (React)
    │  Tracks lesson/quiz completion in localStorage
    │  Syncs completion_percentage to Supabase every 5s
    ▼
Student clicks "Cancel" on /account
    │
    ▼
process-cancellation (edge fn)
    │  Reads: subscription start date + completion %
    │  Calculates refund tier server-side
    │  Cancels Stripe subscription
    │  Issues Stripe refund (if applicable)
    │  Updates subscriptions table
    ▼
AccountPage shows confirmation + refund amount
```
