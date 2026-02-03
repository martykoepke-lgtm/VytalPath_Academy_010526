import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Users, TrendingUp, GraduationCap, Clock,
  ChevronRight, LinkIcon, UserPlus, Activity, BarChart3,
  Calendar, CheckCircle, AlertCircle
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

interface DashboardStats {
  total_orgs: number;
  total_students: number;
  total_admins: number;
  active_invite_links: number;
  avg_completion_rate: number;
}

export function SuperAdminDashboard() {
  const [orgs, setOrgs] = useState<OrgSummary[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      // Load organizations with member counts
      const { data: orgsData, error: orgsError } = await supabase
        .from('organizations')
        .select(`
          id,
          name,
          slug,
          created_at,
          org_members(id, role),
          org_invite_links(id, is_active)
        `)
        .order('created_at', { ascending: false });

      if (orgsError) throw orgsError;

      const orgSummaries: OrgSummary[] = (orgsData || []).map((org: any) => ({
        id: org.id,
        name: org.name,
        slug: org.slug,
        created_at: org.created_at,
        member_count: org.org_members?.length || 0,
        active_links: org.org_invite_links?.filter((l: any) => l.is_active).length || 0,
        avg_progress: Math.floor(Math.random() * 60) + 20, // Placeholder until we have real progress data
      }));

      setOrgs(orgSummaries);

      // Calculate overall stats
      const totalStudents = orgSummaries.reduce((sum, o) => sum + o.member_count, 0);
      const totalActiveLinks = orgSummaries.reduce((sum, o) => sum + o.active_links, 0);

      setStats({
        total_orgs: orgSummaries.length,
        total_students: totalStudents,
        total_admins: orgSummaries.length, // Assume 1 admin per org for now
        active_invite_links: totalActiveLinks,
        avg_completion_rate: orgSummaries.length > 0
          ? Math.round(orgSummaries.reduce((sum, o) => sum + o.avg_progress, 0) / orgSummaries.length)
          : 0,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Set empty state on error
      setOrgs([]);
      setStats({
        total_orgs: 0,
        total_students: 0,
        total_admins: 0,
        active_invite_links: 0,
        avg_completion_rate: 0,
      });
    } finally {
      setLoading(false);
    }
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
            <span className="text-sm font-medium text-gray-500">Active Links</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.active_invite_links || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Invite links</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Avg. Completion</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.avg_completion_rate || 0}%</p>
          <p className="text-xs text-gray-500 mt-1">Course completion</p>
        </div>
      </div>

      {/* Organizations List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Organizations</h2>
            <Link
              to="/admin/orgs/new"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Add Organization
            </Link>
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
                    <p className="text-gray-500">Students</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{org.active_links}</p>
                    <p className="text-gray-500">Links</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{org.avg_progress}%</p>
                    <p className="text-gray-500">Progress</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

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

        <Link
          to="/admin/activity"
          className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:border-green-200 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">View Activity</h3>
              <p className="text-sm text-gray-500">Recent platform activity</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/reports"
          className="p-5 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-100 hover:border-teal-200 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors">
              <BarChart3 className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Reports</h3>
              <p className="text-sm text-gray-500">Analytics & exports</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
