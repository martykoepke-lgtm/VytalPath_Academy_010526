/*
  # Add Medical Terminology Module Content

  ## Overview
  Enhances Module 4 (Medical Terminology Basics) with comprehensive reading content:
  - Updates existing placeholder lessons with full content
  - Adds additional lessons for complete coverage
  - Adds quiz questions for the module

  ## Lesson Structure
  1. Introduction to Medical Terminology (reading)
  2. Common Prefixes (reading)
  3. Common Root Words (reading)
  4. Common Suffixes (reading)
  5. Common Medical Abbreviations (reading)
  6. Quiz: Medical Terminology Quiz
*/

-- =============================================
-- UPDATE EXISTING LESSONS WITH CONTENT
-- =============================================

-- Update Lesson 1: Common Abbreviations -> Introduction to Medical Terminology
UPDATE lessons
SET
  slug = 'intro-to-medical-terminology',
  title = 'Introduction to Medical Terminology',
  description = 'Learn how medical terms are constructed and why understanding word parts is essential for healthcare work.',
  content_type = 'reading',
  video_url = NULL,
  duration_minutes = 8,
  reading_content = '# Introduction to Medical Terminology

## Why Learn Medical Terminology?

As a healthcare front office professional, you will encounter medical terms every day. Understanding how these terms are constructed helps you:

- **Communicate effectively** with clinical staff and patients
- **Process documents** like referrals, lab orders, and medical records
- **Verify information** when scheduling and registration
- **Build confidence** in your healthcare role

## How Medical Terms Are Built

Most medical terms are constructed from **three building blocks**:

### 1. Prefixes
Word parts that come at the **beginning** of a term and modify its meaning.

**Example:** In "hypertension"
- **hyper-** = excessive, above normal
- The prefix tells us something is "too much"

### 2. Root Words
The **core** of the medical term that identifies the body part or system.

**Example:** In "cardiology"
- **cardi-** = heart
- The root tells us we are talking about the heart

### 3. Suffixes
Word parts that come at the **end** of a term, often indicating a condition, procedure, or specialty.

**Example:** In "appendectomy"
- **-ectomy** = surgical removal
- The suffix tells us something is being removed

## Combining Vowels

When connecting word parts, we often use a **combining vowel** (usually "o") to make pronunciation easier.

**Example:**
- cardi + ology = cardiology (study of the heart)
- gastr + o + scope = gastroscope (instrument to view the stomach)

## Your Learning Path

In the following lessons, you will learn:

1. **Common Prefixes** - The most frequently used beginning word parts
2. **Common Root Words** - Body parts and systems you will encounter daily
3. **Common Suffixes** - Endings that describe conditions and procedures
4. **Medical Abbreviations** - Shorthand used in clinical settings

## Key Takeaway

You do not need to memorize every medical term. Instead, learn to **break down unfamiliar terms** into their component parts. This skill will serve you throughout your healthcare career.

**Example:** Seeing an unfamiliar term like "cholecystectomy"
- **chole-** = bile, gallbladder
- **cyst-** = bladder, sac
- **-ectomy** = surgical removal
- **Meaning:** Surgical removal of the gallbladder'
WHERE id = 'b0000001-0000-0000-0000-000000000009';

-- Update Lesson 2: Word Roots & Prefixes -> Common Prefixes
UPDATE lessons
SET
  slug = 'common-prefixes',
  title = 'Common Prefixes',
  description = 'Master the most frequently used prefixes in medical terminology.',
  content_type = 'reading',
  video_url = NULL,
  duration_minutes = 10,
  reading_content = '# Common Medical Prefixes

Prefixes are word parts placed at the **beginning** of a term to modify its meaning. Learning these common prefixes will help you understand many medical terms.

## Size and Quantity Prefixes

| Prefix | Meaning | Example | Definition |
|--------|---------|---------|------------|
| **macro-** | large | macrocyte | abnormally large cell |
| **micro-** | small | microscope | instrument for viewing small things |
| **poly-** | many | polyuria | excessive urination |
| **oligo-** | few, scanty | oliguria | decreased urine output |
| **mono-** / **uni-** | one | monocyte | single-nucleus white blood cell |
| **bi-** | two | bilateral | both sides |
| **tri-** | three | triceps | three-headed muscle |
| **quad-** | four | quadriplegia | paralysis of all four limbs |

## Position and Direction Prefixes

| Prefix | Meaning | Example | Definition |
|--------|---------|---------|------------|
| **ante-** | before, in front | antepartum | before birth |
| **post-** | after, behind | postoperative | after surgery |
| **pre-** | before | prenatal | before birth |
| **sub-** | under, below | subcutaneous | under the skin |
| **supra-** | above | suprapubic | above the pubic bone |
| **inter-** | between | intercostal | between the ribs |
| **intra-** | within | intravenous | within a vein |
| **peri-** | around | pericardium | membrane around the heart |
| **trans-** | across | transdermal | across the skin |
| **endo-** | within, inside | endoscopy | looking inside |
| **exo-** / **ecto-** | outside | exocrine | secreting outward |

## Quantity and Degree Prefixes

| Prefix | Meaning | Example | Definition |
|--------|---------|---------|------------|
| **hyper-** | excessive, above | hypertension | high blood pressure |
| **hypo-** | deficient, below | hypoglycemia | low blood sugar |
| **eu-** | normal, good | eupnea | normal breathing |
| **dys-** | difficult, painful | dyspnea | difficulty breathing |
| **tachy-** | fast | tachycardia | fast heart rate |
| **brady-** | slow | bradycardia | slow heart rate |

## Negative Prefixes

| Prefix | Meaning | Example | Definition |
|--------|---------|---------|------------|
| **a-** / **an-** | without, absence | apnea | absence of breathing |
| **anti-** | against | antibiotic | against bacteria |
| **contra-** | against, opposite | contraindicated | not recommended |

## Color Prefixes

| Prefix | Meaning | Example | Definition |
|--------|---------|---------|------------|
| **cyan-** | blue | cyanosis | bluish discoloration |
| **erythr-** | red | erythrocyte | red blood cell |
| **leuk-** / **leuco-** | white | leukocyte | white blood cell |
| **melan-** | black | melanoma | dark-pigmented tumor |
| **xanth-** | yellow | xanthoma | yellow skin growth |

## Practice Exercise

Try breaking down these terms using what you learned:

1. **Hyperthermia** = hyper- (excessive) + therm (heat) + -ia (condition)
   - *Meaning: Condition of excessive body heat*

2. **Bradypnea** = brady- (slow) + -pnea (breathing)
   - *Meaning: Slow breathing*

3. **Bilateral** = bi- (two) + lateral (side)
   - *Meaning: Both sides*

## Key Prefixes to Remember

The most common prefixes you will encounter in front office work:
- **hyper-** and **hypo-** (high/low)
- **pre-** and **post-** (before/after)
- **anti-** (against)
- **sub-** (under)
- **intra-** (within)'
WHERE id = 'b0000001-0000-0000-0000-000000000010';

-- =============================================
-- INSERT NEW LESSONS
-- =============================================

-- Lesson 3: Common Root Words
INSERT INTO lessons (id, module_id, slug, title, description, content_type, video_url, reading_content, duration_minutes, sort_order)
VALUES (
  'b0000001-0000-0000-0000-000000000011',
  'a0000001-0000-0000-0000-000000000004',
  'common-root-words',
  'Common Root Words',
  'Learn the root words that identify body parts and systems in medical terminology.',
  'reading',
  NULL,
  '# Common Medical Root Words

Root words form the **core** of medical terms. They typically identify the body part, organ, or system being discussed.

## Cardiovascular System

| Root | Meaning | Example | Definition |
|------|---------|---------|------------|
| **cardi/o** | heart | cardiologist | heart specialist |
| **angi/o** | vessel | angiogram | image of blood vessels |
| **arterio** | artery | arteriosclerosis | hardening of arteries |
| **ven/o** / **phleb/o** | vein | venipuncture | puncture of a vein |
| **hem/o** / **hemat/o** | blood | hematoma | collection of blood |

## Respiratory System

| Root | Meaning | Example | Definition |
|------|---------|---------|------------|
| **pulmon/o** | lung | pulmonologist | lung specialist |
| **pneum/o** | lung, air | pneumonia | lung infection |
| **bronch/o** | bronchus | bronchitis | inflammation of bronchi |
| **thorac/o** | chest | thoracic | relating to the chest |
| **nas/o** / **rhin/o** | nose | rhinitis | inflammation of the nose |

## Digestive System

| Root | Meaning | Example | Definition |
|------|---------|---------|------------|
| **gastr/o** | stomach | gastritis | inflammation of stomach |
| **enter/o** | intestine | enteritis | intestinal inflammation |
| **hepat/o** | liver | hepatitis | liver inflammation |
| **col/o** | colon | colonoscopy | viewing the colon |
| **chol/e** | bile, gallbladder | cholecystitis | gallbladder inflammation |

## Musculoskeletal System

| Root | Meaning | Example | Definition |
|------|---------|---------|------------|
| **oste/o** | bone | osteoporosis | porous bones |
| **arthr/o** | joint | arthritis | joint inflammation |
| **my/o** / **muscul/o** | muscle | myalgia | muscle pain |
| **chondr/o** | cartilage | chondritis | cartilage inflammation |
| **tend/o** | tendon | tendinitis | tendon inflammation |

## Nervous System

| Root | Meaning | Example | Definition |
|------|---------|---------|------------|
| **neur/o** | nerve | neurology | study of nerves |
| **cephal/o** | head | cephalgia | headache |
| **encephal/o** | brain | encephalitis | brain inflammation |
| **cerebr/o** | brain, cerebrum | cerebrovascular | brain blood vessels |

## Urinary System

| Root | Meaning | Example | Definition |
|------|---------|---------|------------|
| **nephr/o** / **ren/o** | kidney | nephrology | kidney specialty |
| **cyst/o** | bladder | cystitis | bladder inflammation |
| **ur/o** | urine, urinary | urologist | urinary specialist |

## Skin and Sensory

| Root | Meaning | Example | Definition |
|------|---------|---------|------------|
| **derm/o** / **dermat/o** | skin | dermatology | skin specialty |
| **ophthalm/o** / **ocul/o** | eye | ophthalmologist | eye specialist |
| **ot/o** | ear | otitis | ear inflammation |

## Reproductive System

| Root | Meaning | Example | Definition |
|------|---------|---------|------------|
| **gyn/o** / **gynec/o** | woman, female | gynecology | female reproductive specialty |
| **obstetr/o** | pregnancy, birth | obstetrics | pregnancy care specialty |
| **uter/o** / **hyster/o** | uterus | hysterectomy | removal of uterus |

## General Terms

| Root | Meaning | Example | Definition |
|------|---------|---------|------------|
| **path/o** | disease | pathology | study of disease |
| **gen/o** | producing, origin | pathogen | disease-causing agent |
| **onc/o** | tumor | oncology | study of tumors/cancer |
| **psych/o** | mind | psychology | study of the mind |

## Practice Exercise

Identify the root word in each term:

1. **Gastroenterologist** = gastr/o (stomach) + enter/o (intestine) + -ologist
   - *A specialist in stomach and intestinal disorders*

2. **Nephritis** = nephr/o (kidney) + -itis (inflammation)
   - *Inflammation of the kidney*

3. **Cardiopulmonary** = cardi/o (heart) + pulmon/o (lung) + -ary
   - *Relating to the heart and lungs*',
  12,
  3
);

-- Lesson 4: Common Suffixes
INSERT INTO lessons (id, module_id, slug, title, description, content_type, video_url, reading_content, duration_minutes, sort_order)
VALUES (
  'b0000001-0000-0000-0000-000000000012',
  'a0000001-0000-0000-0000-000000000004',
  'common-suffixes',
  'Common Suffixes',
  'Master the suffixes that describe conditions, procedures, and specialties.',
  'reading',
  NULL,
  '# Common Medical Suffixes

Suffixes are word parts placed at the **end** of a term. They often indicate a condition, procedure, or medical specialty.

## Condition Suffixes

| Suffix | Meaning | Example | Definition |
|--------|---------|---------|------------|
| **-itis** | inflammation | appendicitis | inflammation of appendix |
| **-osis** | abnormal condition | stenosis | abnormal narrowing |
| **-emia** | blood condition | anemia | deficiency of blood/red cells |
| **-ia** / **-ism** | condition | insomnia | condition of sleeplessness |
| **-pathy** | disease | neuropathy | nerve disease |
| **-algia** | pain | neuralgia | nerve pain |
| **-dynia** | pain | pleurodynia | pain in the pleura |
| **-oma** | tumor, mass | carcinoma | cancerous tumor |
| **-megaly** | enlargement | cardiomegaly | enlarged heart |
| **-malacia** | softening | osteomalacia | softening of bones |
| **-necrosis** | death | necrosis | tissue death |
| **-plegia** | paralysis | paraplegia | paralysis of lower body |
| **-paresis** | weakness | hemiparesis | weakness on one side |
| **-rrhea** | flow, discharge | diarrhea | abnormal stool flow |
| **-rrhage** / **-rrhagia** | bursting forth | hemorrhage | blood bursting forth |

## Surgical Procedure Suffixes

| Suffix | Meaning | Example | Definition |
|--------|---------|---------|------------|
| **-ectomy** | surgical removal | appendectomy | removal of appendix |
| **-otomy** | cutting into | tracheotomy | cutting into trachea |
| **-ostomy** | creating an opening | colostomy | opening in the colon |
| **-plasty** | surgical repair | rhinoplasty | nose repair/reshaping |
| **-pexy** | surgical fixation | nephropexy | fixation of kidney |
| **-rrhaphy** | suturing | herniorrhaphy | suturing of hernia |
| **-tripsy** | crushing | lithotripsy | crushing of stones |

## Diagnostic Procedure Suffixes

| Suffix | Meaning | Example | Definition |
|--------|---------|---------|------------|
| **-scopy** | visual examination | colonoscopy | viewing the colon |
| **-scope** | instrument for viewing | endoscope | instrument to view inside |
| **-gram** | record, image | mammogram | breast image |
| **-graph** | recording instrument | electrocardiograph | heart rhythm recorder |
| **-graphy** | process of recording | radiography | process of taking x-rays |
| **-meter** | measuring instrument | thermometer | temperature measurer |
| **-metry** | process of measuring | audiometry | hearing measurement |

## Specialist and Specialty Suffixes

| Suffix | Meaning | Example | Definition |
|--------|---------|---------|------------|
| **-ologist** | specialist | cardiologist | heart specialist |
| **-ology** | study of | cardiology | study of the heart |
| **-iatry** | medical treatment | psychiatry | mental health treatment |
| **-ist** | specialist | dentist | tooth specialist |
| **-ician** | specialist | physician | medical doctor |

## Other Common Suffixes

| Suffix | Meaning | Example | Definition |
|--------|---------|---------|------------|
| **-ac** / **-al** / **-ic** | pertaining to | cardiac | pertaining to heart |
| **-ary** / **-ory** | pertaining to | pulmonary | pertaining to lungs |
| **-ous** / **-eous** | pertaining to | subcutaneous | under the skin |
| **-genesis** | producing, origin | carcinogenesis | cancer formation |
| **-lysis** | breakdown | hemolysis | breakdown of blood |
| **-stasis** | stopping, controlling | hemostasis | stopping bleeding |
| **-trophy** | nourishment, growth | atrophy | wasting away |

## Practice: Procedure Terms

Understanding these suffixes helps you recognize what type of procedure is being discussed:

| Term | Breakdown | Meaning |
|------|-----------|---------|
| **Cholecystectomy** | chole (bile) + cyst (bladder) + -ectomy | Gallbladder removal |
| **Colonoscopy** | colon/o + -scopy | Visual exam of colon |
| **Angioplasty** | angi/o (vessel) + -plasty | Vessel repair |
| **Appendectomy** | appendic/o + -ectomy | Appendix removal |
| **Bronchoscopy** | bronch/o + -scopy | Viewing the bronchi |

## Key Suffixes for Front Office Work

The most important suffixes to recognize:

- **-itis** (inflammation) - Very common in diagnoses
- **-ectomy** (surgical removal) - Common surgical procedures
- **-scopy** (visual exam) - Diagnostic procedures
- **-gram** (image/record) - Diagnostic imaging
- **-ologist** (specialist) - Understanding referrals',
  10,
  4
);

-- Lesson 5: Common Medical Abbreviations
INSERT INTO lessons (id, module_id, slug, title, description, content_type, video_url, reading_content, duration_minutes, sort_order)
VALUES (
  'b0000001-0000-0000-0000-000000000013',
  'a0000001-0000-0000-0000-000000000004',
  'common-medical-abbreviations',
  'Common Medical Abbreviations',
  'Learn the abbreviations you will encounter daily in clinical settings.',
  'reading',
  NULL,
  '# Common Medical Abbreviations

Medical abbreviations are shorthand used throughout healthcare. As a front office professional, you will see these on orders, referrals, and documentation.

## Timing and Frequency

| Abbreviation | Meaning | Usage Example |
|--------------|---------|---------------|
| **QD** or **q.d.** | once daily | "Take medication QD" |
| **BID** or **b.i.d.** | twice daily | "BID dosing" |
| **TID** or **t.i.d.** | three times daily | "TID medications" |
| **QID** or **q.i.d.** | four times daily | "QID schedule" |
| **PRN** or **p.r.n.** | as needed | "PRN pain medication" |
| **AC** | before meals | "Take AC" |
| **PC** | after meals | "Take PC" |
| **HS** | at bedtime | "HS dosing" |
| **STAT** | immediately | "STAT order" |
| **ASAP** | as soon as possible | "Schedule ASAP" |

## Route of Administration

| Abbreviation | Meaning |
|--------------|---------|
| **PO** | by mouth (per os) |
| **IV** | intravenous |
| **IM** | intramuscular |
| **SQ** or **SubQ** | subcutaneous |
| **PR** | per rectum |
| **SL** | sublingual (under tongue) |
| **TOP** | topical |
| **INH** | inhaled |

## Vital Signs and Measurements

| Abbreviation | Meaning |
|--------------|---------|
| **BP** | blood pressure |
| **HR** or **P** | heart rate / pulse |
| **RR** | respiratory rate |
| **T** or **Temp** | temperature |
| **O2 Sat** or **SpO2** | oxygen saturation |
| **Ht** | height |
| **Wt** | weight |
| **BMI** | body mass index |

## Common Diagnoses and Conditions

| Abbreviation | Meaning |
|--------------|---------|
| **HTN** | hypertension (high blood pressure) |
| **DM** | diabetes mellitus |
| **CHF** | congestive heart failure |
| **COPD** | chronic obstructive pulmonary disease |
| **CAD** | coronary artery disease |
| **MI** | myocardial infarction (heart attack) |
| **CVA** | cerebrovascular accident (stroke) |
| **URI** | upper respiratory infection |
| **UTI** | urinary tract infection |
| **GERD** | gastroesophageal reflux disease |
| **OA** | osteoarthritis |
| **RA** | rheumatoid arthritis |

## Diagnostic Tests and Procedures

| Abbreviation | Meaning |
|--------------|---------|
| **CBC** | complete blood count |
| **BMP** | basic metabolic panel |
| **CMP** | comprehensive metabolic panel |
| **UA** | urinalysis |
| **EKG** or **ECG** | electrocardiogram |
| **CXR** | chest x-ray |
| **CT** | computed tomography |
| **MRI** | magnetic resonance imaging |
| **US** | ultrasound |
| **PFT** | pulmonary function test |

## Healthcare Settings and Departments

| Abbreviation | Meaning |
|--------------|---------|
| **ED** or **ER** | emergency department/room |
| **ICU** | intensive care unit |
| **OR** | operating room |
| **PACU** | post-anesthesia care unit |
| **L&D** | labor and delivery |
| **NICU** | neonatal intensive care unit |
| **OB/GYN** | obstetrics and gynecology |
| **PT** | physical therapy |
| **OT** | occupational therapy |

## Healthcare Professionals

| Abbreviation | Meaning |
|--------------|---------|
| **MD** | medical doctor |
| **DO** | doctor of osteopathy |
| **PA** | physician assistant |
| **NP** | nurse practitioner |
| **RN** | registered nurse |
| **LPN** / **LVN** | licensed practical/vocational nurse |
| **MA** | medical assistant |
| **RT** | respiratory therapist |
| **RD** | registered dietitian |

## Documentation Abbreviations

| Abbreviation | Meaning |
|--------------|---------|
| **Dx** | diagnosis |
| **Hx** | history |
| **Tx** | treatment |
| **Rx** | prescription |
| **Sx** | symptoms |
| **Px** | prognosis |
| **CC** | chief complaint |
| **HPI** | history of present illness |
| **PMH** | past medical history |
| **FH** | family history |
| **SH** | social history |
| **ROS** | review of systems |
| **PE** | physical examination |
| **A&P** | assessment and plan |
| **F/U** | follow-up |
| **RTC** | return to clinic |
| **NKA** or **NKDA** | no known allergies / no known drug allergies |

## Insurance and Billing

| Abbreviation | Meaning |
|--------------|---------|
| **EOB** | explanation of benefits |
| **PCP** | primary care provider |
| **HMO** | health maintenance organization |
| **PPO** | preferred provider organization |
| **PA** | prior authorization |
| **DOS** | date of service |
| **COB** | coordination of benefits |
| **OOP** | out of pocket |

## Important Note

Some abbreviations have been flagged as potentially dangerous due to confusion risks. The Joint Commission maintains a "Do Not Use" list including:
- **U** (for units) - write "units"
- **IU** (for international units) - write "international units"
- **QD, QOD** - write "daily" or "every other day"
- **Trailing zeros** (1.0 mg) - write "1 mg"
- **Lack of leading zero** (.5 mg) - write "0.5 mg"

Always follow your facility''s approved abbreviation list.',
  15,
  5
);

-- =============================================
-- INSERT QUIZ QUESTIONS FOR MODULE 4
-- =============================================

INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, explanation, sort_order)
VALUES
(
  'd0000001-0000-0000-0000-000000000004',
  'What does the prefix "hyper-" mean?',
  'multiple_choice',
  ARRAY['A. Below normal', 'B. Excessive or above normal', 'C. Within', 'D. Without'],
  'B',
  'The prefix "hyper-" means excessive or above normal. For example, hypertension means abnormally high blood pressure.',
  1
),
(
  'd0000001-0000-0000-0000-000000000004',
  'The suffix "-itis" indicates:',
  'multiple_choice',
  ARRAY['A. Surgical removal', 'B. Pain', 'C. Inflammation', 'D. Abnormal condition'],
  'C',
  'The suffix "-itis" means inflammation. Examples include appendicitis (inflammation of the appendix) and bronchitis (inflammation of the bronchi).',
  2
),
(
  'd0000001-0000-0000-0000-000000000004',
  'Break down the term "cardiology": What does the root "cardi/o" refer to?',
  'multiple_choice',
  ARRAY['A. Lungs', 'B. Brain', 'C. Heart', 'D. Blood'],
  'C',
  'The root "cardi/o" refers to the heart. Cardiology is the study of the heart, and a cardiologist is a heart specialist.',
  3
),
(
  'd0000001-0000-0000-0000-000000000004',
  'What does the abbreviation "BID" mean?',
  'multiple_choice',
  ARRAY['A. Once daily', 'B. Twice daily', 'C. Three times daily', 'D. As needed'],
  'B',
  'BID (bis in die) means twice daily. It is a common dosing abbreviation you will see on prescriptions and medication orders.',
  4
),
(
  'd0000001-0000-0000-0000-000000000004',
  'The suffix "-ectomy" means:',
  'multiple_choice',
  ARRAY['A. Visual examination', 'B. Surgical removal', 'C. Inflammation', 'D. Pain'],
  'B',
  'The suffix "-ectomy" means surgical removal. For example, appendectomy is the surgical removal of the appendix.',
  5
),
(
  'd0000001-0000-0000-0000-000000000004',
  'What does the prefix "sub-" mean?',
  'multiple_choice',
  ARRAY['A. Above', 'B. Around', 'C. Under or below', 'D. Between'],
  'C',
  'The prefix "sub-" means under or below. For example, subcutaneous means under the skin.',
  6
),
(
  'd0000001-0000-0000-0000-000000000004',
  'What does the abbreviation "PRN" mean?',
  'multiple_choice',
  ARRAY['A. Every day', 'B. Before meals', 'C. As needed', 'D. At bedtime'],
  'C',
  'PRN (pro re nata) means "as needed." Medications ordered PRN are taken only when symptoms require them.',
  7
),
(
  'd0000001-0000-0000-0000-000000000004',
  'The root word "gastr/o" refers to which body part?',
  'multiple_choice',
  ARRAY['A. Liver', 'B. Stomach', 'C. Intestines', 'D. Gallbladder'],
  'B',
  'The root "gastr/o" refers to the stomach. A gastroenterologist specializes in the stomach and intestines.',
  8
),
(
  'd0000001-0000-0000-0000-000000000004',
  'What does the abbreviation "HTN" stand for?',
  'multiple_choice',
  ARRAY['A. Heart transplant needed', 'B. Hypertension', 'C. Hypothermia', 'D. Head trauma noted'],
  'B',
  'HTN stands for hypertension, which is high blood pressure. This is one of the most common diagnoses you will see.',
  9
),
(
  'd0000001-0000-0000-0000-000000000004',
  'The term "tachycardia" means:',
  'multiple_choice',
  ARRAY['A. Slow heart rate', 'B. Irregular heart rate', 'C. Fast heart rate', 'D. Absent heart rate'],
  'C',
  'Tachycardia breaks down as tachy- (fast) + cardi/o (heart) + -ia (condition). It means an abnormally fast heart rate.',
  10
),
(
  'd0000001-0000-0000-0000-000000000004',
  'The suffix "-scopy" indicates:',
  'multiple_choice',
  ARRAY['A. Surgical repair', 'B. Visual examination', 'C. X-ray imaging', 'D. Blood test'],
  'B',
  'The suffix "-scopy" means visual examination. A colonoscopy is a visual examination of the colon using a scope.',
  11
),
(
  'd0000001-0000-0000-0000-000000000004',
  'What does "PO" mean as a route of administration?',
  'multiple_choice',
  ARRAY['A. Per rectum', 'B. By mouth', 'C. Intravenous', 'D. Topical'],
  'B',
  'PO (per os) means by mouth. It is the most common route of administration for oral medications.',
  12
);

-- =============================================
-- UPDATE MODULE DESCRIPTION
-- =============================================

UPDATE modules
SET description = 'Master medical terminology through understanding word parts (prefixes, roots, suffixes) and common healthcare abbreviations.'
WHERE id = 'a0000001-0000-0000-0000-000000000004';
