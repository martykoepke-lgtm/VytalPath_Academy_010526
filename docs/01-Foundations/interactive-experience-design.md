# Foundations Module: Interactive Learning Experience Design

## Overview

Instead of a traditional quiz, the Foundations module will feature **three interactive experiences** that reinforce learning through scenario-based decision-making.

---

## Experience 1: "Your First Day" Simulation

**Concept:** A choose-your-own-adventure style experience where the learner navigates their first day at a healthcare front office.

### How It Works
1. Learner is presented with a scenario (text + optional image)
2. They choose from 2-3 response options
3. Each choice leads to immediate feedback and consequences
4. Some choices are clearly wrong, some are clearly right, some are "gray areas" that require thinking

### Sample Scenarios

**Scenario 1: The Worried Spouse**
> The phone rings. "Hi, this is Tom. My wife Sarah had an appointment this morning. Can you tell me what the doctor said?"

**Options:**
- A) "Sure, let me pull up her chart." ❌
- B) "I understand you're concerned. Let me check if we have authorization to share information with you." ✓
- C) "I can't tell you anything. Goodbye." ⚠️ (Partially correct but poor service)

**Feedback for A:** "This would be a HIPAA violation. Even spouses need authorization to access patient information."

**Feedback for B:** "Perfect! You showed empathy while following protocol."

**Feedback for C:** "You protected the information, but the interaction could have been handled more professionally."

---

**Scenario 2: The Curious Coworker**
> During lunch, your coworker says, "Hey, wasn't that Mrs. Johnson who just left? What was she here for?"

**Options:**
- A) "Yeah, she's been having some issues. Kind of sad." ❌
- B) "I can't discuss patient information." ✓
- C) "I don't know, I wasn't paying attention." ⚠️ (Avoidance, not best practice)

---

**Scenario 3: The ER Redirect** (EMTALA)
> A person walks up to your desk and says, "I don't have insurance but I'm having really bad chest pain."

**Options:**
- A) "You should try the urgent care down the street, it's cheaper." ❌ (EMTALA violation)
- B) "Let me get you to triage right away." ✓
- C) "Fill out this paperwork first, then we'll see you." ❌ (EMTALA violation - screening before paperwork)

---

**Scenario 4: The Document Request**
> Your supervisor asks you to backdate a form because "the patient signed it yesterday but we forgot to put the date."

**Options:**
- A) "Sure, no problem." ❌ (Documentation falsification)
- B) "I'm not comfortable with that. Can we document it a different way?" ✓
- C) "I'll do it this time, but please don't ask me again." ❌

---

### Completion
After 6-8 scenarios, learner sees:
- Score summary (e.g., "You handled 6 of 8 situations correctly")
- Key takeaways for any missed scenarios
- Celebration message: "You're ready for day one!"

---

## Experience 2: "Spot the Violation"

**Concept:** Visual/text-based scenes where learners identify what's wrong.

### How It Works
1. Show a description or image of a workplace situation
2. Learner clicks/taps on the violations they spot
3. Immediate feedback for each item found (or missed)

### Sample Scenes

**Scene 1: The Front Desk**
> "It's a busy afternoon at the clinic. Look at the scene and identify any potential HIPAA violations."

Items to find:
- ✓ Computer screen visible to waiting area
- ✓ Patient chart open on desk
- ✓ Post-it note with patient name and callback number
- ✓ Printer output tray with visible patient documents

**Scene 2: The Conversation**
> "You overhear this conversation in the hallway between two staff members..."
>
> Staff A: "Did you see Mr. Rodriguez's test results? His blood sugar was crazy high!"
> Staff B: "I know, right? And his wife doesn't even know he's diabetic."

What's wrong?
- ✓ Discussing patient information in a public hallway
- ✓ Discussing specific test results outside of treatment need
- ✓ Commenting on what family members do/don't know

---

## Experience 3: "Risk Meter" Matching

**Concept:** Drag-and-drop or slider exercise where learners categorize the severity of situations.

### How It Works
1. Present a scenario card
2. Learner drags it to a risk level:
   - 🟢 **Safe** - No issue here
   - 🟡 **Caution** - Could be a problem depending on context
   - 🟠 **Risky** - This could lead to a violation
   - 🔴 **Violation** - This breaks the rules

### Sample Scenarios

| Scenario | Correct Level |
|----------|---------------|
| Logging into the EHR with your own credentials | 🟢 Safe |
| Looking up a friend's appointment to see what time they're coming | 🔴 Violation |
| Confirming a patient has an appointment when their employer calls | 🟡 Caution |
| Discussing a patient's case with their nurse in a private office | 🟢 Safe |
| Posting a photo of the break room (no patients visible) | 🟡 Caution |
| Telling your spouse about an interesting case you saw today | 🔴 Violation |
| Emailing patient records to a specialist using encrypted email | 🟢 Safe |
| Faxing records without verifying the fax number | 🟠 Risky |

---

## Technical Implementation

### Component Structure
```
src/components/interactive/
├── SimulationExperience.tsx    # "Your First Day" choose-your-path
├── SpotTheViolation.tsx        # Find-the-problem scenes
├── RiskMeter.tsx               # Drag-and-drop categorization
└── ExperienceResults.tsx       # Summary/celebration screen
```

### Data Structure
```typescript
interface Scenario {
  id: string;
  title: string;
  description: string;
  image?: string;
  options: Option[];
}

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  severity?: 'correct' | 'partial' | 'wrong';
}

interface SpotScene {
  id: string;
  description: string;
  image?: string;
  violations: Violation[];
}

interface Violation {
  id: string;
  description: string;
  explanation: string;
  lawReference?: string; // e.g., "HIPAA - Minimum Necessary"
}
```

### Progress Tracking
- Store completion status in local storage or Supabase
- Track which scenarios were answered correctly
- Allow retry without penalty
- Mark module complete when all three experiences are finished

---

## Visual Design Notes

### Color Coding
- 🟢 Green = Correct / Safe
- 🟡 Yellow = Partial / Caution
- 🔴 Red = Wrong / Violation
- Use consistent iconography (checkmarks, warning triangles, X marks)

### Animations
- Subtle slide/fade transitions between scenarios
- Celebratory animation on completion (confetti, checkmark burst)
- Gentle shake or pulse on incorrect answers (not harsh)

### Accessibility
- All interactive elements keyboard accessible
- Color coding supplemented with icons/text for colorblind users
- Screen reader compatible labels

---

## Learning Objectives Covered

| Objective | Experience |
|-----------|------------|
| Recognize PHI and protect it | Simulation, Spot the Violation |
| Apply minimum necessary standard | Simulation, Risk Meter |
| Understand EMTALA basics | Simulation (ER scenario) |
| Know when authorization is required | Simulation |
| Identify documentation risks | Simulation, Spot the Violation |
| Assess risk levels of common situations | Risk Meter |
| Practice professional communication | Simulation |

---

## Suggested Sequence

1. **Complete Reading Materials** (HIPAA, EMTALA, Fraud, etc.)
2. **Watch Video Lessons**
3. **Play "Your First Day" Simulation** (primary assessment)
4. **Try "Spot the Violation"** (visual reinforcement)
5. **Complete "Risk Meter"** (quick check)
6. **See Results & Certificate** (motivation)

---

## Success Criteria

- Learner must score at least 70% on the Simulation to "pass"
- Spot the Violation and Risk Meter are for practice (no minimum score)
- Badge/certificate awarded on completion: "Foundations Certified"
- Progress saved so learner can return and retry

---

*This design document can be implemented using React components with @dnd-kit for drag-and-drop functionality.*
