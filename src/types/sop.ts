export interface SOPStep {
  title: string;
  details: string[];
}

export type SOPCategory = 'opening-closing' | 'scheduling' | 'checkin' | 'checkout' | 'during-day' | 'closing';
export type PatientType = 'new' | 'existing' | 'both';

export interface SOP {
  id: string;
  slug: string;
  title: string;
  icon: string;
  description: string | null;
  sort_order: number;
  category: SOPCategory;
  patient_type: PatientType;
  steps: SOPStep[];
  created_at: string;
  updated_at: string;
}

export interface SOPCategoryGroup {
  title: string;
  icon: any;
  key: SOPCategory;
  sops: SOP[];
}

export interface SOPProgress {
  id: string;
  session_id: string;
  sop_id: string;
  completed_steps: number[];
  last_accessed: string;
  created_at: string;
}
