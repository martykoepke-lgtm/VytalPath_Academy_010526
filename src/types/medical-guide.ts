export interface MedicalTerm {
  id: string;
  term: string;
  category: string;
  subcategory_id?: string;
  is_abbreviation: boolean;
  full_form?: string;
  breakdown?: string;
  definition: string;
  example_usage?: string;
  synonyms: string[];
  aliases: string[];
  tags: string[];
  related_terms?: string[];
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  sort_order: number;
  terms: MedicalTerm[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  sort_order: number;
  subcategories: Subcategory[];
}
