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
  Briefcase,
  BarChart3,
  Search,
  Compass,
  Monitor,
  type LucideIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type NavItem = {
  path: string;
  label: string;
  icon: LucideIcon;
};

// Student navigation items - ordered for optimal learning progression
// 1. Orientation (Foundations, Compliance)
// 2. Core Competencies (Insurance & Billing, Workflows, Administration)
// 3. Reference (Terminology at end as study tool)
const studentNavItems: NavItem[] = [
  { path: '/welcome', label: 'Welcome', icon: Compass },
  { path: '/foundations', label: 'Foundations', icon: Heart },
  { path: '/medical-law-ethics', label: 'Compliance', icon: Scale },
  { path: '/insurance', label: 'Insurance & Billing', icon: DollarSign },
  { path: '/workflows', label: 'Front Office Workflows', icon: ClipboardList },
  { path: '/ehr-fundamentals', label: 'EHR & PM', icon: Monitor },
  { path: '/terminology', label: 'Terminology', icon: BookA },
  { path: '/ehr-lab', label: 'EHR Practice Lab', icon: Monitor },
  { path: '/practice', label: 'Job Readiness', icon: Briefcase },
  { path: '/progress', label: 'CMAA Progress', icon: BarChart3 },
  { path: '/search', label: 'Search', icon: Search },
];

// Super Admin navigation items
const superAdminNavItems: NavItem[] = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
];

// Org Admin navigation items (dynamic based on org slug)
const getOrgAdminNavItems = (orgSlug: string): NavItem[] => [
  { path: `/admin/orgs/${orgSlug}`, label: 'My Organization', icon: Building2 },
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
            className={`flex items-center gap-3 mx-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100/60 hover:text-gray-900'
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
            <span className="font-normal">{item.label}</span>
          </Link>
        );
      })}

      {/* Show switch to admin/learning link for admins */}
      {(roleInfo.role === 'super_admin' || roleInfo.role === 'org_admin') && (
        <div className="px-6 pt-4 mt-4 border-t border-gray-200/50">
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-gray-200/50 shadow-apple z-50">
        <div className="flex justify-around items-center h-16">
          <Link
            to={roleInfo.role === 'super_admin' ? '/admin' : `/admin/orgs/${roleInfo.orgSlug}`}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${
              location.pathname === '/admin' || location.pathname === `/admin/orgs/${roleInfo.orgSlug}`
                ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <LayoutDashboard className="w-6 h-6 mb-1" />
            <span className="text-xs font-normal">Dashboard</span>
          </Link>
          <Link
            to="/foundations"
            className="flex flex-col items-center justify-center flex-1 h-full text-gray-400 transition-all duration-300"
          >
            <BookOpen className="w-6 h-6 mb-1" />
            <span className="text-xs font-normal">Learning</span>
          </Link>
        </div>
      </nav>
    );
  }

  // Student mobile navigation (5 learning sections)
  const mobileItems = studentNavItems.slice(0, 5);
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-gray-200/50 shadow-apple z-50">
      <div className="flex justify-around items-center h-16">
        {mobileItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-normal">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
