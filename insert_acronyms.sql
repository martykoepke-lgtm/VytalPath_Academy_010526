/*
  # Insert Medical Acronyms and Abbreviations

  1. New Terms
    - 62 healthcare acronyms and abbreviations
    - Covers regulatory bodies, organizations, departments, conditions, procedures, equipment, and lab tests
    - Includes full forms, definitions, examples, and tags

  2. Categories
    - Regulatory: HIPAA, OSHA, CDC, FDA, WHO, NIH, etc.
    - Staff: ACLS, BLS, PALS certifications
    - Workflow: NICU, PICU, MICU, PACU departments
    - Condition: MRSA, ARDS, COPD, etc.
    - Specialty: CABG, PCI, ERCP procedures
    - Lab tests: CBC, BMP, CMP, etc.

  3. Security
    - Uses ON CONFLICT to prevent duplicates
    - RLS policies already exist on medical_terms table
*/

-- Insert acronyms with conflict handling
INSERT INTO medical_terms (
  term,
  category,
  is_abbreviation,
  full_form,
  breakdown,
  definition,
  example_usage,
  synonyms,
  aliases,
  tags
) VALUES
  ('OSHA', 'Regulatory', TRUE, 'Occupational Safety and Health Administration', NULL, 'Federal agency ensuring safe and healthy working conditions.', 'OSHA regulations require proper handling of biohazards.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'regulation', 'safety']),
  ('CDC', 'Regulatory', TRUE, 'Centers for Disease Control and Prevention', NULL, 'Federal agency that protects public health and safety.', 'The CDC issued new vaccination guidelines.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'organization', 'public-health']),
  ('FDA', 'Regulatory', TRUE, 'Food and Drug Administration', NULL, 'Federal agency responsible for protecting public health by regulating food drugs and medical devices.', 'The FDA approved the new medication.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'organization', 'regulation']),
  ('WHO', 'Regulatory', TRUE, 'World Health Organization', NULL, 'International organization directing global health matters.', 'The WHO declared a public health emergency.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'organization', 'international']),
  ('NIH', 'Regulatory', TRUE, 'National Institutes of Health', NULL, 'Federal agency conducting and supporting medical research.', 'The study was funded by the NIH.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'organization', 'research']),
  ('AHA', 'Regulatory', TRUE, 'American Heart Association', NULL, 'Organization focused on reducing cardiovascular disease and stroke.', 'The AHA recommends CPR training for all.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'organization', 'cardiovascular']),
  ('JCAHO', 'Regulatory', TRUE, 'Joint Commission on Accreditation of Healthcare Organizations', NULL, 'Organization that accredits healthcare facilities.', 'The hospital is preparing for JCAHO inspection.', ARRAY['The Joint Commission'], ARRAY['TJC'], ARRAY['acronym', 'organization', 'accreditation']),
  ('ACLS', 'Staff', TRUE, 'Advanced Cardiovascular Life Support', NULL, 'Advanced training for healthcare providers in cardiac emergency care.', 'All ICU nurses must be ACLS certified.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'certification', 'emergency', 'cardiovascular']),
  ('BLS', 'Staff', TRUE, 'Basic Life Support', NULL, 'Fundamental emergency care including CPR and AED use.', 'BLS certification is required for all clinical staff.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'certification', 'emergency']),
  ('PALS', 'Staff', TRUE, 'Pediatric Advanced Life Support', NULL, 'Advanced training for managing critically ill infants and children.', 'PALS certification is mandatory for pediatric nurses.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'certification', 'emergency', 'pediatrics']),
  ('NICU', 'Workflow', TRUE, 'Neonatal Intensive Care Unit', NULL, 'Specialized unit caring for premature and critically ill newborns.', 'The premature infant was admitted to the NICU.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'department', 'pediatrics', 'neonatal']),
  ('PICU', 'Workflow', TRUE, 'Pediatric Intensive Care Unit', NULL, 'Specialized unit caring for critically ill children.', 'The child with severe asthma was transferred to PICU.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'department', 'pediatrics']),
  ('SICU', 'Workflow', TRUE, 'Surgical Intensive Care Unit', NULL, 'ICU specializing in post-operative critical care.', 'The patient recovered in SICU after major surgery.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'department', 'surgery']),
  ('MICU', 'Workflow', TRUE, 'Medical Intensive Care Unit', NULL, 'ICU for medically complex patients.', 'The patient with sepsis was admitted to MICU.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'department']),
  ('MRSA', 'Condition', TRUE, 'Methicillin-Resistant Staphylococcus Aureus', NULL, 'Antibiotic-resistant bacterial infection.', 'The patient was isolated due to MRSA.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'infection', 'microbiology']),
  ('VRE', 'Condition', TRUE, 'Vancomycin-Resistant Enterococcus', NULL, 'Antibiotic-resistant bacterial infection.', 'Contact precautions were implemented for VRE.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'infection', 'microbiology']),
  ('CDIFF', 'Condition', TRUE, 'Clostridioides Difficile', NULL, 'Bacterial infection causing severe diarrhea.', 'The patient developed CDIFF after antibiotic use.', ARRAY['C. diff'], ARRAY['Clostridium difficile'], ARRAY['acronym', 'infection', 'microbiology']),
  ('ESBL', 'Condition', TRUE, 'Extended-Spectrum Beta-Lactamase', NULL, 'Enzyme produced by bacteria causing antibiotic resistance.', 'ESBL-producing bacteria require specific antibiotics.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'infection', 'microbiology']),
  ('AIDS', 'Condition', TRUE, 'Acquired Immunodeficiency Syndrome', NULL, 'Advanced stage of HIV infection.', 'The patient was diagnosed with AIDS.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'diagnosis', 'infectious-disease']),
  ('SARS', 'Condition', TRUE, 'Severe Acute Respiratory Syndrome', NULL, 'Viral respiratory illness.', 'SARS outbreak occurred in 2003.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'diagnosis', 'respiratory', 'infectious-disease']),
  ('ARDS', 'Condition', TRUE, 'Acute Respiratory Distress Syndrome', NULL, 'Severe lung condition causing breathing failure.', 'The patient developed ARDS from pneumonia.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'diagnosis', 'respiratory', 'emergency']),
  ('SIDS', 'Condition', TRUE, 'Sudden Infant Death Syndrome', NULL, 'Unexplained death of an infant under one year.', 'Safe sleep practices reduce SIDS risk.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'diagnosis', 'pediatrics']),
  ('ALS', 'Condition', TRUE, 'Amyotrophic Lateral Sclerosis', NULL, 'Progressive neurodegenerative disease affecting motor neurons.', 'ALS leads to muscle weakness and atrophy.', ARRAY['Lou Gehrig''s Disease'], ARRAY[]::text[], ARRAY['acronym', 'diagnosis', 'neurological']),
  ('CHD', 'Condition', TRUE, 'Coronary Heart Disease', NULL, 'Disease of the heart''s blood vessels.', 'CHD is a leading cause of death.', ARRAY['Coronary Artery Disease'], ARRAY[]::text[], ARRAY['acronym', 'diagnosis', 'cardiovascular']),
  ('URI', 'Condition', TRUE, 'Upper Respiratory Infection', NULL, 'Infection of the upper airways.', 'URI symptoms include congestion and sore throat.', ARRAY['Common Cold'], ARRAY[]::text[], ARRAY['acronym', 'diagnosis', 'respiratory', 'infectious-disease']),
  ('TURP', 'Specialty', TRUE, 'Transurethral Resection of the Prostate', NULL, 'Surgical procedure to remove prostate tissue.', 'TURP is performed to treat BPH.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'procedure', 'urology', 'surgery']),
  ('CABG', 'Specialty', TRUE, 'Coronary Artery Bypass Graft', NULL, 'Open-heart surgery to improve blood flow to the heart.', 'The patient underwent CABG surgery.', ARRAY['Heart Bypass'], ARRAY[]::text[], ARRAY['acronym', 'procedure', 'cardiovascular', 'surgery']),
  ('PTCA', 'Specialty', TRUE, 'Percutaneous Transluminal Coronary Angioplasty', NULL, 'Procedure to open blocked coronary arteries.', 'PTCA restored blood flow to the heart.', ARRAY['Angioplasty'], ARRAY['PCI'], ARRAY['acronym', 'procedure', 'cardiovascular']),
  ('PCI', 'Specialty', TRUE, 'Percutaneous Coronary Intervention', NULL, 'Non-surgical procedure to open blocked coronary arteries.', 'PCI involves inserting a stent.', ARRAY[]::text[], ARRAY['PTCA'], ARRAY['acronym', 'procedure', 'cardiovascular']),
  ('EGD', 'Specialty', TRUE, 'Esophagogastroduodenoscopy', NULL, 'Endoscopic examination of upper digestive tract.', 'EGD can diagnose ulcers and bleeding.', ARRAY['Upper Endoscopy'], ARRAY[]::text[], ARRAY['acronym', 'procedure', 'gastrointestinal']),
  ('ERCP', 'Specialty', TRUE, 'Endoscopic Retrograde Cholangiopancreatography', NULL, 'Procedure to diagnose and treat bile duct problems.', 'ERCP can remove gallstones from bile ducts.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'procedure', 'gastrointestinal']),
  ('CPOE', 'Workflow', TRUE, 'Computerized Physician Order Entry', NULL, 'Electronic system for entering medical orders.', 'CPOE reduces medication errors.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'technology', 'medication-safety']),
  ('PACS', 'Workflow', TRUE, 'Picture Archiving and Communication System', NULL, 'System for storing and accessing medical images.', 'PACS allows radiologists to view images remotely.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'technology', 'imaging']),
  ('NPI', 'Documentation', TRUE, 'National Provider Identifier', NULL, 'Unique identification number for healthcare providers.', 'Each physician must have an NPI number.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'identification', 'healthcare-system']),
  ('ICD', 'Documentation', TRUE, 'International Classification of Diseases', NULL, 'Standardized system for diagnostic codes.', 'ICD-10 codes are used for billing.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'coding', 'documentation']),
  ('QA', 'Workflow', TRUE, 'Quality Assurance', NULL, 'Process of ensuring healthcare meets quality standards.', 'QA reviews improve patient safety.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'quality', 'healthcare-system']),
  ('QI', 'Workflow', TRUE, 'Quality Improvement', NULL, 'Systematic approach to improving healthcare processes.', 'The QI team reduced hospital infections.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'quality', 'healthcare-system']),
  ('MAR', 'Documentation', TRUE, 'Medication Administration Record', NULL, 'Document tracking all medications given to a patient.', 'Nurses document all doses on the MAR.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'documentation', 'medication']),
  ('POMR', 'Documentation', TRUE, 'Problem-Oriented Medical Record', NULL, 'Method of recording patient information by problem.', 'POMR organizes complex patient histories.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'documentation']),
  ('AED', 'Workflow', TRUE, 'Automated External Defibrillator', NULL, 'Portable device that checks heart rhythm and delivers shock.', 'AEDs are available in public spaces.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'equipment', 'emergency', 'cardiovascular']),
  ('LVAD', 'Workflow', TRUE, 'Left Ventricular Assist Device', NULL, 'Mechanical pump supporting heart function.', 'LVAD serves as bridge to transplant.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'equipment', 'cardiovascular']),
  ('CPAP', 'Workflow', TRUE, 'Continuous Positive Airway Pressure', NULL, 'Device delivering constant air pressure for sleep apnea.', 'CPAP therapy improves sleep quality.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'equipment', 'respiratory']),
  ('BiPAP', 'Workflow', TRUE, 'Bilevel Positive Airway Pressure', NULL, 'Device delivering two levels of air pressure for breathing support.', 'BiPAP is used for respiratory failure.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'equipment', 'respiratory']),
  ('PEEP', 'Workflow', TRUE, 'Positive End-Expiratory Pressure', NULL, 'Pressure in lungs at end of expiration during mechanical ventilation.', 'PEEP prevents alveolar collapse.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'respiratory', 'ventilation']),
  ('FiO2', 'Workflow', TRUE, 'Fraction of Inspired Oxygen', NULL, 'Percentage of oxygen in air being breathed.', 'Room air has FiO2 of 21%.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'respiratory', 'measurement']),
  ('ABG', 'Workflow', TRUE, 'Arterial Blood Gas', NULL, 'Test measuring blood oxygen carbon dioxide and pH.', 'ABG results guide respiratory management.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'lab-test', 'respiratory']),
  ('INR', 'Workflow', TRUE, 'International Normalized Ratio', NULL, 'Blood test measuring clotting time.', 'INR monitoring is essential for warfarin therapy.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'lab-test', 'hematology']),
  ('PTT', 'Workflow', TRUE, 'Partial Thromboplastin Time', NULL, 'Blood test measuring clotting time.', 'PTT monitors heparin therapy.', ARRAY['Activated Partial Thromboplastin Time'], ARRAY['aPTT'], ARRAY['acronym', 'lab-test', 'hematology']),
  ('PT', 'Workflow', TRUE, 'Prothrombin Time', NULL, 'Blood test measuring blood clotting time.', 'PT is elevated in liver disease.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'lab-test', 'hematology']),
  ('ESR', 'Workflow', TRUE, 'Erythrocyte Sedimentation Rate', NULL, 'Blood test measuring inflammation.', 'Elevated ESR suggests inflammatory process.', ARRAY['Sed Rate'], ARRAY[]::text[], ARRAY['acronym', 'lab-test', 'hematology']),
  ('CRP', 'Workflow', TRUE, 'C-Reactive Protein', NULL, 'Blood test measuring inflammation.', 'CRP is elevated in infection and inflammation.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'lab-test', 'inflammatory-marker']),
  ('BNP', 'Workflow', TRUE, 'B-Type Natriuretic Peptide', NULL, 'Blood test measuring heart failure severity.', 'Elevated BNP indicates heart failure.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'lab-test', 'cardiovascular']),
  ('PSA', 'Workflow', TRUE, 'Prostate-Specific Antigen', NULL, 'Blood test screening for prostate cancer.', 'Annual PSA testing for men over 50.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'lab-test', 'oncology', 'urology']),
  ('TSH', 'Workflow', TRUE, 'Thyroid-Stimulating Hormone', NULL, 'Blood test measuring thyroid function.', 'Abnormal TSH indicates thyroid disorder.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'lab-test', 'endocrine']),
  ('HbA1c', 'Workflow', TRUE, 'Hemoglobin A1c', NULL, 'Blood test measuring average glucose over 3 months.', 'HbA1c monitors diabetes control.', ARRAY['Glycated Hemoglobin'], ARRAY['A1C'], ARRAY['acronym', 'lab-test', 'endocrine']),
  ('LDL', 'Workflow', TRUE, 'Low-Density Lipoprotein', NULL, 'Bad cholesterol that increases heart disease risk.', 'High LDL requires lifestyle changes.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'lab-test', 'cardiovascular']),
  ('HDL', 'Workflow', TRUE, 'High-Density Lipoprotein', NULL, 'Good cholesterol that protects against heart disease.', 'High HDL is protective.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'lab-test', 'cardiovascular']),
  ('VLDL', 'Workflow', TRUE, 'Very Low-Density Lipoprotein', NULL, 'Type of cholesterol carrying triglycerides.', 'Elevated VLDL increases cardiovascular risk.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'lab-test', 'cardiovascular']),
  ('LFT', 'Workflow', TRUE, 'Liver Function Test', NULL, 'Blood tests assessing liver health.', 'Abnormal LFTs suggest liver disease.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'lab-test', 'hepatology']),
  ('BMP', 'Workflow', TRUE, 'Basic Metabolic Panel', NULL, 'Blood test measuring electrolytes and kidney function.', 'BMP includes glucose sodium potassium and creatinine.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'lab-test']),
  ('CMP', 'Workflow', TRUE, 'Comprehensive Metabolic Panel', NULL, 'Expanded blood test including liver and kidney function.', 'CMP includes all BMP tests plus liver enzymes.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'lab-test']),
  ('CBC', 'Workflow', TRUE, 'Complete Blood Count', NULL, 'Blood test measuring blood cell components.', 'CBC screens for anemia and infection.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['acronym', 'lab-test', 'hematology'])
ON CONFLICT (term) DO UPDATE SET
  category = EXCLUDED.category,
  is_abbreviation = EXCLUDED.is_abbreviation,
  full_form = EXCLUDED.full_form,
  breakdown = EXCLUDED.breakdown,
  definition = EXCLUDED.definition,
  example_usage = EXCLUDED.example_usage,
  synonyms = EXCLUDED.synonyms,
  aliases = EXCLUDED.aliases,
  tags = EXCLUDED.tags;
