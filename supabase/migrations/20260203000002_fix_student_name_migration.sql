/*
  # Fix Student Name Migration

  This is a safer version that handles existing objects.
*/

-- =============================================
-- ADD NAME FIELDS TO INVITE LINKS (safe)
-- =============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'org_invite_links' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE org_invite_links ADD COLUMN first_name TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'org_invite_links' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE org_invite_links ADD COLUMN last_name TEXT;
  END IF;
END $$;

-- =============================================
-- USER PROFILES TABLE (safe)
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

-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Org admins can view member profiles" ON user_profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Org admins can view profiles of their org members
CREATE POLICY "Org admins can view member profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM org_members om
      INNER JOIN org_members admin_om ON admin_om.org_id = om.org_id
      WHERE om.user_id = user_profiles.user_id
        AND admin_om.user_id = auth.uid()
        AND admin_om.role = 'admin'
    )
  );

-- =============================================
-- FUNCTION: Get org info for invite code
-- =============================================

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
  INNER JOIN org_invite_links oil ON oil.org_id = o.id
  WHERE oil.code = invite_code
    AND oil.is_active = true
    AND (oil.expires_at IS NULL OR oil.expires_at > now())
    AND (oil.max_uses IS NULL OR oil.use_count < oil.max_uses);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: Use invite link (updated)
-- =============================================

CREATE OR REPLACE FUNCTION use_invite_link(invite_code TEXT, joining_user_id UUID)
RETURNS TABLE (
  success BOOLEAN,
  org_id UUID,
  org_name TEXT,
  error_message TEXT
) AS $$
DECLARE
  v_link_id UUID;
  v_link_org_id UUID;
  v_link_first_name TEXT;
  v_link_last_name TEXT;
  v_link_expires_at TIMESTAMPTZ;
  v_link_max_uses INTEGER;
  v_link_use_count INTEGER;
  v_org_id UUID;
  v_org_name TEXT;
BEGIN
  -- Find the invite link
  SELECT
    oil.id, oil.org_id, oil.first_name, oil.last_name,
    oil.expires_at, oil.max_uses, oil.use_count
  INTO
    v_link_id, v_link_org_id, v_link_first_name, v_link_last_name,
    v_link_expires_at, v_link_max_uses, v_link_use_count
  FROM org_invite_links oil
  WHERE oil.code = invite_code
    AND oil.is_active = true;

  IF v_link_id IS NULL THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Invalid invite link'::TEXT;
    RETURN;
  END IF;

  -- Check expiration
  IF v_link_expires_at IS NOT NULL AND v_link_expires_at < now() THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'This invite link has expired'::TEXT;
    RETURN;
  END IF;

  -- Check max uses
  IF v_link_max_uses IS NOT NULL AND v_link_use_count >= v_link_max_uses THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'This invite link has reached its maximum uses'::TEXT;
    RETURN;
  END IF;

  -- Get organization
  SELECT o.id, o.name INTO v_org_id, v_org_name
  FROM organizations o
  WHERE o.id = v_link_org_id;

  -- Check if user is already a member
  IF EXISTS (
    SELECT 1 FROM org_members
    WHERE org_members.org_id = v_link_org_id AND org_members.user_id = joining_user_id
  ) THEN
    RETURN QUERY SELECT true, v_org_id, v_org_name, 'Already a member'::TEXT;
    RETURN;
  END IF;

  -- Add user as member
  INSERT INTO org_members (org_id, user_id, role, joined_via, status)
  VALUES (v_link_org_id, joining_user_id, 'student', v_link_id, 'active');

  -- Create or update user profile with name from invite link
  INSERT INTO user_profiles (user_id, first_name, last_name, display_name)
  VALUES (
    joining_user_id,
    v_link_first_name,
    v_link_last_name,
    COALESCE(
      NULLIF(CONCAT_WS(' ', v_link_first_name, v_link_last_name), ''),
      v_link_first_name,
      v_link_last_name
    )
  )
  ON CONFLICT (user_id) DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, user_profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, user_profiles.last_name),
    display_name = COALESCE(
      NULLIF(CONCAT_WS(' ', EXCLUDED.first_name, EXCLUDED.last_name), ''),
      EXCLUDED.first_name,
      EXCLUDED.last_name,
      user_profiles.display_name
    ),
    updated_at = now();

  -- Increment use count
  UPDATE org_invite_links
  SET use_count = use_count + 1
  WHERE id = v_link_id;

  RETURN QUERY SELECT true, v_org_id, v_org_name, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- UPDATED_AT TRIGGER
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
