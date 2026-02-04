import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users, LinkIcon, Copy, Check, Plus, Trash2,
  GraduationCap, Clock, CheckCircle, AlertCircle, ArrowLeft,
  Building2, UserPlus, Mail, Calendar, TrendingUp, BookOpen,
  Shield, UserCog, X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getOrganizationBySlug, getOrgMembersWithProgress } from '../../services/orgService';
import type { Organization, OrgMemberWithProgress } from '../../types/organization';
import { useAuth, isSuperAdmin } from '../../contexts/AuthContext';

interface Invitation {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'student';
  token: string;
  max_uses: number | null;
  use_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  accepted_by_email: string | null;
  accepted_at: string | null;
}

interface OrgAdmin {
  member_id: string;
  user_id: string;
  user_email: string | null;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  role: string;
  status: string;
  joined_at: string;
}

export function OrgAdminDashboard() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const { user } = useAuth();
  const [org, setOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrgMemberWithProgress[]>([]);
  const [orgAdmins, setOrgAdmins] = useState<OrgAdmin[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    if (orgSlug) {
      loadOrgData();
    }
  }, [orgSlug]);

  async function loadOrgData() {
    try {
      setLoading(true);

      // Load organization
      const orgData = await getOrganizationBySlug(orgSlug!);
      if (!orgData) {
        setOrg(null);
        return;
      }
      setOrg(orgData);

      // Load members with progress
      const membersData = await getOrgMembersWithProgress(orgData.id);
      setMembers(membersData);

      // Load org admins
      await loadOrgAdmins(orgData.id);

      // Load invitations using new unified system
      await loadInvitations(orgData.id);
    } catch (error) {
      console.error('Error loading org data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadInvitations(orgId: string) {
    try {
      const { data, error } = await supabase.rpc('get_org_invitations', {
        p_org_id: orgId
      });

      if (!error && data) {
        setInvitations(data);
      }
    } catch (e) {
      console.error('Error loading invitations:', e);
    }
  }

  async function loadOrgAdmins(orgId: string) {
    try {
      const { data, error } = await supabase.rpc('get_org_admins', {
        p_org_id: orgId
      });

      if (!error && data) {
        setOrgAdmins(data);
      }
    } catch (e) {
      console.error('Error loading org admins:', e);
    }
  }

  async function handleCancelInvitation(invitationId: string) {
    try {
      const { error } = await supabase.rpc('cancel_invitation', {
        p_invitation_id: invitationId
      });

      if (error) throw error;

      // Refresh invitations
      if (org) {
        await loadInvitations(org.id);
      }
    } catch (e) {
      console.error('Error cancelling invitation:', e);
    }
  }

  async function handleRemoveMember(memberId: string, memberType: 'admin' | 'student') {
    if (!confirm(`Are you sure you want to remove this ${memberType}?`)) {
      return;
    }

    try {
      const { error } = await supabase.rpc('remove_org_member', {
        p_member_id: memberId
      });

      if (error) throw error;

      // Refresh the appropriate list
      if (org) {
        if (memberType === 'admin') {
          await loadOrgAdmins(org.id);
        } else {
          const membersData = await getOrgMembersWithProgress(org.id);
          setMembers(membersData);
        }
      }
    } catch (e) {
      console.error(`Error removing ${memberType}:`, e);
    }
  }

  function copyToClipboard(token: string) {
    const url = `${window.location.origin}/join/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(token);
    setTimeout(() => setCopiedLink(null), 2000);
  }

  function getJoinUrl(token: string) {
    return `${window.location.origin}/join/${token}`;
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Organization not found</h2>
        <p className="text-gray-500 mb-4">This organization doesn't exist or you don't have access.</p>
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const activeStudents = members.filter((m) => m.status === 'active').length;
  const completedStudents = members.filter((m) => m.status === 'completed').length;
  const avgProgress = members.length > 0
    ? Math.round(
        members.reduce((sum, m) => {
          const memberProgress = m.courses_progress.reduce((pSum, c) => {
            return pSum + (c.lessons_total > 0 ? (c.lessons_completed / c.lessons_total) * 100 : 0);
          }, 0) / (m.courses_progress.length || 1);
          return sum + memberProgress;
        }, 0) / members.length
      )
    : 0;

  // Separate invitations by role and status
  const pendingStudentInvites = invitations.filter(inv => inv.role === 'student' && inv.status === 'pending');
  const pendingAdminInvites = invitations.filter(inv => inv.role === 'admin' && inv.status === 'pending');
  const completedInvites = invitations.filter(inv => inv.status === 'accepted');
  const pendingCount = pendingStudentInvites.length + pendingAdminInvites.length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        {isSuperAdmin(user?.email) && (
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Platform Overview
          </Link>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-700 to-teal-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{org.name}</h1>
              <p className="text-gray-500">Organization Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Invite User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Students</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{members.length}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Admins</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{orgAdmins.length}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Active</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{activeStudents}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Pending</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-teal-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Avg. Progress</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{avgProgress}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Students</h2>
              <span className="text-sm text-gray-500">{members.length} total</span>
            </div>
          </div>

          {members.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students yet</h3>
              <p className="text-gray-500 mb-4">Create invitations to add students</p>
              <button
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100"
              >
                <UserPlus className="w-4 h-4" />
                Invite Student
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {members.map((member) => {
                const totalLessons = member.courses_progress.reduce((sum, c) => sum + c.lessons_total, 0);
                const completedLessons = member.courses_progress.reduce((sum, c) => sum + c.lessons_completed, 0);
                const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

                return (
                  <div key={member.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {member.user?.full_name?.[0] || member.user?.email?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {member.user?.full_name || member.user?.email || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{member.user?.email}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-10 text-right">
                            {progressPercent}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {completedLessons}/{totalLessons} lessons
                        </p>
                      </div>
                      <span
                        className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full ${
                          member.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : member.status === 'active'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {member.status}
                      </span>
                      <button
                        onClick={() => handleRemoveMember(member.id, 'student')}
                        className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Remove student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {member.courses_progress.length > 0 && (
                      <div className="mt-3 ml-14 space-y-1">
                        {member.courses_progress.map((course) => (
                          <div key={course.course_id} className="flex items-center gap-2 text-xs">
                            <BookOpen className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{course.course_title}</span>
                            <span className="text-gray-400">
                              {course.lessons_completed}/{course.lessons_total} lessons
                            </span>
                            {course.quiz_passed && (
                              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                                Quiz: {course.quiz_best_score}%
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pending Invitations */}
        <div className="space-y-6">
          {/* Student Invitations */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Student Invites</h2>
                </div>
                <span className="text-sm text-gray-500">{pendingStudentInvites.length} pending</span>
              </div>
            </div>

            {pendingStudentInvites.length === 0 ? (
              <div className="p-6 text-center">
                <LinkIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No pending student invites</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[250px] overflow-y-auto">
                {pendingStudentInvites.map((inv) => {
                  const name = inv.first_name || inv.last_name
                    ? `${inv.first_name || ''} ${inv.last_name || ''}`.trim()
                    : inv.email || 'Shareable Link';

                  return (
                    <div key={inv.id} className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{name}</p>
                          {inv.email && (
                            <p className="text-xs text-gray-500">{inv.email}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleCancelInvitation(inv.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Cancel invite"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 truncate">
                          {getJoinUrl(inv.token)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(inv.token)}
                          className="p-1.5 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors"
                        >
                          {copiedLink === inv.token ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Admin Invitations */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Admin Invites</h2>
                </div>
                <span className="text-sm text-gray-500">{pendingAdminInvites.length} pending</span>
              </div>
            </div>

            {pendingAdminInvites.length === 0 ? (
              <div className="p-6 text-center">
                <UserCog className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No pending admin invites</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[250px] overflow-y-auto">
                {pendingAdminInvites.map((inv) => {
                  const name = inv.first_name || inv.last_name
                    ? `${inv.first_name || ''} ${inv.last_name || ''}`.trim()
                    : inv.email || 'Shareable Link';

                  return (
                    <div key={inv.id} className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 text-sm">{name}</p>
                            <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                              admin
                            </span>
                          </div>
                          {inv.email && (
                            <p className="text-xs text-gray-500">{inv.email}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleCancelInvitation(inv.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Cancel invite"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 truncate">
                          {getJoinUrl(inv.token)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(inv.token)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          {copiedLink === inv.token ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Organization Admins */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCog className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Organization Admins</h2>
                </div>
                <span className="text-sm text-gray-500">{orgAdmins.length} total</span>
              </div>
            </div>

            {orgAdmins.length === 0 ? (
              <div className="p-6 text-center">
                <UserCog className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No admins yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[200px] overflow-y-auto">
                {orgAdmins.map((admin) => (
                  <div key={admin.member_id} className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">
                        {(admin.display_name || admin.user_email)?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {admin.display_name || admin.user_email || 'Unknown'}
                      </p>
                      {admin.user_email && admin.display_name && (
                        <p className="text-xs text-gray-500 truncate">{admin.user_email}</p>
                      )}
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                      admin
                    </span>
                    <button
                      onClick={() => handleRemoveMember(admin.member_id, 'admin')}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Remove admin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Enrollments */}
          {completedInvites.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Recent Enrollments</h2>
                  </div>
                  <span className="text-sm text-gray-500">{completedInvites.length} completed</span>
                </div>
              </div>

              <div className="divide-y divide-gray-100 max-h-[200px] overflow-y-auto">
                {completedInvites.slice(0, 10).map((inv) => {
                  const name = inv.first_name || inv.last_name
                    ? `${inv.first_name || ''} ${inv.last_name || ''}`.trim()
                    : inv.email || 'Unknown';

                  return (
                    <div key={inv.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            inv.role === 'admin' ? 'bg-purple-100' : 'bg-green-100'
                          }`}>
                            <span className={`text-sm font-medium ${
                              inv.role === 'admin' ? 'text-purple-600' : 'text-green-600'
                            }`}>
                              {name[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{name}</p>
                            {inv.accepted_by_email && inv.accepted_by_email !== inv.email && (
                              <p className="text-xs text-gray-500">{inv.accepted_by_email}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            inv.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {inv.role}
                          </span>
                          {inv.accepted_at && (
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(inv.accepted_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invite User Modal */}
      {showInviteModal && org && (
        <InviteModal
          orgId={org.id}
          orgName={org.name}
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            if (org) loadInvitations(org.id);
            setShowInviteModal(false);
          }}
        />
      )}
    </div>
  );
}

// Invite Modal Component
interface InviteModalProps {
  orgId: string;
  orgName: string;
  onClose: () => void;
  onSuccess: () => void;
}

function InviteModal({ orgId, orgName, onClose, onSuccess }: InviteModalProps) {
  const [role, setRole] = useState<'admin' | 'student'>('student');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdInvite, setCreatedInvite] = useState<{ token: string; email: string | null } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: rpcError } = await supabase.rpc('create_invitation', {
        p_org_id: orgId,
        p_role: role,
        p_email: email || null,
        p_first_name: firstName || null,
        p_last_name: lastName || null,
        p_max_uses: email ? 1 : null,
        p_expires_in_days: 30
      });

      if (rpcError) {
        setError(rpcError.message);
        setLoading(false);
        return;
      }

      const result = data?.[0];
      if (!result?.success) {
        setError(result?.error_message || 'Failed to create invitation');
        setLoading(false);
        return;
      }

      setCreatedInvite({
        token: result.token,
        email: email || null
      });
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create invitation');
      setLoading(false);
    }
  }

  function copyInviteLink() {
    if (createdInvite) {
      navigator.clipboard.writeText(`${window.location.origin}/join/${createdInvite.token}`);
    }
  }

  // Success state
  if (createdInvite) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Invitation Created!</h2>
              <button onClick={onSuccess} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <p className="text-center text-gray-600 mb-4">
              {createdInvite.email
                ? `Invitation created for ${createdInvite.email}`
                : 'Shareable invitation link created'}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Invite Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/join/${createdInvite.token}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={copyInviteLink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 text-center">
              Share this link with the user to join {orgName}.
            </p>

            <button
              onClick={onSuccess}
              className="w-full mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Invite User to {orgName}</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Create an invitation link. Optionally specify their email for a personalized invite.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-2 px-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                  role === 'student'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-2 px-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                  role === 'admin'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-gray-400">(optional)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="user@example.com"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to create a shareable link
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
