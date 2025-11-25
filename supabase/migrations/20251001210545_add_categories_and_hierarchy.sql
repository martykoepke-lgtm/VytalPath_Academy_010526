/*
  # Add Categories and Hierarchical Structure

  1. New Tables
    - `categories` - Main category groupings (Insurance, Lab Tests, etc.)
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `icon` (text, for UI display)
      - `sort_order` (integer)
      - `created_at` (timestamptz)
    
    - `subcategories` - Second-level organization within categories
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key to categories)
      - `name` (text)
      - `description` (text)
      - `sort_order` (integer)
      - `created_at` (timestamptz)

  2. Changes
    - Add `subcategory_id` to `medical_terms` table
    - Add `related_terms` array field for cross-references
    - Add indexes for performance

  3. Security
    - Enable RLS on new tables
    - Add public read policies (educational content)
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  TO public
  USING (true);

-- Create subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subcategories are publicly readable"
  ON subcategories FOR SELECT
  TO public
  USING (true);

-- Add new columns to medical_terms
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'medical_terms' AND column_name = 'subcategory_id'
  ) THEN
    ALTER TABLE medical_terms ADD COLUMN subcategory_id uuid REFERENCES subcategories(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'medical_terms' AND column_name = 'related_terms'
  ) THEN
    ALTER TABLE medical_terms ADD COLUMN related_terms text[] DEFAULT ARRAY[]::text[];
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_sort_order ON subcategories(sort_order);
CREATE INDEX IF NOT EXISTS idx_medical_terms_subcategory_id ON medical_terms(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_medical_terms_category ON medical_terms(category);
CREATE INDEX IF NOT EXISTS idx_medical_terms_tags ON medical_terms USING gin(tags);
