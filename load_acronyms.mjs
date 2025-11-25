import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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
 * Convert CSV data to medical term objects
 */
function parseAcronymsCSV(csvContent) {
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

    // Validate required fields
    if (!term.term || !term.definition) {
      console.warn(`Skipping line ${i + 1}: missing required fields (term or definition)`);
      continue;
    }

    terms.push(term);
  }

  return terms;
}

/**
 * Load acronyms into database
 */
async function loadAcronyms() {
  console.log('Loading acronyms from CSV...\n');

  try {
    // Read CSV file
    const csvContent = readFileSync('./new_acronyms_to_add.csv', 'utf-8');
    const terms = parseAcronymsCSV(csvContent);

    console.log(`Parsed ${terms.length} acronyms from CSV\n`);

    // Check which terms already exist
    const termNames = terms.map(t => t.term);
    const { data: existing } = await supabase
      .from('medical_terms')
      .select('term')
      .in('term', termNames);

    const existingTerms = new Set(existing?.map(t => t.term) || []);
    const newTerms = terms.filter(t => !existingTerms.has(t.term));

    console.log(`Existing terms: ${existingTerms.size}`);
    console.log(`New terms to add: ${newTerms.length}\n`);

    if (existingTerms.size > 0) {
      console.log('Already in database:', Array.from(existingTerms).join(', '));
      console.log('');
    }

    if (newTerms.length === 0) {
      console.log('No new terms to add. All acronyms already exist in database.');
      return;
    }

    // Insert new terms in batches
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < newTerms.length; i += batchSize) {
      const batch = newTerms.slice(i, i + batchSize);

      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(newTerms.length / batchSize)}...`);

      const { data, error } = await supabase
        .from('medical_terms')
        .insert(batch)
        .select('term');

      if (error) {
        console.error(`Error inserting batch:`, error.message);
        errorCount += batch.length;
      } else {
        successCount += data.length;
        console.log(`✓ Inserted ${data.length} terms`);
      }
    }

    console.log('\n=== Summary ===');
    console.log(`Total processed: ${terms.length}`);
    console.log(`Already existed: ${existingTerms.size}`);
    console.log(`Successfully added: ${successCount}`);
    console.log(`Errors: ${errorCount}`);

    if (successCount > 0) {
      console.log('\n✅ Acronyms loaded successfully!');
      console.log('\nSample of added terms:');
      newTerms.slice(0, 5).forEach(t => {
        console.log(`  - ${t.term}: ${t.full_form || t.definition.substring(0, 50)}...`);
      });
    }

  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the loader
loadAcronyms();
