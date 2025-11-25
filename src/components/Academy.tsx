import React, { useState } from 'react';
import { Lock, Shield, FileText, Stethoscope, ClipboardList, Activity, Send, Pill, MessageSquare, ArrowLeft, Code, BookOpen } from 'lucide-react';

interface Section {
  title: string;
  content: React.ReactNode;
}

interface Topic {
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  sections: Record<string, Section>;
}

interface Topics {
  [key: string]: Topic;
}

const Academy: React.FC = () => {
  const [currentTopic, setCurrentTopic] = useState<string>('home');
  const [activeSection, setActiveSection] = useState<string>('what');

  const topics: Topics = {
    hipaa: {
      title: 'HIPAA',
      icon: Shield,
      color: 'teal',
      bgColor: 'bg-slate-600',
      sections: {
        what: {
          title: 'What It Is',
          content: (
            <>
              <p className="mb-4">HIPAA stands for the <strong>Health Insurance Portability and Accountability Act</strong>, passed in 1996.</p>
              <p className="mb-4">Think of HIPAA as the "rulebook" that protects patient privacy and sets standards for how healthcare information must be handled, stored, and shared.</p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Simple Analogy:</p>
                <p>If patient information is like money in a bank, HIPAA is the security system, vault rules, and regulations that keep it safe.</p>
              </div>
            </>
          )
        },
        why: {
          title: 'Why It Matters',
          content: (
            <>
              <p className="mb-4">HIPAA violations can result in:</p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-gray-700 mr-2">•</span>
                  <span><strong>Fines:</strong> $100 to $50,000+ per violation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-700 mr-2">•</span>
                  <span><strong>Job loss:</strong> Immediate termination in many cases</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-700 mr-2">•</span>
                  <span><strong>Criminal charges:</strong> In severe cases, jail time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-700 mr-2">•</span>
                  <span><strong>Loss of patient trust:</strong> Damages clinic reputation</span>
                </li>
              </ul>
              <p>More importantly, it protects patients' dignity, privacy, and right to control their own health information.</p>
            </>
          )
        },
        where: {
          title: 'Where You\'ll See It',
          content: (
            <>
              <p className="mb-4">HIPAA applies everywhere patient information exists:</p>
              <div className="space-y-3">
                <div className="border-l-4 border-slate-600 pl-4">
                  <p className="font-semibold">Check-in Desk</p>
                  <p className="text-sm text-gray-600">Sign-in sheets, conversations at the window, forms left visible</p>
                </div>
                <div className="border-l-4 border-slate-600 pl-4">
                  <p className="font-semibold">Computer Screens</p>
                  <p className="text-sm text-gray-600">EHR systems, patient records, lab results - must log out when stepping away</p>
                </div>
                <div className="border-l-4 border-slate-600 pl-4">
                  <p className="font-semibold">Phone Conversations</p>
                  <p className="text-sm text-gray-600">Discussing patient info, leaving voicemails, confirming appointments</p>
                </div>
                <div className="border-l-4 border-slate-600 pl-4">
                  <p className="font-semibold">Fax & Email</p>
                  <p className="text-sm text-gray-600">Sending records, referrals, lab results - must be secure</p>
                </div>
                <div className="border-l-4 border-slate-600 pl-4">
                  <p className="font-semibold">Break Room</p>
                  <p className="text-sm text-gray-600">Never discuss patients by name or identifying details</p>
                </div>
              </div>
            </>
          )
        },
        key: {
          title: 'Key Things to Remember',
          content: (
            <>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="font-semibold text-gray-800 mb-2">✓ DO:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Lock your computer when you step away</li>
                  <li>• Verify identity before sharing information</li>
                  <li>• Keep your voice low when discussing patients</li>
                  <li>• Shred documents with patient info</li>
                  <li>• Report suspected violations immediately</li>
                </ul>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="font-semibold text-gray-800 mb-2">✗ DON'T:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Share login credentials with anyone</li>
                  <li>• Access records of patients you're not treating</li>
                  <li>• Discuss patients on social media (even without names)</li>
                  <li>• Leave patient files in public areas</li>
                  <li>• Take photos of patient information</li>
                </ul>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-semibold text-gray-800 mb-2">⚠ Common Mistakes:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Emailing patient info to personal accounts</li>
                  <li>• Gossiping about patients (even without names, details can identify them)</li>
                  <li>• Assuming family members can access info without authorization</li>
                </ul>
              </div>
            </>
          )
        }
      }
    },
    phi: {
      title: 'PHI (Protected Health Information)',
      icon: Lock,
      color: 'teal',
      bgColor: 'bg-slate-700',
      sections: {
        what: {
          title: 'What It Is',
          content: (
            <>
              <p className="mb-4"><strong>PHI (Protected Health Information)</strong> is any information about health status, healthcare provision, or payment that can be linked to a specific person.</p>
              <p className="mb-4">PHI is what HIPAA protects. If HIPAA is the lock, PHI is what's being locked up.</p>
              <div className="bg-slate-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">The 18 Identifiers of PHI:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>1. Names</div>
                  <div>2. Geographic info smaller than state</div>
                  <div>3. Dates (birth, death, admission, etc.)</div>
                  <div>4. Phone numbers</div>
                  <div>5. Fax numbers</div>
                  <div>6. Email addresses</div>
                  <div>7. Social Security numbers</div>
                  <div>8. Medical record numbers</div>
                  <div>9. Health plan numbers</div>
                  <div>10. Account numbers</div>
                  <div>11. Certificate/license numbers</div>
                  <div>12. Vehicle identifiers</div>
                  <div>13. Device identifiers/serial numbers</div>
                  <div>14. Web URLs</div>
                  <div>15. IP addresses</div>
                  <div>16. Biometric identifiers</div>
                  <div>17. Photos/images</div>
                  <div>18. Any other unique identifier</div>
                </div>
              </div>
            </>
          )
        },
        why: {
          title: 'Why It Matters',
          content: (
            <>
              <p className="mb-4">Understanding PHI is critical because:</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-slate-700 font-bold mr-2">1.</span>
                  <div>
                    <p className="font-semibold">It defines what you must protect</p>
                    <p className="text-sm text-gray-600">Not all health information is PHI, but most of what you handle daily is</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-700 font-bold mr-2">2.</span>
                  <div>
                    <p className="font-semibold">Even seemingly harmless details can be PHI</p>
                    <p className="text-sm text-gray-600">"The patient in room 3" + their condition = PHI if someone could identify them</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-700 font-bold mr-2">3.</span>
                  <div>
                    <p className="font-semibold">Context matters</p>
                    <p className="text-sm text-gray-600">The same information can be PHI in one context but not another</p>
                  </div>
                </li>
              </ul>
            </>
          )
        },
        where: {
          title: 'Where You\'ll See It',
          content: (
            <>
              <p className="mb-4">PHI appears in virtually every patient interaction:</p>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Registration Forms</p>
                  <p className="text-sm text-gray-700">Name, DOB, address, insurance info, emergency contacts</p>
                  <p className="text-xs text-slate-700 mt-1">→ All PHI, must be handled securely</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Medical Charts (EHR)</p>
                  <p className="text-sm text-gray-700">Diagnosis, medications, vital signs, provider notes, lab results</p>
                  <p className="text-xs text-slate-700 mt-1">→ Highest concentration of PHI</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Billing/Insurance Documents</p>
                  <p className="text-sm text-gray-700">Claim forms, EOBs, payment records linked to patient</p>
                  <p className="text-xs text-slate-700 mt-1">→ PHI because they link payment to health services</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Appointment Scheduling</p>
                  <p className="text-sm text-gray-700">Patient name + appointment type reveals health information</p>
                  <p className="text-xs text-slate-700 mt-1">→ Often overlooked but still PHI</p>
                </div>
              </div>
            </>
          )
        },
        key: {
          title: 'Key Things to Remember',
          content: (
            <>
              <div className="bg-slate-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-3">The "Can Someone Be Identified?" Test:</p>
                <p className="mb-2">Ask yourself: Could this information be used alone or combined with other information to figure out who the patient is?</p>
                <p className="text-sm">If YES → It's PHI and must be protected</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="border-l-4 border-gray-600 pl-3">
                  <p className="font-semibold text-gray-800">Example: NOT PHI</p>
                  <p className="text-sm">"We had 47 diabetes patients visit this month"</p>
                  <p className="text-xs text-gray-600">→ No identifying information</p>
                </div>
                <div className="border-l-4 border-gray-800 pl-3">
                  <p className="font-semibold text-gray-800">Example: IS PHI</p>
                  <p className="text-sm">"John Smith came in for his diabetes checkup"</p>
                  <p className="text-xs text-gray-600">→ Name + health condition = PHI</p>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-semibold text-gray-800 mb-2">⚠ Gray Areas:</p>
                <ul className="space-y-2 text-sm">
                  <li><strong>De-identified information:</strong> PHI with all 18 identifiers removed is no longer PHI</li>
                  <li><strong>Limited data sets:</strong> Some identifiers removed but not all - still has restrictions</li>
                  <li><strong>When in doubt:</strong> Treat it as PHI and ask your supervisor</li>
                </ul>
              </div>
            </>
          )
        }
      }
    },
    cpt: {
      title: 'CPT Codes',
      icon: Stethoscope,
      color: 'teal',
      bgColor: 'bg-orange-500',
      sections: {
        what: {
          title: 'What It Is',
          content: (
            <>
              <p className="mb-4"><strong>CPT</strong> stands for <strong>Current Procedural Terminology</strong>.</p>
              <p className="mb-4">These are standardized codes that describe medical services, procedures, and treatments performed by healthcare providers.</p>
              <div className="bg-orange-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Think of it as:</p>
                <p>If ICD-10 codes answer "what's wrong with the patient," CPT codes answer "what did we DO about it"</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">CPT codes are 5-digit numbers:</p>
                <div className="space-y-2 text-sm">
                  <div className="font-mono text-lg">99213</div>
                  <p>Office visit, established patient, low complexity</p>
                  <div className="font-mono text-lg mt-2">80053</div>
                  <p>Comprehensive metabolic panel (blood test)</p>
                  <div className="font-mono text-lg mt-2">93000</div>
                  <p>Electrocardiogram (EKG)</p>
                </div>
              </div>
            </>
          )
        },
        why: {
          title: 'Why It Matters',
          content: (
            <>
              <p className="mb-4">CPT codes are crucial for:</p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-orange-500 text-xl mr-3">💵</span>
                  <div>
                    <p className="font-semibold">Getting Paid</p>
                    <p className="text-sm text-gray-600">Each CPT code has an associated payment amount. Wrong code = wrong payment (or no payment)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-orange-500 text-xl mr-3">🔗</span>
                  <div>
                    <p className="font-semibold">Linking to Diagnosis</p>
                    <p className="text-sm text-gray-600">CPT codes must be supported by ICD-10 codes. The diagnosis must justify the procedure</p>
                    <p className="text-xs text-gray-500 italic mt-1">Example: Can't bill for diabetes test without diabetes diagnosis</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-orange-500 text-xl mr-3">📋</span>
                  <div>
                    <p className="font-semibold">Documentation of Care</p>
                    <p className="text-sm text-gray-600">Creates a clear record of exactly what services were provided</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-orange-500 text-xl mr-3">⚖️</span>
                  <div>
                    <p className="font-semibold">Compliance & Audits</p>
                    <p className="text-sm text-gray-600">Incorrect coding can lead to audits, repayment demands, or fraud investigations</p>
                  </div>
                </div>
              </div>
            </>
          )
        },
        where: {
          title: 'Where You\'ll See It',
          content: (
            <>
              <p className="mb-4">CPT codes appear throughout the billing workflow:</p>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Charge Capture / Encounter Forms</p>
                  <p className="text-sm text-gray-700 mb-2">After patient visit, provider marks services performed:</p>
                  <div className="text-xs bg-white p-2 rounded border">
                    <div>☑ 99213 - Office visit, established patient</div>
                    <div>☑ 36415 - Venipuncture (blood draw)</div>
                    <div>☑ 80053 - Metabolic panel</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Insurance Claims (CMS-1500)</p>
                  <p className="text-sm text-gray-700">Box 24D contains CPT codes with their associated charges</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">EHR Billing Module</p>
                  <p className="text-sm text-gray-700">Where you review, add, or modify procedure codes before submitting claims</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Explanation of Benefits (EOB)</p>
                  <p className="text-sm text-gray-700">Shows which CPT codes insurance paid, denied, or adjusted</p>
                </div>
              </div>
            </>
          )
        },
        key: {
          title: 'Key Things to Remember',
          content: (
            <>
              <div className="bg-orange-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-orange-800 mb-2">Critical CPT Rules:</p>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Code what was done, not what was planned:</strong> If test wasn't performed, don't bill it</li>
                  <li>• <strong>Modifiers matter:</strong> Small additions (-25, -59, -LT, -RT) change meaning significantly</li>
                  <li>• <strong>Bundling rules:</strong> Some codes can't be billed together - one includes the other</li>
                  <li>• <strong>Time-based codes:</strong> Some E/M codes require documentation of time spent</li>
                  <li>• <strong>Global periods:</strong> Surgical codes include follow-up visits - can't bill separately</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-blue-800 mb-2">Common CPT Code Categories:</p>
                <div className="space-y-1 text-sm">
                  <div><strong>99202-99215:</strong> Office visits (E/M codes)</div>
                  <div><strong>80000-89999:</strong> Laboratory tests</div>
                  <div><strong>70000-79999:</strong> Radiology/imaging</div>
                  <div><strong>90000-99999:</strong> Medicine (vaccines, injections, etc.)</div>
                  <div><strong>99381-99397:</strong> Preventive visits (physicals)</div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-purple-800 mb-2">The ICD-10 ↔ CPT Connection:</p>
                <div className="text-sm space-y-2">
                  <div className="bg-white p-2 rounded">
                    <p className="font-mono text-xs">ICD-10: E11.9 (Type 2 Diabetes)</p>
                    <p className="font-mono text-xs">CPT: 82947 (Glucose blood test)</p>
                    <p className="text-xs text-gray-600 mt-1">✓ These match - diabetes justifies glucose test</p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <p className="font-mono text-xs">ICD-10: J06.9 (Common cold)</p>
                    <p className="font-mono text-xs">CPT: 93000 (EKG)</p>
                    <p className="text-xs text-red-600 mt-1">✗ Mismatch - cold doesn't justify heart test</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-semibold text-red-800 mb-2">⚠ Common Mistakes:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Using outdated codes (CPT updates annually every January)</li>
                  <li>• "Upcoding" - choosing higher-level code than documentation supports</li>
                  <li>• Unbundling - billing separately for services that should be grouped</li>
                  <li>• Missing required modifiers</li>
                </ul>
              </div>
            </>
          )
        }
      }
    },
    snomed: {
      title: 'SNOMED CT',
      icon: Code,
      color: 'teal',
      bgColor: 'bg-indigo-500',
      sections: {
        what: {
          title: 'What It Is',
          content: (
            <>
              <p className="mb-4"><strong>SNOMED CT</strong> stands for <strong>Systematized Nomenclature of Medicine - Clinical Terms</strong>.</p>
              <p className="mb-4">It's a comprehensive medical terminology system that covers diseases, symptoms, procedures, anatomy, medications, and more - far more detailed than ICD-10 or CPT.</p>
              <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Think of it as:</p>
                <p>The "behind-the-scenes" language that EHR systems use to understand and connect medical information. While ICD-10 and CPT are for billing, SNOMED is for clinical documentation and decision support.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">SNOMED uses concept IDs (numbers):</p>
                <div className="text-sm space-y-2">
                  <div><span className="font-mono">38341003</span> = Hypertension</div>
                  <div><span className="font-mono">22298006</span> = Myocardial infarction (heart attack)</div>
                  <div><span className="font-mono">386661006</span> = Fever</div>
                </div>
                <p className="text-xs text-gray-600 mt-2">Don't worry - you rarely see these numbers. The EHR shows you the terms!</p>
              </div>
            </>
          )
        },
        why: {
          title: 'Why It Matters',
          content: (
            <>
              <p className="mb-4">SNOMED CT enables modern EHR capabilities:</p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-indigo-500 text-xl mr-3">🔍</span>
                  <div>
                    <p className="font-semibold">Clinical Decision Support</p>
                    <p className="text-sm text-gray-600">Drug interaction alerts, clinical guidelines, preventive care reminders - all powered by SNOMED</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-indigo-500 text-xl mr-3">🔄</span>
                  <div>
                    <p className="font-semibold">Interoperability</p>
                    <p className="text-sm text-gray-600">Helps different EHR systems understand and share patient information accurately</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-indigo-500 text-xl mr-3">🎯</span>
                  <div>
                    <p className="font-semibold">Precision in Documentation</p>
                    <p className="text-sm text-gray-600">Much more granular than ICD-10 - can specify laterality, severity, anatomical location in detail</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-indigo-500 text-xl mr-3">📊</span>
                  <div>
                    <p className="font-semibold">Research & Quality Measurement</p>
                    <p className="text-sm text-gray-600">Enables detailed analysis of treatments, outcomes, and population health</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-indigo-500 text-xl mr-3">🗺️</span>
                  <div>
                    <p className="font-semibold">Mapping to Other Systems</p>
                    <p className="text-sm text-gray-600">SNOMED can automatically convert to ICD-10 codes for billing</p>
                  </div>
                </div>
              </div>
            </>
          )
        },
        where: {
          title: 'Where You\'ll See It',
          content: (
            <>
              <p className="mb-4">You'll mostly interact with SNOMED indirectly through your EHR:</p>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Problem Lists</p>
                  <p className="text-sm text-gray-700">When you search for a diagnosis to add, you're searching SNOMED concepts</p>
                  <p className="text-xs text-indigo-600 mt-1">Type "chest pain" → EHR shows SNOMED options → Select one → EHR maps to ICD-10 for billing</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Order Entry</p>
                  <p className="text-sm text-gray-700">Lab tests, medications, procedures - often coded with SNOMED behind the scenes</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Clinical Notes</p>
                  <p className="text-sm text-gray-700">Structured data entry fields use SNOMED to standardize information</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Clinical Alerts</p>
                  <p className="text-sm text-gray-700">"Patient on aspirin + ibuprofen = bleeding risk" - powered by SNOMED relationships</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Health Information Exchange (HIE)</p>
                  <p className="text-sm text-gray-700">When sharing records between facilities, SNOMED ensures accurate translation</p>
                </div>
              </div>
            </>
          )
        },
        key: {
          title: 'Key Things to Remember',
          content: (
            <>
              <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-indigo-800 mb-2">For Ambulatory Clinic Staff:</p>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>You won't manually enter SNOMED codes</strong> - the EHR handles this in the background</li>
                  <li>• <strong>Be specific when documenting:</strong> The more precise your term selection, the better the clinical data quality</li>
                  <li>• <strong>SNOMED ≠ ICD-10:</strong> Don't confuse them. Your EHR may show both</li>
                  <li>• <strong>It's okay not to memorize codes:</strong> Focus on understanding the concepts and using search effectively</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-blue-800 mb-2">SNOMED vs ICD-10 vs CPT:</p>
                <div className="space-y-2 text-sm">
                  <div className="bg-white p-2 rounded">
                    <p className="font-semibold">ICD-10</p>
                    <p className="text-xs text-gray-600">Purpose: Billing & statistical reporting</p>
                    <p className="text-xs text-gray-600">Example: E11.9 (Type 2 Diabetes)</p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <p className="font-semibold">CPT</p>
                    <p className="text-xs text-gray-600">Purpose: Billing for procedures/services</p>
                    <p className="text-xs text-gray-600">Example: 99213 (Office visit)</p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <p className="font-semibold">SNOMED CT</p>
                    <p className="text-xs text-gray-600">Purpose: Clinical documentation & EHR functionality</p>
                    <p className="text-xs text-gray-600">Example: 44054006 (Diabetes mellitus type 2)</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-green-800 mb-2">Why SNOMED Is More Detailed:</p>
                <div className="text-sm">
                  <p className="mb-2">ICD-10 has ~70,000 codes</p>
                  <p className="mb-2">CPT has ~10,000 codes</p>
                  <p className="font-bold">SNOMED CT has ~350,000+ concepts</p>
                  <p className="text-xs text-gray-600 mt-2">This allows for much more nuanced clinical documentation</p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="font-semibold text-yellow-800 mb-2">⚠ What You Need to Know:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Your EHR might show "SNOMED" or "SCT" in some fields - now you know what it means</li>
                  <li>• When the EHR auto-suggests diagnoses, it's searching SNOMED</li>
                  <li>• Some reports or data exports might reference SNOMED codes</li>
                  <li>• You don't need to be a SNOMED expert - just understand its role</li>
                </ul>
              </div>
            </>
          )
        }
      }
    },
    icd10: {
      title: 'ICD-10 Codes',
      icon: ClipboardList,
      color: 'teal',
      bgColor: 'bg-blue-600',
      sections: {
        what: {
          title: 'What It Is',
          content: (
            <>
              <p className="mb-4"><strong>ICD-10</strong> stands for <strong>International Classification of Diseases, 10th Revision</strong>.</p>
              <p className="mb-4">These are standardized codes that describe diagnoses, symptoms, injuries, and reasons for healthcare visits. Think of them as the "medical dictionary" that explains what's wrong with the patient.</p>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Simple Analogy:</p>
                <p>If CPT codes tell you what the provider DID (the action), ICD-10 codes tell you WHY they did it (the reason/diagnosis).</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">ICD-10 codes are alphanumeric (3-7 characters):</p>
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <p className="font-mono text-lg mb-1">E11.9</p>
                    <p className="text-gray-700">Type 2 diabetes mellitus without complications</p>
                    <div className="text-xs text-gray-500 mt-2">
                      <div>E = Endocrine, nutritional and metabolic diseases</div>
                      <div>11 = Type 2 diabetes mellitus</div>
                      <div>.9 = Without complications</div>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="font-mono text-lg mb-1">I10</p>
                    <p className="text-gray-700">Essential (primary) hypertension</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="font-mono text-lg mb-1">J06.9</p>
                    <p className="text-gray-700">Acute upper respiratory infection, unspecified</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="font-mono text-lg mb-1">Z23</p>
                    <p className="text-gray-700">Encounter for immunization</p>
                    <p className="text-xs text-blue-600 mt-1">Note: Z codes are for encounters, not illnesses</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="font-semibold text-yellow-800 mb-2">⚠ Important:</p>
                <p className="text-sm">ICD-10 has about <strong>70,000 codes</strong> - you don't need to memorize them! Focus on understanding the structure and how to look them up.</p>
              </div>
            </>
          )
        },
        why: {
          title: 'Why It Matters',
          content: (
            <>
              <p className="mb-4">ICD-10 codes are critical for multiple reasons:</p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-blue-600 text-xl mr-3">💰</span>
                  <div>
                    <p className="font-semibold">Medical Necessity & Payment</p>
                    <p className="text-sm text-gray-600 mb-2">Insurance won't pay for services unless the diagnosis justifies them. The ICD-10 code proves the CPT procedure was medically necessary.</p>
                    <div className="bg-green-50 p-2 rounded text-xs mt-1">
                      <strong>Example:</strong> Diabetes diagnosis (E11.9) justifies glucose monitoring supplies → Insurance pays
                    </div>
                    <div className="bg-red-50 p-2 rounded text-xs mt-1">
                      <strong>Example:</strong> No diabetes diagnosis → Request for glucose strips → Insurance denies
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 text-xl mr-3">📊</span>
                  <div>
                    <p className="font-semibold">Tracking Patient Health Status</p>
                    <p className="text-sm text-gray-600">ICD-10 codes populate the patient's problem list, which providers use to track chronic conditions, active issues, and medical history.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 text-xl mr-3">🏥</span>
                  <div>
                    <p className="font-semibold">Quality Reporting & Population Health</p>
                    <p className="text-sm text-gray-600">Healthcare organizations track quality metrics (diabetes control, blood pressure management) based on ICD-10 coded data.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 text-xl mr-3">📈</span>
                  <div>
                    <p className="font-semibold">Public Health & Epidemiology</p>
                    <p className="text-sm text-gray-600">ICD-10 data tracks disease trends, outbreak patterns, and helps allocate public health resources.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 text-xl mr-3">🔬</span>
                  <div>
                    <p className="font-semibold">Medical Research</p>
                    <p className="text-sm text-gray-600">Researchers use coded data to study treatment outcomes, disease prevalence, and healthcare utilization.</p>
                  </div>
                </div>
              </div>
            </>
          )
        },
        where: {
          title: 'Where You\'ll See It',
          content: (
            <>
              <p className="mb-4">ICD-10 codes appear throughout the patient care and billing workflow:</p>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Problem List</p>
                  <p className="text-sm text-gray-700 mb-2">The running list of patient's diagnoses and chronic conditions in the EHR:</p>
                  <div className="text-xs bg-white p-2 rounded border space-y-1">
                    <div>• I10 - Hypertension (Active - 01/15/2023)</div>
                    <div>• E11.9 - Type 2 Diabetes (Active - 03/22/2022)</div>
                    <div>• E78.5 - Hyperlipidemia (Active - 03/22/2022)</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Encounter/Superbill</p>
                  <p className="text-sm text-gray-700">After visit, provider selects diagnosis codes for that day's visit. These link to the CPT codes for billing.</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Insurance Claims (CMS-1500)</p>
                  <p className="text-sm text-gray-700">Box 21 contains ICD-10 codes (up to 12). These must match the services billed in Box 24.</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Prior Authorization Forms</p>
                  <p className="text-sm text-gray-700">Insurance requires diagnosis codes to approve expensive tests, procedures, or medications.</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Referrals</p>
                  <p className="text-sm text-gray-700">When referring to specialist, you include ICD-10 codes showing why the referral is needed.</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Lab/Imaging Orders</p>
                  <p className="text-sm text-gray-700">Diagnostic orders often require a diagnosis code indicating medical necessity.</p>
                </div>
              </div>
            </>
          )
        },
        key: {
          title: 'Key Things to Remember',
          content: (
            <>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-blue-800 mb-2">ICD-10 Code Structure:</p>
                <div className="space-y-2 text-sm">
                  <div className="bg-white p-2 rounded">
                    <p className="font-semibold">Category (1st character): Letter</p>
                    <p className="text-xs text-gray-600">A-B = Infections, C-D = Neoplasms, E = Endocrine, I = Circulatory, J = Respiratory, etc.</p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <p className="font-semibold">Etiology/Anatomy (2nd-3rd): Numbers</p>
                    <p className="text-xs text-gray-600">Specifies the body system or condition type</p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <p className="font-semibold">Extension (4th-7th): Numbers/Letters</p>
                    <p className="text-xs text-gray-600">Adds specificity: severity, laterality, complications, type</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-purple-800 mb-2">Special Code Categories:</p>
                <ul className="space-y-2 text-sm">
                  <li><strong>Z codes:</strong> Factors influencing health status (Z23 = vaccination, Z79.4 = long-term insulin use)</li>
                  <li><strong>External cause codes:</strong> V, W, X, Y codes describe how injury occurred (V29.9 = motorcycle accident)</li>
                  <li><strong>Combination codes:</strong> One code for multiple conditions (I25.10 = Atherosclerotic heart disease with unstable angina)</li>
                  <li><strong>Manifestation codes:</strong> Cannot be primary diagnosis, only used with underlying condition code</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-green-800 mb-2">Specificity Matters:</p>
                <div className="space-y-2 text-sm">
                  <div className="bg-white p-2 rounded">
                    <p className="text-red-600 font-semibold">❌ Too vague: J44.9 (COPD, unspecified)</p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <p className="text-green-600 font-semibold">✓ More specific: J44.1 (COPD with acute exacerbation)</p>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">More specific codes = Better reimbursement + Better patient data quality</p>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-orange-800 mb-2">Common Coding Rules:</p>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Code to the highest level of specificity:</strong> Use all available characters</li>
                  <li>• <strong>Code what you know:</strong> Don't assume or speculate about diagnoses</li>
                  <li>• <strong>Sequence matters:</strong> List primary/principal diagnosis first, then secondary conditions</li>
                  <li>• <strong>Laterality required:</strong> Many codes need left/right designation (if documented)</li>
                  <li>• <strong>Acute vs. Chronic:</strong> Specify when code structure allows it</li>
                  <li>• <strong>Updates annually:</strong> ICD-10 codes change every October 1st</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-semibold text-red-800 mb-2">⚠ Common Mistakes:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Using "unspecified" codes when more specific information is documented</li>
                  <li>• Coding symptoms when diagnosis is known (don't code "chest pain" if you know it's "myocardial infarction")</li>
                  <li>• Missing required 7th character extensions (especially for injuries)</li>
                  <li>• Incorrect sequencing of diagnosis codes on claims</li>
                  <li>• Using outdated codes after October updates</li>
                  <li>• Linking wrong ICD-10 to CPT - diagnosis must justify procedure</li>
                </ul>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-semibold text-gray-800 mb-2">Resources for Looking Up ICD-10 Codes:</p>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Your EHR's built-in code search</strong> - Primary tool</li>
                  <li>• <strong>ICD10Data.com</strong> - Free online reference</li>
                  <li>• <strong>CMS ICD-10 website</strong> - Official code files</li>
                  <li>• <strong>ICD-10 code books</strong> - Physical or digital reference</li>
                  <li>• <strong>Your facility's coding specialist</strong> - When in doubt, ask!</li>
                </ul>
              </div>
            </>
          )
        }
      }
    },
    why: {
      title: 'Why Coding Matters',
      icon: BookOpen,
      color: 'teal',
      bgColor: 'bg-pink-500',
      sections: {
        what: {
          title: 'The Big Picture',
          content: (
            <>
              <p className="mb-4 text-lg font-semibold">Medical coding is the backbone of the entire healthcare system.</p>
              <p className="mb-4">Every code you enter, verify, or work with has real-world consequences - for patients, providers, insurers, researchers, and public health officials.</p>
              <div className="bg-pink-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Think of coding as:</p>
                <p>The translation layer that converts complex medical care into a universal language that makes healthcare work financially, legally, and clinically.</p>
              </div>
            </>
          )
        },
        why: {
          title: 'Why It Matters',
          content: (
            <>
              <div className="space-y-4">
                <div className="border-l-4 border-pink-500 pl-4">
                  <p className="font-semibold text-lg mb-2">1. Financial Impact</p>
                  <p className="text-sm text-gray-700 mb-2">Healthcare organizations depend on accurate coding for revenue:</p>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Correct coding = Payment received</strong></li>
                    <li>• <strong>Incorrect coding = Claim denial</strong> → staff must rework → delayed payment → cash flow problems</li>
                    <li>• <strong>Missing codes = Lost revenue</strong> → services provided but not billed</li>
                    <li>• <strong>Wrong codes = Overpayment</strong> → audit → repayment demands + fines</li>
                  </ul>
                </div>

                <div className="border-l-4 border-pink-500 pl-4">
                  <p className="font-semibold text-lg mb-2">2. Legal & Compliance</p>
                  <p className="text-sm text-gray-700 mb-2">Coding errors can have serious legal consequences:</p>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Fraud:</strong> Intentionally upcoding or billing for services not performed</li>
                    <li>• <strong>Abuse:</strong> Patterns of incorrect coding, even if unintentional</li>
                    <li>• <strong>Audits:</strong> Medicare, Medicaid, and private insurers regularly audit coding</li>
                    <li>• <strong>Penalties:</strong> Fines, repayments, exclusion from insurance programs, even criminal charges</li>
                  </ul>
                </div>

                <div className="border-l-4 border-pink-500 pl-4">
                  <p className="font-semibold text-lg mb-2">3. Patient Care Quality</p>
                  <p className="text-sm text-gray-700 mb-2">Accurate coding directly affects patient care:</p>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Problem lists:</strong> Incomplete/wrong codes = providers miss important history</li>
                    <li>• <strong>Clinical alerts:</strong> Depend on accurate coded data to warn of drug interactions, allergies</li>
                    <li>• <strong>Continuity of care:</strong> Other providers rely on coded information when treating patient</li>
                    <li>• <strong>Quality metrics:</strong> Healthcare organizations tracked on coded outcomes</li>
                  </ul>
                </div>

                <div className="border-l-4 border-pink-500 pl-4">
                  <p className="font-semibold text-lg mb-2">4. Public Health & Research</p>
                  <p className="text-sm text-gray-700 mb-2">Coded data powers larger healthcare initiatives:</p>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Disease surveillance:</strong> Track outbreaks, trends (COVID, flu, diabetes rates)</li>
                    <li>• <strong>Resource allocation:</strong> Governments use coded data to fund programs</li>
                    <li>• <strong>Medical research:</strong> Large studies rely on aggregated coded data</li>
                    <li>• <strong>Health policy:</strong> Legislation informed by population-level coded data</li>
                  </ul>
                </div>
              </div>
            </>
          )
        },
        where: {
          title: 'Your Role in the Coding Process',
          content: (
            <>
              <p className="mb-4">Even if you're not a certified coder, you play a critical role:</p>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-semibold mb-1">Before the Visit</p>
                  <p className="text-sm text-gray-700">Verify insurance, check referral diagnoses, review patient history codes</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="font-semibold mb-1">During the Visit</p>
                  <p className="text-sm text-gray-700">Accurate chief complaint documentation, updating problem lists, capturing new symptoms</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="font-semibold mb-1">After the Visit</p>
                  <p className="text-sm text-gray-700">Checking encounter forms, ensuring codes match documentation, submitting clean claims</p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <p className="font-semibold mb-1">Ongoing</p>
                  <p className="text-sm text-gray-700">Following up on denied claims, correcting coding errors, staying current on code updates</p>
                </div>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg mt-4">
                <p className="font-semibold mb-2">Remember:</p>
                <p className="text-sm">You are the "first line of defense" for coding accuracy. Catching errors early saves time, money, and protects patients.</p>
              </div>
            </>
          )
        },
        key: {
          title: 'Key Principles',
          content: (
            <>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-green-800 mb-2 text-lg">✓ The Golden Rules of Coding:</p>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>If it wasn't documented, it wasn't done</strong> - code only what's in the chart</li>
                  <li>• <strong>Code to the highest level of specificity available</strong></li>
                  <li>• <strong>Diagnosis codes must support procedure codes</strong> - medical necessity</li>
                  <li>• <strong>When in doubt, ask</strong> - never guess on codes</li>
                  <li>• <strong>Stay current</strong> - codes change annually, rules update frequently</li>
                  <li>• <strong>Accuracy over speed</strong> - a clean claim processed once is better than a denied claim reworked three times</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-blue-800 mb-2 text-lg">How Coding Impacts Everyone:</p>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Patients:</p>
                    <p className="text-gray-700">Correct coding = accurate bills, proper insurance coverage, complete medical records</p>
                  </div>
                  <div>
                    <p className="font-semibold">Providers:</p>
                    <p className="text-gray-700">Fair reimbursement for services, reduced audit risk, quality metrics for reputation</p>
                  </div>
                  <div>
                    <p className="font-semibold">Staff (You!):</p>
                    <p className="text-gray-700">Less rework, fewer angry patients about bills, stable employment (organization remains financially viable)</p>
                  </div>
                  <div>
                    <p className="font-semibold">Healthcare System:</p>
                    <p className="text-gray-700">Accurate data for research, policy, resource allocation, public health initiatives</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-orange-800 mb-2">Real-World Example:</p>
                <div className="bg-white p-3 rounded text-sm space-y-2">
                  <p><strong>Scenario:</strong> Patient with diabetes comes in for foot pain</p>
                  <p><strong>Poor Coding:</strong></p>
                  <ul className="ml-4 text-xs">
                    <li>• Code: M79.9 (Unspecified pain in limb)</li>
                    <li>• Result: Insurer denies - "not medically necessary for diabetes patient"</li>
                    <li>• Impact: No payment, patient angry about bill, staff must appeal</li>
                  </ul>
                  <p className="mt-2"><strong>Good Coding:</strong></p>
                  <ul className="ml-4 text-xs">
                    <li>• Codes: E11.9 (Type 2 Diabetes) + E11.621 (Diabetic foot ulcer)</li>
                    <li>• Result: Claim paid - diabetes complications are covered</li>
                    <li>• Impact: Everyone happy, patient gets needed care, organization gets paid</li>
                  </ul>
                </div>
              </div>

              <div className="bg-pink-50 p-4 rounded-lg">
                <p className="font-semibold text-pink-800 mb-2 text-lg">Your Coding Mindset:</p>
                <p className="text-sm mb-2">Every time you work with codes, remember:</p>
                <ul className="text-sm space-y-1">
                  <li>• This affects whether we get paid</li>
                  <li>• This affects patient care quality</li>
                  <li>• This affects legal compliance</li>
                  <li>• This contributes to healthcare data that helps everyone</li>
                </ul>
                <p className="text-sm mt-3 font-semibold">Your attention to detail makes a real difference.</p>
              </div>
            </>
          )
        }
      }
    },
    records: {
      title: 'Medical Records',
      icon: FileText,
      color: 'teal',
      bgColor: 'bg-teal-600',
      sections: {
        what: {
          title: 'What It Is',
          content: (
            <>
              <p className="mb-4">Medical records management handles health information flowing in and out of the clinic—tracking records from other providers, outside facilities, and requests for patient information.</p>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Incoming:</p>
                <p className="text-sm">Hospital discharge summaries, specialist consult notes, outside lab/imaging results, ED visit summaries, records from previous providers</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Outgoing:</p>
                <p className="text-sm">Medical record requests for continuity of care, prior authorization docs, referral packets, disability paperwork, patient-requested copies</p>
              </div>
            </>
          )
        },
        why: {
          title: 'Why It Matters',
          content: (
            <>
              <p className="mb-4">When records don't flow properly:</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <span><strong>Care gaps:</strong> Specialist recommendations never reach the primary provider</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <span><strong>Delayed authorizations:</strong> Missing documentation delays insurance approvals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <span><strong>Duplicated tests:</strong> Providers re-order tests already completed elsewhere</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <span><strong>Legal issues:</strong> Missing required timeframes for record requests brings fines</span>
                </li>
              </ul>
            </>
          )
        },
        where: {
          title: 'Where You\'ll See It',
          content: (
            <>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Front Desk</p>
                  <p className="text-sm text-gray-700">Patients bring records to scan and route</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Pre-Visit Prep</p>
                  <p className="text-sm text-gray-700">Staff check for missing consult notes and discharge summaries</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Provider Inboxes</p>
                  <p className="text-sm text-gray-700">Review incoming records and integrate into care plans</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">HIM/ROI Teams</p>
                  <p className="text-sm text-gray-700">Process formal record requests with HIPAA compliance</p>
                </div>
              </div>
            </>
          )
        },
        key: {
          title: 'Key Things to Remember',
          content: (
            <>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Unstructured Data Challenge:</p>
                <p className="text-sm">Most records arrive as PDFs/faxes, requiring manual review and filing. Information doesn't auto-populate into flowsheets.</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="font-semibold text-gray-800 mb-2">ROI Process:</p>
                <p className="text-sm mb-2">When others request records:</p>
                <ul className="text-sm space-y-1">
                  <li>• Verify request validity and authorization</li>
                  <li>• Compile requested information</li>
                  <li>• Redact sensitive info if needed</li>
                  <li>• Deliver securely and document</li>
                </ul>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Common Mistakes:</p>
                <ul className="text-sm space-y-1">
                  <li>• Filing without provider review</li>
                  <li>• Losing track of incoming records</li>
                  <li>• Delaying outgoing requests</li>
                  <li>• Not following up on missing consult notes</li>
                </ul>
              </div>
            </>
          )
        }
      }
    },
    screenings: {
      title: 'Preventive Screenings',
      icon: Stethoscope,
      color: 'teal',
      bgColor: 'bg-teal-600',
      sections: {
        what: {
          title: 'What It Is',
          content: (
            <>
              <p className="mb-4">Preventive screenings are proactive assessments to identify health risks before they become serious problems. Performed on schedules based on age, risk factors, and clinical guidelines.</p>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Common screenings:</p>
                <div className="text-sm space-y-1">
                  <div>• Cancer: mammograms, colonoscopies, Pap smears</div>
                  <div>• Cardiovascular: BP checks, cholesterol panels</div>
                  <div>• Mental health: depression, anxiety assessments</div>
                  <div>• Bone health: DEXA scans</div>
                  <div>• Fall risk and developmental milestones</div>
                </div>
              </div>
            </>
          )
        },
        why: {
          title: 'Why It Matters',
          content: (
            <>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Early detection saves lives</p>
                    <p className="text-sm text-gray-600">Stage 1 vs stage 4 cancer = curable vs advanced disease</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Reduces costs</p>
                    <p className="text-sm text-gray-600">Prevention is far less expensive than treating advanced illness</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Guides care planning</p>
                    <p className="text-sm text-gray-600">Results trigger counseling, medications, or lifestyle changes</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Quality metrics</p>
                    <p className="text-sm text-gray-600">Screening completion rates affect reimbursement</p>
                  </div>
                </li>
              </ul>
            </>
          )
        },
        where: {
          title: 'Where You\'ll See It',
          content: (
            <>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Annual Wellness Visits</p>
                  <p className="text-sm text-gray-700">Structured screenings for multiple health domains</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Pre-Visit Prep</p>
                  <p className="text-sm text-gray-700">MAs flag overdue screenings for providers</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">During Visits</p>
                  <p className="text-sm text-gray-700">Staff administer questionnaires and document in EHR</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Follow-Up Workflows</p>
                  <p className="text-sm text-gray-700">Positive screens trigger referrals or interventions</p>
                </div>
              </div>
            </>
          )
        },
        key: {
          title: 'Key Things to Remember',
          content: (
            <>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Different Schedules:</p>
                <ul className="text-sm space-y-1">
                  <li>• Annual: BP, depression screening</li>
                  <li>• Every 2-3 years: Cervical cancer</li>
                  <li>• Every 10 years: Colonoscopy (average risk)</li>
                  <li>• One-time: Hep C screening, AAA screening</li>
                </ul>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="font-semibold text-gray-800 mb-2">Risk Stratification:</p>
                <p className="text-sm">High-risk patients need more frequent screening (family history alters schedules)</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Common Mistakes:</p>
                <ul className="text-sm space-y-1">
                  <li>• No follow-up on positive screens</li>
                  <li>• Not adjusting for risk factors</li>
                  <li>• Screening too frequently</li>
                  <li>• Ordering but never reviewing results</li>
                </ul>
              </div>
            </>
          )
        }
      }
    },
    orders: {
      title: 'Orders & Results',
      icon: ClipboardList,
      color: 'teal',
      bgColor: 'bg-teal-600',
      sections: {
        what: {
          title: 'What It Is',
          content: (
            <>
              <p className="mb-4">The complete lifecycle from ordering diagnostic tests to receiving and acting on results—a critical but asynchronous process that requires careful tracking.</p>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">The Complete Cycle:</p>
                <div className="text-sm space-y-2">
                  <div className="flex items-center">
                    <span className="font-bold mr-2">1.</span>
                    <span>Provider orders test (labs, imaging, diagnostics)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold mr-2">2.</span>
                    <span>Order transmitted to lab/facility</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold mr-2">3.</span>
                    <span>Patient schedules and completes test</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold mr-2">4.</span>
                    <span>Results arrive back to clinic (hours to weeks later)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold mr-2">5.</span>
                    <span>Provider reviews and takes action</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold mr-2">6.</span>
                    <span>Patient notified of results and next steps</span>
                  </div>
                </div>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Types of Orders:</p>
                <p className="text-sm">Lab work (blood tests, urinalysis), Imaging (X-rays, CT, MRI, ultrasound), Specialized tests (EKG, sleep studies, pulmonary function), External procedures (colonoscopy, endoscopy)</p>
              </div>
            </>
          )
        },
        why: {
          title: 'Why It Matters',
          content: (
            <>
              <p className="mb-4">The asynchronous nature of orders and results creates significant risk:</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Critical results can be life-saving if caught quickly</p>
                    <p className="text-sm text-gray-600">Severe anemia, cancer findings, dangerous electrolyte imbalances need immediate action</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Results arrive unpredictably</p>
                    <p className="text-sm text-gray-600">Lab results in hours, imaging in days, biopsy results in weeks. Staff must track all of them.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Patient compliance issues</p>
                    <p className="text-sm text-gray-600">Order placed doesn't mean test completed. Patients forget, get busy, or can't afford it.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Legal responsibility</p>
                    <p className="text-sm text-gray-600">Clinics are liable for follow-up on ALL results, even if patient doesn't show up</p>
                  </div>
                </li>
              </ul>
            </>
          )
        },
        where: {
          title: 'Where You\'ll See It',
          content: (
            <>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Order Entry (EHR)</p>
                  <p className="text-sm text-gray-700">Providers place orders during or after visits. Orders interface to labs/imaging centers.</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Patient Scheduling</p>
                  <p className="text-sm text-gray-700">Staff help patients book imaging appointments, provide lab orders, explain prep instructions</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Results In-Basket</p>
                  <p className="text-sm text-gray-700">Electronic inbox where results land—providers review and sign off</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Tracking Logs</p>
                  <p className="text-sm text-gray-700">Spreadsheets or EHR reports showing pending orders and overdue results</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Patient Portal</p>
                  <p className="text-sm text-gray-700">Patients can view results (sometimes before provider reviews them!)</p>
                </div>
              </div>
            </>
          )
        },
        key: {
          title: 'Key Things to Remember',
          content: (
            <>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">The Tracking Challenge:</p>
                <p className="text-sm mb-3">When patients use multiple facilities (Quest, LabCorp, hospital labs), results scatter across systems. Staff must manually track completion.</p>
                <p className="text-xs text-teal-800">→ Best practice: Dedicated tracking system and weekly audits</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="font-semibold text-gray-800 mb-2">Critical vs. Routine Result Workflows:</p>
                <ul className="text-sm space-y-1">
                  <li><strong>Critical:</strong> Immediate provider notification (phone call), urgent patient contact</li>
                  <li><strong>Routine:</strong> Provider reviews within 2-5 days, patient notified by portal message or letter</li>
                </ul>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Documentation Requirements:</p>
                <p className="text-sm">Every result must show: (1) Provider reviewed, (2) Patient notified, (3) Action taken or "no action needed"</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-semibold text-gray-800 mb-2">⚠ Common Failures:</p>
                <ul className="text-sm space-y-1">
                  <li>• Order placed but patient never completes it (no follow-up)</li>
                  <li>• Results arrive but get lost in overwhelmed inboxes</li>
                  <li>• Abnormal results reviewed but patient never contacted</li>
                  <li>• No system to track tests done at outside facilities</li>
                </ul>
              </div>
            </>
          )
        }
      }
    },
    healthmaint: {
      title: 'Health Maintenance',
      icon: Activity,
      color: 'teal',
      bgColor: 'bg-teal-600',
      sections: {
        what: {
          title: 'What It Is',
          content: (
            <>
              <p className="mb-4">Health maintenance is the structured, evidence-based system of preventive care schedules—tracking what screenings, immunizations, and assessments each patient needs based on age, risk factors, and guidelines.</p>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Core Components:</p>
                <div className="text-sm space-y-2">
                  <div><strong>Cancer Screenings:</strong> Mammograms, colonoscopy, cervical cancer, lung cancer (for smokers)</div>
                  <div><strong>Immunizations:</strong> Flu, pneumonia, shingles, Tdap, COVID boosters</div>
                  <div><strong>Chronic Disease Monitoring:</strong> A1C for diabetes, lipids for heart disease, kidney function</div>
                  <div><strong>Risk Assessments:</strong> Depression screening, fall risk, BMI/obesity counseling</div>
                </div>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Guideline Sources:</p>
                <p className="text-sm">USPSTF (U.S. Preventive Services Task Force), CDC immunization schedules, Specialty society recommendations (ADA for diabetes, ACC/AHA for cardiology)</p>
              </div>
            </>
          )
        },
        why: {
          title: 'Why It Matters',
          content: (
            <>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Prevents disease before it starts</p>
                    <p className="text-sm text-gray-600">Catching colon cancer at stage 0 vs stage 4 makes the difference between cure and palliative care</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Quality metrics and reimbursement</p>
                    <p className="text-sm text-gray-600">Health plans pay bonuses for high screening completion rates. HEDIS, MIPS, and Star ratings all measure this.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Long-term cost savings</p>
                    <p className="text-sm text-gray-600">Prevention is exponentially cheaper than treating advanced disease</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Regulatory requirements</p>
                    <p className="text-sm text-gray-600">Many accreditation bodies require documented preventive care programs</p>
                  </div>
                </li>
              </ul>
            </>
          )
        },
        where: {
          title: 'Where You\'ll See It',
          content: (
            <>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Health Maintenance Section in EHR</p>
                  <p className="text-sm text-gray-700">Dashboard showing due/overdue items with traffic light colors (green/yellow/red)</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Annual Wellness Visits</p>
                  <p className="text-sm text-gray-700">Dedicated appointment type to address all preventive care needs at once</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Population Health Dashboards</p>
                  <p className="text-sm text-gray-700">Reports showing which patients in your panel are overdue for screenings</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Outreach Campaigns</p>
                  <p className="text-sm text-gray-700">Automated letters, calls, or portal messages reminding patients about overdue care</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Pre-Visit Planning</p>
                  <p className="text-sm text-gray-700">Staff review charts before appointments and flag overdue items for providers</p>
                </div>
              </div>
            </>
          )
        },
        key: {
          title: 'Key Things to Remember',
          content: (
            <>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">The Structured vs. Scanned Data Problem:</p>
                <p className="text-sm mb-3">If a colonoscopy is scanned as a PDF, the EHR doesn't "know" it happened. It must be manually entered into structured flowsheets.</p>
                <p className="text-xs text-teal-800">→ This is why colonoscopy reminders keep coming even after completion!</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="font-semibold text-gray-800 mb-2">Risk-Based Intervals:</p>
                <p className="text-sm mb-2">Guidelines change based on risk factors:</p>
                <ul className="text-sm space-y-1">
                  <li>• Average risk: Colonoscopy every 10 years starting at 45</li>
                  <li>• Family history of colon cancer: Start earlier, screen more often</li>
                  <li>• Diabetes: Annual foot exams, quarterly A1C checks</li>
                </ul>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Reconciliation When Patients Transfer:</p>
                <p className="text-sm">New patients bring records from other clinics. Staff must manually update health maintenance to avoid duplicate screenings.</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-semibold text-gray-800 mb-2">⚠ Common Issues:</p>
                <ul className="text-sm space-y-1">
                  <li>• Completed screenings not documented in structured fields</li>
                  <li>• Patient refuses screening but it keeps appearing as "due"</li>
                  <li>• Risk factors not updated, so intervals are wrong</li>
                  <li>• Duplicate reminders overwhelming patients</li>
                </ul>
              </div>
            </>
          )
        }
      }
    },
    referrals: {
      title: 'Referrals & Authorizations',
      icon: Send,
      color: 'teal',
      bgColor: 'bg-teal-600',
      sections: {
        what: {
          title: 'What It Is',
          content: (
            <>
              <p className="mb-4">The process of sending patients to specialists or other healthcare services, securing insurance approval, and ensuring information flows back to complete the "referral loop."</p>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Outbound Referrals:</p>
                <p className="text-sm">Primary care sends patient to cardiologist, orthopedist, surgeon, physical therapy, etc. Provider determines need → Staff places referral → Patient schedules → Specialist sees patient → Consult note returns</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Inbound Referrals:</p>
                <p className="text-sm">Other providers send patients to you for specialized care or second opinions</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Prior Authorizations:</p>
                <p className="text-sm">Insurance approval required BEFORE certain services, procedures, or medications. Not the same as a referral—authorization is about payment approval.</p>
              </div>
            </>
          )
        },
        why: {
          title: 'Why It Matters',
          content: (
            <>
              <p className="mb-4">When referral loops break down:</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Care fragmentation</p>
                    <p className="text-sm text-gray-600">Specialist recommendations never reach the PCP, leading to duplicated or contradictory care</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Prior auth delays worsen conditions</p>
                    <p className="text-sm text-gray-600">Patient waits weeks for surgery approval while pain worsens</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Patients get lost</p>
                    <p className="text-sm text-gray-600">Referral placed but patient never schedules—no one follows up</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Financial burden</p>
                    <p className="text-sm text-gray-600">Services done without authorization = patient gets the bill</p>
                  </div>
                </li>
              </ul>
            </>
          )
        },
        where: {
          title: 'Where You\'ll See It',
          content: (
            <>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Referral Management Systems</p>
                  <p className="text-sm text-gray-700">EHR module or standalone platform tracking referral status from placement to completion</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Authorization Tracking Queues</p>
                  <p className="text-sm text-gray-700">Staff monitor pending, approved, and denied authorizations</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Insurance Portals</p>
                  <p className="text-sm text-gray-700">Websites where staff check auth status and submit appeals</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Consult Note Inboxes</p>
                  <p className="text-sm text-gray-700">Where specialist reports land—must be reviewed and filed by providers</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Patient Communication</p>
                  <p className="text-sm text-gray-700">Staff call patients to confirm they scheduled the specialist appointment</p>
                </div>
              </div>
            </>
          )
        },
        key: {
          title: 'Key Things to Remember',
          content: (
            <>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Referral ≠ Authorization:</p>
                <p className="text-sm mb-2"><strong>Referral:</strong> Clinical recommendation to see a specialist</p>
                <p className="text-sm"><strong>Authorization:</strong> Insurance permission to pay for that visit</p>
                <p className="text-xs text-teal-800 mt-2">→ You can have one without the other, and both are needed!</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="font-semibold text-gray-800 mb-2">Staff Role in Closing the Loop:</p>
                <ul className="text-sm space-y-1">
                  <li>• Track whether patient scheduled the appointment</li>
                  <li>• Chase down missing consult notes (call specialist office)</li>
                  <li>• Follow up on denied authorizations (submit appeals)</li>
                  <li>• Ensure providers review returned consult notes</li>
                </ul>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Urgency Categories:</p>
                <ul className="text-sm space-y-1">
                  <li><strong>Urgent:</strong> Cancer consults, severe pain—expedited auth process</li>
                  <li><strong>Routine:</strong> Follow-up with specialist, non-urgent procedures</li>
                </ul>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-semibold text-gray-800 mb-2">⚠ Common Breakdowns:</p>
                <ul className="text-sm space-y-1">
                  <li>• Referral sent but patient never calls specialist</li>
                  <li>• Authorization approved but expires before patient schedules</li>
                  <li>• Consult note returns but never gets reviewed</li>
                  <li>• Denial letter arrives but no one appeals</li>
                </ul>
              </div>
            </>
          )
        }
      }
    },
    medications: {
      title: 'Medications & Refills',
      icon: Pill,
      color: 'teal',
      bgColor: 'bg-teal-600',
      sections: {
        what: {
          title: 'What It Is',
          content: (
            <>
              <p className="mb-4">The full lifecycle of medication management—from prescribing to dispensing to adherence monitoring to refill management. It's far more complex than just writing a prescription.</p>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">The Medication Cycle:</p>
                <div className="text-sm space-y-2">
                  <div className="flex items-center">
                    <span className="font-bold mr-2">1.</span>
                    <span>Provider prescribes via ePrescribe system</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold mr-2">2.</span>
                    <span>Prescription sent electronically to pharmacy</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold mr-2">3.</span>
                    <span>Pharmacy checks insurance, fills prescription</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold mr-2">4.</span>
                    <span>Patient picks up medication (or doesn't)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold mr-2">5.</span>
                    <span>Patient requests refill (pharmacy or portal)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold mr-2">6.</span>
                    <span>Staff/provider reviews and approves refill</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold mr-2">7.</span>
                    <span>Cycle repeats, sometimes with prior auth needed</span>
                  </div>
                </div>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Special Categories:</p>
                <p className="text-sm">Controlled substances (opioids, stimulants—extra regulations), Specialty medications (expensive, require special handling), In-office medications (samples, vaccines administered on-site)</p>
              </div>
            </>
          )
        },
        why: {
          title: 'Why It Matters',
          content: (
            <>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Medication non-adherence causes preventable harm</p>
                    <p className="text-sm text-gray-600">Not taking blood pressure meds → stroke. Skipping insulin → diabetic emergency.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Prior authorization delays create dangerous gaps</p>
                    <p className="text-sm text-gray-600">Insurance denies medication, appeal takes 2 weeks—patient goes without critical drug</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Refill chaos overwhelms clinics</p>
                    <p className="text-sm text-gray-600">Hundreds of refill requests daily flood staff inboxes, causing delays and errors</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Controlled substance regulations are strict</p>
                    <p className="text-sm text-gray-600">DEA violations can shut down a practice</p>
                  </div>
                </li>
              </ul>
            </>
          )
        },
        where: {
          title: 'Where You\'ll See It',
          content: (
            <>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">ePrescribe Systems</p>
                  <p className="text-sm text-gray-700">Electronic prescribing platform (often integrated in EHR) with drug interaction checks</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Refill Request Queues</p>
                  <p className="text-sm text-gray-700">Inbox where pharmacy refill requests land—staff triage and route to providers</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Prior Authorization Workflows</p>
                  <p className="text-sm text-gray-700">Forms, phone calls, and insurance portals to get expensive meds approved</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Medication Reconciliation</p>
                  <p className="text-sm text-gray-700">Every visit: staff update the medication list (what patient is actually taking)</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">In-Office Dispensing</p>
                  <p className="text-sm text-gray-700">Clinics with on-site pharmacies or sample closets</p>
                </div>
              </div>
            </>
          )
        },
        key: {
          title: 'Key Things to Remember',
          content: (
            <>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Controlled Substance Regulations:</p>
                <ul className="text-sm space-y-1">
                  <li>• Schedule II (Adderall, oxycodone): No refills, must be new prescription each time</li>
                  <li>• DEA numbers required for prescribing</li>
                  <li>• State prescription monitoring programs (PDMP) must be checked</li>
                  <li>• Strict storage and inventory requirements for in-office stock</li>
                </ul>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="font-semibold text-gray-800 mb-2">The "90-Day Supply" vs "30-Day Supply" Rule:</p>
                <p className="text-sm">Insurance formularies often require mail-order 90-day supplies for maintenance meds. Patients get confused when pharmacy says "not covered" for 30-day fill.</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Staff Refill Workflows:</p>
                <p className="text-sm mb-2">Many clinics have dedicated "refill teams" to manage volume:</p>
                <ul className="text-sm space-y-1">
                  <li>• RNs/MAs review requests, approve simple refills within protocols</li>
                  <li>• Flag requests requiring provider review (controlled substances, overdue appointments)</li>
                  <li>• Document all refill actions</li>
                </ul>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-semibold text-gray-800 mb-2">⚠ Common Issues:</p>
                <ul className="text-sm space-y-1">
                  <li>• Medication list in EHR doesn't match what patient actually takes</li>
                  <li>• Prior auth expires and patient runs out before new approval</li>
                  <li>• Generic substitution confusion ("This isn't my medication!")</li>
                  <li>• Patients request refills for medications they're supposed to have stopped</li>
                </ul>
              </div>
            </>
          )
        }
      }
    },
    messaging: {
      title: 'Messaging & Coordination',
      icon: MessageSquare,
      color: 'teal',
      bgColor: 'bg-teal-600',
      sections: {
        what: {
          title: 'What It Is',
          content: (
            <>
              <p className="mb-4">All the communication that happens between scheduled appointments—the invisible work of care coordination that keeps patients connected and care flowing.</p>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Types of Messages:</p>
                <div className="text-sm space-y-2">
                  <div><strong>Patient Portal Messages:</strong> "Can I take ibuprofen with my blood pressure med?" "My test results say abnormal—what does that mean?"</div>
                  <div><strong>Phone Calls:</strong> Symptom triage, appointment questions, insurance issues, medication concerns</div>
                  <div><strong>Internal Messages:</strong> Staff-to-provider questions, team huddle communications, handoff notes</div>
                  <div><strong>External Communications:</strong> Faxes from specialists, pharmacy calls, insurance company requests</div>
                </div>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">The Provider Inbox Problem:</p>
                <p className="text-sm">Providers receive 50-300+ messages daily in their EHR inbox—lab results, refill requests, portal messages, referral updates, insurance forms. It's a digital dumping ground.</p>
              </div>
            </>
          )
        },
        why: {
          title: 'Why It Matters',
          content: (
            <>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Inbox overload causes burnout</p>
                    <p className="text-sm text-gray-600">Providers spend 2-3 hours after clinic clearing inboxes. It's a leading cause of physician burnout.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Poor triage means urgent issues get buried</p>
                    <p className="text-sm text-gray-600">"Chest pain for 3 days" message sits in queue behind 50 refill requests</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">Messages fall through the cracks</p>
                    <p className="text-sm text-gray-600">No system for tracking follow-up means patients get forgotten</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-700 mr-2">•</span>
                  <div>
                    <p className="font-semibold">This work is often uncompensated</p>
                    <p className="text-sm text-gray-600">Insurance doesn't pay for portal messages or phone advice</p>
                  </div>
                </li>
              </ul>
            </>
          )
        },
        where: {
          title: 'Where You\'ll See It',
          content: (
            <>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Patient Portal Messaging Systems</p>
                  <p className="text-sm text-gray-700">Secure messaging platform where patients send questions—lands in provider/staff inbox</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Phone Triage Protocols</p>
                  <p className="text-sm text-gray-700">Scripted decision trees for nurses/MAs to assess symptom urgency</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Provider EHR Inboxes</p>
                  <p className="text-sm text-gray-700">Central message hub—results, requests, reports, everything lands here</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Team Huddle Boards</p>
                  <p className="text-sm text-gray-700">Daily stand-up meetings to coordinate care and flag urgent issues</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Care Coordination Platforms</p>
                  <p className="text-sm text-gray-700">Tools for tracking complex patients across multiple touchpoints</p>
                </div>
              </div>
            </>
          )
        },
        key: {
          title: 'Key Things to Remember',
          content: (
            <>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Triage Categories:</p>
                <ul className="text-sm space-y-1">
                  <li><strong>Emergency:</strong> Chest pain, difficulty breathing → call 911 or send to ED</li>
                  <li><strong>Urgent:</strong> Fever with infection symptoms → same-day appointment</li>
                  <li><strong>Routine:</strong> Medication question, minor symptoms → 24-48 hour response</li>
                  <li><strong>Administrative:</strong> Appointment changes, forms → staff handles without provider</li>
                </ul>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="font-semibold text-gray-800 mb-2">Staff Scope of Practice:</p>
                <p className="text-sm mb-2">What can staff answer vs. what requires provider review?</p>
                <ul className="text-sm space-y-1">
                  <li>• MAs/RNs can: Schedule appointments, explain general processes, forward messages</li>
                  <li>• MAs/RNs cannot: Provide medical advice, interpret results, prescribe treatments</li>
                  <li>• Gray areas require clear clinic protocols</li>
                </ul>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Response Time Expectations:</p>
                <p className="text-sm">Many states/regulations require responses within 24-48 hours. Clinics must have coverage plans for nights/weekends.</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="font-semibold text-gray-800 mb-2">The "Inbox Zero" Myth:</p>
                <p className="text-sm">It's impossible with current message volumes. Better goal: Effective delegation, team-based care, and realistic workflows that distribute the work.</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">⚠ Common Failures:</p>
                <ul className="text-sm space-y-1">
                  <li>• No triage system—everything goes straight to provider</li>
                  <li>• Urgent messages buried in routine messages</li>
                  <li>• No tracking system for follow-up needed</li>
                  <li>• Staff unsure what they can/cannot answer</li>
                  <li>• Patients frustrated by slow response times</li>
                </ul>
              </div>
            </>
          )
        }
      }
    }
  };

  const TopicCard: React.FC<{ topicKey: string; topic: Topic }> = ({ topicKey, topic }) => {
    const Icon = topic.icon;
    const colorConfig = {
      teal: {
        iconBg: 'bg-gradient-to-br from-teal-500 to-cyan-600 shadow-md',
        iconBgHover: 'group-hover:from-teal-600 group-hover:to-cyan-700',
        iconColor: 'text-white',
        border: 'hover:border-teal-200',
        titleHover: 'group-hover:text-teal-600',
      },
    };

    const colors = colorConfig[topic.color as keyof typeof colorConfig];

    return (
      <button
        onClick={() => {
          setCurrentTopic(topicKey);
          setActiveSection('what');
        }}
        className={`bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all text-left w-full group border-2 border-transparent ${colors.border}`}
      >
        <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center mb-3 transition-colors ${colors.iconBgHover}`}>
          <Icon className={`w-6 h-6 ${colors.iconColor}`} />
        </div>
        <h3 className={`text-xl font-bold text-gray-800 mb-2 transition-colors ${colors.titleHover}`}>{topic.title}</h3>
        <p className="text-sm text-gray-600">Learn the essentials</p>
      </button>
    );
  };

  const HomePage: React.FC = () => (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Clinic Basics</h1>
        <p className="text-lg text-gray-600">Essential knowledge for ambulatory clinic careers</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">HIPAA & PHI</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <TopicCard topicKey="hipaa" topic={topics.hipaa} />
          <TopicCard topicKey="phi" topic={topics.phi} />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Medical Coding</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TopicCard topicKey="why" topic={topics.why} />
          <TopicCard topicKey="icd10" topic={topics.icd10} />
          <TopicCard topicKey="cpt" topic={topics.cpt} />
          <TopicCard topicKey="snomed" topic={topics.snomed} />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Clinical Workflows</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TopicCard topicKey="orders" topic={topics.orders} />
          <TopicCard topicKey="healthmaint" topic={topics.healthmaint} />
          <TopicCard topicKey="referrals" topic={topics.referrals} />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Patient Care Management</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TopicCard topicKey="records" topic={topics.records} />
          <TopicCard topicKey="screenings" topic={topics.screenings} />
          <TopicCard topicKey="medications" topic={topics.medications} />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Communication & Coordination</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <TopicCard topicKey="messaging" topic={topics.messaging} />
        </div>
      </div>
    </div>
  );

  const TopicView: React.FC<{ topicKey: string }> = ({ topicKey }) => {
    const topic = topics[topicKey];
    const Icon = topic.icon;

    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentTopic('home')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Topics
        </button>

        <div className={`${topic.bgColor} text-white p-6 rounded-lg mb-6 shadow-md`}>
          <div className="flex items-center">
            <Icon className="w-10 h-10 mr-4" />
            <h1 className="text-3xl font-bold">{topic.title}</h1>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {Object.keys(topic.sections).map((sectionKey) => (
            <button
              key={sectionKey}
              onClick={() => setActiveSection(sectionKey)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeSection === sectionKey
                  ? `${topic.bgColor} text-white shadow-md`
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {topic.sections[sectionKey].title}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {topic.sections[activeSection].title}
          </h2>
          <div className="text-gray-700 leading-relaxed">
            {topic.sections[activeSection].content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {currentTopic === 'home' ? (
        <HomePage />
      ) : (
        <TopicView topicKey={currentTopic} />
      )}
    </>
  );
};

export default Academy;
