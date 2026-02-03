/*
  # Seed Foundation Course: Healthcare Administration Essentials

  ## Overview
  Seeds the initial course structure with:
  - 1 Foundation course
  - 4 Modules
  - Lessons for each module (existing videos + placeholders)
  - Quiz structure for each module
  - Authorization & Consent quiz questions (from docs)

  ## Content Structure

  Course: Healthcare Administration Essentials
  ├── Module 1: Healthcare Settings
  │   ├── Lesson: Healthcare Front Office Foundations (video)
  │   ├── Lesson: Acute vs. Ambulatory Care (video)
  │   └── Quiz: Healthcare Settings Quiz
  ├── Module 2: Medical Law & Ethics
  │   ├── Lesson: HIPAA Essentials Explained (video)
  │   ├── Lesson: PHI Explained (video)
  │   ├── Lesson: Authorization & Consent (reading)
  │   └── Quiz: Authorization & Consent Quiz (10 questions)
  ├── Module 3: Insurance Fundamentals
  │   ├── Lesson: How Health Insurance Works (placeholder)
  │   ├── Lesson: Eligibility Verification (placeholder)
  │   ├── Lesson: Copays, Deductibles & Coinsurance (placeholder)
  │   └── Quiz: Insurance Fundamentals Quiz
  └── Module 4: Medical Terminology Basics
      ├── Lesson: Common Abbreviations (placeholder)
      ├── Lesson: Word Roots & Prefixes (placeholder)
      └── Quiz: Medical Terminology Quiz
*/

-- =============================================
-- INSERT FOUNDATION COURSE
-- =============================================
INSERT INTO courses (id, slug, title, description, type, prerequisite_ids, sort_order, is_published, estimated_hours, certificate_title)
VALUES (
  'c0000001-0000-0000-0000-000000000001',
  'healthcare-admin-essentials',
  'Healthcare Administration Essentials',
  'Build the foundation for any healthcare administrative role. Learn about healthcare settings, medical law and ethics, insurance fundamentals, and essential terminology.',
  'foundation',
  '{}',
  1,
  true,
  3,
  'Healthcare Administration Foundations Certificate'
);

-- =============================================
-- INSERT MODULES
-- =============================================

-- Module 1: Healthcare Settings
INSERT INTO modules (id, course_id, slug, title, description, sort_order)
VALUES (
  'a0000001-0000-0000-0000-000000000001',
  'c0000001-0000-0000-0000-000000000001',
  'healthcare-settings',
  'Healthcare Settings',
  'Understand the different types of healthcare environments and your role within them.',
  1
);

-- Module 2: Medical Law & Ethics
INSERT INTO modules (id, course_id, slug, title, description, sort_order)
VALUES (
  'a0000001-0000-0000-0000-000000000002',
  'c0000001-0000-0000-0000-000000000001',
  'medical-law-ethics',
  'Medical Law & Ethics',
  'Essential legal and ethical guidelines for healthcare professionals.',
  2
);

-- Module 3: Insurance Fundamentals
INSERT INTO modules (id, course_id, slug, title, description, sort_order)
VALUES (
  'a0000001-0000-0000-0000-000000000003',
  'c0000001-0000-0000-0000-000000000001',
  'insurance-fundamentals',
  'Insurance Fundamentals',
  'Learn how health insurance works and master eligibility verification.',
  3
);

-- Module 4: Medical Terminology Basics
INSERT INTO modules (id, course_id, slug, title, description, sort_order)
VALUES (
  'a0000001-0000-0000-0000-000000000004',
  'c0000001-0000-0000-0000-000000000001',
  'medical-terminology-basics',
  'Medical Terminology Basics',
  'Learn essential medical abbreviations and terminology for daily clinic operations.',
  4
);

-- =============================================
-- INSERT LESSONS
-- =============================================

-- Module 1 Lessons
INSERT INTO lessons (id, module_id, slug, title, description, content_type, video_url, duration_minutes, sort_order)
VALUES
(
  'b0000001-0000-0000-0000-000000000001',
  'a0000001-0000-0000-0000-000000000001',
  'healthcare-front-office-foundations',
  'Healthcare Front Office Foundations',
  'An introduction to the essential skills and knowledge needed for front office success in healthcare settings.',
  'video',
  '/videos/Healthcare Front Office Foundations.mp4',
  5,
  1
),
(
  'b0000001-0000-0000-0000-000000000002',
  'a0000001-0000-0000-0000-000000000001',
  'acute-vs-ambulatory-care',
  'Acute vs. Ambulatory Care',
  'Learn the key differences between acute care (hospitals) and ambulatory care (outpatient clinics) settings.',
  'video',
  '/videos/Acute vs. Ambulatory Care.mp4',
  5,
  2
);

-- Module 2 Lessons
INSERT INTO lessons (id, module_id, slug, title, description, content_type, video_url, reading_content, duration_minutes, sort_order)
VALUES
(
  'b0000001-0000-0000-0000-000000000003',
  'a0000001-0000-0000-0000-000000000002',
  'hipaa-essentials',
  'HIPAA Essentials Explained',
  'Understanding HIPAA regulations, patient privacy rights, and your responsibilities in protecting health information.',
  'video',
  '/videos/HIPAA Essentials Explained.mp4',
  NULL,
  5,
  1
),
(
  'b0000001-0000-0000-0000-000000000004',
  'a0000001-0000-0000-0000-000000000002',
  'phi-explained',
  'PHI Explained',
  'Learn what Protected Health Information is and how to identify it in your daily work.',
  'video',
  '/videos/PHI Explained.mp4',
  NULL,
  5,
  2
),
(
  'b0000001-0000-0000-0000-000000000005',
  'a0000001-0000-0000-0000-000000000002',
  'authorization-consent',
  'Authorization & Consent',
  'Understanding patient authorization and consent requirements in healthcare settings.',
  'reading',
  NULL,
  '# Authorization & Consent in Healthcare

## What is Authorization?

Authorization is a patient''s formal permission for their healthcare provider to use or share their Protected Health Information (PHI) for purposes beyond treatment, payment, or healthcare operations.

### Key Points:
- Must be in writing
- Must specify what information can be shared
- Must name who can receive the information
- Must include an expiration date
- Patient can revoke at any time

## What is Consent?

Consent is the patient''s agreement to receive treatment or services. There are two types:

### Informed Consent
- Required before procedures and treatments
- Patient must understand the risks, benefits, and alternatives
- Must be documented in the medical record

### General Consent
- Typically signed at registration
- Covers routine treatment and billing activities
- Does not replace informed consent for specific procedures

## Your Role at the Front Desk

1. **Verify consent forms are signed** before appointments
2. **Explain authorization forms** when patients have questions
3. **Never share patient information** without proper authorization
4. **Know your clinic''s policies** for handling consent documents

## Common Scenarios

### Scenario 1: Family Member Requests Information
A patient''s spouse calls asking about test results. Without a signed authorization form naming the spouse, you cannot share this information.

### Scenario 2: Insurance Company Request
Insurance requests are typically covered under the "payment" exception to authorization requirements, but always follow your clinic''s verification procedures.

### Scenario 3: Patient Wants Records Sent
When a patient requests their records be sent elsewhere, ensure they complete an authorization form specifying the recipient and what information to send.

## Summary

- **Authorization** = Permission to share PHI beyond normal operations
- **Consent** = Agreement to receive care
- **Both are essential** for legal compliance and patient trust
- **When in doubt**, check with your supervisor before releasing information',
  10,
  3
);

-- Module 3 Lessons (placeholders for future content)
INSERT INTO lessons (id, module_id, slug, title, description, content_type, video_url, duration_minutes, sort_order)
VALUES
(
  'b0000001-0000-0000-0000-000000000006',
  'a0000001-0000-0000-0000-000000000003',
  'how-health-insurance-works',
  'How Health Insurance Works',
  'Understanding the basics of health insurance coverage and claims.',
  'video',
  NULL,
  8,
  1
),
(
  'b0000001-0000-0000-0000-000000000007',
  'a0000001-0000-0000-0000-000000000003',
  'eligibility-verification',
  'Eligibility Verification',
  'Learn how to verify patient insurance eligibility.',
  'video',
  NULL,
  6,
  2
),
(
  'b0000001-0000-0000-0000-000000000008',
  'a0000001-0000-0000-0000-000000000003',
  'copays-deductibles-coinsurance',
  'Copays, Deductibles & Coinsurance',
  'Understanding patient cost-sharing and payment collection.',
  'video',
  NULL,
  7,
  3
);

-- Module 4 Lessons (placeholders for future content)
INSERT INTO lessons (id, module_id, slug, title, description, content_type, video_url, duration_minutes, sort_order)
VALUES
(
  'b0000001-0000-0000-0000-000000000009',
  'a0000001-0000-0000-0000-000000000004',
  'common-abbreviations',
  'Common Abbreviations',
  'Master the abbreviations you will see every day in clinic settings.',
  'video',
  NULL,
  8,
  1
),
(
  'b0000001-0000-0000-0000-000000000010',
  'a0000001-0000-0000-0000-000000000004',
  'word-roots-prefixes',
  'Word Roots & Prefixes',
  'Learn how medical terms are constructed from roots and prefixes.',
  'video',
  NULL,
  10,
  2
);

-- =============================================
-- INSERT QUIZZES
-- =============================================

-- Module 1 Quiz
INSERT INTO quizzes (id, module_id, title, description, passing_score, max_attempts)
VALUES (
  'd0000001-0000-0000-0000-000000000001',
  'a0000001-0000-0000-0000-000000000001',
  'Healthcare Settings Quiz',
  'Test your knowledge of healthcare environments and settings.',
  80,
  3
);

-- Module 2 Quiz
INSERT INTO quizzes (id, module_id, title, description, passing_score, max_attempts)
VALUES (
  'd0000001-0000-0000-0000-000000000002',
  'a0000001-0000-0000-0000-000000000002',
  'Authorization & Consent Quiz',
  'Test your knowledge of HIPAA authorization, consent, and protecting patient information.',
  80,
  3
);

-- Module 3 Quiz
INSERT INTO quizzes (id, module_id, title, description, passing_score, max_attempts)
VALUES (
  'd0000001-0000-0000-0000-000000000003',
  'a0000001-0000-0000-0000-000000000003',
  'Insurance Fundamentals Quiz',
  'Test your knowledge of health insurance basics.',
  80,
  3
);

-- Module 4 Quiz
INSERT INTO quizzes (id, module_id, title, description, passing_score, max_attempts)
VALUES (
  'd0000001-0000-0000-0000-000000000004',
  'a0000001-0000-0000-0000-000000000004',
  'Medical Terminology Quiz',
  'Test your knowledge of medical terms and abbreviations.',
  80,
  3
);

-- =============================================
-- INSERT QUIZ QUESTIONS (Module 2 - Authorization & Consent)
-- =============================================

INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, explanation, sort_order)
VALUES
(
  'd0000001-0000-0000-0000-000000000002',
  'A patient''s husband calls asking for her lab results. He says she asked him to call because she''s at work. There is no authorization form on file. What should you do?',
  'multiple_choice',
  ARRAY['A. Give him the results since he''s her spouse', 'B. Give him only normal results but not abnormal ones', 'C. Decline to share and ask that the patient call directly or complete an authorization form', 'D. Confirm she''s a patient but don''t share the results'],
  'C',
  'Being a spouse does not automatically grant access to medical information. Without written authorization on file, you cannot share patient information with anyone, regardless of their relationship to the patient.',
  1
),
(
  'd0000001-0000-0000-0000-000000000002',
  'If someone is listed as a patient''s emergency contact, they are automatically authorized to receive the patient''s medical information.',
  'true_false',
  ARRAY['True', 'False'],
  'False',
  'Emergency contact status is not the same as authorization to receive medical information. A separate authorization form is required to share health information with any third party.',
  2
),
(
  'd0000001-0000-0000-0000-000000000002',
  'A patient brings her adult daughter into the exam room with her. Before discussing the patient''s test results, what should the provider do?',
  'multiple_choice',
  ARRAY['A. Ask the daughter to leave the room', 'B. Proceed normally since the patient brought her daughter', 'C. Confirm with the patient that it''s okay to discuss her care in front of her daughter', 'D. Only discuss positive results while the daughter is present'],
  'C',
  'Even when a patient brings someone into the exam room, providers should confirm that the patient wants their care discussed in front of that person. The patient may want support but may not want all information shared.',
  3
),
(
  'd0000001-0000-0000-0000-000000000002',
  'Which of the following is NOT a required element of a valid Release of Information (ROI) form?',
  'multiple_choice',
  ARRAY['A. Patient''s name and identifying information', 'B. The patient''s insurance policy number', 'C. Who the information is being released to', 'D. Patient''s signature and date'],
  'B',
  'A valid ROI must include: patient identification, what information is being released, who it''s being released to, the purpose, an expiration date, and the patient''s signature. Insurance policy number is not a required element.',
  4
),
(
  'd0000001-0000-0000-0000-000000000002',
  'A patient completed an ROI form six months ago authorizing release of information to her attorney. She calls today and says she wants to revoke that authorization. What happens next?',
  'multiple_choice',
  ARRAY['A. She cannot revoke it until the original expiration date', 'B. She must revoke it in writing, and once received, you can no longer share with the attorney', 'C. The revocation takes effect in 30 days', 'D. She must come into the office in person to revoke it'],
  'B',
  'Patients can revoke authorization at any time by notifying the office in writing. Once the written revocation is received, you can no longer share information with that person or organization.',
  5
),
(
  'd0000001-0000-0000-0000-000000000002',
  'You step away from your desk for two minutes to use the restroom. A patient''s insurance card copy and intake form are on your desk. What should you do before leaving?',
  'multiple_choice',
  ARRAY['A. Nothing—two minutes is too short to matter', 'B. Turn the papers face-down or place them in a folder, and lock your workstation', 'C. Ask a coworker to watch your desk', 'D. It''s fine as long as no other patients are in the waiting room'],
  'B',
  'Papers with PHI should never be left visible in public areas, even briefly. Documents should be turned face-down or placed in folders, and workstations should be locked whenever you step away.',
  6
),
(
  'd0000001-0000-0000-0000-000000000002',
  'A man approaches the front desk and asks what time his mother''s appointment is today. His mother is 72 years old and mentally competent. There is no authorization on file. What should you do?',
  'multiple_choice',
  ARRAY['A. Give him the appointment time since it''s not medical information', 'B. Confirm she has an appointment but don''t give the time', 'C. Decline to share any information and offer him an authorization form', 'D. Call his mother to verify it''s okay to share'],
  'C',
  'Appointment information is protected health information. Without authorization, you cannot confirm or share any patient information with a third party, regardless of family relationship. Even confirming someone is a patient requires authorization.',
  7
),
(
  'd0000001-0000-0000-0000-000000000002',
  'You write a patient''s name and callback number on a sticky note. At the end of the day, what should you do with it?',
  'multiple_choice',
  ARRAY['A. Throw it in the regular trash', 'B. Leave it on your desk for tomorrow', 'C. Shred it or place it in a secure disposal bin', 'D. Recycle it'],
  'C',
  'Any paper containing patient information—including sticky notes and scratch paper—is PHI and must be disposed of securely. It should be shredded or placed in a secure disposal bin, never thrown in regular trash.',
  8
),
(
  'd0000001-0000-0000-0000-000000000002',
  'A patient''s employer calls to verify that the patient had a medical appointment on a day they called in sick. What can you share?',
  'multiple_choice',
  ARRAY['A. Confirm the appointment date and time only', 'B. Confirm they had an appointment but not what it was for', 'C. Nothing—you cannot even confirm whether someone is a patient', 'D. Share whatever the employer asks for since it''s for work purposes'],
  'C',
  'Without patient authorization, you cannot share any information with an employer—including confirming that someone is a patient or had an appointment. Employment verification of medical appointments requires written patient authorization.',
  9
),
(
  'd0000001-0000-0000-0000-000000000002',
  'A spouse walks up to the front desk while their partner is in the exam room and asks, "What medications did the doctor prescribe?" What is the best response?',
  'multiple_choice',
  ARRAY['A. "Let me check if we have authorization to discuss your spouse''s information with you."', 'B. "I''ll write them down for you."', 'C. "You''ll need to ask your spouse when they come out."', 'D. "That information is between the patient and doctor."'],
  'A',
  'The best response is to check for authorization. This is professional, protects the patient, and allows you to share information if proper authorization exists. Simply refusing without offering to check could frustrate authorized family members.',
  10
);
