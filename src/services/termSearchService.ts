import type { MedicalTerm } from '../types/medical';

export interface SearchResult extends MedicalTerm {
  matchScore: number;
  matchType: 'exact' | 'starts-with' | 'contains' | 'partial';
  matchField: 'term' | 'full_form' | 'definition' | 'alias';
}

/**
 * Comprehensive search service for medical terms
 * Prioritizes exact matches, then starts-with, then contains matches
 * For imaging searches: General modalities ranked above specific procedures
 */
export class TermSearchService {
  /**
   * General imaging modality terms that should be prioritized
   * These represent foundational imaging concepts, not specific procedures
   */
  private static readonly GENERAL_MODALITIES = [
    'computed tomography (ct)',
    'magnetic resonance imaging (mri)',
    'radiography (xr)',
    'x-ray (xr)',
    'ultrasound',
    'pet scan',
    'bone scan',
    'mammography',
    'fluoroscopy',
  ];

  /**
   * Search through all medical terms with intelligent prioritization
   */
  static search(terms: MedicalTerm[], query: string): SearchResult[] {
    if (!query.trim()) {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    terms.forEach((term) => {
      const matchResult = this.getMatchScore(term, normalizedQuery);
      if (matchResult) {
        results.push({
          ...term,
          ...matchResult,
        });
      }
    });

    return results.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return a.term.localeCompare(b.term);
    });
  }

  /**
   * Check if a term is a general imaging modality (not a specific procedure)
   */
  private static isGeneralModality(term: MedicalTerm): boolean {
    const termLower = term.term.toLowerCase();
    return this.GENERAL_MODALITIES.includes(termLower);
  }

  /**
   * Calculate match score and type for a term
   * Applies modality boost to prioritize general imaging modalities over specific procedures
   */
  private static getMatchScore(
    term: MedicalTerm,
    query: string
  ): { matchScore: number; matchType: SearchResult['matchType']; matchField: SearchResult['matchField'] } | null {
    const termLower = term.term.toLowerCase();
    const definitionLower = term.definition.toLowerCase();
    const fullFormLower = term.full_form?.toLowerCase() || '';
    const aliases = term.aliases?.map((a) => a.toLowerCase()) || [];

    // Determine if this is a general modality (gets +300 boost)
    const isModality = this.isGeneralModality(term);
    const modalityBoost = isModality ? 300 : 0;

    // Exact match on term (highest priority)
    if (termLower === query) {
      return { matchScore: 1000 + modalityBoost, matchType: 'exact', matchField: 'term' };
    }

    // Exact match on full form
    if (fullFormLower === query) {
      return { matchScore: 950 + modalityBoost, matchType: 'exact', matchField: 'full_form' };
    }

    // Exact match on alias
    if (aliases.some((alias) => alias === query)) {
      return { matchScore: 900 + modalityBoost, matchType: 'exact', matchField: 'alias' };
    }

    // Starts with match on term
    if (termLower.startsWith(query)) {
      return { matchScore: 800 + modalityBoost, matchType: 'starts-with', matchField: 'term' };
    }

    // Starts with match on full form
    if (fullFormLower.startsWith(query)) {
      return { matchScore: 750 + modalityBoost, matchType: 'starts-with', matchField: 'full_form' };
    }

    // Contains match on term (whole word preferred)
    if (termLower.includes(query)) {
      const isWholeWord = new RegExp(`\\b${this.escapeRegex(query)}\\b`).test(termLower);
      return {
        matchScore: (isWholeWord ? 700 : 600) + modalityBoost,
        matchType: 'contains',
        matchField: 'term',
      };
    }

    // Contains match on full form (whole word preferred)
    if (fullFormLower.includes(query)) {
      const isWholeWord = new RegExp(`\\b${this.escapeRegex(query)}\\b`).test(fullFormLower);
      return {
        matchScore: (isWholeWord ? 650 : 550) + modalityBoost,
        matchType: 'contains',
        matchField: 'full_form',
      };
    }

    // Contains match in aliases
    if (aliases.some((alias) => alias.includes(query))) {
      return { matchScore: 500 + modalityBoost, matchType: 'contains', matchField: 'alias' };
    }

    // Contains match in definition (lowest priority)
    if (definitionLower.includes(query)) {
      const isWholeWord = new RegExp(`\\b${this.escapeRegex(query)}\\b`).test(definitionLower);
      return {
        matchScore: (isWholeWord ? 400 : 300) + modalityBoost,
        matchType: 'partial',
        matchField: 'definition',
      };
    }

    return null;
  }

  /**
   * Escape special regex characters
   */
  private static escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Group results by match quality
   */
  static groupByMatchQuality(results: SearchResult[]): {
    exact: SearchResult[];
    startsWith: SearchResult[];
    contains: SearchResult[];
    partial: SearchResult[];
  } {
    return {
      exact: results.filter((r) => r.matchType === 'exact'),
      startsWith: results.filter((r) => r.matchType === 'starts-with'),
      contains: results.filter((r) => r.matchType === 'contains'),
      partial: results.filter((r) => r.matchType === 'partial'),
    };
  }
}
