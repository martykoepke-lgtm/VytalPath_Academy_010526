import fs from 'fs';

const csvFile = process.argv[2] || 'Healthcare Data - Part 1 of 5 - Sheet1.csv';
const csvContent = fs.readFileSync(csvFile, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());

// Skip header
const dataLines = lines.slice(1);

console.log(`Processing ${dataLines.length} records from ${csvFile}`);

// Parse CSV and generate SQL batches
const batches = [];
let currentBatch = [];

for (const line of dataLines) {
  const match = line.match(/^([^,]+),([^,]+),(TRUE|FALSE),([^,]*),([^,]*),([^,]+),([^,]+),(\{[^}]*\}),(\{[^}]*\}),\"(\{[^}]+\})\"/);

  if (!match) continue;

  const [_, term, category, isAbbrev, fullForm, breakdown, definition, exampleUsage, synonyms, aliases, tags] = match;

  const termClean = term.replace(/'/g, "''");
  const categoryClean = category.replace(/'/g, "''");
  const fullFormClean = (fullForm || term).replace(/'/g, "''");
  const breakdownClean = breakdown ? `'${breakdown.replace(/'/g, "''")}'` : 'NULL';
  const definitionClean = definition.replace(/'/g, "''");
  const exampleClean = exampleUsage.replace(/'/g, "''");

  const synonymsArray = synonyms === '{}' ? '[]' : synonyms.replace(/{/, '[').replace(/}/, ']').replace(/'/g, '"');
  const aliasesArray = aliases === '{}' ? '[]' : aliases.replace(/{/, '[').replace(/}/, ']').replace(/'/g, '"');
  const tagsArray = tags.replace(/{/, '[').replace(/}/, ']').replace(/'/g, '"');

  const sql = `('${termClean}', '${categoryClean}', ${isAbbrev === 'TRUE'}, '${fullFormClean}', ${breakdownClean}, '${definitionClean}', '${exampleClean}', '${synonymsArray}'::jsonb, '${aliasesArray}'::jsonb, '${tagsArray}'::jsonb)`;

  currentBatch.push(sql);

  if (currentBatch.length === 10) {
    batches.push(currentBatch.join(',\n'));
    currentBatch = [];
  }
}

if (currentBatch.length > 0) {
  batches.push(currentBatch.join(',\n'));
}

console.log(`\nGenerated ${batches.length} batches\n`);

// Output each batch as a complete INSERT statement
for (let i = 0; i < batches.length; i++) {
  const insertSQL = `INSERT INTO medical_terms (term, category, is_abbreviation, full_form, breakdown, definition, example_usage, synonyms, aliases, tags)
VALUES
${batches[i]}
ON CONFLICT (term) DO NOTHING;`;

  console.log(`\n========== BATCH ${i + 1} ==========`);
  console.log(insertSQL);
  console.log(`\n`);
}
