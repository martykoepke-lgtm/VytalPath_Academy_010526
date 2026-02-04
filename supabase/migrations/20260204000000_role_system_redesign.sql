/*
  # Role System Redesign

  ## Overview
  Supports three distinct roles: Super Admin, Org Admin, and Student.

  ## Changes
  1. Create `pending_org_admins` table for direct admin adds by email
  2. Allow NULL org_id in org_members for self-registered students
  3. Create trigger to auto-assign roles on signup
  4. Create helper functions for the new system
  5. Fix the use_invite_link function
*/

-- =============================================
-- PENDING ORG ADMINS TABLE
-- For Super Admin to add Org Admins by email
-- =============================================

CREATE TABLE IF NOT EXISTS pending_org_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(org_id, email)
);

-- Index for email lookup during signup
CREATE INDEX IF NOT EXISTS idx_pending_org_admins_email ON pending_org_admins(LOWER(email));

-- RLS for pending_org_admins
ALTER TABLE pending_org_admins ENABLE ROW LEVEL SECURITY;

-- Super admins can manage pending admins
CREATE POLICY "Super admins can manage pending admins"
  ON pending_org_admins FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('mkoepkeci@gmail.com', 'marty.koepke@practicalinformatics.org')
  );

-- =============================================
-- MODIFY ORG_MEMBERS FOR SELF-REGISTERED
-- Allow NULL org_id for self-registered students
-- =============================================

-- Drop the NOT NULL constraint on org_id
ALTER TABLE org_members ALTER COLUMN org_id DROP NOT NULL;

-- Add constraint: only students can be self-registered (org_id IS NULL)
-- First drop if exists to avoid errors
DO $$ BEGIN
  ALTER TABLE org_members DROP CONSTRAINT IF EXISTS valid_member_state;
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

ALTER TABLE org_members
ADD CONSTRAINT valid_member_state CHECK (
  (org_id IS NOT NULL) OR
  (org_id IS NULL AND role = 'student')
);

-- Index for finding self-registered students
CREATE INDEX IF NOT EXISTS idx_org_members_self_registered
ON org_members(user_id) WHERE org_id IS NULL;

-- =============================================
-- FUNCTION: Handle new user registration
-- Auto-assigns role based on pending_org_admins or creates self-registered student
-- =============================================

CREATE OR REPLACE FUNCTION handle_new_user_registration()
RETURNS TRIGGER AS $$
DECLARE
  v_pending RECORD;
BEGIN
  -- Check if this email has a pending org admin invitation
  SELECT * INTO v_pending
  FROM pending_org_admins
  WHERE LOWER(email) = LOWER(NEW.email)
  LIMIT 1;

  IF FOUND THEN
    -- Add as org admin
    INSERT INTO org_members (org_id, user_id, role, status)
    VALUES (v_pending.org_id, NEW.id, 'admin', 'active')
    ON CONFLICT (org_id, user_id) DO UPDATE SET role = 'admin';

    -- Create user profile
    INSERT INTO user_profiles (user_id, first_name, last_name, display_name)
    VALUES (
      NEW.id,
      v_pending.first_name,
      v_pending.last_name,
      TRIM(COALESCE(v_pending.first_name, '') || ' ' || COALESCE(v_pending.last_name, ''))
    )
    ON CONFLICT (user_id) DO UPDATE SET
      first_name = COALESCE(EXCLUDED.first_name, user_profiles.first_name),
      last_name = COALESCE(EXCLUDED.last_name, user_profiles.last_name),
      display_name = NULLIF(TRIM(COALESCE(EXCLUDED.first_name, '') || ' ' || COALESCE(EXCLUDED.last_name, '')), '');

    -- Remove from pending
    DELETE FROM pending_org_admins WHERE id = v_pending.id;

    RETURN NEW;
  END IF;

  -- No pending admin invitation - check if they have any membership already
  IF NOT EXISTS (SELECT 1 FROM org_members WHERE user_id = NEW.id) THEN
    -- Create self-registered student record
    INSERT INTO org_members (org_id, user_id, role, status)
    VALUES (NULL, NEW.id, 'student', 'active');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: The trigger on auth.users requires superuser access
-- This is handled by Supabase automatically via the auth schema
-- We'll handle this in application code instead (in AuthContext)

-- =============================================
-- FUNCTION: Get self-registered students
-- For Super Admin dashboard
-- =============================================

CREATE OR REPLACE FUNCTION get_self_registered_students()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  status TEXT,
  joined_at TIMESTAMPTZ,
  user_email TEXT,
  first_name TEXT,
  last_name TEXT,
  display_name TEXT
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    om.id,
    om.user_id,
    om.status,
    om.joined_at,
    u.email as user_email,
    up.first_name,
    up.last_name,
    up.display_name
  FROM org_members om
  LEFT JOIN auth.users u ON u.id = om.user_id
  LEFT JOIN user_profiles up ON up.user_id = om.user_id
  WHERE om.org_id IS NULL AND om.role = 'student'
  ORDER BY om.joined_at DESC;
END;
$$;

-- =============================================
-- FUNCTION: Add Org Admin by email
-- For Super Admin to directly add admins
-- =============================================

CREATE OR REPLACE FUNCTION add_org_admin_by_email(
  p_org_id UUID,
  p_first_name TEXT,
  p_last_name TEXT,
  p_email TEXT
)
RETURNS TABLE (
  success BOOLEAN,
  admin_id UUID,
  user_exists BOOLEAN,
  error_message TEXT
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_user_id UUID;
  v_existing_member UUID;
BEGIN
  -- Validate email
  IF p_email IS NULL OR TRIM(p_email) = '' THEN
    RETURN QUERY SELECT false::BOOLEAN, NULL::UUID, false::BOOLEAN, 'Email is required'::TEXT;
    RETURN;
  END IF;

  -- Find user by email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE LOWER(email) = LOWER(TRIM(p_email));

  IF v_user_id IS NOT NULL THEN
    -- User exists, check if already a member of this org
    SELECT id INTO v_existing_member
    FROM org_members
    WHERE org_id = p_org_id AND user_id = v_user_id;

    IF v_existing_member IS NOT NULL THEN
      -- Update to admin role if they're a student
      UPDATE org_members
      SET role = 'admin'
      WHERE id = v_existing_member AND role = 'student';

      RETURN QUERY SELECT true::BOOLEAN, v_existing_member, true::BOOLEAN, 'User upgraded to admin'::TEXT;
      RETURN;
    END IF;

    -- Add as admin
    INSERT INTO org_members (org_id, user_id, role, status)
    VALUES (p_org_id, v_user_id, 'admin', 'active')
    RETURNING id INTO v_existing_member;

    -- Create/update profile
    INSERT INTO user_profiles (user_id, first_name, last_name, display_name)
    VALUES (
      v_user_id,
      NULLIF(TRIM(p_first_name), ''),
      NULLIF(TRIM(p_last_name), ''),
      NULLIF(TRIM(COALESCE(p_first_name, '') || ' ' || COALESCE(p_last_name, '')), '')
    )
    ON CONFLICT (user_id) DO UPDATE SET
      first_name = COALESCE(NULLIF(TRIM(EXCLUDED.first_name), ''), user_profiles.first_name),
      last_name = COALESCE(NULLIF(TRIM(EXCLUDED.last_name), ''), user_profiles.last_name),
      updated_at = now();

    RETURN QUERY SELECT true::BOOLEAN, v_existing_member, true::BOOLEAN, NULL::TEXT;
    RETURN;
  END IF;

  -- User doesn't exist - add to pending_org_admins
  INSERT INTO pending_org_admins (org_id, email, first_name, last_name, created_by)
  VALUES (
    p_org_id,
    LOWER(TRIM(p_email)),
    NULLIF(TRIM(p_first_name), ''),
    NULLIF(TRIM(p_last_name), ''),
    auth.uid()
  )
  ON CONFLICT (org_id, email) DO UPDATE SET
    first_name = COALESCE(NULLIF(TRIM(EXCLUDED.first_name), ''), pending_org_admins.first_name),
    last_name = COALESCE(NULLIF(TRIM(EXCLUDED.last_name), ''), pending_org_admins.last_name);

  RETURN QUERY SELECT true::BOOLEAN, NULL::UUID, false::BOOLEAN, 'Pending admin created - will activate on signup'::TEXT;
END;
$$;

-- =============================================
-- FUNCTION: Get pending org admins
-- =============================================

CREATE OR REPLACE FUNCTION get_pending_org_admins(p_org_id UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    poa.id,
    poa.email,
    poa.first_name,
    poa.last_name,
    poa.created_at
  FROM pending_org_admins poa
  WHERE poa.org_id = p_org_id
  ORDER BY poa.created_at DESC;
END;
$$;

-- =============================================
-- FUNCTION: Delete pending org admin
-- =============================================

CREATE OR REPLACE FUNCTION delete_pending_org_admin(p_pending_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM pending_org_admins WHERE id = p_pending_id;
  RETURN FOUND;
END;
$$;

-- =============================================
-- FIX: use_invite_link function
-- Ensure it properly creates memberships
-- =============================================

DROP FUNCTION IF EXISTS use_invite_link(TEXT, UUID);

CREATE FUNCTION use_invite_link(invite_code TEXT, joining_user_id UUID)
RETURNS TABLE (success BOOLEAN, org_id UUID, org_name TEXT, error_message TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_link RECORD;
  v_org RECORD;
  v_member_id UUID;
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
  SELECT id INTO v_member_id FROM org_members
  WHERE org_members.org_id = v_link.org_id AND org_members.user_id = joining_user_id;

  IF v_member_id IS NOT NULL THEN
    -- Already a member - update role if admin invite
    IF v_link.invite_role = 'admin' THEN
      UPDATE org_members SET role = 'admin'
      WHERE id = v_member_id AND role = 'student';
    END IF;
    RETURN QUERY SELECT true, v_org.id, v_org.name, 'Already a member'::TEXT;
    RETURN;
  END IF;

  -- Remove any self-registered record (org_id IS NULL) for this user
  DELETE FROM org_members
  WHERE user_id = joining_user_id AND org_id IS NULL;

  -- Add member with the role from the invite link
  INSERT INTO org_members (org_id, user_id, role, joined_via, status)
  VALUES (v_link.org_id, joining_user_id, COALESCE(v_link.invite_role, 'student'), v_link.id, 'active')
  RETURNING id INTO v_member_id;

  -- Create/update user profile with invite name
  INSERT INTO user_profiles (user_id, first_name, last_name, display_name)
  VALUES (
    joining_user_id,
    v_link.first_name,
    v_link.last_name,
    NULLIF(TRIM(COALESCE(v_link.first_name, '') || ' ' || COALESCE(v_link.last_name, '')), '')
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
  UPDATE org_invite_links SET use_count = use_count + 1 WHERE id = v_link.id;

  RETURN QUERY SELECT true, v_org.id, v_org.name, NULL::TEXT;
END;
$$;

-- =============================================
-- FUNCTION: Ensure user has membership record
-- Called from application after login
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
  v_pending RECORD;
  v_member RECORD;
BEGIN
  -- First check if there's a pending org admin for this email
  SELECT poa.*, o.slug as org_slug, o.name as org_name
  INTO v_pending
  FROM pending_org_admins poa
  JOIN organizations o ON o.id = poa.org_id
  WHERE LOWER(poa.email) = LOWER(p_user_email)
  LIMIT 1;

  IF FOUND THEN
    -- Activate the pending admin
    INSERT INTO org_members (org_id, user_id, role, status)
    VALUES (v_pending.org_id, p_user_id, 'admin', 'active')
    ON CONFLICT (org_id, user_id) DO UPDATE SET role = 'admin';

    -- Create profile
    INSERT INTO user_profiles (user_id, first_name, last_name, display_name)
    VALUES (
      p_user_id,
      v_pending.first_name,
      v_pending.last_name,
      NULLIF(TRIM(COALESCE(v_pending.first_name, '') || ' ' || COALESCE(v_pending.last_name, '')), '')
    )
    ON CONFLICT (user_id) DO NOTHING;

    -- Remove from pending
    DELETE FROM pending_org_admins WHERE id = v_pending.id;

    RETURN QUERY SELECT 'admin'::TEXT, v_pending.org_id, v_pending.org_slug, v_pending.org_name, false;
    RETURN;
  END IF;

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
-- RLS POLICY: Super admins can view all members
-- =============================================

-- Drop existing policy if exists
DROP POLICY IF EXISTS "Super admins can view all members" ON org_members;

CREATE POLICY "Super admins can view all members"
  ON org_members FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('mkoepkeci@gmail.com', 'marty.koepke@practicalinformatics.org')
    OR user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM org_members om2
      WHERE om2.org_id = org_members.org_id
        AND om2.user_id = auth.uid()
        AND om2.role = 'admin'
    )
  );
