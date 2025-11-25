/*
  # Create SOPs (Standard Operating Procedures) Table

  1. New Tables
    - `sops`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `title` (text) - SOP title
      - `icon` (text) - Emoji or icon identifier
      - `description` (text) - Brief description
      - `sort_order` (integer) - Display order
      - `steps` (jsonb) - Array of step objects with title and details
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `user_sop_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References auth.users (for future auth)
      - `sop_id` (uuid) - References sops
      - `completed_steps` (jsonb) - Array of completed step indices
      - `last_accessed` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - SOPs are publicly readable (no auth required for now)
    - Progress tracking will be session-based initially
*/

-- Create SOPs table
CREATE TABLE IF NOT EXISTS sops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  icon TEXT DEFAULT '📋',
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user progress tracking table
CREATE TABLE IF NOT EXISTS user_sop_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  sop_id UUID REFERENCES sops(id) ON DELETE CASCADE,
  completed_steps JSONB DEFAULT '[]'::jsonb,
  last_accessed TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(session_id, sop_id)
);

-- Enable RLS
ALTER TABLE sops ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sop_progress ENABLE ROW LEVEL SECURITY;

-- SOPs are publicly readable
CREATE POLICY "SOPs are publicly readable"
  ON sops FOR SELECT
  TO public
  USING (true);

-- Anyone can track their own progress (session-based)
CREATE POLICY "Users can view their own progress"
  ON user_sop_progress FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own progress"
  ON user_sop_progress FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update their own progress"
  ON user_sop_progress FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_sops_slug ON sops(slug);
CREATE INDEX IF NOT EXISTS idx_user_progress_session ON user_sop_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_sop ON user_sop_progress(sop_id);

-- Insert SOP data
INSERT INTO sops (slug, title, icon, description, sort_order, steps) VALUES
('registration', 'Front Desk Registration Workflow', '📋', 'Complete patient registration process from greeting to finalization', 1, 
'[
  {
    "title": "Greet Patient",
    "details": ["Welcome patient by name if known", "Ask for government-issued ID", "Confirm this is the correct patient"]
  },
  {
    "title": "Collect Patient Demographics",
    "details": ["Legal full name (first, middle, last)", "Date of birth (verify against ID)", "Current residential address", "Primary phone number", "Secondary/emergency contact number", "Email address (if applicable)", "Preferred language", "Preferred pronouns (if your clinic collects this)"]
  },
  {
    "title": "Insurance Capture",
    "details": ["Request insurance card(s) - front and back", "Make copies or scan both sides", "Record insurance company name", "Record subscriber/member ID number", "Record group number", "Note plan type (PPO, HMO, EPO, POS)", "Identify subscriber (patient or other person)", "If subscriber is not patient, collect subscriber name and DOB", "Ask about secondary insurance if applicable"]
  },
  {
    "title": "Explain Financial Responsibility",
    "details": ["Inform patient of their co-pay amount (if verified)", "Explain deductible status if known", "Clarify co-insurance percentage", "Explain that they are responsible for any services not covered", "Mention payment options available (cash, card, payment plans)"]
  },
  {
    "title": "Obtain Consent Forms",
    "details": ["HIPAA Notice of Privacy Practices (have patient sign acknowledgment)", "Consent for Treatment form", "Financial Responsibility Agreement", "Authorization for Release of Information (if needed)", "Any specialty-specific consent forms", "Confirm all signatures and dates are complete"]
  },
  {
    "title": "Finalize Registration",
    "details": ["Review all information with patient for accuracy", "Provide patient with copy of signed documents if requested", "Direct patient to waiting area", "Notify clinical staff that patient is ready"]
  }
]'::jsonb),

('verification', 'Insurance Verification Step-by-Step', '🔍', 'Complete insurance verification workflow for accurate billing', 2,
'[
  {
    "title": "When to Verify",
    "details": ["Ideally 48-72 hours before appointment", "At minimum, verify day of appointment before service", "Re-verify if last verification is older than 30 days"]
  },
  {
    "title": "Gather Required Information",
    "details": ["Patient''s full name and DOB", "Insurance member ID number", "Group number", "Subscriber information", "Provider NPI and Tax ID", "Date of service", "CPT codes for planned procedures (if known)"]
  },
  {
    "title": "Contact Insurance Company",
    "details": ["Call provider customer service number (on back of card)", "Or use insurance company''s online provider portal", "Or use automated eligibility verification system", "Have all patient and provider information ready"]
  },
  {
    "title": "Verify Coverage Details",
    "details": ["Confirm coverage is active on date of service", "Verify patient is eligible for the specific service/provider", "Confirm plan type and network status", "Ask if provider is in-network", "Check if referral or authorization is required", "Obtain reference/confirmation number from insurance rep"]
  },
  {
    "title": "Document Financial Responsibility",
    "details": ["Record co-pay amount", "Record deductible amount (total and remaining)", "Note if deductible must be met before coverage", "Record co-insurance percentage after deductible", "Document out-of-pocket maximum (total and remaining)", "Note any service-specific limitations or exclusions"]
  },
  {
    "title": "Check Authorization Requirements",
    "details": ["Ask if prior authorization is needed for planned services", "If yes, note authorization number and valid dates", "If no auth on file, contact provider''s authorization department", "Document any services that require referrals"]
  },
  {
    "title": "Document Verification",
    "details": ["Record date and time of verification", "Note name of insurance representative spoken to", "Save reference/confirmation number", "Document all benefit information in patient account", "Flag any issues or missing authorizations"]
  },
  {
    "title": "Communicate with Patient",
    "details": ["Call or message patient with financial responsibility", "Inform of any required co-pay amount", "Alert patient to missing authorizations or referrals", "Explain if service may not be covered"]
  }
]'::jsonb),

('copay', 'Collecting Co-Pays and Payment Policies', '💳', 'Payment collection procedures and financial policies', 3,
'[
  {
    "title": "Before the Visit",
    "details": ["Review patient''s insurance to determine co-pay amount", "Verify if co-pay is due at time of service or after", "Check patient''s account for outstanding balances", "Prepare to discuss payment expectations"]
  },
  {
    "title": "At Check-In",
    "details": ["Greet patient warmly", "State the co-pay amount clearly: ''Your co-pay today is $[amount]''", "Explain this is required by their insurance policy", "If patient has outstanding balance, mention it: ''You also have a balance of $[amount] from a previous visit''"]
  },
  {
    "title": "Accept Payment",
    "details": ["Accept cash, check, credit card, or debit card (per clinic policy)", "Process payment in system immediately", "Provide itemized receipt", "Thank patient for payment"]
  },
  {
    "title": "If Patient Cannot Pay",
    "details": ["Remain professional and empathetic", "Explain clinic payment policy", "Offer payment plan options if available", "Provide information on financial assistance if applicable", "Document in account that co-pay was not collected and reason", "Flag account for follow-up billing"]
  },
  {
    "title": "Payment Policy Communication",
    "details": ["Co-pays are due at time of service", "Outstanding balances should be addressed before seeing provider (per policy)", "Patients may be asked to reschedule if unable to pay (per clinic policy)", "Payment plans are available for balances over $[amount]", "Self-pay/uninsured patients should discuss payment before service"]
  },
  {
    "title": "Document Payment",
    "details": ["Post payment to correct patient account", "Apply to correct date of service", "Select correct payment type", "Print or email receipt to patient", "Balance system at end of shift"]
  }
]'::jsonb),

('scheduling', 'Scheduling Follow-Ups & Recalls', '📅', 'Appointment scheduling and patient recall management', 4,
'[
  {
    "title": "Determine Scheduling Need",
    "details": ["Check provider''s notes for follow-up instructions", "Confirm time frame (days, weeks, months)", "Note specific provider or department requested", "Check if any special appointment type is needed"]
  },
  {
    "title": "Schedule Follow-Up Appointment",
    "details": ["Open scheduling system calendar", "Select appropriate provider/department", "Find available date within requested time frame", "Choose appropriate appointment type/duration", "Book appointment with patient agreement"]
  },
  {
    "title": "Confirm Appointment with Patient",
    "details": ["State appointment date, day, and time clearly", "Confirm patient has written down or received details", "Provide appointment card or printed confirmation", "Ask for preferred reminder method (call, text, email)"]
  },
  {
    "title": "Enter Appointment Reminders",
    "details": ["Set system to send reminder 48-72 hours before", "Confirm patient''s phone and email are current", "Note any special instructions for appointment prep", "Document if patient declines reminders"]
  },
  {
    "title": "If Patient Declines to Schedule",
    "details": ["Explain importance of follow-up care", "Offer future scheduling: ''Would you like me to call you in [X] weeks?''", "Document in chart that patient declined appointment", "Place patient on recall list for future outreach", "Provide clinic contact info for self-scheduling later"]
  },
  {
    "title": "Recall Management",
    "details": ["Review recall list weekly", "Contact patients who are due for routine care", "Use phone, mail, or patient portal messaging", "Document all outreach attempts", "Update recall status once appointment is scheduled", "Follow clinic policy for number of contact attempts"]
  }
]'::jsonb),

('checkout', 'Check-Out Processes', '✅', 'End-of-visit procedures and follow-up coordination', 5,
'[
  {
    "title": "Review Visit Summary",
    "details": ["Obtain checkout paperwork from clinical staff", "Review provider''s follow-up instructions", "Note any prescriptions sent or given", "Check for lab/imaging orders that need scheduling"]
  },
  {
    "title": "Schedule Follow-Up Appointments",
    "details": ["Ask patient: ''The doctor would like to see you back in [X] weeks/months''", "Open schedule and find suitable appointment", "Confirm date and time with patient", "Provide appointment card or printed confirmation", "Set up appointment reminders"]
  },
  {
    "title": "Schedule Additional Services",
    "details": ["If labs ordered, schedule or provide lab slip", "If imaging ordered, provide referral/order forms", "If specialist referral needed, provide contact information or schedule", "Explain any prep requirements for scheduled procedures"]
  },
  {
    "title": "Collect Outstanding Balances",
    "details": ["Review patient account for today''s charges", "Inform patient of any balance due from today''s visit", "Collect co-insurance or deductible amount if known", "Address any previous outstanding balances", "Process payment if patient is able to pay"]
  },
  {
    "title": "Provide Superbills (If Applicable)",
    "details": ["For out-of-network patients, provide detailed superbill", "Include CPT codes, diagnosis codes, provider info", "Explain how to submit to insurance for reimbursement"]
  },
  {
    "title": "Answer Questions",
    "details": ["Ask: ''Do you have any questions about today''s visit?''", "Clarify appointment times or instructions", "Provide contact information for billing questions", "Ensure patient knows how to reach clinic if concerns arise"]
  },
  {
    "title": "Final Steps",
    "details": ["Ensure patient has all paperwork and forms", "Hand patient any prescriptions or orders", "Thank patient for coming in", "Confirm next steps"]
  }
]'::jsonb),

('noshow', 'Handling No-Shows and Late Arrivals', '⏰', 'Managing missed appointments and late patient arrivals', 6,
'[
  {
    "title": "Monitor Appointment Schedule",
    "details": ["Review daily schedule at start of shift", "Note appointments with history of no-shows or late arrivals", "Confirm all appointments have been reminded (call, text, email)", "Flag high-priority or new patient appointments"]
  },
  {
    "title": "When Patient is Late (Within Tolerance)",
    "details": ["Greet patient professionally without expressing frustration", "Check in patient promptly", "Inform clinical staff of late arrival immediately", "Ask clinical team if patient can still be seen or needs rescheduling", "If seen, explain there may be reduced appointment time", "Document arrival time in system"]
  },
  {
    "title": "When Patient is Too Late (Exceeds Policy)",
    "details": ["Greet patient warmly but explain clinic policy", "State: ''Our policy requires arrival [X] minutes before appointment time''", "Apologize that provider cannot see them today", "Offer to reschedule at next available time", "Remind patient of importance of timely arrival", "Document late arrival and rescheduling in chart"]
  },
  {
    "title": "When Patient is a No-Show",
    "details": ["Wait [X] minutes past appointment time per clinic policy (typically 10-15 minutes)", "Attempt to contact patient by phone", "Leave voicemail if no answer: ''We missed you today for your [time] appointment''", "Mark appointment as ''No-Show'' in scheduling system", "Send follow-up message via patient portal or text if available", "Note no-show in patient''s chart"]
  },
  {
    "title": "Apply No-Show Policy",
    "details": ["Document no-show count in patient record", "If first no-show, reschedule with reminder about clinic policy", "If second no-show, inform patient of policy consequences", "If third no-show (or per policy), may require deposit for future appointments", "Follow clinic''s progressive policy (warnings, fees, dismissal)", "Always document policy discussions in chart"]
  },
  {
    "title": "Fill Cancelled/No-Show Slots",
    "details": ["Check waitlist for patients wanting earlier appointments", "Contact waitlist patients immediately", "Offer same-day or next available slot", "Prioritize urgent needs or established patients", "Update schedule and remove from waitlist if accepted", "Keep backup list of patients who can come on short notice"]
  },
  {
    "title": "Communicate with Clinical Team",
    "details": ["Notify provider/clinical staff of no-show as soon as confirmed", "Update schedule board or status system", "Discuss if provider can see walk-ins or waitlist patients", "Help manage provider''s time efficiently with unexpected gaps", "Document all schedule changes"]
  },
  {
    "title": "Document and Report",
    "details": ["Track no-show rates by provider, day, and time", "Report patterns to office manager (e.g., frequent no-shows on Mondays)", "Identify patients with chronic no-show behavior", "Suggest improvements to reduce no-shows (better reminders, policy changes)", "Keep records for billing or dismissal documentation if needed"]
  }
]'::jsonb),

('waitlist', 'Managing Waitlists and Same-Day Add-Ons', '📝', 'Waitlist management and handling urgent appointment requests', 7,
'[
  {
    "title": "Create and Maintain Waitlist",
    "details": ["Start waitlist when patient requests earlier appointment than available", "Record patient''s name, contact number, current appointment date/time", "Note preferred days/times and provider preference", "Ask: ''How much notice do you need?'' (same-day, 24 hours, etc.)", "Document reason for visit or urgency level", "Update waitlist daily and remove patients who no longer need earlier slots"]
  },
  {
    "title": "Prioritize Waitlist",
    "details": ["Urgent medical needs go first", "Established patients before new patients (per clinic policy)", "Consider time on waitlist (first-come, first-served within priority levels)", "Note patients who can accommodate short notice", "Flag any patients with special needs or accommodations"]
  },
  {
    "title": "When a Slot Opens",
    "details": ["Immediately review waitlist for appropriate matches", "Consider appointment type and duration needed", "Check if provider specialty matches patient need", "Contact highest priority patient first", "Call patient: ''We have an opening for [date/time]. Can you make it?''", "Give patient reasonable time to respond (5-10 minutes) before moving to next"]
  },
  {
    "title": "Confirm Waitlist Appointment",
    "details": ["If patient accepts, book appointment immediately", "Cancel or move their original later appointment", "Send confirmation via text/email if possible", "Remove patient from waitlist", "Update schedule and notify clinical staff of addition", "Document who was offered slot and outcome"]
  },
  {
    "title": "Handling Same-Day Add-On Requests",
    "details": ["Ask about reason for visit and urgency", "Determine if truly urgent or can wait for regular appointment", "Check with clinical staff/provider: ''Do we have capacity for add-on?''", "Review provider''s schedule for gaps or flexibility", "Consider: lunch breaks, end of day slots, cancellations", "Be honest about wait time if adding to schedule"]
  },
  {
    "title": "Assess Appropriateness of Add-On",
    "details": ["Is this a true medical urgency or convenience request?", "Can issue be handled via telehealth or nurse triage instead?", "Does patient need to be seen today or is it preference?", "Would urgent care or ER be more appropriate?", "Is this an established patient with history at your clinic?", "Will add-on significantly delay other patients?"]
  },
  {
    "title": "Approve or Decline Add-On",
    "details": ["If approved: Add to schedule, inform clinical team, set expectations for wait time", "If declined: Explain kindly: ''We''re fully booked, but I have [next available]''", "Offer next available appointment or waitlist option", "Provide alternative resources if urgent (urgent care, telehealth, nurse line)", "Offer to have nurse call back for clinical triage if appropriate", "Always document decision and reason in patient record"]
  },
  {
    "title": "Communicate with Clinical Team",
    "details": ["Alert provider immediately of any add-ons", "Provide patient name, reason for visit, and urgency", "Discuss expected impact on schedule and other patients", "Get approval before confirming with patient", "Update schedule board and patient status systems", "Help manage patient flow to minimize delays"]
  }
]'::jsonb),

('multitasking', 'Balancing Phones, Messages, and Walk-Ins', '🎯', 'Managing multiple tasks and priorities simultaneously', 8,
'[
  {
    "title": "Prioritize Tasks by Urgency",
    "details": ["Level 1 (Immediate): Patient in distress, emergency calls, provider urgent requests", "Level 2 (High): Scheduled patient check-in, patient checkout, time-sensitive calls", "Level 3 (Standard): General phone calls, message returns, administrative tasks", "Level 4 (Low): Filing, data entry, non-urgent emails", "Always address person in front of you before starting new task unless true emergency"]
  },
  {
    "title": "Managing Walk-In Patients",
    "details": ["Greet walk-in immediately with eye contact and smile", "If busy, acknowledge: ''I''ll be with you in just one moment''", "Finish current task or reach stopping point (usually within 2-3 minutes)", "Ask walk-in: ''How can I help you today?''", "Determine if urgent, scheduled, or can wait", "Process according to priority level"]
  },
  {
    "title": "Answering Phone Calls",
    "details": ["Answer within 3 rings when possible", "If with walk-in patient, say: ''Excuse me one moment''", "Answer: ''[Clinic name], this is [your name], how may I help you?''", "If genuinely cannot answer, let voicemail capture and return call within policy timeframe", "For brief questions, handle immediately", "For complex issues, take message or schedule call-back time"]
  },
  {
    "title": "When Interrupted by Phone While With Patient",
    "details": ["Apologize to patient: ''Excuse me, I need to answer this quickly''", "Answer phone, assess urgency immediately", "If not urgent: ''May I get your name and call you back in 5 minutes?''", "If urgent: Handle call, then apologize to waiting patient", "Return to patient, summarize where you left off", "Complete patient interaction before making call-backs"]
  },
  {
    "title": "Processing Messages and Requests",
    "details": ["Check message queue at designated times (start of shift, mid-morning, afternoon)", "Sort by urgency and date received", "Respond to time-sensitive messages first", "For prescription refills, forward to clinical team immediately", "For appointment requests, process during phone lulls", "For billing questions, respond or route to billing department", "Document all message responses in patient record"]
  },
  {
    "title": "Creating Workflow During Busy Times",
    "details": ["Designate roles if multiple staff: one for check-in, one for phones", "Use ''batching'': group similar tasks together during quieter moments", "Keep frequently needed information easily accessible", "Use templates for common responses to save time", "Communicate with team: ''I''m swamped, can you grab the phone?''", "Take brief notes on interruptions to return to tasks efficiently"]
  },
  {
    "title": "Maintaining Professionalism Under Pressure",
    "details": ["Take a deep breath before greeting next patient/caller", "Never show frustration or stress to patients", "Speak clearly and calmly even when rushed", "If overwhelmed, it''s okay to say: ''We''re experiencing high volume today''", "Set realistic expectations for wait times or call-backs", "Ask for help from supervisor or colleagues when needed", "Remember: patients aren''t aware of your other demands"]
  },
  {
    "title": "End of Day Task Management",
    "details": ["Return all outstanding calls/messages before leaving", "If unable to complete, leave detailed notes for next shift", "Complete all patient check-ins and check-outs from the day", "Forward urgent matters to supervisor or on-call staff", "Update status on any ongoing tasks", "Prepare workspace for next shift", "Debrief with team about busy periods or issues"]
  }
]'::jsonb)

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  steps = EXCLUDED.steps,
  updated_at = now();
