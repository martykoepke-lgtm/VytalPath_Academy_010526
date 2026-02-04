import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Users, Clock, ChevronRight, LinkIcon, UserPlus,
  BarChart3, Calendar, CheckCircle, AlertCircle, Mail, X, UserCog,
  Copy, Shield, Trash2, ExternalLink
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface OrgSummary {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  member_count: number;
  active_links: number;
  avg_progress: number;
}

interface SelfRegisteredStudent {
  id: string;
  user_id: string;
  status: string;
  joined_at: string;
  user_email: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
}

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
  org_name?: string;
  org_slug?: string;
}

interface DashboardStats {
  total_orgs: number;
  total_students: number;
  total_admins: number;
  active_invite_links: number;
  avg_completion_rate: number;
  self_registered_count: number;
}

export function SuperAdminDashboard() {
  const [orgs, setOrgs] = useState<OrgSummary[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selfRegistered, setSelfRegistered] = useState<SelfRegisteredStudent[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'orgs' | 'invitations' | 'self-registered'>('orgs');

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      // Load all organizations
      const { data: orgsData, error: orgsError } = await supabase
        .rpc('get_all_organizations');

      if (orgsError) {
        console.error('Error loading organizations:', orgsError);
        // Fallback to direct query
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('organizations')
          .select(`
            id,
            name,
            slug,
            created_at,
            org_members(id, role),
            invitations(id, is_active)
          `)
          .order('created_at', { ascending: false });

        if (fallbackError) throw fallbackError;

        const orgSummaries: OrgSummary[] = (fallbackData || []).map((org: any) => ({
          id: org.id,
          name: org.name,
          slug: org.slug,
          created_at: org.created_at,
          member_count: org.org_members?.length || 0,
          active_links: org.invitations?.filter((l: any) => l.is_active).length || 0,
          avg_progress: 0,
        }));

        setOrgs(orgSummaries);
        calculateStats(orgSummaries, 0);
        return;
      }

      const orgSummaries: OrgSummary[] = (orgsData || []).map((org: any) => ({
        id: org.id,
        name: org.name,
        slug: org.slug,
        created_at: org.created_at,
        member_count: Number(org.member_count) || 0,
        active_links: Number(org.active_links) || 0,
        avg_progress: 0,
      }));

      setOrgs(orgSummaries);

      // Load self-registered students
      let selfRegCount = 0;
      try {
        const { data: selfRegData, error: selfRegError } = await supabase
          .rpc('get_self_registered_students');

        if (!selfRegError && selfRegData) {
          setSelfRegistered(selfRegData);
          selfRegCount = selfRegData.length;
        }
      } catch (e) {
        console.error('Error loading self-registered students:', e);
      }

      // Load pending invitations from all orgs
      await loadPendingInvitations();

      calculateStats(orgSummaries, selfRegCount);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setOrgs([]);
      setStats({
        total_orgs: 0,
        total_students: 0,
        total_admins: 0,
        active_invite_links: 0,
        avg_completion_rate: 0,
        self_registered_count: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadPendingInvitations() {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select(`
          id,
          email,
          first_name,
          last_name,
          role,
          token,
          max_uses,
          use_count,
          expires_at,
          is_active,
          created_at,
          organization:organizations(name, slug)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const formatted: Invitation[] = data.map((inv: any) => ({
          ...inv,
          org_name: inv.organization?.name,
          org_slug: inv.organization?.slug,
        }));
        setPendingInvitations(formatted);
      }
    } catch (e) {
      console.error('Error loading invitations:', e);
    }
  }

  function calculateStats(orgSummaries: OrgSummary[], selfRegCount: number) {
    const totalStudents = orgSummaries.reduce((sum, o) => sum + o.member_count, 0);
    const totalActiveLinks = orgSummaries.reduce((sum, o) => sum + o.active_links, 0);

    setStats({
      total_orgs: orgSummaries.length,
      total_students: totalStudents,
      total_admins: orgSummaries.length,
      active_invite_links: totalActiveLinks,
      avg_completion_rate: 0,
      self_registered_count: selfRegCount,
    });
  }

  async function handleCancelInvitation(invitationId: string) {
    try {
      const { error } = await supabase.rpc('cancel_invitation', {
        p_invitation_id: invitationId
      });

      if (error) throw error;

      // Refresh invitations
      await loadPendingInvitations();
    } catch (e) {
      console.error('Error cancelling invitation:', e);
    }
  }

  function getJoinUrl(token: string) {
    return `${window.location.origin}/join/${token}`;
  }

  function copyToClipboard(token: string) {
    navigator.clipboard.writeText(getJoinUrl(token));
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-teal-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
            <p className="text-sm text-gray-500">Monitor all organizations and student progress</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Organizations</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.total_orgs || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Active organizations</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Total Students</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.total_students || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Across all orgs</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-teal-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Active Invites</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingInvitations.length}</p>
          <p className="text-xs text-gray-500 mt-1">Pending invitations</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <UserCog className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Self-Registered</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.self_registered_count || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Independent learners</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('orgs')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeTab === 'orgs'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Building2 className="w-4 h-4 inline-block mr-2" />
          Organizations ({orgs.length})
        </button>
        <button
          onClick={() => setActiveTab('invitations')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeTab === 'invitations'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Clock className="w-4 h-4 inline-block mr-2" />
          Pending Invites ({pendingInvitations.length})
        </button>
        <button
          onClick={() => setActiveTab('self-registered')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeTab === 'self-registered'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <UserCog className="w-4 h-4 inline-block mr-2" />
          Self-Registered ({selfRegistered.length})
        </button>
      </div>

      {/* Organizations Tab */}
      {activeTab === 'orgs' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Organizations</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite User
                </button>
                <Link
                  to="/admin/orgs/new"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  Add Organization
                </Link>
              </div>
            </div>
          </div>

          {orgs.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations yet</h3>
              <p className="text-gray-500 mb-4">Create your first organization to get started</p>
              <Link
                to="/admin/orgs/new"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700"
              >
                <Building2 className="w-4 h-4" />
                Create Organization
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orgs.map((org) => (
                <Link
                  key={org.id}
                  to={`/admin/orgs/${org.slug}`}
                  className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-700 to-teal-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{org.name}</h3>
                    <p className="text-sm text-gray-500">/{org.slug}</p>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{org.member_count}</p>
                      <p className="text-gray-500">Members</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{org.active_links}</p>
                      <p className="text-gray-500">Invites</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pending Invitations Tab */}
      {activeTab === 'invitations' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Pending Invitations</h2>
                <p className="text-sm text-gray-500 mt-1">Active invitation links awaiting use</p>
              </div>
              <button
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Create Invitation
              </button>
            </div>
          </div>

          {pendingInvitations.length === 0 ? (
            <div className="p-12 text-center">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending invitations</h3>
              <p className="text-gray-500">Create invitations to add users to organizations</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingInvitations.map((inv) => (
                <div key={inv.id} className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      inv.role === 'admin' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {inv.role === 'admin' ? (
                        <Shield className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Users className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {inv.email || 'Shareable Link'}
                        </span>
                        {inv.first_name && (
                          <span className="text-gray-500">
                            ({inv.first_name} {inv.last_name})
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          inv.role === 'admin'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {inv.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        <Building2 className="w-3.5 h-3.5 inline mr-1" />
                        {inv.org_name}
                        {inv.max_uses && (
                          <span className="ml-3">
                            Used: {inv.use_count}/{inv.max_uses}
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-1.5 bg-gray-100 rounded text-xs text-gray-600 truncate">
                          {getJoinUrl(inv.token)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(inv.token)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Copy link"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCancelInvitation(inv.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Cancel invitation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5 inline mr-1" />
                      {new Date(inv.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Self-Registered Students Tab */}
      {activeTab === 'self-registered' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Self-Registered Students</h2>
            <p className="text-sm text-gray-500 mt-1">Students who signed up independently (not through an organization)</p>
          </div>

          {selfRegistered.length === 0 ? (
            <div className="p-12 text-center">
              <UserCog className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No self-registered students</h3>
              <p className="text-gray-500">Students who sign up independently will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {selfRegistered.map((student) => (
                <div key={student.id} className="flex items-center gap-4 p-5">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">
                      {student.display_name || student.user_email}
                    </h3>
                    <p className="text-sm text-gray-500">{student.user_email}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <Calendar className="w-4 h-4 inline-block mr-1" />
                    {new Date(student.joined_at).toLocaleDateString()}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    student.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {student.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/orgs/new"
          className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:border-blue-300 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Create Organization</h3>
              <p className="text-sm text-gray-500">Set up a new client org</p>
            </div>
          </div>
        </Link>

        <button
          onClick={() => setShowInviteModal(true)}
          className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:border-green-200 transition-colors group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <UserPlus className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Invite User</h3>
              <p className="text-sm text-gray-500">Add admin or student</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('self-registered')}
          className="p-5 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-100 hover:border-teal-200 transition-colors group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors">
              <UserCog className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Self-Registered</h3>
              <p className="text-sm text-gray-500">View independent learners</p>
            </div>
          </div>
        </button>
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <InviteUserModal
          orgs={orgs}
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            loadPendingInvitations();
            setShowInviteModal(false);
          }}
        />
      )}
    </div>
  );
}

// Invite User Modal Component
interface InviteUserModalProps {
  orgs: OrgSummary[];
  onClose: () => void;
  onSuccess: () => void;
}

function InviteUserModal({ orgs, onClose, onSuccess }: InviteUserModalProps) {
  const [selectedOrgId, setSelectedOrgId] = useState('');
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

    if (!selectedOrgId) {
      setError('Please select an organization');
      return;
    }

    setLoading(true);

    try {
      const { data, error: rpcError } = await supabase.rpc('create_invitation', {
        p_org_id: selectedOrgId,
        p_role: role,
        p_email: email || null,
        p_first_name: firstName || null,
        p_last_name: lastName || null,
        p_max_uses: email ? 1 : null, // Email-specific invites are single-use
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

      // Show success with link
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

  // Success state - show the invite link
  if (createdInvite) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Invitation Created!</h2>
              <button
                onClick={onSuccess}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invite Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/join/${createdInvite.token}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={copyInviteLink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 text-center">
              Share this link with the user. They'll use it to sign up or log in and join the organization.
            </p>

            <button
              onClick={onSuccess}
              className="w-full mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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
            <h2 className="text-lg font-semibold text-gray-900">Invite User</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Create an invitation link for a new user. Optionally specify their email for a personalized invite.
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
              Organization <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            >
              <option value="">Select an organization</option>
              {orgs.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

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
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="user@example.com"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to create a shareable link anyone can use
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
