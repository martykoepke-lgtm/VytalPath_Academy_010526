import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'course';
  image?: string;
}

const BASE_URL = 'https://www.vytalpath.com';
const DEFAULT_IMAGE = `${BASE_URL}/vp-checkmark.png`;

export function SEO({
  title,
  description = 'Online learning platform for healthcare front office topics. Explore HIPAA compliance, medical terminology, insurance verification, and clinical workflows.',
  keywords = 'healthcare learning, front office learning, medical receptionist education, HIPAA training, medical terminology',
  canonical,
  type = 'website',
  image = DEFAULT_IMAGE,
}: SEOProps) {
  const fullTitle = title
    ? `${title} | VytalPath Academy`
    : 'VytalPath Academy | Healthcare Front Office Learning';

  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="VytalPath Academy" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}

// Pre-defined SEO configs for each section
export const seoConfigs = {
  foundations: {
    title: 'Foundations of Healthcare',
    description: 'Learn healthcare administration fundamentals. Understand different healthcare settings, acute vs ambulatory care, and your role in front office operations.',
    keywords: 'healthcare foundations, healthcare settings, ambulatory care, acute care, front office learning, healthcare administration',
    canonical: '/foundations',
  },
  medicalLawEthics: {
    title: 'Medical Law & Ethics',
    description: 'Learn HIPAA compliance, patient rights, authorization requirements, and healthcare fraud prevention. Essential legal and ethical knowledge for healthcare professionals.',
    keywords: 'HIPAA training, medical law, healthcare ethics, patient rights, PHI, healthcare compliance, EMTALA, Stark Law, healthcare fraud',
    canonical: '/medical-law-ethics',
  },
  insurance: {
    title: 'Health Insurance for Front Office',
    description: 'Learn health insurance operations. Understand eligibility verification, copays, deductibles, coinsurance, payment collection, and insurance card reading.',
    keywords: 'health insurance learning, eligibility verification, copay collection, deductible, coinsurance, insurance verification, front office insurance',
    canonical: '/insurance',
  },
  terminology: {
    title: 'Medical Terminology Study Guide',
    description: 'Learn medical terminology with prefixes, roots, suffixes, and abbreviations. Interactive flashcards and study mode for healthcare professionals.',
    keywords: 'medical terminology, medical prefixes, medical suffixes, root words, medical abbreviations, healthcare vocabulary, anatomy terms',
    canonical: '/terminology',
  },
  ehrFundamentals: {
    title: 'EHR & Practice Management',
    description: 'Learn how Practice Management and EHR systems work together. Understand encounter types, scheduling methods, phone encounters, and duplicate record prevention.',
    keywords: 'EHR learning, practice management, encounter types, patient scheduling, MRN, FIN, phone encounters, duplicate records, healthcare systems',
    canonical: '/ehr-fundamentals',
  },
  workflows: {
    title: 'Healthcare Front Office Workflows & SOPs',
    description: 'Learn front office workflows. Understand patient registration, scheduling, check-in, check-out, and appointment management procedures.',
    keywords: 'front office workflows, patient registration, appointment scheduling, check-in procedures, healthcare SOPs, clinic workflows',
    canonical: '/workflows',
  },
  curriculum: {
    title: 'Healthcare Front Office Curriculum',
    description: 'Full healthcare front office curriculum: HIPAA, insurance verification, medical terminology, EHR systems, and 24 SOP guides. 80+ lessons across 9 sections.',
    keywords: 'healthcare curriculum, front office learning, medical receptionist education, HIPAA learning online, insurance verification, medical terminology course',
    canonical: '/curriculum',
  },
  pricing: {
    title: 'Pricing - Healthcare Learning Plans',
    description: 'Healthcare front office learning for $327/year. Team discounts up to 63% off. Full access from day one with a 3-day money-back guarantee.',
    keywords: 'healthcare learning cost, medical receptionist education price, front office learning pricing, healthcare education pricing',
    canonical: '/pricing',
  },
  aiGuide: {
    title: 'AI Study Assistant Guide',
    description: 'Five AI learning modes built into VytalPath Academy: Tutor, EHR Coach, Practice, Patient Simulation, and SOP Scenarios. Available on every page.',
    keywords: 'AI tutor, study assistant, healthcare AI, EHR coaching, adaptive practice, patient simulation, SOP scenarios',
    canonical: '/ai-guide',
  },
  skillsGuide: {
    title: '10 Skills for Healthcare Front Office Pros',
    description: 'The 10 skills every healthcare front office professional needs: HIPAA, insurance verification, EHR navigation, medical terminology, and more. Free guide.',
    keywords: 'healthcare front office skills, medical receptionist skills, healthcare administrative skills, front desk skills medical office, HIPAA training, insurance verification, EHR training, patient registration skills',
    canonical: '/skills',
  },
};
