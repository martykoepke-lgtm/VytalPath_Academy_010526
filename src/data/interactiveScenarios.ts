import { SimulationScenario, SpotScene, RiskScenario } from '../types/interactive';

// ============================================
// "YOUR FIRST DAY" SIMULATION SCENARIOS
// ============================================

export const simulationScenarios: SimulationScenario[] = [
  {
    id: 'worried-spouse',
    title: 'The Worried Spouse',
    description: 'The phone rings. "Hi, this is Tom. My wife Sarah had an appointment this morning. Can you tell me what the doctor said?"',
    context: 'You\'re at the front desk answering phones.',
    options: [
      {
        id: 'a',
        text: '"Sure, let me pull up her chart."',
        isCorrect: false,
        severity: 'wrong',
        feedback: 'This would be a HIPAA violation. Even spouses need authorization to access patient information. Never share medical information without verifying that authorization exists.',
      },
      {
        id: 'b',
        text: '"I understand you\'re concerned. Let me check if we have authorization to share information with you."',
        isCorrect: true,
        severity: 'correct',
        feedback: 'Perfect! You showed empathy while following protocol. Always verify authorization before sharing any patient information, even with family members.',
      },
      {
        id: 'c',
        text: '"I can\'t tell you anything. Goodbye."',
        isCorrect: false,
        severity: 'partial',
        feedback: 'You protected the patient\'s information, which is good. However, the interaction could have been handled more professionally. A warmer response that explains the process would be better.',
      },
    ],
  },
  {
    id: 'curious-coworker',
    title: 'The Curious Coworker',
    description: 'During lunch, your coworker says, "Hey, wasn\'t that Mrs. Johnson who just left? What was she here for?"',
    context: 'You\'re in the break room with a colleague.',
    options: [
      {
        id: 'a',
        text: '"Yeah, she\'s been having some issues. Kind of sad."',
        isCorrect: false,
        severity: 'wrong',
        feedback: 'This is a HIPAA violation. Discussing patient information with coworkers who aren\'t involved in that patient\'s care is never appropriate, even in casual conversation.',
      },
      {
        id: 'b',
        text: '"I can\'t discuss patient information."',
        isCorrect: true,
        severity: 'correct',
        feedback: 'Excellent! This is the right response. Patient information should only be discussed with staff members who need it for treatment, payment, or operations.',
      },
      {
        id: 'c',
        text: '"I don\'t know, I wasn\'t paying attention."',
        isCorrect: false,
        severity: 'partial',
        feedback: 'While this avoids sharing information, it\'s not the best approach. Being direct about privacy policies helps establish good workplace boundaries and reinforces proper practices.',
      },
    ],
  },
  {
    id: 'er-redirect',
    title: 'The ER Redirect',
    description: 'A person walks up to your desk and says, "I don\'t have insurance but I\'m having really bad chest pain."',
    context: 'You work at a clinic that has emergency services.',
    options: [
      {
        id: 'a',
        text: '"You should try the urgent care down the street, it\'s cheaper."',
        isCorrect: false,
        severity: 'wrong',
        feedback: 'This is an EMTALA violation. Under federal law, anyone experiencing a medical emergency must receive a medical screening examination regardless of their ability to pay. Redirecting them elsewhere without screening is illegal.',
      },
      {
        id: 'b',
        text: '"Let me get you to triage right away."',
        isCorrect: true,
        severity: 'correct',
        feedback: 'Correct! EMTALA requires that anyone with an emergency condition receives a medical screening exam. Chest pain is a potential emergency and must be evaluated immediately.',
      },
      {
        id: 'c',
        text: '"Fill out this paperwork first, then we\'ll see you."',
        isCorrect: false,
        severity: 'wrong',
        feedback: 'This is an EMTALA violation. Medical screening must happen before paperwork for potential emergencies. You cannot delay care to collect information or payment.',
      },
    ],
  },
  {
    id: 'document-request',
    title: 'The Document Request',
    description: 'Your supervisor asks you to backdate a form because "the patient signed it yesterday but we forgot to put the date."',
    context: 'Your supervisor seems frustrated and in a hurry.',
    options: [
      {
        id: 'a',
        text: '"Sure, no problem."',
        isCorrect: false,
        severity: 'wrong',
        feedback: 'This is documentation falsification, which is illegal. Medical records must accurately reflect when events occurred. Backdating documents can lead to fraud charges and termination.',
      },
      {
        id: 'b',
        text: '"I\'m not comfortable with that. Can we document it a different way?"',
        isCorrect: true,
        severity: 'correct',
        feedback: 'Great response! The proper way to handle this is to add a late entry with today\'s date, noting when the patient actually signed. Never alter dates on medical documents.',
      },
      {
        id: 'c',
        text: '"I\'ll do it this time, but please don\'t ask me again."',
        isCorrect: false,
        severity: 'wrong',
        feedback: 'Even once is too many. Falsifying medical records is a serious offense that can result in criminal charges, regardless of who asked you to do it. You could lose your job and face legal consequences.',
      },
    ],
  },
  {
    id: 'records-request',
    title: 'The Records Request',
    description: 'A patient calls and says, "I need copies of all my medical records sent to my new doctor by tomorrow."',
    context: 'It\'s 4:30 PM and you have a stack of work to finish.',
    options: [
      {
        id: 'a',
        text: '"That\'s not possible. It takes 30 days to process records requests."',
        isCorrect: false,
        severity: 'partial',
        feedback: 'While HIPAA does allow up to 30 days, patients have a right to their records and you should try to accommodate urgent requests when possible. This response is technically correct but not patient-centered.',
      },
      {
        id: 'b',
        text: '"I\'ll do my best to help. Let me take your information and see what we can do."',
        isCorrect: true,
        severity: 'correct',
        feedback: 'Perfect! Patients have a right to access their records. While 30 days is allowed, making an effort for urgent requests shows excellent patient service while staying compliant.',
      },
      {
        id: 'c',
        text: '"Just come in and I\'ll print them for you right now."',
        isCorrect: false,
        severity: 'partial',
        feedback: 'Helpful, but there\'s a process to follow. Records requests typically require written authorization and verification of identity. You can\'t just hand over records without proper documentation.',
      },
    ],
  },
  {
    id: 'insurance-question',
    title: 'The Insurance Question',
    description: 'A patient\'s employer calls asking for verification that the employee was seen at your clinic yesterday.',
    context: 'The caller says they need it for the employee\'s attendance records.',
    options: [
      {
        id: 'a',
        text: '"Yes, they were here from 2-3 PM for an appointment."',
        isCorrect: false,
        severity: 'wrong',
        feedback: 'This is a HIPAA violation. Confirming that someone is a patient at your clinic reveals protected health information. You cannot share this without the patient\'s authorization.',
      },
      {
        id: 'b',
        text: '"I\'m not able to confirm or deny whether someone is a patient here without their authorization."',
        isCorrect: true,
        severity: 'correct',
        feedback: 'Exactly right! Even confirming someone is a patient is considered PHI. The employee needs to provide their own documentation to their employer if needed.',
      },
      {
        id: 'c',
        text: '"Have the employee sign a release and we can confirm."',
        isCorrect: false,
        severity: 'partial',
        feedback: 'You\'re on the right track, but you shouldn\'t even suggest that the person is a patient. Simply state that you cannot provide information without authorization, without implying anything.',
      },
    ],
  },
  {
    id: 'social-media',
    title: 'The Social Media Post',
    description: 'After a challenging day, you\'re tempted to post on social media: "Had the most difficult patient today. Some people should not be allowed in public!"',
    context: 'You\'re at home, on your personal account.',
    options: [
      {
        id: 'a',
        text: 'Post it - it\'s your personal account and you didn\'t name anyone.',
        isCorrect: false,
        severity: 'wrong',
        feedback: 'Even without names, this is risky and unprofessional. If the patient or anyone who knows the situation sees it, it could be identified. Many healthcare workers have been fired for similar posts.',
      },
      {
        id: 'b',
        text: 'Don\'t post it. Vent to a trusted friend in private instead.',
        isCorrect: true,
        severity: 'correct',
        feedback: 'Smart choice! Healthcare workers must be careful about social media. Even vague posts about patients can be problematic. Talk to a friend, family member, or use employee assistance resources instead.',
      },
      {
        id: 'c',
        text: 'Post it but set it to "friends only."',
        isCorrect: false,
        severity: 'wrong',
        feedback: 'Privacy settings don\'t protect you. Screenshots can be shared, and "friends" may include coworkers or people connected to patients. This could still cost you your job.',
      },
    ],
  },
  {
    id: 'celebrity-patient',
    title: 'The Celebrity Patient',
    description: 'You notice a local celebrity checking in at the front desk. Your friend texts you asking if the rumors about them being sick are true.',
    context: 'You\'ve heard the same rumors and you\'re curious too.',
    options: [
      {
        id: 'a',
        text: 'Text back "I can\'t say, but between us... yes."',
        isCorrect: false,
        severity: 'wrong',
        feedback: 'This is a clear HIPAA violation. Celebrity patients have the same privacy rights as everyone else. "Between us" doesn\'t protect you legally or ethically.',
      },
      {
        id: 'b',
        text: 'Text back "I can\'t discuss anything about patients."',
        isCorrect: true,
        severity: 'correct',
        feedback: 'Perfect response! You didn\'t confirm or deny, and you set a clear boundary. Celebrity patients often test whether organizations can protect their privacy.',
      },
      {
        id: 'c',
        text: 'Don\'t respond to the text.',
        isCorrect: false,
        severity: 'partial',
        feedback: 'Ignoring the text protects the information, but it\'s better to clearly state your boundary. This helps your friend understand not to ask again.',
      },
    ],
  },
];

// ============================================
// SPOT THE VIOLATION SCENES
// ============================================

export const spotScenes: SpotScene[] = [
  {
    id: 'front-desk',
    title: 'The Busy Front Desk',
    description: 'It\'s a busy afternoon at the clinic. Look at this scene and identify any potential HIPAA violations.',
    sceneType: 'visual',
    violations: [
      {
        id: 'screen-visible',
        description: 'Computer screen visible to waiting area',
        explanation: 'Patient information on screens should never be visible to other patients or visitors. Position monitors away from public view or use privacy screens.',
        lawReference: 'HIPAA - Physical Safeguards',
      },
      {
        id: 'chart-open',
        description: 'Patient chart left open on desk',
        explanation: 'Paper charts and documents containing patient information should be face-down or in folders when not actively in use.',
        lawReference: 'HIPAA - Physical Safeguards',
      },
      {
        id: 'post-it-note',
        description: 'Post-it note with patient name and callback number',
        explanation: 'Never write patient names or phone numbers on visible sticky notes. Use secure messaging systems or keep notes in private areas.',
        lawReference: 'HIPAA - Minimum Necessary',
      },
      {
        id: 'printer-output',
        description: 'Printer output tray with visible patient documents',
        explanation: 'Printed documents should be retrieved immediately. Printers in shared areas should be in secure locations or use "pull printing" that requires authentication.',
        lawReference: 'HIPAA - Physical Safeguards',
      },
    ],
    hints: [
      'Look at what might be visible to people in the waiting room',
      'Check the desk surface for loose papers',
      'Consider where documents might be left unattended',
    ],
  },
  {
    id: 'hallway-conversation',
    title: 'The Hallway Conversation',
    description: 'You overhear this conversation in the hallway between two staff members. What\'s wrong here?',
    sceneType: 'conversation',
    conversationLines: [
      'Staff A: "Did you see Mr. Rodriguez\'s test results?"',
      'Staff B: "No, what happened?"',
      'Staff A: "His blood sugar was crazy high - like 400!"',
      'Staff B: "Wow. Does his wife know he\'s diabetic?"',
      'Staff A: "I don\'t think so. She\'s in the waiting room right now."',
    ],
    violations: [
      {
        id: 'public-location',
        description: 'Discussing patient information in a public hallway',
        explanation: 'Hallways, elevators, and other public areas are not appropriate places to discuss patient information. Anyone could overhear.',
        lawReference: 'HIPAA - Privacy Rule',
      },
      {
        id: 'specific-results',
        description: 'Discussing specific test results',
        explanation: 'Detailed medical information should only be discussed among staff who are directly involved in the patient\'s care, and only when necessary.',
        lawReference: 'HIPAA - Minimum Necessary',
      },
      {
        id: 'family-disclosure',
        description: 'Discussing what family members do or don\'t know',
        explanation: 'What a patient has or hasn\'t shared with family is private. Staff should not speculate about or share this information.',
        lawReference: 'HIPAA - Privacy Rule',
      },
      {
        id: 'need-to-know',
        description: 'Staff B has no apparent need to know this information',
        explanation: 'The conversation started with curiosity ("Did you see...") rather than a care-related need. Information should only be shared on a need-to-know basis.',
        lawReference: 'HIPAA - Minimum Necessary',
      },
    ],
    hints: [
      'Consider where this conversation is happening',
      'Think about who actually needs this information',
      'Notice what they\'re saying about the patient\'s family',
    ],
  },
  {
    id: 'break-room',
    title: 'The Break Room',
    description: 'You walk into the break room and notice several things. What potential violations do you see?',
    sceneType: 'visual',
    violations: [
      {
        id: 'schedule-posted',
        description: 'Tomorrow\'s patient schedule posted on the fridge',
        explanation: 'Patient schedules contain PHI (names, appointment times, sometimes provider names indicating condition). They should never be displayed in common areas.',
        lawReference: 'HIPAA - Privacy Rule',
      },
      {
        id: 'laptop-unlocked',
        description: 'Unattended laptop with EHR system open',
        explanation: 'Workstations must be locked when unattended, even briefly. Anyone could access or view patient information.',
        lawReference: 'HIPAA - Technical Safeguards',
      },
      {
        id: 'phone-photos',
        description: 'Staff member showing phone photos from a clinic event with patients visible',
        explanation: 'Photos taken at clinic events that show patients require written consent before sharing. Even casual sharing in the break room is problematic.',
        lawReference: 'HIPAA - Privacy Rule',
      },
    ],
    hints: [
      'Look at what\'s posted on walls or the refrigerator',
      'Check electronic devices in the room',
      'Consider what people might be sharing on personal devices',
    ],
  },
  {
    id: 'checkout-desk',
    title: 'The Checkout Desk',
    description: 'A patient is checking out after their appointment. Review this interaction and find the problems.',
    sceneType: 'conversation',
    conversationLines: [
      'Staff: "OK Mrs. Chen, your colonoscopy is scheduled for next Tuesday."',
      'Another patient nearby hears this',
      'Staff: "And here\'s your prescription for the prep medication."',
      'Staff hands paper across high counter visible to others',
      'Staff: "The total for today\'s visit is $45 for your specialist copay."',
    ],
    violations: [
      {
        id: 'procedure-announced',
        description: 'Announcing the type of procedure loudly enough for others to hear',
        explanation: 'Procedure types are sensitive medical information. Use discretion and lower your voice, or write down sensitive information to hand to the patient.',
        lawReference: 'HIPAA - Privacy Rule',
      },
      {
        id: 'prescription-visible',
        description: 'Handing prescription information where others can see',
        explanation: 'Prescription information reveals health conditions. Hand papers directly to the patient in a way that others cannot see the contents.',
        lawReference: 'HIPAA - Privacy Rule',
      },
      {
        id: 'financial-info',
        description: 'Discussing payment amounts where others can hear',
        explanation: 'While payment information isn\'t always PHI, copay types can reveal information about the visit. Keep financial discussions private when possible.',
        lawReference: 'HIPAA - Privacy Rule',
      },
    ],
    hints: [
      'Consider who might overhear the conversation',
      'Think about what information is being said out loud',
      'Notice what papers are being handed over and how',
    ],
  },
];

// ============================================
// RISK METER SCENARIOS
// ============================================

export const riskScenarios: RiskScenario[] = [
  {
    id: 'own-credentials',
    description: 'Logging into the EHR with your own credentials',
    correctLevel: 'safe',
    explanation: 'Using your own login credentials is exactly right. This creates an audit trail and ensures accountability.',
    lawReference: 'HIPAA - Access Controls',
  },
  {
    id: 'friend-appointment',
    description: 'Looking up a friend\'s appointment to see what time they\'re coming in',
    correctLevel: 'violation',
    explanation: 'Accessing patient records without a work-related need is a violation, even for friends or family. Curiosity is never a valid reason.',
    lawReference: 'HIPAA - Minimum Necessary',
  },
  {
    id: 'employer-confirms',
    description: 'Confirming a patient has an appointment when their employer calls',
    correctLevel: 'violation',
    explanation: 'Confirming someone is a patient reveals PHI. You cannot share this information with employers without patient authorization.',
    lawReference: 'HIPAA - Privacy Rule',
  },
  {
    id: 'nurse-discussion',
    description: 'Discussing a patient\'s case with their nurse in a private office',
    correctLevel: 'safe',
    explanation: 'Discussing patient care with other providers involved in treatment, in a private setting, is appropriate and necessary for good care.',
    lawReference: 'HIPAA - Treatment Exception',
  },
  {
    id: 'break-room-photo',
    description: 'Posting a photo of the break room on social media (no patients visible)',
    correctLevel: 'caution',
    explanation: 'Probably fine, but be careful. Make sure no patient information is visible anywhere in the photo - whiteboards, schedules, papers, screens.',
    lawReference: 'General Best Practice',
  },
  {
    id: 'spouse-case',
    description: 'Telling your spouse about an interesting case you saw today (with patient details)',
    correctLevel: 'violation',
    explanation: 'Sharing patient details outside of work, even with family, is a violation. You can discuss general concepts but never specific patient information.',
    lawReference: 'HIPAA - Privacy Rule',
  },
  {
    id: 'encrypted-email',
    description: 'Emailing patient records to a specialist using encrypted email',
    correctLevel: 'safe',
    explanation: 'Using encrypted email for legitimate care coordination is proper protocol. Encryption protects the information during transmission.',
    lawReference: 'HIPAA - Technical Safeguards',
  },
  {
    id: 'unverified-fax',
    description: 'Faxing records without verifying the fax number first',
    correctLevel: 'risky',
    explanation: 'Faxing to an unverified number risks sending PHI to the wrong recipient. Always verify fax numbers, especially for new recipients.',
    lawReference: 'HIPAA - Physical Safeguards',
  },
  {
    id: 'shared-password',
    description: 'Using a coworker\'s login because they\'re busy and you need to check something quick',
    correctLevel: 'violation',
    explanation: 'Never use someone else\'s credentials. This breaks audit trails and makes both of you liable. Always use your own login.',
    lawReference: 'HIPAA - Access Controls',
  },
  {
    id: 'shredding-documents',
    description: 'Putting patient documents in the shredding bin at the end of the day',
    correctLevel: 'safe',
    explanation: 'Using designated secure shredding for PHI disposal is the correct practice. Never throw patient documents in regular trash.',
    lawReference: 'HIPAA - Disposal Rule',
  },
  {
    id: 'voicemail-details',
    description: 'Leaving a voicemail with detailed test results on a patient\'s phone',
    correctLevel: 'risky',
    explanation: 'Voicemails can be heard by others. Leave minimal information - ask them to call back for results. Check if the patient authorized detailed voicemails.',
    lawReference: 'HIPAA - Privacy Rule',
  },
  {
    id: 'waiting-room-name',
    description: 'Calling a patient\'s full name in the waiting room',
    correctLevel: 'caution',
    explanation: 'While common practice, some patients prefer privacy. Consider using first name only or a number system. This varies by office policy.',
    lawReference: 'HIPAA - Incidental Disclosure',
  },
  {
    id: 'computer-unlocked',
    description: 'Walking away from your computer without locking the screen',
    correctLevel: 'risky',
    explanation: 'Unlocked computers expose patient data to unauthorized access. Always lock your screen (Windows: Win+L, Mac: Ctrl+Cmd+Q) when stepping away.',
    lawReference: 'HIPAA - Workstation Security',
  },
  {
    id: 'text-appointment',
    description: 'Texting a patient appointment reminder using a personal phone',
    correctLevel: 'violation',
    explanation: 'Personal devices lack security controls. Use only approved clinic systems for patient communication. Text messages aren\'t encrypted.',
    lawReference: 'HIPAA - Technical Safeguards',
  },
  {
    id: 'insurance-verification',
    description: 'Calling insurance to verify benefits for an upcoming appointment',
    correctLevel: 'safe',
    explanation: 'Verifying insurance for payment purposes is a permitted use of PHI. This is part of normal healthcare operations.',
    lawReference: 'HIPAA - Payment Exception',
  },
  {
    id: 'celebrity-lookup',
    description: 'Checking if a celebrity is really a patient after hearing rumors',
    correctLevel: 'violation',
    explanation: 'Looking up any patient without a work-related need is a violation. Celebrity patients have been the source of many HIPAA cases and terminations.',
    lawReference: 'HIPAA - Minimum Necessary',
  },
];
