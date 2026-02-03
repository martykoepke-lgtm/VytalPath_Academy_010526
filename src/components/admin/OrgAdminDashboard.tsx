import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users, LinkIcon, Copy, Check, Plus, Trash2, ChevronRight,
  GraduationCap, Clock, CheckCircle, AlertCircle, ArrowLeft,
  Building2, UserPlus, Mail, Calendar, TrendingUp, BookOpen
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  getOrganizationBySlug,
  getOrgInviteLinks,
  createInviteLink,
  deactivateInviteLink,
  getOrgMembersWithProgress,
} from '../../services/orgService';
import type { Organization, OrgInviteLink, OrgMemberWithProgress } from '../../types/organization';

export function OrgAdminDashboard() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const [org, setOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrgMemberWithProgress[]>([]);
  const [inviteLinks, setInviteLinks] = useState<OrgInviteLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [creatingLink, setCreatingLink] = useState(false);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [showCreateLink, setShowCreateLink] = useState(false);

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

      // Load invite links
      const links = await getOrgInviteLinks(orgData.id);
      setInviteLinks(links);

      // Load members with progress
      const membersData = await getOrgMembersWithProgress(orgData.id);
      setMembers(membersData);
    } catch (error) {
      console.error('Error loading org data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateLink() {
    if (!org) return;

    try {
      setCreatingLink(true);
      const link = await createInviteLink({
        org_id: org.id,
        label: newLinkLabel || undefined,
      });
      setInviteLinks([link, ...inviteLinks]);
      setNewLinkLabel('');
      setShowCreateLink(false);
    } catch (error) {
      console.error('Error creating link:', error);
    } finally {
      setCreatingLink(false);
    }
  }

  async function handleDeactivateLink(linkId: string) {
    try {
      await deactivateInviteLink(linkId);
      setInviteLinks(inviteLinks.filter((l) => l.id !== linkId));
    } catch (error) {
      console.error('Error deactivating link:', error);
    }
  }

  function copyToClipboard(code: string) {
    const url = `${window.location.origin}/join/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(code);
    setTimeout(() => setCopiedLink(null), 2000);
  }

  function getJoinUrl(code: string) {
    return `${window.location.origin}/join/${code}`;
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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Platform Overview
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-700 to-teal-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{org.name}</h1>
            <p className="text-gray-500">Organization Dashboard</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Total Students</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{members.length}</p>
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
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-teal-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Completed</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{completedStudents}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
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
              <p className="text-gray-500">Share an invite link to add students</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {members.map((member) => {
                // Calculate overall progress
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
                    </div>

                    {/* Course breakdown */}
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

        {/* Invite Links */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Invite Links</h2>
              <button
                onClick={() => setShowCreateLink(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Link
              </button>
            </div>
          </div>

          {/* Create Link Form */}
          {showCreateLink && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <input
                type="text"
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                placeholder="Link label (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleCreateLink}
                  disabled={creatingLink}
                  className="flex-1 px-3 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50"
                >
                  {creatingLink ? 'Creating...' : 'Create Link'}
                </button>
                <button
                  onClick={() => setShowCreateLink(false)}
                  className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {inviteLinks.length === 0 && !showCreateLink ? (
            <div className="p-8 text-center">
              <LinkIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No invite links yet</p>
              <button
                onClick={() => setShowCreateLink(true)}
                className="mt-3 text-sm text-teal-600 hover:text-teal-700"
              >
                Create your first link
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {inviteLinks.map((link) => (
                <div key={link.id} className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {link.label || 'Invite Link'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Used {link.use_count} times
                        {link.max_uses && ` / ${link.max_uses} max`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeactivateLink(link.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Deactivate link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-2 py-1.5 bg-gray-100 rounded text-xs text-gray-600 truncate">
                      {getJoinUrl(link.code)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(link.code)}
                      className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      title="Copy link"
                    >
                      {copiedLink === link.code ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
