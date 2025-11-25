import fs from 'fs';

const csvFile = 'Healthcare Data - Part 2 of 5 - Sheet1.csv';
const csvContent = fs.readFileSync(csvFile, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());

const dataLines = lines.slice(1);
console.log(`Processing ${dataLines.length} records`);

for (const line of dataLines) {
  const parts = line.split(',');
  if (parts.length < 10) continue;

  const term = parts[0]?.trim() || '';
  const category = parts[1]?.trim() || '';
  const isAbbrev = parts[2]?.trim() === 'TRUE';
  const fullForm = parts[3]?.trim() || term;
  const definition = parts[5]?.trim() || '';
  const exampleUsage = parts[6]?.trim() || '';
  const synonyms = parts[7]?.trim() || '{}';
  const aliases = parts[8]?.trim() || '{}';
  const tags = parts[9]?.trim() || '{}';

  if (!term || !category || !definition) continue;

  const termClean = term.replace(/'/g, "''");
  const categoryClean = category.replace(/'/g, "''");
  const fullFormClean = fullForm.replace(/'/g, "''");
  const definitionClean = definition.replace(/'/g, "''");
  const exampleClean = exampleUsage.replace(/'/g, "''");

  const sql = `INSERT INTO medical_terms (term, category, is_abbreviation, full_form, breakdown, definition, example_usage, synonyms, aliases, tags) VALUES ('${termClean}', '${categoryClean}', ${isAbbrev}, '${fullFormClean}', NULL, '${definitionClean}', '${exampleClean}', '${synonyms}', '${aliases}', '${tags}') ON CONFLICT (term) DO NOTHING;`;

  console.log(sql);
}
