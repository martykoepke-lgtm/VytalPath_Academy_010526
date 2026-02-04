/*
  # Add Email to get_org_members Function

  Updates the get_org_members function to include user email
  from auth.users table.
*/

DROP FUNCTION IF EXISTS get_org_members(UUID);

CREATE OR REPLACE FUNCTION get_org_members(p_org_id UUID)
RETURNS TABLE (
  id UUID,
  org_id UUID,
  user_id UUID,
  role TEXT,
  status TEXT,
  joined_at TIMESTAMPTZ,
  joined_via UUID,
  user_email TEXT,
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
    au.email as user_email,
    up.first_name,
    up.last_name,
    up.display_name,
    oil.first_name as invite_first_name,
    oil.last_name as invite_last_name,
    oil.label as invite_label
  FROM org_members om
  LEFT JOIN auth.users au ON au.id = om.user_id
  LEFT JOIN user_profiles up ON up.user_id = om.user_id
  LEFT JOIN org_invite_links oil ON oil.id = om.joined_via
  WHERE om.org_id = p_org_id
  ORDER BY om.joined_at DESC;
END;
$$;
