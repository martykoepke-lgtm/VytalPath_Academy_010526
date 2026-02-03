// Organization types for multi-tenant support

export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface OrgInviteLink {
  id: string;
  org_id: string;
  code: string;
  label: string | null;
  expires_at: string | null;
  max_uses: number | null;
  use_count: number;
  is_active: boolean;
  created_at: string;
  created_by: string | null;
}

export type OrgMemberRole = 'admin' | 'student';
export type OrgMemberStatus = 'active' | 'completed' | 'suspended';

export interface OrgMember {
  id: string;
  org_id: string;
  user_id: string;
  role: OrgMemberRole;
  joined_via: string | null;
  joined_at: string;
  status: OrgMemberStatus;
  created_at: string;
}

// Extended types with joins
export interface OrgMemberWithUser extends OrgMember {
  user: {
    email: string;
    full_name?: string;
  };
}

export interface OrgMemberWithProgress extends OrgMemberWithUser {
  courses_progress: {
    course_id: string;
    course_title: string;
    lessons_completed: number;
    lessons_total: number;
    quiz_best_score: number | null;
    quiz_passed: boolean;
  }[];
}

export interface InviteLinkWithOrg extends OrgInviteLink {
  organization: Organization;
}

// Form types
export interface CreateOrgInput {
  name: string;
  slug: string;
}

export interface CreateInviteLinkInput {
  org_id: string;
  label?: string;
  expires_in_days?: number;  // null = never expires
  max_uses?: number;         // null = unlimited
}

// Response types
export interface UseInviteLinkResult {
  success: boolean;
  org_id: string | null;
  org_name: string | null;
  error_message: string | null;
}
