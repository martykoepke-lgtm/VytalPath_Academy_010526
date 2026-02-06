import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'course';
  image?: string;
}

const BASE_URL = 'https://academy.vytalpath.com';
const DEFAULT_IMAGE = `${BASE_URL}/vp-checkmark.png`;

export function SEO({
  title,
  description = 'Free online training for healthcare front office staff. Learn HIPAA compliance, medical terminology, insurance verification, and clinical workflows.',
  keywords = 'healthcare training, front office training, medical receptionist training, HIPAA training, medical terminology',
  canonical,
  type = 'website',
  image = DEFAULT_IMAGE,
}: SEOProps) {
  const fullTitle = title
    ? `${title} | VytalPath Academy`
    : 'VytalPath Academy | Healthcare Front Office Training';

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

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}

// Pre-defined SEO configs for each section
export const seoConfigs = {
  foundations: {
    title: 'Foundations of Healthcare Training',
    description: 'Learn healthcare administration fundamentals. Understand different healthcare settings, acute vs ambulatory care, and your essential role in front office operations.',
    keywords: 'healthcare foundations, healthcare settings, ambulatory care, acute care, front office training, healthcare administration',
    canonical: '/foundations',
  },
  medicalLawEthics: {
    title: 'Medical Law & Ethics Training',
    description: 'Master HIPAA compliance, patient rights, authorization requirements, and healthcare fraud prevention. Essential legal and ethical training for healthcare professionals.',
    keywords: 'HIPAA training, medical law, healthcare ethics, patient rights, PHI, healthcare compliance, EMTALA, Stark Law, healthcare fraud',
    canonical: '/medical-law-ethics',
  },
  insurance: {
    title: 'Health Insurance Training for Front Office',
    description: 'Master health insurance operations. Learn eligibility verification, copays, deductibles, coinsurance, payment collection, and insurance card reading. Free training.',
    keywords: 'health insurance training, eligibility verification, copay collection, deductible, coinsurance, insurance verification, front office insurance',
    canonical: '/insurance',
  },
  terminology: {
    title: 'Medical Terminology Training & Study Guide',
    description: 'Learn medical terminology with prefixes, roots, suffixes, and abbreviations. Interactive flashcards and study mode for healthcare professionals.',
    keywords: 'medical terminology, medical prefixes, medical suffixes, root words, medical abbreviations, healthcare vocabulary, anatomy terms',
    canonical: '/terminology',
  },
  workflows: {
    title: 'Healthcare Front Office Workflows & SOPs',
    description: 'Master front office workflows. Learn patient registration, scheduling, check-in, check-out, and appointment management procedures.',
    keywords: 'front office workflows, patient registration, appointment scheduling, check-in procedures, healthcare SOPs, clinic workflows',
    canonical: '/workflows',
  },
  curriculum: {
    title: 'Healthcare Front Office Training Curriculum',
    description: 'Complete healthcare front office training curriculum: HIPAA compliance, insurance verification, medical terminology, and workflow procedures. 10 modules, 40+ lessons, 24 SOPs.',
    keywords: 'healthcare training curriculum, front office training, medical receptionist course, HIPAA training online, insurance verification training, medical terminology course',
    canonical: '/curriculum',
  },
  pricing: {
    title: 'Pricing - Healthcare Training Plans',
    description: 'Affordable healthcare front office training. Individual plans starting at $327/year. Team discounts up to 70% for organizations. No free trial - full access from day one.',
    keywords: 'healthcare training cost, medical receptionist training price, front office training pricing, healthcare education pricing',
    canonical: '/pricing',
  },
};
