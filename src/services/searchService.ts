import { supabase } from '../lib/supabase';
import type { MedicalTerm, SearchResult } from '../types/medical';

export async function searchMedicalTerms(query: string): Promise<SearchResult> {
  if (!query.trim()) {
    return {
      matches: [],
      query,
      found: false
    };
  }

  const startTime = performance.now();

  try {
    const { data, error } = await supabase.rpc('search_terms', {
      q: query,
      max_results: 20
    });

    const latency = Math.round(performance.now() - startTime);

    if (error) {
      console.error('Search error:', error);
      return await fallbackSearch(query);
    }

    const results = (data || []) as MedicalTerm[];

    console.log(`Search: "${query}" | Results: ${results.length} | Latency: ${latency}ms`);

    if (results.length === 0) {
      const nearest = await findNearestMatches(query);
      return {
        matches: [],
        query,
        found: false,
        nearestMatches: nearest
      };
    }

    return {
      matches: results.slice(0, 5),
      query,
      found: true
    };
  } catch (err) {
    console.error('Search exception:', err);
    return await fallbackSearch(query);
  }
}

async function fallbackSearch(query: string): Promise<SearchResult> {
  try {
    const { data, error } = await supabase
      .from('medical_terms')
      .select('*')
      .or(`term.ilike.%${query}%,aliases.cs.{${query}}`)
      .limit(5);

    if (error) throw error;

    const results = (data || []) as MedicalTerm[];

    if (results.length === 0) {
      const nearest = await findNearestMatches(query);
      return {
        matches: [],
        query,
        found: false,
        nearestMatches: nearest
      };
    }

    return {
      matches: results,
      query,
      found: true
    };
  } catch (err) {
    console.error('Fallback search error:', err);
    return {
      matches: [],
      query,
      found: false
    };
  }
}

async function findNearestMatches(query: string): Promise<MedicalTerm[]> {
  try {
    const { data, error } = await supabase
      .from('medical_terms')
      .select('*')
      .limit(3);

    if (error) throw error;

    return (data || []) as MedicalTerm[];
  } catch (err) {
    console.error('Error finding nearest matches:', err);
    return [];
  }
}
