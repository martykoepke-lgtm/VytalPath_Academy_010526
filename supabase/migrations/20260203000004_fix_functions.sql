/*
  # Fix Functions - Drop and Recreate

  Drop existing functions first, then recreate with correct signatures.
*/

-- Drop existing functions
DROP FUNCTION IF EXISTS use_invite_link(TEXT, UUID);
DROP FUNCTION IF EXISTS get_org_for_invite_code(TEXT);

-- STEP 1: Add columns to org_invite_links
ALTER TABLE org_invite_links
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- STEP 2: Drop user_profiles if it exists with wrong schema
DROP TABLE IF EXISTS user_profiles CASCADE;

-- STEP 3: Create user_profiles table fresh
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- STEP 4: Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- STEP 5: Simple RLS policies
CREATE POLICY "users_own_profile_select" ON user_profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "users_own_profile_insert" ON user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_own_profile_update" ON user_profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- STEP 6: Function to get org for invite code
CREATE FUNCTION public.get_org_for_invite_code(invite_code TEXT)
RETURNS TABLE (id UUID, name TEXT, slug TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
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
$$;

-- STEP 7: Function to use invite link
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
    RETURN QUERY SELECT true, v_org.id, v_org.name, 'Already a member'::TEXT;
    RETURN;
  END IF;

  -- Add member
  INSERT INTO org_members (org_id, user_id, role, joined_via, status)
  VALUES (v_link.org_id, joining_user_id, 'student', v_link.id, 'active');

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
