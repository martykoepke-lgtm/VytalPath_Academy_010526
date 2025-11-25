/*
  # Insert Remaining Front Office SOPs

  1. Additional SOPs
    - Scheduling Follow-Ups & Recalls
    - Handling No-Shows and Late Arrivals
    - Managing Waitlists and Same-Day Add-Ons
    - Patient Check-Out Procedures
    - Balancing Phones, Messages, and Walk-Ins
    - Cash Drawer Management
    - End-of-Day Reconciliation & Deposit
*/

-- Scheduling Follow-Ups & Recalls
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'schedulingfollowups',
  'Scheduling Follow-Ups & Recalls',
  '🔄',
  'Managing follow-up appointments and patient recall systems',
  6,
  'scheduling',
  'existing',
  '[
    {"title": "Determine Scheduling Need", "details": ["Check provider notes for follow-up instructions", "Confirm time frame (days, weeks, months)", "Note specific provider or department requested", "Check if any special appointment type is needed"]},
    {"title": "Schedule Follow-Up Appointment", "details": ["Open scheduling system calendar", "Select appropriate provider/department", "Find available date within requested time frame", "Choose appropriate appointment type/duration", "Book appointment with patient agreement"]},
    {"title": "Confirm Appointment with Patient", "details": ["State appointment date, day, and time clearly", "Confirm patient has written down or received details", "Provide appointment card or printed confirmation", "Ask for preferred reminder method (call, text, email)"]},
    {"title": "Enter Appointment Reminders", "details": ["Set system to send reminder 48-72 hours before", "Confirm patient phone and email are current", "Note any special instructions for appointment prep", "Document if patient declines reminders"]},
    {"title": "If Patient Declines to Schedule", "details": ["Explain importance of follow-up care", "Offer future scheduling: Would you like me to call you in [X] weeks?", "Document in chart that patient declined appointment", "Place patient on recall list for future outreach", "Provide clinic contact info for self-scheduling later"]},
    {"title": "Recall Management", "details": ["Review recall list weekly", "Contact patients who are due for routine care", "Use phone, mail, or patient portal messaging", "Document all outreach attempts", "Update recall status once appointment is scheduled", "Follow clinic policy for number of contact attempts"]}
  ]'::jsonb
);

-- Handling No-Shows and Late Arrivals
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'noshow',
  'Handling No-Shows and Late Arrivals',
  '⏰',
  'Procedures for managing late arrivals, no-shows, and schedule optimization',
  7,
  'scheduling',
  'both',
  '[
    {"title": "Monitor Appointment Schedule", "details": ["Review daily schedule at start of shift", "Note appointments with history of no-shows or late arrivals", "Confirm all appointments have been reminded (call, text, email)", "Flag high-priority or new patient appointments"]},
    {"title": "When Patient is Late (Within Tolerance)", "details": ["Greet patient professionally without expressing frustration", "Check in patient promptly", "Inform clinical staff of late arrival immediately", "Ask clinical team if patient can still be seen or needs rescheduling", "If seen, explain there may be reduced appointment time", "Document arrival time in system"]},
    {"title": "When Patient is Too Late", "details": ["Greet patient warmly but explain clinic policy", "State: Our policy requires arrival [X] minutes before appointment time", "Apologize that provider cannot see them today", "Offer to reschedule at next available time", "Remind patient of importance of timely arrival", "Document late arrival and rescheduling in chart"]},
    {"title": "When Patient is a No-Show", "details": ["Wait [X] minutes past appointment time per clinic policy (typically 10-15 minutes)", "Attempt to contact patient by phone", "Leave voicemail if no answer: We missed you today for your [time] appointment", "Mark appointment as No-Show in scheduling system", "Send follow-up message via patient portal or text if available", "Note no-show in patient chart"]},
    {"title": "Apply No-Show Policy", "details": ["Document no-show count in patient record", "If first no-show, reschedule with reminder about clinic policy", "If second no-show, inform patient of policy consequences", "If third no-show (or per policy), may require deposit for future appointments", "Follow clinic progressive policy (warnings, fees, dismissal)", "Always document policy discussions in chart"]},
    {"title": "Fill Cancelled/No-Show Slots", "details": ["Check waitlist for patients wanting earlier appointments", "Contact waitlist patients immediately", "Offer same-day or next available slot", "Prioritize urgent needs or established patients", "Update schedule and remove from waitlist if accepted", "Keep backup list of patients who can come on short notice"]},
    {"title": "Communicate with Clinical Team", "details": ["Notify provider/clinical staff of no-show as soon as confirmed", "Update schedule board or status system", "Discuss if provider can see walk-ins or waitlist patients", "Help manage provider time efficiently with unexpected gaps", "Document all schedule changes"]},
    {"title": "Document and Report", "details": ["Track no-show rates by provider, day, and time", "Report patterns to office manager", "Identify patients with chronic no-show behavior", "Suggest improvements to reduce no-shows", "Keep records for billing or dismissal documentation if needed"]}
  ]'::jsonb
);

-- Managing Waitlists
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'waitlist',
  'Managing Waitlists and Add-Ons',
  '📝',
  'Strategies for waitlist management and handling same-day appointment requests',
  8,
  'scheduling',
  'both',
  '[
    {"title": "Create and Maintain Waitlist", "details": ["Start waitlist when patient requests earlier appointment than available", "Record patient name, contact number, current appointment date/time", "Note preferred days/times and provider preference", "Ask: How much notice do you need?", "Document reason for visit or urgency level", "Update waitlist daily and remove patients who no longer need earlier slots"]},
    {"title": "Prioritize Waitlist", "details": ["Urgent medical needs go first", "Established patients before new patients (per clinic policy)", "Consider time on waitlist (first-come, first-served within priority levels)", "Note patients who can accommodate short notice", "Flag any patients with special needs or accommodations"]},
    {"title": "When a Slot Opens", "details": ["Immediately review waitlist for appropriate matches", "Consider appointment type and duration needed", "Check if provider specialty matches patient need", "Contact highest priority patient first", "Call patient: We have an opening for [date/time]. Can you make it?", "Give patient reasonable time to respond (5-10 minutes) before moving to next"]},
    {"title": "Confirm Waitlist Appointment", "details": ["If patient accepts, book appointment immediately", "Cancel or move their original later appointment", "Send confirmation via text/email if possible", "Remove patient from waitlist", "Update schedule and notify clinical staff of addition", "Document who was offered slot and outcome"]},
    {"title": "Handling Same-Day Add-On Requests", "details": ["Ask about reason for visit and urgency", "Determine if truly urgent or can wait for regular appointment", "Check with clinical staff/provider: Do we have capacity for add-on?", "Review provider schedule for gaps or flexibility", "Consider: lunch breaks, end of day slots, cancellations", "Be honest about wait time if adding to schedule"]},
    {"title": "Assess Appropriateness of Add-On", "details": ["Is this a true medical urgency or convenience request?", "Can issue be handled via telehealth or nurse triage instead?", "Does patient need to be seen today or is it preference?", "Would urgent care or ER be more appropriate?", "Is this an established patient with history at your clinic?", "Will add-on significantly delay other patients?"]},
    {"title": "Approve or Decline Add-On", "details": ["If approved: Add to schedule, inform clinical team, set expectations for wait time", "If declined: Explain kindly: We are fully booked, but I have [next available]", "Offer next available appointment or waitlist option", "Provide alternative resources if urgent", "Offer to have nurse call back for clinical triage if appropriate", "Always document decision and reason in patient record"]},
    {"title": "Communicate with Clinical Team", "details": ["Alert provider immediately of any add-ons", "Provide patient name, reason for visit, and urgency", "Discuss expected impact on schedule and other patients", "Get approval before confirming with patient", "Update schedule board and patient status systems", "Help manage patient flow to minimize delays"]}
  ]'::jsonb
);

-- Patient Check-Out
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'checkout',
  'Patient Check-Out Procedures',
  '🚪',
  'Complete checkout workflow including scheduling, payments, and follow-up',
  9,
  'checkout',
  'both',
  '[
    {"title": "Review Visit Summary", "details": ["Obtain checkout paperwork from clinical staff", "Review provider follow-up instructions", "Note any prescriptions sent or given", "Check for lab/imaging orders that need scheduling"]},
    {"title": "Schedule Follow-Up Appointments", "details": ["Ask patient: The doctor would like to see you back in [X] weeks/months", "Open schedule and find suitable appointment", "Confirm date and time with patient", "Provide appointment card or printed confirmation", "Set up appointment reminders"]},
    {"title": "Schedule Additional Services", "details": ["If labs ordered, schedule or provide lab slip", "If imaging ordered, provide referral/order forms", "If specialist referral needed, provide contact information or schedule", "Explain any prep requirements for scheduled procedures"]},
    {"title": "Collect Outstanding Balances", "details": ["Review patient account for today charges", "Inform patient of any balance due from today visit", "Collect co-insurance or deductible amount if known", "Address any previous outstanding balances", "Process payment if patient is able to pay"]},
    {"title": "Provide Superbills (If Applicable)", "details": ["For out-of-network patients, provide detailed superbill", "Include CPT codes, diagnosis codes, provider info", "Explain how to submit to insurance for reimbursement"]},
    {"title": "Answer Questions", "details": ["Ask: Do you have any questions about today visit?", "Clarify appointment times or instructions", "Provide contact information for billing questions", "Ensure patient knows how to reach clinic if concerns arise"]},
    {"title": "Final Steps", "details": ["Ensure patient has all paperwork and forms", "Hand patient any prescriptions or orders", "Thank patient for coming in", "Confirm next steps"]}
  ]'::jsonb
);

-- Balancing Multiple Tasks
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'multitasking',
  'Balancing Phones, Messages, Walk-Ins',
  '🎯',
  'Strategies for managing multiple demands and maintaining efficiency',
  10,
  'during-day',
  'both',
  '[
    {"title": "Prioritize Tasks by Urgency", "details": ["Level 1 (Immediate): Patient in distress, emergency calls, provider urgent requests", "Level 2 (High): Scheduled patient check-in, patient checkout, time-sensitive calls", "Level 3 (Standard): General phone calls, message returns, administrative tasks", "Level 4 (Low): Filing, data entry, non-urgent emails", "Always address person in front of you before starting new task unless true emergency"]},
    {"title": "Managing Walk-In Patients", "details": ["Greet walk-in immediately with eye contact and smile", "If busy, acknowledge: I will be with you in just one moment", "Finish current task or reach stopping point (usually within 2-3 minutes)", "Ask walk-in: How can I help you today?", "Determine if urgent, scheduled, or can wait", "Process according to priority level"]},
    {"title": "Answering Phone Calls", "details": ["Answer within 3 rings when possible", "If with walk-in patient, say: Excuse me one moment", "Answer: [Clinic name], this is [your name], how may I help you?", "If genuinely cannot answer, let voicemail capture and return call within policy timeframe", "For brief questions, handle immediately", "For complex issues, take message or schedule call-back time"]},
    {"title": "When Interrupted by Phone", "details": ["Apologize to patient: Excuse me, I need to answer this quickly", "Answer phone, assess urgency immediately", "If not urgent: May I get your name and call you back in 5 minutes?", "If urgent: Handle call, then apologize to waiting patient", "Return to patient, summarize where you left off", "Complete patient interaction before making call-backs"]},
    {"title": "Processing Messages and Requests", "details": ["Check message queue at designated times", "Sort by urgency and date received", "Respond to time-sensitive messages first", "For prescription refills, forward to clinical team immediately", "For appointment requests, process during phone lulls", "For billing questions, respond or route to billing department", "Document all message responses in patient record"]},
    {"title": "Creating Workflow During Busy Times", "details": ["Designate roles if multiple staff: one for check-in, one for phones", "Use batching: group similar tasks together during quieter moments", "Keep frequently needed information easily accessible", "Use templates for common responses to save time", "Communicate with team when overwhelmed", "Take brief notes on interruptions to return to tasks efficiently"]},
    {"title": "Maintaining Professionalism", "details": ["Take a deep breath before greeting next patient/caller", "Never show frustration or stress to patients", "Speak clearly and calmly even when rushed", "If overwhelmed, okay to say: We are experiencing high volume today", "Set realistic expectations for wait times or call-backs", "Ask for help from supervisor or colleagues when needed", "Remember: patients are not aware of your other demands"]},
    {"title": "End of Day Task Management", "details": ["Return all outstanding calls/messages before leaving", "If unable to complete, leave detailed notes for next shift", "Complete all patient check-ins and check-outs from the day", "Forward urgent matters to supervisor or on-call staff", "Update status on any ongoing tasks", "Prepare workspace for next shift", "Debrief with team about busy periods or issues"]}
  ]'::jsonb
);

-- Cash Drawer Management
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'cashdrawer',
  'Cash Drawer Management',
  '💰',
  'Opening, monitoring, and closing cash drawer procedures',
  11,
  'opening-closing',
  'both',
  '[
    {"title": "Opening Procedures - Morning Setup", "details": ["Arrive at designated time before clinic opens", "Retrieve cash drawer from safe/secure location", "Count starting cash (bills and coins) with a witness if possible", "Record starting amount on cash log sheet", "Organize bills by denomination (largest to smallest)", "Ensure adequate change (ones, fives, quarters, etc.)", "Sign and date the opening log", "Secure log in designated location"]},
    {"title": "During Day - Transaction Handling", "details": ["Keep large bills separate or deposit periodically", "Never leave drawer unattended when open", "Lock drawer when stepping away from desk", "Do not allow anyone else to access your drawer", "Count back change to patients", "Issue receipts for all cash transactions"]},
    {"title": "Closing Procedures - End of Day Count", "details": ["Count all cash in drawer by denomination", "Separate starting cash from daily collections", "Calculate total collections (closing amount minus opening amount)", "Compare to system report of cash payments collected", "Document any overages or shortages", "Complete cash closing log with totals"]},
    {"title": "Reconciliation & Documentation", "details": ["Match cash log to payment system report", "Investigate and document any discrepancies", "Return starting cash amount to drawer for next day", "Prepare deposit with daily collections", "Complete deposit slip with breakdown by denomination", "Have supervisor review and sign off on closing"]},
    {"title": "Secure Storage", "details": ["Place drawer in safe or secure locked location", "Lock safe and verify it is secure", "Store all logs in designated secure area", "Do not leave cash or logs in plain sight", "Follow clinic chain of custody procedures"]}
  ]'::jsonb
);

-- End-of-Day Reconciliation
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'eodreconciliation',
  'End-of-Day Reconciliation',
  '📊',
  'Daily financial reconciliation and deposit preparation procedures',
  12,
  'closing',
  'both',
  '[
    {"title": "Run Daily Reports", "details": ["Generate end-of-day payment report from system", "Print or export report showing all payment types", "Review total collections by payment method (cash, check, card)", "Note number of transactions per payment type", "Check for any voided or refunded transactions"]},
    {"title": "Reconcile Cash", "details": ["Count physical cash in drawer", "Compare to cash payment total in system", "Document any overages or shortages", "Investigate discrepancies immediately", "Complete cash reconciliation form"]},
    {"title": "Reconcile Checks", "details": ["Count all physical checks received", "Match each check to system entries", "Verify check amounts match system records", "Ensure all checks are properly endorsed", "List checks individually on deposit slip or log"]},
    {"title": "Reconcile Card Payments", "details": ["Review credit/debit card payment report", "Match to card terminal batch report", "Ensure batch was closed/settled for the day", "Verify totals match between systems", "Note any declined or failed transactions"]},
    {"title": "Prepare Bank Deposit", "details": ["Complete deposit slip with cash and check totals", "Organize checks with deposit slip", "Use tamper-evident deposit bag if available", "Record deposit amount and date on tracking log", "Obtain supervisor signature on deposit documentation"]},
    {"title": "Final Documentation", "details": ["File all daily reconciliation reports together", "Make copies of deposit documentation", "Store original reports per clinic policy", "Note any follow-up items needed for next day", "Communicate any issues to supervisor"]}
  ]'::jsonb
);
