import type { MedicalTerm } from '../types/medical';
import type { SOP } from '../types/sop';

export interface UnifiedSearchResult {
  type: 'term' | 'sop';
  item: MedicalTerm | SOP;
  score: number;
  matchType: 'exact' | 'starts-with' | 'word-boundary' | 'contains' | 'partial';
  matchField: string;
}

/**
 * Intelligent unified search service for Terms and SOPs
 * Prioritizes accurate matches over substring matches
 */
export class UnifiedSearchService {
  /**
   * Search across medical terms and SOPs with intelligent matching
   */
  static search(
    terms: MedicalTerm[],
    sops: SOP[],
    query: string
  ): {
    termResults: UnifiedSearchResult[];
    sopResults: UnifiedSearchResult[];
  } {
    if (!query.trim()) {
      return { termResults: [], sopResults: [] };
    }

    const normalizedQuery = query.toLowerCase().trim();

    const termResults = this.searchTerms(terms, normalizedQuery);
    const sopResults = this.searchSOPs(sops, normalizedQuery);

    return { termResults, sopResults };
  }

  /**
   * Search medical terms with intelligent matching
   */
  private static searchTerms(terms: MedicalTerm[], query: string): UnifiedSearchResult[] {
    const results: UnifiedSearchResult[] = [];

    terms.forEach((term) => {
      const matchResult = this.matchTerm(term, query);
      if (matchResult) {
        results.push({
          type: 'term',
          item: term,
          ...matchResult,
        });
      }
    });

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Search SOPs with intelligent matching
   */
  private static searchSOPs(sops: SOP[], query: string): UnifiedSearchResult[] {
    const results: UnifiedSearchResult[] = [];

    sops.forEach((sop) => {
      const matchResult = this.matchSOP(sop, query);
      if (matchResult) {
        results.push({
          type: 'sop',
          item: sop,
          ...matchResult,
        });
      }
    });

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Match a term against the query with prioritized scoring
   */
  private static matchTerm(
    term: MedicalTerm,
    query: string
  ): { score: number; matchType: UnifiedSearchResult['matchType']; matchField: string } | null {
    const termLower = term.term.toLowerCase();
    const definitionLower = term.definition.toLowerCase();
    const fullFormLower = term.full_form?.toLowerCase() || '';
    const aliases = term.aliases?.map((a) => a.toLowerCase()) || [];

    // Exact match on term (highest priority)
    if (termLower === query) {
      return { score: 1000, matchType: 'exact', matchField: 'term' };
    }

    // Exact match on full form
    if (fullFormLower === query) {
      return { score: 950, matchType: 'exact', matchField: 'full_form' };
    }

    // Exact match on alias
    if (aliases.some((alias) => alias === query)) {
      return { score: 900, matchType: 'exact', matchField: 'alias' };
    }

    // Starts with match on term
    if (termLower.startsWith(query)) {
      return { score: 800, matchType: 'starts-with', matchField: 'term' };
    }

    // Starts with match on full form
    if (fullFormLower.startsWith(query)) {
      return { score: 750, matchType: 'starts-with', matchField: 'full_form' };
    }

    // Word boundary match in term (whole word)
    const wordBoundaryRegex = new RegExp(`\\b${this.escapeRegex(query)}\\b`, 'i');
    if (wordBoundaryRegex.test(termLower)) {
      return { score: 700, matchType: 'word-boundary', matchField: 'term' };
    }

    // Word boundary match in full form
    if (wordBoundaryRegex.test(fullFormLower)) {
      return { score: 650, matchType: 'word-boundary', matchField: 'full_form' };
    }

    // Contains match in term (only for queries 3+ chars to avoid false positives)
    if (query.length >= 3 && termLower.includes(query)) {
      return { score: 500, matchType: 'contains', matchField: 'term' };
    }

    // Contains match in full form
    if (query.length >= 3 && fullFormLower.includes(query)) {
      return { score: 450, matchType: 'contains', matchField: 'full_form' };
    }

    // Word boundary match in definition
    if (wordBoundaryRegex.test(definitionLower)) {
      return { score: 400, matchType: 'word-boundary', matchField: 'definition' };
    }

    // Contains match in definition (partial match, lowest priority)
    if (query.length >= 4 && definitionLower.includes(query)) {
      return { score: 300, matchType: 'partial', matchField: 'definition' };
    }

    return null;
  }

  /**
   * Match a SOP against the query with prioritized scoring
   */
  private static matchSOP(
    sop: SOP,
    query: string
  ): { score: number; matchType: UnifiedSearchResult['matchType']; matchField: string } | null {
    const titleLower = sop.title.toLowerCase();
    const descriptionLower = sop.description?.toLowerCase() || '';

    // Exact match on title
    if (titleLower === query) {
      return { score: 1000, matchType: 'exact', matchField: 'title' };
    }

    // Starts with match on title
    if (titleLower.startsWith(query)) {
      return { score: 800, matchType: 'starts-with', matchField: 'title' };
    }

    // Word boundary match in title
    const wordBoundaryRegex = new RegExp(`\\b${this.escapeRegex(query)}\\b`, 'i');
    if (wordBoundaryRegex.test(titleLower)) {
      return { score: 700, matchType: 'word-boundary', matchField: 'title' };
    }

    // Contains match in title (only for 3+ char queries)
    if (query.length >= 3 && titleLower.includes(query)) {
      return { score: 600, matchType: 'contains', matchField: 'title' };
    }

    // Word boundary match in description
    if (wordBoundaryRegex.test(descriptionLower)) {
      return { score: 500, matchType: 'word-boundary', matchField: 'description' };
    }

    // Search in steps (word boundary only)
    for (const step of sop.steps) {
      if (wordBoundaryRegex.test(step.title.toLowerCase())) {
        return { score: 400, matchType: 'word-boundary', matchField: 'step' };
      }

      for (const detail of step.details) {
        if (wordBoundaryRegex.test(detail.toLowerCase())) {
          return { score: 350, matchType: 'word-boundary', matchField: 'step_detail' };
        }
      }
    }

    // Contains match in description (partial, lowest priority)
    if (query.length >= 4 && descriptionLower.includes(query)) {
      return { score: 300, matchType: 'partial', matchField: 'description' };
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
   * Group results by relevance tier for display
   */
  static groupByRelevance(results: UnifiedSearchResult[]): {
    highly_relevant: UnifiedSearchResult[];
    relevant: UnifiedSearchResult[];
    related: UnifiedSearchResult[];
  } {
    return {
      highly_relevant: results.filter((r) => r.score >= 700),
      relevant: results.filter((r) => r.score >= 500 && r.score < 700),
      related: results.filter((r) => r.score < 500),
    };
  }
}
