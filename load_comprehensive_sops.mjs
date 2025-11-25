import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const sopsData = [
  {
    slug: 'newpatientreg',
    title: 'New Patient Registration & Scheduling',
    icon: '📞',
    description: 'Complete phone-based workflow for registering and scheduling new patients',
    sort_order: 1,
    category: 'scheduling',
    patient_type: 'new',
    steps: [
      {
        title: "Determine if Patient is New or Existing",
        details: [
          "Ask: 'Have you been seen at [Clinic Name] before?'",
          "If they say no or unsure, proceed to search system",
          "If they say yes, transfer to existing patient scheduling workflow"
        ]
      },
      {
        title: "Search System to Prevent Duplicate Records",
        details: [
          "CRITICAL: Search before creating new patient record",
          "Search by: Last Name, First Name, and Date of Birth",
          "Check for spelling variations (Smith vs. Smyth, Jon vs. John)",
          "Check for maiden names or previous married names",
          "Search by phone number if name search unclear",
          "If patient found: Use existing record and proceed as established patient",
          "If NOT found after thorough search: Proceed with registration"
        ]
      },
      {
        title: "Collect Patient Demographics",
        details: [
          "Legal full name (First, Middle, Last) - ask them to spell it",
          "Date of birth (MM/DD/YYYY)",
          "Social Security Number (optional but helpful for billing)",
          "Current address (street, city, state, ZIP)",
          "Primary phone number",
          "Email address (for appointment reminders and communication)",
          "Emergency contact name, relationship, and phone number",
          "Preferred language"
        ]
      },
      {
        title: "Collect Insurance Information",
        details: [
          "Ask: 'Do you have health insurance?'",
          "If yes: Collect insurance company name and member ID over phone",
          "Inform: 'Please bring your insurance card and ID to your appointment'",
          "If your clinic has pre-visit electronic intake: 'You can also upload your insurance card through the link we'll send you'",
          "If no insurance: Note as self-pay"
        ]
      },
      {
        title: "Quick Insurance Verification (Check if Accepted)",
        details: [
          "Run quick eligibility check to confirm insurance is accepted by clinic",
          "Verify plan is active and patient is covered",
          "If insurance not accepted or not active: Inform patient they'll be self-pay",
          "Note: Full verification with copay details will be done 48-72 hours before appointment",
          "Document basic verification in system"
        ]
      },
      {
        title: "Determine Appointment Type & Check Schedule",
        details: [
          "Ask: 'What is the reason for your visit?'",
          "Determine appropriate appointment type and length",
          "Ask about provider preference if applicable",
          "Check provider schedule for new patient slots (typically 30-60 minutes)",
          "Offer 2-3 available date/time options",
          "Book appointment with type marked as 'New Patient'"
        ]
      },
      {
        title: "Confirm Appointment & Provide Instructions",
        details: [
          "Confirm: '[Day], [Date] at [Time] with [Provider Name]'",
          "Provide clinic address and parking instructions",
          "Instruct: 'Please arrive 10-15 minutes early to complete paperwork'",
          "Inform what to bring: Photo ID, insurance card(s), current medication list, copay",
          "If applicable: 'We'll send you a link to complete forms electronically before your visit'",
          "If copay amount known: 'Your copay will be $[amount], due at check-in'"
        ]
      },
      {
        title: "Set Up Appointment Reminders",
        details: [
          "Enter appointment in system",
          "Set automatic appointment reminders per clinic protocol",
          "Confirm patient's preferred contact method for reminders",
          "Mention cancellation policy: '24-hour notice required for cancellations'"
        ]
      },
      {
        title: "Send Pre-Visit Forms (If Applicable)",
        details: [
          "If clinic uses electronic pre-visit intake: Send portal invitation/forms link",
          "If not: Inform patient they'll complete forms at check-in",
          "Note in system if forms sent electronically"
        ]
      },
      {
        title: "Document Registration",
        details: [
          "Create new patient record in system immediately",
          "Enter all collected demographics",
          "Enter insurance information",
          "Flag as 'New Patient'",
          "Set reminder for full insurance verification 48-72 hours before visit",
          "Document date registered and who registered the patient",
          "Add any special notes (accessibility needs, interpreter, etc.)"
        ]
      }
    ]
  },
  {
    slug: 'existingpatientscheduling',
    title: 'Existing Patient Scheduling',
    icon: '📅',
    description: 'Phone-based workflow for scheduling appointments for established patients',
    sort_order: 2,
    category: 'scheduling',
    patient_type: 'existing',
    steps: [
      {
        title: "Verify Patient Identity",
        details: [
          "Ask: 'Can I have your full name and date of birth?'",
          "Search for patient in system",
          "Confirm you have correct patient record"
        ]
      },
      {
        title: "Confirm Current Contact Information",
        details: [
          "Ask: 'Is your phone number still [number]?'",
          "Ask: 'Is your address still [address]?'",
          "Update any changes in system immediately",
          "Verify email address if used for communications"
        ]
      },
      {
        title: "Ask About Insurance Changes",
        details: [
          "Ask: 'Is your insurance still [Insurance Name]?'",
          "If changed: Collect new insurance information",
          "Inform: 'Please bring your new insurance card to your appointment'",
          "Note in system if insurance changed"
        ]
      },
      {
        title: "Determine Appointment Need",
        details: [
          "Ask: 'What is the reason for your visit?'",
          "Determine if follow-up, routine visit, or new issue",
          "Check if specific provider requested",
          "Assess urgency"
        ]
      },
      {
        title: "Check Schedule & Book Appointment",
        details: [
          "Search schedule for available slots",
          "Consider appointment type and length needed",
          "Offer 2-3 date/time options",
          "Book appointment in system with correct type"
        ]
      },
      {
        title: "Confirm Appointment Details",
        details: [
          "Confirm: '[Day], [Date] at [Time] with [Provider]'",
          "Remind about clinic location if applicable",
          "If copay known: 'Your copay is $[amount], due at check-in'",
          "Ask: 'Does that work for you?'"
        ]
      },
      {
        title: "Set Appointment Reminders",
        details: [
          "Verify reminder preferences haven't changed",
          "Set automatic reminders per clinic protocol",
          "Mention cancellation policy if new or changed"
        ]
      },
      {
        title: "Document Scheduling",
        details: [
          "Update appointment in system",
          "Note reason for visit",
          "Document any information changes",
          "Set insurance re-verification reminder if insurance changed or last visit was >30 days ago"
        ]
      }
    ]
  },
  {
    slug: 'newpatientcheckin',
    title: 'New Patient Check-In (Scheduled Appointment)',
    icon: '👋',
    description: 'Comprehensive check-in process for new patients with scheduled appointments',
    sort_order: 3,
    category: 'checkin',
    patient_type: 'new',
    steps: [
      {
        title: "Greet Patient Warmly",
        details: [
          "Stand or make eye contact and smile",
          "Say: 'Good morning/afternoon! Welcome to [Clinic name]'",
          "Ask: 'Is this your first visit with us?'",
          "If yes: 'Welcome! I'll get you checked in'",
          "Offer seat at check-in desk or private area"
        ]
      },
      {
        title: "Verify Patient Identity",
        details: [
          "Ask: 'Can I see your ID and insurance card please?'",
          "Check photo ID matches patient in front of you",
          "Verify name spelling matches registration",
          "Confirm date of birth verbally",
          "Check that insurance card matches what's in system",
          "If discrepancy, ask: 'Has anything changed since you registered?'"
        ]
      },
      {
        title: "Scan/Copy ID and Insurance Cards",
        details: [
          "Make copies or scan front and back of ID",
          "Scan front and back of insurance card(s)",
          "If insurance card different from registration, update in system",
          "Upload images to patient's account",
          "Return original documents to patient immediately",
          "Note in system: 'ID and insurance cards scanned [date]'"
        ]
      },
      {
        title: "Quick Insurance Eligibility Confirmation",
        details: [
          "If insurance was verified 48-72 hours ago, just confirm it's still active",
          "Run quick eligibility check in system (takes 30-60 seconds)",
          "Verify coverage is active today",
          "Confirm patient has not changed insurance since verification",
          "If any issues appear, flag for billing team but proceed with check-in",
          "Note: Full verification already done, this is just confirmation"
        ]
      },
      {
        title: "Review & Collect Forms",
        details: [
          "Ask: 'Were you able to complete the forms we sent?'",
          "If completed electronically: Pull up in system to verify",
          "If not completed: Provide paper forms with clipboard",
          "Required forms: Medical history, current medications, allergies, HIPAA consent, financial policy, consent for treatment",
          "Review for completeness - all required fields filled out",
          "Check for patient signature and date on all consent forms",
          "If incomplete, ask patient to complete missing sections"
        ]
      },
      {
        title: "Confirm & Update Information",
        details: [
          "Verify address is still current",
          "Confirm phone numbers are correct",
          "Verify email address for communications",
          "Ask: 'Who should we contact in case of emergency?' (name, relationship, phone)",
          "Confirm preferred language and communication method",
          "Update any changed information in system immediately"
        ]
      },
      {
        title: "Collect Copay",
        details: [
          "State copay amount clearly: 'Your copay today is $[amount]'",
          "Explain: 'This is required by your insurance at time of service'",
          "Accept payment: cash, check, or card",
          "Process payment in system immediately",
          "Apply to today's date of service",
          "Generate and provide receipt",
          "Thank patient for payment"
        ]
      },
      {
        title: "Set Up Patient Portal Access",
        details: [
          "Ask: 'Have you activated your patient portal account?'",
          "If no: Provide login instructions or send activation email now",
          "Write down portal website URL on information sheet",
          "Explain portal features: view test results, message provider, request refills, schedule appointments",
          "Offer: 'Would you like me to show you how to log in?'",
          "Provide portal support phone number for technical issues"
        ]
      },
      {
        title: "Explain Clinic Policies",
        details: [
          "Office hours and how to reach clinic after hours",
          "Prescription refill process and timeline",
          "Cancellation policy: '24-hour notice required'",
          "No-show policy if applicable",
          "Patient portal usage for non-urgent questions",
          "Payment policy for outstanding balances",
          "Where to find patient resources or education materials"
        ]
      },
      {
        title: "Provide Clinic Information",
        details: [
          "Give patient folder or packet with clinic information",
          "Include: clinic contact information, provider bios, location map, parking info",
          "Provide information about other services offered",
          "Include patient rights and responsibilities document",
          "Give copy of financial policy and HIPAA notice if not in portal"
        ]
      },
      {
        title: "Orient to Facility",
        details: [
          "Point out restroom location",
          "Show where waiting area is",
          "Explain check-in process: 'Please have a seat and we'll call you back soon'",
          "Mention estimated wait time if known",
          "Explain they may be called to update vitals before seeing provider",
          "Point out water fountain or refreshments if available"
        ]
      },
      {
        title: "Final Check & Questions",
        details: [
          "Ask: 'Do you have any questions before you wait?'",
          "Confirm patient has everything they need",
          "Ensure patient knows they're welcome to ask staff for help",
          "Verify patient has all their personal belongings",
          "Direct patient to waiting area"
        ]
      },
      {
        title: "Notify Clinical Staff",
        details: [
          "Update patient status in system to 'Checked In'",
          "Alert clinical staff that new patient is ready",
          "Note any special circumstances (patient anxious, language barrier, etc.)",
          "Mention if patient has urgent concerns",
          "Flag if forms are incomplete or information is missing",
          "Document check-in time in system"
        ]
      },
      {
        title: "Document Check-In",
        details: [
          "Note in system: 'New patient check-in complete [date/time]'",
          "Document copay collected",
          "Note insurance verified at check-in",
          "Document that ID and insurance cards were scanned",
          "Note that all forms were collected and reviewed",
          "Flag any outstanding items for follow-up"
        ]
      }
    ]
  },
  {
    slug: 'existingpatientcheckin',
    title: 'Existing Patient Check-In (Scheduled Appointment)',
    icon: '✅',
    description: 'Streamlined check-in process for established patients',
    sort_order: 4,
    category: 'checkin',
    patient_type: 'existing',
    steps: [
      {
        title: "Greet Patient",
        details: [
          "Greet by name if you recognize them: 'Good morning, Mr./Ms. [Name]'",
          "Make eye contact and smile",
          "Say: 'I'll get you checked in'",
          "Keep process brief and efficient for established patients"
        ]
      },
      {
        title: "Verify Patient Identity",
        details: [
          "Confirm name and date of birth verbally",
          "Pull up patient account in system",
          "Verify you have correct patient record",
          "Check for any alerts or flags on account (outstanding balance, special needs, etc.)"
        ]
      },
      {
        title: "Ask About Changes to Information",
        details: [
          "Ask: 'Has anything changed since your last visit?'",
          "Specifically ask about: address, phone number, email, insurance",
          "If yes to any: 'What has changed?'",
          "Request updated insurance card if insurance changed",
          "Update information in system immediately"
        ]
      },
      {
        title: "Verify/Update Insurance (If Applicable)",
        details: [
          "If insurance changed: Request new insurance card, scan front and back",
          "If same insurance: Visual check that card matches system",
          "If insurance not verified recently: Run quick eligibility check",
          "If last visit was >30 days ago: Consider re-verification",
          "Update system with any new insurance information",
          "Note verification date in system"
        ]
      },
      {
        title: "Check for Required Form Updates",
        details: [
          "Check if annual consent forms need renewal",
          "HIPAA acknowledgment may need annual signature",
          "Financial policy may need re-signing if updated",
          "Check if updated medical history is needed",
          "If forms needed: provide clipboard with forms",
          "Review for completeness and signature"
        ]
      },
      {
        title: "Collect Copay",
        details: [
          "State copay amount: 'Your copay today is $[amount]'",
          "If copay changed: Explain why (plan change, visit type, etc.)",
          "Accept payment: cash, check, or card",
          "Process payment in system",
          "Apply to today's date of service",
          "Provide receipt",
          "Thank patient"
        ]
      },
      {
        title: "Address Outstanding Balances",
        details: [
          "If patient has outstanding balance, mention it: 'You have a balance of $[amount] from [previous visit]'",
          "Ask: 'Would you like to make a payment toward that today?'",
          "Accept payment if offered",
          "If unable to pay: Mention payment plan options",
          "Don't delay check-in for old balances - handle at checkout or later",
          "Note any payment or payment plan discussion in system"
        ]
      },
      {
        title: "Confirm Appointment Details",
        details: [
          "Verify patient is there for correct appointment type",
          "Confirm provider name if patient asks",
          "Mention estimated wait time if asked",
          "Note if patient arrived late (may affect ability to be seen)"
        ]
      },
      {
        title: "Update Patient Status & Notify Staff",
        details: [
          "Mark patient as 'Checked In' in system",
          "Note check-in time",
          "Alert clinical staff that patient is ready",
          "Communicate any special circumstances or urgency",
          "Direct patient to waiting area"
        ]
      },
      {
        title: "Quick Documentation",
        details: [
          "Note in system: 'Patient checked in [date/time]'",
          "Document copay collected",
          "Note any information updates",
          "Document insurance verification if done",
          "Flag any issues for follow-up"
        ]
      }
    ]
  },
  {
    slug: 'urgentcarecheckin',
    title: 'Urgent Care / Same-Day / Walk-In Check-In',
    icon: '🚨',
    description: 'Rapid check-in protocol for urgent, same-day, and walk-in patients',
    sort_order: 5,
    category: 'checkin',
    patient_type: 'both',
    steps: [
      {
        title: "Immediate Triage & Safety Assessment",
        details: [
          "Greet immediately: 'Hello, how can I help you?'",
          "Ask: 'What brings you in today?'",
          "Assess urgency: Is this life-threatening? Severe pain? Difficulty breathing?",
          "If life-threatening: Call for clinical staff or 911 immediately",
          "If urgent but stable: Proceed with expedited check-in",
          "If routine: Explain process and expected wait time"
        ]
      },
      {
        title: "Determine New vs. Existing Patient",
        details: [
          "Ask: 'Have you been seen here before?'",
          "If existing: Search for patient in system by name and DOB",
          "If new: Begin rapid registration process",
          "If unsure: Search thoroughly before creating duplicate record"
        ]
      },
      {
        title: "Rapid Registration (New Patients Only)",
        details: [
          "Collect essential information only - full registration can happen later",
          "Legal name, date of birth, address, phone number",
          "Emergency contact name and number",
          "Chief complaint (brief)",
          "Current medications and allergies (critical for safety)",
          "Create patient account with minimal required fields",
          "Note: 'Urgent walk-in - full registration pending'"
        ]
      },
      {
        title: "Collect ID & Insurance Card",
        details: [
          "Request photo ID and insurance card",
          "Scan or make copies quickly",
          "If patient doesn't have cards: Note this and proceed anyway",
          "Can obtain later if needed - don't delay urgent care",
          "Return originals to patient immediately"
        ]
      },
      {
        title: "Run Insurance Eligibility Check (At Check-In)",
        details: [
          "THIS IS CRITICAL: No pre-verification was done, so check NOW",
          "Run real-time eligibility check in system",
          "Verify coverage is active today",
          "Check if referral or authorization required for urgent care",
          "Note copay amount if system provides it",
          "If eligibility system is down: Proceed and verify later, note in account",
          "Document verification attempt and results"
        ]
      },
      {
        title: "Determine Financial Responsibility",
        details: [
          "If insurance active: Inform copay amount if known",
          "If insurance inactive or no coverage: Explain self-pay status",
          "Urgent care copays are often higher than primary care",
          "State: 'Your copay for urgent care today is $[amount]'",
          "If self-pay: Provide estimate and payment options",
          "Some clinics require deposit for self-pay urgent visits"
        ]
      },
      {
        title: "Collect Copay or Deposit",
        details: [
          "Collect copay if insurance verified and patient able to pay",
          "If self-pay: Collect deposit or full estimated payment per clinic policy",
          "If patient unable to pay: Follow clinic policy (may still treat, set up payment plan, etc.)",
          "Process payment in system",
          "Provide receipt",
          "Don't delay urgent care for payment if patient is in distress"
        ]
      },
      {
        title: "Essential Consents Only",
        details: [
          "Consent for treatment (required)",
          "HIPAA notice acknowledgment (required)",
          "Financial responsibility (if time permits)",
          "Skip non-essential forms - can be completed after care",
          "Obtain signature quickly",
          "Provide copies if possible or note they'll be sent later"
        ]
      },
      {
        title: "Brief Medical History",
        details: [
          "Chief complaint in patient's words",
          "Current medications (write down or have patient provide list)",
          "Known drug allergies - THIS IS CRITICAL",
          "Relevant chronic conditions",
          "Recent similar episodes or related care",
          "Enter into system or provide to clinical staff on paper"
        ]
      },
      {
        title: "Alert Clinical Staff Immediately",
        details: [
          "Update patient status to 'Checked In - Urgent'",
          "Notify nurse or MA immediately - don't wait",
          "Communicate severity level and chief complaint",
          "Provide any critical medical information (allergies, current meds)",
          "If very urgent: Walk patient back to clinical area or exam room yourself",
          "Document check-in time and urgency level"
        ]
      },
      {
        title: "Set Expectations with Patient",
        details: [
          "Explain: 'A nurse will be with you shortly to assess you'",
          "Provide estimated wait time if possible (often can't in urgent situations)",
          "Direct to waiting area or directly to exam room depending on severity",
          "Explain they may need to wait for test results, x-rays, etc.",
          "Provide restroom location",
          "Ask them to alert staff if condition worsens while waiting"
        ]
      },
      {
        title: "Complete Registration After Initial Care (If Time)",
        details: [
          "Once patient is stable and being treated, complete full registration",
          "Fill in any missing demographic information",
          "Scan all documents that weren't captured initially",
          "Complete full insurance verification if not done at check-in",
          "Have patient sign any remaining consent forms",
          "Update account from 'partial registration' to 'complete'"
        ]
      },
      {
        title: "Document Thoroughly",
        details: [
          "Note: 'Urgent care walk-in - checked in [time]'",
          "Document chief complaint and urgency level",
          "Note if insurance verified or pending verification",
          "Document payment collected or self-pay status",
          "Note if full registration is pending",
          "Flag account for follow-up on any missing information",
          "Document all communication with clinical staff"
        ]
      }
    ]
  },
  {
    slug: 'schedulingfollowups',
    title: 'Scheduling Follow-Ups & Recalls',
    icon: '🔄',
    description: 'Managing follow-up appointments and patient recall systems',
    sort_order: 6,
    category: 'scheduling',
    patient_type: 'existing',
    steps: [
      {
        title: "Determine Scheduling Need",
        details: [
          "Check provider's notes for follow-up instructions",
          "Confirm time frame (days, weeks, months)",
          "Note specific provider or department requested",
          "Check if any special appointment type is needed"
        ]
      },
      {
        title: "Schedule Follow-Up Appointment",
        details: [
          "Open scheduling system calendar",
          "Select appropriate provider/department",
          "Find available date within requested time frame",
          "Choose appropriate appointment type/duration",
          "Book appointment with patient agreement"
        ]
      },
      {
        title: "Confirm Appointment with Patient",
        details: [
          "State appointment date, day, and time clearly",
          "Confirm patient has written down or received details",
          "Provide appointment card or printed confirmation",
          "Ask for preferred reminder method (call, text, email)"
        ]
      },
      {
        title: "Enter Appointment Reminders",
        details: [
          "Set system to send reminder 48-72 hours before",
          "Confirm patient's phone and email are current",
          "Note any special instructions for appointment prep",
          "Document if patient declines reminders"
        ]
      },
      {
        title: "If Patient Declines to Schedule",
        details: [
          "Explain importance of follow-up care",
          "Offer future scheduling: 'Would you like me to call you in [X] weeks?'",
          "Document in chart that patient declined appointment",
          "Place patient on recall list for future outreach",
          "Provide clinic contact info for self-scheduling later"
        ]
      },
      {
        title: "Recall Management",
        details: [
          "Review recall list weekly",
          "Contact patients who are due for routine care",
          "Use phone, mail, or patient portal messaging",
          "Document all outreach attempts",
          "Update recall status once appointment is scheduled",
          "Follow clinic policy for number of contact attempts"
        ]
      }
    ]
  },
  {
    slug: 'noshow',
    title: 'Handling No-Shows and Late Arrivals',
    icon: '⏰',
    description: 'Procedures for managing late arrivals, no-shows, and schedule optimization',
    sort_order: 7,
    category: 'scheduling',
    patient_type: 'both',
    steps: [
      {
        title: "Monitor Appointment Schedule",
        details: [
          "Review daily schedule at start of shift",
          "Note appointments with history of no-shows or late arrivals",
          "Confirm all appointments have been reminded (call, text, email)",
          "Flag high-priority or new patient appointments"
        ]
      },
      {
        title: "When Patient is Late (Within Tolerance)",
        details: [
          "Greet patient professionally without expressing frustration",
          "Check in patient promptly",
          "Inform clinical staff of late arrival immediately",
          "Ask clinical team if patient can still be seen or needs rescheduling",
          "If seen, explain there may be reduced appointment time",
          "Document arrival time in system"
        ]
      },
      {
        title: "When Patient is Too Late (Exceeds Policy)",
        details: [
          "Greet patient warmly but explain clinic policy",
          "State: 'Our policy requires arrival [X] minutes before appointment time'",
          "Apologize that provider cannot see them today",
          "Offer to reschedule at next available time",
          "Remind patient of importance of timely arrival",
          "Document late arrival and rescheduling in chart"
        ]
      },
      {
        title: "When Patient is a No-Show",
        details: [
          "Wait [X] minutes past appointment time per clinic policy (typically 10-15 minutes)",
          "Attempt to contact patient by phone",
          "Leave voicemail if no answer: 'We missed you today for your [time] appointment'",
          "Mark appointment as 'No-Show' in scheduling system",
          "Send follow-up message via patient portal or text if available",
          "Note no-show in patient's chart"
        ]
      },
      {
        title: "Apply No-Show Policy",
        details: [
          "Document no-show count in patient record",
          "If first no-show, reschedule with reminder about clinic policy",
          "If second no-show, inform patient of policy consequences",
          "If third no-show (or per policy), may require deposit for future appointments",
          "Follow clinic's progressive policy (warnings, fees, dismissal)",
          "Always document policy discussions in chart"
        ]
      },
      {
        title: "Fill Cancelled/No-Show Slots",
        details: [
          "Check waitlist for patients wanting earlier appointments",
          "Contact waitlist patients immediately",
          "Offer same-day or next available slot",
          "Prioritize urgent needs or established patients",
          "Update schedule and remove from waitlist if accepted",
          "Keep backup list of patients who can come on short notice"
        ]
      },
      {
        title: "Communicate with Clinical Team",
        details: [
          "Notify provider/clinical staff of no-show as soon as confirmed",
          "Update schedule board or status system",
          "Discuss if provider can see walk-ins or waitlist patients",
          "Help manage provider's time efficiently with unexpected gaps",
          "Document all schedule changes"
        ]
      },
      {
        title: "Document and Report",
        details: [
          "Track no-show rates by provider, day, and time",
          "Report patterns to office manager (e.g., frequent no-shows on Mondays)",
          "Identify patients with chronic no-show behavior",
          "Suggest improvements to reduce no-shows (better reminders, policy changes)",
          "Keep records for billing or dismissal documentation if needed"
        ]
      }
    ]
  },
  {
    slug: 'waitlist',
    title: 'Managing Waitlists and Same-Day Add-Ons',
    icon: '📝',
    description: 'Strategies for waitlist management and handling same-day appointment requests',
    sort_order: 8,
    category: 'scheduling',
    patient_type: 'both',
    steps: [
      {
        title: "Create and Maintain Waitlist",
        details: [
          "Start waitlist when patient requests earlier appointment than available",
          "Record patient's name, contact number, current appointment date/time",
          "Note preferred days/times and provider preference",
          "Ask: 'How much notice do you need?' (same-day, 24 hours, etc.)",
          "Document reason for visit or urgency level",
          "Update waitlist daily and remove patients who no longer need earlier slots"
        ]
      },
      {
        title: "Prioritize Waitlist",
        details: [
          "Urgent medical needs go first",
          "Established patients before new patients (per clinic policy)",
          "Consider time on waitlist (first-come, first-served within priority levels)",
          "Note patients who can accommodate short notice",
          "Flag any patients with special needs or accommodations"
        ]
      },
      {
        title: "When a Slot Opens",
        details: [
          "Immediately review waitlist for appropriate matches",
          "Consider appointment type and duration needed",
          "Check if provider specialty matches patient need",
          "Contact highest priority patient first",
          "Call patient: 'We have an opening for [date/time]. Can you make it?'",
          "Give patient reasonable time to respond (5-10 minutes) before moving to next"
        ]
      },
      {
        title: "Confirm Waitlist Appointment",
        details: [
          "If patient accepts, book appointment immediately",
          "Cancel or move their original later appointment",
          "Send confirmation via text/email if possible",
          "Remove patient from waitlist",
          "Update schedule and notify clinical staff of addition",
          "Document who was offered slot and outcome"
        ]
      },
      {
        title: "Handling Same-Day Add-On Requests",
        details: [
          "Ask about reason for visit and urgency",
          "Determine if truly urgent or can wait for regular appointment",
          "Check with clinical staff/provider: 'Do we have capacity for add-on?'",
          "Review provider's schedule for gaps or flexibility",
          "Consider: lunch breaks, end of day slots, cancellations",
          "Be honest about wait time if adding to schedule"
        ]
      },
      {
        title: "Assess Appropriateness of Add-On",
        details: [
          "Is this a true medical urgency or convenience request?",
          "Can issue be handled via telehealth or nurse triage instead?",
          "Does patient need to be seen today or is it preference?",
          "Would urgent care or ER be more appropriate?",
          "Is this an established patient with history at your clinic?",
          "Will add-on significantly delay other patients?"
        ]
      },
      {
        title: "Approve or Decline Add-On",
        details: [
          "If approved: Add to schedule, inform clinical team, set expectations for wait time",
          "If declined: Explain kindly: 'We're fully booked, but I have [next available]'",
          "Offer next available appointment or waitlist option",
          "Provide alternative resources if urgent (urgent care, telehealth, nurse line)",
          "Offer to have nurse call back for clinical triage if appropriate",
          "Always document decision and reason in patient record"
        ]
      },
      {
        title: "Communicate with Clinical Team",
        details: [
          "Alert provider immediately of any add-ons",
          "Provide patient name, reason for visit, and urgency",
          "Discuss expected impact on schedule and other patients",
          "Get approval before confirming with patient",
          "Update schedule board and patient status systems",
          "Help manage patient flow to minimize delays"
        ]
      }
    ]
  },
  {
    slug: 'checkout',
    title: 'Patient Check-Out Procedures',
    icon: '🚪',
    description: 'Complete checkout workflow including scheduling, payments, and follow-up',
    sort_order: 9,
    category: 'checkout',
    patient_type: 'both',
    steps: [
      {
        title: "Review Visit Summary",
        details: [
          "Obtain checkout paperwork from clinical staff",
          "Review provider's follow-up instructions",
          "Note any prescriptions sent or given",
          "Check for lab/imaging orders that need scheduling"
        ]
      },
      {
        title: "Schedule Follow-Up Appointments",
        details: [
          "Ask patient: 'The doctor would like to see you back in [X] weeks/months'",
          "Open schedule and find suitable appointment",
          "Confirm date and time with patient",
          "Provide appointment card or printed confirmation",
          "Set up appointment reminders"
        ]
      },
      {
        title: "Schedule Additional Services",
        details: [
          "If labs ordered, schedule or provide lab slip",
          "If imaging ordered, provide referral/order forms",
          "If specialist referral needed, provide contact information or schedule",
          "Explain any prep requirements for scheduled procedures"
        ]
      },
      {
        title: "Collect Outstanding Balances",
        details: [
          "Review patient account for today's charges",
          "Inform patient of any balance due from today's visit",
          "Collect co-insurance or deductible amount if known",
          "Address any previous outstanding balances",
          "Process payment if patient is able to pay"
        ]
      },
      {
        title: "Provide Superbills (If Applicable)",
        details: [
          "For out-of-network patients, provide detailed superbill",
          "Include CPT codes, diagnosis codes, provider info",
          "Explain how to submit to insurance for reimbursement"
        ]
      },
      {
        title: "Answer Questions",
        details: [
          "Ask: 'Do you have any questions about today's visit?'",
          "Clarify appointment times or instructions",
          "Provide contact information for billing questions",
          "Ensure patient knows how to reach clinic if concerns arise"
        ]
      },
      {
        title: "Final Steps",
        details: [
          "Ensure patient has all paperwork and forms",
          "Hand patient any prescriptions or orders",
          "Thank patient for coming in",
          "Confirm next steps"
        ]
      }
    ]
  },
  {
    slug: 'multitasking',
    title: 'Balancing Phones, Messages, and Walk-Ins',
    icon: '🎯',
    description: 'Strategies for managing multiple demands and maintaining efficiency',
    sort_order: 10,
    category: 'during-day',
    patient_type: 'both',
    steps: [
      {
        title: "Prioritize Tasks by Urgency",
        details: [
          "Level 1 (Immediate): Patient in distress, emergency calls, provider urgent requests",
          "Level 2 (High): Scheduled patient check-in, patient checkout, time-sensitive calls",
          "Level 3 (Standard): General phone calls, message returns, administrative tasks",
          "Level 4 (Low): Filing, data entry, non-urgent emails",
          "Always address person in front of you before starting new task unless true emergency"
        ]
      },
      {
        title: "Managing Walk-In Patients",
        details: [
          "Greet walk-in immediately with eye contact and smile",
          "If busy, acknowledge: 'I'll be with you in just one moment'",
          "Finish current task or reach stopping point (usually within 2-3 minutes)",
          "Ask walk-in: 'How can I help you today?'",
          "Determine if urgent, scheduled, or can wait",
          "Process according to priority level"
        ]
      },
      {
        title: "Answering Phone Calls",
        details: [
          "Answer within 3 rings when possible",
          "If with walk-in patient, say: 'Excuse me one moment'",
          "Answer: '[Clinic name], this is [your name], how may I help you?'",
          "If genuinely cannot answer, let voicemail capture and return call within policy timeframe",
          "For brief questions, handle immediately",
          "For complex issues, take message or schedule call-back time"
        ]
      },
      {
        title: "When Interrupted by Phone While With Patient",
        details: [
          "Apologize to patient: 'Excuse me, I need to answer this quickly'",
          "Answer phone, assess urgency immediately",
          "If not urgent: 'May I get your name and call you back in 5 minutes?'",
          "If urgent: Handle call, then apologize to waiting patient",
          "Return to patient, summarize where you left off",
          "Complete patient interaction before making call-backs"
        ]
      },
      {
        title: "Processing Messages and Requests",
        details: [
          "Check message queue at designated times (start of shift, mid-morning, afternoon)",
          "Sort by urgency and date received",
          "Respond to time-sensitive messages first",
          "For prescription refills, forward to clinical team immediately",
          "For appointment requests, process during phone lulls",
          "For billing questions, respond or route to billing department",
          "Document all message responses in patient record"
        ]
      },
      {
        title: "Creating Workflow During Busy Times",
        details: [
          "Designate roles if multiple staff: one for check-in, one for phones",
          "Use 'batching': group similar tasks together during quieter moments",
          "Keep frequently needed information easily accessible",
          "Use templates for common responses to save time",
          "Communicate with team: 'I'm swamped, can you grab the phone?'",
          "Take brief notes on interruptions to return to tasks efficiently"
        ]
      },
      {
        title: "Maintaining Professionalism Under Pressure",
        details: [
          "Take a deep breath before greeting next patient/caller",
          "Never show frustration or stress to patients",
          "Speak clearly and calmly even when rushed",
          "If overwhelmed, it's okay to say: 'We're experiencing high volume today'",
          "Set realistic expectations for wait times or call-backs",
          "Ask for help from supervisor or colleagues when needed",
          "Remember: patients aren't aware of your other demands"
        ]
      },
      {
        title: "End of Day Task Management",
        details: [
          "Return all outstanding calls/messages before leaving",
          "If unable to complete, leave detailed notes for next shift",
          "Complete all patient check-ins and check-outs from the day",
          "Forward urgent matters to supervisor or on-call staff",
          "Update status on any ongoing tasks",
          "Prepare workspace for next shift",
          "Debrief with team about busy periods or issues"
        ]
      }
    ]
  },
  {
    slug: 'cashdrawer',
    title: 'Cash Drawer Management',
    icon: '💰',
    description: 'Opening, monitoring, and closing cash drawer procedures',
    sort_order: 11,
    category: 'opening-closing',
    patient_type: 'both',
    steps: [
      {
        title: "Opening Procedures - Morning Setup",
        details: [
          "Arrive at designated time before clinic opens",
          "Retrieve cash drawer from safe/secure location",
          "Count starting cash (bills and coins) with a witness if possible",
          "Record starting amount on cash log sheet",
          "Organize bills by denomination (largest to smallest)",
          "Ensure adequate change (ones, fives, quarters, etc.)",
          "Sign and date the opening log",
          "Secure log in designated location"
        ]
      },
      {
        title: "During Day - Transaction Handling",
        details: [
          "Keep large bills separate or deposit periodically",
          "Never leave drawer unattended when open",
          "Lock drawer when stepping away from desk",
          "Do not allow anyone else to access your drawer",
          "Count back change to patients",
          "Issue receipts for all cash transactions"
        ]
      },
      {
        title: "Closing Procedures - End of Day Count",
        details: [
          "Count all cash in drawer by denomination",
          "Separate starting cash from daily collections",
          "Calculate total collections (closing amount minus opening amount)",
          "Compare to system report of cash payments collected",
          "Document any overages or shortages",
          "Complete cash closing log with totals"
        ]
      },
      {
        title: "Reconciliation & Documentation",
        details: [
          "Match cash log to payment system report",
          "Investigate and document any discrepancies",
          "Return starting cash amount to drawer for next day",
          "Prepare deposit with daily collections",
          "Complete deposit slip with breakdown by denomination",
          "Have supervisor review and sign off on closing"
        ]
      },
      {
        title: "Secure Storage",
        details: [
          "Place drawer in safe or secure locked location",
          "Lock safe and verify it's secure",
          "Store all logs in designated secure area",
          "Do not leave cash or logs in plain sight",
          "Follow clinic's chain of custody procedures"
        ]
      }
    ]
  },
  {
    slug: 'eodreconciliation',
    title: 'End-of-Day Reconciliation & Deposit',
    icon: '📊',
    description: 'Daily financial reconciliation and deposit preparation procedures',
    sort_order: 12,
    category: 'closing',
    patient_type: 'both',
    steps: [
      {
        title: "Run Daily Reports",
        details: [
          "Generate end-of-day payment report from system",
          "Print or export report showing all payment types",
          "Review total collections by payment method (cash, check, card)",
          "Note number of transactions per payment type",
          "Check for any voided or refunded transactions"
        ]
      },
      {
        title: "Reconcile Cash",
        details: [
          "Count physical cash in drawer",
          "Compare to cash payment total in system",
          "Document any overages or shortages",
          "Investigate discrepancies immediately",
          "Complete cash reconciliation form"
        ]
      },
      {
        title: "Reconcile Checks",
        details: [
          "Count all physical checks received",
          "Match each check to system entries",
          "Verify check amounts match system records",
          "Ensure all checks are properly endorsed",
          "List checks individually on deposit slip or log"
        ]
      },
      {
        title: "Reconcile Card Payments",
        details: [
          "Review credit/debit card payment report",
          "Match to card terminal batch report",
          "Ensure batch was closed/settled for the day",
          "Verify totals match between systems",
          "Note any declined or failed transactions"
        ]
      },
      {
        title: "Prepare Bank Deposit",
        details: [
          "Complete deposit slip with cash and check totals",
          "Organize checks with deposit slip",
          "Use tamper-evident deposit bag if available",
          "Record deposit amount and date on tracking log",
          "Obtain supervisor signature on deposit documentation"
        ]
      },
      {
        title: "Final Documentation",
        details: [
          "File all daily reconciliation reports together",
          "Make copies of deposit documentation",
          "Store original reports per clinic policy",
          "Note any follow-up items needed for next day",
          "Communicate any issues to supervisor"
        ]
      }
    ]
  }
];

async function loadSOPs() {
  console.log('Starting SOP data load...');

  // Delete existing SOPs
  const { error: deleteError } = await supabase
    .from('sops')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (deleteError) {
    console.error('Error deleting existing SOPs:', deleteError);
    return;
  }

  console.log('Deleted existing SOPs');

  // Insert new SOPs
  for (const sop of sopsData) {
    const { error } = await supabase
      .from('sops')
      .insert(sop);

    if (error) {
      console.error(`Error inserting SOP ${sop.slug}:`, error);
    } else {
      console.log(`✓ Loaded: ${sop.title}`);
    }
  }

  console.log('\nSOP data load complete!');

  // Verify count
  const { count } = await supabase
    .from('sops')
    .select('*', { count: 'exact', head: true });

  console.log(`Total SOPs in database: ${count}`);
}

loadSOPs();
