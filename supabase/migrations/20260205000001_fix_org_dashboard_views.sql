-- Fix OrgAdminDashboard to show admins and completed invitations
-- Run this migration after 20260205000000_unified_invitations.sql

-- =============================================
-- 1. Get Org Admins - SECURITY DEFINER to bypass RLS
-- =============================================
DROP FUNCTION IF EXISTS get_org_admins(UUID);

CREATE OR REPLACE FUNCTION get_org_admins(p_org_id UUID)
RETURNS TABLE (
  member_id UUID,
  user_id UUID,
  user_email TEXT,
  first_name TEXT,
  last_name TEXT,
  display_name TEXT,
  role TEXT,
  status TEXT,
  joined_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check caller has access (is admin of this org or super admin)
  IF NOT EXISTS (
    SELECT 1 FROM org_members
    WHERE org_id = p_org_id
    AND user_id = auth.uid()
    AND role = 'admin'
  ) THEN
    -- Allow super admins (will need to check in app layer)
    -- For now, return empty if not org admin
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    om.id AS member_id,
    om.user_id,
    au.email AS user_email,
    au.raw_user_meta_data->>'first_name' AS first_name,
    au.raw_user_meta_data->>'last_name' AS last_name,
    COALESCE(
      au.raw_user_meta_data->>'full_name',
      CONCAT_WS(' ', au.raw_user_meta_data->>'first_name', au.raw_user_meta_data->>'last_name'),
      au.email
    ) AS display_name,
    om.role::TEXT,
    om.status::TEXT,
    om.joined_at
  FROM org_members om
  LEFT JOIN auth.users au ON au.id = om.user_id
  WHERE om.org_id = p_org_id
    AND om.role = 'admin'
  ORDER BY om.joined_at ASC;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_org_admins(UUID) TO authenticated;

-- =============================================
-- 2. Update get_org_invitations to include completion info
-- =============================================
DROP FUNCTION IF EXISTS get_org_invitations(UUID);

CREATE OR REPLACE FUNCTION get_org_invitations(p_org_id UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  role TEXT,
  token TEXT,
  max_uses INT,
  use_count INT,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  -- New fields for completion tracking
  status TEXT, -- 'pending', 'accepted', 'expired', 'cancelled'
  accepted_by_email TEXT,
  accepted_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check caller has access
  IF NOT EXISTS (
    SELECT 1 FROM org_members
    WHERE org_id = p_org_id
    AND user_id = auth.uid()
    AND role = 'admin'
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    inv.id,
    inv.email,
    inv.first_name,
    inv.last_name,
    inv.role::TEXT,
    inv.token,
    inv.max_uses,
    inv.use_count,
    inv.expires_at,
    inv.is_active,
    inv.created_at,
    -- Computed status
    CASE
      WHEN NOT inv.is_active AND inv.use_count > 0 THEN 'accepted'
      WHEN NOT inv.is_active THEN 'cancelled'
      WHEN inv.expires_at IS NOT NULL AND inv.expires_at < NOW() THEN 'expired'
      WHEN inv.max_uses IS NOT NULL AND inv.use_count >= inv.max_uses THEN 'accepted'
      ELSE 'pending'
    END AS status,
    -- Get email of user who accepted (if single-use invite)
    (
      SELECT au.email
      FROM org_members om
      JOIN auth.users au ON au.id = om.user_id
      WHERE om.joined_via = inv.id
      LIMIT 1
    ) AS accepted_by_email,
    -- Get join time
    (
      SELECT om.joined_at
      FROM org_members om
      WHERE om.joined_via = inv.id
      LIMIT 1
    ) AS accepted_at
  FROM invitations inv
  WHERE inv.org_id = p_org_id
  ORDER BY
    CASE WHEN inv.is_active THEN 0 ELSE 1 END,
    inv.created_at DESC;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_org_invitations(UUID) TO authenticated;

-- =============================================
-- 3. Update check_org_admin to also allow super admin check
-- =============================================
-- Note: Super admin is checked in app layer via isSuperAdmin()
-- This function already works correctly
