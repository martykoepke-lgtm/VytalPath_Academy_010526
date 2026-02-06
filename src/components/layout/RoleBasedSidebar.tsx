import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Heart,
  Scale,
  DollarSign,
  ClipboardList,
  BookA,
  Gamepad2,
  Search,
  type LucideIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type NavItem = {
  path: string;
  label: string;
  icon: LucideIcon;
  color: {
    bg: string;
    text: string;
    border: string;
    icon: string;
  };
};

// Color themes for each section
const sectionColors = {
  foundations: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-600', icon: 'text-blue-600' },
  compliance: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-600', icon: 'text-slate-600' },
  insurance: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-600', icon: 'text-emerald-600' },
  workflows: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-600', icon: 'text-amber-600' },
  administration: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-600', icon: 'text-teal-600' },
  terminology: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-600', icon: 'text-indigo-600' },
  practice: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-600', icon: 'text-rose-600' },
  search: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-600', icon: 'text-gray-600' },
};

// Student navigation items - ordered for optimal learning progression
// 1. Orientation (Foundations, Compliance)
// 2. Core Competencies (Insurance & Billing, Workflows, Administration)
// 3. Reference (Terminology at end as study tool)
const studentNavItems: NavItem[] = [
  { path: '/foundations', label: 'Foundations', icon: Heart, color: sectionColors.foundations },
  { path: '/medical-law-ethics', label: 'Compliance', icon: Scale, color: sectionColors.compliance },
  { path: '/insurance', label: 'Insurance & Billing', icon: DollarSign, color: sectionColors.insurance },
  { path: '/workflows', label: 'Workflows', icon: ClipboardList, color: sectionColors.workflows },
  { path: '/administration', label: 'Administration', icon: Building2, color: sectionColors.administration },
  { path: '/terminology', label: 'Terminology', icon: BookA, color: sectionColors.terminology },
  { path: '/practice', label: 'Practice', icon: Gamepad2, color: sectionColors.practice },
  { path: '/search', label: 'Search', icon: Search, color: sectionColors.search },
];

// Admin color
const adminColor = { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-600', icon: 'text-blue-600' };

// Super Admin navigation items
// Note: Organizations, Self-Registered, and Pending Admins are tabs within /admin dashboard
const superAdminNavItems: NavItem[] = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, color: adminColor },
];

// Org Admin navigation items (dynamic based on org slug)
// Note: Students and Invite Links are displayed within the org dashboard
const getOrgAdminNavItems = (orgSlug: string): NavItem[] => [
  { path: `/admin/orgs/${orgSlug}`, label: 'My Organization', icon: Building2, color: adminColor },
];

interface RoleBasedSidebarProps {
  className?: string;
}

export function RoleBasedSidebar({ className = '' }: RoleBasedSidebarProps) {
  const location = useLocation();
  const { roleInfo, roleLoading } = useAuth();

  // Determine which nav items to show based on role
  let navItems: NavItem[] = studentNavItems;
  let sectionTitle: string | null = null;

  // Helper to check if we're in the admin dashboard (not /administration which is a learning section)
  const isInAdminDashboard = location.pathname === '/admin' || location.pathname.startsWith('/admin/');

  if (roleInfo.role === 'super_admin') {
    // Check if we're in admin section
    if (isInAdminDashboard) {
      navItems = superAdminNavItems;
      sectionTitle = 'Super Admin';
    } else {
      // Super admin can also browse student content
      navItems = studentNavItems;
      sectionTitle = 'Learning Content';
    }
  } else if (roleInfo.role === 'org_admin' && roleInfo.orgSlug) {
    // Check if we're in org admin section
    if (isInAdminDashboard) {
      navItems = getOrgAdminNavItems(roleInfo.orgSlug);
      sectionTitle = roleInfo.orgName || 'Organization';
    } else {
      // Org admins can also access learning content
      navItems = studentNavItems;
      sectionTitle = 'Learning Content';
    }
  }

  if (roleLoading) {
    return (
      <div className={`py-4 ${className}`}>
        <div className="px-6 py-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="px-6 py-3">
            <div className="h-6 bg-gray-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`py-4 ${className}`}>
      {sectionTitle && (
        <div className="px-6 pb-2 mb-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {sectionTitle}
          </span>
        </div>
      )}
      {navItems.map((item) => {
        const isActive = location.pathname === item.path ||
          (item.path !== '/admin' && location.pathname.startsWith(item.path));
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
              isActive
                ? `${item.color.bg} ${item.color.text} border-r-4 ${item.color.border}`
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive ? item.color.icon : 'text-gray-400'}`} />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}

      {/* Show switch to admin/learning link for admins */}
      {(roleInfo.role === 'super_admin' || roleInfo.role === 'org_admin') && (
        <div className="px-6 pt-4 mt-4 border-t border-gray-200">
          {isInAdminDashboard ? (
            <Link
              to="/foundations"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              View Learning Content
            </Link>
          ) : (
            <Link
              to={roleInfo.role === 'super_admin' ? '/admin' : `/admin/orgs/${roleInfo.orgSlug}`}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// Mobile bottom navigation - simplified for students
export function MobileBottomNav() {
  const location = useLocation();
  const { roleInfo } = useAuth();

  // Check if we're in the admin dashboard (not /administration which is a learning section)
  const isInAdminDashboard = location.pathname === '/admin' || location.pathname.startsWith('/admin/');

  // For admins in admin section, show different mobile nav
  if ((roleInfo.role === 'super_admin' || roleInfo.role === 'org_admin') && isInAdminDashboard) {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          <Link
            to={roleInfo.role === 'super_admin' ? '/admin' : `/admin/orgs/${roleInfo.orgSlug}`}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              location.pathname === '/admin' || location.pathname === `/admin/orgs/${roleInfo.orgSlug}`
                ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <LayoutDashboard className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Dashboard</span>
          </Link>
          <Link
            to="/foundations"
            className="flex flex-col items-center justify-center flex-1 h-full text-gray-400"
          >
            <BookOpen className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Learning</span>
          </Link>
        </div>
      </nav>
    );
  }

  // Student mobile navigation (5 learning sections)
  const mobileItems = studentNavItems.slice(0, 5);
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {mobileItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? item.color.text : 'text-gray-400'
              }`}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
