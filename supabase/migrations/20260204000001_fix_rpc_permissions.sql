/*
  # Fix RPC Function Permissions

  Grants execution permissions on all role system functions to authenticated users.
  These functions use SECURITY DEFINER so they run with owner privileges,
  but authenticated users still need EXECUTE permission to call them.
*/

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION add_org_admin_by_email(UUID, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_self_registered_students() TO authenticated;
GRANT EXECUTE ON FUNCTION get_pending_org_admins(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_pending_org_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION ensure_user_membership(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION use_invite_link(TEXT, UUID) TO authenticated;
