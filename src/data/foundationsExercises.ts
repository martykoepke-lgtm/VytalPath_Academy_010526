export interface ScenarioCard {
  id: string;
  text: string;
  correctCategory: 'inpatient' | 'ambulatory';
  explanation: string;
}

export const settingSorterScenarios: ScenarioCard[] = [
  {
    id: 'ss-1',
    text: 'A patient is admitted after emergency surgery and will stay in the hospital for 3 days to recover.',
    correctCategory: 'inpatient',
    explanation: 'The patient is admitted overnight for post-surgical recovery. Any stay that includes at least one overnight is considered inpatient.',
  },
  {
    id: 'ss-2',
    text: 'A patient visits their dermatologist for an annual skin check. The appointment takes 20 minutes.',
    correctCategory: 'ambulatory',
    explanation: 'Office visits at a specialist clinic are ambulatory care — the patient walks in, is seen, and goes home the same day.',
  },
  {
    id: 'ss-3',
    text: 'A child falls at school and is taken to an urgent care center for an X-ray of their wrist.',
    correctCategory: 'ambulatory',
    explanation: 'Urgent care centers provide same-day, walk-in ambulatory care. No overnight stay is involved.',
  },
  {
    id: 'ss-4',
    text: 'A patient with pneumonia is admitted to the hospital and placed on IV antibiotics for 5 days.',
    correctCategory: 'inpatient',
    explanation: 'Multi-day hospitalization with IV treatment is inpatient care. The patient is formally admitted.',
  },
  {
    id: 'ss-5',
    text: 'A patient has a knee arthroscopy at an outpatient surgery center and goes home 2 hours later.',
    correctCategory: 'ambulatory',
    explanation: 'Outpatient surgery centers (ASCs) are ambulatory. The patient has a procedure and is discharged the same day — no overnight stay.',
  },
  {
    id: 'ss-6',
    text: 'After a stroke, a patient is transferred to a rehabilitation hospital for 3 weeks of intensive therapy.',
    correctCategory: 'inpatient',
    explanation: 'Rehabilitation hospitals are inpatient facilities. The patient stays overnight for an extended period while receiving intensive therapy.',
  },
  {
    id: 'ss-7',
    text: 'A patient goes to a freestanding dialysis center 3 times per week for 4-hour hemodialysis sessions.',
    correctCategory: 'ambulatory',
    explanation: 'Dialysis centers are ambulatory. Even though treatments are frequent and lengthy, the patient goes home after each session.',
  },
  {
    id: 'ss-8',
    text: 'A woman in labor is admitted to the hospital\'s Labor & Delivery unit and delivers the next morning.',
    correctCategory: 'inpatient',
    explanation: 'Labor and delivery with an overnight hospital stay is inpatient care. Both the mother and newborn are admitted patients.',
  },
  {
    id: 'ss-9',
    text: 'A patient visits their primary care physician for an annual wellness exam and flu shot.',
    correctCategory: 'ambulatory',
    explanation: 'Routine office visits at a PCP clinic are the most common form of ambulatory care.',
  },
  {
    id: 'ss-10',
    text: 'A patient with severe depression is admitted to a psychiatric hospital for 10 days of inpatient treatment.',
    correctCategory: 'inpatient',
    explanation: 'Psychiatric hospitals provide inpatient mental health care. The patient is admitted and stays overnight for treatment.',
  },
  {
    id: 'ss-11',
    text: 'A home health nurse visits a patient at their house to change a wound dressing and check vitals.',
    correctCategory: 'ambulatory',
    explanation: 'Home health care is ambulatory — the care comes to the patient. There is no facility admission or overnight stay.',
  },
  {
    id: 'ss-12',
    text: 'A patient goes to a physical therapy clinic twice a week for shoulder rehabilitation after rotator cuff surgery.',
    correctCategory: 'ambulatory',
    explanation: 'Outpatient physical therapy clinics are ambulatory care settings. The patient comes in for a session and goes home.',
  },
];
