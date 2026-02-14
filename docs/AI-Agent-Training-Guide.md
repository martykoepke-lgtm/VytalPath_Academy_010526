# VytalPath Academy -- AI Study Assistant Training Guide

> **In-app version:** This guide is also available to students inside the app at `/ai-guide` (sidebar: AI Study Guide). The in-app version is the primary student-facing resource. This document serves as the comprehensive reference for administrators, trainers, and developers.

## One Button, Five Learning Experiences

Every page in VytalPath Academy has an **AI Study Assistant** built in. Click the chat bubble in the bottom-right corner, and a panel slides open with an AI tutor ready to help. But here is what makes it powerful: you are not limited to one type of help.

At the top of the panel, you will see a **mode selector** -- a small badge showing which agent is active. Click it, and a dropdown appears with five distinct modes:

| Mode | Icon | One-Line Description |
|------|------|----------------------|
| **Tutor** | Blue bot | Answers questions about what you are studying right now |
| **EHR Coach** | Teal stethoscope | Walks you through EHR Practice Lab workflows step by step |
| **Practice** | Green clipboard | Generates ungraded practice questions targeting your weak areas |
| **Patient Sim** | Purple users | Role-plays as a patient at your front desk |
| **Scenarios** | Amber document | Presents realistic workplace situations requiring SOP knowledge |

**You can switch between all five modes from any page, at any time, without navigating away.** The dropdown is always available. Switching modes starts a fresh conversation with the new agent.

---

## How the Modes Work: Page-Aware vs. You-Aware

The five modes fall into two categories, and understanding this distinction is the key to getting the most out of the system.

### Page-Aware Modes (adapt to where you are)

These modes change their behavior based on which section, lesson, or tool you are currently viewing.

**Tutor** -- If you are on the Insurance section, the Tutor prioritizes insurance topics. If you are on Compliance, it focuses on HIPAA and healthcare law. It reads your current location and tailors every answer to what you are studying.

**EHR Coach** -- When you are inside the EHR Practice Lab, the Coach can see your live session state: which patient chart is open, what appointment is selected, and what screen you are on. It gives precise, contextual instructions like "Click Check In on Maria Santos' 8:30 AM appointment." It still works from other pages, but it is most powerful inside the Lab.

### You-Aware Modes (adapt to your progress)

These modes do not depend on what page you are on. They analyze your quiz scores, competency levels, and practice history to personalize every interaction.

**Practice** -- Reads your weakness profile and generates questions focused on the domains and topics where you are struggling. Works the same whether you open it from Insurance, Workflows, or the Progress dashboard.

**Patient Sim** -- Calibrates the patient's scenario to your gaps. If your insurance knowledge is weak, the patient shows up with a complicated insurance card. If communication is a gap, the patient is anxious or frustrated. Your weakness profile drives the scenario, not the page you are on.

**Scenarios** -- Generates SOP-based workplace situations. The type of scenario (opening procedures, check-in, insurance verification, etc.) is drawn from the full curriculum, not limited to your current section.

### What This Means in Practice

Imagine you are on the **Insurance & Billing** section page. Without leaving that page, you can:

1. **Tutor** -- "What is the difference between HMO and PPO?" -- Gets an answer tailored to the Insurance section content
2. **Practice** -- Instantly receive a practice question weighted toward your weakest insurance topic
3. **Patient Sim** -- A patient walks in holding two insurance cards and asks which one to use
4. **Scenarios** -- "A patient calls disputing a denied claim. The EOB shows..." -- You walk through the steps
5. **EHR Coach** -- "How do I verify insurance in the EHR?" -- Still works, though it shines most inside the Lab

Five completely different learning experiences. One dropdown. No navigation required.

---

## Detailed Mode Reference

### 1. Tutor (Default)

| | |
|---|---|
| **Icon** | Blue bot |
| **Category** | Page-aware |
| **Activates** | Automatically when you open the chat panel |

The Tutor answers questions about whatever section you are currently studying. It draws from a comprehensive healthcare front office knowledge base covering HIPAA, insurance workflows, patient registration, scheduling, EHR systems, medical terminology, and more.

**Example interactions:**
- "What is the difference between a copay and coinsurance?"
- "Explain the minimum necessary standard under HIPAA."
- "What are the steps for new patient registration?"

The Tutor keeps answers short, uses plain language, and references the specific section you are viewing.

---

### 2. EHR Coach

| | |
|---|---|
| **Icon** | Teal stethoscope |
| **Category** | Page-aware (strongest inside the EHR Practice Lab) |
| **Activates** | Select "EHR Coach" from the mode dropdown |

The EHR Coach provides step-by-step guidance as you work through the EHR Practice Lab simulation. It can see your current lab state -- which patient you are viewing, what appointment is selected, and what screen you are on.

**Example interactions:**
- "How do I register a new patient?"
- "I need to check in Maria Santos for her 8:30 appointment."
- "Walk me through the check-out process."
- "How do I schedule a follow-up visit?"

**What makes it special:**
- Responses are limited to 2-3 sentences -- it guides you without doing the work for you
- It references actual patient names and appointment times from your current session
- It knows the clinic details: Mountain View Family Practice, Dr. Sarah Chen, and all five seeded patients

---

### 3. Practice (Adaptive Assessment)

| | |
|---|---|
| **Icon** | Green clipboard |
| **Category** | You-aware (works from any page) |
| **Activates** | Select "Practice" from the mode dropdown |

Generates original, ungraded practice questions targeted at your weakest areas. It reads your quiz history and competency progress to identify gaps, then creates questions focused on those topics.

**Example interactions:**
- "Quiz me on my weakest areas."
- "Give me a practice question about insurance verification."
- "I want to practice HIPAA scenarios."

**How it adapts:**
- **2 correct in a row** -- difficulty increases
- **2 wrong in a row** -- difficulty decreases
- Questions use standard A/B/C/D multiple-choice format
- Each answer is followed by an immediate explanation

**Practice questions appear as interactive cards.** Select your answer, then the card reveals whether you were correct with an explanation. Green = correct, amber = incorrect.

**Important: Practice is completely ungraded.** Practice sessions are tracked separately and never affect your quiz scores, progress percentages, or certificate eligibility.

---

### 4. Patient Sim

| | |
|---|---|
| **Icon** | Purple users |
| **Category** | You-aware (works from any page) |
| **Activates** | Select "Patient Sim" from the mode dropdown |

The AI role-plays as a patient presenting at the front desk. The scenario is calibrated to your specific weakness areas.

**How a session works:**
1. Switch to Patient Sim mode -- the AI introduces itself as a patient with a specific situation
2. Respond as you would at a real front desk
3. Continue the conversation naturally
4. When ready to end, indicate you want to wrap up

**Example scenario flow:**
> **AI (as patient):** "Hi, I'm here for my 2:00 appointment with Dr. Chen. I also got a new insurance card -- do I need to update anything?"
>
> **You:** "Welcome! Yes, I'll need to make a copy of your new insurance card and verify your coverage. Can I also confirm your current address and phone number?"
>
> **AI (as patient):** "Sure, here's the card. My address is the same but I have a new phone number."

**Evaluation at scenario end:**
- **Overall Rating:** X out of 5 stars
- **Competencies Demonstrated:** What you did well
- **Competency Gaps:** Areas to review
- **Key Takeaway:** One-sentence summary

---

### 5. Scenarios (SOP Practice)

| | |
|---|---|
| **Icon** | Amber document |
| **Category** | You-aware (works from any page, pairs well with Workflows section) |
| **Activates** | Select "Scenarios" from the mode dropdown |

Presents realistic workplace scenarios that test your Standard Operating Procedure knowledge. After you describe the steps you would take, it evaluates correctness, completeness, and sequencing.

**Example scenario:**
> **AI:** "It's Monday morning and you're the first to arrive at Mountain View Family Practice. The phones are already ringing, the waiting room door is locked, and the day's schedule shows 22 patients. What are your first steps?"
>
> **You:** "First, I'd disarm the alarm and turn on the lights. Then unlock the front door, log into the EHR and phone system, print the daily schedule, and check for any flagged patient notes or prior authorization follow-ups."
>
> **AI:** "Good sequence! You correctly identified the opening procedure steps. You missed one item: checking the fax queue for overnight lab results and referral responses. That step comes after logging into systems but before reviewing the schedule. Complexity: 3/5. Want to try another scenario?"

**Scenario categories:** Opening procedures, scheduling, check-in, check-out, insurance verification, HIPAA compliance, closing procedures, and administrative tasks.

---

## Recommended Mode Pairings by Section

Not sure which mode to use? Here is what works best on each section page.

| Section You Are On | Best First Mode | Great Follow-Up Mode | Why |
|---|---|---|---|
| Foundations | Tutor | Practice | Learn the concepts, then test yourself |
| Compliance | Tutor | Patient Sim | Study HIPAA rules, then handle a patient with a privacy concern |
| Insurance & Billing | Tutor | Practice | Understand the terms, then drill the details |
| Workflows | Tutor | Scenarios | Review the SOPs, then test recall with a workplace scenario |
| EHR & Practice Management | Tutor | EHR Coach | Read about the systems, then practice inside the Lab |
| EHR Practice Lab | EHR Coach | Patient Sim | Get guided through workflows, then handle a patient interaction |
| Communication | Tutor | Patient Sim | Study communication skills, then practice with a simulated patient |
| Medical Terminology | Tutor | Practice | Review terms and roots, then get quizzed |
| Progress Dashboard | Practice | Scenarios | Target your weak areas, then test them in context |

---

## Suggested Actions: The AI Finds Your Next Step

When you open the chat panel, the system may display a **suggested action card** at the top -- a personalized recommendation based on your current progress. You do not need to search for it. The system checks your data and surfaces the most impactful next step.

| What the System Detects | What It Recommends | What Happens When You Click Start |
|---|---|---|
| You failed a quiz | "Retry Quiz" | Opens Practice mode with questions on the failed topic |
| A competency domain is below 70% | "Practice Weak Area" | Opens Practice mode targeting that domain |
| You have never opened the EHR Lab | "Try EHR Lab" | Navigates to EHR Lab and activates EHR Coach mode |
| You have never tried SOP practice | "Practice SOPs" | Navigates to Workflows and activates Scenarios mode |

These cards appear automatically. Each includes a short explanation and a **Start** button that navigates you to the right place and activates the right mode -- no manual setup needed.

---

## Job Readiness Practice Tools (AI-Powered)

The Job Readiness section includes four additional AI-powered practice tools. These are separate from the five chat modes -- they are dedicated simulation experiences with their own interfaces.

### Phone Call Simulator
- **AI role:** Plays the caller (patient, insurance rep, referring office, etc.)
- **6 difficulty levels:** New patient scheduling, insurance questions, prescription refills, angry patients, referral calls, emergency triage
- **Evaluation:** When the call ends, the AI rates your call quality, professionalism, and accuracy

### Mock Interview
- **AI role:** Plays the hiring manager
- **2 interview roles:** Medical Receptionist or Insurance Specialist
- **Format:** 8-10 progressively difficult questions with brief coaching after each answer
- **Evaluation:** Overall impression (1-5 stars), top strengths, improvement areas, model answers for weak responses, and a hiring recommendation

### Insurance Hotline Practice
- **AI role:** Plays the insurance company representative
- **Realism elements:** Requires proper verification (member ID, patient name, DOB, tax ID/NPI) before sharing information; includes hold times, repeat requests, and department transfers
- **Skills practiced:** Verification workflow, benefit interpretation, prior authorization inquiries

### Day in the Life Simulation
- **AI role:** Presents 10-12 consecutive situations across a full workday (8 AM to 5 PM)
- **Situation types:** Patient interactions, phone calls, insurance issues, HIPAA moments, scheduling conflicts, emergencies
- **Evaluation:** Overall rating, situations handled correctly, strengths, improvement areas, and critical errors

---

## Medical Terminology Analyzer

A standalone AI tool available on the Medical Terminology section that breaks down medical terms into their component parts.

**How to use it:**
1. Navigate to the Medical Terminology section
2. Enter a medical term (e.g., "cardiomegaly")
3. The analyzer returns the prefix, root, and suffix with meanings, a full definition, and an example sentence

This tool operates independently from the chat-based agents.

---

## Section Context Awareness

The AI system is context-aware -- it knows which section, lesson, or tool you are currently using and adjusts its responses accordingly.

| Where you are | What the AI knows |
|---|---|
| Foundations section | Healthcare delivery, settings, inpatient vs ambulatory |
| Compliance section | HIPAA, patient rights, healthcare law, workplace safety |
| Insurance section | Payer types, plan structures, billing, coding, referrals |
| Workflows section | Registration, scheduling, SOPs, administrative skills |
| EHR & PM section | Encounter types, PM vs EHR systems, telehealth, portals |
| Terminology section | Prefixes, roots, suffixes, medical abbreviations |
| EHR Practice Lab | Current patient, appointment, view state, encounter details |
| Job Readiness tools | Current practice mode and scenario instructions |
| Progress dashboard | Your competency levels and weakness profile |

---

## Rate Limits and Session Management

- **Message limit:** 30 messages per 15-minute window per user
- **Message history:** The chat retains up to 50 messages per session
- **Conversation reset:** Switching agent modes or clicking the clear button resets the conversation
- **Authentication:** The AI is only available to signed-in users with an active session

---

## How Practice Data is Tracked

| Data Type | Storage | Affects Grades? |
|---|---|---|
| Graded quiz scores | `vytalpath_progress` (localStorage) | Yes |
| Lesson completion | `vytalpath_progress` (localStorage) | Yes |
| AI practice questions | `vytalpath_practice_sessions` (localStorage) | No |
| Phone/Interview/Hotline sessions | `vytalpath_phone_sim` (localStorage) | No |
| Certificate eligibility | Supabase `certificates` table | N/A (outcome) |

Practice data feeds into the student weakness profile to improve AI recommendations, but it never modifies quiz pass/fail status or certificate eligibility.

---

## Quick Reference: Every AI Trigger in the Platform

### Chat Panel Modes (available from any page via the dropdown)

| User Action | Mode | What Happens |
|---|---|---|
| Click chat button | **Tutor** | Opens by default, answers questions about current section |
| Select "EHR Coach" | **EHR Coach** | Guides EHR Lab workflows with live session awareness |
| Select "Practice" | **Practice** | Generates ungraded questions targeting your weak areas |
| Select "Patient Sim" | **Patient Sim** | Role-plays as a patient calibrated to your gaps |
| Select "Scenarios" | **Scenarios** | Presents workplace situations requiring SOP knowledge |

### Job Readiness Tools (dedicated interfaces under Practice section)

| User Action | AI Role | What Happens |
|---|---|---|
| Start Phone Simulator | Caller | AI plays patient, insurance rep, or referring office |
| Start Mock Interview | Hiring manager | 8-10 questions with coaching and final evaluation |
| Start Insurance Hotline | Insurance rep | Verification-gated conversation with hold times and transfers |
| Start Day in the Life | Situation presenter | 10-12 scenarios across a full workday |

### Standalone Tools

| User Action | Tool | What Happens |
|---|---|---|
| Enter term in Terminology Analyzer | Term Analyzer | Breaks down medical term into prefix, root, suffix |

### Automatic Suggested Actions (appear when you open the chat)

| What the System Detects | What Appears |
|---|---|
| Failed quiz | "Retry Quiz" card with one-click Start |
| Domain below 70% | "Practice Weak Area" card |
| Never used EHR Lab | "Try EHR Lab" card |
| Never tried SOP scenarios | "Practice SOPs" card |

---

## How It All Connects

```
  ANY PAGE IN VYTALPATH ACADEMY
          |
          |  Click chat bubble (bottom-right)
          v
  +---------------------------+
  |   AI Study Assistant      |
  |   [Mode Selector v]       |  <-- Dropdown: Tutor / EHR Coach / Practice / Patient Sim / Scenarios
  |                           |
  |   [Suggested Action Card] |  <-- Appears if system detects a weakness or gap
  |                           |
  |   [Conversation]          |  <-- AI responds based on selected mode
  |                           |
  |   Page-aware modes:       |      You-aware modes:
  |   Tutor reads your        |      Practice, Patient Sim, and
  |   current section.        |      Scenarios read your weakness
  |   EHR Coach reads your    |      profile and quiz history.
  |   live lab state.         |      They work equally well
  |                           |      from any page.
  +---------------------------+
```

---

## Tips for Students

1. **Start with Tutor** while studying lessons -- ask clarifying questions as you read
2. **Switch to Practice** after any quiz, especially if you scored below 80% -- it targets exactly what you missed
3. **Use EHR Coach** the first time you open the Practice Lab -- it walks you through each workflow
4. **Try Patient Sim** after the Communication section -- practice handling real interactions with a scored evaluation
5. **Use Scenarios** before or after reviewing SOPs -- test whether you can recall the correct steps in order
6. **Watch for suggested action cards** -- the system automatically surfaces your most impactful next step
7. **You do not need to navigate anywhere to switch modes** -- the dropdown is always at the top of the chat panel
8. **Practice is always safe** -- nothing from the AI agents affects your quiz scores or certificate
