# Multi-Agent Orchestration — Validation Testing Guide

## Overview

This document defines what to look for when testing the 5 AI agent modes and their supporting infrastructure. The system was built on top of the existing AI tutor Edge Function — agents are specialized system prompt strategies, not separate services.

**Key grading boundary:** Adaptive practice is always **ungraded**. It is tracked separately in `vytalpath_practice_sessions` (localStorage). Standardized quizzes remain the **graded gates** (80% pass, 3 attempts). Practice data never affects quiz scores, certificate eligibility, or core competency levels.

---

## 1. Agent Mode Switcher (ChatPanel)

### What to test
- Open the AI Study Assistant (chat icon, bottom-right corner)
- Look for the **agent mode indicator** below the header — should show "Tutor" by default with a blue badge
- Click the badge to open the **mode dropdown**
- Available modes: Tutor, EHR Coach, Practice Qs, Patient Sim, SOP Scenarios

### Expected behavior
| Action | Expected |
|--------|----------|
| Open chat on any page | Default mode = "Tutor" with blue badge |
| Click badge | Dropdown appears with all 5 modes |
| Switch to a different mode | Badge color changes, conversation clears, welcome screen updates |
| Switch back to Tutor | Conversation clears, default welcome screen returns |
| Close and reopen chat | Mode persists within the session |

### Welcome screen per mode
Each mode should show a distinct title, description, and 4 suggested questions:

| Mode | Title | Sample question |
|------|-------|-----------------|
| Tutor | AI Study Assistant | "What does front office staff do?" (varies by section) |
| EHR Coach | EHR Practice Coach | "What should I do first in the lab?" |
| Practice Qs | Adaptive Practice | "Quiz me on my weakest areas" |
| Patient Sim | Patient Simulation | "Start a scenario with a confused new patient" |
| SOP Scenarios | SOP Scenario Practice | "Give me a new patient registration scenario" |

### What to watch for
- Mode label next to badge should show "Ungraded" for Practice Qs and "Practice Mode" for other non-tutor modes
- Suggested questions should be clickable and send immediately
- No visual glitches when switching modes rapidly

---

## 2. Tutor Mode (Default — Baseline)

### What to test
- Navigate to different sections (Foundations, Insurance, Workflows, etc.)
- Open chat and ask section-relevant questions
- Verify the AI references the correct section context

### Expected behavior
- Responses should reference the current section (e.g., insurance topics when on the Insurance page)
- Suggested questions on the welcome screen should change based on which section you're in
- This mode should behave identically to the AI tutor before the agent system was added

### What to watch for
- Any regression from previous behavior
- Rate limiting still works (30 messages / 15 min window)
- Error states display correctly
- Cancel button works during response streaming

---

## 3. Adaptive Assessment Agent (Practice Qs)

### What to test
1. Switch to "Practice Qs" mode
2. Ask "Quiz me on my weakest areas" or click the suggested question
3. Receive a practice question
4. Answer correctly, then answer incorrectly — observe difficulty adaptation
5. Check localStorage for `vytalpath_practice_sessions` data

### Expected behavior
| Scenario | Expected |
|----------|----------|
| First question | AI generates a single multiple-choice question with 4 options |
| Question format | Should include "**Practice Question:**", lettered options (A/B/C/D), and be clearly labeled ungraded |
| Correct answer | AI confirms correct, explains why, offers next question |
| Wrong answer | AI reveals correct answer, explains reasoning, offers easier follow-up |
| 2 correct in a row | Next question should target a harder concept or different domain |
| 2 wrong in a row | Next question should be easier or in the same domain for reinforcement |
| Weakness targeting | If you've failed a quiz on insurance topics, questions should lean toward insurance |

### Practice session tracking
After answering questions, check `localStorage`:
```
Key: vytalpath_practice_sessions
```
- Should contain a JSON object with `sessions` array and `lastCleanup` timestamp
- Each session should have: `id`, `agentMode: 'assessment'`, `startedAt`, `questionsAsked`, `questionsCorrect`, `domainsCovered[]`, `ksIdsCovered[]`
- Session count should never exceed 50 (auto-cleanup)

### What to watch for
- Questions should NOT duplicate standardized quiz questions verbatim
- AI should always state "This is ungraded practice" or similar
- Questions should reference specific lesson content when explaining answers
- The `vytalpath_progress` localStorage key should be **completely unaffected** by practice

---

## 4. EHR Coach Agent

### What to test
1. Navigate to **EHR Practice Lab** (`/ehr-lab`)
2. Open the chat — mode should **automatically switch to "EHR Coach"** (teal badge)
3. Ask "What should I do first?"
4. Navigate to different views (Provider Schedule, Appointments, Patient Chart)
5. Ask context-aware questions ("Who is my next patient?", "How do I check in this patient?")
6. Navigate **away** from EHR Lab — mode should revert to "Tutor"

### Expected behavior
| Scenario | Expected |
|----------|----------|
| Enter EHR Lab | Chat badge auto-switches to "EHR Coach" (teal) |
| Ask general question | Coach responds with 2-3 sentence guidance, concise and actionable |
| Ask about current view | Coach references what you're looking at (schedule, patient chart, etc.) |
| Ask "what next?" | Coach suggests logical next workflow step based on current state |
| Leave EHR Lab | Badge reverts to "Tutor" (blue) |
| Re-enter EHR Lab | Badge switches back to "EHR Coach" |

### Context awareness
The EHR Coach receives a snapshot of your lab state:
- Current view (schedule, appointments, chart, messages)
- Active patient ID (if viewing a patient)
- Session age (how long the lab has been open)

When you switch views or select a patient, the snapshot should update (debounced, ~300ms delay).

### What to watch for
- Coach should guide WITHOUT doing the work for the student
- Responses should be short (2-3 sentences), not long lectures
- Coach should reference specific patient names and appointment details when available
- No stale context if you rapidly switch views

---

## 5. SOP Scenario Agent

### What to test
1. Navigate to **Front Office Workflows** > open any SOP (e.g., "New Patient Registration")
2. Look for the **"Practice This SOP with AI Scenarios"** button at the top
3. Click it — should switch agent to SOP Scenario mode
4. Open chat and interact with the scenario
5. Also test switching to SOP Scenario mode manually from the chat dropdown

### Expected behavior
| Scenario | Expected |
|----------|----------|
| Click "Practice This SOP" on SOP detail page | Agent mode switches to "sop-scenario" |
| Ask for a scenario | AI presents a realistic workplace situation requiring SOP procedures |
| Describe your steps | AI evaluates against actual SOP steps, identifies missed/wrong-order items |
| Complete scenario | AI rates performance 1-5, summarizes, offers to try another |
| Manual mode switch | Welcome screen shows SOP-specific suggested questions |

### What to watch for
- Scenarios should feel realistic (actual patient names, specific situations)
- AI should identify specific missed steps, not just say "good job"
- Ordering of steps should matter
- AI should offer to let you review the SOP or try another scenario

---

## 6. Patient Simulation Agent

### What to test
1. Switch to "Patient Sim" mode from the chat dropdown
2. Click "Start a scenario with a confused new patient" or ask for a scenario
3. Role-play the interaction — greet the patient, ask questions, handle their request
4. Test with different patient types: Medicare, insurance complications, walk-in urgent

### Expected behavior
| Scenario | Expected |
|----------|----------|
| Start simulation | AI role-plays as a patient arriving at the front desk |
| Patient personality | Distinct voice — confused, anxious, frustrated, etc. |
| Insurance complexity | If your profile shows insurance weakness, patient may have complex insurance |
| HIPAA testing | If your profile shows HIPAA weakness, patient may make privacy-related requests |
| Correct handling | AI acknowledges good responses and continues the interaction |
| Poor handling | AI stays in character but may become more difficult |

### Weakness targeting
The patient simulation should adapt to your weakness profile:
- Weak in insurance? More patients with complex insurance situations
- Weak in HIPAA? Patients who test privacy boundaries
- Weak in workflows? Patients with unusual scheduling needs

### What to watch for
- AI should stay **in character** as the patient (first person, not coaching)
- After the interaction, AI should break character to debrief
- Scenarios should feel different each time (not repetitive scripts)
- Time pressure and realism should increase gradually

---

## 7. Suggested Next Action (Orchestrator Intelligence)

### What to test
1. Complete some lessons and fail a quiz (or have incomplete progress)
2. Open the chat in Tutor mode — look for a **suggested action card** on the welcome screen
3. The card should recommend a specific next step based on your progress

### Expected behavior
The orchestrator analyzes your progress and suggests actions in this priority order:

| Priority | Trigger | Suggestion |
|----------|---------|------------|
| 1 | Failed quiz exists | "Retry [quiz name] — you scored X%" with link |
| 2 | Weak domain identified | "Practice [domain] — it's your weakest area" |
| 3 | No EHR Lab sessions | "Try the EHR Practice Lab" |
| 4 | Lessons incomplete | "Continue [section name]" |

### What to watch for
- Card should only appear in Tutor mode welcome screen (not other modes)
- Clicking the card should navigate to the right place and/or switch agent mode
- Suggestions should update as progress changes

---

## 8. Practice Engagement Panel (Progress Dashboard)

### What to test
1. Complete several practice sessions across different modes
2. Navigate to **My Progress** (`/progress`)
3. Look for the **"AI Practice Engagement"** panel below the domain progress cards

### Expected behavior
| State | Expected |
|-------|----------|
| No practice sessions | Panel shows "No practice sessions yet" with instruction to open AI assistant |
| After practice sessions | Shows 3 stats: Sessions count, Questions attempted, Accuracy % |
| Accuracy coloring | >= 70% green, >= 50% amber, < 50% default gray |
| Sessions by type | Breakdown by agent mode (EHR Coach, Practice Qs, Patient Sim, SOP Scenarios) |
| Last practice date | Shows at bottom with clock icon |

### What to watch for
- Panel explicitly states "Ungraded adaptive practice — does not affect quiz scores or certificate"
- Tutor mode sessions should NOT appear in the mode breakdown
- Stats should update after new practice sessions without page refresh needed
- Panel should not interfere with or modify the domain progress cards above it

---

## 9. Grading Boundary — Critical Verification

This is the most important validation. **Practice must never affect graded outcomes.**

### Tests to run

| Test | How to verify | Expected |
|------|---------------|----------|
| Quiz scores unchanged | Complete practice questions, then check quiz scores in progress | Quiz scores identical before/after practice |
| Certificate eligibility | Complete practice sessions, check certificate page | Certificate requirements unchanged (based on graded quizzes only) |
| localStorage separation | Open DevTools > Application > Local Storage | `vytalpath_progress` and `vytalpath_practice_sessions` are separate keys |
| Domain levels (default) | Check CMAADashboard domain progress bars | Should reflect graded quiz results only |
| Practice never downgrades | Even with 0% practice accuracy, competency levels unchanged | True |

### localStorage keys to inspect
```
vytalpath_progress           → Graded data (lessons, quizzes). Practice NEVER writes here.
vytalpath_practice_sessions  → Ungraded practice only. Quizzes NEVER write here.
```

---

## 10. Edge Cases & Error Handling

| Scenario | Expected |
|----------|----------|
| Switch modes mid-conversation | Conversation clears, welcome screen for new mode appears |
| Rapid mode switching (spam click) | No crashes, last selected mode wins |
| Send message while switching modes | Message sends in the new mode context |
| Network error during agent response | Error banner appears, can retry |
| Rate limit reached | Warning shows at 5 remaining, blocks at 0 |
| Very long practice session | localStorage auto-cleans at 50 sessions |
| Clear browser localStorage | All practice data lost (expected), app doesn't crash |
| Open chat on a page with no section mapping | Defaults to "foundations" context |

---

## 11. Cross-Browser / Mobile

| Test | What to check |
|------|---------------|
| Mobile (iPhone/Android) | Chat panel fills screen, mode switcher accessible, suggested questions tappable |
| Agent mode badge | Readable on small screens, dropdown doesn't overflow |
| EHR Lab on mobile | Coach auto-activates, context updates work |
| Practice engagement panel | Responsive grid, stats readable on small screens |

---

## Quick Smoke Test Checklist

Run through these in order for a fast validation pass:

- [ ] Open chat on Welcome page — see Tutor mode, suggested questions
- [ ] Switch to Practice Qs — see welcome screen change, ask for a question
- [ ] Answer 2 questions — verify they appear conversationally
- [ ] Switch to Patient Sim — conversation clears, new welcome screen
- [ ] Start a patient scenario — AI role-plays as patient
- [ ] Navigate to EHR Lab — chat auto-switches to EHR Coach
- [ ] Ask "What should I do first?" — get concise coaching response
- [ ] Leave EHR Lab — chat reverts to Tutor
- [ ] Open an SOP — click "Practice This SOP" button
- [ ] Open chat — should be in SOP Scenario mode
- [ ] Go to My Progress — see Practice Engagement panel
- [ ] Check localStorage — `vytalpath_practice_sessions` exists, `vytalpath_progress` unmodified
- [ ] Verify a previously passed quiz still shows as passed
- [ ] Check certificate page — requirements unchanged
