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
    courseTitle: 'Healthcare Foundations',
    nextModuleSlug: 'medical-terminology-basics',
    nextModuleFirstLesson: 'common-abbreviations',
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
