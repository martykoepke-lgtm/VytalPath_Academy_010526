-- Insert Main Categories
INSERT INTO categories (name, description, icon, sort_order) VALUES
('Insurance & Billing', 'Healthcare coverage, payment, and financial terminology', '💳', 1),
('Clinical Documentation', 'Medical records, charting, and documentation standards', '📋', 2),
('Laboratory Tests', 'Blood work, diagnostic panels, and lab procedures', '🔬', 3),
('Medical Conditions', 'Diseases, disorders, and health conditions by body system', '🏥', 4),
('Procedures & Diagnostics', 'Surgical procedures, imaging, and diagnostic tests', '🔧', 5),
('Medical Terminology', 'Prefixes, suffixes, roots, and anatomical terms', '📚', 6),
('Medical Specialties', 'Healthcare specialties and subspecialties', '👨‍⚕️', 7),
('Medications', 'Drug classes, administration, and pharmacology', '💊', 8),
('Healthcare Operations', 'Workflow, technology, and care delivery systems', '⚙️', 9),
('Regulatory & Compliance', 'Healthcare regulations, quality, and legal requirements', '⚖️', 10),
('Healthcare Roles', 'Clinical and administrative healthcare positions', '👥', 11)
ON CONFLICT (name) DO NOTHING;

-- Insert Subcategories for Insurance & Billing
INSERT INTO subcategories (category_id, name, description, sort_order)
SELECT id, 'Coverage & Plans', 'Insurance plan types and coverage concepts', 1
FROM categories WHERE name = 'Insurance & Billing'
UNION ALL
SELECT id, 'Authorization & Approval', 'Prior authorization and approval processes', 2
FROM categories WHERE name = 'Insurance & Billing'
UNION ALL
SELECT id, 'Claims & Payment', 'Billing, claims processing, and reimbursement', 3
FROM categories WHERE name = 'Insurance & Billing'
UNION ALL
SELECT id, 'Coding Systems', 'Medical coding and classification systems', 4
FROM categories WHERE name = 'Insurance & Billing';

-- Insert Subcategories for Clinical Documentation
INSERT INTO subcategories (category_id, name, description, sort_order)
SELECT id, 'Note Components', 'Parts of clinical documentation (HPI, ROS, PE)', 1
FROM categories WHERE name = 'Clinical Documentation'
UNION ALL
SELECT id, 'Note Types', 'Different types of medical notes and summaries', 2
FROM categories WHERE name = 'Clinical Documentation'
UNION ALL
SELECT id, 'Patient History', 'Medical, surgical, family, and social history', 3
FROM categories WHERE name = 'Clinical Documentation'
UNION ALL
SELECT id, 'Workflow Terms', 'Clinical workflow and care coordination', 4
FROM categories WHERE name = 'Clinical Documentation';

-- Insert Subcategories for Laboratory Tests
INSERT INTO subcategories (category_id, name, description, sort_order)
SELECT id, 'Complete Blood Count', 'CBC and blood cell measurements', 1
FROM categories WHERE name = 'Laboratory Tests'
UNION ALL
SELECT id, 'Chemistry Panels', 'Metabolic panels and chemistry tests', 2
FROM categories WHERE name = 'Laboratory Tests'
UNION ALL
SELECT id, 'Cardiac Markers', 'Heart-related laboratory tests', 3
FROM categories WHERE name = 'Laboratory Tests'
UNION ALL
SELECT id, 'Endocrine Tests', 'Hormone and endocrine function tests', 4
FROM categories WHERE name = 'Laboratory Tests'
UNION ALL
SELECT id, 'Coagulation Studies', 'Blood clotting and coagulation tests', 5
FROM categories WHERE name = 'Laboratory Tests'
UNION ALL
SELECT id, 'Microbiology', 'Cultures and infectious disease testing', 6
FROM categories WHERE name = 'Laboratory Tests'
UNION ALL
SELECT id, 'Immunology', 'Immune system and autoimmune testing', 7
FROM categories WHERE name = 'Laboratory Tests'
UNION ALL
SELECT id, 'Tumor Markers', 'Cancer screening and monitoring tests', 8
FROM categories WHERE name = 'Laboratory Tests';

-- Insert Subcategories for Medical Conditions
INSERT INTO subcategories (category_id, name, description, sort_order)
SELECT id, 'Cardiovascular', 'Heart and blood vessel conditions', 1
FROM categories WHERE name = 'Medical Conditions'
UNION ALL
SELECT id, 'Respiratory', 'Lung and breathing disorders', 2
FROM categories WHERE name = 'Medical Conditions'
UNION ALL
SELECT id, 'Gastrointestinal', 'Digestive system conditions', 3
FROM categories WHERE name = 'Medical Conditions'
UNION ALL
SELECT id, 'Endocrine', 'Hormone and metabolic disorders', 4
FROM categories WHERE name = 'Medical Conditions'
UNION ALL
SELECT id, 'Neurological', 'Brain and nervous system conditions', 5
FROM categories WHERE name = 'Medical Conditions'
UNION ALL
SELECT id, 'Musculoskeletal', 'Bone, joint, and muscle disorders', 6
FROM categories WHERE name = 'Medical Conditions'
UNION ALL
SELECT id, 'Renal & Urological', 'Kidney and urinary system conditions', 7
FROM categories WHERE name = 'Medical Conditions'
UNION ALL
SELECT id, 'Infectious Diseases', 'Bacterial, viral, and parasitic infections', 8
FROM categories WHERE name = 'Medical Conditions'
UNION ALL
SELECT id, 'Dermatological', 'Skin conditions and disorders', 9
FROM categories WHERE name = 'Medical Conditions'
UNION ALL
SELECT id, 'Hematological', 'Blood and lymphatic system disorders', 10
FROM categories WHERE name = 'Medical Conditions';

-- Insert Subcategories for Procedures & Diagnostics
INSERT INTO subcategories (category_id, name, description, sort_order)
SELECT id, 'Imaging Studies', 'X-ray, CT, MRI, and ultrasound', 1
FROM categories WHERE name = 'Procedures & Diagnostics'
UNION ALL
SELECT id, 'Surgical Procedures', 'Common surgical operations', 2
FROM categories WHERE name = 'Procedures & Diagnostics'
UNION ALL
SELECT id, 'Cardiac Procedures', 'Heart-related procedures', 3
FROM categories WHERE name = 'Procedures & Diagnostics'
UNION ALL
SELECT id, 'Endoscopy', 'Visual examination procedures', 4
FROM categories WHERE name = 'Procedures & Diagnostics'
UNION ALL
SELECT id, 'Biopsy & Aspiration', 'Tissue and fluid sampling procedures', 5
FROM categories WHERE name = 'Procedures & Diagnostics';

-- Insert Subcategories for Medical Terminology
INSERT INTO subcategories (category_id, name, description, sort_order)
SELECT id, 'Prefixes', 'Word beginnings that modify meaning', 1
FROM categories WHERE name = 'Medical Terminology'
UNION ALL
SELECT id, 'Suffixes', 'Word endings that indicate conditions or procedures', 2
FROM categories WHERE name = 'Medical Terminology'
UNION ALL
SELECT id, 'Root Words', 'Core medical terms related to body parts', 3
FROM categories WHERE name = 'Medical Terminology'
UNION ALL
SELECT id, 'Anatomical Terms', 'Directional and positional terminology', 4
FROM categories WHERE name = 'Medical Terminology'
UNION ALL
SELECT id, 'Combining Forms', 'Word parts that combine to form terms', 5
FROM categories WHERE name = 'Medical Terminology';

-- Insert Subcategories for Medical Specialties
INSERT INTO subcategories (category_id, name, description, sort_order)
SELECT id, 'Primary Care', 'Family medicine, internal medicine, pediatrics', 1
FROM categories WHERE name = 'Medical Specialties'
UNION ALL
SELECT id, 'Surgical Specialties', 'Surgical subspecialties', 2
FROM categories WHERE name = 'Medical Specialties'
UNION ALL
SELECT id, 'Medical Subspecialties', 'Internal medicine subspecialties', 3
FROM categories WHERE name = 'Medical Specialties'
UNION ALL
SELECT id, 'Diagnostic Specialties', 'Radiology, pathology, lab medicine', 4
FROM categories WHERE name = 'Medical Specialties';

-- Insert Subcategories for Medications
INSERT INTO subcategories (category_id, name, description, sort_order)
SELECT id, 'Drug Classes', 'Categories of medications by therapeutic use', 1
FROM categories WHERE name = 'Medications'
UNION ALL
SELECT id, 'Routes of Administration', 'How medications are given', 2
FROM categories WHERE name = 'Medications'
UNION ALL
SELECT id, 'Dosing Terms', 'Medication dosing and frequency', 3
FROM categories WHERE name = 'Medications'
UNION ALL
SELECT id, 'Drug Safety', 'Adverse effects and monitoring', 4
FROM categories WHERE name = 'Medications';

-- Insert Subcategories for Healthcare Operations
INSERT INTO subcategories (category_id, name, description, sort_order)
SELECT id, 'Health Information Technology', 'EHR, CPOE, and healthcare IT systems', 1
FROM categories WHERE name = 'Healthcare Operations'
UNION ALL
SELECT id, 'Patient Flow', 'Admissions, transfers, discharges', 2
FROM categories WHERE name = 'Healthcare Operations'
UNION ALL
SELECT id, 'Quality & Safety', 'Patient safety and quality improvement', 3
FROM categories WHERE name = 'Healthcare Operations'
UNION ALL
SELECT id, 'Care Coordination', 'Team-based care and transitions', 4
FROM categories WHERE name = 'Healthcare Operations';

-- Insert Subcategories for Regulatory & Compliance
INSERT INTO subcategories (category_id, name, description, sort_order)
SELECT id, 'Privacy & Security', 'HIPAA and patient privacy regulations', 1
FROM categories WHERE name = 'Regulatory & Compliance'
UNION ALL
SELECT id, 'Quality Measures', 'Performance metrics and standards', 2
FROM categories WHERE name = 'Regulatory & Compliance'
UNION ALL
SELECT id, 'Accreditation', 'Healthcare facility accreditation', 3
FROM categories WHERE name = 'Regulatory & Compliance'
UNION ALL
SELECT id, 'Payment Models', 'Value-based care and reimbursement models', 4
FROM categories WHERE name = 'Regulatory & Compliance';

-- Insert Subcategories for Healthcare Roles
INSERT INTO subcategories (category_id, name, description, sort_order)
SELECT id, 'Physicians', 'Doctor roles and specialties', 1
FROM categories WHERE name = 'Healthcare Roles'
UNION ALL
SELECT id, 'Nursing', 'Nursing roles and specializations', 2
FROM categories WHERE name = 'Healthcare Roles'
UNION ALL
SELECT id, 'Allied Health', 'Therapists, technicians, and specialists', 3
FROM categories WHERE name = 'Healthcare Roles'
UNION ALL
SELECT id, 'Administrative', 'Non-clinical healthcare positions', 4
FROM categories WHERE name = 'Healthcare Roles';
