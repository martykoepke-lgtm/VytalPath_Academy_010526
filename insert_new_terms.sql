-- Generated SQL for /tmp/cc-agent/57865045/project/new_terms.csv
-- Total records: 163

-- Batch 1
INSERT INTO medical_terms (term, category, is_abbreviation, full_form, breakdown, definition, example_usage, synonyms, aliases, tags)
VALUES
  ('RTE', 'Insurance', true, 'Real-Time Eligibility', null, 'An electronic check that verifies patient''s active insurance coverage and benefits before services are provided.', 'Front desk staff run RTE before scheduling.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['insurance','billing']),
  ('Co-pay', 'Insurance', false, 'Co-payment', null, 'A fixed amount a patient pays for a healthcare service usually at the time of visit.', 'Patient paid a $20 co-pay at check-in.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['insurance','billing']),
  ('Deductible', 'Insurance', false, 'Insurance Deductible', null, 'The amount a patient must pay for covered services before insurance begins to pay.', 'The patient has a $1500 deductible to meet.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['insurance','billing']),
  ('Coinsurance', 'Insurance', false, 'Coinsurance', null, 'The percentage of costs the patient pays after meeting the deductible.', 'Patient responsible for 20% coinsurance.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['insurance','billing']),
  ('EOB', 'Insurance', true, 'Explanation of Benefits', null, 'A statement from insurance showing what was covered and what the patient owes.', 'Review the EOB to understand claim payment.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['insurance','billing']),
  ('OOP', 'Insurance', true, 'Out-of-Pocket', null, 'The maximum amount a patient pays during a policy period before insurance covers 100%.', 'Patient has reached their $5000 OOP maximum.', ARRAY[]::text[], ARRAY['out-of-pocket maximum'], ARRAY['insurance','billing']),
  ('Prior Auth', 'Insurance', false, 'Prior Authorization', null, 'Insurance approval required before certain services or medications can be provided.', 'MRI requires prior auth before scheduling.', ARRAY[]::text[], ARRAY['PA','pre-authorization'], ARRAY['insurance','billing','approval']),
  ('PPO', 'Insurance', true, 'Preferred Provider Organization', null, 'A type of health insurance plan that offers flexibility to see any provider with lower costs for in-network.', 'Patient has a PPO plan and can self-refer.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['insurance','plan-type']),
  ('HMO', 'Insurance', true, 'Health Maintenance Organization', null, 'A type of health insurance that requires members to use in-network providers and get referrals.', 'HMO patients need a referral to see specialists.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['insurance','plan-type']),
  ('POS', 'Insurance', true, 'Point of Service', null, 'A health insurance plan that combines features of HMO and PPO plans.', 'POS plan requires PCP coordination but allows out-of-network.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['insurance','plan-type']),
  ('Medicare', 'Insurance', false, 'Medicare', null, 'Federal health insurance program primarily for people 65 and older.', 'Patient is eligible for Medicare Part B.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['insurance','government']),
  ('Medicaid', 'Insurance', false, 'Medicaid', null, 'State and federal program providing health coverage for low-income individuals.', 'Patient has Medicaid coverage for the visit.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['insurance','government']),
  ('Premium', 'Insurance', false, 'Insurance Premium', null, 'The amount paid for an insurance policy typically monthly.', 'Monthly premium is $450 for family coverage.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['insurance','billing']),
  ('Covered Services', 'Insurance', false, 'Covered Services', null, 'Medical services and procedures that an insurance plan will pay for.', 'Annual physical is a covered service.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['insurance','benefits']),
  ('Exclusions', 'Insurance', false, 'Insurance Exclusions', null, 'Services or treatments that are not covered by an insurance policy.', 'Cosmetic procedures are plan exclusions.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['insurance','benefits']),
  ('In-Network', 'Insurance', false, 'In-Network Provider', null, 'Healthcare providers who have contracted with an insurance company to provide services at reduced rates.', 'Using in-network providers saves money.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['insurance','network']),
  ('Out-of-Network', 'Insurance', false, 'Out-of-Network Provider', null, 'Healthcare providers who have not contracted with an insurance company.', 'Out-of-network services have higher patient costs.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['insurance','network']),
  ('Allowable Amount', 'Insurance', false, 'Allowable Amount', null, 'The maximum amount an insurance company will pay for a covered service.', 'The allowable amount for the visit was $150.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['insurance','billing']),
  ('Claim', 'Insurance', false, 'Insurance Claim', null, 'A request for payment submitted to an insurance company for services rendered.', 'Submit the claim within 30 days of service.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['insurance','billing']),
  ('Denied Claim', 'Insurance', false, 'Denied Claim', null, 'An insurance claim that has been rejected and will not be paid.', 'The claim was denied due to missing information.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['insurance','billing']),
  ('HPI', 'Documentation', true, 'History of Present Illness', null, 'A chronological description of the development of the patient''s present illness.', 'The HPI documents onset duration and character of symptoms.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['documentation','clinical']),
  ('ROS', 'Documentation', true, 'Review of Systems', null, 'A systematic approach to collecting information about patient symptoms across body systems.', 'Complete ROS includes all 14 organ systems.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['documentation','clinical']),
  ('PE', 'Documentation', true, 'Physical Examination', null, 'The process of evaluating the patient through observation palpation and other techniques.', 'PE revealed normal heart and lung sounds.', ARRAY[]::text[], ARRAY['physical exam'], ARRAY['documentation','clinical']),
  ('Dx', 'Documentation', true, 'Diagnosis', null, 'The identification of a disease or condition based on signs and symptoms.', 'Primary Dx is type 2 diabetes mellitus.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['documentation','clinical']),
  ('Tx', 'Documentation', true, 'Treatment', null, 'Medical care provided to a patient for a condition or disease.', 'Tx includes lifestyle modifications and metformin.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['documentation','clinical'])
ON CONFLICT (term) DO UPDATE SET
  category = EXCLUDED.category,
  is_abbreviation = EXCLUDED.is_abbreviation,
  full_form = EXCLUDED.full_form,
  definition = EXCLUDED.definition,
  example_usage = EXCLUDED.example_usage,
  synonyms = EXCLUDED.synonyms,
  aliases = EXCLUDED.aliases,
  tags = EXCLUDED.tags;

-- Batch 2
INSERT INTO medical_terms (term, category, is_abbreviation, full_form, breakdown, definition, example_usage, synonyms, aliases, tags)
VALUES
  ('Encounter', 'Documentation', false, 'Patient Encounter', null, 'A single interaction between a patient and healthcare provider for assessment or treatment.', 'Document the encounter in the EHR.', ARRAY[]::text[], ARRAY['visit','appointment'], ARRAY['documentation','workflow']),
  ('Episode', 'Documentation', false, 'Episode of Care', null, 'A series of encounters related to the same condition within a specific timeframe.', 'The pneumonia episode included 3 office visits.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['documentation','workflow']),
  ('SOAP', 'Documentation', true, 'Subjective Objective Assessment Plan', null, 'A method of documentation that organizes clinical information into four sections.', 'Use SOAP format for progress notes.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['documentation','format']),
  ('CC', 'Documentation', true, 'Chief Complaint', null, 'The primary reason the patient is seeking medical care.', 'CC is chest pain for 2 hours.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['documentation','clinical']),
  ('PMH', 'Documentation', true, 'Past Medical History', null, 'A record of all previous illnesses surgeries and medical conditions.', 'PMH includes hypertension and GERD.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['documentation','clinical']),
  ('PSH', 'Documentation', true, 'Past Surgical History', null, 'A list of all previous surgical procedures the patient has undergone.', 'PSH includes appendectomy in 2010.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['documentation','clinical']),
  ('FH', 'Documentation', true, 'Family History', null, 'Information about diseases and conditions that run in the patient''s family.', 'FH significant for heart disease and diabetes.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['documentation','clinical']),
  ('SH', 'Documentation', true, 'Social History', null, 'Information about the patient''s lifestyle including smoking alcohol and occupation.', 'SH reveals 20 pack-year smoking history.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['documentation','clinical']),
  ('Allergies', 'Documentation', false, 'Allergy List', null, 'A record of substances that cause adverse reactions in the patient.', 'Allergies include penicillin and shellfish.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['documentation','clinical','safety']),
  ('Medications', 'Documentation', false, 'Medication List', null, 'A current list of all medications the patient is taking.', 'Medication list updated at every visit.', ARRAY[]::text[], ARRAY['med list','current meds'], ARRAY['documentation','clinical','safety']),
  ('Vital Signs', 'Documentation', false, 'Vital Signs', null, 'Measurements of basic body functions including temperature pulse respiration and blood pressure.', 'Vital signs stable within normal limits.', ARRAY[]::text[], ARRAY['vitals'], ARRAY['documentation','clinical']),
  ('Progress Note', 'Documentation', false, 'Progress Note', null, 'Documentation of patient status and plan during an ongoing episode of care.', 'Progress note shows improvement in symptoms.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['documentation','clinical']),
  ('Discharge Summary', 'Documentation', false, 'Discharge Summary', null, 'A report prepared when a patient leaves the hospital summarizing the stay and follow-up.', 'Discharge summary sent to PCP.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['documentation','clinical']),
  ('H&P', 'Documentation', true, 'History and Physical', null, 'A comprehensive initial evaluation including patient history and physical examination.', 'Complete H&P documented on admission.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['documentation','clinical']),
  ('Impression', 'Documentation', false, 'Clinical Impression', null, 'The clinician''s interpretation and conclusion about the patient''s condition.', 'Impression is acute bronchitis.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['documentation','clinical']),
  ('Plan of Care', 'Documentation', false, 'Plan of Care', null, 'The treatment strategy and follow-up plans for the patient''s condition.', 'Plan of care includes antibiotics and recheck in 3 days.', ARRAY[]::text[], ARRAY['treatment plan'], ARRAY['documentation','clinical']),
  ('Orders', 'Documentation', false, 'Medical Orders', null, 'Instructions for medications tests or treatments written by the provider.', 'Orders include CBC and basic metabolic panel.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['documentation','clinical']),
  ('CBC', 'Lab Panel', true, 'Complete Blood Count', null, 'A blood test that measures different components of blood including RBCs WBCs platelets hemoglobin and hematocrit.', 'Order CBC to evaluate for anemia.', ARRAY[]::text[], ARRAY['complete blood count'], ARRAY['lab','diagnostic','hematology']),
  ('WBC', 'Lab Test', true, 'White Blood Cell Count', null, 'Measures the number of white blood cells which fight infection.', 'Elevated WBC suggests infection.', ARRAY[]::text[], ARRAY['leukocyte count'], ARRAY['lab','diagnostic','hematology']),
  ('RBC', 'Lab Test', true, 'Red Blood Cell Count', null, 'Measures the number of red blood cells which carry oxygen.', 'Low RBC indicates anemia.', ARRAY[]::text[], ARRAY['erythrocyte count'], ARRAY['lab','diagnostic','hematology']),
  ('Hemoglobin', 'Lab Test', false, 'Hemoglobin', null, 'A protein in red blood cells that carries oxygen throughout the body.', 'Hemoglobin is 10.2 indicating anemia.', ARRAY[]::text[], ARRAY['Hgb','Hb'], ARRAY['lab','diagnostic','hematology']),
  ('Hematocrit', 'Lab Test', false, 'Hematocrit', null, 'The percentage of blood volume occupied by red blood cells.', 'Hematocrit of 32% is below normal.', ARRAY[]::text[], ARRAY['Hct'], ARRAY['lab','diagnostic','hematology']),
  ('Platelet Count', 'Lab Test', false, 'Platelet Count', null, 'Measures the number of platelets which help blood clot.', 'Low platelet count increases bleeding risk.', ARRAY[]::text[], ARRAY['PLT'], ARRAY['lab','diagnostic','hematology']),
  ('MCV', 'Lab Test', true, 'Mean Corpuscular Volume', null, 'Measures the average size of red blood cells.', 'High MCV suggests B12 or folate deficiency.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','hematology']),
  ('MCH', 'Lab Test', true, 'Mean Corpuscular Hemoglobin', null, 'Measures the average amount of hemoglobin per red blood cell.', 'MCH helps classify type of anemia.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','hematology'])
ON CONFLICT (term) DO UPDATE SET
  category = EXCLUDED.category,
  is_abbreviation = EXCLUDED.is_abbreviation,
  full_form = EXCLUDED.full_form,
  definition = EXCLUDED.definition,
  example_usage = EXCLUDED.example_usage,
  synonyms = EXCLUDED.synonyms,
  aliases = EXCLUDED.aliases,
  tags = EXCLUDED.tags;

-- Batch 3
INSERT INTO medical_terms (term, category, is_abbreviation, full_form, breakdown, definition, example_usage, synonyms, aliases, tags)
VALUES
  ('MCHC', 'Lab Test', true, 'Mean Corpuscular Hemoglobin Concentration', null, 'Measures the average concentration of hemoglobin in red blood cells.', 'MCHC elevated in hereditary spherocytosis.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','hematology']),
  ('RDW', 'Lab Test', true, 'Red Cell Distribution Width', null, 'Measures variation in red blood cell size.', 'Elevated RDW indicates mixed anemia types.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','hematology']),
  ('Differential', 'Lab Test', false, 'Differential Count', null, 'A breakdown of the types of white blood cells present.', 'Differential shows neutrophilia.', ARRAY[]::text[], ARRAY['diff','WBC diff'], ARRAY['lab','diagnostic','hematology']),
  ('Neutrophils', 'Lab Test', false, 'Neutrophils', null, 'A type of white blood cell that fights bacterial infections.', 'Elevated neutrophils indicate bacterial infection.', ARRAY[]::text[], ARRAY['polys','PMNs'], ARRAY['lab','diagnostic','hematology']),
  ('Lymphocytes', 'Lab Test', false, 'Lymphocytes', null, 'White blood cells important for immune response especially viral infections.', 'Elevated lymphocytes suggest viral infection.', ARRAY[]::text[], ARRAY['lymphs'], ARRAY['lab','diagnostic','hematology']),
  ('Monocytes', 'Lab Test', false, 'Monocytes', null, 'White blood cells that become macrophages and fight pathogens.', 'Elevated monocytes in chronic inflammation.', ARRAY[]::text[], ARRAY['monos'], ARRAY['lab','diagnostic','hematology']),
  ('Eosinophils', 'Lab Test', false, 'Eosinophils', null, 'White blood cells involved in allergic reactions and parasitic infections.', 'Elevated eosinophils suggest allergies or parasites.', ARRAY[]::text[], ARRAY['eos'], ARRAY['lab','diagnostic','hematology']),
  ('Basophils', 'Lab Test', false, 'Basophils', null, 'White blood cells involved in allergic and inflammatory responses.', 'Elevated basophils are rare.', ARRAY[]::text[], ARRAY['basos'], ARRAY['lab','diagnostic','hematology']),
  ('BMP', 'Lab Panel', true, 'Basic Metabolic Panel', null, 'A blood test measuring electrolytes kidney function and glucose.', 'Order BMP to check kidney function.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry']),
  ('Sodium', 'Lab Test', false, 'Sodium', null, 'An electrolyte that helps maintain fluid balance and nerve function.', 'Sodium level is 138 mEq/L.', ARRAY[]::text[], ARRAY['Na'], ARRAY['lab','diagnostic','chemistry']),
  ('Potassium', 'Lab Test', false, 'Potassium', null, 'An electrolyte critical for heart and muscle function.', 'Potassium is 4.2 mEq/L.', ARRAY[]::text[], ARRAY['K'], ARRAY['lab','diagnostic','chemistry']),
  ('Chloride', 'Lab Test', false, 'Chloride', null, 'An electrolyte that helps maintain fluid and acid-base balance.', 'Chloride level is normal at 102 mEq/L.', ARRAY[]::text[], ARRAY['Cl'], ARRAY['lab','diagnostic','chemistry']),
  ('CO2', 'Lab Test', false, 'Carbon Dioxide', null, 'Measures bicarbonate and reflects acid-base status.', 'CO2 of 24 indicates normal acid-base balance.', ARRAY[]::text[], ARRAY['bicarbonate','HCO3'], ARRAY['lab','diagnostic','chemistry']),
  ('BUN', 'Lab Test', true, 'Blood Urea Nitrogen', null, 'Measures waste product filtered by kidneys indicating kidney function.', 'Elevated BUN suggests kidney impairment.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','renal']),
  ('Creatinine', 'Lab Test', false, 'Creatinine', null, 'A waste product used to assess kidney function.', 'Creatinine of 1.8 indicates decreased kidney function.', ARRAY[]::text[], ARRAY['Cr'], ARRAY['lab','diagnostic','chemistry','renal']),
  ('Glucose', 'Lab Test', false, 'Blood Glucose', null, 'Measures the amount of sugar in the blood.', 'Fasting glucose is 110 mg/dL.', ARRAY[]::text[], ARRAY['blood sugar'], ARRAY['lab','diagnostic','chemistry','diabetes']),
  ('CMP', 'Lab Panel', true, 'Comprehensive Metabolic Panel', null, 'An expanded blood test including BMP plus liver function tests and proteins.', 'Order CMP for complete metabolic assessment.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry']),
  ('Total Protein', 'Lab Test', false, 'Total Protein', null, 'Measures all proteins in blood including albumin and globulin.', 'Total protein helps assess nutrition and liver function.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry']),
  ('Albumin', 'Lab Test', false, 'Albumin', null, 'A protein made by the liver important for maintaining fluid balance.', 'Low albumin indicates malnutrition or liver disease.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry']),
  ('AST', 'Lab Test', true, 'Aspartate Aminotransferase', null, 'A liver enzyme that indicates liver damage when elevated.', 'AST of 85 suggests liver inflammation.', ARRAY[]::text[], ARRAY['SGOT'], ARRAY['lab','diagnostic','chemistry','hepatic']),
  ('ALT', 'Lab Test', true, 'Alanine Aminotransferase', null, 'A liver enzyme more specific to liver damage than AST.', 'Elevated ALT indicates hepatocellular injury.', ARRAY[]::text[], ARRAY['SGPT'], ARRAY['lab','diagnostic','chemistry','hepatic']),
  ('ALP', 'Lab Test', true, 'Alkaline Phosphatase', null, 'An enzyme found in liver and bone elevated in cholestasis and bone disorders.', 'Elevated ALP suggests biliary obstruction.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','hepatic']),
  ('Total Bilirubin', 'Lab Test', false, 'Total Bilirubin', null, 'A breakdown product of red blood cells elevated in liver disease or hemolysis.', 'Elevated bilirubin causes jaundice.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','hepatic']),
  ('Direct Bilirubin', 'Lab Test', false, 'Direct Bilirubin', null, 'Conjugated bilirubin elevated in biliary obstruction.', 'Direct bilirubin is elevated in cholestasis.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','hepatic']),
  ('Indirect Bilirubin', 'Lab Test', false, 'Indirect Bilirubin', null, 'Unconjugated bilirubin elevated in hemolysis.', 'Indirect bilirubin elevated in hemolytic anemia.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','hepatic'])
ON CONFLICT (term) DO UPDATE SET
  category = EXCLUDED.category,
  is_abbreviation = EXCLUDED.is_abbreviation,
  full_form = EXCLUDED.full_form,
  definition = EXCLUDED.definition,
  example_usage = EXCLUDED.example_usage,
  synonyms = EXCLUDED.synonyms,
  aliases = EXCLUDED.aliases,
  tags = EXCLUDED.tags;

-- Batch 4
INSERT INTO medical_terms (term, category, is_abbreviation, full_form, breakdown, definition, example_usage, synonyms, aliases, tags)
VALUES
  ('Calcium', 'Lab Test', false, 'Calcium', null, 'An electrolyte important for bone health nerve and muscle function.', 'Calcium level is 9.5 mg/dL.', ARRAY[]::text[], ARRAY['Ca'], ARRAY['lab','diagnostic','chemistry']),
  ('Lipid Panel', 'Lab Panel', false, 'Lipid Panel', null, 'A blood test measuring cholesterol and triglycerides to assess cardiovascular risk.', 'Fasting lipid panel shows elevated LDL.', ARRAY[]::text[], ARRAY['cholesterol panel'], ARRAY['lab','diagnostic','chemistry','cardiology']),
  ('Total Cholesterol', 'Lab Test', false, 'Total Cholesterol', null, 'Measures all cholesterol in blood including HDL and LDL.', 'Total cholesterol is 220 mg/dL.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','cardiology']),
  ('HDL', 'Lab Test', true, 'High-Density Lipoprotein', null, 'Good cholesterol that helps remove other forms of cholesterol from bloodstream.', 'HDL of 55 mg/dL is protective.', ARRAY[]::text[], ARRAY['good cholesterol'], ARRAY['lab','diagnostic','chemistry','cardiology']),
  ('LDL', 'Lab Test', true, 'Low-Density Lipoprotein', null, 'Bad cholesterol that can build up in arteries increasing heart disease risk.', 'LDL of 150 mg/dL is above target.', ARRAY[]::text[], ARRAY['bad cholesterol'], ARRAY['lab','diagnostic','chemistry','cardiology']),
  ('Triglycerides', 'Lab Test', false, 'Triglycerides', null, 'A type of fat in blood elevated levels increase cardiovascular risk.', 'Triglycerides are 180 mg/dL.', ARRAY[]::text[], ARRAY['TG'], ARRAY['lab','diagnostic','chemistry','cardiology']),
  ('VLDL', 'Lab Test', true, 'Very Low-Density Lipoprotein', null, 'A type of cholesterol that carries triglycerides in blood.', 'VLDL is calculated from triglycerides.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','cardiology']),
  ('HbA1c', 'Lab Test', true, 'Hemoglobin A1c', null, 'Measures average blood glucose over the past 2-3 months used to diagnose and monitor diabetes.', 'HbA1c of 7.2% indicates suboptimal diabetes control.', ARRAY[]::text[], ARRAY['glycated hemoglobin','A1c'], ARRAY['lab','diagnostic','chemistry','diabetes']),
  ('Thyroid Panel', 'Lab Panel', false, 'Thyroid Panel', null, 'A group of tests measuring thyroid function including TSH T3 and T4.', 'Thyroid panel ordered to evaluate hypothyroidism.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','endocrine']),
  ('TSH', 'Lab Test', true, 'Thyroid-Stimulating Hormone', null, 'A hormone that regulates thyroid function elevated in hypothyroidism.', 'TSH of 8.5 indicates hypothyroidism.', ARRAY[]::text[], ARRAY['thyrotropin'], ARRAY['lab','diagnostic','chemistry','endocrine']),
  ('T3', 'Lab Test', true, 'Triiodothyronine', null, 'Active thyroid hormone important for metabolism.', 'Free T3 helps assess thyroid function.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','endocrine']),
  ('T4', 'Lab Test', true, 'Thyroxine', null, 'Main hormone produced by thyroid gland.', 'Free T4 measures unbound hormone.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','endocrine']),
  ('Free T3', 'Lab Test', false, 'Free Triiodothyronine', null, 'Unbound active thyroid hormone available to tissues.', 'Free T3 is low in hypothyroidism.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','endocrine']),
  ('Free T4', 'Lab Test', false, 'Free Thyroxine', null, 'Unbound thyroid hormone not attached to proteins.', 'Free T4 is the preferred thyroid function test.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','endocrine']),
  ('Coagulation Panel', 'Lab Panel', false, 'Coagulation Panel', null, 'Tests measuring blood clotting function including PT PTT and INR.', 'Coag panel ordered before surgery.', ARRAY[]::text[], ARRAY['coag panel'], ARRAY['lab','diagnostic','hematology']),
  ('PT', 'Lab Test', true, 'Prothrombin Time', null, 'Measures how long it takes blood to clot evaluates extrinsic clotting pathway.', 'PT is 12.5 seconds within normal range.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','hematology','coagulation']),
  ('INR', 'Lab Test', true, 'International Normalized Ratio', null, 'Standardized measure of PT used to monitor warfarin therapy.', 'INR goal is 2-3 for atrial fibrillation.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','hematology','coagulation']),
  ('PTT', 'Lab Test', true, 'Partial Thromboplastin Time', null, 'Measures intrinsic clotting pathway used to monitor heparin therapy.', 'PTT is prolonged on heparin therapy.', ARRAY[]::text[], ARRAY['aPTT'], ARRAY['lab','diagnostic','hematology','coagulation']),
  ('D-dimer', 'Lab Test', false, 'D-dimer', null, 'A fibrin degradation product elevated in blood clots.', 'Elevated D-dimer suggests possible DVT or PE.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','hematology','coagulation']),
  ('Iron Studies', 'Lab Panel', false, 'Iron Studies', null, 'A group of tests evaluating iron status including serum iron TIBC ferritin and transferrin.', 'Iron studies ordered to evaluate anemia.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','hematology']),
  ('Serum Iron', 'Lab Test', false, 'Serum Iron', null, 'Measures the amount of iron in blood.', 'Low serum iron suggests iron deficiency.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','hematology']),
  ('TIBC', 'Lab Test', true, 'Total Iron-Binding Capacity', null, 'Measures blood''s capacity to bind and transport iron.', 'Elevated TIBC in iron deficiency anemia.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','hematology']),
  ('Ferritin', 'Lab Test', false, 'Ferritin', null, 'A protein that stores iron reflects total body iron stores.', 'Low ferritin confirms iron deficiency.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','hematology']),
  ('Transferrin', 'Lab Test', false, 'Transferrin', null, 'A protein that transports iron in blood.', 'Transferrin saturation helps diagnose iron disorders.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','hematology']),
  ('CRP', 'Lab Test', true, 'C-Reactive Protein', null, 'A marker of inflammation in the body elevated in infections and inflammatory conditions.', 'Elevated CRP indicates active inflammation.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','inflammation'])
ON CONFLICT (term) DO UPDATE SET
  category = EXCLUDED.category,
  is_abbreviation = EXCLUDED.is_abbreviation,
  full_form = EXCLUDED.full_form,
  definition = EXCLUDED.definition,
  example_usage = EXCLUDED.example_usage,
  synonyms = EXCLUDED.synonyms,
  aliases = EXCLUDED.aliases,
  tags = EXCLUDED.tags;

-- Batch 5
INSERT INTO medical_terms (term, category, is_abbreviation, full_form, breakdown, definition, example_usage, synonyms, aliases, tags)
VALUES
  ('ESR', 'Lab Test', true, 'Erythrocyte Sedimentation Rate', null, 'A nonspecific test measuring inflammation by how fast RBCs settle.', 'Elevated ESR suggests inflammatory process.', ARRAY[]::text[], ARRAY['sed rate'], ARRAY['lab','diagnostic','hematology','inflammation']),
  ('Troponin', 'Lab Test', false, 'Troponin', null, 'A cardiac enzyme released during heart muscle damage used to diagnose heart attack.', 'Elevated troponin confirms myocardial infarction.', ARRAY[]::text[], ARRAY['cTn','troponin I','troponin T'], ARRAY['lab','diagnostic','chemistry','cardiology']),
  ('BNP', 'Lab Test', true, 'B-type Natriuretic Peptide', null, 'A hormone released by heart ventricles elevated in heart failure.', 'BNP of 450 indicates heart failure.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','cardiology']),
  ('ProBNP', 'Lab Test', true, 'N-terminal pro-B-type Natriuretic Peptide', null, 'A precursor to BNP more stable marker for heart failure.', 'NT-proBNP is elevated in decompensated heart failure.', ARRAY[]::text[], ARRAY['NT-proBNP'], ARRAY['lab','diagnostic','chemistry','cardiology']),
  ('PSA', 'Lab Test', true, 'Prostate-Specific Antigen', null, 'A protein produced by prostate gland elevated in prostate cancer or enlargement.', 'PSA screening in men over 50.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','oncology']),
  ('CEA', 'Lab Test', true, 'Carcinoembryonic Antigen', null, 'A tumor marker elevated in colorectal and other cancers.', 'CEA monitored in colon cancer patients.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','oncology']),
  ('CA 19-9', 'Lab Test', false, 'Carbohydrate Antigen 19-9', null, 'A tumor marker for pancreatic and gastrointestinal cancers.', 'CA 19-9 elevated in pancreatic cancer.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','oncology']),
  ('CA-125', 'Lab Test', false, 'Cancer Antigen 125', null, 'A tumor marker for ovarian cancer.', 'CA-125 monitored in ovarian cancer treatment.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','oncology']),
  ('AFP', 'Lab Test', true, 'Alpha-Fetoprotein', null, 'A tumor marker for liver cancer and germ cell tumors.', 'Elevated AFP suggests hepatocellular carcinoma.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','oncology']),
  ('Urinalysis', 'Lab Panel', false, 'Urinalysis', null, 'A test examining urine for signs of kidney disease infection or other conditions.', 'UA shows bacteria and WBCs.', ARRAY[]::text[], ARRAY['UA'], ARRAY['lab','diagnostic','urology']),
  ('Urine Culture', 'Lab Test', false, 'Urine Culture', null, 'A test to identify bacteria causing urinary tract infection.', 'Urine culture grew E. coli sensitive to ciprofloxacin.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','microbiology','urology']),
  ('Blood Culture', 'Lab Test', false, 'Blood Culture', null, 'A test to detect bacteria or fungi in bloodstream.', 'Blood cultures drawn before starting antibiotics.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','microbiology']),
  ('Sputum Culture', 'Lab Test', false, 'Sputum Culture', null, 'A test to identify organisms causing respiratory infection.', 'Sputum culture positive for Streptococcus pneumoniae.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','microbiology','pulmonary']),
  ('GFR', 'Lab Test', true, 'Glomerular Filtration Rate', null, 'Calculated estimate of kidney function based on creatinine age and gender.', 'eGFR of 55 indicates stage 3 chronic kidney disease.', ARRAY[]::text[], ARRAY['eGFR'], ARRAY['lab','diagnostic','chemistry','renal']),
  ('Microalbumin', 'Lab Test', false, 'Microalbuminuria', null, 'Small amounts of albumin in urine indicating early kidney damage.', 'Microalbumin screen positive in diabetic patient.', ARRAY[]::text[], ARRAY['urine albumin'], ARRAY['lab','diagnostic','chemistry','renal']),
  ('Vitamin D', 'Lab Test', false, '25-Hydroxyvitamin D', null, 'Measures vitamin D levels in blood.', 'Vitamin D level is 22 indicating deficiency.', ARRAY[]::text[], ARRAY['25-OH vitamin D'], ARRAY['lab','diagnostic','chemistry']),
  ('Vitamin B12', 'Lab Test', false, 'Vitamin B12', null, 'Measures B12 levels important for nerve function and RBC production.', 'Low B12 causes macrocytic anemia.', ARRAY[]::text[], ARRAY['cobalamin'], ARRAY['lab','diagnostic','chemistry']),
  ('Folate', 'Lab Test', false, 'Folate', null, 'Measures folic acid levels important for cell division and RBC production.', 'Low folate causes megaloblastic anemia.', ARRAY[]::text[], ARRAY['folic acid'], ARRAY['lab','diagnostic','chemistry']),
  ('Magnesium', 'Lab Test', false, 'Magnesium', null, 'An electrolyte important for muscle and nerve function.', 'Magnesium level is 1.8 mEq/L.', ARRAY[]::text[], ARRAY['Mg'], ARRAY['lab','diagnostic','chemistry']),
  ('Phosphorus', 'Lab Test', false, 'Phosphorus', null, 'A mineral important for bone health and energy metabolism.', 'Phosphorus level checked in kidney disease.', ARRAY[]::text[], ARRAY['phosphate'], ARRAY['lab','diagnostic','chemistry']),
  ('Uric Acid', 'Lab Test', false, 'Uric Acid', null, 'A waste product elevated in gout and kidney stones.', 'Elevated uric acid level triggers gout attack.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry']),
  ('Ammonia', 'Lab Test', false, 'Ammonia', null, 'A waste product metabolized by liver elevated in liver failure.', 'Elevated ammonia causes hepatic encephalopathy.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','hepatic']),
  ('Lactate', 'Lab Test', false, 'Lactate', null, 'A byproduct of metabolism elevated in tissue hypoxia or shock.', 'Elevated lactate indicates sepsis.', ARRAY[]::text[], ARRAY['lactic acid'], ARRAY['lab','diagnostic','chemistry']),
  ('Amylase', 'Lab Test', false, 'Amylase', null, 'An enzyme that digests carbohydrates elevated in pancreatitis.', 'Amylase of 300 suggests acute pancreatitis.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry']),
  ('Lipase', 'Lab Test', false, 'Lipase', null, 'An enzyme that digests fats more specific for pancreatitis than amylase.', 'Lipase elevated in pancreatic inflammation.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry'])
ON CONFLICT (term) DO UPDATE SET
  category = EXCLUDED.category,
  is_abbreviation = EXCLUDED.is_abbreviation,
  full_form = EXCLUDED.full_form,
  definition = EXCLUDED.definition,
  example_usage = EXCLUDED.example_usage,
  synonyms = EXCLUDED.synonyms,
  aliases = EXCLUDED.aliases,
  tags = EXCLUDED.tags;

-- Batch 6
INSERT INTO medical_terms (term, category, is_abbreviation, full_form, breakdown, definition, example_usage, synonyms, aliases, tags)
VALUES
  ('CK', 'Lab Test', true, 'Creatine Kinase', null, 'An enzyme in muscle and heart tissue elevated in muscle damage.', 'Elevated CK after intense exercise.', ARRAY[]::text[], ARRAY['creatine phosphokinase','CPK'], ARRAY['lab','diagnostic','chemistry']),
  ('CK-MB', 'Lab Test', false, 'Creatine Kinase-MB', null, 'A cardiac-specific enzyme elevated in heart attack.', 'CK-MB elevation confirms myocardial damage.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','cardiology']),
  ('LDH', 'Lab Test', true, 'Lactate Dehydrogenase', null, 'An enzyme found in many tissues elevated in hemolysis liver disease and MI.', 'LDH elevated in hemolytic anemia.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry']),
  ('Cortisol', 'Lab Test', false, 'Cortisol', null, 'A hormone produced by adrenal glands involved in stress response.', 'Morning cortisol low in adrenal insufficiency.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','endocrine']),
  ('ACTH', 'Lab Test', true, 'Adrenocorticotropic Hormone', null, 'A pituitary hormone that stimulates cortisol production.', 'ACTH stimulation test evaluates adrenal function.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','endocrine']),
  ('Testosterone', 'Lab Test', false, 'Testosterone', null, 'A hormone important for male sexual development and function.', 'Low testosterone causes hypogonadism.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','endocrine']),
  ('Estradiol', 'Lab Test', false, 'Estradiol', null, 'A form of estrogen important for female reproductive function.', 'Estradiol levels monitored in fertility treatment.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','endocrine']),
  ('Progesterone', 'Lab Test', false, 'Progesterone', null, 'A hormone important for menstrual cycle and pregnancy.', 'Progesterone level confirms ovulation.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','endocrine']),
  ('FSH', 'Lab Test', true, 'Follicle-Stimulating Hormone', null, 'A hormone that regulates reproductive processes.', 'Elevated FSH indicates menopause.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','endocrine']),
  ('LH', 'Lab Test', true, 'Luteinizing Hormone', null, 'A hormone that triggers ovulation and regulates sex hormones.', 'LH surge triggers ovulation.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','endocrine']),
  ('Prolactin', 'Lab Test', false, 'Prolactin', null, 'A hormone that stimulates milk production.', 'Elevated prolactin causes galactorrhea.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','endocrine']),
  ('hCG', 'Lab Test', true, 'Human Chorionic Gonadotropin', null, 'A hormone produced during pregnancy used in pregnancy tests.', 'Positive hCG confirms pregnancy.', ARRAY[]::text[], ARRAY['beta-hCG'], ARRAY['lab','diagnostic','chemistry','pregnancy']),
  ('Digoxin Level', 'Lab Test', false, 'Digoxin Level', null, 'Measures blood level of digoxin to ensure therapeutic dosing.', 'Digoxin level is 1.2 ng/mL therapeutic range.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','therapeutic-drug']),
  ('Vancomycin Level', 'Lab Test', false, 'Vancomycin Level', null, 'Measures blood level of vancomycin antibiotic to guide dosing.', 'Vancomycin trough is 18 mcg/mL.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','therapeutic-drug']),
  ('Phenytoin Level', 'Lab Test', false, 'Phenytoin Level', null, 'Measures blood level of anti-seizure medication phenytoin.', 'Phenytoin level subtherapeutic at 6 mcg/mL.', ARRAY[]::text[], ARRAY['Dilantin level'], ARRAY['lab','diagnostic','chemistry','therapeutic-drug']),
  ('Theophylline Level', 'Lab Test', false, 'Theophylline Level', null, 'Measures blood level of theophylline bronchodilator medication.', 'Theophylline level is 12 mcg/mL within range.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','chemistry','therapeutic-drug']),
  ('HIV Test', 'Lab Test', false, 'HIV Test', null, 'A screening test for human immunodeficiency virus.', 'Fourth generation HIV test is preferred.', ARRAY[]::text[], ARRAY['HIV antibody','HIV antigen'], ARRAY['lab','diagnostic','immunology','infectious']),
  ('Hepatitis Panel', 'Lab Panel', false, 'Hepatitis Panel', null, 'Tests for hepatitis A B and C viruses.', 'Hepatitis panel ordered for jaundiced patient.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','immunology','infectious']),
  ('HBsAg', 'Lab Test', true, 'Hepatitis B Surface Antigen', null, 'A marker of active hepatitis B infection.', 'Positive HBsAg indicates current HBV infection.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','immunology','infectious']),
  ('Anti-HBs', 'Lab Test', false, 'Hepatitis B Surface Antibody', null, 'Indicates immunity to hepatitis B from vaccine or past infection.', 'Positive anti-HBs shows HBV immunity.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','immunology','infectious']),
  ('HCV Antibody', 'Lab Test', false, 'Hepatitis C Antibody', null, 'Screening test for hepatitis C virus.', 'Positive HCV antibody requires RNA confirmation.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','immunology','infectious']),
  ('RPR', 'Lab Test', true, 'Rapid Plasma Reagin', null, 'A screening test for syphilis.', 'Positive RPR confirmed with FTA-ABS.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','immunology','infectious']),
  ('Mono Test', 'Lab Test', false, 'Mononucleosis Test', null, 'A rapid test for Epstein-Barr virus causing infectious mononucleosis.', 'Mono test positive with atypical lymphocytes.', ARRAY[]::text[], ARRAY['monospot','heterophile antibody'], ARRAY['lab','diagnostic','immunology','infectious']),
  ('Strep Test', 'Lab Test', false, 'Strep Test', null, 'A rapid antigen test for Group A Streptococcus causing strep throat.', 'Rapid strep test positive treat with antibiotics.', ARRAY[]::text[], ARRAY['rapid strep','strep antigen'], ARRAY['lab','diagnostic','microbiology','infectious']),
  ('Flu Test', 'Lab Test', false, 'Influenza Test', null, 'A rapid test detecting influenza A and B viruses.', 'Flu test positive for influenza A.', ARRAY[]::text[], ARRAY['rapid flu','influenza antigen'], ARRAY['lab','diagnostic','microbiology','infectious'])
ON CONFLICT (term) DO UPDATE SET
  category = EXCLUDED.category,
  is_abbreviation = EXCLUDED.is_abbreviation,
  full_form = EXCLUDED.full_form,
  definition = EXCLUDED.definition,
  example_usage = EXCLUDED.example_usage,
  synonyms = EXCLUDED.synonyms,
  aliases = EXCLUDED.aliases,
  tags = EXCLUDED.tags;

-- Batch 7
INSERT INTO medical_terms (term, category, is_abbreviation, full_form, breakdown, definition, example_usage, synonyms, aliases, tags)
VALUES
  ('COVID-19 Test', 'Lab Test', false, 'COVID-19 Test', null, 'A test detecting SARS-CoV-2 virus causing COVID-19.', 'PCR COVID test is most accurate.', ARRAY[]::text[], ARRAY['SARS-CoV-2 test'], ARRAY['lab','diagnostic','microbiology','infectious']),
  ('ANA', 'Lab Test', true, 'Antinuclear Antibody', null, 'An autoimmune marker elevated in lupus and other connective tissue diseases.', 'Positive ANA with speckled pattern.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','immunology','rheumatology']),
  ('RF', 'Lab Test', true, 'Rheumatoid Factor', null, 'An autoantibody elevated in rheumatoid arthritis.', 'Positive RF supports RA diagnosis.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','immunology','rheumatology']),
  ('Anti-CCP', 'Lab Test', true, 'Anti-Cyclic Citrullinated Peptide', null, 'A specific antibody for rheumatoid arthritis.', 'Anti-CCP is more specific than RF for RA.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','immunology','rheumatology']),
  ('Complement C3', 'Lab Test', false, 'Complement C3', null, 'A protein part of immune system low in active lupus.', 'Low C3 indicates lupus flare.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','immunology','rheumatology']),
  ('Complement C4', 'Lab Test', false, 'Complement C4', null, 'A protein part of immune system low in active lupus.', 'Low C4 with low C3 in lupus nephritis.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','immunology','rheumatology']),
  ('Stool Occult Blood', 'Lab Test', false, 'Fecal Occult Blood Test', null, 'A screening test for hidden blood in stool indicating GI bleeding or cancer.', 'Positive FOBT requires colonoscopy.', ARRAY[]::text[], ARRAY['FOBT','guaiac test'], ARRAY['lab','diagnostic','gi']),
  ('Stool Culture', 'Lab Test', false, 'Stool Culture', null, 'A test identifying bacteria causing diarrhea.', 'Stool culture positive for Salmonella.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','microbiology','gi']),
  ('C. diff Toxin', 'Lab Test', false, 'Clostridium difficile Toxin', null, 'A test detecting toxin from C. diff bacteria causing severe diarrhea.', 'C. diff toxin positive start vancomycin.', ARRAY[]::text[], ARRAY['C. difficile','CDI'], ARRAY['lab','diagnostic','microbiology','gi']),
  ('H. pylori Test', 'Lab Test', false, 'Helicobacter pylori Test', null, 'A test for bacteria that causes stomach ulcers.', 'Positive H. pylori treat with triple therapy.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','microbiology','gi']),
  ('Pregnancy Test', 'Lab Test', false, 'Pregnancy Test', null, 'A urine or blood test detecting hCG to confirm pregnancy.', 'Urine pregnancy test positive.', ARRAY[]::text[], ARRAY['urine hCG','beta-hCG'], ARRAY['lab','diagnostic','pregnancy']),
  ('Pap Smear', 'Lab Test', false, 'Papanicolaou Test', null, 'A cervical cancer screening test examining cervical cells.', 'Pap smear shows ASCUS repeat in 1 year.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','oncology','gynecology']),
  ('Semen Analysis', 'Lab Test', false, 'Semen Analysis', null, 'A test evaluating sperm count motility and morphology for fertility.', 'Semen analysis shows oligospermia.', ARRAY[]::text[], ARRAY[]::text[], ARRAY['lab','diagnostic','fertility'])
ON CONFLICT (term) DO UPDATE SET
  category = EXCLUDED.category,
  is_abbreviation = EXCLUDED.is_abbreviation,
  full_form = EXCLUDED.full_form,
  definition = EXCLUDED.definition,
  example_usage = EXCLUDED.example_usage,
  synonyms = EXCLUDED.synonyms,
  aliases = EXCLUDED.aliases,
  tags = EXCLUDED.tags;

