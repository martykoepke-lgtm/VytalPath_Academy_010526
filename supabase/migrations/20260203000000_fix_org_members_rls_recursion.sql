/*
  # Fix Infinite Recursion in org_members RLS Policies

  ## Problem
  The "Org admins can manage members" policy queries org_members to check admin status,
  but since it applies TO org_members, it causes infinite recursion.

  ## Solution
  1. Create a SECURITY DEFINER function to check admin status (bypasses RLS)
  2. Replace the recursive policy with one that uses the function
  3. Add explicit policies for each operation type
*/

-- =============================================
-- HELPER FUNCTION (SECURITY DEFINER bypasses RLS)
-- =============================================

-- Function to check if a user is an admin of an organization
CREATE OR REPLACE FUNCTION is_org_admin(check_org_id UUID, check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM org_members
    WHERE org_id = check_org_id
      AND user_id = check_user_id
      AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- DROP OLD PROBLEMATIC POLICIES
-- =============================================

DROP POLICY IF EXISTS "Org admins can manage members" ON org_members;
DROP POLICY IF EXISTS "Users can view own membership" ON org_members;
DROP POLICY IF EXISTS "Users can insert own membership via invite" ON org_members;

-- =============================================
-- NEW NON-RECURSIVE POLICIES
-- =============================================

-- Admins can SELECT all members in their org
CREATE POLICY "Org admins can view all members"
  ON org_members FOR SELECT
  TO authenticated
  USING (
    is_org_admin(org_id, auth.uid())
    OR user_id = auth.uid()  -- Users can also see their own membership
  );

-- Admins can UPDATE members in their org
CREATE POLICY "Org admins can update members"
  ON org_members FOR UPDATE
  TO authenticated
  USING (is_org_admin(org_id, auth.uid()))
  WITH CHECK (is_org_admin(org_id, auth.uid()));

-- Admins can DELETE members from their org
CREATE POLICY "Org admins can delete members"
  ON org_members FOR DELETE
  TO authenticated
  USING (is_org_admin(org_id, auth.uid()));

-- Users can insert their own membership (for invite links)
-- Admins are added via trigger with SECURITY DEFINER, bypassing RLS
CREATE POLICY "Users can join via invite"
  ON org_members FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- =============================================
-- FIX ORGANIZATIONS POLICIES TOO
-- =============================================

-- Drop old policies that might have similar issues
DROP POLICY IF EXISTS "Org admins can manage organization" ON organizations;
DROP POLICY IF EXISTS "Org members can view their organization" ON organizations;
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON organizations;

-- Super admins and org creators can see all orgs they created
CREATE POLICY "Users can view orgs they created"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid()
    OR is_org_admin(id, auth.uid())
  );

-- Users can create organizations
CREATE POLICY "Users can create organizations"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Org admins can update their organization
CREATE POLICY "Org admins can update organization"
  ON organizations FOR UPDATE
  TO authenticated
  USING (is_org_admin(id, auth.uid()))
  WITH CHECK (is_org_admin(id, auth.uid()));

-- Org admins can delete their organization
CREATE POLICY "Org admins can delete organization"
  ON organizations FOR DELETE
  TO authenticated
  USING (is_org_admin(id, auth.uid()));

-- =============================================
-- FIX INVITE LINKS POLICIES
-- =============================================

DROP POLICY IF EXISTS "Org admins can manage invite links" ON org_invite_links;
DROP POLICY IF EXISTS "Anyone can validate active invite links" ON org_invite_links;

-- Admins can view invite links for their org
CREATE POLICY "Org admins can view invite links"
  ON org_invite_links FOR SELECT
  TO authenticated
  USING (is_org_admin(org_id, auth.uid()));

-- Public can validate active invite links (for /join/[code])
CREATE POLICY "Anyone can validate active invite links"
  ON org_invite_links FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND (max_uses IS NULL OR use_count < max_uses)
  );

-- Admins can create invite links
CREATE POLICY "Org admins can create invite links"
  ON org_invite_links FOR INSERT
  TO authenticated
  WITH CHECK (is_org_admin(org_id, auth.uid()));

-- Admins can update invite links
CREATE POLICY "Org admins can update invite links"
  ON org_invite_links FOR UPDATE
  TO authenticated
  USING (is_org_admin(org_id, auth.uid()))
  WITH CHECK (is_org_admin(org_id, auth.uid()));

-- Admins can delete invite links
CREATE POLICY "Org admins can delete invite links"
  ON org_invite_links FOR DELETE
  TO authenticated
  USING (is_org_admin(org_id, auth.uid()));
