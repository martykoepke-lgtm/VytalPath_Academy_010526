import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CheckCircle, XCircle, ClipboardCheck,
  ChevronRight, AlertCircle, Trophy, RotateCcw
} from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import type { Quiz, QuizQuestion } from '../../types/course';

// Quiz data structure with navigation info
interface QuizData {
  quiz: Quiz;
  questions: QuizQuestion[];
  moduleTitle: string;
  courseTitle: string;
  nextModuleSlug: string | null;
  nextModuleFirstLesson: string | null; // First lesson of next module for navigation
}

const quizzesData: Record<string, QuizData> = {
  'healthcare-delivery': {
    quiz: {
      id: 'q1',
      module_id: 'm1',
      title: 'Healthcare Settings Quiz',
      description: 'Test your knowledge of healthcare environments and settings.',
      passing_score: 80,
      max_attempts: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    moduleTitle: 'Healthcare Settings',
    courseTitle: 'Healthcare Foundations',
    nextModuleSlug: 'medical-law-ethics',
    nextModuleFirstLesson: 'hipaa-essentials',
    questions: [
      {
        id: 'q1-1',
        quiz_id: 'q1',
        question_text: 'What percentage of healthcare happens outside of hospitals—in clinics, specialty offices, and outpatient centers?',
        question_type: 'multiple_choice',
        options: ['A. 50%', 'B. 65%', 'C. 80%', 'D. 95%'],
        correct_answer: 'C',
        explanation: 'Over 80% of healthcare happens in ambulatory settings outside the hospital.',
        sort_order: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q1-2',
        quiz_id: 'q1',
        question_text: 'In acute care (hospital) settings, how is care typically delivered to the patient?',
        question_type: 'multiple_choice',
        options: [
          'A. The patient travels to different departments for each service',
          'B. Services come to the patient at their bedside',
          'C. The patient schedules their own follow-up appointments',
          'D. Care happens across multiple separate encounters over weeks',
        ],
        correct_answer: 'B',
        explanation: 'In acute care, everything comes to the patient. Doctors, nurses, lab technicians, and imaging specialists all come to the patient\'s bedside.',
        sort_order: 2,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q1-3',
        quiz_id: 'q1',
        question_text: 'In ambulatory care, care happens in one continuous episode from admission to discharge.',
        question_type: 'true_false',
        options: ['True', 'False'],
        correct_answer: 'False',
        explanation: 'This describes acute care. In ambulatory care, care happens across multiple separate encounters over time—the patient sees different providers at different locations, often weeks or months apart.',
        sort_order: 3,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q1-4',
        quiz_id: 'q1',
        question_text: 'Which type of care is described as "clinician-driven," where the care team coordinates everything while the patient focuses on recovery?',
        question_type: 'multiple_choice',
        options: ['A. Ambulatory care', 'B. Acute care', 'C. Outpatient care', 'D. Primary care'],
        correct_answer: 'B',
        explanation: 'Acute care is clinician-driven. The patient doesn\'t schedule their own appointments—the care team handles coordination while the patient recovers.',
        sort_order: 4,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q1-5',
        quiz_id: 'q1',
        question_text: 'In ambulatory care, who is primarily responsible for scheduling appointments, navigating between providers, and following up on referrals?',
        question_type: 'multiple_choice',
        options: [
          'A. The clinical care team',
          'B. The hospital case manager',
          'C. The patient',
          'D. The insurance company',
        ],
        correct_answer: 'C',
        explanation: 'Ambulatory care is patient-driven. Patients must schedule their own appointments, show up on time, navigate between different locations, and follow up on referrals and test results.',
        sort_order: 5,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q1-6',
        quiz_id: 'q1',
        question_text: 'Which of the following best describes the role of a front office professional in ambulatory care?',
        question_type: 'multiple_choice',
        options: [
          'A. Coordinating bedside care for hospitalized patients',
          'B. Bridging the gaps between separate patient encounters across time and locations',
          'C. Managing surgical scheduling only',
          'D. Processing hospital discharge paperwork',
        ],
        correct_answer: 'B',
        explanation: 'Front office professionals in ambulatory care are the bridge between all the separate encounters—helping patients navigate the complex system across time and space.',
        sort_order: 6,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q1-7',
        quiz_id: 'q1',
        question_text: 'This course covers four core concepts for healthcare front office professionals. Which of the following is NOT one of them?',
        question_type: 'multiple_choice',
        options: [
          'A. An introduction to ambulatory care',
          'B. Medical law, ethics, and HIPAA principles',
          'C. Surgical procedure protocols',
          'D. Insurance fundamentals',
        ],
        correct_answer: 'C',
        explanation: 'The four core concepts are: Introduction to Ambulatory Care, Medical Law/Ethics/HIPAA, Insurance Fundamentals, and Core Workflows/Medical Terminology.',
        sort_order: 7,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q1-8',
        quiz_id: 'q1',
        question_text: 'Prior healthcare experience is required to take this course.',
        question_type: 'true_false',
        options: ['True', 'False'],
        correct_answer: 'False',
        explanation: 'This course is designed for complete beginners—no healthcare experience is required.',
        sort_order: 8,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q1-9',
        quiz_id: 'q1',
        question_text: 'What is a key challenge patients face in ambulatory care compared to acute care?',
        question_type: 'multiple_choice',
        options: [
          'A. Having too many providers at their bedside at once',
          'B. Being discharged too quickly from the hospital',
          'C. Remembering what their doctor told them weeks ago while managing care across multiple locations',
          'D. Having limited access to specialists',
        ],
        correct_answer: 'C',
        explanation: 'In ambulatory care, patients often have to follow up on their own test results while trying to remember what their doctor told them weeks ago, all while navigating between different locations and providers.',
        sort_order: 9,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q1-10',
        quiz_id: 'q1',
        question_text: 'Where is the demand for front office professionals highest, according to the training?',
        question_type: 'multiple_choice',
        options: [
          'A. Hospitals',
          'B. Ambulatory care settings (clinics and outpatient centers)',
          'C. Emergency departments',
          'D. Nursing homes',
        ],
        correct_answer: 'B',
        explanation: 'Ambulatory care is where healthcare is growing fastest and where the demand for front office professionals is highest—this is where your work has the most impact.',
        sort_order: 10,
        created_at: new Date().toISOString(),
      },
    ],
  },
  'medical-law-ethics': {
    quiz: {
      id: 'q2',
      module_id: 'm2',
      title: 'Authorization & Consent Quiz',
      description: 'Test your knowledge of HIPAA authorization, consent, and protecting patient information.',
      passing_score: 80,
      max_attempts: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    moduleTitle: 'Medical Law & Ethics',
    courseTitle: 'Healthcare Foundations',
    nextModuleSlug: 'insurance-fundamentals',
    nextModuleFirstLesson: 'introduction-health-insurance',
    questions: [
      {
        id: 'q2-1',
        quiz_id: 'q2',
        question_text: 'A patient\'s husband calls asking for her lab results. He says she asked him to call because she\'s at work. There is no authorization form on file. What should you do?',
        question_type: 'multiple_choice',
        options: [
          'A. Give him the results since he\'s her spouse',
          'B. Give him only normal results but not abnormal ones',
          'C. Decline to share and ask that the patient call directly or complete an authorization form',
          'D. Confirm she\'s a patient but don\'t share the results',
        ],
        correct_answer: 'C',
        explanation: 'Being a spouse does not automatically grant access to medical information. Without written authorization on file, you cannot share patient information with anyone, regardless of their relationship to the patient.',
        sort_order: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q2-2',
        quiz_id: 'q2',
        question_text: 'If someone is listed as a patient\'s emergency contact, they are automatically authorized to receive the patient\'s medical information.',
        question_type: 'true_false',
        options: ['True', 'False'],
        correct_answer: 'False',
        explanation: 'Emergency contact status is not the same as authorization to receive medical information. A separate authorization form is required to share health information with any third party.',
        sort_order: 2,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q2-3',
        quiz_id: 'q2',
        question_text: 'A patient brings her adult daughter into the exam room with her. Before discussing the patient\'s test results, what should the provider do?',
        question_type: 'multiple_choice',
        options: [
          'A. Ask the daughter to leave the room',
          'B. Proceed normally since the patient brought her daughter',
          'C. Confirm with the patient that it\'s okay to discuss her care in front of her daughter',
          'D. Only discuss positive results while the daughter is present',
        ],
        correct_answer: 'C',
        explanation: 'Even when a patient brings someone into the exam room, providers should confirm that the patient wants their care discussed in front of that person. The patient may want support but may not want all information shared.',
        sort_order: 3,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q2-4',
        quiz_id: 'q2',
        question_text: 'Which of the following is NOT a required element of a valid Release of Information (ROI) form?',
        question_type: 'multiple_choice',
        options: [
          'A. Patient\'s name and identifying information',
          'B. The patient\'s insurance policy number',
          'C. Who the information is being released to',
          'D. Patient\'s signature and date',
        ],
        correct_answer: 'B',
        explanation: 'A valid ROI must include: patient identification, what information is being released, who it\'s being released to, the purpose, an expiration date, and the patient\'s signature. Insurance policy number is not a required element.',
        sort_order: 4,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q2-5',
        quiz_id: 'q2',
        question_text: 'A patient completed an ROI form six months ago authorizing release of information to her attorney. She calls today and says she wants to revoke that authorization. What happens next?',
        question_type: 'multiple_choice',
        options: [
          'A. She cannot revoke it until the original expiration date',
          'B. She must revoke it in writing, and once received, you can no longer share with the attorney',
          'C. The revocation takes effect in 30 days',
          'D. She must come into the office in person to revoke it',
        ],
        correct_answer: 'B',
        explanation: 'Patients can revoke authorization at any time by notifying the office in writing. Once the written revocation is received, you can no longer share information with that person or organization.',
        sort_order: 5,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q2-6',
        quiz_id: 'q2',
        question_text: 'You step away from your desk for two minutes to use the restroom. A patient\'s insurance card copy and intake form are on your desk. What should you do before leaving?',
        question_type: 'multiple_choice',
        options: [
          'A. Nothing—two minutes is too short to matter',
          'B. Turn the papers face-down or place them in a folder, and lock your workstation',
          'C. Ask a coworker to watch your desk',
          'D. It\'s fine as long as no other patients are in the waiting room',
        ],
        correct_answer: 'B',
        explanation: 'Papers with PHI should never be left visible in public areas, even briefly. Documents should be turned face-down or placed in folders, and workstations should be locked whenever you step away.',
        sort_order: 6,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q2-7',
        quiz_id: 'q2',
        question_text: 'A man approaches the front desk and asks what time his mother\'s appointment is today. His mother is 72 years old and mentally competent. There is no authorization on file. What should you do?',
        question_type: 'multiple_choice',
        options: [
          'A. Give him the appointment time since it\'s not medical information',
          'B. Confirm she has an appointment but don\'t give the time',
          'C. Decline to share any information and offer him an authorization form',
          'D. Call his mother to verify it\'s okay to share',
        ],
        correct_answer: 'C',
        explanation: 'Appointment information is protected health information. Without authorization, you cannot confirm or share any patient information with a third party, regardless of family relationship. Even confirming someone is a patient requires authorization.',
        sort_order: 7,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q2-8',
        quiz_id: 'q2',
        question_text: 'You write a patient\'s name and callback number on a sticky note. At the end of the day, what should you do with it?',
        question_type: 'multiple_choice',
        options: [
          'A. Throw it in the regular trash',
          'B. Leave it on your desk for tomorrow',
          'C. Shred it or place it in a secure disposal bin',
          'D. Recycle it',
        ],
        correct_answer: 'C',
        explanation: 'Any paper containing patient information—including sticky notes and scratch paper—is PHI and must be disposed of securely. It should be shredded or placed in a secure disposal bin, never thrown in regular trash.',
        sort_order: 8,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q2-9',
        quiz_id: 'q2',
        question_text: 'A patient\'s employer calls to verify that the patient had a medical appointment on a day they called in sick. What can you share?',
        question_type: 'multiple_choice',
        options: [
          'A. Confirm the appointment date and time only',
          'B. Confirm they had an appointment but not what it was for',
          'C. Nothing—you cannot even confirm whether someone is a patient',
          'D. Share whatever the employer asks for since it\'s for work purposes',
        ],
        correct_answer: 'C',
        explanation: 'Without patient authorization, you cannot share any information with an employer—including confirming that someone is a patient or had an appointment. Employment verification of medical appointments requires written patient authorization.',
        sort_order: 9,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q2-10',
        quiz_id: 'q2',
        question_text: 'A spouse walks up to the front desk while their partner is in the exam room and asks, "What medications did the doctor prescribe?" What is the best response?',
        question_type: 'multiple_choice',
        options: [
          'A. "Let me check if we have authorization to discuss your spouse\'s information with you."',
          'B. "I\'ll write them down for you."',
          'C. "You\'ll need to ask your spouse when they come out."',
          'D. "That information is between the patient and doctor."',
        ],
        correct_answer: 'A',
        explanation: 'The best response is to check for authorization. This is professional, protects the patient, and allows you to share information if proper authorization exists. Simply refusing without offering to check could frustrate authorized family members.',
        sort_order: 10,
        created_at: new Date().toISOString(),
      },
    ],
  },
  'insurance-fundamentals': {
    quiz: {
      id: 'q3',
      module_id: 'm3',
      title: 'Insurance Fundamentals Quiz',
      description: 'Test your knowledge of health insurance basics, payers, and key terms.',
      passing_score: 80,
      max_attempts: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    moduleTitle: 'Insurance Fundamentals',
    courseTitle: 'Insurance & Billing',
    nextModuleSlug: 'insurance-operations',
    nextModuleFirstLesson: 'reading-insurance-card',
    questions: [
      {
        id: 'q3-1',
        quiz_id: 'q3',
        question_text: 'A payer is the organization that pays for medical services. Which of the following is an example of a commercial insurance payer?',
        question_type: 'multiple_choice',
        options: [
          'A. Medicare',
          'B. Blue Cross Blue Shield',
          'C. Medicaid',
          'D. TRICARE',
        ],
        correct_answer: 'B',
        explanation: 'Blue Cross Blue Shield is a commercial (private) insurance company. Medicare, Medicaid, and TRICARE are government programs.',
        sort_order: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q3-2',
        quiz_id: 'q3',
        question_text: 'Medicare covers people 65 and older, plus some younger people with disabilities.',
        question_type: 'true_false',
        options: ['True', 'False'],
        correct_answer: 'True',
        explanation: 'Medicare is a government program that covers people 65 and older, as well as some younger individuals with qualifying disabilities.',
        sort_order: 2,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q3-3',
        quiz_id: 'q3',
        question_text: 'Which government insurance program covers military members and their families?',
        question_type: 'multiple_choice',
        options: [
          'A. Medicare',
          'B. Medicaid',
          'C. TRICARE',
          'D. Commercial insurance',
        ],
        correct_answer: 'C',
        explanation: 'TRICARE is the government program that provides healthcare coverage for military members and their families.',
        sort_order: 3,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q3-4',
        quiz_id: 'q3',
        question_text: 'What is the term for the monthly payment a patient makes to have insurance coverage, whether or not they use healthcare services?',
        question_type: 'multiple_choice',
        options: [
          'A. Copay',
          'B. Deductible',
          'C. Premium',
          'D. Coinsurance',
        ],
        correct_answer: 'C',
        explanation: 'A premium is the monthly payment to have insurance coverage—like a membership fee—regardless of whether the patient uses healthcare services.',
        sort_order: 4,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q3-5',
        quiz_id: 'q3',
        question_text: 'A patient has a $1,000 deductible. They have paid $600 in healthcare costs this year. How much more must they pay before insurance starts covering services?',
        question_type: 'multiple_choice',
        options: [
          'A. $0 - insurance is already covering services',
          'B. $400',
          'C. $600',
          'D. $1,000',
        ],
        correct_answer: 'B',
        explanation: 'The deductible is the amount a patient must pay before insurance kicks in. With a $1,000 deductible and $600 already paid, they need to pay $400 more before insurance starts covering services.',
        sort_order: 5,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q3-6',
        quiz_id: 'q3',
        question_text: 'What is the key difference between a copay and coinsurance?',
        question_type: 'multiple_choice',
        options: [
          'A. Copay is paid monthly; coinsurance is paid at each visit',
          'B. Copay is a flat amount; coinsurance is a percentage',
          'C. Copay applies before the deductible; coinsurance does not',
          'D. Copay is for specialists only; coinsurance is for primary care',
        ],
        correct_answer: 'B',
        explanation: 'A copay is a fixed dollar amount (like $30 for a visit), while coinsurance is a percentage the patient pays after meeting their deductible (like 20% of the cost).',
        sort_order: 6,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q3-7',
        quiz_id: 'q3',
        question_text: 'When a patient reaches their out-of-pocket maximum, what happens?',
        question_type: 'multiple_choice',
        options: [
          'A. Their insurance is cancelled',
          'B. They must pay 50% of all remaining costs',
          'C. Insurance covers 100% of covered services for the rest of the year',
          'D. Their deductible resets',
        ],
        correct_answer: 'C',
        explanation: 'The out-of-pocket maximum is the most a patient will pay in a year. Once reached, insurance covers 100% of covered services for the rest of the year—it\'s like a safety net.',
        sort_order: 7,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q3-8',
        quiz_id: 'q3',
        question_text: 'A patient calls and asks "Do you take my insurance?" What are they really asking?',
        question_type: 'multiple_choice',
        options: [
          'A. "Will you accept my premium payment?"',
          'B. "Are you in-network with my plan?"',
          'C. "Can I use my copay here?"',
          'D. "Is prior authorization required?"',
        ],
        correct_answer: 'B',
        explanation: 'When patients ask "Do you take my insurance?" they are really asking whether the provider is in-network with their plan, which affects how much they will pay for care.',
        sort_order: 8,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q3-9',
        quiz_id: 'q3',
        question_text: 'When should you verify a patient\'s insurance eligibility?',
        question_type: 'multiple_choice',
        options: [
          'A. Only when the patient requests it',
          'B. Only for new patients',
          'C. 48-72 hours before the appointment',
          'D. After the appointment is completed',
        ],
        correct_answer: 'C',
        explanation: 'Always verify eligibility 48-72 hours before the appointment. This gives you time to resolve any issues before the patient arrives, rather than discovering problems at check-in.',
        sort_order: 9,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q3-10',
        quiz_id: 'q3',
        question_text: 'Prior authorization means insurance requires approval AFTER certain services are provided.',
        question_type: 'true_false',
        options: ['True', 'False'],
        correct_answer: 'False',
        explanation: 'Prior authorization requires approval BEFORE certain services, not after. Without authorization beforehand, the service might not be covered—even if it\'s medically necessary.',
        sort_order: 10,
        created_at: new Date().toISOString(),
      },
    ],
  },
  'insurance-operations': {
    quiz: {
      id: 'ins-q2',
      module_id: 'ins-m2',
      title: 'Insurance Operations Quiz',
      description: 'Test your knowledge of day-to-day insurance verification and payment collection.',
      passing_score: 80,
      max_attempts: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    moduleTitle: 'Front Desk Insurance Operations',
    courseTitle: 'Insurance & Billing',
    nextModuleSlug: 'coverage-rules',
    nextModuleFirstLesson: 'government-plans-deep-dive',
    questions: [
      {
        id: 'insop-1',
        quiz_id: 'ins-q2',
        question_text: 'When reading an insurance card, which piece of information uniquely identifies the patient to the insurance company?',
        question_type: 'multiple_choice',
        options: [
          'A. Group number',
          'B. Member ID number',
          'C. Plan name',
          'D. PCP name',
        ],
        correct_answer: 'B',
        explanation: 'The Member ID number uniquely identifies the individual patient within the insurance plan. The group number identifies the employer or organization, not the individual.',
        sort_order: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 'insop-2',
        quiz_id: 'ins-q2',
        question_text: 'When should you verify a patient\'s insurance eligibility?',
        question_type: 'multiple_choice',
        options: [
          'A. Only for new patients',
          'B. Only when the patient asks',
          'C. 48-72 hours before every scheduled appointment',
          'D. After the appointment is over',
        ],
        correct_answer: 'C',
        explanation: 'Best practice is to verify eligibility 48-72 hours before every appointment — not just for new patients. Insurance can change at any time due to job loss, open enrollment, or other life events.',
        sort_order: 2,
        created_at: new Date().toISOString(),
      },
      {
        id: 'insop-3',
        quiz_id: 'ins-q2',
        question_text: 'A patient has a $30 copay for primary care visits. When should you collect the copay?',
        question_type: 'multiple_choice',
        options: [
          'A. After the visit is complete',
          'B. At check-in, before the patient is seen',
          'C. Only if the patient offers to pay',
          'D. When the insurance company sends the EOB',
        ],
        correct_answer: 'B',
        explanation: 'Copays should be collected at check-in before the patient is seen. Collecting at the time of service is far more effective than billing the patient afterward.',
        sort_order: 3,
        created_at: new Date().toISOString(),
      },
      {
        id: 'insop-4',
        quiz_id: 'ins-q2',
        question_text: 'A patient has an 80/20 coinsurance plan with a $1,000 deductible that has been met. Their visit costs $200 (allowed amount). How much does the patient owe?',
        question_type: 'multiple_choice',
        options: [
          'A. $0',
          'B. $20',
          'C. $40',
          'D. $200',
        ],
        correct_answer: 'C',
        explanation: 'With an 80/20 plan and the deductible already met, insurance pays 80% ($160) and the patient pays 20% ($40).',
        sort_order: 4,
        created_at: new Date().toISOString(),
      },
      {
        id: 'insop-5',
        quiz_id: 'ins-q2',
        question_text: 'A patient says they reached their out-of-pocket maximum last month. What does this mean for today\'s visit?',
        question_type: 'multiple_choice',
        options: [
          'A. They still owe their copay',
          'B. Insurance covers 100% of covered services',
          'C. Their deductible resets',
          'D. They need to pay the full amount',
        ],
        correct_answer: 'B',
        explanation: 'Once a patient reaches their out-of-pocket maximum, insurance covers 100% of covered services for the rest of the plan year. No copay, deductible, or coinsurance is due.',
        sort_order: 5,
        created_at: new Date().toISOString(),
      },
      {
        id: 'insop-6',
        quiz_id: 'ins-q2',
        question_text: 'You notice that the insurance card a patient handed you has a different last name than what\'s in your system. What should you do?',
        question_type: 'multiple_choice',
        options: [
          'A. Use the name in your system since it\'s already there',
          'B. Ask the patient about the discrepancy and update accordingly',
          'C. Ignore it — names don\'t affect claims',
          'D. Cancel the appointment',
        ],
        correct_answer: 'B',
        explanation: 'Name discrepancies are a common cause of claim denials. Always ask the patient about the difference and update the record to match the insurance card exactly.',
        sort_order: 6,
        created_at: new Date().toISOString(),
      },
      {
        id: 'insop-7',
        quiz_id: 'ins-q2',
        question_text: 'Why is it important to scan both the front AND back of an insurance card?',
        question_type: 'multiple_choice',
        options: [
          'A. The back has the patient\'s photo',
          'B. The back typically has claims submission addresses, phone numbers, and sometimes additional plan details',
          'C. It\'s not important — the front has all needed information',
          'D. The back has the patient\'s medical history',
        ],
        correct_answer: 'B',
        explanation: 'The back of an insurance card typically contains the claims submission address, customer service phone number, and sometimes pharmacy benefit or behavioral health plan information — all essential for billing.',
        sort_order: 7,
        created_at: new Date().toISOString(),
      },
      {
        id: 'insop-8',
        quiz_id: 'ins-q2',
        question_text: 'A patient\'s deductible has not been met. They have a specialist visit that costs $300 (allowed amount). What should you collect?',
        question_type: 'multiple_choice',
        options: [
          'A. Just the copay',
          'B. Nothing — bill the insurance first',
          'C. Up to the full allowed amount, as it applies to the deductible',
          'D. 20% coinsurance only',
        ],
        correct_answer: 'C',
        explanation: 'When the deductible hasn\'t been met, the patient is responsible for the allowed amount (up to their remaining deductible). After the deductible is met, coinsurance kicks in. Your office policy may vary on how much to collect up front.',
        sort_order: 8,
        created_at: new Date().toISOString(),
      },
    ],
  },
  'coverage-rules': {
    quiz: {
      id: 'ins-q3',
      module_id: 'ins-m3',
      title: 'Coverage Rules Quiz',
      description: 'Test your knowledge of government plans, special coverage situations, and coordination of benefits.',
      passing_score: 80,
      max_attempts: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    moduleTitle: 'Government Plans & Coverage Rules',
    courseTitle: 'Insurance & Billing',
    nextModuleSlug: 'financial-documents',
    nextModuleFirstLesson: 'explanation-of-benefits',
    questions: [
      {
        id: 'cr-1',
        quiz_id: 'ins-q3',
        question_text: 'Medicare Part B covers which of the following?',
        question_type: 'multiple_choice',
        options: [
          'A. Hospital inpatient stays',
          'B. Doctor visits, outpatient care, and preventive services',
          'C. Prescription drugs',
          'D. Dental and vision care',
        ],
        correct_answer: 'B',
        explanation: 'Medicare Part B covers doctor visits, outpatient care, preventive services, and durable medical equipment. Part A covers hospital stays, Part D covers prescriptions.',
        sort_order: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 'cr-2',
        quiz_id: 'ins-q3',
        question_text: 'What is the key difference between Medicare and Medicaid eligibility?',
        question_type: 'multiple_choice',
        options: [
          'A. Medicare is based on income; Medicaid is based on age',
          'B. Medicare is based on age or disability; Medicaid is based on income',
          'C. Both are based on age',
          'D. Both are based on income',
        ],
        correct_answer: 'B',
        explanation: 'Medicare eligibility is primarily based on age (65+) or qualifying disability. Medicaid eligibility is based on income and resources. Some patients qualify for both (dual-eligible).',
        sort_order: 2,
        created_at: new Date().toISOString(),
      },
      {
        id: 'cr-3',
        quiz_id: 'ins-q3',
        question_text: 'A patient has both Medicare and Medicaid. Which is billed first?',
        question_type: 'multiple_choice',
        options: [
          'A. Medicaid',
          'B. Medicare',
          'C. Whichever has better coverage',
          'D. The patient chooses',
        ],
        correct_answer: 'B',
        explanation: 'For dual-eligible patients, Medicare is always billed first as the primary payer. Medicaid then covers the remaining patient responsibility (deductibles, coinsurance, copays).',
        sort_order: 3,
        created_at: new Date().toISOString(),
      },
      {
        id: 'cr-4',
        quiz_id: 'ins-q3',
        question_text: 'A patient comes in with an injury that happened at work. How should this visit be billed?',
        question_type: 'multiple_choice',
        options: [
          'A. Bill the patient\'s regular health insurance',
          'B. Bill workers\' compensation insurance',
          'C. Bill Medicare',
          'D. Collect full payment from the patient',
        ],
        correct_answer: 'B',
        explanation: 'Work-related injuries must be billed to workers\' compensation, not the patient\'s regular health insurance. Workers\' comp is a completely separate system from health insurance.',
        sort_order: 4,
        created_at: new Date().toISOString(),
      },
      {
        id: 'cr-5',
        quiz_id: 'ins-q3',
        question_text: 'Under the birthday rule, which parent\'s insurance is primary for a dependent child?',
        question_type: 'multiple_choice',
        options: [
          'A. The parent who is older',
          'B. The parent whose birthday falls earlier in the calendar year (by month and day)',
          'C. The father\'s insurance is always primary',
          'D. The parent with the better plan',
        ],
        correct_answer: 'B',
        explanation: 'The birthday rule states that the parent whose birthday (month and day — NOT birth year) falls earlier in the calendar year has the primary plan for the child.',
        sort_order: 5,
        created_at: new Date().toISOString(),
      },
      {
        id: 'cr-6',
        quiz_id: 'ins-q3',
        question_text: 'A patient has an HMO plan and wants to see an out-of-network specialist. What should you tell them?',
        question_type: 'multiple_choice',
        options: [
          'A. "Your plan will cover the visit at a higher cost"',
          'B. "Your HMO plan does not cover out-of-network services except in emergencies"',
          'C. "There\'s no difference between in-network and out-of-network with an HMO"',
          'D. "You\'ll need to pay your coinsurance, but the visit is covered"',
        ],
        correct_answer: 'B',
        explanation: 'HMO plans generally do not cover out-of-network services except in emergencies. The patient would likely need to pay the full cost out of pocket.',
        sort_order: 6,
        created_at: new Date().toISOString(),
      },
      {
        id: 'cr-7',
        quiz_id: 'ins-q3',
        question_text: 'Under the ACA, until what age can a child stay on a parent\'s health insurance plan?',
        question_type: 'multiple_choice',
        options: [
          'A. 18',
          'B. 21',
          'C. 26',
          'D. 30',
        ],
        correct_answer: 'C',
        explanation: 'The Affordable Care Act allows children to remain on a parent\'s health insurance plan until age 26 — regardless of marital status, student status, or financial dependency.',
        sort_order: 7,
        created_at: new Date().toISOString(),
      },
      {
        id: 'cr-8',
        quiz_id: 'ins-q3',
        question_text: 'TRICARE provides healthcare coverage for which group?',
        question_type: 'multiple_choice',
        options: [
          'A. Federal government employees',
          'B. Low-income families',
          'C. Military service members, retirees, and their families',
          'D. Railroad workers',
        ],
        correct_answer: 'C',
        explanation: 'TRICARE is the healthcare program for uniformed service members, military retirees, and their families. It is managed by the Defense Health Agency.',
        sort_order: 8,
        created_at: new Date().toISOString(),
      },
      {
        id: 'cr-9',
        quiz_id: 'ins-q3',
        question_text: 'An employee has insurance through their own employer AND is covered under their spouse\'s plan. Which is primary?',
        question_type: 'multiple_choice',
        options: [
          'A. The spouse\'s plan',
          'B. The employee\'s own employer plan',
          'C. Whichever plan has the lower deductible',
          'D. The patient gets to choose',
        ],
        correct_answer: 'B',
        explanation: 'When a patient has coverage through their own employer and through a spouse\'s employer, the patient\'s own employer plan is always primary.',
        sort_order: 9,
        created_at: new Date().toISOString(),
      },
      {
        id: 'cr-10',
        quiz_id: 'ins-q3',
        question_text: 'A Medigap (Medicare Supplement) plan can be used with Medicare Advantage.',
        question_type: 'true_false',
        options: ['True', 'False'],
        correct_answer: 'False',
        explanation: 'Medigap plans can only be used with Original Medicare (Parts A and B). They cannot be used with Medicare Advantage (Part C) plans.',
        sort_order: 10,
        created_at: new Date().toISOString(),
      },
    ],
  },
  'financial-documents': {
    quiz: {
      id: 'ins-q4',
      module_id: 'ins-m4',
      title: 'Financial Documents Quiz',
      description: 'Test your knowledge of EOBs, ERAs, claim processing, and ABNs.',
      passing_score: 80,
      max_attempts: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    moduleTitle: 'Financial Documents',
    courseTitle: 'Insurance & Billing',
    nextModuleSlug: 'revenue-cycle',
    nextModuleFirstLesson: 'revenue-cycle-overview',
    questions: [
      {
        id: 'fd-1',
        quiz_id: 'ins-q4',
        question_text: 'A patient calls saying they received a document from their insurance company showing charges for their recent visit. They think it\'s a bill. What did they most likely receive?',
        question_type: 'multiple_choice',
        options: [
          'A. A bill from your office',
          'B. An Explanation of Benefits (EOB)',
          'C. An ERA',
          'D. A prior authorization notice',
        ],
        correct_answer: 'B',
        explanation: 'Patients commonly confuse an EOB with a bill. An EOB is a statement from the insurance company explaining how a claim was processed — it is NOT a bill. The patient\'s actual bill comes from the provider.',
        sort_order: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 'fd-2',
        quiz_id: 'ins-q4',
        question_text: 'On an EOB, the "allowed amount" represents:',
        question_type: 'multiple_choice',
        options: [
          'A. The amount the patient owes',
          'B. The maximum the insurance company considers reasonable for the service',
          'C. The provider\'s full charge',
          'D. The amount of the patient\'s deductible',
        ],
        correct_answer: 'B',
        explanation: 'The allowed amount is the negotiated rate — the maximum the insurance company considers reasonable for the service. For in-network providers, this is the contracted rate they agreed to accept.',
        sort_order: 2,
        created_at: new Date().toISOString(),
      },
      {
        id: 'fd-3',
        quiz_id: 'ins-q4',
        question_text: 'What is the role of a clearinghouse in the claims process?',
        question_type: 'multiple_choice',
        options: [
          'A. It provides patient care',
          'B. It formats and routes claims from providers to the correct insurance companies',
          'C. It collects payments from patients',
          'D. It approves prior authorizations',
        ],
        correct_answer: 'B',
        explanation: 'A clearinghouse is a third-party intermediary that receives claims from providers, checks formatting, and routes them to the correct insurance company. It acts as a sorting facility for electronic claims.',
        sort_order: 3,
        created_at: new Date().toISOString(),
      },
      {
        id: 'fd-4',
        quiz_id: 'ins-q4',
        question_text: 'What is the difference between an EOB and an ERA?',
        question_type: 'multiple_choice',
        options: [
          'A. They are the same document',
          'B. An EOB is sent to the patient; an ERA is sent to the provider',
          'C. An EOB is for Medicare only; an ERA is for commercial insurance',
          'D. An ERA is sent to the patient; an EOB is sent to the provider',
        ],
        correct_answer: 'B',
        explanation: 'An EOB (Explanation of Benefits) is sent to the patient explaining how their claim was processed. An ERA (Electronic Remittance Advice) contains the same core information but is sent electronically to the provider.',
        sort_order: 4,
        created_at: new Date().toISOString(),
      },
      {
        id: 'fd-5',
        quiz_id: 'ins-q4',
        question_text: 'A "clean claim" is one that:',
        question_type: 'multiple_choice',
        options: [
          'A. Has been paid in full',
          'B. Is complete, accurate, and passes all scrubbing checks without errors',
          'C. Was submitted on paper instead of electronically',
          'D. Has been approved by the provider',
        ],
        correct_answer: 'B',
        explanation: 'A clean claim is complete, accurate, and has no errors — it passes through the clearinghouse and is accepted by the payer for processing without rejection. Clean claims are paid faster.',
        sort_order: 5,
        created_at: new Date().toISOString(),
      },
      {
        id: 'fd-6',
        quiz_id: 'ins-q4',
        question_text: 'An ABN (Advanced Beneficiary Notice) must be given to:',
        question_type: 'multiple_choice',
        options: [
          'A. All patients before every visit',
          'B. Only Medicaid patients',
          'C. Original Medicare patients when a service may not be covered',
          'D. Medicare Advantage patients only',
        ],
        correct_answer: 'C',
        explanation: 'An ABN is required for Original Medicare (Parts A and B) patients when the provider believes a service may not be covered. It must be presented BEFORE the service is provided.',
        sort_order: 6,
        created_at: new Date().toISOString(),
      },
      {
        id: 'fd-7',
        quiz_id: 'ins-q4',
        question_text: 'If a required ABN is not given to a Medicare patient before a service, and Medicare denies the claim, what happens?',
        question_type: 'multiple_choice',
        options: [
          'A. The patient must pay the full amount',
          'B. Medicare will reconsider the claim',
          'C. The practice absorbs the cost — the patient cannot be billed',
          'D. The claim is automatically appealed',
        ],
        correct_answer: 'C',
        explanation: 'If a required ABN is not provided and Medicare denies the claim, the practice cannot bill the patient. The practice absorbs the full cost of the service — a preventable financial loss.',
        sort_order: 7,
        created_at: new Date().toISOString(),
      },
      {
        id: 'fd-8',
        quiz_id: 'ins-q4',
        question_text: 'Claim scrubbing helps prevent claim denials by:',
        question_type: 'multiple_choice',
        options: [
          'A. Verifying the patient\'s identity',
          'B. Automatically checking claims for errors before submission to the payer',
          'C. Collecting copays from patients',
          'D. Scheduling follow-up appointments',
        ],
        correct_answer: 'B',
        explanation: 'Claim scrubbing is an automated review that catches errors — missing information, invalid codes, duplicate claims, and mismatches — before the claim is submitted to the insurance company. It\'s like a spell-checker for claims.',
        sort_order: 8,
        created_at: new Date().toISOString(),
      },
    ],
  },
  'revenue-cycle': {
    quiz: {
      id: 'ins-q5',
      module_id: 'ins-m5',
      title: 'Revenue Cycle Quiz',
      description: 'Test your knowledge of revenue cycle phases, payment models, and collections.',
      passing_score: 80,
      max_attempts: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    moduleTitle: 'Revenue Cycle & Payment Models',
    courseTitle: 'Insurance & Billing',
    nextModuleSlug: null,
    nextModuleFirstLesson: null,
    questions: [
      {
        id: 'rc-1',
        quiz_id: 'ins-q5',
        question_text: 'Which revenue cycle phase involves the front desk verifying insurance, collecting copays, and confirming demographics?',
        question_type: 'multiple_choice',
        options: [
          'A. Charge Capture',
          'B. Claim Submission',
          'C. Registration & Check-In',
          'D. Payment Posting',
        ],
        correct_answer: 'C',
        explanation: 'Registration and check-in (Phase 2) is where the front desk verifies identity, confirms insurance, updates demographics, and collects copays. This is one of the most critical phases for preventing downstream errors.',
        sort_order: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 'rc-2',
        quiz_id: 'ins-q5',
        question_text: 'In the fee-for-service payment model, how is the provider paid?',
        question_type: 'multiple_choice',
        options: [
          'A. A fixed monthly amount per patient',
          'B. For each individual service performed',
          'C. Based on patient satisfaction scores',
          'D. A single bundled payment for all services',
        ],
        correct_answer: 'B',
        explanation: 'In fee-for-service (FFS), the provider is paid for each individual service performed — each service has a code and a reimbursement rate. More services = more revenue.',
        sort_order: 2,
        created_at: new Date().toISOString(),
      },
      {
        id: 'rc-3',
        quiz_id: 'ins-q5',
        question_text: 'Under capitation, the provider receives a fixed monthly payment per patient regardless of how many services are provided.',
        question_type: 'true_false',
        options: ['True', 'False'],
        correct_answer: 'True',
        explanation: 'Capitation pays a fixed PMPM (per member per month) amount for each assigned patient. Whether the patient visits 5 times or 0 times, the payment is the same. This incentivizes preventive care.',
        sort_order: 3,
        created_at: new Date().toISOString(),
      },
      {
        id: 'rc-4',
        quiz_id: 'ins-q5',
        question_text: 'What does an aging report categorize?',
        question_type: 'multiple_choice',
        options: [
          'A. Patient ages by demographic group',
          'B. Unpaid balances by how long they\'ve been outstanding',
          'C. Insurance plan renewal dates',
          'D. Provider credentialing timelines',
        ],
        correct_answer: 'B',
        explanation: 'An aging report categorizes unpaid balances by age buckets: 0-30 days, 31-60 days, 61-90 days, 91-120 days, and 120+ days. The older the balance, the harder it is to collect.',
        sort_order: 4,
        created_at: new Date().toISOString(),
      },
      {
        id: 'rc-5',
        quiz_id: 'ins-q5',
        question_text: 'What is a contractual adjustment?',
        question_type: 'multiple_choice',
        options: [
          'A. A penalty for late claim submission',
          'B. The difference between the provider\'s billed charge and the insurance company\'s allowed amount',
          'C. A payment from the patient',
          'D. A bonus for seeing Medicare patients',
        ],
        correct_answer: 'B',
        explanation: 'A contractual adjustment is the difference between the provider\'s full charge and the negotiated allowed amount. In-network providers agree to write off this difference as a condition of being in the network.',
        sort_order: 5,
        created_at: new Date().toISOString(),
      },
      {
        id: 'rc-6',
        quiz_id: 'ins-q5',
        question_text: 'A Federally Qualified Health Center (FQHC) is required by HRSA to offer what to patients?',
        question_type: 'multiple_choice',
        options: [
          'A. Free prescription drugs',
          'B. A sliding fee scale based on income',
          'C. Same-day appointments',
          'D. Home health visits',
        ],
        correct_answer: 'B',
        explanation: 'FQHCs are required by HRSA (the Health Resources and Services Administration) to offer a sliding fee scale that reduces costs based on the patient\'s income and family size relative to the Federal Poverty Level.',
        sort_order: 6,
        created_at: new Date().toISOString(),
      },
      {
        id: 'rc-7',
        quiz_id: 'ins-q5',
        question_text: 'What is the Medicare timely filing limit for submitting claims?',
        question_type: 'multiple_choice',
        options: [
          'A. 30 days from date of service',
          'B. 90 days from date of service',
          'C. 12 months from date of service',
          'D. There is no deadline',
        ],
        correct_answer: 'C',
        explanation: 'Medicare requires claims to be submitted within 12 months (one calendar year) from the date of service. Missing this deadline means the claim is denied and the practice cannot bill the patient.',
        sort_order: 7,
        created_at: new Date().toISOString(),
      },
      {
        id: 'rc-8',
        quiz_id: 'ins-q5',
        question_text: 'In value-based care, a portion of the provider\'s payment is tied to:',
        question_type: 'multiple_choice',
        options: [
          'A. The number of services performed',
          'B. Quality metrics like patient satisfaction and health outcomes',
          'C. The provider\'s years of experience',
          'D. The number of new patients seen',
        ],
        correct_answer: 'B',
        explanation: 'Value-based care ties payment to measurable quality outcomes — patient satisfaction scores, preventive care rates, chronic disease management, and hospital readmission rates. Better outcomes = higher payment.',
        sort_order: 8,
        created_at: new Date().toISOString(),
      },
    ],
  },
  'medical-terminology-basics': {
    quiz: {
      id: 'q4',
      module_id: 'm4',
      title: 'Medical Terminology Quiz',
      description: 'Test your knowledge of medical abbreviations and word building.',
      passing_score: 80,
      max_attempts: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    moduleTitle: 'Medical Terminology Basics',
    courseTitle: 'Healthcare Foundations',
    nextModuleSlug: null,
    nextModuleFirstLesson: null,
    questions: [
      {
        id: 'q4-1',
        quiz_id: 'q4',
        question_text: 'You see "STAT" on a lab result that just came in. What should you do?',
        question_type: 'multiple_choice',
        options: [
          'A. File it with the other lab results for later review',
          'B. Stop what you\'re doing and get it to the provider immediately',
          'C. Add it to the callback list for tomorrow',
          'D. Wait until the provider asks for it',
        ],
        correct_answer: 'B',
        explanation: 'STAT means immediately. When you see STAT on a lab result, you stop what you\'re doing and hand-deliver that information to the provider or clinical staff right now. A STAT result that sits in a pile could mean a missed diagnosis.',
        sort_order: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q4-2',
        quiz_id: 'q4',
        question_text: 'What is the difference between ASAP and URG in terms of urgency?',
        question_type: 'multiple_choice',
        options: [
          'A. ASAP means handle today; URG means within hours',
          'B. ASAP means within hours; URG means handle today',
          'C. They mean the same thing',
          'D. ASAP is for lab results; URG is for messages',
        ],
        correct_answer: 'A',
        explanation: 'ASAP (as soon as possible) is high priority and should be handled today. URG (urgent) needs prompt attention but has a small window—typically within hours, not minutes.',
        sort_order: 2,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q4-3',
        quiz_id: 'q4',
        question_text: 'A patient calls to refill a medication they take "BID." How often do they take it?',
        question_type: 'multiple_choice',
        options: [
          'A. Once daily',
          'B. Twice daily',
          'C. Three times daily',
          'D. As needed',
        ],
        correct_answer: 'B',
        explanation: 'BID means twice daily. QD is once daily, TID is three times daily, QID is four times daily, and PRN means as needed.',
        sort_order: 3,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q4-4',
        quiz_id: 'q4',
        question_text: 'A patient is scheduled for a procedure requiring NPO. What does this mean?',
        question_type: 'multiple_choice',
        options: [
          'A. No food, but water is OK',
          'B. No food and no water',
          'C. Light meal only',
          'D. No prescription medications',
        ],
        correct_answer: 'B',
        explanation: 'NPO means nothing by mouth—no food AND no water. This is stricter than fasting (no food, water usually OK). If a patient doesn\'t follow NPO instructions, the procedure may be cancelled.',
        sort_order: 4,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q4-5',
        quiz_id: 'q4',
        question_text: 'You see "NP" on the schedule. This indicates the patient:',
        question_type: 'multiple_choice',
        options: [
          'A. Needs a prescription',
          'B. Is a nurse practitioner',
          'C. Is a new patient',
          'D. Has no payment due',
        ],
        correct_answer: 'C',
        explanation: 'NP means new patient—they need a longer appointment slot and will have paperwork to complete. EST is an established patient, and F-U is a follow-up visit.',
        sort_order: 5,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q4-6',
        quiz_id: 'q4',
        question_text: 'Medical terms are built from three parts: prefix, root, and suffix. Which part tells you which body system is involved?',
        question_type: 'multiple_choice',
        options: [
          'A. Prefix',
          'B. Root',
          'C. Suffix',
          'D. All three equally',
        ],
        correct_answer: 'B',
        explanation: 'The root is the core of the word and usually refers to a body part or system (like cardio for heart, gastro for stomach). The prefix modifies the meaning, and the suffix tells you what\'s happening.',
        sort_order: 6,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q4-7',
        quiz_id: 'q4',
        question_text: 'A patient calls reporting worsening "dyspnea." Breaking down this term: dys = difficult, pnea = breathing. What is dyspnea?',
        question_type: 'multiple_choice',
        options: [
          'A. Difficulty swallowing',
          'B. Chest pain',
          'C. Difficult breathing/shortness of breath',
          'D. Dizziness',
        ],
        correct_answer: 'C',
        explanation: 'Dyspnea means difficult breathing or shortness of breath (dys = difficult, pnea = breathing). This is not routine—a patient with worsening breathing difficulty should be routed to clinical staff promptly.',
        sort_order: 7,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q4-8',
        quiz_id: 'q4',
        question_text: 'The prefix "hypo-" means deficient or below normal, while "hyper-" means excessive or above normal.',
        question_type: 'true_false',
        options: ['True', 'False'],
        correct_answer: 'True',
        explanation: 'Hypo- means deficient or below normal (hypoglycemia = low blood sugar). Hyper- means excessive or above normal (hypertension = high blood pressure). These prefixes help you assess urgency.',
        sort_order: 8,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q4-9',
        quiz_id: 'q4',
        question_text: 'A patient is calling about their "post-cholecystectomy" follow-up. The suffix "-ectomy" means:',
        question_type: 'multiple_choice',
        options: [
          'A. Inflammation of',
          'B. Surgical removal',
          'C. Visual examination',
          'D. Disease of',
        ],
        correct_answer: 'B',
        explanation: 'The suffix -ectomy means surgical removal. Cholecystectomy is gallbladder removal (chole = gallbladder, cyst = sac/bladder, ectomy = surgical removal). Post- means after, so this patient had their gallbladder removed.',
        sort_order: 9,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q4-10',
        quiz_id: 'q4',
        question_text: 'A message mentions a patient has "apnea." The prefix "a-" means "without." What does apnea mean, and how should you route this message?',
        question_type: 'multiple_choice',
        options: [
          'A. Without appetite—routine callback',
          'B. Without breathing—route to clinical staff immediately',
          'C. Without pain—no action needed',
          'D. Without anxiety—low priority',
        ],
        correct_answer: 'B',
        explanation: 'Apnea means without breathing (a- = without, pnea = breathing). This is serious and should be routed to clinical staff immediately. Breathing issues always need prompt attention.',
        sort_order: 10,
        created_at: new Date().toISOString(),
      },
    ],
  },
  'registration-scheduling': {
    quiz: {
      id: 'q5',
      module_id: 'm5',
      title: 'Registration & Scheduling Quiz',
      description: 'Test your knowledge of patient registration, scheduling, and workflow best practices.',
      passing_score: 80,
      max_attempts: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    moduleTitle: 'Registration & Scheduling',
    courseTitle: 'Navigating Workflows',
    nextModuleSlug: null,
    nextModuleFirstLesson: null,
    questions: [
      {
        id: 'q5-1',
        quiz_id: 'q5',
        question_text: 'A caller says they\'re not sure if they\'ve been to your clinic before. What should you do FIRST?',
        question_type: 'multiple_choice',
        options: [
          'A. Start creating a new patient record immediately',
          'B. Search the system for their name and date of birth',
          'C. Ask them to call back when they\'re certain',
          'D. Transfer them to a supervisor',
        ],
        correct_answer: 'B',
        explanation: 'Always search before creating a new record. Duplicate records cause real harm: split medical history, denied insurance claims, and providers making decisions with incomplete information.',
        sort_order: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q5-2',
        quiz_id: 'q5',
        question_text: 'When searching for a patient to avoid creating a duplicate record, which search methods should you try?',
        question_type: 'multiple_choice',
        options: [
          'A. Last name and date of birth only',
          'B. First name only',
          'C. Last name, first name, DOB, spelling variations, maiden names, and phone number',
          'D. Social security number only',
        ],
        correct_answer: 'C',
        explanation: 'Search thoroughly using last name, first name, date of birth, spelling variations (Smith vs Smyth), maiden names, and phone number. Only when you\'re confident no record exists should you proceed with registration.',
        sort_order: 2,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q5-3',
        quiz_id: 'q5',
        question_text: 'After registering a new patient, what should you remind them to bring to their appointment?',
        question_type: 'multiple_choice',
        options: [
          'A. Just their photo ID',
          'B. Just their insurance card',
          'C. Their insurance card and photo ID',
          'D. Nothing—you have all their information',
        ],
        correct_answer: 'C',
        explanation: 'Always remind new patients to bring their insurance card and photo ID to the appointment. This allows you to verify their identity and insurance information.',
        sort_order: 3,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q5-4',
        quiz_id: 'q5',
        question_text: 'When scheduling an existing patient, what critical question should you ALWAYS ask?',
        question_type: 'multiple_choice',
        options: [
          'A. "What is your favorite color?"',
          'B. "Is your insurance still [insurance name]?"',
          'C. "What time do you prefer to wake up?"',
          'D. "How was your last visit?"',
        ],
        correct_answer: 'B',
        explanation: 'Always ask about insurance changes. People change jobs, coverage lapses, and plans change at the start of the year. If you don\'t ask, you won\'t know until check-in—or worse, until a claim is denied weeks later.',
        sort_order: 4,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q5-5',
        quiz_id: 'q5',
        question_text: 'An existing patient\'s phone number has changed. When should you update it in the system?',
        question_type: 'multiple_choice',
        options: [
          'A. After the call ends',
          'B. At the end of the day',
          'C. Immediately during the call',
          'D. When you have time later',
        ],
        correct_answer: 'C',
        explanation: 'Update contact information immediately—don\'t make a note to do it later. Outdated contact information means missed reminders, returned mail, and patients who don\'t show up because they never got the message.',
        sort_order: 5,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q5-6',
        quiz_id: 'q5',
        question_text: 'At checkout, a patient declines to schedule their follow-up appointment. What should you do?',
        question_type: 'multiple_choice',
        options: [
          'A. Let it go—it\'s their choice',
          'B. Force them to schedule',
          'C. Explain why it matters, offer to call later, document the declination, and add them to the recall list',
          'D. Tell the provider immediately',
        ],
        correct_answer: 'C',
        explanation: 'Don\'t just let it go. Gently explain why the follow-up matters, offer an alternative (call them later to schedule), document that they declined, add them to the recall list, and provide the clinic contact number.',
        sort_order: 6,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q5-7',
        quiz_id: 'q5',
        question_text: 'When making reminder calls, how far in advance should you call patients?',
        question_type: 'multiple_choice',
        options: [
          'A. The morning of the appointment',
          'B. 48 to 72 hours before the appointment',
          'C. One week before the appointment',
          'D. One month before the appointment',
        ],
        correct_answer: 'B',
        explanation: 'Call patients 48-72 hours before their appointment. This gives them time to confirm or reschedule if they can\'t make it, rather than becoming a no-show.',
        sort_order: 7,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q5-8',
        quiz_id: 'q5',
        question_text: 'During a reminder call, a patient says they can\'t make their appointment. What should you do?',
        question_type: 'multiple_choice',
        options: [
          'A. Ask them to call back when they\'re ready to reschedule',
          'B. Cancel the appointment and move on',
          'C. Handle the reschedule right then—offer alternatives and book a new time',
          'D. Tell them to figure it out themselves',
        ],
        correct_answer: 'C',
        explanation: 'Handle the reschedule immediately—don\'t ask them to call back. They might not. Offer two or three alternative times, book the new appointment, and update the system. The goal is to keep them scheduled, not just mark the original as cancelled.',
        sort_order: 8,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q5-9',
        quiz_id: 'q5',
        question_text: 'Which patients should be prioritized when making reminder calls?',
        question_type: 'multiple_choice',
        options: [
          'A. Established patients with perfect attendance',
          'B. New patients, procedures/longer appointments, and patients with no-show history',
          'C. Patients alphabetically by last name',
          'D. Patients who have been with the clinic the longest',
        ],
        correct_answer: 'B',
        explanation: 'Prioritize: new patients (highest risk—they\'ve never been to your clinic), procedures and longer appointments (harder to fill last-minute), and patients with a history of no-shows who need that extra reminder.',
        sort_order: 9,
        created_at: new Date().toISOString(),
      },
      {
        id: 'q5-10',
        quiz_id: 'q5',
        question_text: '"If it\'s not documented, it didn\'t happen." This statement applies to:',
        question_type: 'multiple_choice',
        options: [
          'A. Only clinical notes from providers',
          'B. Only insurance verification',
          'C. All front office activities including recall outreach, scheduling changes, and patient communications',
          'D. Only emergency situations',
        ],
        correct_answer: 'C',
        explanation: 'Documentation matters for all front office activities—recall outreach attempts, scheduling changes, patient communications, and information updates. It\'s essential for quality reporting, continuity of care, and for the next person who works with that patient.',
        sort_order: 10,
        created_at: new Date().toISOString(),
      },
    ],
  },
  // =============================================
  // EHR & PRACTICE MANAGEMENT QUIZZES
  // =============================================
  'ehr-basics': {
    quiz: {
      id: 'ehr-q1',
      module_id: 'ehr-m1',
      title: 'EHR Basics Quiz',
      description: 'Test your knowledge of PM systems, EHR components, and patient identifiers.',
      passing_score: 80,
      max_attempts: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    moduleTitle: 'Understanding Your Systems',
    courseTitle: 'EHR & Practice Management',
    nextModuleSlug: 'clinic-encounters',
    nextModuleFirstLesson: 'clinic-encounter-types',
    questions: [
      {
        id: 'ehr-q1-1',
        quiz_id: 'ehr-q1',
        question_text: 'What is the primary purpose of a Practice Management (PM) system?',
        question_type: 'multiple_choice',
        options: [
          'A. Document clinical notes and diagnoses',
          'B. Handle the business side: scheduling, demographics, billing, and claims',
          'C. Store lab results and imaging reports',
          'D. Manage medication prescriptions',
        ],
        correct_answer: 'B',
        explanation: 'The PM system handles the business operations of the practice — scheduling, patient demographics, insurance info, billing, claims submission, and payment posting. The EHR handles the clinical documentation side.',
        sort_order: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q1-2',
        quiz_id: 'ehr-q1',
        question_text: 'What does an MRN (Medical Record Number) identify?',
        question_type: 'multiple_choice',
        options: [
          'A. A specific visit or encounter',
          'B. The patient — one MRN per patient, permanent and lifelong',
          'C. The insurance plan on file',
          'D. The provider who saw the patient',
        ],
        correct_answer: 'B',
        explanation: 'The MRN is the patient\'s permanent identifier. One patient = one MRN, forever. It stays the same across every visit, every department, every year. Think of it as the patient\'s "account number."',
        sort_order: 2,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q1-3',
        quiz_id: 'ehr-q1',
        question_text: 'What is a FIN (Financial Identification Number)?',
        question_type: 'multiple_choice',
        options: [
          'A. The patient\'s permanent identifier across all visits',
          'B. A unique number assigned to each specific encounter/visit',
          'C. The provider\'s billing identification number',
          'D. The insurance company\'s member ID',
        ],
        correct_answer: 'B',
        explanation: 'The FIN (also called encounter number or account number) is unique to each visit. A patient gets a new FIN every time they come in. It ties that specific visit to its charges, documentation, and billing.',
        sort_order: 3,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q1-4',
        quiz_id: 'ehr-q1',
        question_text: 'Which system does the front desk primarily work in for scheduling and registration?',
        question_type: 'multiple_choice',
        options: [
          'A. The EHR only',
          'B. The Practice Management (PM) system',
          'C. The billing clearinghouse',
          'D. The clinical documentation system',
        ],
        correct_answer: 'B',
        explanation: 'Front desk staff spend most of their time in the PM system — scheduling appointments, registering patients, verifying insurance, and collecting payments. They access limited EHR views for things like message routing.',
        sort_order: 4,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q1-5',
        quiz_id: 'ehr-q1',
        question_text: 'The patient banner in the EHR always shows which critical information?',
        question_type: 'multiple_choice',
        options: [
          'A. Insurance details and copay amount',
          'B. Patient name, DOB, MRN, allergies, and preferred pharmacy',
          'C. The provider\'s schedule for the day',
          'D. Previous visit diagnoses and treatment plans',
        ],
        correct_answer: 'B',
        explanation: 'The patient banner is the always-visible strip at the top of every screen showing name, DOB, MRN, allergies, and preferred pharmacy. It exists for safety — always verify the banner matches your patient before doing anything.',
        sort_order: 5,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q1-6',
        quiz_id: 'ehr-q1',
        question_text: 'How do PM and EHR systems typically connect?',
        question_type: 'multiple_choice',
        options: [
          'A. They don\'t — staff must enter everything twice',
          'B. Through the encounter, which bridges scheduling/billing in PM with clinical documentation in EHR',
          'C. Only through printed paper forms',
          'D. Through the patient\'s insurance company',
        ],
        correct_answer: 'B',
        explanation: 'The encounter bridges both systems. The PM creates the scheduling and billing container, while the EHR holds the clinical documentation. They exchange data through ADT feeds and HL7 messages.',
        sort_order: 6,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q1-7',
        quiz_id: 'ehr-q1',
        question_text: 'Why is every click in the EHR logged in an audit trail?',
        question_type: 'multiple_choice',
        options: [
          'A. To track how fast employees work',
          'B. To comply with HIPAA — ensuring only authorized access to patient records',
          'C. To bill patients for the time spent on their chart',
          'D. To create automatic backup copies',
        ],
        correct_answer: 'B',
        explanation: 'Every access to a patient record is logged for HIPAA compliance and security. Audit trails show who accessed what, when, and from where. Accessing records for non-work reasons (even out of curiosity) is a HIPAA violation.',
        sort_order: 7,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q1-8',
        quiz_id: 'ehr-q1',
        question_text: 'What is "role-based access" in the EHR?',
        question_type: 'multiple_choice',
        options: [
          'A. Everyone in the clinic can see everything',
          'B. Different staff roles see different parts of the record based on their job function',
          'C. Only doctors can use the EHR',
          'D. Access is based on how long you\'ve worked at the clinic',
        ],
        correct_answer: 'B',
        explanation: 'Role-based access means front desk staff see scheduling, demographics, and billing screens but not full clinical notes. Providers see clinical documentation. Each role only sees what they need for their job — this protects patient privacy.',
        sort_order: 8,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q1-9',
        quiz_id: 'ehr-q1',
        question_text: 'A patient has MRN 1234567. They come in for a visit today and get FIN 9876543. They return next week. What happens?',
        question_type: 'multiple_choice',
        options: [
          'A. They get a new MRN and a new FIN',
          'B. They keep MRN 1234567 and get a new FIN for the new visit',
          'C. They keep both the same MRN and same FIN',
          'D. They get a new MRN but keep the same FIN',
        ],
        correct_answer: 'B',
        explanation: 'The MRN stays the same forever — it\'s their permanent identity. But they get a new FIN for each visit because each encounter has its own charges, documentation, and billing. MRN = the person, FIN = the visit.',
        sort_order: 9,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q1-10',
        quiz_id: 'ehr-q1',
        question_text: 'Which of these tasks would you do in the EHR rather than the PM system?',
        question_type: 'multiple_choice',
        options: [
          'A. Schedule an appointment',
          'B. Verify insurance eligibility',
          'C. Route a patient message to the nurse triage pool',
          'D. Post a payment to an account',
        ],
        correct_answer: 'C',
        explanation: 'Message routing happens in the EHR — message pools, task lists, and clinical communication all live there. Scheduling, insurance verification, and payment posting are PM system functions.',
        sort_order: 10,
        created_at: new Date().toISOString(),
      },
    ],
  },
  'clinic-encounters': {
    quiz: {
      id: 'ehr-q2',
      module_id: 'ehr-m2',
      title: 'Clinic Encounters Quiz',
      description: 'Test your knowledge of encounter types, lifecycle stages, and scheduling methods.',
      passing_score: 80,
      max_attempts: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    moduleTitle: 'Clinic Encounters',
    courseTitle: 'EHR & Practice Management',
    nextModuleSlug: 'non-clinic-encounters',
    nextModuleFirstLesson: 'phone-encounters',
    questions: [
      {
        id: 'ehr-q2-1',
        quiz_id: 'ehr-q2',
        question_text: 'What defines a "new patient" encounter?',
        question_type: 'multiple_choice',
        options: [
          'A. Any patient who calls to schedule for the first time this year',
          'B. A patient not seen by this provider or specialty within the past 3 years',
          'C. A patient who has never had health insurance before',
          'D. Any patient under age 18',
        ],
        correct_answer: 'B',
        explanation: 'A new patient is defined as someone not seen by the provider (or same specialty/same group) in the past 3 years. This matters because new patient encounters require full registration, longer time slots, and have different billing codes.',
        sort_order: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q2-2',
        quiz_id: 'ehr-q2',
        question_text: 'Why is selecting the correct encounter type at scheduling so important?',
        question_type: 'multiple_choice',
        options: [
          'A. It only matters for the patient\'s preference',
          'B. Wrong type = wrong billing code = denied claim, plus wrong time allocation',
          'C. It doesn\'t matter — providers can change it later',
          'D. It only affects the waiting room assignment',
        ],
        correct_answer: 'B',
        explanation: 'Each encounter type has different time requirements, documentation needs, billing codes, and reimbursement rates. Scheduling the wrong type means the provider either has too little time or too much, and the billing code won\'t match what was actually done.',
        sort_order: 2,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q2-3',
        quiz_id: 'ehr-q2',
        question_text: 'What is a Medicare Annual Wellness Visit (MAWV/AWV)?',
        question_type: 'multiple_choice',
        options: [
          'A. A full physical examination covered by Medicare',
          'B. A preventive visit focused on health risk assessment and a personalized prevention plan — NOT a physical exam',
          'C. An emergency visit for Medicare patients',
          'D. A visit that only nurses can conduct',
        ],
        correct_answer: 'B',
        explanation: 'The MAWV is a health risk assessment and preventive care planning visit, NOT a physical exam. This is one of the most common points of confusion. Front desk must ensure the correct encounter type is selected and the patient understands what the visit covers.',
        sort_order: 3,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q2-4',
        quiz_id: 'ehr-q2',
        question_text: 'During the encounter lifecycle, what happens at the "check-in" stage?',
        question_type: 'multiple_choice',
        options: [
          'A. The provider documents their clinical findings',
          'B. The claim is submitted to the insurance company',
          'C. Patient identity is verified, demographics confirmed, copay collected, and encounter is activated',
          'D. Lab results are reviewed',
        ],
        correct_answer: 'C',
        explanation: 'Check-in is a front desk responsibility: verify identity (photo ID + DOB), confirm demographics, collect copay, and activate the encounter in the system. Status changes from "Scheduled" to "Arrived" to "Ready."',
        sort_order: 4,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q2-5',
        quiz_id: 'ehr-q2',
        question_text: 'What is Transitional Care Management (TCM)?',
        question_type: 'multiple_choice',
        options: [
          'A. A routine annual physical appointment',
          'B. A post-discharge follow-up visit within 7 or 14 days after leaving a hospital, SNF, or rehab facility',
          'C. A visit for patients transferring to a new doctor',
          'D. A phone call to check on a patient after surgery',
        ],
        correct_answer: 'B',
        explanation: 'TCM is specifically for post-discharge follow-up within a required timeframe (7 or 14 days depending on complexity). Front desk must schedule within the required window, confirm the discharge date, and document contact attempts.',
        sort_order: 5,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q2-6',
        quiz_id: 'ehr-q2',
        question_text: 'In wave scheduling, how are patients scheduled?',
        question_type: 'multiple_choice',
        options: [
          'A. Each patient gets a specific, individual time slot',
          'B. Multiple patients are scheduled at the top of the hour and seen in order of arrival',
          'C. Patients are only seen on a walk-in basis',
          'D. One patient is seen per hour',
        ],
        correct_answer: 'B',
        explanation: 'Wave scheduling books multiple patients at the top of each hour and sees them in order of arrival. It\'s common in high-volume primary care because it absorbs no-shows naturally, though it can mean longer wait times.',
        sort_order: 6,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q2-7',
        quiz_id: 'ehr-q2',
        question_text: 'What is block scheduling?',
        question_type: 'multiple_choice',
        options: [
          'A. Blocking all new patients from scheduling',
          'B. Reserving specific time blocks for specific encounter types (e.g., 9-10am = new patients only)',
          'C. Scheduling patients back-to-back with no breaks',
          'D. Only scheduling on certain days of the week',
        ],
        correct_answer: 'B',
        explanation: 'Block scheduling reserves specific time blocks for specific types of encounters. For example: new patients from 9-10am, procedures from 2-3pm. Provider schedule templates define these blocks and front desk must follow them.',
        sort_order: 7,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q2-8',
        quiz_id: 'ehr-q2',
        question_text: 'After the provider finishes with the patient, what flows from the EHR to the PM system?',
        question_type: 'multiple_choice',
        options: [
          'A. The patient\'s phone number',
          'B. Charges — CPT/ICD codes flow to PM for billing and claim submission',
          'C. The provider\'s personal notes',
          'D. The patient\'s medication list',
        ],
        correct_answer: 'B',
        explanation: 'After the clinical workflow, charge capture happens: the provider selects CPT and ICD codes in the EHR, and those charges flow to the PM system where the claim is built, scrubbed, and submitted to the payer.',
        sort_order: 8,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q2-9',
        quiz_id: 'ehr-q2',
        question_text: 'What is a provider schedule template?',
        question_type: 'multiple_choice',
        options: [
          'A. A printed schedule posted in the break room',
          'B. A recurring weekly pattern in the PM system defining available slots, block types, and clinic days',
          'C. A list of the provider\'s preferred patients',
          'D. A document the provider fills out each morning',
        ],
        correct_answer: 'B',
        explanation: 'A schedule template is a recurring weekly pattern built in the PM system. It defines: regular clinic days, half-days, procedure days, telehealth days, blocked time, and available appointment types for each time slot.',
        sort_order: 9,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q2-10',
        quiz_id: 'ehr-q2',
        question_text: 'At check-out, what should the front desk provide to the patient?',
        question_type: 'multiple_choice',
        options: [
          'A. A copy of the provider\'s full clinical notes',
          'B. An After Visit Summary (AVS), follow-up appointment, and any referral orders',
          'C. The insurance company\'s phone number only',
          'D. Nothing — they just leave',
        ],
        correct_answer: 'B',
        explanation: 'At check-out: schedule any follow-up appointments, provide the After Visit Summary (AVS), print/fax referral orders if needed, collect remaining balances, and ensure the encounter status updates to "Checked Out."',
        sort_order: 10,
        created_at: new Date().toISOString(),
      },
    ],
  },
  'non-clinic-encounters': {
    quiz: {
      id: 'ehr-q3',
      module_id: 'ehr-m3',
      title: 'Non-Clinic Encounters Quiz',
      description: 'Test your knowledge of phone encounters, non-visit types, and duplicate prevention.',
      passing_score: 80,
      max_attempts: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    moduleTitle: 'Non-Clinic Encounters',
    courseTitle: 'EHR & Practice Management',
    nextModuleSlug: null,
    nextModuleFirstLesson: null,
    questions: [
      {
        id: 'ehr-q3-1',
        quiz_id: 'ehr-q3',
        question_text: 'When should a phone encounter be created in the EHR?',
        question_type: 'multiple_choice',
        options: [
          'A. For every single phone call the office receives',
          'B. When a clinical decision is made, medication is changed, or test results are discussed',
          'C. Only when a patient requests one',
          'D. Only for calls longer than 10 minutes',
        ],
        correct_answer: 'B',
        explanation: 'Phone encounters are created when clinical information is exchanged — triage advice, medication changes, test results discussed, refill authorizations. NOT needed for scheduling calls, billing questions, or address changes.',
        sort_order: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q3-2',
        quiz_id: 'ehr-q3',
        question_text: 'A patient calls with a medication refill request. What should the front desk do?',
        question_type: 'multiple_choice',
        options: [
          'A. Approve the refill and call the pharmacy',
          'B. Document the medication name, pharmacy, and last fill date, then route to the refill pool',
          'C. Tell the patient to call the pharmacy directly',
          'D. Transfer them to the provider immediately',
        ],
        correct_answer: 'B',
        explanation: 'Front desk documents the request accurately (medication name, pharmacy, last fill date) and routes it to the refill pool where a provider reviews and either approves or denies the refill. Front desk never approves or denies refills.',
        sort_order: 2,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q3-3',
        quiz_id: 'ehr-q3',
        question_text: 'What is an eRx encounter?',
        question_type: 'multiple_choice',
        options: [
          'A. An in-person pharmacy visit',
          'B. A provider electronically sends a prescription without a clinic visit',
          'C. A patient ordering medication online',
          'D. An emergency prescription for controlled substances',
        ],
        correct_answer: 'B',
        explanation: 'eRx (electronic prescription) encounters are created when a provider sends a prescription electronically without a clinic visit — for refill authorizations, medication adjustments after lab review, or post-discharge changes.',
        sort_order: 3,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q3-4',
        quiz_id: 'ehr-q3',
        question_text: 'How do duplicate patient records typically happen?',
        question_type: 'multiple_choice',
        options: [
          'A. Only through system errors',
          'B. Nicknames vs legal names, typos, patient saying "I\'m new" when they\'re not, and skipping the search',
          'C. Only when patients have the same name',
          'D. Only at hospitals, never at clinics',
        ],
        correct_answer: 'B',
        explanation: 'Common causes include: nickname vs legal name (Liz/Elizabeth), data entry typos, patients incorrectly saying they\'re new, and the biggest one — staff skipping the search step when under pressure and creating a record without checking first.',
        sort_order: 4,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q3-5',
        quiz_id: 'ehr-q3',
        question_text: 'What is the "two-identifier rule" for preventing duplicate records?',
        question_type: 'multiple_choice',
        options: [
          'A. Always require two forms of photo ID',
          'B. Verify with at least two identifiers (name + DOB, or name + last 4 SSN) before creating a record',
          'C. Have two staff members verify the same record',
          'D. Check two different computer systems',
        ],
        correct_answer: 'B',
        explanation: 'Always verify with at least two identifiers before creating a new record: full legal name + DOB, or name + last 4 SSN, or name + phone number. Search by DOB first (most unique), then confirm the name.',
        sort_order: 5,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q3-6',
        quiz_id: 'ehr-q3',
        question_text: 'You discover two records that appear to belong to the same patient. What should you do?',
        question_type: 'multiple_choice',
        options: [
          'A. Merge the records yourself immediately',
          'B. Delete the newer record',
          'C. Flag it for HIM/IT — document both MRNs and how you discovered the duplicate',
          'D. Ignore it and continue with the current visit',
        ],
        correct_answer: 'C',
        explanation: 'NEVER merge records yourself — this requires careful review by Health Information Management (HIM) or IT. Document both MRNs, how you discovered it, and which record appears more complete. Most EHRs have a "potential duplicate" flag.',
        sort_order: 6,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q3-7',
        quiz_id: 'ehr-q3',
        question_text: 'What are the dangers of duplicate patient records?',
        question_type: 'multiple_choice',
        options: [
          'A. They only cause minor inconvenience',
          'B. Split allergies/medications (safety risk), incorrect insurance (denied claims), and fragmented history (wrong clinical decisions)',
          'C. They only affect billing',
          'D. They only affect the front desk workflow',
        ],
        correct_answer: 'B',
        explanation: 'Duplicates are a patient safety issue. Allergies and medications get split across records — a provider might not see a critical allergy. Insurance gets filed to the wrong record causing denials. Medical history is fragmented leading to incorrect clinical decisions.',
        sort_order: 7,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ehr-q3-8',
        quiz_id: 'ehr-q3',
        question_text: 'What is a message pool in the EHR?',
        question_type: 'multiple_choice',
        options: [
          'A. A swimming pool for hospital staff',
          'B. A shared team inbox where messages are routed by type — nurse triage, refills, referrals, billing',
          'C. A single inbox that only the provider can access',
          'D. A list of outgoing messages to patients',
        ],
        correct_answer: 'B',
        explanation: 'Message pools are team inboxes organized by function. When a patient calls, front desk creates a message in the EHR and routes it to the appropriate pool: nurse triage for clinical questions, refill pool for medication requests, referral pool for specialist requests, etc.',
        sort_order: 8,
        created_at: new Date().toISOString(),
      },
    ],
  },

  // ─── Patient Communication Quizzes ───

  'comm-foundations': {
    quiz: {
      id: 'comm-q1', module_id: 'comm-m1',
      title: 'Communication Foundations Quiz',
      description: 'Test your understanding of communication styles, active listening, and nonverbal cues.',
      passing_score: 80, max_attempts: 3,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    moduleTitle: 'Communication Foundations',
    courseTitle: 'Patient Communication',
    nextModuleSlug: 'patient-interactions',
    nextModuleFirstLesson: 'interviewing-techniques',
    questions: [
      {
        id: 'comm-q1-1', quiz_id: 'comm-q1',
        question_text: 'Which communication style is most effective in the healthcare workplace?',
        question_type: 'multiple_choice',
        options: ['A. Passive — avoids conflict and goes along with others', 'B. Aggressive — takes charge and gets things done quickly', 'C. Assertive — expresses needs clearly while respecting others', 'D. Passive-aggressive — hints at problems without direct confrontation'],
        correct_answer: 'C',
        explanation: 'The assertive style is the professional standard in healthcare. It communicates needs directly while respecting the other person, leading to fewer misunderstandings and better patient outcomes.',
        sort_order: 1, created_at: new Date().toISOString(),
      },
      {
        id: 'comm-q1-2', quiz_id: 'comm-q1',
        question_text: 'A patient says "I\'m really nervous about this procedure." Which response demonstrates active listening?',
        question_type: 'multiple_choice',
        options: ['A. "Don\'t worry, it\'ll be fine."', 'B. "It sounds like you\'re feeling anxious about the procedure. Would it help to know what to expect?"', 'C. "Lots of people get nervous. Have a seat and we\'ll call you back."', 'D. "Would you like to reschedule?"'],
        correct_answer: 'B',
        explanation: 'Active listening involves reflecting back what the patient said to show understanding, then asking a follow-up question. This validates their feelings without dismissing them or jumping to a solution.',
        sort_order: 2, created_at: new Date().toISOString(),
      },
      {
        id: 'comm-q1-3', quiz_id: 'comm-q1',
        question_text: 'In the communication cycle, what comes immediately after the sender encodes a message?',
        question_type: 'multiple_choice',
        options: ['A. Feedback', 'B. Decoding', 'C. Transmission through a channel', 'D. Receiver responds'],
        correct_answer: 'C',
        explanation: 'The communication cycle follows: Sender → Encoding → Channel (transmission) → Decoding → Receiver → Feedback. After the message is encoded, it is transmitted through a channel (verbal, written, electronic).',
        sort_order: 3, created_at: new Date().toISOString(),
      },
      {
        id: 'comm-q1-4', quiz_id: 'comm-q1',
        question_text: 'According to Mehrabian\'s communication research, what carries the most weight in face-to-face communication?',
        question_type: 'multiple_choice',
        options: ['A. The actual words spoken (7%)', 'B. Tone of voice (38%)', 'C. Body language and facial expressions (55%)', 'D. All three carry equal weight'],
        correct_answer: 'C',
        explanation: 'Mehrabian\'s research found that 55% of communication impact comes from body language and facial expressions, 38% from tone of voice, and only 7% from the actual words. This is why nonverbal awareness is critical at the front desk.',
        sort_order: 4, created_at: new Date().toISOString(),
      },
      {
        id: 'comm-q1-5', quiz_id: 'comm-q1',
        question_text: 'Which of the following is an example of showing empathy without overstepping professional boundaries?',
        question_type: 'multiple_choice',
        options: ['A. "I know exactly how you feel — my mom had the same thing."', 'B. "I can see this is difficult for you. How can I help right now?"', 'C. "You shouldn\'t be upset. The doctor is really good."', 'D. "Here\'s my personal number if you need to talk later."'],
        correct_answer: 'B',
        explanation: 'Professional empathy acknowledges the patient\'s feelings and offers help within your role. Sharing personal stories, dismissing feelings, or giving personal contact info crosses professional boundaries.',
        sort_order: 5, created_at: new Date().toISOString(),
      },
      {
        id: 'comm-q1-6', quiz_id: 'comm-q1',
        question_text: 'A patient is explaining their symptoms but you notice they keep looking at the floor and speaking very quietly. This is an example of:',
        question_type: 'multiple_choice',
        options: ['A. Passive communication style', 'B. Cultural communication norms', 'C. Nonverbal cues suggesting discomfort or anxiety', 'D. All of the above — context matters'],
        correct_answer: 'D',
        explanation: 'Without more context, all three could apply. Looking at the floor and speaking quietly could indicate a passive communication style, cultural norms around eye contact, or anxiety/discomfort. Good communicators consider all possibilities before drawing conclusions.',
        sort_order: 6, created_at: new Date().toISOString(),
      },
      {
        id: 'comm-q1-7', quiz_id: 'comm-q1',
        question_text: 'Maintaining an open posture (uncrossed arms, facing the patient, leaning slightly forward) at the front desk helps to:',
        question_type: 'multiple_choice',
        options: ['A. Make patients feel welcomed and heard', 'B. Demonstrate authority over the conversation', 'C. Speed up the check-in process', 'D. Comply with HIPAA regulations'],
        correct_answer: 'A',
        explanation: 'Open body posture signals approachability and attentiveness, helping patients feel welcomed and comfortable sharing information. This is especially important during stressful situations like first visits or billing discussions.',
        sort_order: 7, created_at: new Date().toISOString(),
      },
    ],
  },

  'patient-interactions': {
    quiz: {
      id: 'comm-q2', module_id: 'comm-m2',
      title: 'Patient Interactions Quiz',
      description: 'Test your skills in patient questioning techniques, barrier navigation, and inclusive communication.',
      passing_score: 80, max_attempts: 3,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    moduleTitle: 'Patient Interactions',
    courseTitle: 'Patient Communication',
    nextModuleSlug: 'professional-standards',
    nextModuleFirstLesson: 'professional-presence',
    questions: [
      {
        id: 'comm-q2-1', quiz_id: 'comm-q2',
        question_text: '"Can you tell me what brings you in today?" is an example of what type of question?',
        question_type: 'multiple_choice',
        options: ['A. Closed-ended question', 'B. Open-ended question', 'C. Probing question', 'D. Leading question'],
        correct_answer: 'B',
        explanation: 'Open-ended questions cannot be answered with a simple yes or no. They encourage the patient to explain in their own words, which helps gather more complete information during intake.',
        sort_order: 1, created_at: new Date().toISOString(),
      },
      {
        id: 'comm-q2-2', quiz_id: 'comm-q2',
        question_text: 'A patient speaks limited English. What is the BEST approach for communication?',
        question_type: 'multiple_choice',
        options: ['A. Speak louder and slower', 'B. Ask a bilingual family member to translate', 'C. Use a professional interpreter service or language line', 'D. Use hand gestures and simple words only'],
        correct_answer: 'C',
        explanation: 'Professional interpreter services are required for accurate medical communication. Using family members (especially children) can compromise accuracy, confidentiality, and create power imbalances. Speaking louder does not overcome a language barrier.',
        sort_order: 2, created_at: new Date().toISOString(),
      },
      {
        id: 'comm-q2-3', quiz_id: 'comm-q2',
        question_text: 'Which question would be OUTSIDE the front office scope of practice?',
        question_type: 'multiple_choice',
        options: ['A. "Is your insurance information still the same?"', 'B. "What medications are you currently taking?"', 'C. "Do you think your symptoms could be caused by your diabetes?"', 'D. "Who is your emergency contact?"'],
        correct_answer: 'C',
        explanation: 'Front office staff should never interpret symptoms, suggest diagnoses, or link symptoms to conditions — that is clinical practice. Collecting medication lists, insurance info, and emergency contacts are within scope.',
        sort_order: 3, created_at: new Date().toISOString(),
      },
      {
        id: 'comm-q2-4', quiz_id: 'comm-q2',
        question_text: 'When a patient asks you to use the pronouns "they/them," the correct response is:',
        question_type: 'multiple_choice',
        options: ['A. Explain that the EHR system only has male/female options', 'B. Use the requested pronouns and note them in the chart as appropriate', 'C. Ask why they prefer those pronouns', 'D. Use their first name instead to avoid confusion'],
        correct_answer: 'B',
        explanation: 'Respecting a patient\'s pronouns is both professional and increasingly supported by EHR systems. Simply use the requested pronouns and note the preference. Asking "why" is inappropriate and unnecessary.',
        sort_order: 4, created_at: new Date().toISOString(),
      },
      {
        id: 'comm-q2-5', quiz_id: 'comm-q2',
        question_text: 'An elderly patient with hearing loss comes to the front desk. Which strategy is most appropriate?',
        question_type: 'multiple_choice',
        options: ['A. Write everything down on paper', 'B. Face the patient directly, speak clearly at a normal volume, and reduce background noise', 'C. Have them call back later with a family member', 'D. Speak as loudly as possible so they can hear you'],
        correct_answer: 'B',
        explanation: 'Face the patient so they can read lips if needed, speak clearly (not necessarily louder), and minimize competing noise. Writing can supplement but shouldn\'t replace conversation. Never require a companion for a competent adult patient.',
        sort_order: 5, created_at: new Date().toISOString(),
      },
      {
        id: 'comm-q2-6', quiz_id: 'comm-q2',
        question_text: 'The teach-back method involves:',
        question_type: 'multiple_choice',
        options: ['A. Teaching patients medical terminology so they can understand their chart', 'B. Having the patient repeat instructions in their own words to confirm understanding', 'C. Giving patients written materials to read at home', 'D. Having a supervisor observe your patient interactions'],
        correct_answer: 'B',
        explanation: 'The teach-back method asks patients to explain what you told them in their own words. This verifies understanding without putting the patient on the spot — you ask "What will you do to prepare?" rather than "Do you understand?"',
        sort_order: 6, created_at: new Date().toISOString(),
      },
      {
        id: 'comm-q2-7', quiz_id: 'comm-q2',
        question_text: 'When communicating with a pediatric patient\'s guardian, you should:',
        question_type: 'multiple_choice',
        options: ['A. Address the child directly and ignore the guardian', 'B. Address only the guardian since the child cannot consent', 'C. Include both the guardian and the child at an age-appropriate level', 'D. Ask the guardian to wait outside while you speak to the child'],
        correct_answer: 'C',
        explanation: 'Best practice is to include both the guardian and the child. Address the guardian for legal and insurance matters, but also engage the child at their developmental level. This builds trust and teaches children to participate in their care.',
        sort_order: 7, created_at: new Date().toISOString(),
      },
    ],
  },

  'professional-standards': {
    quiz: {
      id: 'comm-q3', module_id: 'comm-m3',
      title: 'Professional Standards Quiz',
      description: 'Test your knowledge of professional conduct, de-escalation, and communication documentation.',
      passing_score: 80, max_attempts: 3,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    moduleTitle: 'Professional Standards',
    courseTitle: 'Patient Communication',
    nextModuleSlug: null,
    nextModuleFirstLesson: null,
    questions: [
      {
        id: 'comm-q3-1', quiz_id: 'comm-q3',
        question_text: 'A patient becomes angry about a billing error and begins raising their voice. Your first step should be:',
        question_type: 'multiple_choice',
        options: ['A. Match their energy so they know you\'re taking it seriously', 'B. Tell them to calm down or you won\'t help them', 'C. Listen calmly, acknowledge their frustration, and speak in a low, steady voice', 'D. Immediately call your supervisor to handle the situation'],
        correct_answer: 'C',
        explanation: 'The LEAP method starts with Listen. Stay calm, use a low steady voice, and acknowledge their frustration before problem-solving. Matching their energy escalates; telling them to calm down invalidates their feelings; calling a supervisor should only happen if the situation escalates beyond your ability.',
        sort_order: 1, created_at: new Date().toISOString(),
      },
      {
        id: 'comm-q3-2', quiz_id: 'comm-q3',
        question_text: 'Which of the following is a violation of professional presence standards?',
        question_type: 'multiple_choice',
        options: ['A. Wearing scrubs with a visible name badge', 'B. Checking your personal phone at the front desk between patients', 'C. Wearing minimal fragrance-free products', 'D. Keeping a water bottle at your workstation'],
        correct_answer: 'B',
        explanation: 'Using a personal phone at the front desk appears unprofessional to patients and can lead to HIPAA concerns (camera/recording). Even between patients, the front desk should appear attentive and ready.',
        sort_order: 2, created_at: new Date().toISOString(),
      },
      {
        id: 'comm-q3-3', quiz_id: 'comm-q3',
        question_text: 'When placing a caller on hold, the correct procedure is to:',
        question_type: 'multiple_choice',
        options: ['A. Say "please hold" and press the hold button', 'B. Ask permission to place them on hold, wait for a response, then check back every 30-60 seconds', 'C. Transfer them to a voicemail box instead', 'D. Put them on hold and finish with the patient in front of you first'],
        correct_answer: 'B',
        explanation: 'Professional hold management requires: asking permission ("May I place you on a brief hold?"), waiting for agreement, and checking back every 30-60 seconds. Never hold a patient for more than 2 minutes without checking in.',
        sort_order: 3, created_at: new Date().toISOString(),
      },
      {
        id: 'comm-q3-4', quiz_id: 'comm-q3',
        question_text: 'A divorced couple each claims authority over their child\'s medical care. You should:',
        question_type: 'multiple_choice',
        options: ['A. Allow whichever parent arrives first to make decisions', 'B. Ask both parents to provide custody documentation and follow the court order on file', 'C. Refuse to see the child until both parents agree', 'D. Let the child decide which parent should be involved'],
        correct_answer: 'B',
        explanation: 'Custody situations require following the legal documentation on file. Court orders dictate which parent has medical decision-making authority. If no documentation is on file, follow your clinic\'s policy and involve your supervisor.',
        sort_order: 4, created_at: new Date().toISOString(),
      },
      {
        id: 'comm-q3-5', quiz_id: 'comm-q3',
        question_text: 'Which situation requires IMMEDIATE escalation to a supervisor or security?',
        question_type: 'multiple_choice',
        options: ['A. A patient complains about a long wait time', 'B. A patient is crying after receiving difficult news', 'C. A patient makes a verbal threat against a staff member', 'D. A patient is frustrated about an insurance denial'],
        correct_answer: 'C',
        explanation: 'Verbal threats against staff require immediate escalation. Long waits, crying, and insurance frustrations can typically be managed with de-escalation techniques. Threats of violence activate your facility\'s safety protocols.',
        sort_order: 5, created_at: new Date().toISOString(),
      },
      {
        id: 'comm-q3-6', quiz_id: 'comm-q3',
        question_text: 'When documenting a phone call in the EHR, which of the following should be included?',
        question_type: 'multiple_choice',
        options: ['A. Date, time, caller name, reason for call, action taken, your name', 'B. Just the date and a summary of the call', 'C. Only document calls that involve clinical questions', 'D. The patient\'s tone of voice and your personal opinion of the call'],
        correct_answer: 'A',
        explanation: 'Complete call documentation includes: date, time, who called, reason for the call, action taken, any follow-up needed, and who documented it. This creates a legal record and ensures continuity of care.',
        sort_order: 6, created_at: new Date().toISOString(),
      },
      {
        id: 'comm-q3-7', quiz_id: 'comm-q3',
        question_text: 'A patient asks for help finding transportation to their appointments. The best response is to:',
        question_type: 'multiple_choice',
        options: ['A. Offer to drive them yourself', 'B. Tell them that\'s not part of your job', 'C. Provide information about community transportation resources, such as Medicaid transport or local programs', 'D. Suggest they ask a family member'],
        correct_answer: 'C',
        explanation: 'Connecting patients with community resources like Medicaid transportation, local ride programs, or community health worker services is an important front office function. It\'s not your job to provide transport personally, but you should help connect them to appropriate resources.',
        sort_order: 7, created_at: new Date().toISOString(),
      },
    ],
  },
};

type QuizState = 'intro' | 'in_progress' | 'results' | 'completed';

export function QuizPlayer() {
  const { courseSlug, moduleSlug } = useParams<{ courseSlug: string; moduleSlug: string }>();
  const navigate = useNavigate();
  const progress = useProgress();

  const [quizState, setQuizState] = useState<QuizState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [savedScore, setSavedScore] = useState<number | null>(null);

  // Get quiz data
  const quizData = moduleSlug ? quizzesData[moduleSlug] : null;

  // Check for existing quiz completion on mount
  useEffect(() => {
    if (moduleSlug) {
      const latestAttempt = progress.getLatestQuizAttempt(moduleSlug);
      if (latestAttempt && latestAttempt.passed) {
        setQuizState('completed');
        setSavedScore(latestAttempt.score);
      }
    }
  }, [moduleSlug, progress]);

  if (!quizData) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quiz Not Found</h2>
        <p className="text-gray-600 mb-6">This quiz is not yet available.</p>
        <Link
          to={`/courses/${courseSlug}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course
        </Link>
      </div>
    );
  }

  const { quiz, questions, moduleTitle, courseTitle, nextModuleSlug, nextModuleFirstLesson } = quizData;
  const currentQuestion = questions[currentQuestionIndex];

  // Get previous attempt info
  const previousAttempts = moduleSlug ? progress.getQuizAttempts(moduleSlug) : [];
  const remainingAttempts = moduleSlug ? progress.getRemainingAttempts(moduleSlug, quiz.max_attempts) : quiz.max_attempts;
  const bestScore = moduleSlug ? progress.getBestQuizScore(moduleSlug) : 0;

  // Calculate score
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      const answer = answers[q.id];
      if (answer === q.correct_answer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const score = quizState === 'results' ? calculateScore() : 0;
  const passed = score >= quiz.passing_score;

  const handleSelectAnswer = (answer: string) => {
    // Extract letter from answer (e.g., "A. Option" -> "A")
    const answerLetter = answer.split('.')[0].trim();
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: currentQuestion.question_type === 'true_false' ? answer : answerLetter,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculate and save the score
      const finalScore = calculateScore();
      const didPass = finalScore >= quiz.passing_score;

      // Save to progress context
      if (moduleSlug) {
        progress.saveQuizAttempt(moduleSlug, finalScore, didPass, answers);
      }

      setQuizState('results');
    }
  };

  const handleStartQuiz = () => {
    setQuizState('in_progress');
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleRetry = () => {
    handleStartQuiz();
  };

  const handleContinue = () => {
    // Navigate to first lesson of next module if passed, otherwise back to course
    if (passed && nextModuleSlug && nextModuleFirstLesson) {
      navigate(`/courses/${courseSlug}/${nextModuleSlug}/${nextModuleFirstLesson}`);
    } else {
      navigate(`/courses/${courseSlug}`);
    }
  };

  // Completed State - user returns to a quiz they already passed
  if (quizState === 'completed') {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/courses" className="hover:text-gray-700">Courses</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/courses/${courseSlug}`} className="hover:text-gray-700">{courseTitle}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700">{moduleTitle}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-8 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-green-100">
            <Trophy className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Quiz Completed!</h1>
          <p className="text-gray-600 mb-4">You've already passed this quiz.</p>

          <div className="text-5xl font-semibold text-green-600 mb-2">
            {savedScore}%
          </div>
          <p className="text-sm text-gray-500 mb-6">Best Score</p>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Attempts used:</span> {previousAttempts.length} of {quiz.max_attempts}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setQuizState('intro');
                setSavedScore(null);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
            {nextModuleSlug && nextModuleFirstLesson ? (
              <button
                onClick={() => navigate(`/courses/${courseSlug}/${nextModuleSlug}/${nextModuleFirstLesson}`)}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-apple-sm"
              >
                Continue to Next Module
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                to={`/courses/${courseSlug}`}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-apple-sm"
              >
                Back to Course
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Intro State
  if (quizState === 'intro') {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/courses" className="hover:text-gray-700">Courses</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/courses/${courseSlug}`} className="hover:text-gray-700">{courseTitle}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700">{moduleTitle}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-3xl shadow-apple-sm flex items-center justify-center mx-auto mb-6">
            <ClipboardCheck className="w-8 h-8 text-blue-600" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">{quiz.title}</h1>
          <p className="text-gray-600 mb-6">{quiz.description}</p>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-6">
            <span>{questions.length} questions</span>
            <span>•</span>
            <span>Pass: {quiz.passing_score}%</span>
            <span>•</span>
            <span>{remainingAttempts} attempts remaining</span>
          </div>

          {/* Previous Attempts Info */}
          {previousAttempts.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-left">
              <div className="flex gap-3">
                <RotateCcw className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800 mb-1">Previous Attempts</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {previousAttempts.map((attempt, idx) => (
                      <li key={idx}>
                        Attempt {attempt.attemptNumber}: {attempt.score}% {attempt.passed ? '✓ Passed' : '✗ Failed'}
                      </li>
                    ))}
                  </ul>
                  {bestScore > 0 && (
                    <p className="mt-2 font-medium">Best score: {bestScore}%</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 text-left">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800 mb-1">Before you begin</h3>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• You must score {quiz.passing_score}% or higher to pass</li>
                  <li>• You have {remainingAttempts} of {quiz.max_attempts} attempts remaining</li>
                  <li>• Review your answers after submitting</li>
                  <li>• Passing unlocks the next module</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={remainingAttempts === 0}
            className={`inline-flex items-center gap-2 px-8 py-3 text-lg font-medium text-white rounded-2xl transition-all duration-300 shadow-apple-sm ${
              remainingAttempts === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {previousAttempts.length > 0 ? 'Retake Quiz' : 'Start Quiz'}
            <ArrowRight className="w-5 h-5" />
          </button>

          {remainingAttempts === 0 && (
            <p className="mt-4 text-sm text-red-600">
              You've used all {quiz.max_attempts} attempts. Contact your instructor for assistance.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Results State
  if (quizState === 'results') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-8 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <Trophy className="w-10 h-10 text-green-600" />
            ) : (
              <XCircle className="w-10 h-10 text-red-600" />
            )}
          </div>

          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            {passed ? 'Congratulations!' : 'Not Quite'}
          </h1>

          <p className="text-gray-600 mb-6">
            {passed
              ? 'You passed the quiz and can continue to the next module.'
              : `You need ${quiz.passing_score}% to pass. Review the material and try again.`}
          </p>

          <div className={`text-6xl font-semibold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {score}%
          </div>
          <p className="text-gray-500 mb-8">
            {Object.values(answers).filter((a, i) => {
              const q = questions[i];
              return a === q.correct_answer;
            }).length} of {questions.length} correct
          </p>

          {/* Answer Review with Full Explanations */}
          <div className="text-left mb-8">
            <h3 className="font-medium text-gray-900 mb-4">Quiz Review</h3>
            <div className="space-y-4">
              {questions.map((q, index) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.correct_answer;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border ${
                      isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {index + 1}. {q.question_text}
                        </p>
                        <div className="mt-2 text-sm">
                          <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                            <span className="font-medium">Your answer:</span> {userAnswer}
                          </p>
                          {!isCorrect && (
                            <p className="text-green-700 mt-1">
                              <span className="font-medium">Correct answer:</span> {q.correct_answer}
                            </p>
                          )}
                        </div>
                        <div className="mt-3 p-3 bg-white/60 rounded-md border border-gray-200/50">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium text-gray-900">Explanation:</span> {q.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            {!passed && (
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Try Again
              </button>
            )}
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-apple-sm"
            >
              {passed ? 'Continue to Next Module' : 'Back to Course'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // In Progress State
  const selectedAnswer = answers[currentQuestion.id];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{quiz.title}</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-6 mb-6">
        <h2 className="text-xl font-medium text-gray-900 mb-6">
          {currentQuestion.question_text}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const optionLetter = option.split('.')[0].trim();
            const isSelected = currentQuestion.question_type === 'true_false'
              ? selectedAnswer === option
              : selectedAnswer === optionLetter;

            const optionStyle = isSelected
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50';

            return (
              <button
                key={option}
                onClick={() => handleSelectAnswer(option)}
                className={`w-full p-4 text-left rounded-2xl border-2 transition-all duration-300 ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                    isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-full h-full rounded-full bg-white scale-50" />}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <div className="text-sm text-gray-500">
          {Object.keys(answers).length} of {questions.length} answered
        </div>
        {selectedAnswer && (
          <button
            onClick={handleNextQuestion}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-apple-sm"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
