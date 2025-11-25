import { readFileSync, writeFileSync } from 'fs';

/**
 * Parse CSV line handling quoted fields
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Escape single quotes for SQL
 */
function escapeSql(value) {
  if (!value) return null;
  return value.replace(/'/g, "''");
}

/**
 * Parse array field from CSV (semicolon-separated)
 */
function parseArrayField(value) {
  if (!value || value === '{}' || value === '') {
    return [];
  }
  return value.split(';').map(v => v.trim()).filter(v => v.length > 0);
}

/**
 * Parse comma-separated field into array
 */
function parseCommaSeparatedField(value) {
  if (!value || value === '{}' || value === '') {
    return [];
  }
  return value.split(',').map(v => v.trim()).filter(v => v.length > 0);
}

/**
 * Convert array to PostgreSQL array literal
 */
function toPostgresArray(arr) {
  if (!arr || arr.length === 0) {
    return 'ARRAY[]::text[]';
  }
  const escaped = arr.map(v => `'${escapeSql(v)}'`);
  return `ARRAY[${escaped.join(', ')}]`;
}

/**
 * Generate SQL INSERT statement
 */
function generateInsertSQL(term) {
  const values = [
    `'${escapeSql(term.term)}'`,
    term.category ? `'${escapeSql(term.category)}'` : 'NULL',
    term.is_abbreviation ? 'TRUE' : 'FALSE',
    term.full_form ? `'${escapeSql(term.full_form)}'` : 'NULL',
    term.breakdown ? `'${escapeSql(term.breakdown)}'` : 'NULL',
    `'${escapeSql(term.definition)}'`,
    term.example_usage ? `'${escapeSql(term.example_usage)}'` : 'NULL',
    toPostgresArray(term.synonyms),
    toPostgresArray(term.aliases),
    toPostgresArray(term.tags)
  ];

  return `  (${values.join(', ')})`;
}

/**
 * Main function
 */
function generateMigration() {
  console.log('Reading CSV file...');
  const csvContent = readFileSync('./new_acronyms_to_add.csv', 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = parseCSVLine(lines[0]);

  const terms = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);

    if (values.length < headers.length) {
      console.warn(`Skipping line ${i + 1}: insufficient columns`);
      continue;
    }

    const term = {
      term: values[0],
      category: values[1],
      is_abbreviation: values[2]?.toUpperCase() === 'TRUE',
      full_form: values[3] || null,
      breakdown: values[4] || null,
      definition: values[5],
      example_usage: values[6] || null,
      synonyms: parseCommaSeparatedField(values[7]),
      aliases: parseCommaSeparatedField(values[8]),
      tags: parseArrayField(values[9])
    };

    if (!term.term || !term.definition) {
      console.warn(`Skipping line ${i + 1}: missing required fields`);
      continue;
    }

    terms.push(term);
  }

  console.log(`Parsed ${terms.length} terms`);

  // Generate SQL migration
  const sql = `/*
  # Insert Medical Acronyms and Abbreviations

  1. New Terms
    - ${terms.length} healthcare acronyms and abbreviations
    - Covers regulatory bodies, organizations, departments, conditions, procedures, equipment, and lab tests
    - Includes full forms, definitions, examples, and tags

  2. Categories
    - Regulatory: HIPAA, OSHA, CDC, FDA, WHO, NIH, etc.
    - Staff: ACLS, BLS, PALS certifications
    - Workflow: NICU, PICU, MICU, PACU departments
    - Condition: MRSA, ARDS, COPD, etc.
    - Specialty: CABG, PCI, ERCP procedures
    - Lab tests: CBC, BMP, CMP, etc.

  3. Security
    - Uses ON CONFLICT to prevent duplicates
    - RLS policies already exist on medical_terms table
*/

-- Insert acronyms with conflict handling
INSERT INTO medical_terms (
  term,
  category,
  is_abbreviation,
  full_form,
  breakdown,
  definition,
  example_usage,
  synonyms,
  aliases,
  tags
) VALUES
${terms.map(generateInsertSQL).join(',\n')}
ON CONFLICT (term) DO UPDATE SET
  category = EXCLUDED.category,
  is_abbreviation = EXCLUDED.is_abbreviation,
  full_form = EXCLUDED.full_form,
  breakdown = EXCLUDED.breakdown,
  definition = EXCLUDED.definition,
  example_usage = EXCLUDED.example_usage,
  synonyms = EXCLUDED.synonyms,
  aliases = EXCLUDED.aliases,
  tags = EXCLUDED.tags;
`;

  const filename = 'insert_acronyms.sql';
  writeFileSync(filename, sql, 'utf-8');
  console.log(`\n✅ Generated ${filename}`);
  console.log(`   Contains ${terms.length} INSERT statements`);
  console.log(`\nSample terms:`);
  terms.slice(0, 5).forEach(t => {
    console.log(`  - ${t.term}: ${t.full_form || t.definition.substring(0, 50)}...`);
  });
}

generateMigration();
