import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: 'teal' | 'blue' | 'indigo' | 'emerald' | 'violet' | 'rose' | 'cyan';
  metric?: string | number;
  badge?: string;
  onClick?: () => void;
  featured?: boolean;
}

const colorConfig = {
  teal: {
    iconBg: 'bg-gradient-to-br from-teal-500 to-cyan-600 shadow-md',
    iconBgHover: 'group-hover:from-teal-600 group-hover:to-cyan-700',
    iconColor: 'text-white',
    border: 'hover:border-teal-200',
    metricColor: 'text-teal-600',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-700',
  },
  blue: {
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-md',
    iconBgHover: 'group-hover:from-blue-600 group-hover:to-cyan-700',
    iconColor: 'text-white',
    border: 'hover:border-blue-200',
    metricColor: 'text-blue-600',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
  },
  indigo: {
    iconBg: 'bg-gradient-to-br from-indigo-500 to-blue-600 shadow-md',
    iconBgHover: 'group-hover:from-indigo-600 group-hover:to-blue-700',
    iconColor: 'text-white',
    border: 'hover:border-indigo-200',
    metricColor: 'text-indigo-600',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-700',
  },
  emerald: {
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md',
    iconBgHover: 'group-hover:from-emerald-600 group-hover:to-teal-700',
    iconColor: 'text-white',
    border: 'hover:border-emerald-200',
    metricColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
  },
  violet: {
    iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-md',
    iconBgHover: 'group-hover:from-violet-600 group-hover:to-purple-700',
    iconColor: 'text-white',
    border: 'hover:border-violet-200',
    metricColor: 'text-violet-600',
    badgeBg: 'bg-violet-100',
    badgeText: 'text-violet-700',
  },
  rose: {
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-md',
    iconBgHover: 'group-hover:from-rose-600 group-hover:to-pink-700',
    iconColor: 'text-white',
    border: 'hover:border-rose-200',
    metricColor: 'text-rose-600',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-700',
  },
  cyan: {
    iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md',
    iconBgHover: 'group-hover:from-cyan-600 group-hover:to-blue-700',
    iconColor: 'text-white',
    border: 'hover:border-cyan-200',
    metricColor: 'text-cyan-600',
    badgeBg: 'bg-cyan-100',
    badgeText: 'text-cyan-700',
  },
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  metric,
  badge,
  onClick,
  featured = false,
}: FeatureCardProps) {
  const colors = colorConfig[color];

  const baseClasses = `
    bg-white rounded-xl shadow-md p-6 text-left group
    border-2 border-transparent transition-all duration-300
    ${colors.border}
    ${onClick ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1' : ''}
    ${featured ? 'ring-2 ring-offset-2 ring-teal-500' : ''}
  `;

  const Component = onClick ? 'button' : 'div';

  return (
    <Component onClick={onClick} className={baseClasses}>
      {badge && (
        <div className="mb-3">
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${colors.badgeBg} ${colors.badgeText}`}>
            {badge}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center transition-colors duration-300 ${colors.iconBgHover}`}>
          <Icon className={`w-6 h-6 ${colors.iconColor}`} />
        </div>
        {metric && (
          <div className="text-right">
            <p className={`text-2xl font-bold ${colors.metricColor}`}>{metric}</p>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Component>
  );
}
