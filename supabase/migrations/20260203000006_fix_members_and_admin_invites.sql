/*
  # Fix Member Visibility and Add Admin Invite Links

  1. Create function to get org members (bypasses RLS)
  2. Add 'role' field to invite links for admin invites
  3. Update use_invite_link to handle admin role
*/

-- =============================================
-- FUNCTION: Get org members with details
-- =============================================

CREATE OR REPLACE FUNCTION get_org_members(p_org_id UUID)
RETURNS TABLE (
  id UUID,
  org_id UUID,
  user_id UUID,
  role TEXT,
  status TEXT,
  joined_at TIMESTAMPTZ,
  joined_via UUID,
  first_name TEXT,
  last_name TEXT,
  display_name TEXT,
  invite_first_name TEXT,
  invite_last_name TEXT,
  invite_label TEXT
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    om.id,
    om.org_id,
    om.user_id,
    om.role,
    om.status,
    om.joined_at,
    om.joined_via,
    up.first_name,
    up.last_name,
    up.display_name,
    oil.first_name as invite_first_name,
    oil.last_name as invite_last_name,
    oil.label as invite_label
  FROM org_members om
  LEFT JOIN user_profiles up ON up.user_id = om.user_id
  LEFT JOIN org_invite_links oil ON oil.id = om.joined_via
  WHERE om.org_id = p_org_id
  ORDER BY om.joined_at DESC;
END;
$$;

-- =============================================
-- ADD ROLE FIELD TO INVITE LINKS
-- =============================================

ALTER TABLE org_invite_links
ADD COLUMN IF NOT EXISTS invite_role TEXT NOT NULL DEFAULT 'student'
CHECK (invite_role IN ('admin', 'student'));

-- =============================================
-- UPDATE use_invite_link TO HANDLE ADMIN ROLE
-- =============================================

DROP FUNCTION IF EXISTS use_invite_link(TEXT, UUID);

CREATE FUNCTION use_invite_link(invite_code TEXT, joining_user_id UUID)
RETURNS TABLE (success BOOLEAN, org_id UUID, org_name TEXT, error_message TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_link RECORD;
  v_org RECORD;
BEGIN
  -- Get invite link
  SELECT * INTO v_link FROM org_invite_links
  WHERE code = invite_code AND is_active = true;

  IF v_link IS NULL THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Invalid invite link'::TEXT;
    RETURN;
  END IF;

  -- Check expiration
  IF v_link.expires_at IS NOT NULL AND v_link.expires_at < now() THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'This invite link has expired'::TEXT;
    RETURN;
  END IF;

  -- Check max uses
  IF v_link.max_uses IS NOT NULL AND v_link.use_count >= v_link.max_uses THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'This invite link has reached its maximum uses'::TEXT;
    RETURN;
  END IF;

  -- Get org
  SELECT * INTO v_org FROM organizations WHERE id = v_link.org_id;

  -- Check existing membership
  IF EXISTS (SELECT 1 FROM org_members WHERE org_members.org_id = v_link.org_id AND org_members.user_id = joining_user_id) THEN
    -- Update role if this is an admin invite and they're currently a student
    IF v_link.invite_role = 'admin' THEN
      UPDATE org_members
      SET role = 'admin'
      WHERE org_members.org_id = v_link.org_id
        AND org_members.user_id = joining_user_id
        AND role = 'student';
    END IF;
    RETURN QUERY SELECT true, v_org.id, v_org.name, 'Already a member'::TEXT;
    RETURN;
  END IF;

  -- Add member with the role from the invite link
  INSERT INTO org_members (org_id, user_id, role, joined_via, status)
  VALUES (v_link.org_id, joining_user_id, v_link.invite_role, v_link.id, 'active');

  -- Create profile
  INSERT INTO user_profiles (user_id, first_name, last_name, display_name)
  VALUES (
    joining_user_id,
    v_link.first_name,
    v_link.last_name,
    TRIM(COALESCE(v_link.first_name, '') || ' ' || COALESCE(v_link.last_name, ''))
  )
  ON CONFLICT (user_id) DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, user_profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, user_profiles.last_name),
    display_name = TRIM(COALESCE(EXCLUDED.first_name, user_profiles.first_name, '') || ' ' || COALESCE(EXCLUDED.last_name, user_profiles.last_name, '')),
    updated_at = now();

  -- Increment use count
  UPDATE org_invite_links SET use_count = use_count + 1 WHERE id = v_link.id;

  RETURN QUERY SELECT true, v_org.id, v_org.name, NULL::TEXT;
END;
$$;

-- =============================================
-- FUNCTION: Get user email by ID (for display)
-- =============================================

CREATE OR REPLACE FUNCTION get_user_email_by_id(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_email TEXT;
BEGIN
  SELECT email INTO v_email
  FROM auth.users
  WHERE id = p_user_id;

  RETURN v_email;
END;
$$;
