-- ============================================================================
-- Stripe Subscription Tables for VytalPath Academy
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table: stripe_customers
-- Maps Supabase users/orgs to Stripe customer IDs
-- ----------------------------------------------------------------------------
CREATE TABLE stripe_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Either user_id OR org_id must be set, not both
  CONSTRAINT stripe_customers_entity_check CHECK (
    (user_id IS NOT NULL AND org_id IS NULL) OR
    (user_id IS NULL AND org_id IS NOT NULL)
  )
);

-- Unique indexes to ensure one Stripe customer per user/org
CREATE UNIQUE INDEX idx_stripe_customers_user ON stripe_customers(user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX idx_stripe_customers_org ON stripe_customers(org_id) WHERE org_id IS NOT NULL;
CREATE INDEX idx_stripe_customers_stripe_id ON stripe_customers(stripe_customer_id);

-- ----------------------------------------------------------------------------
-- Table: subscriptions
-- Individual user subscriptions
-- ----------------------------------------------------------------------------
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid', 'paused')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for subscriptions
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_sub ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period_end ON subscriptions(current_period_end);

-- ----------------------------------------------------------------------------
-- Table: org_subscriptions
-- Organization seat-based subscriptions
-- ----------------------------------------------------------------------------
CREATE TABLE org_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid', 'paused')),
  seat_count INTEGER NOT NULL DEFAULT 0,
  current_tier TEXT NOT NULL CHECK (current_tier IN ('starter', 'team', 'clinic', 'enterprise')),
  price_per_seat_cents INTEGER NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for org_subscriptions
CREATE INDEX idx_org_subscriptions_org ON org_subscriptions(org_id);
CREATE INDEX idx_org_subscriptions_stripe_sub ON org_subscriptions(stripe_subscription_id);
CREATE INDEX idx_org_subscriptions_status ON org_subscriptions(status);

-- ----------------------------------------------------------------------------
-- Function: has_active_access
-- Returns true if user has an active individual subscription OR
-- is a member of an organization with an active subscription
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION has_active_access(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_has_individual_sub BOOLEAN;
  v_has_org_access BOOLEAN;
BEGIN
  -- Check for active individual subscription
  SELECT EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = p_user_id
      AND status = 'active'
      AND current_period_end > now()
  ) INTO v_has_individual_sub;

  IF v_has_individual_sub THEN
    RETURN true;
  END IF;

  -- Check for active org membership with active org subscription
  SELECT EXISTS (
    SELECT 1 FROM org_members om
    JOIN org_subscriptions os ON os.org_id = om.org_id
    WHERE om.user_id = p_user_id
      AND om.status = 'active'
      AND os.status = 'active'
      AND os.current_period_end > now()
  ) INTO v_has_org_access;

  RETURN v_has_org_access;
END;
$$;

-- ----------------------------------------------------------------------------
-- Function: get_user_subscription_status
-- Returns detailed subscription status for a user
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_subscription_status(p_user_id UUID)
RETURNS TABLE (
  has_access BOOLEAN,
  access_type TEXT,
  subscription_status TEXT,
  current_period_end TIMESTAMPTZ,
  org_name TEXT,
  cancel_at_period_end BOOLEAN
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Check individual subscription first
  RETURN QUERY
  SELECT
    true AS has_access,
    'individual'::TEXT AS access_type,
    s.status AS subscription_status,
    s.current_period_end,
    NULL::TEXT AS org_name,
    s.cancel_at_period_end
  FROM subscriptions s
  WHERE s.user_id = p_user_id
    AND s.status = 'active'
    AND s.current_period_end > now()
  LIMIT 1;

  IF FOUND THEN RETURN; END IF;

  -- Check org subscription
  RETURN QUERY
  SELECT
    true AS has_access,
    'organization'::TEXT AS access_type,
    os.status AS subscription_status,
    os.current_period_end,
    o.name AS org_name,
    os.cancel_at_period_end
  FROM org_members om
  JOIN org_subscriptions os ON os.org_id = om.org_id
  JOIN organizations o ON o.id = om.org_id
  WHERE om.user_id = p_user_id
    AND om.status = 'active'
    AND os.status = 'active'
    AND os.current_period_end > now()
  LIMIT 1;

  IF FOUND THEN RETURN; END IF;

  -- No active access
  RETURN QUERY SELECT
    false AS has_access,
    'none'::TEXT AS access_type,
    NULL::TEXT AS subscription_status,
    NULL::TIMESTAMPTZ AS current_period_end,
    NULL::TEXT AS org_name,
    false AS cancel_at_period_end;
END;
$$;

-- ----------------------------------------------------------------------------
-- Function: get_org_seat_tier
-- Returns the pricing tier based on seat count
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_org_seat_tier(p_seat_count INTEGER)
RETURNS TEXT
LANGUAGE plpgsql AS $$
BEGIN
  IF p_seat_count <= 5 THEN
    RETURN 'starter';
  ELSIF p_seat_count <= 15 THEN
    RETURN 'team';
  ELSIF p_seat_count <= 50 THEN
    RETURN 'clinic';
  ELSE
    RETURN 'enterprise';
  END IF;
END;
$$;

-- ----------------------------------------------------------------------------
-- Function: get_org_price_per_seat
-- Returns the price per seat in cents based on seat count
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_org_price_per_seat(p_seat_count INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql AS $$
BEGIN
  IF p_seat_count <= 5 THEN
    RETURN 26700; -- $267
  ELSIF p_seat_count <= 15 THEN
    RETURN 19900; -- $199
  ELSIF p_seat_count <= 50 THEN
    RETURN 14900; -- $149
  ELSE
    RETURN 9900; -- $99
  END IF;
END;
$$;

-- ----------------------------------------------------------------------------
-- RLS Policies
-- ----------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_subscriptions ENABLE ROW LEVEL SECURITY;

-- stripe_customers policies
CREATE POLICY "Users can view own stripe customer"
  ON stripe_customers FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Org admins can view org stripe customer"
  ON stripe_customers FOR SELECT TO authenticated
  USING (
    org_id IN (
      SELECT om.org_id FROM org_members om
      WHERE om.user_id = auth.uid() AND om.role = 'admin'
    )
  );

-- subscriptions policies
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- org_subscriptions policies
CREATE POLICY "Org admins can view org subscription"
  ON org_subscriptions FOR SELECT TO authenticated
  USING (
    org_id IN (
      SELECT om.org_id FROM org_members om
      WHERE om.user_id = auth.uid() AND om.role = 'admin'
    )
  );

CREATE POLICY "Org members can view org subscription status"
  ON org_subscriptions FOR SELECT TO authenticated
  USING (
    org_id IN (
      SELECT om.org_id FROM org_members om
      WHERE om.user_id = auth.uid()
    )
  );

-- Service role has full access (for webhooks)
CREATE POLICY "Service role full access to stripe_customers"
  ON stripe_customers FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access to subscriptions"
  ON subscriptions FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access to org_subscriptions"
  ON org_subscriptions FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- Triggers for updated_at
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stripe_customers_updated_at
  BEFORE UPDATE ON stripe_customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_org_subscriptions_updated_at
  BEFORE UPDATE ON org_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
