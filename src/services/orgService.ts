import { supabase } from '../lib/supabase';
import type {
  Organization,
  OrgInviteLink,
  OrgMember,
  OrgMemberWithProgress,
  CreateOrgInput,
  CreateInviteLinkInput,
  UseInviteLinkResult,
  InviteLinkWithOrg,
} from '../types/organization';

// =============================================
// ORGANIZATION CRUD
// =============================================

export async function createOrganization(input: CreateOrgInput): Promise<Organization> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Must be logged in to create organization');

  const { data, error } = await supabase
    .from('organizations')
    .insert({
      name: input.name,
      slug: input.slug,
      created_by: user.user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrganization(orgId: string): Promise<Organization | null> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function getUserOrganizations(): Promise<(OrgMember & { organization: Organization })[]> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return [];

  const { data, error } = await supabase
    .from('org_members')
    .select(`
      *,
      organization:organizations(*)
    `)
    .eq('user_id', user.user.id);

  if (error) throw error;
  return data || [];
}

export async function getUserAdminOrganizations(): Promise<(OrgMember & { organization: Organization })[]> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return [];

  const { data, error } = await supabase
    .from('org_members')
    .select(`
      *,
      organization:organizations(*)
    `)
    .eq('user_id', user.user.id)
    .eq('role', 'admin');

  if (error) throw error;
  return data || [];
}

// =============================================
// INVITE LINKS
// =============================================

export async function createInviteLink(input: CreateInviteLinkInput): Promise<OrgInviteLink> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Must be logged in to create invite link');

  // Generate a random code
  const code = generateRandomCode();

  // Calculate expiration if provided
  let expires_at: string | null = null;
  if (input.expires_in_days) {
    const date = new Date();
    date.setDate(date.getDate() + input.expires_in_days);
    expires_at = date.toISOString();
  }

  const { data, error } = await supabase
    .from('org_invite_links')
    .insert({
      org_id: input.org_id,
      code,
      label: input.label || null,
      first_name: input.first_name || null,
      last_name: input.last_name || null,
      expires_at,
      max_uses: input.max_uses ?? 1, // Default to single-use when tied to a student
      invite_role: input.invite_role || 'student', // Default to student
      created_by: user.user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrgInviteLinks(orgId: string): Promise<OrgInviteLink[]> {
  const { data, error } = await supabase
    .from('org_invite_links')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function deactivateInviteLink(linkId: string): Promise<void> {
  const { error } = await supabase
    .from('org_invite_links')
    .update({ is_active: false })
    .eq('id', linkId);

  if (error) throw error;
}

export async function getInviteLinkByCode(code: string): Promise<InviteLinkWithOrg | null> {
  const { data, error } = await supabase
    .from('org_invite_links')
    .select(`
      *,
      organization:organizations(*)
    `)
    .eq('code', code)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  // Check if link is valid
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return null;
  }
  if (data.max_uses && data.use_count >= data.max_uses) {
    return null;
  }

  return data;
}

// =============================================
// MEMBERSHIP
// =============================================

export async function useInviteLink(code: string): Promise<UseInviteLinkResult> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) {
    return {
      success: false,
      org_id: null,
      org_name: null,
      error_message: 'Must be logged in to join organization',
    };
  }

  const { data, error } = await supabase
    .rpc('use_invite_link', {
      invite_code: code,
      joining_user_id: user.user.id,
    });

  if (error) {
    return {
      success: false,
      org_id: null,
      org_name: null,
      error_message: error.message,
    };
  }

  // RPC returns an array, get first result
  const result = data?.[0];
  return result || {
    success: false,
    org_id: null,
    org_name: null,
    error_message: 'Unknown error',
  };
}

export async function getOrgMembers(orgId: string): Promise<OrgMember[]> {
  const { data, error } = await supabase
    .from('org_members')
    .select('*')
    .eq('org_id', orgId)
    .order('joined_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getOrgMembersWithProgress(orgId: string): Promise<OrgMemberWithProgress[]> {
  // Use SECURITY DEFINER function to get members with all details
  const { data: members, error: membersError } = await supabase
    .rpc('get_org_members', { p_org_id: orgId });

  if (membersError) {
    console.error('Error fetching members:', membersError);
    // Fallback to direct query
    const { data: fallbackMembers, error: fallbackError } = await supabase
      .from('org_members')
      .select('*')
      .eq('org_id', orgId)
      .eq('role', 'student')
      .order('joined_at', { ascending: false });

    if (fallbackError || !fallbackMembers) return [];

    return fallbackMembers.map((member) => ({
      ...member,
      user: {
        email: null,
        full_name: null,
      },
      courses_progress: [],
    }));
  }

  if (!members) return [];

  // Filter to only students and map to expected format
  const studentMembers = members.filter((m: any) => m.role === 'student');

  const membersWithProgress: OrgMemberWithProgress[] = studentMembers.map((member: any) => {
    const firstName = member.first_name || member.invite_first_name || '';
    const lastName = member.last_name || member.invite_last_name || '';
    const displayName = member.display_name ||
      (firstName && lastName ? `${firstName} ${lastName}` : member.invite_label) ||
      null;

    return {
      id: member.id,
      org_id: member.org_id,
      user_id: member.user_id,
      role: member.role,
      status: member.status,
      joined_at: member.joined_at,
      joined_via: member.joined_via,
      created_at: member.joined_at,
      user: {
        email: member.user_email || null,
        full_name: displayName,
      },
      courses_progress: [],
    };
  });

  return membersWithProgress;
}

export async function updateMemberStatus(
  memberId: string,
  status: 'active' | 'completed' | 'suspended'
): Promise<void> {
  const { error } = await supabase
    .from('org_members')
    .update({ status })
    .eq('id', memberId);

  if (error) throw error;
}

export async function isUserOrgAdmin(orgId: string): Promise<boolean> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return false;

  const { data, error } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.user.id)
    .eq('role', 'admin')
    .single();

  if (error) return false;
  return !!data;
}

// =============================================
// ORG ADMIN MANAGEMENT
// =============================================

export async function getOrgAdmins(orgId: string): Promise<OrgMember[]> {
  const { data, error } = await supabase
    .from('org_members')
    .select('*')
    .eq('org_id', orgId)
    .eq('role', 'admin')
    .order('joined_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function addOrgAdmin(
  orgId: string,
  email: string
): Promise<{ success: boolean; error?: string }> {
  // First, find the user by email using the RPC function
  const { data: userData, error: userError } = await supabase
    .rpc('get_user_by_email', { user_email: email });

  if (userError || !userData || userData.length === 0) {
    return {
      success: false,
      error: 'User not found. They must create an account first.',
    };
  }

  const userId = userData[0].id;

  // Check if already a member
  const { data: existing } = await supabase
    .from('org_members')
    .select('id, role')
    .eq('org_id', orgId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    if (existing.role === 'admin') {
      return { success: false, error: 'User is already an admin of this organization.' };
    }

    // Upgrade from student to admin
    const { error: updateError } = await supabase
      .from('org_members')
      .update({ role: 'admin' })
      .eq('id', existing.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true };
  }

  // Add as new admin
  const { error: insertError } = await supabase
    .from('org_members')
    .insert({
      org_id: orgId,
      user_id: userId,
      role: 'admin',
      status: 'active',
    });

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  return { success: true };
}

// =============================================
// HELPERS
// =============================================

function generateRandomCode(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
