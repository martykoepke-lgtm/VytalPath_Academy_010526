/*
  # Add SOP Categories and Patient Types

  1. Changes
    - Add `category` column to sops table to organize workflows chronologically
    - Add `patient_type` column to indicate if SOP applies to new, existing, or both patient types
    - Update existing records to have default values
  
  2. Categories
    - opening-closing: Opening and closing procedures
    - scheduling: Phone-based scheduling and registration
    - checkin: Patient check-in procedures
    - checkout: Patient check-out procedures
    - during-day: Throughout the day procedures
    - closing: End of day closing procedures
  
  3. Patient Types
    - new: New patients only
    - existing: Existing patients only
    - both: Both new and existing patients
*/

-- Add category column
ALTER TABLE sops ADD COLUMN IF NOT EXISTS category text;

-- Add patient_type column
ALTER TABLE sops ADD COLUMN IF NOT EXISTS patient_type text;

-- Add check constraints for valid values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sops_category_check'
  ) THEN
    ALTER TABLE sops ADD CONSTRAINT sops_category_check 
      CHECK (category IN ('opening-closing', 'scheduling', 'checkin', 'checkout', 'during-day', 'closing'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sops_patient_type_check'
  ) THEN
    ALTER TABLE sops ADD CONSTRAINT sops_patient_type_check 
      CHECK (patient_type IN ('new', 'existing', 'both'));
  END IF;
END $$;

-- Update existing records with default values
UPDATE sops SET category = 'during-day' WHERE category IS NULL;
UPDATE sops SET patient_type = 'both' WHERE patient_type IS NULL;