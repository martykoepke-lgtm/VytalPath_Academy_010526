/*
  # Fix Organization Visibility for Super Admins

  The RLS policies on organizations only allow users to see orgs where they're members.
  Super admins (determined by email) need to see ALL organizations.

  This migration:
  1. Creates a SECURITY DEFINER function to get all orgs (bypasses RLS)
  2. Adds a policy allowing org creators to see their org (as a fallback)
  3. Ensures the org creator trigger works correctly
*/

-- =============================================
-- FUNCTION: Get all organizations (for super admins)
-- =============================================

CREATE OR REPLACE FUNCTION get_all_organizations()
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  created_by UUID,
  member_count BIGINT,
  active_links BIGINT
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    o.id,
    o.name,
    o.slug,
    o.created_at,
    o.updated_at,
    o.created_by,
    (SELECT COUNT(*) FROM org_members om WHERE om.org_id = o.id) as member_count,
    (SELECT COUNT(*) FROM org_invite_links oil WHERE oil.org_id = o.id AND oil.is_active = true) as active_links
  FROM organizations o
  ORDER BY o.created_at DESC;
END;
$$;

-- =============================================
-- POLICY: Org creators can always see their org
-- =============================================

-- Drop if exists to avoid conflicts
DROP POLICY IF EXISTS "Org creators can view their organization" ON organizations;

-- Creators should always be able to see orgs they created
CREATE POLICY "Org creators can view their organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

-- =============================================
-- ENSURE TRIGGER WORKS
-- =============================================

-- Recreate the trigger function with explicit SECURITY DEFINER
-- This ensures it bypasses RLS when adding the creator as admin
CREATE OR REPLACE FUNCTION add_org_creator_as_admin()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert the creator as admin, bypassing RLS
  INSERT INTO org_members (org_id, user_id, role, status)
  VALUES (NEW.id, NEW.created_by, 'admin', 'active')
  ON CONFLICT (org_id, user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_org_created ON organizations;
CREATE TRIGGER on_org_created
  AFTER INSERT ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION add_org_creator_as_admin();

-- =============================================
-- FIX: Add missing org_members for existing orgs
-- =============================================

-- If any orgs exist without their creator as admin, add them
INSERT INTO org_members (org_id, user_id, role, status)
SELECT o.id, o.created_by, 'admin', 'active'
FROM organizations o
WHERE o.created_by IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM org_members om
    WHERE om.org_id = o.id AND om.user_id = o.created_by
  )
ON CONFLICT (org_id, user_id) DO NOTHING;

-- =============================================
-- FUNCTION: Look up user by email (for adding org admins)
-- =============================================

CREATE OR REPLACE FUNCTION get_user_by_email(user_email TEXT)
RETURNS TABLE (id UUID, email TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT au.id, au.email::TEXT
  FROM auth.users au
  WHERE au.email = user_email;
END;
$$;
