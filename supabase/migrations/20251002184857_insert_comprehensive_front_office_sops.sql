/*
  # Insert Comprehensive Front Office SOPs

  1. New SOPs Added
    - New Patient Registration & Scheduling (10 steps)
    - Existing Patient Scheduling (8 steps)
    - New Patient Check-In (14 steps)
    - Existing Patient Check-In (10 steps)
    - Urgent Care / Walk-In Check-In (13 steps)
    - Scheduling Follow-Ups & Recalls (6 steps)
    - Handling No-Shows and Late Arrivals (8 steps)
    - Managing Waitlists and Same-Day Add-Ons (8 steps)
    - Patient Check-Out Procedures (7 steps)
    - Balancing Phones, Messages, and Walk-Ins (8 steps)
    - Cash Drawer Management (5 steps)
    - End-of-Day Reconciliation & Deposit (6 steps)

  2. Organization
    - Organized by category (scheduling, checkin, checkout, during-day, opening-closing, closing)
    - Tagged by patient type (new, existing, both)
    - Sequenced for logical workflow progression
*/

-- New Patient Registration & Scheduling
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'newpatientreg',
  'New Patient Registration & Scheduling',
  '📞',
  'Complete phone-based workflow for registering and scheduling new patients',
  1,
  'scheduling',
  'new',
  '[
    {"title": "Determine if Patient is New or Existing", "details": ["Ask: Have you been seen at [Clinic Name] before?", "If they say no or unsure, proceed to search system", "If they say yes, transfer to existing patient scheduling workflow"]},
    {"title": "Search System to Prevent Duplicate Records", "details": ["CRITICAL: Search before creating new patient record", "Search by: Last Name, First Name, and Date of Birth", "Check for spelling variations (Smith vs. Smyth, Jon vs. John)", "Check for maiden names or previous married names", "Search by phone number if name search unclear", "If patient found: Use existing record and proceed as established patient", "If NOT found after thorough search: Proceed with registration"]},
    {"title": "Collect Patient Demographics", "details": ["Legal full name (First, Middle, Last) - ask them to spell it", "Date of birth (MM/DD/YYYY)", "Social Security Number (optional but helpful for billing)", "Current address (street, city, state, ZIP)", "Primary phone number", "Email address (for appointment reminders and communication)", "Emergency contact name, relationship, and phone number", "Preferred language"]},
    {"title": "Collect Insurance Information", "details": ["Ask: Do you have health insurance?", "If yes: Collect insurance company name and member ID over phone", "Inform: Please bring your insurance card and ID to your appointment", "If your clinic has pre-visit electronic intake: You can also upload your insurance card through the link we will send you", "If no insurance: Note as self-pay"]},
    {"title": "Quick Insurance Verification (Check if Accepted)", "details": ["Run quick eligibility check to confirm insurance is accepted by clinic", "Verify plan is active and patient is covered", "If insurance not accepted or not active: Inform patient they will be self-pay", "Note: Full verification with copay details will be done 48-72 hours before appointment", "Document basic verification in system"]},
    {"title": "Determine Appointment Type & Check Schedule", "details": ["Ask: What is the reason for your visit?", "Determine appropriate appointment type and length", "Ask about provider preference if applicable", "Check provider schedule for new patient slots (typically 30-60 minutes)", "Offer 2-3 available date/time options", "Book appointment with type marked as New Patient"]},
    {"title": "Confirm Appointment & Provide Instructions", "details": ["Confirm: [Day], [Date] at [Time] with [Provider Name]", "Provide clinic address and parking instructions", "Instruct: Please arrive 10-15 minutes early to complete paperwork", "Inform what to bring: Photo ID, insurance card(s), current medication list, copay", "If applicable: We will send you a link to complete forms electronically before your visit", "If copay amount known: Your copay will be $[amount], due at check-in"]},
    {"title": "Set Up Appointment Reminders", "details": ["Enter appointment in system", "Set automatic appointment reminders per clinic protocol", "Confirm patient preferred contact method for reminders", "Mention cancellation policy: 24-hour notice required for cancellations"]},
    {"title": "Send Pre-Visit Forms (If Applicable)", "details": ["If clinic uses electronic pre-visit intake: Send portal invitation/forms link", "If not: Inform patient they will complete forms at check-in", "Note in system if forms sent electronically"]},
    {"title": "Document Registration", "details": ["Create new patient record in system immediately", "Enter all collected demographics", "Enter insurance information", "Flag as New Patient", "Set reminder for full insurance verification 48-72 hours before visit", "Document date registered and who registered the patient", "Add any special notes (accessibility needs, interpreter, etc.)"]}
  ]'::jsonb
);

-- Existing Patient Scheduling
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'existingpatientscheduling',
  'Existing Patient Scheduling',
  '📅',
  'Phone-based workflow for scheduling appointments for established patients',
  2,
  'scheduling',
  'existing',
  '[
    {"title": "Verify Patient Identity", "details": ["Ask: Can I have your full name and date of birth?", "Search for patient in system", "Confirm you have correct patient record"]},
    {"title": "Confirm Current Contact Information", "details": ["Ask: Is your phone number still [number]?", "Ask: Is your address still [address]?", "Update any changes in system immediately", "Verify email address if used for communications"]},
    {"title": "Ask About Insurance Changes", "details": ["Ask: Is your insurance still [Insurance Name]?", "If changed: Collect new insurance information", "Inform: Please bring your new insurance card to your appointment", "Note in system if insurance changed"]},
    {"title": "Determine Appointment Need", "details": ["Ask: What is the reason for your visit?", "Determine if follow-up, routine visit, or new issue", "Check if specific provider requested", "Assess urgency"]},
    {"title": "Check Schedule & Book Appointment", "details": ["Search schedule for available slots", "Consider appointment type and length needed", "Offer 2-3 date/time options", "Book appointment in system with correct type"]},
    {"title": "Confirm Appointment Details", "details": ["Confirm: [Day], [Date] at [Time] with [Provider]", "Remind about clinic location if applicable", "If copay known: Your copay is $[amount], due at check-in", "Ask: Does that work for you?"]},
    {"title": "Set Appointment Reminders", "details": ["Verify reminder preferences have not changed", "Set automatic reminders per clinic protocol", "Mention cancellation policy if new or changed"]},
    {"title": "Document Scheduling", "details": ["Update appointment in system", "Note reason for visit", "Document any information changes", "Set insurance re-verification reminder if insurance changed or last visit was >30 days ago"]}
  ]'::jsonb
);

-- New Patient Check-In
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'newpatientcheckin',
  'New Patient Check-In',
  '👋',
  'Comprehensive check-in process for new patients with scheduled appointments',
  3,
  'checkin',
  'new',
  '[
    {"title": "Greet Patient Warmly", "details": ["Stand or make eye contact and smile", "Say: Good morning/afternoon! Welcome to [Clinic name]", "Ask: Is this your first visit with us?", "If yes: Welcome! I will get you checked in", "Offer seat at check-in desk or private area"]},
    {"title": "Verify Patient Identity", "details": ["Ask: Can I see your ID and insurance card please?", "Check photo ID matches patient in front of you", "Verify name spelling matches registration", "Confirm date of birth verbally", "Check that insurance card matches what is in system", "If discrepancy, ask: Has anything changed since you registered?"]},
    {"title": "Scan/Copy ID and Insurance Cards", "details": ["Make copies or scan front and back of ID", "Scan front and back of insurance card(s)", "If insurance card different from registration, update in system", "Upload images to patient account", "Return original documents to patient immediately", "Note in system: ID and insurance cards scanned [date]"]},
    {"title": "Quick Insurance Eligibility Confirmation", "details": ["If insurance was verified 48-72 hours ago, just confirm it is still active", "Run quick eligibility check in system (takes 30-60 seconds)", "Verify coverage is active today", "Confirm patient has not changed insurance since verification", "If any issues appear, flag for billing team but proceed with check-in", "Note: Full verification already done, this is just confirmation"]},
    {"title": "Review & Collect Forms", "details": ["Ask: Were you able to complete the forms we sent?", "If completed electronically: Pull up in system to verify", "If not completed: Provide paper forms with clipboard", "Required forms: Medical history, current medications, allergies, HIPAA consent, financial policy, consent for treatment", "Review for completeness - all required fields filled out", "Check for patient signature and date on all consent forms", "If incomplete, ask patient to complete missing sections"]},
    {"title": "Confirm & Update Information", "details": ["Verify address is still current", "Confirm phone numbers are correct", "Verify email address for communications", "Ask: Who should we contact in case of emergency? (name, relationship, phone)", "Confirm preferred language and communication method", "Update any changed information in system immediately"]},
    {"title": "Collect Copay", "details": ["State copay amount clearly: Your copay today is $[amount]", "Explain: This is required by your insurance at time of service", "Accept payment: cash, check, or card", "Process payment in system immediately", "Apply to today date of service", "Generate and provide receipt", "Thank patient for payment"]},
    {"title": "Set Up Patient Portal Access", "details": ["Ask: Have you activated your patient portal account?", "If no: Provide login instructions or send activation email now", "Write down portal website URL on information sheet", "Explain portal features: view test results, message provider, request refills, schedule appointments", "Offer: Would you like me to show you how to log in?", "Provide portal support phone number for technical issues"]},
    {"title": "Explain Clinic Policies", "details": ["Office hours and how to reach clinic after hours", "Prescription refill process and timeline", "Cancellation policy: 24-hour notice required", "No-show policy if applicable", "Patient portal usage for non-urgent questions", "Payment policy for outstanding balances", "Where to find patient resources or education materials"]},
    {"title": "Provide Clinic Information", "details": ["Give patient folder or packet with clinic information", "Include: clinic contact information, provider bios, location map, parking info", "Provide information about other services offered", "Include patient rights and responsibilities document", "Give copy of financial policy and HIPAA notice if not in portal"]},
    {"title": "Orient to Facility", "details": ["Point out restroom location", "Show where waiting area is", "Explain check-in process: Please have a seat and we will call you back soon", "Mention estimated wait time if known", "Explain they may be called to update vitals before seeing provider", "Point out water fountain or refreshments if available"]},
    {"title": "Final Check & Questions", "details": ["Ask: Do you have any questions before you wait?", "Confirm patient has everything they need", "Ensure patient knows they are welcome to ask staff for help", "Verify patient has all their personal belongings", "Direct patient to waiting area"]},
    {"title": "Notify Clinical Staff", "details": ["Update patient status in system to Checked In", "Alert clinical staff that new patient is ready", "Note any special circumstances (patient anxious, language barrier, etc.)", "Mention if patient has urgent concerns", "Flag if forms are incomplete or information is missing", "Document check-in time in system"]},
    {"title": "Document Check-In", "details": ["Note in system: New patient check-in complete [date/time]", "Document copay collected", "Note insurance verified at check-in", "Document that ID and insurance cards were scanned", "Note that all forms were collected and reviewed", "Flag any outstanding items for follow-up"]}
  ]'::jsonb
);

-- Existing Patient Check-In
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'existingpatientcheckin',
  'Existing Patient Check-In',
  '✅',
  'Streamlined check-in process for established patients',
  4,
  'checkin',
  'existing',
  '[
    {"title": "Greet Patient", "details": ["Greet by name if you recognize them: Good morning, Mr./Ms. [Name]", "Make eye contact and smile", "Say: I will get you checked in", "Keep process brief and efficient for established patients"]},
    {"title": "Verify Patient Identity", "details": ["Confirm name and date of birth verbally", "Pull up patient account in system", "Verify you have correct patient record", "Check for any alerts or flags on account (outstanding balance, special needs, etc.)"]},
    {"title": "Ask About Changes to Information", "details": ["Ask: Has anything changed since your last visit?", "Specifically ask about: address, phone number, email, insurance", "If yes to any: What has changed?", "Request updated insurance card if insurance changed", "Update information in system immediately"]},
    {"title": "Verify/Update Insurance (If Applicable)", "details": ["If insurance changed: Request new insurance card, scan front and back", "If same insurance: Visual check that card matches system", "If insurance not verified recently: Run quick eligibility check", "If last visit was >30 days ago: Consider re-verification", "Update system with any new insurance information", "Note verification date in system"]},
    {"title": "Check for Required Form Updates", "details": ["Check if annual consent forms need renewal", "HIPAA acknowledgment may need annual signature", "Financial policy may need re-signing if updated", "Check if updated medical history is needed", "If forms needed: provide clipboard with forms", "Review for completeness and signature"]},
    {"title": "Collect Copay", "details": ["State copay amount: Your copay today is $[amount]", "If copay changed: Explain why (plan change, visit type, etc.)", "Accept payment: cash, check, or card", "Process payment in system", "Apply to today date of service", "Provide receipt", "Thank patient"]},
    {"title": "Address Outstanding Balances", "details": ["If patient has outstanding balance, mention it: You have a balance of $[amount] from [previous visit]", "Ask: Would you like to make a payment toward that today?", "Accept payment if offered", "If unable to pay: Mention payment plan options", "Do not delay check-in for old balances - handle at checkout or later", "Note any payment or payment plan discussion in system"]},
    {"title": "Confirm Appointment Details", "details": ["Verify patient is there for correct appointment type", "Confirm provider name if patient asks", "Mention estimated wait time if asked", "Note if patient arrived late (may affect ability to be seen)"]},
    {"title": "Update Patient Status & Notify Staff", "details": ["Mark patient as Checked In in system", "Note check-in time", "Alert clinical staff that patient is ready", "Communicate any special circumstances or urgency", "Direct patient to waiting area"]},
    {"title": "Quick Documentation", "details": ["Note in system: Patient checked in [date/time]", "Document copay collected", "Note any information updates", "Document insurance verification if done", "Flag any issues for follow-up"]}
  ]'::jsonb
);

-- Urgent Care Walk-In Check-In
INSERT INTO sops (slug, title, icon, description, sort_order, category, patient_type, steps)
VALUES (
  'urgentcarecheckin',
  'Urgent Care / Walk-In Check-In',
  '🚨',
  'Rapid check-in protocol for urgent, same-day, and walk-in patients',
  5,
  'checkin',
  'both',
  '[
    {"title": "Immediate Triage & Safety Assessment", "details": ["Greet immediately: Hello, how can I help you?", "Ask: What brings you in today?", "Assess urgency: Is this life-threatening? Severe pain? Difficulty breathing?", "If life-threatening: Call for clinical staff or 911 immediately", "If urgent but stable: Proceed with expedited check-in", "If routine: Explain process and expected wait time"]},
    {"title": "Determine New vs. Existing Patient", "details": ["Ask: Have you been seen here before?", "If existing: Search for patient in system by name and DOB", "If new: Begin rapid registration process", "If unsure: Search thoroughly before creating duplicate record"]},
    {"title": "Rapid Registration (New Patients Only)", "details": ["Collect essential information only - full registration can happen later", "Legal name, date of birth, address, phone number", "Emergency contact name and number", "Chief complaint (brief)", "Current medications and allergies (critical for safety)", "Create patient account with minimal required fields", "Note: Urgent walk-in - full registration pending"]},
    {"title": "Collect ID & Insurance Card", "details": ["Request photo ID and insurance card", "Scan or make copies quickly", "If patient does not have cards: Note this and proceed anyway", "Can obtain later if needed - do not delay urgent care", "Return originals to patient immediately"]},
    {"title": "Run Insurance Eligibility Check", "details": ["CRITICAL: No pre-verification was done, so check NOW", "Run real-time eligibility check in system", "Verify coverage is active today", "Check if referral or authorization required for urgent care", "Note copay amount if system provides it", "If eligibility system is down: Proceed and verify later, note in account", "Document verification attempt and results"]},
    {"title": "Determine Financial Responsibility", "details": ["If insurance active: Inform copay amount if known", "If insurance inactive or no coverage: Explain self-pay status", "Urgent care copays are often higher than primary care", "State: Your copay for urgent care today is $[amount]", "If self-pay: Provide estimate and payment options", "Some clinics require deposit for self-pay urgent visits"]},
    {"title": "Collect Copay or Deposit", "details": ["Collect copay if insurance verified and patient able to pay", "If self-pay: Collect deposit or full estimated payment per clinic policy", "If patient unable to pay: Follow clinic policy (may still treat, set up payment plan, etc.)", "Process payment in system", "Provide receipt", "Do not delay urgent care for payment if patient is in distress"]},
    {"title": "Essential Consents Only", "details": ["Consent for treatment (required)", "HIPAA notice acknowledgment (required)", "Financial responsibility (if time permits)", "Skip non-essential forms - can be completed after care", "Obtain signature quickly", "Provide copies if possible or note they will be sent later"]},
    {"title": "Brief Medical History", "details": ["Chief complaint in patient words", "Current medications (write down or have patient provide list)", "Known drug allergies - THIS IS CRITICAL", "Relevant chronic conditions", "Recent similar episodes or related care", "Enter into system or provide to clinical staff on paper"]},
    {"title": "Alert Clinical Staff Immediately", "details": ["Update patient status to Checked In - Urgent", "Notify nurse or MA immediately - do not wait", "Communicate severity level and chief complaint", "Provide any critical medical information (allergies, current meds)", "If very urgent: Walk patient back to clinical area or exam room yourself", "Document check-in time and urgency level"]},
    {"title": "Set Expectations with Patient", "details": ["Explain: A nurse will be with you shortly to assess you", "Provide estimated wait time if possible (often cannot in urgent situations)", "Direct to waiting area or directly to exam room depending on severity", "Explain they may need to wait for test results, x-rays, etc.", "Provide restroom location", "Ask them to alert staff if condition worsens while waiting"]},
    {"title": "Complete Registration After Care", "details": ["Once patient is stable and being treated, complete full registration", "Fill in any missing demographic information", "Scan all documents that were not captured initially", "Complete full insurance verification if not done at check-in", "Have patient sign any remaining consent forms", "Update account from partial registration to complete"]},
    {"title": "Document Thoroughly", "details": ["Note: Urgent care walk-in - checked in [time]", "Document chief complaint and urgency level", "Note if insurance verified or pending verification", "Document payment collected or self-pay status", "Note if full registration is pending", "Flag account for follow-up on any missing information", "Document all communication with clinical staff"]}
  ]'::jsonb
);

-- Continue with remaining SOPs in next part due to length...