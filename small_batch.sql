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
  definition = EXCLUDED.definition,
  example_usage = EXCLUDED.example_usage,
  synonyms = EXCLUDED.synonyms,
  aliases = EXCLUDED.aliases,
;
