/**
 * Test script to demonstrate modality-first search prioritization
 * This shows how "CT" searches now prioritize "Computed Tomography (CT)"
 * over specific procedures like "CT Head" and "CT Abdomen/Pelvis"
 */

// Simulate the search scoring algorithm
class TestTermSearchService {
  static GENERAL_MODALITIES = [
    'computed tomography (ct)',
    'magnetic resonance imaging (mri)',
    'radiography (xr)',
    'x-ray (xr)',
    'ultrasound',
  ];

  static isGeneralModality(termName) {
    return this.GENERAL_MODALITIES.includes(termName.toLowerCase());
  }

  static getMatchScore(term, query) {
    const termLower = term.toLowerCase();
    const queryLower = query.toLowerCase();

    const isModality = this.isGeneralModality(term);
    const modalityBoost = isModality ? 300 : 0;

    // Contains match in term (whole word)
    if (termLower.includes(queryLower)) {
      const regex = new RegExp(`\\b${queryLower}\\b`, 'i');
      const isWholeWord = regex.test(termLower);
      return (isWholeWord ? 700 : 600) + modalityBoost;
    }

    return 0;
  }

  static search(terms, query) {
    const results = terms
      .map(term => ({
        term,
        score: this.getMatchScore(term, query)
      }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score);

    return results;
  }
}

// Test data
const testTerms = [
  'Computed Tomography (CT)',
  'CT Head',
  'CT Abdomen/Pelvis',
  'Chest X-ray',
  'Lumbar Spine X-ray',
  'Radiography (XR)',
  'Magnetic Resonance Imaging (MRI)',
  'MRI Brain',
  'MRI Lumbar Spine',
];

console.log('=== MODALITY-FIRST SEARCH PRIORITIZATION TEST ===\n');

// Test 1: Search for "CT"
console.log('TEST 1: Search for "CT"');
console.log('Expected: "Computed Tomography (CT)" ranks first\n');

const ctResults = TestTermSearchService.search(testTerms, 'CT');
ctResults.forEach((result, index) => {
  const isModality = TestTermSearchService.isGeneralModality(result.term);
  const badge = isModality ? '[MODALITY]' : '[PROCEDURE]';
  console.log(`${index + 1}. ${result.term.padEnd(35)} Score: ${result.score} ${badge}`);
});

console.log('\n' + '='.repeat(60) + '\n');

// Test 2: Search for "XR"
console.log('TEST 2: Search for "XR"');
console.log('Expected: "Radiography (XR)" ranks first\n');

const xrResults = TestTermSearchService.search(testTerms, 'XR');
xrResults.forEach((result, index) => {
  const isModality = TestTermSearchService.isGeneralModality(result.term);
  const badge = isModality ? '[MODALITY]' : '[PROCEDURE]';
  console.log(`${index + 1}. ${result.term.padEnd(35)} Score: ${result.score} ${badge}`);
});

console.log('\n' + '='.repeat(60) + '\n');

// Test 3: Search for "MRI"
console.log('TEST 3: Search for "MRI"');
console.log('Expected: "Magnetic Resonance Imaging (MRI)" ranks first\n');

const mriResults = TestTermSearchService.search(testTerms, 'MRI');
mriResults.forEach((result, index) => {
  const isModality = TestTermSearchService.isGeneralModality(result.term);
  const badge = isModality ? '[MODALITY]' : '[PROCEDURE]';
  console.log(`${index + 1}. ${result.term.padEnd(35)} Score: ${result.score} ${badge}`);
});

console.log('\n' + '='.repeat(60) + '\n');

// Explain the scoring system
console.log('SCORING EXPLANATION:');
console.log('- General Modalities: Base score + 300 bonus');
console.log('- Specific Procedures: Base score only');
console.log('- Whole word match: 700 base score');
console.log('- Partial match: 600 base score');
console.log('');
console.log('Example for "CT" search:');
console.log('  "Computed Tomography (CT)": 700 + 300 = 1000 [MODALITY]');
console.log('  "CT Head":                  700 + 0   = 700  [PROCEDURE]');
console.log('  "CT Abdomen/Pelvis":        700 + 0   = 700  [PROCEDURE]');
console.log('');
console.log('✅ General modalities always rank above specific procedures!');
