import type { SOPContent } from '../components/workflows/SOPModal';

const VIDEO_BASE_URL = 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos';

// ============================================
// BEFORE THE VISIT SOPs
// ============================================

export const newPatientRegistrationSOP: SOPContent = {
  id: 'sop-new-patient-reg',
  slug: 'new-patient-registration-sop',
  title: 'New Patient Registration',
  description: 'Complete registration process including demographics, insurance collection, eligibility verification, and appointment booking.',
  companionVideoUrl: `${VIDEO_BASE_URL}/new_pt_reg.mp4`,
  companionVideoTitle: 'New Patient Registration & Scheduling',
  steps: [
    {
      number: 1,
      title: 'Greet the Patient and Establish Identity',
      details: [
        'Welcome the patient warmly and confirm their full legal name and date of birth',
        'Ask for government-issued photo ID to verify identity',
        'Make a copy or scan of the ID for the record if your office policy requires',
      ],
      callout: {
        type: 'tip',
        text: 'Use a welcoming tone—first impressions matter. A friendly greeting sets the tone for the entire visit.',
      },
    },
    {
      number: 2,
      title: 'Collect Patient Demographics',
      details: [
        'Enter or verify: full legal name, preferred name (if different), date of birth, Social Security Number (if collected)',
        'Collect contact information: mailing address, phone number(s), email address',
        'Note preferred method of contact and confirm whether messages can be left at provided numbers',
        'Collect emergency contact name, relationship, and phone number',
        'Record marital status, employer information, and primary care provider (if applicable)',
      ],
    },
    {
      number: 3,
      title: 'Collect Insurance Information',
      details: [
        'Request all current insurance cards (primary and secondary if applicable)',
        'Make a copy (front and back) or scan insurance cards into the record',
        'Enter: payer name, plan type, policy/member ID, group number, subscriber information, and relationship to patient',
        'Record insurance customer service phone number from the card',
      ],
      callout: {
        type: 'warning',
        text: 'Always collect BOTH the front and back of insurance cards. The back often contains important claims address and phone number information.',
      },
    },
    {
      number: 4,
      title: 'Verify Insurance Eligibility',
      details: [
        'Access payer portal or use real-time eligibility tool in your EHR/PMS',
        'Confirm: coverage is active as of the date of service, patient name matches exactly, plan covers the type of service being scheduled',
        'Note copay, deductible status, and any prior authorization requirements',
        'If eligibility cannot be verified electronically, call the payer\'s provider services line',
        'Document the verification date, method, and representative name (if called)',
      ],
      callout: {
        type: 'info',
        text: 'Eligibility verification should be completed BEFORE the appointment whenever possible. This prevents day-of-visit surprises.',
      },
    },
    {
      number: 5,
      title: 'Explain Financial Responsibility',
      details: [
        'Inform the patient of any copay, coinsurance, or outstanding deductible amount',
        'Explain your office\'s payment policy (e.g., copay due at time of service)',
        'Offer payment plan options if applicable for larger balances',
        'Have the patient sign financial responsibility forms acknowledging payment policies',
      ],
    },
    {
      number: 6,
      title: 'Complete Required Forms',
      details: [
        'Provide HIPAA Notice of Privacy Practices and document acknowledgment',
        'Have patient sign authorization to release information (if needed for referrals)',
        'Collect consent for treatment form',
        'Provide and explain patient portal enrollment if your office offers one',
        'Have patient complete health history questionnaire',
      ],
    },
    {
      number: 7,
      title: 'Schedule the Appointment',
      details: [
        'Confirm the appointment type and provider',
        'Find an available time slot that works for the patient',
        'Enter the appointment in the scheduling system with correct appointment type',
        'Provide appointment reminder options (text, email, phone call)',
        'Give the patient an appointment card or send confirmation via their preferred method',
      ],
    },
    {
      number: 8,
      title: 'Provide Pre-Visit Instructions',
      details: [
        'Explain any preparations needed (fasting, bringing medications list, etc.)',
        'Confirm office location and parking instructions if needed',
        'Let the patient know what to bring to the appointment (ID, insurance cards, referral if required)',
        'Inform them of arrival time (typically 15-20 minutes early for new patients)',
      ],
      callout: {
        type: 'tip',
        text: 'Consider sending a new patient packet in advance—either by mail, email, or patient portal—so they can complete paperwork at home.',
      },
    },
  ],
  quickReference: [
    'Greet patient warmly, verify identity with photo ID',
    'Collect full demographics and emergency contact',
    'Copy front and back of all insurance cards',
    'Verify eligibility via portal or phone before appointment',
    'Explain copay/deductible and payment policies',
    'Complete HIPAA, consent, and health history forms',
    'Schedule appointment and set up reminders',
    'Provide pre-visit instructions and arrival time',
  ],
};

export const existingPatientSchedulingSOP: SOPContent = {
  id: 'sop-existing-patient-sched',
  slug: 'existing-patient-scheduling-sop',
  title: 'Existing Patient Scheduling',
  description: 'Streamlined scheduling for established patients including verification and insurance updates.',
  companionVideoUrl: `${VIDEO_BASE_URL}/est-pt-scheduling.mp4`,
  companionVideoTitle: 'Existing Patient Scheduling',
  steps: [
    {
      number: 1,
      title: 'Identify the Patient',
      details: [
        'Verify patient identity using two identifiers (name and DOB)',
        'Pull up the patient\'s existing record in the system',
        'Confirm phone number and address are still current',
      ],
    },
    {
      number: 2,
      title: 'Verify Insurance Status',
      details: [
        'Check if insurance information on file is current',
        'If patient has new insurance, collect and enter updated card information',
        'Run eligibility verification if insurance has changed or if it\'s been more than 30 days since last verification',
        'Note any changes to copay or deductible status',
      ],
      callout: {
        type: 'warning',
        text: 'Insurance changes are common at the start of each year. Always ask "Any changes to your insurance?" especially in January-March.',
      },
    },
    {
      number: 3,
      title: 'Determine Appointment Need',
      details: [
        'Ask the reason for the visit to select the correct appointment type',
        'Check for any outstanding orders, referrals, or follow-up notes from previous visits',
        'Verify if the visit requires a specific provider or can be scheduled with any available provider',
      ],
    },
    {
      number: 4,
      title: 'Schedule the Appointment',
      details: [
        'Find an available slot that matches patient preference and clinical needs',
        'Confirm the date, time, provider, and location with the patient',
        'Enter the appointment with the correct appointment type code',
        'Set up appointment reminders per patient preference',
      ],
    },
    {
      number: 5,
      title: 'Provide Confirmation',
      details: [
        'Send appointment confirmation via patient\'s preferred method',
        'Remind patient to bring insurance cards if there have been any changes',
        'Note any special instructions (fasting, bring medication list, etc.)',
        'Remind patient of office cancellation policy',
      ],
      callout: {
        type: 'tip',
        text: 'Taking an extra 30 seconds to confirm details reduces no-shows and day-of-visit issues significantly.',
      },
    },
  ],
  quickReference: [
    'Verify identity with name and DOB',
    'Confirm contact info is current',
    'Check for insurance changes and re-verify if needed',
    'Determine appointment type based on visit reason',
    'Schedule with correct provider and appointment type',
    'Send confirmation and pre-visit reminders',
  ],
};

export const reminderCallsSOP: SOPContent = {
  id: 'sop-reminder-calls',
  slug: 'reminder-calls-sop',
  title: 'Reminder Calls & Pre-Visit Prep',
  description: 'Effective reminder workflows to reduce no-shows and ensure patients are prepared.',
  companionVideoUrl: `${VIDEO_BASE_URL}/reminder-calls.mp4`,
  companionVideoTitle: 'Appointment Reminder Calls',
  steps: [
    {
      number: 1,
      title: 'Generate the Reminder List',
      details: [
        'Pull the appointment list for the target date (typically 2 days out for calls, 1-2 days for automated reminders)',
        'Filter by appointment status (exclude already confirmed or cancelled)',
        'Note any special appointment types that may need additional preparation reminders',
      ],
    },
    {
      number: 2,
      title: 'Make Reminder Calls',
      details: [
        'Call patients who haven\'t confirmed via automated system',
        'Follow HIPAA guidelines—don\'t leave detailed messages on voicemail unless patient has authorized it',
        'Confirm appointment date, time, provider, and location',
        'Verify insurance is still active and ask about any changes',
        'Remind of any pre-visit preparations (fasting, medication list, etc.)',
      ],
      callout: {
        type: 'info',
        text: 'HIPAA-compliant voicemail: "Hi, this is [Office Name] calling to confirm an upcoming appointment. Please call us back at [number]." Do not mention provider name or visit type unless authorized.',
      },
    },
    {
      number: 3,
      title: 'Document Confirmation Status',
      details: [
        'Update appointment status in the system (Confirmed, Left Message, No Answer, Cancelled)',
        'Note any special requests or information the patient provided',
        'Flag any appointments where patient couldn\'t be reached after multiple attempts',
      ],
    },
    {
      number: 4,
      title: 'Handle Cancellations and Reschedules',
      details: [
        'If patient needs to cancel, offer to reschedule immediately',
        'Update the schedule promptly to open the slot for waitlist patients',
        'Document the reason for cancellation if provided',
        'Note any patterns of cancellation for follow-up',
      ],
      callout: {
        type: 'tip',
        text: 'When a patient cancels, immediately check your waitlist. A quick call can fill the slot and improve access for another patient.',
      },
    },
    {
      number: 5,
      title: 'Review Unreached Patients',
      details: [
        'For patients who couldn\'t be reached, send a text or email reminder if consent is on file',
        'Flag for day-of-appointment follow-up if still unconfirmed',
        'Consider reaching out to emergency contact if pattern of unreachable exists',
      ],
    },
  ],
  quickReference: [
    'Pull appointment list 2 days before scheduled date',
    'Call unconfirmed patients with date, time, location',
    'Remind of any preparation requirements',
    'Update confirmation status in the system immediately',
    'Offer rescheduling for cancellations, check waitlist',
    'Send text/email backup for unreachable patients',
  ],
};

// ============================================
// DURING THE VISIT SOPs
// ============================================

export const newPatientCheckInSOP: SOPContent = {
  id: 'sop-new-pt-checkin',
  slug: 'patient-check-in',
  title: 'New Patient Check-In',
  description: 'Comprehensive check-in process for new patients with scheduled appointments.',
  steps: [
    {
      number: 1,
      title: 'Greet and Identify Patient',
      details: [
        'Welcome the patient warmly by name',
        'Verify identity with two identifiers: full legal name and date of birth',
        'Request photo ID and insurance cards',
        'Make copies of ID and insurance cards if not already on file',
      ],
      callout: {
        type: 'tip',
        text: 'New patients are often anxious. A warm, confident greeting helps put them at ease immediately.',
      },
    },
    {
      number: 2,
      title: 'Verify Registration is Complete',
      details: [
        'Confirm all demographics were collected during registration',
        'Check that insurance eligibility was verified',
        'Review that all required forms are signed (HIPAA, consent, financial agreement)',
        'If any items are missing, complete them now',
      ],
    },
    {
      number: 3,
      title: 'Collect Patient Payments',
      details: [
        'Inform patient of their copay or any amount due',
        'Collect payment before the visit per office policy',
        'Provide a receipt',
        'If patient cannot pay, follow office protocol (some offices still see patient, others reschedule)',
      ],
      callout: {
        type: 'warning',
        text: 'Document any payment issues in the chart. Never deny medically urgent care over payment—escalate to a supervisor.',
      },
    },
    {
      number: 4,
      title: 'Confirm Health History and Chief Complaint',
      details: [
        'Verify patient completed the health history questionnaire',
        'Confirm the reason for today\'s visit',
        'Note any urgent concerns that should be flagged to clinical staff',
        'Update any changes to medications, allergies, or pharmacy',
      ],
    },
    {
      number: 5,
      title: 'Complete Check-In in the System',
      details: [
        'Update appointment status to "Arrived" or "Checked In"',
        'Note the arrival time for wait time tracking',
        'Print any needed forms or labels for clinical staff',
        'Alert clinical team that patient is ready',
      ],
    },
    {
      number: 6,
      title: 'Provide Waiting Room Instructions',
      details: [
        'Let patient know approximate wait time if available',
        'Point out restrooms, water, and waiting area amenities',
        'Explain how they will be called back',
        'Offer to answer any questions about the visit',
      ],
      callout: {
        type: 'tip',
        text: 'Setting realistic wait time expectations reduces patient frustration. If running behind, acknowledge it upfront.',
      },
    },
  ],
  quickReference: [
    'Greet warmly, verify name and DOB',
    'Collect and copy ID and insurance cards',
    'Confirm all registration forms are complete',
    'Collect copay and provide receipt',
    'Verify health history and reason for visit',
    'Update status to "Arrived" in system',
    'Direct to waiting area with time estimate',
  ],
};

export const existingPatientCheckInSOP: SOPContent = {
  id: 'sop-existing-pt-checkin',
  slug: 'existing-patient-check-in',
  title: 'Existing Patient Check-In',
  description: 'Streamlined check-in process for established patients.',
  steps: [
    {
      number: 1,
      title: 'Greet and Verify Identity',
      details: [
        'Welcome the patient by name',
        'Verify identity with name and date of birth',
        'Request insurance card if it\'s been updated',
      ],
    },
    {
      number: 2,
      title: 'Verify and Update Information',
      details: [
        'Confirm address and phone number are still current',
        'Ask "Any changes to your insurance?"',
        'Update pharmacy information if changed',
        'Check for any new allergies or medications to add',
      ],
      callout: {
        type: 'info',
        text: 'Most offices update demographics annually or if patient reports changes. Keep the process quick but thorough.',
      },
    },
    {
      number: 3,
      title: 'Collect Payment',
      details: [
        'Check for any outstanding balance on the account',
        'Collect copay or coinsurance amount',
        'Offer payment plan options for larger balances',
        'Provide receipt',
      ],
    },
    {
      number: 4,
      title: 'Confirm Visit Details',
      details: [
        'Verify the reason for today\'s visit',
        'Note any urgent concerns for clinical team',
        'Confirm any labs, imaging, or documents patient was asked to bring',
      ],
    },
    {
      number: 5,
      title: 'Complete Check-In',
      details: [
        'Update appointment status to "Arrived"',
        'Note arrival time',
        'Alert clinical team',
        'Direct patient to waiting area',
      ],
      callout: {
        type: 'tip',
        text: 'Established patients expect efficiency. Keep the check-in process smooth and under 3-5 minutes when possible.',
      },
    },
  ],
  quickReference: [
    'Greet by name, verify with DOB',
    'Confirm contact info and insurance current',
    'Check for medication or allergy updates',
    'Collect copay and any balance due',
    'Confirm reason for visit',
    'Mark "Arrived" and alert clinical team',
  ],
};

export const urgentWalkInCheckInSOP: SOPContent = {
  id: 'sop-urgent-walkin-checkin',
  slug: 'urgent-walk-in-check-in',
  title: 'Urgent Care / Walk-In Check-In',
  description: 'Rapid check-in protocol for urgent, same-day, and walk-in patients.',
  steps: [
    {
      number: 1,
      title: 'Assess Urgency Level',
      details: [
        'Greet the patient and quickly assess their chief complaint',
        'Identify any emergent symptoms (chest pain, difficulty breathing, severe bleeding)',
        'If true emergency, skip registration and alert clinical staff immediately or direct to ER',
        'For urgent but non-emergent, proceed with rapid check-in',
      ],
      callout: {
        type: 'warning',
        text: 'Know your office\'s emergency protocols. True emergencies should be escalated to clinical staff or 911 immediately—registration can wait.',
      },
    },
    {
      number: 2,
      title: 'Rapid Patient Identification',
      details: [
        'For existing patients: verify name and DOB, pull up record',
        'For new patients: collect essential info only (name, DOB, phone, insurance)',
        'Full registration can be completed after the visit or during wait if time allows',
      ],
    },
    {
      number: 3,
      title: 'Quick Insurance Check',
      details: [
        'Collect insurance card and make a copy',
        'Run quick eligibility check if system allows',
        'If uninsured, inform of self-pay rates and proceed',
        'Don\'t delay care for insurance verification in true urgent situations',
      ],
      callout: {
        type: 'info',
        text: 'Most offices have a policy to see urgent patients even if insurance verification isn\'t complete. Know your office\'s policy.',
      },
    },
    {
      number: 4,
      title: 'Collect Payment if Required',
      details: [
        'Collect copay if required by office policy',
        'For self-pay, collect deposit or full payment per policy',
        'Document if payment is deferred due to urgency',
      ],
    },
    {
      number: 5,
      title: 'Add to Schedule and Alert Clinical',
      details: [
        'Add patient to the schedule as a walk-in/urgent type',
        'Notify clinical team of new urgent patient and chief complaint',
        'Provide estimated wait time to patient',
        'Triage with clinical team if needed to prioritize',
      ],
      callout: {
        type: 'tip',
        text: 'Communication with clinical staff is critical. A quick heads-up about an urgent walk-in helps them prepare.',
      },
    },
  ],
  quickReference: [
    'Assess urgency—escalate true emergencies immediately',
    'Verify identity: name and DOB',
    'Collect insurance card, quick eligibility check',
    'Collect copay or note deferred payment',
    'Add to schedule as urgent/walk-in',
    'Alert clinical team with chief complaint',
    'Give patient realistic wait time estimate',
  ],
};

export const patientCheckOutSOP: SOPContent = {
  id: 'sop-patient-checkout',
  slug: 'patient-check-out',
  title: 'Patient Check-Out',
  description: 'Complete checkout workflow including scheduling, payments, and follow-up.',
  steps: [
    {
      number: 1,
      title: 'Receive Patient from Clinical',
      details: [
        'Greet patient as they check out',
        'Review checkout instructions from provider (often in EHR or on paper routing slip)',
        'Note any follow-up appointments, referrals, or prescriptions ordered',
      ],
    },
    {
      number: 2,
      title: 'Schedule Follow-Up Appointments',
      details: [
        'Schedule any follow-up visits as ordered by the provider',
        'Book any ordered labs, imaging, or procedures',
        'Coordinate with specialists if referrals were made',
        'Provide appointment card or send confirmation',
      ],
      callout: {
        type: 'tip',
        text: 'Scheduling follow-ups at checkout significantly improves completion rates compared to asking patients to call back.',
      },
    },
    {
      number: 3,
      title: 'Review and Initiate Referrals',
      details: [
        'If referral was ordered, explain the process to the patient',
        'Check if prior authorization is needed',
        'Provide specialist contact information if patient will self-schedule',
        'Note referral in the system for tracking',
      ],
    },
    {
      number: 4,
      title: 'Collect Outstanding Payments',
      details: [
        'If copay wasn\'t collected at check-in, collect now',
        'Collect any coinsurance or amounts due based on today\'s visit',
        'Discuss outstanding balance and offer payment arrangements if needed',
        'Provide itemized receipt',
      ],
    },
    {
      number: 5,
      title: 'Provide Visit Documentation',
      details: [
        'Give patient their After Visit Summary (AVS) if generated',
        'Review any patient instructions or education materials',
        'Confirm patient has their prescriptions (electronic or paper)',
        'Ensure patient knows how to access patient portal for results',
      ],
    },
    {
      number: 6,
      title: 'Complete Checkout in System',
      details: [
        'Update appointment status to "Checked Out" or "Completed"',
        'Ensure all checkout tasks are documented',
        'Flag any issues for billing or clinical follow-up',
      ],
      callout: {
        type: 'info',
        text: 'A complete checkout prevents missed follow-ups and billing issues. Take an extra minute to verify everything is in order.',
      },
    },
  ],
  quickReference: [
    'Review provider checkout instructions',
    'Schedule all follow-up appointments',
    'Initiate referrals if ordered',
    'Collect copay/coinsurance and outstanding balance',
    'Provide After Visit Summary and instructions',
    'Mark appointment as "Completed" in system',
  ],
};

// ============================================
// THROUGHOUT THE DAY SOPs
// ============================================

export const noShowsLateArrivalsSOP: SOPContent = {
  id: 'sop-noshows-late',
  slug: 'no-shows-late-arrivals',
  title: 'No-Shows and Late Arrivals',
  description: 'Procedures for managing late arrivals, no-shows, and schedule optimization.',
  steps: [
    {
      number: 1,
      title: 'Monitor the Schedule for Late Arrivals',
      details: [
        'Note any patients who haven\'t checked in within 10-15 minutes of appointment time',
        'Check if patient called or sent a message about running late',
        'Attempt to reach patient by phone if no communication received',
      ],
    },
    {
      number: 2,
      title: 'Handle Late Arrivals',
      details: [
        'If patient arrives late, assess whether they can still be seen',
        'Consult with clinical staff on whether visit can be completed in remaining time',
        'If cannot be seen, offer to reschedule',
        'If can be seen, check in normally but note the late arrival',
      ],
      callout: {
        type: 'info',
        text: 'Each office has different late policies. Some allow 15-minute grace period, others have stricter rules. Know your policy.',
      },
    },
    {
      number: 3,
      title: 'Document No-Shows',
      details: [
        'If patient doesn\'t arrive or respond within the grace period, mark as "No-Show"',
        'Document attempts to reach the patient',
        'Leave the slot open initially in case patient is en route',
        'After grace period, open slot for walk-ins or waitlist',
      ],
      callout: {
        type: 'warning',
        text: 'Always document no-shows in the chart. This creates a record if there\'s a pattern and protects the practice.',
      },
    },
    {
      number: 4,
      title: 'Follow Up with No-Show Patients',
      details: [
        'Call or send message to no-show patients within 24 hours',
        'Offer to reschedule if clinically appropriate',
        'Note if this is a pattern of missed appointments',
        'Follow office policy for repeated no-shows (warning letter, dismissal process, etc.)',
      ],
    },
    {
      number: 5,
      title: 'Fill the Open Slot',
      details: [
        'Check your waitlist for patients who need to be seen',
        'Contact waitlist patients starting with most urgent',
        'Offer slot to walk-in patients if appropriate',
        'Document how slot was filled or if it remained open',
      ],
      callout: {
        type: 'tip',
        text: 'A well-maintained waitlist turns no-shows into opportunities to serve more patients.',
      },
    },
  ],
  quickReference: [
    'Monitor arrivals—flag patients 10-15 min past appointment time',
    'Attempt phone contact for late/missing patients',
    'Assess if late arrivals can still be seen',
    'Mark no-shows in system after grace period',
    'Document all contact attempts',
    'Contact patient within 24 hours to reschedule',
    'Check waitlist to fill open slots',
  ],
};

export const waitlistsSameDaySOP: SOPContent = {
  id: 'sop-waitlist-sameday',
  slug: 'waitlists-same-day',
  title: 'Waitlists and Same-Day Add-Ons',
  description: 'Strategies for waitlist management and handling same-day appointment requests.',
  steps: [
    {
      number: 1,
      title: 'Add Patients to the Waitlist',
      details: [
        'When no appointments are available, offer to add patient to waitlist',
        'Collect: patient name, contact number, reason for visit, urgency level, flexibility (any time vs. specific needs)',
        'Document preferred provider if patient has a preference',
        'Give realistic expectations about wait times',
      ],
      callout: {
        type: 'tip',
        text: 'Be honest about wait times. If your waitlist is long, let patients know so they can make informed decisions about their care.',
      },
    },
    {
      number: 2,
      title: 'Maintain the Waitlist',
      details: [
        'Review waitlist regularly (at least daily)',
        'Prioritize by urgency and clinical need',
        'Remove patients who have been scheduled or no longer need the appointment',
        'Keep contact information current',
      ],
    },
    {
      number: 3,
      title: 'Fill Openings from Waitlist',
      details: [
        'When a slot opens (cancellation, no-show, schedule change), check waitlist immediately',
        'Contact highest-priority patients first',
        'Offer the specific time slot available',
        'If declined, move to next patient on list',
        'Document outcome (scheduled, declined, unable to reach)',
      ],
      callout: {
        type: 'info',
        text: 'Speed matters—open slots fill fast. Have your waitlist ready and contact info accessible.',
      },
    },
    {
      number: 4,
      title: 'Handle Same-Day Requests',
      details: [
        'Assess urgency: is this same-day need urgent or convenience?',
        'Check for any open slots in the current day\'s schedule',
        'Consider provider overbooking policies (some allow double-booking for quick visits)',
        'If no slots, add to waitlist with same-day priority',
        'For urgent needs, consider urgent care add-on slot if available',
      ],
    },
    {
      number: 5,
      title: 'Communicate with Clinical Team',
      details: [
        'Alert providers and clinical staff when add-ons are scheduled',
        'Communicate patient chief complaint and urgency',
        'Coordinate on timing to minimize disruption',
        'Get approval before scheduling into protected time slots',
      ],
      callout: {
        type: 'warning',
        text: 'Never add patients to a provider\'s schedule without communication. Surprise add-ons create chaos and delays.',
      },
    },
  ],
  quickReference: [
    'Offer waitlist when no appointments available',
    'Collect name, phone, reason, urgency, flexibility',
    'Review and prioritize waitlist daily',
    'Check waitlist immediately when slots open',
    'Contact patients quickly—slots fill fast',
    'Assess same-day requests for urgency vs. convenience',
    'Always communicate add-ons to clinical team',
  ],
};

export const balancingTasksSOP: SOPContent = {
  id: 'sop-balancing-tasks',
  slug: 'balancing-tasks',
  title: 'Balancing Phones, Messages, and Walk-Ins',
  description: 'Strategies for managing multiple demands while maintaining quality service.',
  steps: [
    {
      number: 1,
      title: 'Prioritize by Urgency',
      details: [
        'Life-threatening emergencies: immediate escalation (call 911 or clinical staff)',
        'Urgent patient needs (same-day requests, urgent symptoms): high priority',
        'In-person patients (check-in/check-out): cannot wait indefinitely',
        'Phone calls: answer within 3-4 rings when possible',
        'Messages/tasks: process during slower periods',
      ],
      callout: {
        type: 'info',
        text: 'The patient in front of you is your first priority—but don\'t let phones go unanswered endlessly. Balance is key.',
      },
    },
    {
      number: 2,
      title: 'Develop a Rhythm',
      details: [
        'Batch similar tasks when possible (process all voicemails together, then faxes, etc.)',
        'Use slower periods (early morning, after lunch) to catch up on tasks',
        'Anticipate busy times (Monday mornings, post-lunch) and prepare',
        'Keep essential supplies and tools within reach to minimize interruptions',
      ],
    },
    {
      number: 3,
      title: 'Manage Phone Calls Effectively',
      details: [
        'Answer with a professional greeting including your name',
        'Quickly identify the nature of the call',
        'If you need to place someone on hold, ask permission and check back within 60 seconds',
        'For complex calls, offer to take a message and return the call',
        'Route calls appropriately to avoid transfers and repeated explanations',
      ],
      callout: {
        type: 'tip',
        text: 'Keep a notepad ready for quick notes during calls. Trying to remember details leads to errors.',
      },
    },
    {
      number: 4,
      title: 'Handle Simultaneous Demands',
      details: [
        'When overwhelmed, prioritize: urgent > in-person > phone > messages',
        'Acknowledge people waiting even if you can\'t help immediately',
        'Use phrases like "I\'ll be with you in just one moment" to set expectations',
        'Ask for help from colleagues if available',
        'It\'s okay to let calls go to voicemail briefly during extremely busy periods',
      ],
    },
    {
      number: 5,
      title: 'Process Messages and Tasks',
      details: [
        'Check messages and task queue at regular intervals (e.g., every 30-60 minutes)',
        'Sort by urgency: patient safety issues first, then time-sensitive, then routine',
        'Process straightforward items quickly, flag complex ones for dedicated time',
        'Document completion of tasks in the system',
        'Follow up on pending items before end of day',
      ],
      callout: {
        type: 'warning',
        text: 'Messages about abnormal results, urgent medication needs, or safety concerns should never wait. Flag and escalate immediately.',
      },
    },
    {
      number: 6,
      title: 'Maintain Professionalism Under Pressure',
      details: [
        'Take brief moments to reset if feeling overwhelmed (a few deep breaths)',
        'Maintain a calm, professional tone even when busy',
        'Don\'t let stress show to patients—they pick up on it',
        'Ask for help or escalate to a supervisor if truly overwhelmed',
        'Remember: one task at a time, done well, is better than rushing and making errors',
      ],
      callout: {
        type: 'tip',
        text: 'You can\'t pour from an empty cup. Take your breaks, stay hydrated, and pace yourself through busy days.',
      },
    },
  ],
  quickReference: [
    'Priority order: emergencies → urgent → in-person → phone → messages',
    'Batch similar tasks during slower periods',
    'Answer phones within 3-4 rings when possible',
    'Acknowledge people waiting even if busy',
    'Check messages regularly, sort by urgency',
    'Escalate patient safety issues immediately',
    'Ask for help when overwhelmed—it\'s okay!',
  ],
};

// ============================================
// OFFICE ADMINISTRATION SOPs - OPENING
// ============================================

export const phoneSystemLoginSOP: SOPContent = {
  id: 'sop-phone-system-login',
  slug: 'phone-system-login',
  title: 'Phone System Login & Setup',
  description: 'Morning phone system setup enables call tracking, routing, and message retrieval.',
  steps: [
    {
      number: 1,
      title: 'Access Phone System',
      details: [
        'Arrive at designated time before clinic opens',
        'Power on phone/computer system if needed',
        'Log in with your unique credentials',
        'Verify your extension is active',
      ],
      callout: {
        type: 'tip',
        text: 'Arrive 10-15 minutes before opening to complete setup without rushing.',
      },
    },
    {
      number: 2,
      title: 'Check Voicemail & After-Hours Messages',
      details: [
        'Access voicemail system',
        'Listen to all messages from after-hours/call center',
        'Document urgent messages for immediate follow-up',
        'Note patient callbacks needed',
      ],
      callout: {
        type: 'warning',
        text: 'Urgent messages about symptoms, medications, or test results should be flagged for immediate clinical team review.',
      },
    },
    {
      number: 3,
      title: 'Verify Phone Routing',
      details: [
        'Confirm calls are routing to front desk correctly',
        'Test internal extension transfers',
        'Verify after-hours routing is disabled (if applicable)',
        'Check that hold music/messages are working',
      ],
    },
    {
      number: 4,
      title: 'Prepare for Incoming Calls',
      details: [
        'Have scheduling system open and ready',
        'Keep patient lookup screen accessible',
        'Have notepad ready for messages',
        'Review any special instructions for the day',
      ],
    },
  ],
  quickReference: [
    'Log in with unique credentials before clinic opens',
    'Check all voicemails and after-hours messages',
    'Flag urgent messages for clinical team',
    'Verify call routing is working correctly',
    'Have scheduling and patient lookup ready',
  ],
};

export const cashDrawerOpeningSOP: SOPContent = {
  id: 'sop-cash-drawer-opening',
  slug: 'cash-drawer-opening',
  title: 'Cash Drawer Opening',
  description: 'Proper cash drawer setup ensures accurate financial tracking throughout the day.',
  steps: [
    {
      number: 1,
      title: 'Retrieve Cash Drawer',
      details: [
        'Retrieve drawer from safe/secure location',
        'Use two-person verification if required by policy',
        'Sign out drawer on custody log',
      ],
      callout: {
        type: 'info',
        text: 'Chain of custody documentation protects you and the practice. Always sign the log.',
      },
    },
    {
      number: 2,
      title: 'Count Starting Cash',
      details: [
        'Count all bills by denomination (largest to smallest)',
        'Count all coins',
        'Verify starting amount matches expected float (typically $100-200)',
        'Document any discrepancies immediately',
      ],
      callout: {
        type: 'warning',
        text: 'If starting amount doesn\'t match, report to supervisor BEFORE opening. Do not adjust without documentation.',
      },
    },
    {
      number: 3,
      title: 'Document Opening',
      details: [
        'Record starting amount on daily cash log',
        'Note date, time, and your initials',
        'Have witness sign if required',
        'Secure log in designated location',
      ],
    },
    {
      number: 4,
      title: 'Organize Drawer',
      details: [
        'Arrange bills by denomination (largest in back)',
        'Ensure adequate change (ones, fives, quarters)',
        'Place checks/credit card receipts section ready',
        'Position drawer securely at workstation',
      ],
      callout: {
        type: 'warning',
        text: 'Never leave drawer unattended when unlocked. Lock it every time you step away.',
      },
    },
  ],
  quickReference: [
    'Retrieve drawer from secure location with witness',
    'Sign custody log before opening',
    'Count all bills and coins by denomination',
    'Verify starting amount matches float',
    'Document any discrepancies immediately',
    'Organize bills largest to smallest',
    'Never leave drawer unlocked unattended',
  ],
};

export const preScrubbingScheduleSOP: SOPContent = {
  id: 'sop-pre-scrubbing',
  slug: 'pre-scrubbing-schedule',
  title: 'Pre-Scrubbing the Schedule',
  description: 'Pre-scrubbing reduces day-of surprises and ensures smooth patient flow.',
  steps: [
    {
      number: 1,
      title: 'Pull Tomorrow\'s (or Today\'s) Schedule',
      details: [
        'Print or open electronic schedule',
        'Review all appointments for the session',
        'Note appointment types and durations',
        'Identify new patients vs. established patients',
      ],
      callout: {
        type: 'tip',
        text: 'Best practice: Pre-scrub 48-72 hours ahead when possible to allow time to resolve issues.',
      },
    },
    {
      number: 2,
      title: 'Verify Insurance Eligibility',
      details: [
        'Check eligibility status for each patient',
        'Flag any patients not yet verified',
        'Run eligibility for flagged patients',
        'Document verification results',
      ],
    },
    {
      number: 3,
      title: 'Check for Missing Information',
      details: [
        'Demographics complete? (address, phone, email)',
        'Insurance cards on file?',
        'Required forms signed/current?',
        'Outstanding balances noted?',
      ],
    },
    {
      number: 4,
      title: 'Identify Special Needs',
      details: [
        'Interpreter needed?',
        'Wheelchair/accessibility requirements?',
        'Complex medical history to alert provider?',
        'Behavioral flags or special instructions?',
      ],
      callout: {
        type: 'info',
        text: 'Communicating special needs to clinical staff in advance improves patient experience and safety.',
      },
    },
    {
      number: 5,
      title: 'Prepare Patient Materials',
      details: [
        'Pull any paper charts if used',
        'Queue electronic forms for completion',
        'Prepare new patient packets',
        'Print any needed requisitions',
      ],
    },
    {
      number: 6,
      title: 'Document & Communicate',
      details: [
        'Create checklist of issues to address',
        'Flag problem appointments in system',
        'Communicate concerns to clinical team',
        'Note patients who may need extra time',
      ],
    },
  ],
  quickReference: [
    'Review all appointments 48-72 hours ahead',
    'Verify insurance eligibility for each patient',
    'Check for missing demographics or forms',
    'Identify interpreter or accessibility needs',
    'Prepare new patient packets and requisitions',
    'Flag issues and communicate to clinical team',
  ],
};

// ============================================
// OFFICE ADMINISTRATION SOPs - CLOSING
// ============================================

export const cashDrawerClosingSOP: SOPContent = {
  id: 'sop-cash-drawer-closing',
  slug: 'cash-drawer-closing',
  title: 'Cash Drawer Closing & Reconciliation',
  description: 'Accurate closing ensures financial integrity and protects you and the practice.',
  steps: [
    {
      number: 1,
      title: 'Count Cash',
      details: [
        'Count all cash by denomination',
        'Separate starting cash from daily collections',
        'Count twice to verify accuracy',
      ],
    },
    {
      number: 2,
      title: 'Calculate Daily Cash Collections',
      details: [
        'Total cash in drawer',
        'Minus starting cash amount',
        'Equals daily cash collections',
      ],
      callout: {
        type: 'info',
        text: 'Example: $350 total - $100 starting cash = $250 daily collections',
      },
    },
    {
      number: 3,
      title: 'Reconcile with System',
      details: [
        'Run end-of-day cash payment report',
        'Compare physical cash to system total',
        'Document any discrepancies',
      ],
      callout: {
        type: 'warning',
        text: 'Investigate discrepancies immediately. Common causes: missed receipt entry, voided transaction, incorrect change.',
      },
    },
    {
      number: 4,
      title: 'Reconcile Checks',
      details: [
        'Count all checks received',
        'Match each check to system entries',
        'Verify amounts match',
        'Ensure all checks are endorsed',
        'List checks on deposit log',
      ],
    },
    {
      number: 5,
      title: 'Reconcile Card Payments',
      details: [
        'Review credit/debit payment report',
        'Match to card terminal batch',
        'Close/settle batch for the day',
        'Verify totals match between systems',
        'Note any declined or failed transactions',
      ],
    },
    {
      number: 6,
      title: 'Document & Secure',
      details: [
        'Complete cash closing log with totals',
        'Note date, time, your name',
        'Have supervisor review and sign',
        'Return starting cash to drawer',
        'Lock drawer in safe/secure location',
        'Store logs per policy',
      ],
    },
  ],
  quickReference: [
    'Count all cash by denomination twice',
    'Separate starting cash from daily collections',
    'Match physical cash to system report',
    'Reconcile checks and card payments separately',
    'Close/settle card terminal batch',
    'Document discrepancies and investigate',
    'Get supervisor signature on closing log',
    'Secure drawer in safe',
  ],
};

export const eodReconciliationSOP: SOPContent = {
  id: 'sop-eod-reconciliation',
  slug: 'eod-reconciliation',
  title: 'End-of-Day Reconciliation & Deposit',
  description: 'Daily financial reconciliation ensures accurate records and prepares deposits.',
  steps: [
    {
      number: 1,
      title: 'Run Daily Reports',
      details: [
        'Generate end-of-day payment report from system',
        'Print or export report showing all payment types',
        'Review total collections by payment method (cash, check, card)',
        'Note number of transactions per payment type',
        'Check for any voided or refunded transactions',
      ],
    },
    {
      number: 2,
      title: 'Reconcile Cash',
      details: [
        'Count physical cash in drawer',
        'Compare to cash payment total in system',
        'Document any overages or shortages',
        'Investigate discrepancies immediately',
        'Complete cash reconciliation form',
      ],
    },
    {
      number: 3,
      title: 'Reconcile Checks',
      details: [
        'Count all physical checks received',
        'Match each check to system entries',
        'Verify check amounts match system records',
        'Ensure all checks are properly endorsed',
        'List checks individually on deposit slip or log',
      ],
      callout: {
        type: 'tip',
        text: 'Endorse checks immediately when received: "For Deposit Only" + account number.',
      },
    },
    {
      number: 4,
      title: 'Reconcile Card Payments',
      details: [
        'Review credit/debit card payment report',
        'Match to card terminal batch report',
        'Ensure batch was closed/settled for the day',
        'Verify totals match between systems',
        'Note any declined or failed transactions',
      ],
    },
    {
      number: 5,
      title: 'Prepare Bank Deposit',
      details: [
        'Complete deposit slip with cash and check totals',
        'Organize checks with deposit slip',
        'Use tamper-evident deposit bag if available',
        'Record deposit amount and date on tracking log',
        'Obtain supervisor signature on deposit documentation',
      ],
      callout: {
        type: 'info',
        text: 'Keep a copy of the deposit slip for your records before sending to bank.',
      },
    },
    {
      number: 6,
      title: 'Final Documentation',
      details: [
        'File all daily reconciliation reports together',
        'Make copies of deposit documentation',
        'Store original reports per clinic policy',
        'Note any follow-up items needed for next day',
        'Communicate any issues to supervisor',
      ],
    },
  ],
  quickReference: [
    'Run end-of-day payment reports',
    'Reconcile cash, checks, and cards separately',
    'Match physical amounts to system totals',
    'Investigate any discrepancies',
    'Prepare deposit with cash and checks',
    'Close card terminal batch',
    'Get supervisor signature',
    'File all reconciliation documentation',
  ],
};

// ============================================
// OFFICE ADMINISTRATION SOPs - ADMIN TASKS
// ============================================

export const noShowLettersSOP: SOPContent = {
  id: 'sop-no-show-letters',
  slug: 'no-show-letters',
  title: 'No-Show Letters',
  description: 'Formal documentation of no-show occurrences per clinic policy.',
  steps: [
    {
      number: 1,
      title: 'Determine When to Send',
      details: [
        'Per clinic policy (example):',
        'First no-show: Phone call only (documented)',
        'Second no-show: Warning letter',
        'Third no-show: Final warning / potential dismissal letter',
      ],
      callout: {
        type: 'info',
        text: 'Every clinic has different policies. Know your clinic\'s specific no-show policy and follow it consistently.',
      },
    },
    {
      number: 2,
      title: 'Generate Letter',
      details: [
        'Use clinic-approved template including:',
        'Patient name and address',
        'Date of missed appointment(s)',
        'Clinic no-show policy',
        'Consequences of future no-shows',
        'Instructions for rescheduling',
        'Contact information',
      ],
    },
    {
      number: 3,
      title: 'Send Letter',
      details: [
        'Print on clinic letterhead',
        'First class mail for warnings',
        'Certified mail for dismissal letters (per policy)',
        'Keep copy for chart',
      ],
      callout: {
        type: 'warning',
        text: 'Dismissal letters should always go certified mail with return receipt to document delivery.',
      },
    },
    {
      number: 4,
      title: 'Document',
      details: [
        'Note in patient chart: Date letter sent, type of letter',
        'Scan copy of letter to chart',
        'Update no-show count',
        'Flag for follow-up if needed',
      ],
    },
  ],
  quickReference: [
    'Check clinic policy for when letters are required',
    'Use approved letter templates',
    'Include missed dates, policy, and rescheduling info',
    'Print on clinic letterhead',
    'Use certified mail for dismissal letters',
    'Scan copy to patient chart',
    'Update no-show count in record',
  ],
};

export const orderingSuppliesSOP: SOPContent = {
  id: 'sop-ordering-supplies',
  slug: 'ordering-supplies',
  title: 'Ordering Front Office Supplies',
  description: 'Maintaining adequate supplies ensures uninterrupted office operations.',
  steps: [
    {
      number: 1,
      title: 'Monitor Inventory',
      details: [
        'Check supply levels weekly',
        'Note items running low',
        'Maintain par levels for essential items',
        'Common supplies: Paper, pens, highlighters, staplers, patient forms, appointment cards, clipboards, receipt paper, toner/ink, envelopes, stamps',
      ],
      callout: {
        type: 'tip',
        text: 'Set a recurring calendar reminder to check supplies every Monday or Friday.',
      },
    },
    {
      number: 2,
      title: 'Submit Order Request',
      details: [
        'Complete supply order form',
        'Get supervisor approval if required',
        'Submit to appropriate person/vendor',
        'Note expected delivery date',
      ],
    },
    {
      number: 3,
      title: 'Receive & Stock',
      details: [
        'Check delivery against order',
        'Report discrepancies immediately',
        'Stock supplies in designated locations',
        'Rotate stock (first in, first out)',
        'Update inventory log if used',
      ],
      callout: {
        type: 'info',
        text: 'FIFO (First In, First Out) prevents supplies from expiring or becoming outdated.',
      },
    },
  ],
  quickReference: [
    'Check supply levels weekly',
    'Maintain par levels for essentials',
    'Complete order form with supervisor approval',
    'Verify deliveries against order',
    'Stock using FIFO (first in, first out)',
    'Report discrepancies immediately',
  ],
};

export const monthlyComplianceLogsSOP: SOPContent = {
  id: 'sop-monthly-compliance',
  slug: 'monthly-compliance-logs',
  title: 'Monthly Compliance Logs',
  description: 'Required monthly documentation for regulatory compliance.',
  steps: [
    {
      number: 1,
      title: 'Credit Card Terminal Tampering Log',
      details: [
        'PURPOSE: PCI compliance requires monthly inspection of card terminals for tampering or skimming devices',
        'WHAT TO CHECK: Physical damage, loose or extra components, unusual attachments near card slot, cables normal/unaltered, serial number matches records',
      ],
      callout: {
        type: 'warning',
        text: 'If tampering is suspected: Do NOT use terminal, report to supervisor immediately, contact terminal provider, document incident.',
      },
    },
    {
      number: 2,
      title: 'Document Terminal Inspection',
      details: [
        'Date of inspection',
        'Terminal location/ID',
        'Inspector name',
        'Findings (normal or concerns)',
        'Action taken if concerns found',
      ],
    },
    {
      number: 3,
      title: 'Other Monthly Logs',
      details: [
        'Refrigerator temperature logs (if vaccines stored)',
        'Emergency equipment checks',
        'Fire extinguisher inspections',
        'Safety checklist reviews',
        'Document all inspections per clinic policy',
      ],
      callout: {
        type: 'info',
        text: 'Keep compliance logs in a designated binder or electronic folder for easy access during audits.',
      },
    },
  ],
  quickReference: [
    'Inspect card terminals monthly for tampering',
    'Check for physical damage, loose parts, unusual attachments',
    'Verify serial numbers match records',
    'Complete temperature logs if applicable',
    'Document fire extinguisher inspections',
    'Store logs in compliance binder for audits',
  ],
};

// ============================================
// EXPORT ALL SOPs
// ============================================

export const allSOPs: Record<string, SOPContent> = {
  // Workflow SOPs (Before Visit)
  'new-patient-registration-sop': newPatientRegistrationSOP,
  'existing-patient-scheduling-sop': existingPatientSchedulingSOP,
  'reminder-calls-sop': reminderCallsSOP,
  // Workflow SOPs (During Visit)
  'patient-check-in': newPatientCheckInSOP,
  'existing-patient-check-in': existingPatientCheckInSOP,
  'urgent-walk-in-check-in': urgentWalkInCheckInSOP,
  'patient-check-out': patientCheckOutSOP,
  // Workflow SOPs (Throughout Day)
  'no-shows-late-arrivals': noShowsLateArrivalsSOP,
  'waitlists-same-day': waitlistsSameDaySOP,
  'balancing-tasks': balancingTasksSOP,
  // Administration SOPs (Opening)
  'phone-system-login': phoneSystemLoginSOP,
  'cash-drawer-opening': cashDrawerOpeningSOP,
  'pre-scrubbing-schedule': preScrubbingScheduleSOP,
  // Administration SOPs (Closing)
  'cash-drawer-closing': cashDrawerClosingSOP,
  'eod-reconciliation': eodReconciliationSOP,
  // Administration SOPs (Admin Tasks)
  'no-show-letters': noShowLettersSOP,
  'ordering-supplies': orderingSuppliesSOP,
  'monthly-compliance-logs': monthlyComplianceLogsSOP,
};

export function getSOPBySlug(slug: string): SOPContent | undefined {
  return allSOPs[slug];
}
