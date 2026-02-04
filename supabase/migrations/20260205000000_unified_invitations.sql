/*
  # Unified Invitation System

  Replaces the complex pending_org_admins + org_invite_links with a single,
  industry-standard invitation system.

  ## Two Usage Patterns:
  1. Add User by Email: email is set, only that email can accept
  2. Shareable Link: email is NULL, anyone can use the link

  ## Flow:
  1. Admin creates invitation (with or without email)
  2. System generates unique token/link
  3. User visits /join/:token
  4. If email set, must match. If not, any email works.
  5. User signs up/logs in → auto-assigned to org with role
*/

-- =============================================
-- INVITATIONS TABLE (replaces pending_org_admins + simplifies org_invite_links)
-- =============================================

CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Invitee details (NULL for generic links)
  email TEXT,
  first_name TEXT,
  last_name TEXT,

  -- Role to assign
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student')),

  -- Unique token for the invite link
  token TEXT UNIQUE NOT NULL,

  -- Usage limits
  max_uses INTEGER, -- NULL = unlimited (for generic links)
  use_count INTEGER NOT NULL DEFAULT 0,

  -- Expiration
  expires_at TIMESTAMPTZ,

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Tracking
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- For email-specific invites, ensure uniqueness per org
  UNIQUE(org_id, email) -- Only one active invite per email per org
);

-- Index for token lookup (primary access pattern)
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token) WHERE is_active = true;

-- Index for org listing
CREATE INDEX IF NOT EXISTS idx_invitations_org ON invitations(org_id, created_at DESC);

-- Index for email lookup
CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations(LOWER(email)) WHERE email IS NOT NULL;

-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Super admins can do everything
CREATE POLICY "Super admins full access to invitations"
  ON invitations FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('mkoepkeci@gmail.com', 'marty.koepke@practicalinformatics.org')
  );

-- Org admins can manage their org's invitations
CREATE POLICY "Org admins can manage their org invitations"
  ON invitations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = invitations.org_id
        AND org_members.user_id = auth.uid()
        AND org_members.role = 'admin'
    )
  );

-- Anyone can read active invitations by token (for accepting)
CREATE POLICY "Anyone can view invitation by token"
  ON invitations FOR SELECT
  TO authenticated
  USING (is_active = true);


-- =============================================
-- FUNCTION: Generate random invitation token
-- =============================================

CREATE OR REPLACE FUNCTION generate_invite_token()
RETURNS TEXT
LANGUAGE plpgsql AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$;


-- =============================================
-- FUNCTION: Create invitation
-- Used by Super Admin and Org Admin
-- =============================================

CREATE OR REPLACE FUNCTION create_invitation(
  p_org_id UUID,
  p_role TEXT DEFAULT 'student',
  p_email TEXT DEFAULT NULL,
  p_first_name TEXT DEFAULT NULL,
  p_last_name TEXT DEFAULT NULL,
  p_max_uses INTEGER DEFAULT NULL,
  p_expires_in_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  success BOOLEAN,
  invitation_id UUID,
  token TEXT,
  error_message TEXT
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_token TEXT;
  v_invitation_id UUID;
  v_expires_at TIMESTAMPTZ;
  v_clean_email TEXT;
BEGIN
  -- Validate role
  IF p_role NOT IN ('admin', 'student') THEN
    RETURN QUERY SELECT false::BOOLEAN, NULL::UUID, NULL::TEXT, 'Invalid role. Must be admin or student.'::TEXT;
    RETURN;
  END IF;

  -- Clean email
  v_clean_email := NULLIF(LOWER(TRIM(p_email)), '');

  -- If email provided, check for existing active invitation
  IF v_clean_email IS NOT NULL THEN
    -- Deactivate any existing invitation for this email in this org
    UPDATE invitations
    SET is_active = false
    WHERE org_id = p_org_id AND LOWER(email) = v_clean_email AND is_active = true;
  END IF;

  -- Generate unique token
  LOOP
    v_token := generate_invite_token();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM invitations WHERE token = v_token);
  END LOOP;

  -- Calculate expiration
  IF p_expires_in_days IS NOT NULL THEN
    v_expires_at := now() + (p_expires_in_days || ' days')::INTERVAL;
  END IF;

  -- Create the invitation
  INSERT INTO invitations (
    org_id,
    email,
    first_name,
    last_name,
    role,
    token,
    max_uses,
    expires_at,
    created_by
  ) VALUES (
    p_org_id,
    v_clean_email,
    NULLIF(TRIM(p_first_name), ''),
    NULLIF(TRIM(p_last_name), ''),
    p_role,
    v_token,
    CASE WHEN v_clean_email IS NOT NULL THEN 1 ELSE p_max_uses END, -- Email invites are single-use
    v_expires_at,
    auth.uid()
  )
  RETURNING id INTO v_invitation_id;

  RETURN QUERY SELECT true::BOOLEAN, v_invitation_id, v_token, NULL::TEXT;
END;
$$;


-- =============================================
-- FUNCTION: Get invitation details by token
-- Public function for the join page
-- =============================================

CREATE OR REPLACE FUNCTION get_invitation(p_token TEXT)
RETURNS TABLE (
  id UUID,
  org_id UUID,
  org_name TEXT,
  org_slug TEXT,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  role TEXT,
  is_valid BOOLEAN,
  error_message TEXT
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_inv RECORD;
  v_org RECORD;
BEGIN
  -- Find the invitation
  SELECT * INTO v_inv
  FROM invitations i
  WHERE i.token = p_token;

  IF NOT FOUND THEN
    RETURN QUERY SELECT
      NULL::UUID, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT,
      NULL::TEXT, NULL::TEXT, NULL::TEXT, false, 'Invalid invitation link'::TEXT;
    RETURN;
  END IF;

  -- Get org details
  SELECT * INTO v_org FROM organizations WHERE organizations.id = v_inv.org_id;

  -- Check if active
  IF NOT v_inv.is_active THEN
    RETURN QUERY SELECT
      v_inv.id, v_inv.org_id, v_org.name, v_org.slug, v_inv.email,
      v_inv.first_name, v_inv.last_name, v_inv.role, false, 'This invitation has been cancelled'::TEXT;
    RETURN;
  END IF;

  -- Check expiration
  IF v_inv.expires_at IS NOT NULL AND v_inv.expires_at < now() THEN
    RETURN QUERY SELECT
      v_inv.id, v_inv.org_id, v_org.name, v_org.slug, v_inv.email,
      v_inv.first_name, v_inv.last_name, v_inv.role, false, 'This invitation has expired'::TEXT;
    RETURN;
  END IF;

  -- Check max uses
  IF v_inv.max_uses IS NOT NULL AND v_inv.use_count >= v_inv.max_uses THEN
    RETURN QUERY SELECT
      v_inv.id, v_inv.org_id, v_org.name, v_org.slug, v_inv.email,
      v_inv.first_name, v_inv.last_name, v_inv.role, false, 'This invitation has reached its maximum uses'::TEXT;
    RETURN;
  END IF;

  -- Valid invitation
  RETURN QUERY SELECT
    v_inv.id, v_inv.org_id, v_org.name, v_org.slug, v_inv.email,
    v_inv.first_name, v_inv.last_name, v_inv.role, true, NULL::TEXT;
END;
$$;


-- =============================================
-- FUNCTION: Accept invitation
-- Called after user signs up/logs in
-- =============================================

CREATE OR REPLACE FUNCTION accept_invitation(p_token TEXT)
RETURNS TABLE (
  success BOOLEAN,
  org_id UUID,
  org_name TEXT,
  org_slug TEXT,
  role TEXT,
  error_message TEXT
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_inv RECORD;
  v_org RECORD;
  v_user_email TEXT;
  v_member_id UUID;
BEGIN
  -- Get current user's email
  SELECT email INTO v_user_email FROM auth.users WHERE id = auth.uid();

  IF v_user_email IS NULL THEN
    RETURN QUERY SELECT false::BOOLEAN, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, 'Not authenticated'::TEXT;
    RETURN;
  END IF;

  -- Find and validate the invitation
  SELECT * INTO v_inv
  FROM invitations i
  WHERE i.token = p_token AND i.is_active = true;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false::BOOLEAN, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, 'Invalid invitation link'::TEXT;
    RETURN;
  END IF;

  -- Get org
  SELECT * INTO v_org FROM organizations WHERE id = v_inv.org_id;

  -- Check expiration
  IF v_inv.expires_at IS NOT NULL AND v_inv.expires_at < now() THEN
    RETURN QUERY SELECT false::BOOLEAN, v_org.id, v_org.name, v_org.slug, v_inv.role, 'This invitation has expired'::TEXT;
    RETURN;
  END IF;

  -- Check max uses
  IF v_inv.max_uses IS NOT NULL AND v_inv.use_count >= v_inv.max_uses THEN
    RETURN QUERY SELECT false::BOOLEAN, v_org.id, v_org.name, v_org.slug, v_inv.role, 'This invitation has reached its maximum uses'::TEXT;
    RETURN;
  END IF;

  -- If email-specific invitation, verify email matches
  IF v_inv.email IS NOT NULL AND LOWER(v_inv.email) != LOWER(v_user_email) THEN
    RETURN QUERY SELECT false::BOOLEAN, v_org.id, v_org.name, v_org.slug, v_inv.role,
      'This invitation was sent to a different email address'::TEXT;
    RETURN;
  END IF;

  -- Remove any self-registered record (org_id IS NULL) for this user
  DELETE FROM org_members WHERE user_id = auth.uid() AND org_id IS NULL;

  -- Check if already a member
  SELECT id INTO v_member_id FROM org_members
  WHERE org_id = v_inv.org_id AND user_id = auth.uid();

  IF v_member_id IS NOT NULL THEN
    -- Already a member - upgrade to admin if this is an admin invite
    IF v_inv.role = 'admin' THEN
      UPDATE org_members SET role = 'admin' WHERE id = v_member_id;
    END IF;
  ELSE
    -- Add as new member
    INSERT INTO org_members (org_id, user_id, role, status)
    VALUES (v_inv.org_id, auth.uid(), v_inv.role, 'active');
  END IF;

  -- Update/create user profile with invitation name
  INSERT INTO user_profiles (user_id, first_name, last_name, display_name)
  VALUES (
    auth.uid(),
    v_inv.first_name,
    v_inv.last_name,
    NULLIF(TRIM(COALESCE(v_inv.first_name, '') || ' ' || COALESCE(v_inv.last_name, '')), '')
  )
  ON CONFLICT (user_id) DO UPDATE SET
    first_name = COALESCE(NULLIF(EXCLUDED.first_name, ''), user_profiles.first_name),
    last_name = COALESCE(NULLIF(EXCLUDED.last_name, ''), user_profiles.last_name),
    display_name = COALESCE(
      NULLIF(TRIM(COALESCE(EXCLUDED.first_name, '') || ' ' || COALESCE(EXCLUDED.last_name, '')), ''),
      user_profiles.display_name
    ),
    updated_at = now();

  -- Increment use count
  UPDATE invitations SET use_count = use_count + 1 WHERE id = v_inv.id;

  -- If email-specific (single use), deactivate
  IF v_inv.email IS NOT NULL THEN
    UPDATE invitations SET is_active = false WHERE id = v_inv.id;
  END IF;

  RETURN QUERY SELECT true::BOOLEAN, v_org.id, v_org.name, v_org.slug, v_inv.role, NULL::TEXT;
END;
$$;


-- =============================================
-- FUNCTION: Get org invitations
-- For admin dashboards
-- =============================================

CREATE OR REPLACE FUNCTION get_org_invitations(p_org_id UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  role TEXT,
  token TEXT,
  max_uses INTEGER,
  use_count INTEGER,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.email,
    i.first_name,
    i.last_name,
    i.role,
    i.token,
    i.max_uses,
    i.use_count,
    i.expires_at,
    i.is_active,
    i.created_at
  FROM invitations i
  WHERE i.org_id = p_org_id
  ORDER BY i.created_at DESC;
END;
$$;


-- =============================================
-- FUNCTION: Cancel invitation
-- =============================================

CREATE OR REPLACE FUNCTION cancel_invitation(p_invitation_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE invitations SET is_active = false WHERE id = p_invitation_id;
  RETURN FOUND;
END;
$$;


-- =============================================
-- FUNCTION: Ensure user membership (simplified)
-- Called on login to get/create membership
-- =============================================

CREATE OR REPLACE FUNCTION ensure_user_membership(p_user_id UUID, p_user_email TEXT)
RETURNS TABLE (
  role TEXT,
  org_id UUID,
  org_slug TEXT,
  org_name TEXT,
  is_self_registered BOOLEAN
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_member RECORD;
BEGIN
  -- Check existing membership
  SELECT om.*, o.slug as org_slug, o.name as org_name
  INTO v_member
  FROM org_members om
  LEFT JOIN organizations o ON o.id = om.org_id
  WHERE om.user_id = p_user_id
  LIMIT 1;

  IF FOUND THEN
    RETURN QUERY SELECT
      v_member.role,
      v_member.org_id,
      v_member.org_slug,
      v_member.org_name,
      (v_member.org_id IS NULL)::BOOLEAN;
    RETURN;
  END IF;

  -- No membership - create self-registered student
  INSERT INTO org_members (org_id, user_id, role, status)
  VALUES (NULL, p_user_id, 'student', 'active');

  RETURN QUERY SELECT 'student'::TEXT, NULL::UUID, NULL::TEXT, NULL::TEXT, true;
END;
$$;


-- =============================================
-- GRANT PERMISSIONS
-- =============================================

GRANT EXECUTE ON FUNCTION generate_invite_token() TO authenticated;
GRANT EXECUTE ON FUNCTION create_invitation(UUID, TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_invitation(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_invitation(TEXT) TO anon; -- Allow checking before login
GRANT EXECUTE ON FUNCTION accept_invitation(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_org_invitations(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_invitation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION ensure_user_membership(UUID, TEXT) TO authenticated;
