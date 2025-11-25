/*
  # Add Unique Constraint to Medical Terms
  
  This migration adds a unique constraint on the term column to prevent duplicates
  and enable upsert operations.
*/

-- Add unique constraint on term column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'medical_terms_term_key'
  ) THEN
    ALTER TABLE medical_terms ADD CONSTRAINT medical_terms_term_key UNIQUE (term);
  END IF;
END $$;
