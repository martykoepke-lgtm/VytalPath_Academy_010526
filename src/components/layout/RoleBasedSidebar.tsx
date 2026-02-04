import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  type LucideIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type NavItem = {
  path: string;
  label: string;
  iconPath?: string;
  icon?: LucideIcon;
};

// Student navigation items
const studentNavItems: NavItem[] = [
  { path: '/foundations', label: 'Foundations', iconPath: '/icons/courses-icon.png' },
  { path: '/insurance', label: 'Insurance', iconPath: '/icons/courses-icon.png' },
  { path: '/terminology', label: 'Terminology', iconPath: '/icons/terms-icon.png' },
  { path: '/workflows', label: 'Workflows', iconPath: '/icons/workflow-icon.png' },
  { path: '/practice', label: 'Practice', iconPath: '/icons/courses-icon.png' },
  { path: '/search', label: 'Search', iconPath: '/icons/search-icon.png' },
];

// Super Admin navigation items
// Note: Organizations, Self-Registered, and Pending Admins are tabs within /admin dashboard
const superAdminNavItems: NavItem[] = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
];

// Org Admin navigation items (dynamic based on org slug)
// Note: Students and Invite Links are displayed within the org dashboard
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

  if (roleInfo.role === 'super_admin') {
    // Check if we're in admin section
    if (location.pathname.startsWith('/admin')) {
      navItems = superAdminNavItems;
      sectionTitle = 'Super Admin';
    } else {
      // Super admin can also browse student content
      navItems = studentNavItems;
      sectionTitle = 'Learning Content';
    }
  } else if (roleInfo.role === 'org_admin' && roleInfo.orgSlug) {
    // Check if we're in org admin section
    if (location.pathname.startsWith('/admin')) {
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
                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.iconPath ? (
              <img
                src={item.iconPath}
                alt={item.label}
                className={`w-6 h-6 ${isActive ? '' : 'opacity-60'}`}
              />
            ) : item.icon ? (
              <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
            ) : null}
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}

      {/* Show switch to admin/learning link for admins */}
      {(roleInfo.role === 'super_admin' || roleInfo.role === 'org_admin') && (
        <div className="px-6 pt-4 mt-4 border-t border-gray-200">
          {location.pathname.startsWith('/admin') ? (
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

  // For admins in admin section, show different mobile nav
  if ((roleInfo.role === 'super_admin' || roleInfo.role === 'org_admin') &&
      location.pathname.startsWith('/admin')) {
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

  // Student mobile navigation
  const mobileItems = studentNavItems.slice(0, 4);
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
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              {item.iconPath ? (
                <img
                  src={item.iconPath}
                  alt={item.label}
                  className={`w-6 h-6 mb-1 ${isActive ? '' : 'opacity-60'}`}
                />
              ) : item.icon ? (
                <item.icon className="w-6 h-6 mb-1" />
              ) : null}
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
