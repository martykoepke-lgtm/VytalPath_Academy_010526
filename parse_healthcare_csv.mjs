import { readFileSync, writeFileSync } from 'fs';

// Special parser for the healthcare data CSV which has entire lines wrapped in quotes
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

  // Now parse the CSV fields
  const fields = [];
  let current = '';
  let inQuotes = false;
  let quoteCount = 0;

  for (let j = 0; j < line.length; j++) {
    const char = line[j];

    if (char === '"') {
      quoteCount++;
      if (inQuotes && line[j + 1] === '"') {
        // Escaped quote
        current += '"';
        j++;
        quoteCount++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
      quoteCount = 0;
    } else {
      current += char;
    }
  }
  fields.push(current);

  if (fields.length >= 10) {
    // Clean up each field
    for (let k = 0; k < fields.length; k++) {
      fields[k] = fields[k].trim();
      // Remove extra quotes
      if (fields[k].startsWith('"') && fields[k].endsWith('"')) {
        fields[k] = fields[k].slice(1, -1);
      }
      // Fix nested curly braces in arrays
      if (fields[k].startsWith('{') && !fields[k].endsWith('}')) {
        fields[k] = fields[k] + '}';
      }
    }

    // Escape any remaining quotes and build proper CSV line
    const cleanedFields = fields.map(f => {
      // Handle special cases for array fields
      if (f === '{}' || f === '') return f;
      // If field contains comma or quotes, wrap in quotes and escape internal quotes
      if (f.includes(',') || f.includes('"') || f.includes('\n')) {
        return '"' + f.replace(/"/g, '""') + '"';
      }
      return f;
    });

    output.push(cleanedFields.join(','));
  }
}

writeFileSync('/tmp/cc-agent/57865045/project/healthcare_data_cleaned.csv', output.join('\n'));
console.log(`✓ Cleaned CSV written to healthcare_data_cleaned.csv`);
console.log(`✓ Processed ${output.length - 1} records`);
