import { MatchingTerm } from '../types/learning';

// Insurance terms for drag-and-drop matching exercise
export const insuranceTerms: MatchingTerm[] = [
  {
    id: 'copay',
    term: 'Copay',
    definition: 'A fixed dollar amount you pay at the time of service, such as $30 for a doctor visit.',
  },
  {
    id: 'coinsurance',
    term: 'Coinsurance',
    definition: 'Your share of costs after meeting your deductible, calculated as a percentage (e.g., you pay 20%, insurance pays 80%).',
  },
  {
    id: 'deductible',
    term: 'Deductible',
    definition: 'The amount you must pay out-of-pocket each year before your insurance starts covering a larger share of costs.',
  },
  {
    id: 'oop-max',
    term: 'Out-of-Pocket Maximum',
    definition: 'The most you\'ll pay in a year for covered services. After reaching this limit, insurance pays 100%.',
  },
  {
    id: 'premium',
    term: 'Premium',
    definition: 'The monthly amount you pay to maintain your health insurance coverage, regardless of whether you use services.',
  },
  {
    id: 'in-network',
    term: 'In-Network',
    definition: 'Providers who have contracts with your insurance company to offer services at negotiated, lower rates.',
  },
];

// Shuffle function for randomizing term order
export function shuffleTerms(terms: MatchingTerm[]): MatchingTerm[] {
  const shuffled = [...terms];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
