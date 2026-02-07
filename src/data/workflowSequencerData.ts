export interface SequenceStep {
  id: string;
  text: string;
  correctPosition: number;
  detail: string;
}

export interface CriticalNote {
  afterStep: number; // show after this position (0-indexed)
  note: string;
  emphasis: 'info' | 'warning' | 'critical';
}

export interface WorkflowSequence {
  id: string;
  title: string;
  description: string;
  steps: SequenceStep[];
  criticalOrderNotes: CriticalNote[];
}

export const workflowSequences: WorkflowSequence[] = [
  {
    id: 'new-patient-registration',
    title: 'New Patient Registration',
    description: 'A new patient calls to schedule their first appointment. What steps do you follow?',
    steps: [
      {
        id: 'npr-1',
        text: 'Collect patient demographics (name, DOB, address, phone)',
        correctPosition: 0,
        detail: 'Always start with demographics — you need these to create the patient record in the system.',
      },
      {
        id: 'npr-2',
        text: 'Collect insurance information (carrier, member ID, group #)',
        correctPosition: 1,
        detail: 'Insurance info goes in right after demographics so you can verify eligibility.',
      },
      {
        id: 'npr-3',
        text: 'Verify insurance eligibility in real-time',
        correctPosition: 2,
        detail: 'Verify BEFORE scheduling — never schedule a patient without confirming coverage.',
      },
      {
        id: 'npr-4',
        text: 'Check if referral or prior authorization is needed',
        correctPosition: 3,
        detail: 'Some plans (especially HMOs) require a referral. Check now to avoid visit-day surprises.',
      },
      {
        id: 'npr-5',
        text: 'Schedule the appointment for the appropriate provider',
        correctPosition: 4,
        detail: 'Now that eligibility is confirmed, schedule with the right provider and visit type.',
      },
      {
        id: 'npr-6',
        text: 'Confirm appointment details and give directions to office',
        correctPosition: 5,
        detail: 'Before ending the call, confirm date, time, provider, and location. Ask if they have questions.',
      },
      {
        id: 'npr-7',
        text: 'Mail or email new patient paperwork packet',
        correctPosition: 6,
        detail: 'After the call, send forms in advance so the patient can arrive with completed paperwork, saving check-in time.',
      },
    ],
    criticalOrderNotes: [
      {
        afterStep: 2,
        note: 'Eligibility verification happens DURING registration — not at check-in! This prevents denied claims and patient frustration on visit day.',
        emphasis: 'critical',
      },
      {
        afterStep: 3,
        note: 'Checking for referral/prior auth requirements before scheduling prevents last-minute cancellations.',
        emphasis: 'warning',
      },
    ],
  },
  {
    id: 'existing-patient-scheduling',
    title: 'Existing Patient Scheduling',
    description: 'An existing patient calls to schedule a follow-up visit. What\'s the correct sequence?',
    steps: [
      {
        id: 'eps-1',
        text: 'Pull up patient record and verify identity (name, DOB)',
        correctPosition: 0,
        detail: 'Always verify identity — never assume who\'s calling. Confirm name and date of birth.',
      },
      {
        id: 'eps-2',
        text: 'Review and update demographics and insurance if needed',
        correctPosition: 1,
        detail: 'Insurance can change between visits. Ask "Any changes to your address or insurance?"',
      },
      {
        id: 'eps-3',
        text: 'Re-verify insurance eligibility',
        correctPosition: 2,
        detail: 'Even for existing patients, eligibility can lapse. Always re-verify before scheduling.',
      },
      {
        id: 'eps-4',
        text: 'Check outstanding balances and inform patient',
        correctPosition: 3,
        detail: 'If there\'s a balance from a previous visit, mention it now so the patient can prepare.',
      },
      {
        id: 'eps-5',
        text: 'Schedule appointment with correct provider and visit type',
        correctPosition: 4,
        detail: 'Match the provider from their last visit (continuity of care) unless they request otherwise.',
      },
      {
        id: 'eps-6',
        text: 'Confirm appointment and remind about copay/balance',
        correctPosition: 5,
        detail: 'Confirm date, time, and let them know what payment to expect at check-in.',
      },
    ],
    criticalOrderNotes: [
      {
        afterStep: 0,
        note: 'Identity verification is a HIPAA requirement. Never share any patient info without confirming who you\'re speaking with.',
        emphasis: 'critical',
      },
    ],
  },
  {
    id: 'new-patient-checkin',
    title: 'New Patient Check-In',
    description: 'A new patient arrives for their first appointment. Walk through the check-in process.',
    steps: [
      {
        id: 'npc-1',
        text: 'Greet the patient warmly and ask for their name',
        correctPosition: 0,
        detail: 'First impressions matter. Smile, make eye contact, and welcome them to the practice.',
      },
      {
        id: 'npc-2',
        text: 'Verify identity with photo ID',
        correctPosition: 1,
        detail: 'Request a government-issued photo ID to confirm they are who they say they are.',
      },
      {
        id: 'npc-3',
        text: 'Collect and scan insurance card (front and back)',
        correctPosition: 2,
        detail: 'Scan both sides — the back has claims address and phone number you\'ll need later.',
      },
      {
        id: 'npc-4',
        text: 'Collect copay or applicable payment',
        correctPosition: 3,
        detail: 'Collect the copay up front before giving forms. This is standard practice — it\'s much harder to collect after the visit.',
      },
      {
        id: 'npc-5',
        text: 'Provide new patient forms (demographics, medical history, HIPAA, consent)',
        correctPosition: 4,
        detail: 'Hand the patient a clipboard with all required forms. Let them know you\'re available if they have questions.',
      },
      {
        id: 'npc-6',
        text: 'Collect completed forms and review for completeness',
        correctPosition: 5,
        detail: 'When the patient returns the clipboard, check that all fields are filled and all signatures are in place. Missing info delays the visit.',
      },
      {
        id: 'npc-7',
        text: 'Mark patient as "Checked In" in the scheduling system',
        correctPosition: 6,
        detail: 'Update the patient\'s appointment status in the EHR/scheduling system. Back office staff monitor this to know who is ready to be roomed.',
      },
      {
        id: 'npc-8',
        text: 'Notify clinical staff that patient is ready to be roomed',
        correctPosition: 7,
        detail: 'Alert the MA or nurse via the system or in person. The patient is now fully checked in and waiting.',
      },
    ],
    criticalOrderNotes: [
      {
        afterStep: 3,
        note: 'Always collect copay BEFORE handing over forms. It\'s much harder to collect after the patient has been seen.',
        emphasis: 'warning',
      },
      {
        afterStep: 6,
        note: 'Marking "Checked In" in the EHR is critical — back office staff watch the schedule status to know when patients are ready for rooming.',
        emphasis: 'info',
      },
    ],
  },
  {
    id: 'walkin-patient',
    title: 'Walk-In / Urgent Care Patient',
    description: 'A patient walks in without an appointment needing to be seen urgently.',
    steps: [
      {
        id: 'wip-1',
        text: 'Greet the patient and assess the nature of their visit',
        correctPosition: 0,
        detail: 'Determine if it\'s truly urgent or if they just need a routine appointment. Use your office\'s triage protocol.',
      },
      {
        id: 'wip-2',
        text: 'Check for any emergent symptoms requiring 911',
        correctPosition: 1,
        detail: 'If the patient shows signs of chest pain, stroke symptoms, or severe distress, call 911 immediately — do NOT attempt to triage.',
      },
      {
        id: 'wip-3',
        text: 'Determine if patient is new or existing',
        correctPosition: 2,
        detail: 'Look them up in the system. New patients need full registration; existing patients need record pulled.',
      },
      {
        id: 'wip-4',
        text: 'Collect or verify demographics and insurance',
        correctPosition: 3,
        detail: 'Even in urgent situations, insurance info is needed. Verify quickly but thoroughly.',
      },
      {
        id: 'wip-5',
        text: 'Run real-time eligibility verification',
        correctPosition: 4,
        detail: 'Verify coverage for the visit type. Some plans don\'t cover walk-in/urgent visits at all locations.',
      },
      {
        id: 'wip-6',
        text: 'Collect copay or inform of self-pay rates',
        correctPosition: 5,
        detail: 'If uninsured, provide your office\'s self-pay rates before the patient is seen.',
      },
      {
        id: 'wip-7',
        text: 'Check provider availability and slot patient in',
        correctPosition: 6,
        detail: 'Work with clinical staff to find an opening. The provider may need to double-book or squeeze in.',
      },
      {
        id: 'wip-8',
        text: 'Complete all paperwork and notify clinical team',
        correctPosition: 7,
        detail: 'Ensure consent forms and HIPAA are signed, then alert clinical staff the patient is ready.',
      },
    ],
    criticalOrderNotes: [
      {
        afterStep: 1,
        note: 'EMTALA reminder: If the patient has an emergency condition, they must be stabilized regardless of insurance status. Never turn away an emergency.',
        emphasis: 'critical',
      },
    ],
  },
  {
    id: 'patient-checkout',
    title: 'Patient Check-Out',
    description: 'The provider finishes with the patient. Complete the check-out process.',
    steps: [
      {
        id: 'pco-1',
        text: 'Receive the encounter form / superbill from the provider',
        correctPosition: 0,
        detail: 'The superbill tells you what was done during the visit — diagnosis codes, procedures, and follow-up orders.',
      },
      {
        id: 'pco-2',
        text: 'Review for follow-up orders (labs, referrals, imaging)',
        correctPosition: 1,
        detail: 'Check if the provider ordered labs, imaging, or referrals. These need to be scheduled or processed.',
      },
      {
        id: 'pco-3',
        text: 'Schedule follow-up appointment if ordered',
        correctPosition: 2,
        detail: 'If the provider wants a follow-up, schedule it now while the patient is still here.',
      },
      {
        id: 'pco-4',
        text: 'Initiate any referrals or prior authorizations',
        correctPosition: 3,
        detail: 'Start the referral/auth process immediately. Don\'t let it sit — delays harm the patient.',
      },
      {
        id: 'pco-5',
        text: 'Collect any outstanding copay or coinsurance balance',
        correctPosition: 4,
        detail: 'If copay wasn\'t collected at check-in, or if there\'s an additional balance, collect it now.',
      },
      {
        id: 'pco-6',
        text: 'Provide patient with visit summary and any handouts',
        correctPosition: 5,
        detail: 'Give the patient their after-visit summary, medication instructions, and any educational materials.',
      },
    ],
    criticalOrderNotes: [
      {
        afterStep: 3,
        note: 'Starting referrals and prior auths at checkout is a best practice. The longer you wait, the more likely they\'ll be delayed or forgotten.',
        emphasis: 'warning',
      },
    ],
  },
  {
    id: 'appointment-reminders',
    title: 'Appointment Reminder Calls',
    description: 'You\'re making reminder calls for tomorrow\'s appointments. What\'s the proper workflow?',
    steps: [
      {
        id: 'arc-1',
        text: 'Pull tomorrow\'s appointment schedule',
        correctPosition: 0,
        detail: 'Generate the list of all patients scheduled for the next business day.',
      },
      {
        id: 'arc-2',
        text: 'Review each patient\'s insurance eligibility status',
        correctPosition: 1,
        detail: 'Batch-check eligibility for all patients. Flag any that show inactive or changed coverage.',
      },
      {
        id: 'arc-3',
        text: 'Note any patients with outstanding balances',
        correctPosition: 2,
        detail: 'Check for past-due balances so you can mention them during the call.',
      },
      {
        id: 'arc-4',
        text: 'Call each patient to confirm appointment',
        correctPosition: 3,
        detail: 'Leave HIPAA-compliant messages if voicemail — only state your name, office name, and callback number. Never leave medical details.',
      },
      {
        id: 'arc-5',
        text: 'Reschedule cancellations and backfill from waitlist',
        correctPosition: 4,
        detail: 'When someone cancels, immediately check the waitlist. Empty slots = lost revenue.',
      },
      {
        id: 'arc-6',
        text: 'Update schedule and notes for the next day',
        correctPosition: 5,
        detail: 'Mark confirmed, no-answer, and rescheduled patients. Flag any with insurance or balance issues.',
      },
    ],
    criticalOrderNotes: [
      {
        afterStep: 1,
        note: 'Checking eligibility during reminder calls catches coverage issues BEFORE the patient arrives — saving time and preventing denied claims.',
        emphasis: 'warning',
      },
      {
        afterStep: 3,
        note: 'HIPAA compliance: When leaving voicemails, NEVER mention the reason for the visit, provider name, or any medical details.',
        emphasis: 'critical',
      },
    ],
  },
  {
    id: 'opening-the-office',
    title: 'Opening the Office',
    description: 'It\'s 7:30 AM and you\'re the first one in. What order do you open the office?',
    steps: [
      {
        id: 'oto-1',
        text: 'Arrive 30 minutes early and disarm the alarm system',
        correctPosition: 0,
        detail: 'Always arrive before patients. The alarm must be disarmed first or it will trigger when you enter.',
      },
      {
        id: 'oto-2',
        text: 'Turn on lights, computers, printers, and copier',
        correctPosition: 1,
        detail: 'Systems need time to boot up. Starting them early ensures everything is ready when the first patient arrives.',
      },
      {
        id: 'oto-3',
        text: 'Check voicemail and return any urgent messages',
        correctPosition: 2,
        detail: 'Patients may have called overnight to cancel, reschedule, or report urgent issues. Handle these before the day begins.',
      },
      {
        id: 'oto-4',
        text: 'Review today\'s schedule and prepare patient charts',
        correctPosition: 3,
        detail: 'Know who is coming in, what type of visit, and if any special preparations are needed (forms, labs, referrals).',
      },
      {
        id: 'oto-5',
        text: 'Verify insurance eligibility for today\'s patients',
        correctPosition: 4,
        detail: 'Batch-check eligibility for all patients before they arrive. Flag any with inactive or changed coverage.',
      },
      {
        id: 'oto-6',
        text: 'Unlock the front door at the scheduled opening time',
        correctPosition: 5,
        detail: 'Open the door at the exact posted time — not earlier, not later. Patients expect consistency.',
      },
      {
        id: 'oto-7',
        text: 'Greet the first patients and begin the check-in process',
        correctPosition: 6,
        detail: 'With everything prepared, you can focus on giving patients a warm, efficient check-in experience.',
      },
    ],
    criticalOrderNotes: [
      {
        afterStep: 2,
        note: 'Checking voicemail early catches overnight cancellations — which can open slots for waitlist patients before the day starts.',
        emphasis: 'info',
      },
      {
        afterStep: 4,
        note: 'Running eligibility BEFORE patients arrive prevents check-in delays and avoids awkward conversations about coverage issues at the window.',
        emphasis: 'warning',
      },
    ],
  },
];
