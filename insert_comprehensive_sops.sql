-- Delete existing SOPs to start fresh
DELETE FROM sops;

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
    {
      "title": "Determine if Patient is New or Existing",
      "details": [
        "Ask: ''Have you been seen at [Clinic Name] before?''",
        "If they say no or unsure, proceed to search system",
        "If they say yes, transfer to existing patient scheduling workflow"
      ]
    },
    {
      "title": "Search System to Prevent Duplicate Records",
      "details": [
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
      "title": "Collect Patient Demographics",
      "details": [
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
      "title": "Collect Insurance Information",
      "details": [
        "Ask: ''Do you have health insurance?''",
        "If yes: Collect insurance company name and member ID over phone",
        "Inform: ''Please bring your insurance card and ID to your appointment''",
        "If your clinic has pre-visit electronic intake: ''You can also upload your insurance card through the link we''ll send you''",
        "If no insurance: Note as self-pay"
      ]
    },
    {
      "title": "Quick Insurance Verification (Check if Accepted)",
      "details": [
        "Run quick eligibility check to confirm insurance is accepted by clinic",
        "Verify plan is active and patient is covered",
        "If insurance not accepted or not active: Inform patient they''ll be self-pay",
        "Note: Full verification with copay details will be done 48-72 hours before appointment",
        "Document basic verification in system"
      ]
    },
    {
      "title": "Determine Appointment Type & Check Schedule",
      "details": [
        "Ask: ''What is the reason for your visit?''",
        "Determine appropriate appointment type and length",
        "Ask about provider preference if applicable",
        "Check provider schedule for new patient slots (typically 30-60 minutes)",
        "Offer 2-3 available date/time options",
        "Book appointment with type marked as ''New Patient''"
      ]
    },
    {
      "title": "Confirm Appointment & Provide Instructions",
      "details": [
        "Confirm: ''[Day], [Date] at [Time] with [Provider Name]''",
        "Provide clinic address and parking instructions",
        "Instruct: ''Please arrive 10-15 minutes early to complete paperwork''",
        "Inform what to bring: Photo ID, insurance card(s), current medication list, copay",
        "If applicable: ''We''ll send you a link to complete forms electronically before your visit''",
        "If copay amount known: ''Your copay will be $[amount], due at check-in''"
      ]
    },
    {
      "title": "Set Up Appointment Reminders",
      "details": [
        "Enter appointment in system",
        "Set automatic appointment reminders per clinic protocol",
        "Confirm patient''s preferred contact method for reminders",
        "Mention cancellation policy: ''24-hour notice required for cancellations''"
      ]
    },
    {
      "title": "Send Pre-Visit Forms (If Applicable)",
      "details": [
        "If clinic uses electronic pre-visit intake: Send portal invitation/forms link",
        "If not: Inform patient they''ll complete forms at check-in",
        "Note in system if forms sent electronically"
      ]
    },
    {
      "title": "Document Registration",
      "details": [
        "Create new patient record in system immediately",
        "Enter all collected demographics",
        "Enter insurance information",
        "Flag as ''New Patient''",
        "Set reminder for full insurance verification 48-72 hours before visit",
        "Document date registered and who registered the patient",
        "Add any special notes (accessibility needs, interpreter, etc.)"
      ]
    }
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
    {
      "title": "Verify Patient Identity",
      "details": [
        "Ask: ''Can I have your full name and date of birth?''",
        "Search for patient in system",
        "Confirm you have correct patient record"
      ]
    },
    {
      "title": "Confirm Current Contact Information",
      "details": [
        "Ask: ''Is your phone number still [number]?''",
        "Ask: ''Is your address still [address]?''",
        "Update any changes in system immediately",
        "Verify email address if used for communications"
      ]
    },
    {
      "title": "Ask About Insurance Changes",
      "details": [
        "Ask: ''Is your insurance still [Insurance Name]?''",
        "If changed: Collect new insurance information",
        "Inform: ''Please bring your new insurance card to your appointment''",
        "Note in system if insurance changed"
      ]
    },
    {
      "title": "Determine Appointment Need",
      "details": [
        "Ask: ''What is the reason for your visit?''",
        "Determine if follow-up, routine visit, or new issue",
        "Check if specific provider requested",
        "Assess urgency"
      ]
    },
    {
      "title": "Check Schedule & Book Appointment",
      "details": [
        "Search schedule for available slots",
        "Consider appointment type and length needed",
        "Offer 2-3 date/time options",
        "Book appointment in system with correct type"
      ]
    },
    {
      "title": "Confirm Appointment Details",
      "details": [
        "Confirm: ''[Day], [Date] at [Time] with [Provider]''",
        "Remind about clinic location if applicable",
        "If copay known: ''Your copay is $[amount], due at check-in''",
        "Ask: ''Does that work for you?''"
      ]
    },
    {
      "title": "Set Appointment Reminders",
      "details": [
        "Verify reminder preferences haven''t changed",
        "Set automatic reminders per clinic protocol",
        "Mention cancellation policy if new or changed"
      ]
    },
    {
      "title": "Document Scheduling",
      "details": [
        "Update appointment in system",
        "Note reason for visit",
        "Document any information changes",
        "Set insurance re-verification reminder if insurance changed or last visit was >30 days ago"
      ]
    }
  ]'::jsonb
);

-- Continue with remaining SOPs...
-- (Due to length, I'll create a script file to insert all the data)
