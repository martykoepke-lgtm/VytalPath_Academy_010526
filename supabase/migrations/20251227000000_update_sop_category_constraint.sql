/*
  # Update SOP Category Constraint

  This migration updates the category constraint to allow new categories
  needed for the comprehensive front office workflows.

  NEW CATEGORIES:
  - opening: Morning setup procedures
  - insurance: Insurance verification workflows
  - compliance: Forms and compliance documentation
  - admin: Administrative tasks
*/

-- Drop the existing constraint
ALTER TABLE sops DROP CONSTRAINT IF EXISTS sops_category_check;

-- Add the new constraint with all categories
ALTER TABLE sops ADD CONSTRAINT sops_category_check
  CHECK (category IN (
    'opening',
    'opening-closing',
    'scheduling',
    'insurance',
    'compliance',
    'checkin',
    'checkout',
    'during-day',
    'closing',
    'admin'
  ));
