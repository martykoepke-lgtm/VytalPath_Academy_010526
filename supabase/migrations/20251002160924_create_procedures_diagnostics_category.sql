/*
  # Create Procedures & Diagnostics Category
  
  1. New Category
    - `Procedures & Diagnostics` - Clinical procedures and diagnostic tests
  
  2. New Subcategories (5 total)
    - Cardiovascular Procedures - Heart and vascular interventions
    - Endoscopic Procedures - Scope-based visualization and intervention
    - Surgical Procedures - Surgical interventions and operations
    - Diagnostic Tests - Non-imaging diagnostic tests and monitoring
    - Therapeutic Procedures - Ongoing treatment procedures and therapies
  
  3. New Terms (25 total)
    - 5 terms per subcategory covering common procedures/tests
  
  4. Changes
    - Creates one category at sort_order 5
    - Creates 5 subcategories with detailed descriptions
    - Adds 25 medical terms with comprehensive definitions
*/

-- Create the category
INSERT INTO categories (name, description, sort_order)
VALUES (
  'Procedures & Diagnostics',
  'Medical procedures and diagnostic tests',
  5
)
ON CONFLICT (name) DO NOTHING;

-- Create subcategories
INSERT INTO subcategories (category_id, name, description, sort_order)
SELECT 
  c.id,
  'Cardiovascular Procedures',
  'What it is: Cardiovascular procedures are medical interventions performed on the heart and blood vessels to diagnose conditions, restore blood flow, repair structural problems, or manage heart rhythm disorders.

How it works: Most cardiovascular procedures are minimally invasive, meaning they''re performed through small incisions or natural body openings rather than open surgery. A common approach involves inserting a thin, flexible tube called a catheter into a blood vessel (usually in the groin, wrist, or arm) and guiding it to the heart or target blood vessel using X-ray imaging. Doctors can then diagnose problems by measuring pressures, taking images with contrast dye, or treat conditions by opening blockages, placing stents, repairing valves, or correcting irregular heartbeats. These procedures typically use local anesthesia with sedation, allowing for faster recovery times compared to traditional open-heart surgery.',
  0
FROM categories c
WHERE c.name = 'Procedures & Diagnostics'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories (category_id, name, description, sort_order)
SELECT 
  c.id,
  'Endoscopic Procedures',
  'What it is: Endoscopic procedures use a flexible or rigid tube with a camera and light (called an endoscope) to look inside your body through natural openings or small incisions, allowing doctors to diagnose and treat conditions without major surgery.

How it works: The endoscope is carefully inserted through a natural body opening (like the mouth, nose, rectum, or urethra) or through a small surgical incision. The camera transmits high-definition video to a monitor, allowing the doctor to see inside organs and body cavities in real-time. Most endoscopes have channels that allow doctors to pass tiny surgical instruments, take tissue samples (biopsies), remove polyps or abnormal growths, stop bleeding, or perform other treatments while viewing the area. Different types of endoscopes are designed for different parts of the body. Most procedures are performed under sedation or general anesthesia, and because they avoid large incisions, they typically result in less pain, shorter hospital stays, and faster recovery than traditional surgery.',
  1
FROM categories c
WHERE c.name = 'Procedures & Diagnostics'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories (category_id, name, description, sort_order)
SELECT 
  c.id,
  'Surgical Procedures',
  'What it is: Surgical procedures are medical interventions that involve cutting into or manipulating body tissues to diagnose, treat, repair, or remove diseased or damaged structures.

How it works: Surgery can be performed using different approaches depending on the condition and location. Open surgery involves making larger incisions to directly access the surgical area, providing surgeons with direct visualization and access. Minimally invasive or laparoscopic surgery uses several small incisions through which cameras and specialized instruments are inserted, guided by video monitors. Robotic-assisted surgery enhances minimally invasive techniques with greater precision and range of motion. Surgeries are performed under various types of anesthesia—local (numbing only the surgical area), regional (numbing a larger body region), or general (putting you completely to sleep). The surgical team includes surgeons, anesthesiologists, nurses, and surgical technicians who work together to ensure safety and success. Recovery time varies greatly depending on the procedure type and approach used.',
  2
FROM categories c
WHERE c.name = 'Procedures & Diagnostics'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories (category_id, name, description, sort_order)
SELECT 
  c.id,
  'Diagnostic Tests',
  'What it is: Diagnostic tests are medical examinations and assessments that help doctors evaluate your health, identify diseases, monitor conditions, and guide treatment decisions without using imaging technology.

How it works: These tests analyze various aspects of your body''s function and composition. Laboratory tests examine blood, urine, tissue, or other body fluids to measure levels of substances like glucose, cholesterol, hormones, or to detect infections and diseases. Functional tests measure how well organs and systems are working, such as heart electrical activity, lung capacity, or nerve function. Some tests are performed in a doctor''s office or clinic, while others require samples to be sent to a laboratory for analysis. Results are compared to normal reference ranges to identify abnormalities. Many diagnostic tests are simple, quick, and painless, though some may cause mild discomfort. These tests often complement imaging studies to provide a complete picture of your health.',
  3
FROM categories c
WHERE c.name = 'Procedures & Diagnostics'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories (category_id, name, description, sort_order)
SELECT 
  c.id,
  'Therapeutic Procedures',
  'What it is: Therapeutic procedures are medical treatments performed regularly or repeatedly to manage chronic conditions, deliver medications, support bodily functions, or improve quality of life rather than to diagnose or cure a disease.

How it works: These procedures vary widely in their approach and purpose. Some involve direct delivery of treatments into the body, such as infusions that deliver medications through an IV line over extended periods. Others involve removing substances from the body, like dialysis which filters waste from blood when kidneys aren''t working properly. Physical rehabilitation procedures use targeted exercises, manual techniques, and modalities to restore function and reduce pain. Some therapeutic procedures support breathing, nutrition, or other vital functions. Many patients receive these treatments on a scheduled, recurring basis—some daily, others weekly or monthly. The goal is typically to maintain health, prevent complications, manage symptoms, or slow disease progression. These procedures can be performed in hospitals, outpatient clinics, rehabilitation centers, or sometimes at home with proper training and equipment.',
  4
FROM categories c
WHERE c.name = 'Procedures & Diagnostics'
ON CONFLICT DO NOTHING;

-- Insert terms for Cardiovascular Procedures
INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Cardiac Catheterization',
  'A diagnostic procedure that involves inserting a thin, flexible tube (catheter) into a blood vessel and guiding it to the heart to measure pressures, assess blood flow, and visualize the heart chambers and coronary arteries using contrast dye and X-ray imaging.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Cardiovascular Procedures'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Percutaneous Coronary Intervention (PCI)',
  'A minimally invasive procedure to open blocked or narrowed coronary arteries, also known as angioplasty. A catheter with a small balloon is threaded to the blocked artery and inflated to compress plaque and widen the vessel. Often includes placement of a stent (a small mesh tube) to keep the artery open.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Cardiovascular Procedures'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Pacemaker Insertion',
  'A surgical procedure to implant a small electronic device under the skin near the collarbone that sends electrical signals to regulate abnormal heart rhythms. Leads (wires) are threaded through veins to the heart chambers to deliver the pacing signals.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Cardiovascular Procedures'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Cardiac Ablation',
  'A procedure that uses radiofrequency energy, extreme cold, or other methods to create tiny scars in the heart tissue to block abnormal electrical signals causing irregular heartbeats (arrhythmias). Most commonly performed via catheter inserted through blood vessels.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Cardiovascular Procedures'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Transcatheter Aortic Valve Replacement (TAVR)',
  'A minimally invasive procedure to replace a diseased aortic valve with an artificial valve. The new valve is compressed onto a catheter, inserted through a blood vessel (usually in the groin), and guided to the heart where it is expanded within the old valve.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Cardiovascular Procedures'
ON CONFLICT (term) DO NOTHING;

-- Insert terms for Endoscopic Procedures
INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Upper Endoscopy (EGD)',
  'Esophagogastroduodenoscopy - a procedure using a flexible endoscope inserted through the mouth to examine the lining of the esophagus, stomach, and first part of the small intestine. Used to diagnose conditions, take biopsies, and treat issues like bleeding or strictures.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Endoscopic Procedures'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Colonoscopy',
  'An examination of the entire colon and rectum using a flexible colonoscope inserted through the rectum. Used to screen for colorectal cancer, diagnose bowel conditions, remove polyps, and investigate symptoms like bleeding or chronic diarrhea.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Endoscopic Procedures'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Bronchoscopy',
  'A procedure to view the airways and lungs using a bronchoscope inserted through the nose or mouth. Used to diagnose lung diseases, collect tissue or fluid samples, remove foreign objects, or treat conditions like airway blockages or bleeding.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Endoscopic Procedures'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Cystoscopy',
  'An examination of the bladder and urethra using a cystoscope inserted through the urethra. Used to diagnose and monitor bladder conditions, investigate urinary symptoms, remove small tumors or stones, and take tissue samples.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Endoscopic Procedures'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Laparoscopy',
  'A minimally invasive surgical procedure using a laparoscope (a thin tube with camera and light) inserted through small incisions in the abdomen. Allows visualization and surgical treatment of abdominal and pelvic organs with less pain and faster recovery than open surgery.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Endoscopic Procedures'
ON CONFLICT (term) DO NOTHING;

-- Insert terms for Surgical Procedures
INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Appendectomy',
  'Surgical removal of the appendix, typically performed as emergency treatment for appendicitis (inflammation of the appendix). Can be done as open surgery through a single larger incision or laparoscopically through several small incisions.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Surgical Procedures'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Cholecystectomy',
  'Surgical removal of the gallbladder, most commonly performed to treat gallstones or gallbladder inflammation. Usually done laparoscopically through small incisions, allowing for faster recovery than traditional open surgery.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Surgical Procedures'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Hernia Repair',
  'Surgical procedure to push protruding tissue or organs back into place and strengthen the weakened area of the abdominal wall. May involve stitching the weakened area or placing a synthetic mesh for reinforcement. Can be performed open or laparoscopically.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Surgical Procedures'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Joint Replacement (Arthroplasty)',
  'Surgical procedure to replace a damaged joint with an artificial joint (prosthesis), most commonly performed on hips and knees. The damaged cartilage and bone are removed and replaced with metal, plastic, or ceramic components to restore joint function and relieve pain.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Surgical Procedures'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Cesarean Section (C-Section)',
  'Surgical delivery of a baby through incisions in the mother''s abdomen and uterus. Performed when vaginal delivery would put the mother or baby at risk, or in certain medical situations. Can be planned in advance or performed as an emergency procedure.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Surgical Procedures'
ON CONFLICT (term) DO NOTHING;

-- Insert terms for Diagnostic Tests
INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Complete Blood Count (CBC)',
  'A blood test that measures different components of blood including red blood cells, white blood cells, hemoglobin, hematocrit, and platelets. Used to evaluate overall health, detect disorders like anemia or infection, and monitor treatment response.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Diagnostic Tests'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Electrocardiogram (ECG/EKG)',
  'A quick, painless test that records the electrical activity of the heart using electrodes placed on the chest, arms, and legs. Used to detect heart rhythm problems, diagnose heart attacks, assess heart structure abnormalities, and monitor heart conditions.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Diagnostic Tests'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Pulmonary Function Test (Spirometry)',
  'A group of tests that measure lung capacity and function by having the patient breathe into a device that records air volume and flow rates. Used to diagnose conditions like asthma, COPD, and other lung diseases, and to monitor treatment effectiveness.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Diagnostic Tests'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Stress Test',
  'A test that monitors heart function during physical exertion (exercise) or after administration of medication that simulates exercise effects. Helps diagnose coronary artery disease, determine exercise capacity, and assess heart rhythm during increased activity.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Diagnostic Tests'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Biopsy',
  'A procedure to remove a small sample of tissue or cells from the body for laboratory examination under a microscope. Used to diagnose cancer, inflammatory conditions, infections, and other diseases. Can be performed using various methods depending on the location.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Diagnostic Tests'
ON CONFLICT (term) DO NOTHING;

-- Insert terms for Therapeutic Procedures
INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Hemodialysis',
  'A procedure that uses a machine to filter waste products, excess fluids, and toxins from the blood when the kidneys are no longer able to perform this function adequately. Blood is removed through a vascular access point, cleaned by the dialysis machine, and returned to the body.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Therapeutic Procedures'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Chemotherapy Infusion',
  'Administration of cancer-fighting drugs through an intravenous (IV) line over a period of time. The medications travel through the bloodstream to reach cancer cells throughout the body. Treatment is typically given in cycles with rest periods in between to allow the body to recover.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Therapeutic Procedures'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Physical Therapy',
  'Treatment that uses physical methods like exercises, stretching, manual therapy, and therapeutic modalities (heat, cold, ultrasound, electrical stimulation) to restore movement, improve function, reduce pain, and prevent disability following injury, illness, or surgery.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Therapeutic Procedures'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Radiation Therapy',
  'Treatment that uses high-energy radiation beams to damage cancer cells and shrink tumors. Can be delivered externally using a machine (external beam radiation) or internally by placing radioactive material near the cancer (brachytherapy). Treatment is typically given in multiple sessions over several weeks.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Therapeutic Procedures'
ON CONFLICT (term) DO NOTHING;

INSERT INTO medical_terms (term, definition, subcategory_id)
SELECT 
  'Wound Debridement',
  'Removal of dead, damaged, or infected tissue from a wound to promote healing. Can be performed through various methods including surgical removal with instruments, enzymatic breakdown using special medications, mechanical removal, or biological removal using medical-grade maggots.',
  sc.id
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
WHERE c.name = 'Procedures & Diagnostics' AND sc.name = 'Therapeutic Procedures'
ON CONFLICT (term) DO NOTHING;
