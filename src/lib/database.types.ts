export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      medical_terms: {
        Row: {
          id: string
          term: string
          term_lc: string | null
          is_abbreviation: boolean
          full_form: string | null
          category: string | null
          breakdown: string | null
          definition: string
          example_usage: string | null
          synonyms: string[]
          aliases: string[]
          tags: string[]
          created_at: string
        }
        Insert: {
          id?: string
          term: string
          term_lc?: string | null
          is_abbreviation?: boolean
          full_form?: string | null
          category?: string | null
          breakdown?: string | null
          definition: string
          example_usage?: string | null
          synonyms?: string[]
          aliases?: string[]
          tags?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          term?: string
          term_lc?: string | null
          is_abbreviation?: boolean
          full_form?: string | null
          category?: string | null
          breakdown?: string | null
          definition?: string
          example_usage?: string | null
          synonyms?: string[]
          aliases?: string[]
          tags?: string[]
          created_at?: string
        }
      }
    }
    Functions: {
      search_terms: {
        Args: {
          q: string
          max_results?: number
        }
        Returns: Array<{
          id: string
          term: string
          term_lc: string | null
          is_abbreviation: boolean
          full_form: string | null
          category: string | null
          breakdown: string | null
          definition: string
          example_usage: string | null
          synonyms: string[]
          aliases: string[]
          tags: string[]
          created_at: string
          rank_score: number
        }>
      }
    }
  }
}
