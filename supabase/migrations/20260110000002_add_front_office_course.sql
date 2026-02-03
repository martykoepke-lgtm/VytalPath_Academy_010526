/*
  # Add Front Office Specialist Course

  ## Overview
  - Updates Insurance Fundamentals module in Foundation course to be a high-level overview
  - Creates Front Office Specialist role course (requires Foundation course as prerequisite)
  - Adds detailed Insurance Operations module with job-specific training

  ## Structure

  Course: Front Office Specialist
  ├── Module 1: Insurance Operations (Deep Dive)
  │   ├── Lesson: Reading an Insurance Card
  │   ├── Lesson: Real-Time Eligibility Verification
  │   ├── Lesson: Understanding Copays
  │   ├── Lesson: Deductibles & Out-of-Pocket Max
  │   ├── Lesson: Coinsurance Calculations
  │   ├── Lesson: Collecting Patient Payments
  │   └── Quiz: Insurance Operations Quiz
  └── (More modules to be added: Scheduling, Check-In/Check-Out, etc.)
*/

-- =============================================
-- UPDATE FOUNDATION COURSE: Insurance Fundamentals
-- Make it more of an overview, remove detailed lessons
-- =============================================

-- Update the module description to emphasize it's an overview
UPDATE modules
SET
  title = 'Insurance Overview',
  description = 'A high-level introduction to health insurance concepts. For detailed, job-specific insurance training, see the Front Office Specialist course.'
WHERE id = 'a0000001-0000-0000-0000-000000000003';

-- Update lessons to be overview-focused
UPDATE lessons
SET
  title = 'Introduction to Health Insurance',
  description = 'A broad overview of how health insurance works in the US healthcare system.'
WHERE id = 'b0000001-0000-0000-0000-000000000006';

UPDATE lessons
SET
  title = 'Key Insurance Terms',
  description = 'Learn the essential vocabulary: premiums, deductibles, copays, coinsurance, and more.'
WHERE id = 'b0000001-0000-0000-0000-000000000007';

UPDATE lessons
SET
  title = 'Insurance Types & Plans',
  description = 'Overview of HMO, PPO, EPO, and other common plan types.'
WHERE id = 'b0000001-0000-0000-0000-000000000008';

-- Update the quiz to reflect overview nature
UPDATE quizzes
SET
  title = 'Insurance Overview Quiz',
  description = 'Test your understanding of basic health insurance concepts.'
WHERE id = 'd0000001-0000-0000-0000-000000000003';

-- =============================================
-- INSERT FRONT OFFICE SPECIALIST COURSE
-- =============================================
INSERT INTO courses (id, slug, title, description, type, prerequisite_ids, sort_order, is_published, estimated_hours, certificate_title)
VALUES (
  'c0000001-0000-0000-0000-000000000002',
  'front-office-specialist',
  'Front Office Specialist',
  'Master the daily operations of a healthcare front office. Deep-dive into insurance verification, patient scheduling, check-in/check-out procedures, and payment collection.',
  'role',
  ARRAY['c0000001-0000-0000-0000-000000000001']::UUID[],
  2,
  true,
  5,
  'Front Office Specialist Certificate'
);

-- =============================================
-- INSERT INSURANCE OPERATIONS MODULE (Detailed)
-- =============================================
INSERT INTO modules (id, course_id, slug, title, description, sort_order)
VALUES (
  'a0000002-0000-0000-0000-000000000001',
  'c0000001-0000-0000-0000-000000000002',
  'insurance-operations',
  'Insurance Operations',
  'Master the day-to-day insurance tasks: verifying eligibility, understanding benefits, and collecting patient responsibility.',
  1
);

-- =============================================
-- INSERT INSURANCE OPERATIONS LESSONS
-- =============================================
INSERT INTO lessons (id, module_id, slug, title, description, content_type, video_url, duration_minutes, sort_order)
VALUES
(
  'b0000002-0000-0000-0000-000000000001',
  'a0000002-0000-0000-0000-000000000001',
  'reading-insurance-card',
  'Reading an Insurance Card',
  'Learn to identify key information on insurance cards: member ID, group number, plan type, and contact numbers.',
  'video',
  NULL,
  8,
  1
),
(
  'b0000002-0000-0000-0000-000000000002',
  'a0000002-0000-0000-0000-000000000001',
  'real-time-eligibility',
  'Real-Time Eligibility Verification',
  'Step-by-step process for verifying patient eligibility before appointments using your practice management system.',
  'video',
  NULL,
  10,
  2
),
(
  'b0000002-0000-0000-0000-000000000003',
  'a0000002-0000-0000-0000-000000000001',
  'understanding-copays',
  'Understanding Copays',
  'What copays are, how to identify them, when to collect, and how to handle copay discrepancies.',
  'video',
  NULL,
  7,
  3
),
(
  'b0000002-0000-0000-0000-000000000004',
  'a0000002-0000-0000-0000-000000000001',
  'deductibles-oop-max',
  'Deductibles & Out-of-Pocket Maximum',
  'Understanding deductibles, tracking patient progress toward meeting them, and the out-of-pocket maximum.',
  'video',
  NULL,
  8,
  4
),
(
  'b0000002-0000-0000-0000-000000000005',
  'a0000002-0000-0000-0000-000000000001',
  'coinsurance-calculations',
  'Coinsurance Calculations',
  'How to calculate patient coinsurance responsibility and explain it to patients.',
  'video',
  NULL,
  6,
  5
),
(
  'b0000002-0000-0000-0000-000000000006',
  'a0000002-0000-0000-0000-000000000001',
  'collecting-patient-payments',
  'Collecting Patient Payments',
  'Best practices for collecting copays, coinsurance, and outstanding balances at the time of service.',
  'video',
  NULL,
  8,
  6
);

-- =============================================
-- INSERT INSURANCE OPERATIONS QUIZ
-- =============================================
INSERT INTO quizzes (id, module_id, title, description, passing_score, max_attempts)
VALUES (
  'd0000002-0000-0000-0000-000000000001',
  'a0000002-0000-0000-0000-000000000001',
  'Insurance Operations Quiz',
  'Test your knowledge of day-to-day insurance verification and payment collection.',
  80,
  3
);

-- Quiz questions will be added when you provide the content
