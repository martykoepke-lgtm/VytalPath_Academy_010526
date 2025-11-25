import { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Lightbulb, CheckCircle, Sprout, ArrowLeft, ArrowRight, Compass, BedDouble, Scissors } from 'lucide-react';

interface Example {
  term: string;
  meaning: string;
  words: string[];
}

interface CategoryInfo {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  whyImportant: string;
  examples: Example[];
  tip: string;
}

export function LearnMoreSection() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedExample, setExpandedExample] = useState<Record<string, boolean>>({});

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'roots': <Sprout className="w-8 h-8 text-teal-600" />,
      'prefixes': <ArrowLeft className="w-8 h-8 text-teal-600" />,
      'suffixes': <ArrowRight className="w-8 h-8 text-teal-600" />,
      'directions': <Compass className="w-8 h-8 text-teal-600" />,
      'positions': <BedDouble className="w-8 h-8 text-teal-600" />,
      'planes': <Scissors className="w-8 h-8 text-teal-600" />,
    };
    return iconMap[iconName] || <BookOpen className="w-8 h-8 text-teal-600" />;
  };

  const categories: CategoryInfo[] = [
    {
      id: 'roots',
      title: 'Medical Roots',
      subtitle: 'The building blocks of medical language',
      icon: 'roots',
      description: 'Medical roots are the core word parts that carry the fundamental meaning. Think of them as the foundation of a house - everything else builds on top of them.',
      whyImportant: 'Once you know common roots, you can decode hundreds of medical terms! For example, knowing "cardi" means heart helps you understand cardiology, cardiac, and cardiomegaly.',
      examples: [
        {
          term: 'cardi/o',
          meaning: 'heart',
          words: ['cardiology (study of the heart)', 'cardiac (relating to the heart)', 'cardiogram (heart recording)']
        },
        {
          term: 'derm/o',
          meaning: 'skin',
          words: ['dermatology (study of skin)', 'dermatitis (skin inflammation)', 'hypodermic (under the skin)']
        },
        {
          term: 'gastr/o',
          meaning: 'stomach',
          words: ['gastritis (stomach inflammation)', 'gastroenterology (study of stomach and intestines)']
        }
      ],
      tip: 'Start by memorizing 5-10 common roots. You\'ll be amazed how many medical terms suddenly make sense!'
    },
    {
      id: 'prefixes',
      title: 'Prefixes',
      subtitle: 'Word beginnings that modify meaning',
      icon: 'prefixes',
      description: 'Prefixes attach to the beginning of medical terms to modify their meaning. They often indicate position, time, amount, or negation.',
      whyImportant: 'Prefixes completely change the meaning of a word. "Normal" blood pressure vs "hypertension" (high blood pressure) - the prefix "hyper-" makes all the difference!',
      examples: [
        {
          term: 'hyper-',
          meaning: 'above, excessive',
          words: ['hypertension (high blood pressure)', 'hyperactive (overly active)', 'hyperthyroidism (overactive thyroid)']
        },
        {
          term: 'hypo-',
          meaning: 'below, deficient',
          words: ['hypotension (low blood pressure)', 'hypothermia (low body temperature)', 'hypoglycemia (low blood sugar)']
        },
        {
          term: 'pre-',
          meaning: 'before',
          words: ['prenatal (before birth)', 'preoperative (before surgery)', 'prediabetes (before diabetes)']
        }
      ],
      tip: 'Notice how "hyper-" and "hypo-" are opposites? Learning word parts in pairs helps you remember them better!'
    },
    {
      id: 'suffixes',
      title: 'Suffixes',
      subtitle: 'Word endings that modify meaning',
      icon: 'suffixes',
      description: 'Suffixes attach to the end of medical terms and often indicate a procedure, condition, disease, or specialty. They\'re like the finishing touch that completes the word\'s meaning.',
      whyImportant: 'Suffixes tell you WHAT is happening. Is it inflammation (-itis)? A surgical removal (-ectomy)? A study of something (-ology)? The suffix reveals the action or state.',
      examples: [
        {
          term: '-itis',
          meaning: 'inflammation',
          words: ['appendicitis (appendix inflammation)', 'arthritis (joint inflammation)', 'bronchitis (bronchial tube inflammation)']
        },
        {
          term: '-ectomy',
          meaning: 'surgical removal',
          words: ['appendectomy (appendix removal)', 'tonsillectomy (tonsil removal)', 'mastectomy (breast removal)']
        },
        {
          term: '-ology',
          meaning: 'study of',
          words: ['cardiology (study of heart)', 'neurology (study of nerves)', 'pathology (study of disease)']
        }
      ],
      tip: 'If you see "-itis" at the end of a word, you immediately know it\'s about inflammation. This pattern recognition is key!'
    },
    {
      id: 'directions',
      title: 'Anatomical Directions',
      subtitle: 'Terms describing body position and location',
      icon: 'directions',
      description: 'Anatomical directions provide a standardized way to describe where things are located in the body. These terms ensure medical professionals worldwide can communicate precisely.',
      whyImportant: 'In healthcare, precision saves lives. "The wound is on the upper left side" is vague. "The wound is superior and lateral to the umbilicus" is exact and universal.',
      examples: [
        {
          term: 'anterior/posterior',
          meaning: 'front/back',
          words: ['anterior chest (front of chest)', 'posterior skull (back of head)']
        },
        {
          term: 'superior/inferior',
          meaning: 'above/below',
          words: ['superior vena cava (upper major vein)', 'inferior limb (lower limb)']
        },
        {
          term: 'medial/lateral',
          meaning: 'toward midline/away from midline',
          words: ['medial knee pain (inner knee)', 'lateral ankle (outer ankle)']
        }
      ],
      tip: 'Always imagine the body in "anatomical position" - standing upright, arms at sides, palms forward. All directions are based on this stance!'
    },
    {
      id: 'positions',
      title: 'Body Positions',
      subtitle: 'Patient positioning terminology',
      icon: 'positions',
      description: 'Body positions describe how a patient is positioned during examination, treatment, or surgery. Each position serves specific medical purposes.',
      whyImportant: 'Different procedures require different positions. The wrong position could make an examination ineffective or even harm the patient. These terms ensure safe, effective care.',
      examples: [
        {
          term: 'supine',
          meaning: 'lying on back, face up',
          words: ['Used for: abdominal exams, most surgeries, CPR']
        },
        {
          term: 'prone',
          meaning: 'lying on stomach, face down',
          words: ['Used for: back exams, certain spine surgeries, pressure ulcer prevention']
        },
        {
          term: 'Fowler\'s',
          meaning: 'sitting upright at 45-90 degrees',
          words: ['Used for: breathing difficulties, eating, preventing aspiration']
        }
      ],
      tip: 'Memory trick: "Supine" has "up" in it (face UP). "Prone" sounds like "prawn" (shrimp are face down!).'
    },
    {
      id: 'planes',
      title: 'Anatomical Planes',
      subtitle: 'Imaginary lines dividing the body',
      icon: 'planes',
      description: 'Anatomical planes are imaginary flat surfaces that divide the body into sections. They help describe the location of structures and the direction of movements.',
      whyImportant: 'Medical imaging (CT, MRI) uses these planes. When a radiologist says "sagittal view," they mean they\'re looking at the body as if sliced from front to back.',
      examples: [
        {
          term: 'sagittal plane',
          meaning: 'divides body into left and right',
          words: ['Midsagittal = exactly down the middle', 'Shows profile view', 'Side-to-side movements']
        },
        {
          term: 'frontal (coronal) plane',
          meaning: 'divides body into front and back',
          words: ['Shows front or back view', 'Forward and backward movements', 'Like a crown (coronal) on your head']
        },
        {
          term: 'transverse (horizontal) plane',
          meaning: 'divides body into top and bottom',
          words: ['Shows cross-section view', 'Like slicing a loaf of bread', 'Most CT scans use this view']
        }
      ],
      tip: 'Think of planes as cutting through a 3D object. Each plane gives you a different view of the same body!'
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleExample = (categoryId: string, exampleIndex: number) => {
    const key = `${categoryId}-${exampleIndex}`;
    setExpandedExample(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Learn More About Medical Terminology</h2>
        <p className="text-gray-600">Master the language of healthcare, one word part at a time</p>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="p-3 bg-teal-50 rounded-lg">
                  {getIcon(category.icon)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{category.title}</h3>
                  <p className="text-gray-600">{category.subtitle}</p>
                </div>
              </div>
              {expandedCategory === category.id ? (
                <ChevronDown className="w-6 h-6 text-gray-400 ml-4" />
              ) : (
                <ChevronRight className="w-6 h-6 text-gray-400 ml-4" />
              )}
            </button>

            {expandedCategory === category.id && (
              <div className="px-6 pb-6 space-y-6 border-t border-gray-200 bg-gray-50">
                <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded mt-6">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">What are {category.title}?</h4>
                      <p className="text-gray-700">{category.description}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Why This Matters</h4>
                      <p className="text-gray-700">{category.whyImportant}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Examples to Learn</h4>
                  <div className="space-y-3">
                    {category.examples.map((example, idx) => (
                      <div key={idx} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <button
                          onClick={() => toggleExample(category.id, idx)}
                          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-teal-600" />
                            <span className="font-mono font-bold text-teal-700">{example.term}</span>
                            <span className="text-gray-600">= {example.meaning}</span>
                          </div>
                          {expandedExample[`${category.id}-${idx}`] ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        {expandedExample[`${category.id}-${idx}`] && (
                          <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-200">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Used in:</p>
                            <ul className="space-y-1">
                              {example.words.map((word, wordIdx) => (
                                <li key={wordIdx} className="text-gray-700 pl-4 border-l-2 border-teal-200">
                                  {word}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Pro Tip</h4>
                      <p className="text-gray-700">{category.tip}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Study Strategy</h3>
        <div className="space-y-2 text-gray-700">
          <p className="flex items-start gap-2">
            <span className="text-teal-600 font-bold mt-0.5">→</span>
            <span><strong>Start with roots</strong> - they're the foundation</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-teal-600 font-bold mt-0.5">→</span>
            <span><strong>Add prefixes and suffixes</strong> - learn how they modify roots</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-teal-600 font-bold mt-0.5">→</span>
            <span><strong>Practice combining</strong> - build complex terms from parts you know</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-teal-600 font-bold mt-0.5">→</span>
            <span><strong>Use flashcards</strong> - repetition builds retention</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-teal-600 font-bold mt-0.5">→</span>
            <span><strong>Learn in context</strong> - connect terms to real medical scenarios</span>
          </p>
        </div>
      </div>
    </div>
  );
}
