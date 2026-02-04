/*
  # Add Student Name to Invite Links

  ## Changes
  1. Add first_name and last_name columns to org_invite_links
  2. Add user_profiles table for storing student names
  3. Fix RLS so join page can read organization name through invite links
  4. Add user_profiles insert for students joining via invite
*/

-- =============================================
-- ADD NAME FIELDS TO INVITE LINKS
-- =============================================

ALTER TABLE org_invite_links
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- =============================================
-- USER PROFILES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Org admins can view profiles of their members
CREATE POLICY "Org admins can view member profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_members om
      JOIN org_members admin_check ON admin_check.org_id = om.org_id
      WHERE om.user_id = user_profiles.user_id
        AND admin_check.user_id = auth.uid()
        AND admin_check.role = 'admin'
    )
  );

-- =============================================
-- FIX ORGANIZATIONS RLS FOR JOIN PAGE
-- =============================================

-- Allow anyone to read org info when accessed through a valid invite link
-- This is needed for the /join/:code page to show the org name
CREATE OR REPLACE FUNCTION public.get_org_for_invite_code(invite_code TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT o.id, o.name, o.slug
  FROM organizations o
  JOIN org_invite_links oil ON oil.org_id = o.id
  WHERE oil.code = invite_code
    AND oil.is_active = true
    AND (oil.expires_at IS NULL OR oil.expires_at > now())
    AND (oil.max_uses IS NULL OR oil.use_count < oil.max_uses);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- UPDATE use_invite_link TO SET USER PROFILE
-- =============================================

CREATE OR REPLACE FUNCTION use_invite_link(invite_code TEXT, joining_user_id UUID)
RETURNS TABLE (
  success BOOLEAN,
  org_id UUID,
  org_name TEXT,
  error_message TEXT
) AS $$
DECLARE
  link_record org_invite_links%ROWTYPE;
  org_record organizations%ROWTYPE;
BEGIN
  -- Find the invite link
  SELECT * INTO link_record
  FROM org_invite_links
  WHERE code = invite_code
    AND is_active = true;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Invalid invite link';
    RETURN;
  END IF;

  -- Check expiration
  IF link_record.expires_at IS NOT NULL AND link_record.expires_at < now() THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'This invite link has expired';
    RETURN;
  END IF;

  -- Check max uses
  IF link_record.max_uses IS NOT NULL AND link_record.use_count >= link_record.max_uses THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'This invite link has reached its maximum uses';
    RETURN;
  END IF;

  -- Get organization
  SELECT * INTO org_record
  FROM organizations
  WHERE id = link_record.org_id;

  -- Check if user is already a member
  IF EXISTS (
    SELECT 1 FROM org_members
    WHERE org_id = link_record.org_id AND user_id = joining_user_id
  ) THEN
    RETURN QUERY SELECT true, org_record.id, org_record.name, 'Already a member'::TEXT;
    RETURN;
  END IF;

  -- Add user as member
  INSERT INTO org_members (org_id, user_id, role, joined_via, status)
  VALUES (link_record.org_id, joining_user_id, 'student', link_record.id, 'active');

  -- Create or update user profile with name from invite link
  INSERT INTO user_profiles (user_id, first_name, last_name, display_name)
  VALUES (
    joining_user_id,
    link_record.first_name,
    link_record.last_name,
    COALESCE(link_record.first_name || ' ' || link_record.last_name, link_record.first_name, link_record.last_name)
  )
  ON CONFLICT (user_id) DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, user_profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, user_profiles.last_name),
    display_name = COALESCE(
      EXCLUDED.first_name || ' ' || EXCLUDED.last_name,
      EXCLUDED.first_name,
      EXCLUDED.last_name,
      user_profiles.display_name
    ),
    updated_at = now();

  -- Increment use count
  UPDATE org_invite_links
  SET use_count = use_count + 1
  WHERE id = link_record.id;

  RETURN QUERY SELECT true, org_record.id, org_record.name, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- UPDATED_AT TRIGGER FOR USER_PROFILES
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
