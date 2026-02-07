export interface TermComponent {
  id: string;
  text: string;
  type: 'prefix' | 'root' | 'suffix';
}

export interface BuildableTerm {
  id: string;
  definition: string;
  assembledTerm: string;
  pronunciation: string;
  correctComponents: TermComponent[];
  distractors: TermComponent[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
  hint: string;
}

export const buildableTerms: BuildableTerm[] = [
  // ─── BASIC (2 parts: root + suffix) ───
  {
    id: 'tb-1',
    definition: 'Inflammation of the stomach',
    assembledTerm: 'Gastritis',
    pronunciation: 'gas-TRY-tis',
    correctComponents: [
      { id: 'c-gastr', text: 'gastr/o', type: 'root' },
      { id: 'c-itis1', text: '-itis', type: 'suffix' },
    ],
    distractors: [
      { id: 'd-cardi', text: 'cardi/o', type: 'root' },
      { id: 'd-hepat', text: 'hepat/o', type: 'root' },
      { id: 'd-ectomy1', text: '-ectomy', type: 'suffix' },
      { id: 'd-logy1', text: '-logy', type: 'suffix' },
    ],
    difficulty: 'basic',
    hint: 'The root "gastr/o" means stomach. The suffix "-itis" means inflammation.',
  },
  {
    id: 'tb-2',
    definition: 'Study of the heart',
    assembledTerm: 'Cardiology',
    pronunciation: 'kar-dee-OL-oh-jee',
    correctComponents: [
      { id: 'c-cardi2', text: 'cardi/o', type: 'root' },
      { id: 'c-logy2', text: '-logy', type: 'suffix' },
    ],
    distractors: [
      { id: 'd-neur', text: 'neur/o', type: 'root' },
      { id: 'd-derm', text: 'dermat/o', type: 'root' },
      { id: 'd-itis2', text: '-itis', type: 'suffix' },
      { id: 'd-osis', text: '-osis', type: 'suffix' },
    ],
    difficulty: 'basic',
    hint: 'The root "cardi/o" means heart. The suffix "-logy" means the study of.',
  },
  {
    id: 'tb-3',
    definition: 'Inflammation of the liver',
    assembledTerm: 'Hepatitis',
    pronunciation: 'hep-ah-TY-tis',
    correctComponents: [
      { id: 'c-hepat3', text: 'hepat/o', type: 'root' },
      { id: 'c-itis3', text: '-itis', type: 'suffix' },
    ],
    distractors: [
      { id: 'd-nephr3', text: 'nephr/o', type: 'root' },
      { id: 'd-gastr3', text: 'gastr/o', type: 'root' },
      { id: 'd-logy3', text: '-logy', type: 'suffix' },
      { id: 'd-plasty3', text: '-plasty', type: 'suffix' },
    ],
    difficulty: 'basic',
    hint: 'The root "hepat/o" means liver. You already know "-itis" means inflammation.',
  },
  {
    id: 'tb-4',
    definition: 'Study of the skin',
    assembledTerm: 'Dermatology',
    pronunciation: 'dur-mah-TOL-oh-jee',
    correctComponents: [
      { id: 'c-derm4', text: 'dermat/o', type: 'root' },
      { id: 'c-logy4', text: '-logy', type: 'suffix' },
    ],
    distractors: [
      { id: 'd-oste4', text: 'oste/o', type: 'root' },
      { id: 'd-arthr4', text: 'arthr/o', type: 'root' },
      { id: 'd-gram4', text: '-gram', type: 'suffix' },
      { id: 'd-emia4', text: '-emia', type: 'suffix' },
    ],
    difficulty: 'basic',
    hint: 'The root "dermat/o" means skin. The suffix "-logy" means the study of.',
  },
  {
    id: 'tb-5',
    definition: 'Surgical removal of the appendix',
    assembledTerm: 'Appendectomy',
    pronunciation: 'ap-en-DEK-toh-mee',
    correctComponents: [
      { id: 'c-append5', text: 'append/o', type: 'root' },
      { id: 'c-ectomy5', text: '-ectomy', type: 'suffix' },
    ],
    distractors: [
      { id: 'd-cholecyst5', text: 'cholecyst/o', type: 'root' },
      { id: 'd-gastr5', text: 'gastr/o', type: 'root' },
      { id: 'd-otomy5', text: '-otomy', type: 'suffix' },
      { id: 'd-itis5', text: '-itis', type: 'suffix' },
    ],
    difficulty: 'basic',
    hint: 'The suffix "-ectomy" means surgical removal. "-otomy" means cutting into (different!).',
  },
  // ─── INTERMEDIATE (prefix + root + suffix) ───
  {
    id: 'tb-6',
    definition: 'Rapid heart rate',
    assembledTerm: 'Tachycardia',
    pronunciation: 'tak-ih-KAR-dee-ah',
    correctComponents: [
      { id: 'c-tachy6', text: 'tachy-', type: 'prefix' },
      { id: 'c-cardi6', text: 'cardi/o', type: 'root' },
      { id: 'c-ia6', text: '-ia', type: 'suffix' },
    ],
    distractors: [
      { id: 'd-brady6', text: 'brady-', type: 'prefix' },
      { id: 'd-hyper6', text: 'hyper-', type: 'prefix' },
      { id: 'd-neur6', text: 'neur/o', type: 'root' },
      { id: 'd-itis6', text: '-itis', type: 'suffix' },
      { id: 'd-osis6', text: '-osis', type: 'suffix' },
    ],
    difficulty: 'intermediate',
    hint: '"Tachy-" means fast/rapid. "Brady-" means slow. "-ia" indicates a condition.',
  },
  {
    id: 'tb-7',
    definition: 'Below-normal body temperature',
    assembledTerm: 'Hypothermia',
    pronunciation: 'hy-poh-THUR-mee-ah',
    correctComponents: [
      { id: 'c-hypo7', text: 'hypo-', type: 'prefix' },
      { id: 'c-therm7', text: 'therm/o', type: 'root' },
      { id: 'c-ia7', text: '-ia', type: 'suffix' },
    ],
    distractors: [
      { id: 'd-hyper7', text: 'hyper-', type: 'prefix' },
      { id: 'd-tachy7', text: 'tachy-', type: 'prefix' },
      { id: 'd-cardi7', text: 'cardi/o', type: 'root' },
      { id: 'd-emia7', text: '-emia', type: 'suffix' },
      { id: 'd-logy7', text: '-logy', type: 'suffix' },
    ],
    difficulty: 'intermediate',
    hint: '"Hypo-" means below/under. "Hyper-" means above/excessive. "Therm/o" means heat/temperature.',
  },
  {
    id: 'tb-8',
    definition: 'Slow heart rate',
    assembledTerm: 'Bradycardia',
    pronunciation: 'brad-ih-KAR-dee-ah',
    correctComponents: [
      { id: 'c-brady8', text: 'brady-', type: 'prefix' },
      { id: 'c-cardi8', text: 'cardi/o', type: 'root' },
      { id: 'c-ia8', text: '-ia', type: 'suffix' },
    ],
    distractors: [
      { id: 'd-tachy8', text: 'tachy-', type: 'prefix' },
      { id: 'd-hypo8', text: 'hypo-', type: 'prefix' },
      { id: 'd-gastr8', text: 'gastr/o', type: 'root' },
      { id: 'd-itis8', text: '-itis', type: 'suffix' },
      { id: 'd-logy8', text: '-logy', type: 'suffix' },
    ],
    difficulty: 'intermediate',
    hint: '"Brady-" means slow. Compare with "tachy-" which means fast.',
  },
  {
    id: 'tb-9',
    definition: 'Excessive sugar in the blood',
    assembledTerm: 'Hyperglycemia',
    pronunciation: 'hy-per-gly-SEE-mee-ah',
    correctComponents: [
      { id: 'c-hyper9', text: 'hyper-', type: 'prefix' },
      { id: 'c-glyc9', text: 'glyc/o', type: 'root' },
      { id: 'c-emia9', text: '-emia', type: 'suffix' },
    ],
    distractors: [
      { id: 'd-hypo9', text: 'hypo-', type: 'prefix' },
      { id: 'd-poly9', text: 'poly-', type: 'prefix' },
      { id: 'd-hem9', text: 'hem/o', type: 'root' },
      { id: 'd-ia9', text: '-ia', type: 'suffix' },
      { id: 'd-uria9', text: '-uria', type: 'suffix' },
    ],
    difficulty: 'intermediate',
    hint: '"Hyper-" means excessive/above normal. "Glyc/o" means sugar. "-emia" means blood condition.',
  },
  {
    id: 'tb-10',
    definition: 'Low blood pressure',
    assembledTerm: 'Hypotension',
    pronunciation: 'hy-poh-TEN-shun',
    correctComponents: [
      { id: 'c-hypo10', text: 'hypo-', type: 'prefix' },
      { id: 'c-tens10', text: 'tens/o', type: 'root' },
      { id: 'c-ion10', text: '-ion', type: 'suffix' },
    ],
    distractors: [
      { id: 'd-hyper10', text: 'hyper-', type: 'prefix' },
      { id: 'd-a10', text: 'a-', type: 'prefix' },
      { id: 'd-cardi10', text: 'cardi/o', type: 'root' },
      { id: 'd-emia10', text: '-emia', type: 'suffix' },
      { id: 'd-ia10', text: '-ia', type: 'suffix' },
    ],
    difficulty: 'intermediate',
    hint: '"Hypo-" means below/low. "Tens/o" relates to pressure/tension. Hypertension would be HIGH blood pressure.',
  },
  // ─── ADVANCED (combining forms, complex terms) ───
  {
    id: 'tb-11',
    definition: 'Recording of the heart\'s electrical activity',
    assembledTerm: 'Electrocardiogram',
    pronunciation: 'eh-lek-troh-KAR-dee-oh-gram',
    correctComponents: [
      { id: 'c-electr11', text: 'electr/o', type: 'root' },
      { id: 'c-cardi11', text: 'cardi/o', type: 'root' },
      { id: 'c-gram11', text: '-gram', type: 'suffix' },
    ],
    distractors: [
      { id: 'd-neur11', text: 'neur/o', type: 'root' },
      { id: 'd-my11', text: 'my/o', type: 'root' },
      { id: 'd-graph11', text: '-graph', type: 'suffix' },
      { id: 'd-graphy11', text: '-graphy', type: 'suffix' },
      { id: 'd-logy11', text: '-logy', type: 'suffix' },
    ],
    difficulty: 'advanced',
    hint: '"-gram" is the recording/image. "-graph" is the instrument. "-graphy" is the process. This is asking for the recording itself.',
  },
  {
    id: 'tb-12',
    definition: 'Surgical repair of the nose',
    assembledTerm: 'Rhinoplasty',
    pronunciation: 'RY-noh-plas-tee',
    correctComponents: [
      { id: 'c-rhin12', text: 'rhin/o', type: 'root' },
      { id: 'c-plasty12', text: '-plasty', type: 'suffix' },
    ],
    distractors: [
      { id: 'd-ot12', text: 'ot/o', type: 'root' },
      { id: 'd-ophthalm12', text: 'ophthalm/o', type: 'root' },
      { id: 'd-ectomy12', text: '-ectomy', type: 'suffix' },
      { id: 'd-otomy12', text: '-otomy', type: 'suffix' },
      { id: 'd-scopy12', text: '-scopy', type: 'suffix' },
    ],
    difficulty: 'advanced',
    hint: '"Rhin/o" means nose. "-plasty" means surgical repair/reconstruction. Not to be confused with "-ectomy" (removal).',
  },
  {
    id: 'tb-13',
    definition: 'Inflammation of bone and joint',
    assembledTerm: 'Osteoarthritis',
    pronunciation: 'os-tee-oh-ar-THRY-tis',
    correctComponents: [
      { id: 'c-oste13', text: 'oste/o', type: 'root' },
      { id: 'c-arthr13', text: 'arthr/o', type: 'root' },
      { id: 'c-itis13', text: '-itis', type: 'suffix' },
    ],
    distractors: [
      { id: 'd-my13', text: 'my/o', type: 'root' },
      { id: 'd-chondr13', text: 'chondr/o', type: 'root' },
      { id: 'd-osis13', text: '-osis', type: 'suffix' },
      { id: 'd-algia13', text: '-algia', type: 'suffix' },
      { id: 'd-ectomy13', text: '-ectomy', type: 'suffix' },
    ],
    difficulty: 'advanced',
    hint: '"Oste/o" means bone. "Arthr/o" means joint. When two roots combine, the combining vowel connects them.',
  },
  {
    id: 'tb-14',
    definition: 'Surgical removal of the gallbladder',
    assembledTerm: 'Cholecystectomy',
    pronunciation: 'koh-leh-sis-TEK-toh-mee',
    correctComponents: [
      { id: 'c-cholecyst14', text: 'cholecyst/o', type: 'root' },
      { id: 'c-ectomy14', text: '-ectomy', type: 'suffix' },
    ],
    distractors: [
      { id: 'd-append14', text: 'append/o', type: 'root' },
      { id: 'd-gastr14', text: 'gastr/o', type: 'root' },
      { id: 'd-hepat14', text: 'hepat/o', type: 'root' },
      { id: 'd-otomy14', text: '-otomy', type: 'suffix' },
      { id: 'd-plasty14', text: '-plasty', type: 'suffix' },
    ],
    difficulty: 'advanced',
    hint: '"Cholecyst/o" means gallbladder (chole = bile, cyst = sac). "-ectomy" means surgical removal.',
  },
  {
    id: 'tb-15',
    definition: 'Difficulty breathing',
    assembledTerm: 'Dyspnea',
    pronunciation: 'DISP-nee-ah',
    correctComponents: [
      { id: 'c-dys15', text: 'dys-', type: 'prefix' },
      { id: 'c-pnea15', text: '-pnea', type: 'suffix' },
    ],
    distractors: [
      { id: 'd-a15', text: 'a-', type: 'prefix' },
      { id: 'd-tachy15', text: 'tachy-', type: 'prefix' },
      { id: 'd-pulmon15', text: 'pulmon/o', type: 'root' },
      { id: 'd-emia15', text: '-emia', type: 'suffix' },
      { id: 'd-ia15', text: '-ia', type: 'suffix' },
    ],
    difficulty: 'advanced',
    hint: '"Dys-" means difficult/painful/abnormal. "-pnea" means breathing. "A-" means without (apnea = no breathing).',
  },
];
