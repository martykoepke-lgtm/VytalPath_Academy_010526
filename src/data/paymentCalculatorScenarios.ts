export interface CalculationStep {
  label: string;
  correctValue: number;
  hint: string;
  explanation: string;
}

export interface PaymentScenario {
  id: string;
  patientName: string;
  planType: string;
  visitType: string;
  description: string;
  deductible: number;
  deductibleMet: number;
  coinsuranceRate: number; // patient's share, e.g. 0.20 for 80/20 plan
  copay: number;
  oopMax: number;
  oopMet: number;
  visitCost: number;
  steps: CalculationStep[];
  correctTotal: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const paymentScenarios: PaymentScenario[] = [
  // --- BEGINNER ---
  {
    id: 'scenario-1',
    patientName: 'Sarah Johnson',
    planType: 'HMO',
    visitType: 'Primary Care Visit',
    description: 'Sarah has an HMO plan with a simple copay for office visits. Her deductible does not apply to office visits.',
    deductible: 1500,
    deductibleMet: 0,
    coinsuranceRate: 0,
    copay: 30,
    oopMax: 6000,
    oopMet: 200,
    visitCost: 175,
    steps: [
      {
        label: 'Copay amount',
        correctValue: 30,
        hint: 'For HMO office visits, the patient typically pays a flat copay.',
        explanation: 'Sarah\'s HMO plan charges a $30 copay for primary care visits. The deductible doesn\'t apply to office visits on this plan.',
      },
      {
        label: 'Total patient owes',
        correctValue: 30,
        hint: 'With a copay-only visit, what does the patient pay today?',
        explanation: 'Sarah owes just her $30 copay. The insurance covers the remaining $145 of the $175 visit cost.',
      },
    ],
    correctTotal: 30,
    difficulty: 'beginner',
  },
  {
    id: 'scenario-2',
    patientName: 'Marcus Rivera',
    planType: 'PPO',
    visitType: 'Specialist Visit',
    description: 'Marcus has a PPO plan. He has already met his full deductible for the year. His plan is 80/20 coinsurance with a $50 specialist copay.',
    deductible: 2000,
    deductibleMet: 2000,
    coinsuranceRate: 0.20,
    copay: 50,
    oopMax: 7000,
    oopMet: 2800,
    visitCost: 300,
    steps: [
      {
        label: 'Copay amount',
        correctValue: 50,
        hint: 'What is the specialist copay on his plan?',
        explanation: 'Marcus\'s PPO charges a $50 copay for specialist visits, collected at check-in.',
      },
      {
        label: 'Total patient owes at check-in',
        correctValue: 50,
        hint: 'At the front desk, you collect the copay. Any additional coinsurance is billed after the claim processes.',
        explanation: 'You collect the $50 copay today. Any coinsurance balance will be billed after the insurance processes the claim.',
      },
    ],
    correctTotal: 50,
    difficulty: 'beginner',
  },
  // --- INTERMEDIATE ---
  {
    id: 'scenario-3',
    patientName: 'Lisa Chen',
    planType: 'PPO',
    visitType: 'Lab Work',
    description: 'Lisa has a PPO with an 80/20 plan. Her annual deductible is $1,500 and she has met $1,200 so far. Today\'s lab work costs $250. Labs are subject to deductible then coinsurance.',
    deductible: 1500,
    deductibleMet: 1200,
    coinsuranceRate: 0.20,
    copay: 0,
    oopMax: 6500,
    oopMet: 1400,
    visitCost: 250,
    steps: [
      {
        label: 'Remaining deductible',
        correctValue: 300,
        hint: 'Subtract what she\'s already paid from her total deductible.',
        explanation: '$1,500 deductible − $1,200 already met = $300 remaining.',
      },
      {
        label: 'Amount applied to deductible',
        correctValue: 250,
        hint: 'Is the visit cost more or less than the remaining deductible?',
        explanation: 'The $250 lab cost is less than the $300 remaining deductible, so the entire $250 applies to the deductible. Lisa hasn\'t finished meeting her deductible yet.',
      },
      {
        label: 'Amount subject to coinsurance',
        correctValue: 0,
        hint: 'Coinsurance only kicks in AFTER the deductible is fully met.',
        explanation: 'Since the entire $250 went toward the deductible (which still isn\'t fully met), there is $0 subject to coinsurance.',
      },
      {
        label: 'Total patient owes',
        correctValue: 250,
        hint: 'If the deductible isn\'t met, who pays for the service?',
        explanation: 'Lisa owes the full $250 because her deductible hasn\'t been met yet. After this visit, she\'ll have $1,450 of her $1,500 deductible met.',
      },
    ],
    correctTotal: 250,
    difficulty: 'intermediate',
  },
  {
    id: 'scenario-4',
    patientName: 'James Wilson',
    planType: 'PPO',
    visitType: 'Outpatient Procedure',
    description: 'James has a PPO with 70/30 coinsurance. His $2,000 deductible is fully met. Today\'s outpatient procedure costs $800.',
    deductible: 2000,
    deductibleMet: 2000,
    coinsuranceRate: 0.30,
    copay: 0,
    oopMax: 8000,
    oopMet: 2600,
    visitCost: 800,
    steps: [
      {
        label: 'Remaining deductible',
        correctValue: 0,
        hint: 'Has James already met his deductible?',
        explanation: 'James has met his full $2,000 deductible, so $0 remains.',
      },
      {
        label: 'Amount subject to coinsurance',
        correctValue: 800,
        hint: 'When the deductible is met, the full visit cost goes to coinsurance.',
        explanation: 'The entire $800 is subject to coinsurance since the deductible is already met.',
      },
      {
        label: 'Patient coinsurance (30%)',
        correctValue: 240,
        hint: 'Calculate 30% of the amount subject to coinsurance.',
        explanation: '$800 × 30% = $240. James\'s 70/30 plan means insurance pays 70% ($560) and James pays 30% ($240).',
      },
      {
        label: 'Total patient owes',
        correctValue: 240,
        hint: 'With deductible met, patient only owes their coinsurance share.',
        explanation: 'James owes $240 in coinsurance. No copay applies to this procedure type.',
      },
    ],
    correctTotal: 240,
    difficulty: 'intermediate',
  },
  {
    id: 'scenario-5',
    patientName: 'Maria Santos',
    planType: 'PPO',
    visitType: 'Diagnostic Imaging',
    description: 'Maria has a PPO with 80/20 coinsurance. Her $1,500 deductible is partially met — she\'s paid $1,300 so far. Today\'s MRI costs $1,200.',
    deductible: 1500,
    deductibleMet: 1300,
    coinsuranceRate: 0.20,
    copay: 0,
    oopMax: 7000,
    oopMet: 1500,
    visitCost: 1200,
    steps: [
      {
        label: 'Remaining deductible',
        correctValue: 200,
        hint: 'Subtract what she\'s paid from the total deductible.',
        explanation: '$1,500 − $1,300 = $200 remaining on her deductible.',
      },
      {
        label: 'Amount applied to deductible',
        correctValue: 200,
        hint: 'How much of the $1,200 visit goes toward finishing her deductible?',
        explanation: 'The first $200 of the $1,200 MRI cost goes to complete her deductible.',
      },
      {
        label: 'Amount subject to coinsurance',
        correctValue: 1000,
        hint: 'Subtract the deductible portion from the total visit cost.',
        explanation: '$1,200 visit − $200 applied to deductible = $1,000 subject to coinsurance.',
      },
      {
        label: 'Patient coinsurance (20%)',
        correctValue: 200,
        hint: 'Calculate 20% of the coinsurance amount.',
        explanation: '$1,000 × 20% = $200. Insurance pays 80% ($800), Maria pays 20% ($200).',
      },
      {
        label: 'Total patient owes',
        correctValue: 400,
        hint: 'Add the deductible portion plus the coinsurance portion.',
        explanation: '$200 (deductible) + $200 (coinsurance) = $400 total. This is the key calculation — the visit splits between deductible and coinsurance.',
      },
    ],
    correctTotal: 400,
    difficulty: 'intermediate',
  },
  // --- ADVANCED ---
  {
    id: 'scenario-6',
    patientName: 'Robert Kim',
    planType: 'PPO',
    visitType: 'Emergency Room',
    description: 'Robert has a PPO with 80/20 coinsurance. His $3,000 deductible is met. His OOP max is $6,500, and he\'s already paid $6,200 this year. Today\'s ER visit costs $4,500.',
    deductible: 3000,
    deductibleMet: 3000,
    coinsuranceRate: 0.20,
    copay: 0,
    oopMax: 6500,
    oopMet: 6200,
    visitCost: 4500,
    steps: [
      {
        label: 'Remaining until OOP max',
        correctValue: 300,
        hint: 'How much more can Robert pay before hitting his annual maximum?',
        explanation: '$6,500 OOP max − $6,200 already paid = $300 remaining before Robert hits his maximum.',
      },
      {
        label: 'Normal coinsurance (20%)',
        correctValue: 900,
        hint: 'Calculate what 20% of $4,500 would be without the OOP cap.',
        explanation: '$4,500 × 20% = $900 would be the normal coinsurance. But the OOP max protects Robert.',
      },
      {
        label: 'Total patient owes (with OOP cap)',
        correctValue: 300,
        hint: 'The patient can never pay more than their remaining OOP max.',
        explanation: 'Although 20% coinsurance would be $900, Robert only owes $300 because that\'s all that remains before his OOP max. Once he hits $6,500 total for the year, insurance covers 100%.',
      },
    ],
    correctTotal: 300,
    difficulty: 'advanced',
  },
  {
    id: 'scenario-7',
    patientName: 'Angela Torres',
    planType: 'HDHP',
    visitType: 'Urgent Care Visit',
    description: 'Angela has a High-Deductible Health Plan (HDHP) with a $5,000 deductible and 80/20 coinsurance after deductible. She\'s met $3,500 of her deductible. Today\'s urgent care visit costs $450.',
    deductible: 5000,
    deductibleMet: 3500,
    coinsuranceRate: 0.20,
    copay: 0,
    oopMax: 7500,
    oopMet: 3500,
    visitCost: 450,
    steps: [
      {
        label: 'Remaining deductible',
        correctValue: 1500,
        hint: 'HDHP plans have high deductibles. How much is left?',
        explanation: '$5,000 − $3,500 = $1,500 remaining. HDHP plans require patients to pay more upfront.',
      },
      {
        label: 'Amount applied to deductible',
        correctValue: 450,
        hint: 'Is the visit cost more or less than the remaining deductible?',
        explanation: 'The $450 visit is less than the $1,500 remaining deductible, so it all goes toward the deductible.',
      },
      {
        label: 'Amount subject to coinsurance',
        correctValue: 0,
        hint: 'Does coinsurance apply before the deductible is fully met?',
        explanation: 'No coinsurance applies — the deductible still isn\'t met. Angela will have $1,050 remaining on her deductible after this visit.',
      },
      {
        label: 'Total patient owes',
        correctValue: 450,
        hint: 'With an unmet deductible on an HDHP, the patient pays the full allowed amount.',
        explanation: 'Angela owes the full $450. This is common with HDHPs — patients pay 100% until meeting their high deductible.',
      },
    ],
    correctTotal: 450,
    difficulty: 'advanced',
  },
  {
    id: 'scenario-8',
    patientName: 'David Park',
    planType: 'PPO',
    visitType: 'Minor Surgery',
    description: 'David has a PPO with 80/20 coinsurance and a $40 specialist copay. His $2,500 deductible is partially met at $2,100. Today\'s minor surgery costs $2,000. The copay is collected separately and counts toward OOP max.',
    deductible: 2500,
    deductibleMet: 2100,
    coinsuranceRate: 0.20,
    copay: 40,
    oopMax: 7000,
    oopMet: 2300,
    visitCost: 2000,
    steps: [
      {
        label: 'Copay (collected at check-in)',
        correctValue: 40,
        hint: 'The copay is collected upfront regardless of deductible status.',
        explanation: 'The $40 specialist copay is collected at check-in. It counts toward the OOP max but is separate from the deductible/coinsurance calculation.',
      },
      {
        label: 'Remaining deductible',
        correctValue: 400,
        hint: 'How much deductible remains?',
        explanation: '$2,500 − $2,100 = $400 remaining on the deductible.',
      },
      {
        label: 'Amount applied to deductible',
        correctValue: 400,
        hint: 'The first portion of the surgery cost finishes the deductible.',
        explanation: '$400 of the $2,000 surgery cost goes toward completing the deductible.',
      },
      {
        label: 'Amount subject to coinsurance',
        correctValue: 1600,
        hint: 'Subtract the deductible portion from the total surgery cost.',
        explanation: '$2,000 − $400 = $1,600 is subject to coinsurance after the deductible is met.',
      },
      {
        label: 'Patient coinsurance (20%)',
        correctValue: 320,
        hint: 'Calculate 20% of the coinsurance amount.',
        explanation: '$1,600 × 20% = $320 in coinsurance. Insurance covers 80% ($1,280).',
      },
      {
        label: 'Total patient owes (copay + deductible + coinsurance)',
        correctValue: 760,
        hint: 'Add all three components together.',
        explanation: '$40 copay + $400 deductible + $320 coinsurance = $760 total. This scenario combines all three payment types — the most complex real-world calculation.',
      },
    ],
    correctTotal: 760,
    difficulty: 'advanced',
  },
];
