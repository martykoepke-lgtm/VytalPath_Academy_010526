/*
  # Create Medical Terms Reference Table

  ## Overview
  Creates a comprehensive medical terminology reference system with full-text search,
  trigram matching, and intelligent ranking for abbreviation expansion and term lookup.

  ## New Tables
  
  ### `medical_terms`
  Core table storing medical terminology with rich metadata:
  - `id` (uuid, primary key) - Unique identifier
  - `term` (text, required) - The medical term or abbreviation
  - `term_lc` (text) - Lowercase version for matching
  - `is_abbreviation` (boolean) - Whether this is an abbreviation
  - `full_form` (text, nullable) - Full expansion of abbreviation
  - `category` (text, nullable) - Classification (Condition, Procedure, Diagnostic, etc.)
  - `breakdown` (text, nullable) - Etymology (prefix/root/suffix breakdown)
  - `definition` (text, required) - Concise 1-3 sentence definition
  - `example_usage` (text, nullable) - Usage example in context
  - `synonyms` (text[], default empty) - Alternative names
  - `aliases` (text[], default empty) - Other recognized forms
  - `tags` (text[], default empty) - Search/filter tags
  - `tsv` (tsvector) - Full-text search vector with weighted fields
  - `created_at` (timestamptz) - Record creation timestamp

  ## Indexes
  1. GIN index on `tsv` for fast full-text search
  2. GIN index on `term_lc` with pg_trgm for fuzzy/trigram matching
  3. Index on `category` for filtering
  4. GIN indexes on array fields (synonyms, aliases, tags)

  ## Security (RLS)
  - RLS enabled on medical_terms table
  - Public read access for anonymous and authenticated users
  - Write operations restricted to service_role only
  - Ensures data integrity while allowing broad read access

  ## Extensions
  - `pg_trgm` for trigram similarity matching
  - `unaccent` for accent-insensitive search

  ## Notes
  - Triggers automatically maintain lowercase and search vectors
  - Weighted search: term (A) > full_form/synonyms (B) > definition (C)
  - Optimized for <200ms query performance on 10k+ records
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Create medical terms table
CREATE TABLE IF NOT EXISTS medical_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL,
  term_lc text,
  is_abbreviation boolean DEFAULT false,
  full_form text,
  category text,
  breakdown text,
  definition text NOT NULL,
  example_usage text,
  synonyms text[] DEFAULT '{}',
  aliases text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  tsv tsvector
);

-- Create function to update term_lc and tsv
CREATE OR REPLACE FUNCTION update_medical_terms_search_fields()
RETURNS TRIGGER AS $$
BEGIN
  NEW.term_lc := lower(unaccent(NEW.term));
  NEW.tsv := 
    setweight(to_tsvector('english', coalesce(NEW.term, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.full_form, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(NEW.synonyms, ' ')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.definition, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create trigger to maintain search fields
CREATE TRIGGER trigger_update_medical_terms_search_fields
  BEFORE INSERT OR UPDATE ON medical_terms
  FOR EACH ROW
  EXECUTE FUNCTION update_medical_terms_search_fields();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_medical_terms_tsv ON medical_terms USING GIN (tsv);
CREATE INDEX IF NOT EXISTS idx_medical_terms_term_lc_trgm ON medical_terms USING GIN (term_lc gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_medical_terms_category ON medical_terms (category);
CREATE INDEX IF NOT EXISTS idx_medical_terms_synonyms ON medical_terms USING GIN (synonyms);
CREATE INDEX IF NOT EXISTS idx_medical_terms_aliases ON medical_terms USING GIN (aliases);
CREATE INDEX IF NOT EXISTS idx_medical_terms_tags ON medical_terms USING GIN (tags);

-- Enable Row Level Security
ALTER TABLE medical_terms ENABLE ROW LEVEL SECURITY;

-- Allow public read access for all users
CREATE POLICY "Public read access for medical terms"
  ON medical_terms
  FOR SELECT
  TO anon, authenticated
  USING (true);