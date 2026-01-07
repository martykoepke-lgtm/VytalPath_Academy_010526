/*
  # Add Comprehensive Front Office SOPs

  This migration adds 12 new workflows and updates existing ones to create
  a complete 24-workflow training reference for front office staff.

  NEW WORKFLOWS ADDED:
  1. Phone System Login & Setup (opening)
  2. Cash Drawer Opening (opening)
  3. Pre-Scrubbing the Schedule (opening)
  4. Appointment Reminder Calls (scheduling)
  5. Patient Outreach (scheduling)
  6. Insurance Eligibility Verification (insurance)
  7. ROI, Consent Forms & NPP (compliance)
  8. Message Management (during-day)
  9. Handling STAT Results (during-day)
  10. No-Show Letters (admin)
  11. Ordering Front Office Supplies (admin)
  12. Monthly Compliance Logs (admin)

  EXISTING WORKFLOWS UPDATED:
  - Patient Check-Out: Enhanced with labs, imaging, referrals sections
  - Cash Drawer Management: Split into Opening (new) and Closing (updated)
*/

-- NOTE: Run 20251227000000_update_sop_category_constraint.sql FIRST to update the constraint

-- 1. Phone System Login & Setup
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'phonesystemlogin',
  'Phone System Login & Setup',
  '📞',
  'Logging into the phone system enables call tracking, routing from call centers, and after-hours message retrieval',
  0,
  'opening',
  'both',
  '[
    {"title": "Access Phone System", "details": ["Arrive at designated time before clinic opens", "Power on phone/computer system if needed", "Log in with your unique credentials", "Verify your extension is active"]},
    {"title": "Check Voicemail & After-Hours Messages", "details": ["Access voicemail system", "Listen to all messages from after-hours/call center", "Document urgent messages for immediate follow-up", "Note patient callbacks needed"]},
    {"title": "Verify Phone Routing", "details": ["Confirm calls are routing to front desk correctly", "Test internal extension transfers", "Verify after-hours routing is disabled (if applicable)", "Check that hold music/messages are working"]},
    {"title": "Prepare for Incoming Calls", "details": ["Have scheduling system open and ready", "Keep patient lookup screen accessible", "Have notepad ready for messages", "Review any special instructions for the day"]}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  category = EXCLUDED.category,
  steps = EXCLUDED.steps,
  updated_at = now();

-- 2. Cash Drawer Opening
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'cashdraweropening',
  'Cash Drawer Opening',
  '💰',
  'Proper cash drawer setup ensures accurate financial tracking throughout the day',
  0.5,
  'opening',
  'both',
  '[
    {"title": "Retrieve Cash Drawer", "details": ["Retrieve drawer from safe/secure location", "Use two-person verification if required by policy", "Sign out drawer on custody log"]},
    {"title": "Count Starting Cash", "details": ["Count all bills by denomination (largest to smallest)", "Count all coins", "Verify starting amount matches expected float (typically $100-200)", "Document any discrepancies immediately"]},
    {"title": "Document Opening", "details": ["Record starting amount on daily cash log", "Note date, time, and your initials", "Have witness sign if required", "Secure log in designated location"]},
    {"title": "Organize Drawer", "details": ["Arrange bills by denomination (largest in back)", "Ensure adequate change (ones, fives, quarters)", "Place checks/credit card receipts section ready", "Position drawer securely at workstation", "KEY RULE: Never leave drawer unattended when unlocked"]}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  category = EXCLUDED.category,
  steps = EXCLUDED.steps,
  updated_at = now();

-- 3. Pre-Scrubbing the Schedule
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'prescrubbing',
  'Pre-Scrubbing the Schedule',
  '📋',
  'Pre-scrubbing reduces day-of surprises and ensures smooth patient flow',
  0.7,
  'opening',
  'both',
  '[
    {"title": "Pull Tomorrow''s (or Today''s) Schedule", "details": ["Print or open electronic schedule", "Review all appointments for the session", "Note appointment types and durations", "Identify new patients vs. established patients"]},
    {"title": "Verify Insurance Eligibility", "details": ["Check eligibility status for each patient", "Flag any patients not yet verified", "Run eligibility for flagged patients", "Document verification results"]},
    {"title": "Check for Missing Information", "details": ["Demographics complete? (address, phone, email)", "Insurance cards on file?", "Required forms signed/current?", "Outstanding balances noted?"]},
    {"title": "Identify Special Needs", "details": ["Interpreter needed?", "Wheelchair/accessibility requirements?", "Complex medical history to alert provider?", "Behavioral flags or special instructions?"]},
    {"title": "Prepare Patient Materials", "details": ["Pull any paper charts if used", "Queue electronic forms for completion", "Prepare new patient packets", "Print any needed requisitions"]},
    {"title": "Document & Communicate", "details": ["Create checklist of issues to address", "Flag problem appointments in system", "Communicate concerns to clinical team", "Note patients who may need extra time", "BEST PRACTICE: Pre-scrub 48-72 hours ahead when possible"]}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  category = EXCLUDED.category,
  steps = EXCLUDED.steps,
  updated_at = now();

-- 4. Appointment Reminder Calls
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'appointmentreminders',
  'Appointment Reminder Calls',
  '📱',
  'Proactive reminders reduce no-shows and allow time for rescheduling',
  2.5,
  'scheduling',
  'both',
  '[
    {"title": "Generate Reminder List", "details": ["Pull list of appointments for 2-3 days out", "Prioritize: New patients, procedures, historically no-show patients", "Note any special prep instructions to relay"]},
    {"title": "Make Reminder Calls", "details": ["Use script: Hello, this is [Name] calling from [Clinic Name] to remind you of your appointment on [Day], [Date] at [Time] with [Provider]. Please arrive 10-15 minutes early. If you need to reschedule, please call us at [number]. Thank you!", "Leave voicemail if no answer", "Note call outcome in system"]},
    {"title": "Handle Rescheduling Requests", "details": ["If patient needs to reschedule, do so during the call", "Offer 2-3 alternative times", "Update system immediately", "Send new confirmation if applicable"]},
    {"title": "Document Outcomes", "details": ["Confirmed", "Left voicemail", "Rescheduled (note new date/time)", "Unable to reach (wrong number, disconnected)", "Cancelled (note reason if given)", "TIP: Track patients who consistently don''t answer — they may have updated contact info or prefer text/email reminders"]}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  category = EXCLUDED.category,
  steps = EXCLUDED.steps,
  updated_at = now();

-- 5. Patient Outreach
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'patientoutreach',
  'Patient Outreach',
  '📣',
  'Proactive outreach for preventive care and chronic disease management',
  2.7,
  'scheduling',
  'both',
  '[
    {"title": "Identify Outreach Needs", "details": ["Health maintenance due (annual physicals, screenings)", "Chronic care follow-ups overdue", "Lab/test results requiring follow-up visit", "Immunizations due", "Referral follow-ups not completed"]},
    {"title": "Generate Outreach Lists", "details": ["Run reports for overdue health maintenance", "Filter by date range and care type", "Prioritize high-risk or significantly overdue patients", "Remove recently scheduled patients"]},
    {"title": "Contact Patients", "details": ["Call during business hours (or per patient preference)", "Use script: Hello, this is [Name] from [Clinic]. We noticed you''re due for your [annual physical/diabetes check/mammogram]. We''d like to help you schedule an appointment. Do you have a few minutes?", "Offer scheduling assistance", "Answer questions about the visit"]},
    {"title": "Document All Attempts", "details": ["Date and time of contact", "Method (phone, letter, portal message)", "Outcome (scheduled, declined, no answer, wrong number)", "Follow-up needed", "Update recall status"]},
    {"title": "Follow-Up Protocol", "details": ["First attempt: Phone call", "Second attempt (1 week later): Phone call + portal message", "Third attempt (2 weeks later): Mailed letter", "After 3 attempts: Document and close outreach cycle", "Repeat cycle per clinic policy (quarterly, annually)"]}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  category = EXCLUDED.category,
  steps = EXCLUDED.steps,
  updated_at = now();

-- 6. Insurance Eligibility Verification
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'insuranceeligibility',
  'Insurance Eligibility Verification',
  '🔍',
  'Proper eligibility verification prevents claim denials and patient surprises',
  2.8,
  'insurance',
  'both',
  '[
    {"title": "When to Run Eligibility", "details": ["New patient: At registration", "Existing patient with new insurance: When insurance changes", "Existing patient with same insurance: Monthly (or per policy)", "Eligibility returned unclear: Day prior to visit", "High-dollar procedure scheduled: 48-72 hours prior"]},
    {"title": "Access Eligibility Tool", "details": ["Open practice management system", "Navigate to eligibility verification", "Enter patient''s insurance information", "Submit real-time eligibility request"]},
    {"title": "Review Response", "details": ["ACTIVE COVERAGE: Confirm effective date covers appointment date", "PATIENT RESPONSIBILITY: Copay amount, Deductible remaining, Coinsurance percentage, Out-of-pocket maximum status", "PLAN DETAILS: In-network status, Referral/authorization requirements, PCP assignment (if HMO)"]},
    {"title": "Address Issues", "details": ["If eligibility doesn''t return clear:", "Double-check member ID and DOB entered correctly", "Try alternate payer ID if available", "Call payer directly if electronic check fails", "Run again day prior to visit", "Document all attempts"]},
    {"title": "Document & Communicate", "details": ["Record verification date", "Note copay/coinsurance amounts", "Flag any authorization requirements", "Document who verified and method used", "If coverage not active: Contact patient before appointment", "Explain options: Updated insurance info, self-pay, reschedule", "KEY POINT: Never assume coverage. Verify every time."]}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  category = EXCLUDED.category,
  steps = EXCLUDED.steps,
  updated_at = now();

-- 7. ROI, Consent Forms & NPP
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'roiconsentnpp',
  'ROI, Consent Forms & NPP',
  '📝',
  'Proper documentation protects patients, staff, and the organization',
  2.9,
  'compliance',
  'both',
  '[
    {"title": "Understanding the Forms", "details": ["NPP (Notice of Privacy Practices): Explains how patient health info is used/shared - Required for new patients and when updated", "Consent for Treatment: Authorizes clinic to provide care - Required for new patients and annually", "Financial Responsibility: Patient agrees to pay for services - Required for new patients and when policy changes", "HIPAA Acknowledgment: Confirms patient received NPP - Required for new patients and annually", "ROI (Release of Information): Authorizes sharing records with specific parties - As needed per request"]},
    {"title": "New Patient Form Collection", "details": ["Required at first visit:", "Consent for Treatment - signed and dated", "HIPAA/NPP Acknowledgment - signed and dated", "Financial Responsibility Agreement - signed and dated", "Patient Demographics Form - completed", "Medical History Questionnaire - completed", "Current Medications List - completed", "Pharmacy Information - provided"]},
    {"title": "Annual Updates", "details": ["Check annually (typically at first visit of the year):", "HIPAA acknowledgment current?", "Financial policy re-signed if updated?", "Demographics verified and updated?", "Insurance cards re-scanned?"]},
    {"title": "Processing Release of Information (ROI)", "details": ["Obtain Written Authorization using clinic''s official ROI form", "Must include: Patient name and DOB, What information to release, Who to release to (name, address, fax), Purpose of release, Expiration date, Patient signature and date", "Verify Authorization: Is signature authentic? Is request within date range? Is information requested appropriate?", "Process Request: Pull requested records, Review for completeness, Send via secure method (fax, mail, portal), Document: Date sent, what sent, where sent, by whom", "EXCEPTIONS - No ROI Needed: Treatment purposes, Payment purposes, Healthcare operations, Patient requesting own records, Legal requirements", "HIPAA ALERT: When in doubt, get written authorization. Never release records to family members without patient consent."]}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  category = EXCLUDED.category,
  steps = EXCLUDED.steps,
  updated_at = now();

-- 8. Message Management
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'messagemanagement',
  'Message Management',
  '✉️',
  'Efficient message handling ensures timely patient care',
  10.3,
  'during-day',
  'both',
  '[
    {"title": "Monitor Message Sources", "details": ["EHR/portal patient messages", "Phone voicemails", "Faxes", "Internal staff messages", "After-hours service messages"]},
    {"title": "Triage Messages by Type", "details": ["Prescription refill → Clinical team / Provider (Standard priority)", "Appointment request → Front desk (Standard)", "Clinical question → Nurse / Provider (Varies)", "Test result inquiry → Clinical team (Standard)", "Billing question → Billing dept (Standard)", "Urgent symptom → Nurse / Provider (HIGH priority)", "Medical records request → Health Information (Standard)"]},
    {"title": "Process Front Desk Messages", "details": ["Scheduling requests: Schedule or return call", "Demographic updates: Update in system", "Insurance changes: Update and verify eligibility", "General inquiries: Respond or route appropriately"]},
    {"title": "Route Clinical Messages", "details": ["Forward to appropriate staff member", "Include relevant context", "Flag urgent items", "Document routing in system"]},
    {"title": "Document All Actions", "details": ["Note date/time of action", "Record response given or routing destination", "Mark complete or pending", "Follow up on pending items", "RESPONSE TIME GOALS: Urgent messages - Same day, Routine messages - Within 24-48 hours"]}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  category = EXCLUDED.category,
  steps = EXCLUDED.steps,
  updated_at = now();

-- 9. Handling STAT Results
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'statresults',
  'Handling STAT Results',
  '⚠️',
  'Critical results require immediate action to ensure patient safety',
  10.5,
  'during-day',
  'both',
  '[
    {"title": "Recognize STAT Results", "details": ["STAT results may come via: Phone call from lab/radiology, Fax marked CRITICAL or STAT, EHR alert, Direct call to front desk", "Common STAT results: Critical lab values, Urgent imaging findings, Pathology results requiring immediate attention"]},
    {"title": "Immediate Actions", "details": ["Do NOT ignore or set aside", "Write down: Patient name and DOB, Caller name and facility, Result details (or critical value - see report), Callback number", "Time-stamp your note"]},
    {"title": "Notify Provider Immediately", "details": ["Locate the ordering provider", "If unavailable: Contact covering provider", "If no provider available: Contact clinical supervisor/nurse manager", "Do NOT leave STAT result unaddressed"]},
    {"title": "Document Notification", "details": ["Note time provider notified", "Note provider''s name", "Document any instructions given", "If unable to reach provider, document all attempts"]},
    {"title": "Follow Up", "details": ["Ensure provider acknowledged", "Verify patient was contacted if needed", "Document all actions in patient chart", "Escalate if no response within appropriate timeframe", "CRITICAL: STAT results cannot wait. Interrupt other tasks if necessary. Patient safety is the priority."]}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  category = EXCLUDED.category,
  steps = EXCLUDED.steps,
  updated_at = now();

-- 10. No-Show Letters
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'noshowletters',
  'No-Show Letters',
  '📬',
  'Formal documentation of no-show occurrences',
  13,
  'admin',
  'both',
  '[
    {"title": "Determine When to Send", "details": ["Per clinic policy (example):", "First no-show: Phone call only (documented)", "Second no-show: Warning letter", "Third no-show: Final warning / potential dismissal letter"]},
    {"title": "Generate Letter", "details": ["Use clinic-approved template including:", "Patient name and address", "Date of missed appointment(s)", "Clinic no-show policy", "Consequences of future no-shows", "Instructions for rescheduling", "Contact information"]},
    {"title": "Send Letter", "details": ["Print on clinic letterhead", "First class mail for warnings", "Certified mail for dismissal letters (per policy)", "Keep copy for chart"]},
    {"title": "Document", "details": ["Note in patient chart: Date letter sent, type of letter", "Scan copy of letter to chart", "Update no-show count", "Flag for follow-up if needed"]}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  category = EXCLUDED.category,
  steps = EXCLUDED.steps,
  updated_at = now();

-- 11. Ordering Front Office Supplies
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'orderingsupplies',
  'Ordering Front Office Supplies',
  '📦',
  'Maintaining adequate supplies for operations',
  14,
  'admin',
  'both',
  '[
    {"title": "Monitor Inventory", "details": ["Check supply levels weekly", "Note items running low", "Maintain par levels for essential items", "Common supplies: Paper (copy, printer, colored), Pens, highlighters, markers, Staplers, staples, tape, scissors, Patient forms (if pre-printed), Appointment cards, Clipboards, Receipt paper, Toner/ink cartridges, Envelopes, stamps, Cleaning supplies for front area"]},
    {"title": "Submit Order Request", "details": ["Complete supply order form", "Get supervisor approval if required", "Submit to appropriate person/vendor", "Note expected delivery date"]},
    {"title": "Receive & Stock", "details": ["Check delivery against order", "Report discrepancies", "Stock supplies in designated locations", "Rotate stock (first in, first out)", "Update inventory log if used"]}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  category = EXCLUDED.category,
  steps = EXCLUDED.steps,
  updated_at = now();

-- 12. Monthly Compliance Logs
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'monthlycompliance',
  'Monthly Compliance Logs',
  '📋',
  'Maintaining required compliance documentation',
  15,
  'admin',
  'both',
  '[
    {"title": "Credit Card Terminal Tampering Log", "details": ["PURPOSE: PCI compliance requires monthly inspection of card terminals for tampering or skimming devices", "WHAT TO CHECK: Physical damage to terminal, Loose or extra components, Unusual attachments near card slot, Cables appear normal/unaltered, Serial number matches records", "HOW TO DOCUMENT: Date of inspection, Terminal location/ID, Inspector name, Findings (normal or concerns), Action taken if concerns found", "IF TAMPERING SUSPECTED: Do not use terminal, Report to supervisor immediately, Contact terminal provider, Document incident"]},
    {"title": "Other Monthly Logs", "details": ["Refrigerator temperature logs (if vaccines stored)", "Emergency equipment checks", "Fire extinguisher inspections", "Safety checklist reviews", "Document all inspections per clinic policy"]}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  category = EXCLUDED.category,
  steps = EXCLUDED.steps,
  updated_at = now();

-- UPDATE EXISTING WORKFLOWS

-- Update Patient Check-Out with enhanced content
UPDATE sops
SET
  steps = '[
    {"title": "Receive Checkout Information", "details": ["Obtain checkout paperwork from clinical staff", "Review provider''s follow-up instructions", "Note any prescriptions sent/given", "Check for orders requiring scheduling (lab, imaging, referrals)"]},
    {"title": "Schedule Follow-Up Appointments", "details": ["The doctor would like to see you back in [X] weeks/months", "Find suitable appointment", "Confirm date and time with patient", "Provide appointment card or printed confirmation", "Set up reminders"]},
    {"title": "Schedule Additional Services", "details": ["LABS: Provide lab requisition, Schedule lab appointment if available, Explain fasting or prep requirements, Provide lab location/hours", "IMAGING: Provide imaging order, If prior authorization needed explain process and timeline, Schedule if available or provide contact info, Explain prep requirements", "REFERRALS: Provide referral information, Explain authorization process if needed, Provide specialist contact info, Offer to schedule if your office handles", "OTHER: Print back-to-school/back-to-work letters if needed, Provide any other requested documentation"]},
    {"title": "Print Visit Materials", "details": ["Print visit summary (After Visit Summary / AVS)", "Print any requisitions (lab, imaging)", "Print referral paperwork", "Print patient education materials if ordered"]},
    {"title": "Address Financial Responsibility", "details": ["Review today''s charges if known", "Collect copay if not collected at check-in", "Collect coinsurance if applicable and amount known", "Address outstanding balances: You have a previous balance of $[amount]", "Would you like to make a payment today?", "Discuss payment plan options if needed", "Provide superbill for out-of-network patients"]},
    {"title": "Process Payments", "details": ["Accept cash, check, or card", "Process in system", "Apply to correct date of service", "Provide itemized receipt", "Offer to email receipt if available"]},
    {"title": "Final Steps", "details": ["Ensure patient has all paperwork", "Confirm they know next steps", "Answer any questions", "Thank patient for coming in", "Wish them well: Take care, we''ll see you [next appointment]!"]}
  ]'::jsonb,
  description = 'Complete checkout ensures continuity of care and proper revenue capture',
  updated_at = now()
WHERE slug = 'checkout';

-- Update Cash Drawer Management to be "Cash Drawer Closing" (since we added Opening separately)
UPDATE sops
SET
  title = 'Cash Drawer Closing & Reconciliation',
  description = 'Accurate closing ensures financial integrity',
  sort_order = 11,
  category = 'closing',
  steps = '[
    {"title": "Count Cash", "details": ["Count all cash by denomination", "Separate starting cash from daily collections", "Count twice to verify accuracy"]},
    {"title": "Calculate Daily Cash Collections", "details": ["Total cash in drawer", "Minus starting cash amount", "Equals daily cash collections"]},
    {"title": "Reconcile with System", "details": ["Run end-of-day cash payment report", "Compare physical cash to system total", "Document any discrepancies"]},
    {"title": "Reconcile Checks", "details": ["Count all checks received", "Match each check to system entries", "Verify amounts match", "Ensure all checks are endorsed", "List checks on deposit log"]},
    {"title": "Reconcile Card Payments", "details": ["Review credit/debit payment report", "Match to card terminal batch", "Close/settle batch for the day", "Verify totals match between systems", "Note any declined or failed transactions"]},
    {"title": "Document & Secure", "details": ["Complete cash closing log with totals", "Note date, time, your name", "Have supervisor review and sign", "Return starting cash to drawer", "Lock drawer in safe/secure location", "Store logs per policy"]}
  ]'::jsonb,
  updated_at = now()
WHERE slug = 'cashdrawer';

-- Update sort orders for logical flow
UPDATE sops SET sort_order = 1 WHERE slug = 'newpatientreg';
UPDATE sops SET sort_order = 2 WHERE slug = 'existingpatientscheduling';
UPDATE sops SET sort_order = 3 WHERE slug = 'schedulingfollowups';
UPDATE sops SET sort_order = 4 WHERE slug = 'newpatientcheckin';
UPDATE sops SET sort_order = 5 WHERE slug = 'existingpatientcheckin';
UPDATE sops SET sort_order = 6 WHERE slug = 'urgentcarecheckin';
UPDATE sops SET sort_order = 7 WHERE slug = 'noshow';
UPDATE sops SET sort_order = 8 WHERE slug = 'waitlist';
UPDATE sops SET sort_order = 9 WHERE slug = 'checkout';
UPDATE sops SET sort_order = 10 WHERE slug = 'multitasking';
UPDATE sops SET sort_order = 12 WHERE slug = 'eodreconciliation';
