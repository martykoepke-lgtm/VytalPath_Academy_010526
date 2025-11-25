import { readFileSync, writeFileSync } from 'fs';

const content = readFileSync('/tmp/cc-agent/57865045/project/healthcare data - Sheet1.csv', 'utf-8');
const lines = content.trim().split(/\r?\n/);

console.log(`Processing ${lines.length} lines...`);

const output = [];
output.push('term,category,is_abbreviation,full_form,breakdown,definition,example_usage,synonyms,aliases,tags');

for (let i = 1; i < lines.length; i++) {
  let line = lines[i].trim();

  // Remove outer quotes
  if (line.startsWith('"') && line.endsWith('"')) {
    line = line.slice(1, -1);
  }

  // Split by comma but respect nested quotes
  const rawFields = [];
  let current = '';
  let inQuotes = false;

  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      if (line[j + 1] === '"') {
        j++; // Skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      rawFields.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  rawFields.push(current);

  // The CSV should have 10 fields, but tags might be split
  // Fields 0-8 are: term, category, is_abbreviation, full_form, breakdown, definition, example_usage, synonyms, aliases
  // Field 9+ should be combined as tags

  if (rawFields.length >= 10) {
    const term = rawFields[0].replace(/^"/, '');
    const category = rawFields[1];
    const is_abbreviation = rawFields[2];
    const full_form = rawFields[3];
    const breakdown = rawFields[4];
    const definition = rawFields[5];
    const example_usage = rawFields[6];
    const synonyms = rawFields[7];
    const aliases = rawFields[8];

    // Combine remaining fields as tags and clean them up
    let tags = rawFields.slice(9).join(',').trim();
    // Remove extra quotes and braces
    tags = tags.replace(/^"+"/, '').replace(/"+"$/, '');
    tags = tags.replace(/^{/, '').replace(/}$/, '');

    // Format as proper CSV line
    const outputFields = [
      term.includes(',') ? `"${term}"` : term,
      category,
      is_abbreviation,
      full_form || '',
      breakdown || '',
      definition.includes(',') ? `"${definition}"` : definition,
      example_usage.includes(',') ? `"${example_usage}"` : example_usage,
      synonyms,
      aliases,
      tags ? `{${tags}}` : '{}'
    ];

    output.push(outputFields.join(','));
  }
}

writeFileSync('/tmp/cc-agent/57865045/project/healthcare_data_cleaned.csv', output.join('\n'));
console.log(`✓ Cleaned CSV written to healthcare_data_cleaned.csv`);
console.log(`✓ Processed ${output.length - 1} records`);
