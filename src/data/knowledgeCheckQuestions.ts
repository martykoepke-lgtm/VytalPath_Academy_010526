import { KnowledgeCheckQuestion } from '../types/learning';

// Knowledge check questions by lesson ID
// These appear after each video ends for quick reinforcement

export const knowledgeChecksByLesson: Record<string, KnowledgeCheckQuestion[]> = {
  // Course Introduction: Healthcare Front Office Foundations
  'foundations': [
    {
      id: 'foundations-1',
      questionText: 'What percentage of healthcare occurs in ambulatory (outpatient) settings?',
      options: ['About 50%', 'About 65%', 'Over 80%', 'Nearly 100%'],
      correctAnswer: 'Over 80%',
      explanation: 'Over 80% of all healthcare happens outside of hospitals in ambulatory care settings like clinics, urgent care centers, and outpatient facilities.',
    },
    {
      id: 'foundations-2',
      questionText: 'Front office professionals are often the first point of contact for patients.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Correct! Front office staff are typically the first people patients interact with, setting the tone for their entire healthcare experience.',
    },
    {
      id: 'foundations-3',
      questionText: 'Which of the following is NOT typically a front office responsibility?',
      options: ['Patient check-in', 'Scheduling appointments', 'Performing medical procedures', 'Verifying insurance'],
      correctAnswer: 'Performing medical procedures',
      explanation: 'Medical procedures are performed by clinical staff (nurses, physicians, etc.). Front office handles administrative tasks like scheduling, check-in, and insurance verification.',
    },
  ],

  // Welcome to Ambulatory Care: Acute vs. Ambulatory Care
  'acute-vs-ambulatory': [
    {
      id: 'ambulatory-1',
      questionText: 'Which type of care setting is a hospital emergency room?',
      options: ['Ambulatory care', 'Acute care', 'Primary care', 'Preventive care'],
      correctAnswer: 'Acute care',
      explanation: 'Hospital emergency rooms and inpatient hospital stays are examples of acute care, which handles severe or urgent medical conditions.',
    },
    {
      id: 'ambulatory-2',
      questionText: 'Ambulatory care means the patient goes home the same day.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Correct! "Ambulatory" means the patient can walk in and walk out. They receive care and return home without an overnight stay.',
    },
    {
      id: 'ambulatory-3',
      questionText: 'Which is an example of an ambulatory care setting?',
      options: ['Hospital ICU', 'Outpatient clinic', 'Inpatient surgery ward', 'Hospital maternity unit'],
      correctAnswer: 'Outpatient clinic',
      explanation: 'Outpatient clinics are ambulatory settings where patients receive care without being admitted to a hospital.',
    },
  ],

  // Medical Law & Ethics: HIPAA Essentials Explained
  'hipaa': [
    {
      id: 'hipaa-1',
      questionText: 'What does HIPAA stand for?',
      options: [
        'Health Insurance Privacy and Accountability Act',
        'Health Insurance Portability and Accountability Act',
        'Healthcare Information Protection and Access Act',
        'Hospital Insurance Privacy Association Act'
      ],
      correctAnswer: 'Health Insurance Portability and Accountability Act',
      explanation: 'HIPAA is the Health Insurance Portability and Accountability Act, passed in 1996 to protect patient health information.',
    },
    {
      id: 'hipaa-2',
      questionText: 'HIPAA only applies to doctors and nurses, not front office staff.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'False! HIPAA applies to everyone who handles protected health information (PHI), including all front office staff, billing personnel, and administrative workers.',
    },
    {
      id: 'hipaa-3',
      questionText: 'Which is a HIPAA violation?',
      options: [
        'Discussing a patient\'s condition with their physician',
        'Looking up your neighbor\'s medical records out of curiosity',
        'Verifying insurance for a scheduled appointment',
        'Calling a patient to confirm their appointment'
      ],
      correctAnswer: 'Looking up your neighbor\'s medical records out of curiosity',
      explanation: 'Accessing patient records without a legitimate work-related reason is a HIPAA violation, even if you don\'t share the information.',
    },
  ],

  // Medical Law & Ethics: PHI Explained
  'phi': [
    {
      id: 'phi-1',
      questionText: 'What does PHI stand for?',
      options: [
        'Patient Health Identification',
        'Protected Health Information',
        'Private Healthcare Index',
        'Personal Health Insurance'
      ],
      correctAnswer: 'Protected Health Information',
      explanation: 'PHI stands for Protected Health Information - any health information that can be linked to a specific individual.',
    },
    {
      id: 'phi-2',
      questionText: 'A patient\'s name alone (without any health information) is considered PHI.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'A name by itself is not PHI. PHI is health information combined with identifiers. "John Smith" is not PHI, but "John Smith was treated for diabetes" is PHI.',
    },
    {
      id: 'phi-3',
      questionText: 'Which of the following is an example of PHI?',
      options: [
        'A list of common medication names',
        'General clinic hours',
        'A patient\'s appointment date and diagnosis',
        'The number of patients seen last month'
      ],
      correctAnswer: 'A patient\'s appointment date and diagnosis',
      explanation: 'A patient\'s appointment date combined with their diagnosis links health information to an identifiable person, making it PHI.',
    },
  ],

  // Understanding Insurance: Reading an Insurance Card
  'reading-insurance-card': [
    {
      id: 'insurance-card-1',
      questionText: 'What is the most critical piece of information needed to verify eligibility and submit claims?',
      options: ['Patient name', 'Subscriber ID (Member ID)', 'Copay amount', 'Insurance company logo'],
      correctAnswer: 'Subscriber ID (Member ID)',
      explanation: 'The Subscriber ID (or Member ID) is the unique identifier for the patient\'s coverage. Without it, you cannot verify eligibility or submit claims.',
    },
    {
      id: 'insurance-card-2',
      questionText: 'You should scan or copy both sides of the insurance card at every visit.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Correct! Insurance information changes frequently. Capturing both sides of the card at every visit protects the patient and the clinic.',
    },
    {
      id: 'insurance-card-3',
      questionText: 'Where would you find the phone number to call about eligibility or benefits?',
      options: ['Front of the card only', 'Back of the card - provider line', 'It\'s not on the card', 'The pharmacy section'],
      correctAnswer: 'Back of the card - provider line',
      explanation: 'The back of the card contains provider-specific contact information, including a customer service line for eligibility and benefits questions.',
    },
  ],

  // Understanding Insurance: Eligibility Verification
  'eligibility-verification': [
    {
      id: 'eligibility-1',
      questionText: 'When should you verify eligibility for a new patient?',
      options: ['Day of the appointment', 'After the appointment', '48-72 hours before the appointment', 'Only if they ask'],
      correctAnswer: '48-72 hours before the appointment',
      explanation: 'Verifying 48-72 hours in advance gives you time to contact the patient if there\'s an issue with their coverage.',
    },
    {
      id: 'eligibility-2',
      questionText: 'If eligibility verification fails, you should immediately tell the patient they have no coverage.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'False! First double-check that the Member ID and date of birth were entered correctly. If it still fails, try again later or call the insurance company\'s provider line.',
    },
    {
      id: 'eligibility-3',
      questionText: 'What does it mean if a patient is "out of network"?',
      options: [
        'Their insurance is expired',
        'Your clinic doesn\'t have a contract with their insurance',
        'They don\'t have a primary care provider',
        'Their deductible hasn\'t been met'
      ],
      correctAnswer: 'Your clinic doesn\'t have a contract with their insurance',
      explanation: 'Out of network means your clinic doesn\'t have a contract with that insurance company, which often results in higher costs for the patient.',
    },
  ],

  // Understanding Insurance: Understanding Copays
  'understanding-copays': [
    {
      id: 'copays-1',
      questionText: 'A copay is a fixed dollar amount that remains the same regardless of the length of the visit.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Correct! A copay is a fixed amount (e.g., $30) that the patient pays at the time of service, regardless of how long the visit takes.',
    },
    {
      id: 'copays-2',
      questionText: 'When is the best time to collect a patient\'s copay?',
      options: ['After the visit', 'At check-in before seeing the provider', 'Only if they offer to pay', 'When they schedule their next appointment'],
      correctAnswer: 'At check-in before seeing the provider',
      explanation: 'Best practice is to collect copays at check-in. This is expected by most insurance contracts and is easier when the patient is at your desk.',
    },
    {
      id: 'copays-3',
      questionText: 'Primary care visits typically have a higher copay than specialist visits.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'False! Primary care visits usually have the lowest copay ($20-$40), while specialist visits typically cost more ($40-$75).',
    },
  ],

  // Understanding Insurance: Deductibles
  'understanding-deductibles': [
    {
      id: 'deductibles-1',
      questionText: 'What is a deductible?',
      options: [
        'A monthly payment to maintain insurance',
        'The amount a patient must pay before insurance starts covering more',
        'The percentage the patient pays after insurance',
        'A fixed amount paid at each visit'
      ],
      correctAnswer: 'The amount a patient must pay before insurance starts covering more',
      explanation: 'A deductible is the threshold amount a patient must pay out-of-pocket before their insurance begins paying a larger share of costs.',
    },
    {
      id: 'deductibles-2',
      questionText: 'Once a patient reaches their out-of-pocket maximum, they pay nothing more for covered services that year.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Correct! After reaching the out-of-pocket maximum, insurance pays 100% of covered services for the rest of the plan year.',
    },
    {
      id: 'deductibles-3',
      questionText: 'If a patient has deductible remaining, what should you tell them?',
      options: [
        'They won\'t owe anything',
        'They may receive a bill after insurance processes the claim',
        'They need to pay the full deductible today',
        'Their insurance is invalid'
      ],
      correctAnswer: 'They may receive a bill after insurance processes the claim',
      explanation: 'Set expectations by explaining they may receive a bill. You don\'t need to calculate exact amounts, just help them understand they have deductible remaining.',
    },
  ],
};

// Helper function to get questions for a lesson
export function getQuestionsForLesson(lessonId: string): KnowledgeCheckQuestion[] {
  return knowledgeChecksByLesson[lessonId] || [];
}
