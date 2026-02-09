-- ============================================================================
-- Add completion percentage tracking + refund status views
-- ============================================================================

-- Add completion tracking columns to subscriptions table
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS completion_percentage INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_progress_sync TIMESTAMPTZ;

-- ----------------------------------------------------------------------------
-- Function: sync_completion_percentage
-- Called by the client to persist a student's current completion %.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION sync_completion_percentage(
  p_user_id UUID,
  p_completion_percentage INTEGER
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE subscriptions
  SET completion_percentage = p_completion_percentage,
      last_progress_sync = now()
  WHERE user_id = p_user_id
    AND status = 'active';
END;
$$;

-- ----------------------------------------------------------------------------
-- Function: get_user_subscription_status (updated)
-- Now also returns current_period_start
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_subscription_status(p_user_id UUID)
RETURNS TABLE (
  has_access BOOLEAN,
  access_type TEXT,
  subscription_status TEXT,
  current_period_start TIMESTAMPTZ,
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
    s.current_period_start,
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
    os.current_period_start,
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
    NULL::TIMESTAMPTZ AS current_period_start,
    NULL::TIMESTAMPTZ AS current_period_end,
    NULL::TEXT AS org_name,
    false AS cancel_at_period_end;
END;
$$;

-- ----------------------------------------------------------------------------
-- Function: get_students_refund_status
-- Returns all active individual subscribers with data needed for refund views.
-- Only callable by service_role (or super admin via edge function).
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_students_refund_status()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  display_name TEXT,
  subscription_status TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN,
  completion_percentage INTEGER,
  last_progress_sync TIMESTAMPTZ,
  days_enrolled INTEGER,
  org_name TEXT
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  -- Individual subscribers
  SELECT
    s.user_id,
    u.email::TEXT,
    COALESCE(up.display_name, up.first_name || ' ' || up.last_name, u.email::TEXT) AS display_name,
    s.status AS subscription_status,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    s.completion_percentage,
    s.last_progress_sync,
    EXTRACT(DAY FROM now() - s.current_period_start)::INTEGER AS days_enrolled,
    NULL::TEXT AS org_name
  FROM subscriptions s
  JOIN auth.users u ON u.id = s.user_id
  LEFT JOIN user_profiles up ON up.user_id = s.user_id
  WHERE s.status IN ('active', 'past_due')

  UNION ALL

  -- Org members with active org subscriptions
  SELECT
    om.user_id,
    u.email::TEXT,
    COALESCE(up.display_name, up.first_name || ' ' || up.last_name, u.email::TEXT) AS display_name,
    os.status AS subscription_status,
    os.current_period_start,
    os.current_period_end,
    os.cancel_at_period_end,
    0 AS completion_percentage,
    NULL::TIMESTAMPTZ AS last_progress_sync,
    EXTRACT(DAY FROM now() - os.current_period_start)::INTEGER AS days_enrolled,
    o.name AS org_name
  FROM org_members om
  JOIN org_subscriptions os ON os.org_id = om.org_id
  JOIN organizations o ON o.id = om.org_id
  JOIN auth.users u ON u.id = om.user_id
  LEFT JOIN user_profiles up ON up.user_id = om.user_id
  WHERE om.status = 'active'
    AND os.status IN ('active', 'past_due')

  ORDER BY current_period_start DESC;
END;
$$;
