/*
  # Create Organization Tables

  ## Overview
  Creates tables for multi-tenant organization support in VytalPath Academy.
  Organizations can invite students via shareable links and track their progress.

  ## New Tables

  ### `organizations`
  Companies/clinics that enroll students in training
  - Name and unique slug for URLs
  - Created by an admin user

  ### `org_invite_links`
  Shareable links for student registration
  - Unique codes for /join/[code] URLs
  - Optional expiration and use limits
  - Labels for cohort tracking (e.g., "Q1 2026 Hires")

  ### `org_members`
  Association between users and organizations
  - Role: admin or student
  - Tracks which invite link was used
  - Status: active, completed, suspended

  ## Security (RLS)
  - Org admins can manage their organization
  - Org admins can view all members and their progress
  - Students can only see their own membership
*/

-- =============================================
-- ORGANIZATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Index for slug lookups
CREATE INDEX idx_organizations_slug ON organizations(slug);

-- =============================================
-- ORG INVITE LINKS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS org_invite_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  label TEXT,                           -- "January 2026 Cohort", "Pre-hire Training"
  expires_at TIMESTAMPTZ,               -- NULL = never expires
  max_uses INTEGER,                     -- NULL = unlimited uses
  use_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Index for code lookups (used in /join/[code])
CREATE INDEX idx_org_invite_links_code ON org_invite_links(code);
CREATE INDEX idx_org_invite_links_org ON org_invite_links(org_id);

-- =============================================
-- ORG MEMBERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student')),
  joined_via UUID REFERENCES org_invite_links(id),  -- which invite link they used
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(org_id, user_id)
);

-- Indexes for querying members
CREATE INDEX idx_org_members_org ON org_members(org_id);
CREATE INDEX idx_org_members_user ON org_members(user_id);
CREATE INDEX idx_org_members_role ON org_members(org_id, role);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_invite_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;

-- Organizations: Admins can manage, members can view their org
CREATE POLICY "Org admins can manage organization"
  ON organizations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = organizations.id
        AND org_members.user_id = auth.uid()
        AND org_members.role = 'admin'
    )
  );

CREATE POLICY "Org members can view their organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = organizations.id
        AND org_members.user_id = auth.uid()
    )
  );

-- Users can create organizations (they become admin via trigger)
CREATE POLICY "Authenticated users can create organizations"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Invite Links: Only org admins can manage
CREATE POLICY "Org admins can manage invite links"
  ON org_invite_links FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = org_invite_links.org_id
        AND org_members.user_id = auth.uid()
        AND org_members.role = 'admin'
    )
  );

-- Public can read active invite links (for /join/[code] validation)
CREATE POLICY "Anyone can validate active invite links"
  ON org_invite_links FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND (max_uses IS NULL OR use_count < max_uses)
  );

-- Org Members: Admins can manage all members, users can see own membership
CREATE POLICY "Org admins can manage members"
  ON org_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_members AS admin_check
      WHERE admin_check.org_id = org_members.org_id
        AND admin_check.user_id = auth.uid()
        AND admin_check.role = 'admin'
    )
  );

CREATE POLICY "Users can view own membership"
  ON org_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own membership via invite"
  ON org_members FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to generate a random invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghjkmnpqrstuvwxyz23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to validate and use an invite link
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

  -- Increment use count
  UPDATE org_invite_links
  SET use_count = use_count + 1
  WHERE id = link_record.id;

  RETURN QUERY SELECT true, org_record.id, org_record.name, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to add creator as admin when org is created
CREATE OR REPLACE FUNCTION add_org_creator_as_admin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO org_members (org_id, user_id, role, status)
  VALUES (NEW.id, NEW.created_by, 'admin', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_org_created
  AFTER INSERT ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION add_org_creator_as_admin();

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
