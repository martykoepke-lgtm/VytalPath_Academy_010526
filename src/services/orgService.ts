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
      expires_at,
      max_uses: input.max_uses || null,
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
  // First get all members with user info
  const { data: members, error: membersError } = await supabase
    .from('org_members')
    .select(`
      *,
      user:auth.users(email, raw_user_meta_data)
    `)
    .eq('org_id', orgId)
    .eq('role', 'student')
    .order('joined_at', { ascending: false });

  if (membersError) throw membersError;
  if (!members) return [];

  // Get all courses
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      modules(
        id,
        lessons(id),
        quizzes(id)
      )
    `)
    .eq('is_published', true);

  if (coursesError) throw coursesError;

  // For each member, calculate their progress
  const membersWithProgress: OrgMemberWithProgress[] = await Promise.all(
    members.map(async (member) => {
      const coursesProgress = await Promise.all(
        (courses || []).map(async (course) => {
          // Count total lessons
          const totalLessons = course.modules?.reduce(
            (sum, m) => sum + (m.lessons?.length || 0),
            0
          ) || 0;

          // Get completed lessons for this user
          const lessonIds = course.modules?.flatMap(m => m.lessons?.map(l => l.id) || []) || [];
          const { count: completedLessons } = await supabase
            .from('lesson_progress')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', member.user_id)
            .in('lesson_id', lessonIds.length > 0 ? lessonIds : ['none']);

          // Get quiz attempts for this course
          const quizIds = course.modules?.map(m => m.quizzes?.id).filter(Boolean) || [];
          const { data: quizAttempts } = await supabase
            .from('quiz_attempts')
            .select('score, passed')
            .eq('user_id', member.user_id)
            .in('quiz_id', quizIds.length > 0 ? quizIds : ['none'])
            .order('score', { ascending: false });

          const bestAttempt = quizAttempts?.[0];

          return {
            course_id: course.id,
            course_title: course.title,
            lessons_completed: completedLessons || 0,
            lessons_total: totalLessons,
            quiz_best_score: bestAttempt?.score || null,
            quiz_passed: bestAttempt?.passed || false,
          };
        })
      );

      return {
        ...member,
        user: {
          email: member.user?.email || 'Unknown',
          full_name: member.user?.raw_user_meta_data?.full_name,
        },
        courses_progress: coursesProgress,
      };
    })
  );

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
