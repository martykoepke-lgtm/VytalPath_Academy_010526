import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TermComponent {
  part: string;
  type: 'prefix' | 'root' | 'suffix';
  meaning: string;
}

interface AnalysisResult {
  term: string;
  components: TermComponent[];
  fullDefinition: string;
  example?: string;
}

const medicalTermDatabase: Record<string, AnalysisResult> = {
  'cardiomegaly': {
    term: 'Cardiomegaly',
    components: [
      { part: 'cardio', type: 'root', meaning: 'heart' },
      { part: 'megaly', type: 'suffix', meaning: 'enlargement' }
    ],
    fullDefinition: 'An abnormal enlargement of the heart. This condition can be caused by various factors including high blood pressure, heart valve disease, or cardiomyopathy.',
    example: 'The chest X-ray revealed cardiomegaly, indicating the patient\'s heart was larger than normal.'
  },
  'gastroenteritis': {
    term: 'Gastroenteritis',
    components: [
      { part: 'gastro', type: 'root', meaning: 'stomach' },
      { part: 'enter', type: 'root', meaning: 'intestine' },
      { part: 'itis', type: 'suffix', meaning: 'inflammation' }
    ],
    fullDefinition: 'Inflammation of the stomach and intestines, typically resulting from bacterial toxins or viral infection and causing vomiting and diarrhea.',
    example: 'The patient was diagnosed with gastroenteritis after experiencing severe stomach cramps and diarrhea.'
  },
  'neuropathy': {
    term: 'Neuropathy',
    components: [
      { part: 'neuro', type: 'root', meaning: 'nerve' },
      { part: 'pathy', type: 'suffix', meaning: 'disease or disorder' }
    ],
    fullDefinition: 'A disease or dysfunction of one or more peripheral nerves, typically causing numbness, tingling, or weakness. Often associated with diabetes or chemotherapy.',
    example: 'Diabetic neuropathy caused tingling and numbness in the patient\'s feet and hands.'
  },
  'dermatology': {
    term: 'Dermatology',
    components: [
      { part: 'dermato', type: 'root', meaning: 'skin' },
      { part: 'logy', type: 'suffix', meaning: 'study of' }
    ],
    fullDefinition: 'The branch of medicine concerned with the diagnosis and treatment of skin disorders and diseases.',
    example: 'She visited the dermatology department to have a suspicious mole examined.'
  },
  'hepatitis': {
    term: 'Hepatitis',
    components: [
      { part: 'hepat', type: 'root', meaning: 'liver' },
      { part: 'itis', type: 'suffix', meaning: 'inflammation' }
    ],
    fullDefinition: 'Inflammation of the liver, typically caused by a viral infection (Hepatitis A, B, C) but can also result from toxins, medications, or autoimmune disease.',
    example: 'The patient was diagnosed with Hepatitis B after blood tests showed elevated liver enzymes.'
  },
  'cardiomyopathy': {
    term: 'Cardiomyopathy',
    components: [
      { part: 'cardio', type: 'root', meaning: 'heart' },
      { part: 'myo', type: 'root', meaning: 'muscle' },
      { part: 'pathy', type: 'suffix', meaning: 'disease' }
    ],
    fullDefinition: 'A disease of the heart muscle that makes it harder for the heart to pump blood to the rest of the body. Can lead to heart failure.',
    example: 'The echocardiogram revealed cardiomyopathy, showing the heart muscle was weakened and enlarged.'
  },
  'arthritis': {
    term: 'Arthritis',
    components: [
      { part: 'arthr', type: 'root', meaning: 'joint' },
      { part: 'itis', type: 'suffix', meaning: 'inflammation' }
    ],
    fullDefinition: 'Inflammation of one or more joints, causing pain, swelling, stiffness, and decreased range of motion. Common types include osteoarthritis and rheumatoid arthritis.',
    example: 'Arthritis in her knees made it difficult for her to climb stairs.'
  },
  'pneumonia': {
    term: 'Pneumonia',
    components: [
      { part: 'pneumon', type: 'root', meaning: 'lung' },
      { part: 'ia', type: 'suffix', meaning: 'condition' }
    ],
    fullDefinition: 'An infection that inflames the air sacs in one or both lungs, which may fill with fluid or pus, causing cough with phlegm, fever, chills, and difficulty breathing.',
    example: 'The chest X-ray confirmed pneumonia in the lower lobe of the right lung.'
  },
  'hypertension': {
    term: 'Hypertension',
    components: [
      { part: 'hyper', type: 'prefix', meaning: 'excessive, above normal' },
      { part: 'tens', type: 'root', meaning: 'pressure' },
      { part: 'ion', type: 'suffix', meaning: 'condition' }
    ],
    fullDefinition: 'Abnormally high blood pressure, especially in the arteries. A chronic condition that increases the risk of heart disease, stroke, and kidney problems.',
    example: 'The patient\'s hypertension was controlled with medication and lifestyle changes.'
  },
  'hypoglycemia': {
    term: 'Hypoglycemia',
    components: [
      { part: 'hypo', type: 'prefix', meaning: 'below normal, deficient' },
      { part: 'glyc', type: 'root', meaning: 'sugar, glucose' },
      { part: 'emia', type: 'suffix', meaning: 'blood condition' }
    ],
    fullDefinition: 'An abnormally low level of glucose (sugar) in the blood, often causing symptoms like shakiness, sweating, confusion, and rapid heartbeat. Common in diabetics.',
    example: 'The diabetic patient experienced hypoglycemia after taking too much insulin.'
  },
  'tachycardia': {
    term: 'Tachycardia',
    components: [
      { part: 'tachy', type: 'prefix', meaning: 'fast, rapid' },
      { part: 'cardia', type: 'root', meaning: 'heart' }
    ],
    fullDefinition: 'An abnormally rapid heart rate, typically defined as over 100 beats per minute at rest. Can be caused by exercise, stress, fever, or heart conditions.',
    example: 'The ECG showed tachycardia with a heart rate of 120 beats per minute.'
  },
  'bradycardia': {
    term: 'Bradycardia',
    components: [
      { part: 'brady', type: 'prefix', meaning: 'slow' },
      { part: 'cardia', type: 'root', meaning: 'heart' }
    ],
    fullDefinition: 'An abnormally slow heart rate, typically defined as fewer than 60 beats per minute. Can be normal in athletes or indicate an underlying heart condition.',
    example: 'The patient\'s bradycardia required a pacemaker to maintain adequate heart rate.'
  },
  'nephrology': {
    term: 'Nephrology',
    components: [
      { part: 'nephro', type: 'root', meaning: 'kidney' },
      { part: 'logy', type: 'suffix', meaning: 'study of' }
    ],
    fullDefinition: 'The branch of medicine concerned with the study, diagnosis, and treatment of kidney diseases and disorders.',
    example: 'The patient was referred to nephrology for management of chronic kidney disease.'
  },
  'osteoporosis': {
    term: 'Osteoporosis',
    components: [
      { part: 'osteo', type: 'root', meaning: 'bone' },
      { part: 'por', type: 'root', meaning: 'pore, passage' },
      { part: 'osis', type: 'suffix', meaning: 'abnormal condition' }
    ],
    fullDefinition: 'A medical condition in which bones become brittle and fragile from loss of tissue, typically as a result of hormonal changes or deficiency of calcium or vitamin D.',
    example: 'The bone density scan revealed osteoporosis, increasing the patient\'s fracture risk.'
  },
  'endoscopy': {
    term: 'Endoscopy',
    components: [
      { part: 'endo', type: 'prefix', meaning: 'within, inside' },
      { part: 'scopy', type: 'suffix', meaning: 'visual examination' }
    ],
    fullDefinition: 'A medical procedure using an endoscope (a flexible tube with a camera) to examine the interior of a hollow organ or cavity of the body.',
    example: 'An upper endoscopy was performed to investigate the patient\'s stomach pain.'
  }
};

function analyzeMedicalTerm(term: string): AnalysisResult | null {
  const normalizedTerm = term.toLowerCase().trim();
  return medicalTermDatabase[normalizedTerm] || null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { term } = await req.json();

    if (!term || typeof term !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid term provided' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const analysis = analyzeMedicalTerm(term);

    if (!analysis) {
      return new Response(
        JSON.stringify({
          error: 'Term not found',
          message: `The term "${term}" is not in our database yet. Please try another term.`,
          suggestions: Object.keys(medicalTermDatabase).slice(0, 5)
        }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify(analysis),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});