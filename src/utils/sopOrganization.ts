import type { SOP, SOPCategoryGroup, SOPCategory } from '../types/sop';
import type { LucideIcon } from 'lucide-react';
import {
  Sunrise,
  Phone,
  ClipboardCheck,
  LogOut,
  Zap,
  Moon,
  UserPlus,
  Calendar,
  UserCheck,
  ClipboardList,
  AlertCircle,
  RefreshCw,
  Clock,
  ClipboardPlus,
  DoorOpen,
  Target,
  Wallet,
  FileSpreadsheet,
  PhoneCall,
  Search,
  FileText,
  Mail,
  Bell,
  Megaphone,
  Package,
  CheckSquare
} from 'lucide-react';

export const categoryMetadata: Record<SOPCategory, { title: string; icon: LucideIcon; description: string }> = {
  'opening': {
    title: 'Opening Procedures',
    icon: Sunrise,
    description: 'Morning setup and opening procedures'
  },
  'opening-closing': {
    title: 'Opening Procedures',
    icon: Sunrise,
    description: 'Morning setup and opening procedures'
  },
  'scheduling': {
    title: 'Scheduling & Registration',
    icon: Phone,
    description: 'Phone-based scheduling and patient registration'
  },
  'insurance': {
    title: 'Insurance & Eligibility',
    icon: Search,
    description: 'Insurance verification and eligibility checks'
  },
  'compliance': {
    title: 'Forms & Compliance',
    icon: FileText,
    description: 'ROI, consent forms, and compliance documentation'
  },
  'checkin': {
    title: 'Check-In Procedures',
    icon: ClipboardCheck,
    description: 'Patient arrival and check-in workflows'
  },
  'checkout': {
    title: 'Check-Out Procedures',
    icon: LogOut,
    description: 'Completing visits and scheduling follow-ups'
  },
  'during-day': {
    title: 'Throughout the Day',
    icon: Zap,
    description: 'Managing daily operations and multi-tasking'
  },
  'closing': {
    title: 'Closing Procedures',
    icon: Moon,
    description: 'End-of-day reconciliation and closing'
  },
  'admin': {
    title: 'Administrative Tasks',
    icon: Package,
    description: 'Administrative duties and compliance logs'
  }
};

export const sopIconMap: Record<string, LucideIcon> = {
  // Opening procedures
  'phonesystemlogin': PhoneCall,
  'cashdraweropening': Wallet,
  'prescrubbing': ClipboardCheck,
  // Scheduling & Registration
  'newpatientreg': UserPlus,
  'existingpatientscheduling': Calendar,
  'schedulingfollowups': RefreshCw,
  'appointmentreminders': Bell,
  'patientoutreach': Megaphone,
  // Insurance & Compliance
  'insuranceeligibility': Search,
  'roiconsentnpp': FileText,
  // Check-in
  'newpatientcheckin': UserCheck,
  'existingpatientcheckin': ClipboardList,
  'urgentcarecheckin': AlertCircle,
  // During day
  'multitasking': Target,
  'messagemanagement': Mail,
  'statresults': Bell,
  'waitlist': ClipboardPlus,
  'noshow': Clock,
  // Check-out
  'checkout': DoorOpen,
  // Closing
  'cashdrawer': Wallet,
  'eodreconciliation': FileSpreadsheet,
  // Admin
  'noshowletters': Mail,
  'orderingsupplies': Package,
  'monthlycompliance': CheckSquare
};

export const categoryOrder: SOPCategory[] = [
  'opening',
  'opening-closing',
  'scheduling',
  'insurance',
  'compliance',
  'checkin',
  'during-day',
  'checkout',
  'closing',
  'admin'
];

export function organizeSOPsByCategory(sops: SOP[]): SOPCategoryGroup[] {
  const groups: SOPCategoryGroup[] = [];

  for (const categoryKey of categoryOrder) {
    const categorySOPs = sops.filter(sop => sop.category === categoryKey);

    if (categorySOPs.length > 0) {
      const metadata = categoryMetadata[categoryKey];
      groups.push({
        title: metadata.title,
        icon: metadata.icon,
        key: categoryKey,
        sops: categorySOPs.sort((a, b) => a.sort_order - b.sort_order)
      });
    }
  }

  return groups;
}

export function getSOPIcon(slug: string): LucideIcon {
  return sopIconMap[slug] || ClipboardList;
}

export function getPatientTypeLabel(patientType: string): string {
  switch (patientType) {
    case 'new':
      return 'New Patients';
    case 'existing':
      return 'Existing Patients';
    case 'both':
      return 'All Patients';
    default:
      return '';
  }
}

export function getPatientTypeBadgeColor(patientType: string): string {
  switch (patientType) {
    case 'new':
      return 'bg-blue-100 text-blue-700';
    case 'existing':
      return 'bg-green-100 text-green-700';
    case 'both':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}
