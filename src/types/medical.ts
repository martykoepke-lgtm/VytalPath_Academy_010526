export interface MedicalTerm {
  id: string;
  term: string;
  term_lc: string | null;
  is_abbreviation: boolean;
  full_form: string | null;
  category: string | null;
  breakdown: string | null;
  definition: string;
  example_usage: string | null;
  synonyms: string[];
  aliases: string[];
  tags: string[];
  created_at: string;
  rank_score?: number;
}

export interface SearchResult {
  matches: MedicalTerm[];
  query: string;
  found: boolean;
  nearestMatches?: MedicalTerm[];
}
