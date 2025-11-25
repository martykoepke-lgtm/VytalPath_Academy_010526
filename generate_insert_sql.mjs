import { readFileSync } from 'fs';

function parseCSVLine(line) {
  // Remove outer quotes if entire line is wrapped
  line = line.trim();
  if (line.startsWith('"') && line.endsWith('"')) {
    line = line.slice(1, -1);
  }

  const values = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values.map(v => v.trim());
}

function parseArrayField(field) {
  if (!field || field === '{}' || field === '"{}"') return [];
  field = field.trim();
  if (field.startsWith('"') && field.endsWith('"')) field = field.slice(1, -1);
  if (field.startsWith('{') && field.endsWith('}')) field = field.slice(1, -1);
  if (!field) return [];
  const delimiter = field.includes(';') ? ';' : ',';
  return field.split(delimiter).map(item => item.trim()).filter(item => item.length > 0);
}

function escapeSql(str) {
  return str ? str.replace(/'/g, "''") : '';
}

function arrayToSql(arr) {
  if (!arr || arr.length === 0) return 'ARRAY[]::text[]';
  return `ARRAY[${arr.map(item => `'${escapeSql(item)}'`).join(',')}]`;
}

const csvFile = process.argv[2] || 'new_terms.csv';
const lines = readFileSync(csvFile, 'utf-8').trim().split('\n');
const batchSize = 25;

console.log('-- Generated SQL for', csvFile);
console.log('-- Total records:', lines.length - 1);
console.log('');

for (let batchStart = 1; batchStart < lines.length; batchStart += batchSize) {
  const batchEnd = Math.min(batchStart + batchSize, lines.length);
  const batchNum = Math.floor(batchStart / batchSize) + 1;

  console.log(`-- Batch ${batchNum}`);
  console.log('INSERT INTO medical_terms (term, category, is_abbreviation, full_form, breakdown, definition, example_usage, synonyms, aliases, tags)');
  console.log('VALUES');

  const values = [];
  for (let i = batchStart; i < batchEnd; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 10) continue;

    const term = escapeSql(cols[0]);
    const category = cols[1] ? `'${escapeSql(cols[1])}'` : 'null';
    const is_abbreviation = cols[2] === 'True' || cols[2] === 'true';
    const full_form = cols[3] ? `'${escapeSql(cols[3])}'` : 'null';
    const breakdown = cols[4] ? `'${escapeSql(cols[4])}'` : 'null';
    const definition = escapeSql(cols[5]);
    const example_usage = cols[6] ? `'${escapeSql(cols[6])}'` : 'null';
    const synonyms = arrayToSql(parseArrayField(cols[7]));
    const aliases = arrayToSql(parseArrayField(cols[8]));
    const tags = arrayToSql(parseArrayField(cols[9]));

    values.push(`  ('${term}', ${category}, ${is_abbreviation}, ${full_form}, ${breakdown}, '${definition}', ${example_usage}, ${synonyms}, ${aliases}, ${tags})`);
  }

  console.log(values.join(',\n'));
  console.log('ON CONFLICT (term) DO UPDATE SET');
  console.log('  category = EXCLUDED.category,');
  console.log('  is_abbreviation = EXCLUDED.is_abbreviation,');
  console.log('  full_form = EXCLUDED.full_form,');
  console.log('  definition = EXCLUDED.definition,');
  console.log('  example_usage = EXCLUDED.example_usage,');
  console.log('  synonyms = EXCLUDED.synonyms,');
  console.log('  aliases = EXCLUDED.aliases,');
  console.log('  tags = EXCLUDED.tags;');
  console.log('');
}
