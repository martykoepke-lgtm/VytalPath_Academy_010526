import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Parse a CSV line respecting quoted fields that may contain commas
 */
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
      // Handle escaped quotes (double quotes)
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
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

/**
 * Parse array fields from various CSV formats:
 * - {} = empty array
 * - "{item1,item2}" = quoted array with commas
 * - {item1,item2} = unquoted array with commas
 * - item1;item2 = semicolon-separated list
 */
function parseArrayField(field) {
  if (!field || field === '{}' || field === '"{}"') {
    return [];
  }

  // Remove outer quotes if present
  field = field.trim();
  if (field.startsWith('"') && field.endsWith('"')) {
    field = field.slice(1, -1);
  }

  // Remove curly braces
  if (field.startsWith('{') && field.endsWith('}')) {
    field = field.slice(1, -1);
  }

  if (!field) {
    return [];
  }

  // Determine delimiter (prefer semicolon if present, otherwise comma)
  const delimiter = field.includes(';') ? ';' : ',';

  // Split by delimiter and clean each item
  return field
    .split(delimiter)
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

/**
 * Validate a medical term record
 */
function validateRecord(record, lineNumber) {
  const errors = [];

  if (!record.term || record.term.trim() === '') {
    errors.push(`Line ${lineNumber}: Missing required field 'term'`);
  }

  if (!record.definition || record.definition.trim() === '') {
    errors.push(`Line ${lineNumber}: Missing required field 'definition'`);
  }

  if (record.is_abbreviation && !record.full_form) {
    errors.push(`Line ${lineNumber}: Abbreviation '${record.term}' missing full_form`);
  }

  return errors;
}

/**
 * Parse CSV file and return array of medical term records
 */
function parseCSVFile(filePath) {
  console.log(`\nParsing ${filePath}...`);

  const content = readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');

  if (lines.length < 2) {
    console.error('CSV file has no data rows');
    return { records: [], errors: [] };
  }

  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine);

  console.log(`Headers: ${headers.join(', ')}`);
  console.log(`Total lines to process: ${lines.length - 1}`);

  const records = [];
  const errors = [];

  for (let i = 1; i < lines.length; i++) {
    const lineNumber = i + 1;
    const line = lines[i];

    if (!line.trim()) {
      continue; // Skip empty lines
    }

    try {
      const values = parseCSVLine(line);

      if (values.length < 10) {
        errors.push(`Line ${lineNumber}: Expected 10 fields, got ${values.length}`);
        continue;
      }

      const record = {
        term: values[0],
        category: values[1] || null,
        is_abbreviation: values[2] === 'True' || values[2] === 'true',
        full_form: values[3] || null,
        breakdown: values[4] || null,
        definition: values[5],
        example_usage: values[6] || null,
        synonyms: parseArrayField(values[7]),
        aliases: parseArrayField(values[8]),
        tags: parseArrayField(values[9])
      };

      const recordErrors = validateRecord(record, lineNumber);
      if (recordErrors.length > 0) {
        errors.push(...recordErrors);
        continue;
      }

      records.push(record);
    } catch (error) {
      errors.push(`Line ${lineNumber}: Parse error - ${error.message}`);
    }
  }

  console.log(`Successfully parsed: ${records.length} records`);
  console.log(`Errors encountered: ${errors.length}`);

  return { records, errors };
}

/**
 * Load records into Supabase in batches
 */
async function loadRecordsToDatabase(records, batchSize = 100) {
  console.log(`\nLoading ${records.length} records to database...`);

  let successCount = 0;
  let failCount = 0;
  const failedRecords = [];

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(records.length / batchSize);

    console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} records)...`);

    try {
      const { data, error } = await supabase
        .from('medical_terms')
        .upsert(batch, { onConflict: 'term' });

      if (error) {
        console.error(`Batch ${batchNumber} failed:`, error.message);
        failCount += batch.length;
        failedRecords.push(...batch.map(r => r.term));
      } else {
        successCount += batch.length;
        console.log(`Batch ${batchNumber} completed successfully`);
      }
    } catch (error) {
      console.error(`Batch ${batchNumber} exception:`, error.message);
      failCount += batch.length;
      failedRecords.push(...batch.map(r => r.term));
    }

    // Small delay to avoid rate limiting
    if (i + batchSize < records.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return { successCount, failCount, failedRecords };
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Usage: node load_medical_terms.mjs <csv-file> [options]

Options:
  --dry-run    Parse and validate CSV without loading to database
  --batch-size <number>  Set batch size for database inserts (default: 100)

Examples:
  node load_medical_terms.mjs new_terms.csv
  node load_medical_terms.mjs medical_terms_part1.csv --dry-run
  node load_medical_terms.mjs new_terms.csv --batch-size 50
`);
    process.exit(0);
  }

  const csvFile = args[0];
  const isDryRun = args.includes('--dry-run');
  const batchSizeIndex = args.indexOf('--batch-size');
  const batchSize = batchSizeIndex !== -1 ? parseInt(args[batchSizeIndex + 1]) : 100;

  console.log('='.repeat(60));
  console.log('Medical Terms CSV Loader');
  console.log('='.repeat(60));
  console.log(`File: ${csvFile}`);
  console.log(`Mode: ${isDryRun ? 'DRY RUN (validation only)' : 'LIVE (will insert to database)'}`);
  console.log(`Batch Size: ${batchSize}`);

  // Parse CSV file
  const { records, errors } = parseCSVFile(csvFile);

  // Report parsing errors
  if (errors.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('PARSING ERRORS:');
    console.log('='.repeat(60));
    errors.forEach(error => console.log(error));
  }

  if (records.length === 0) {
    console.log('\nNo valid records to load. Exiting.');
    process.exit(1);
  }

  // Show sample record
  console.log('\n' + '='.repeat(60));
  console.log('SAMPLE RECORD:');
  console.log('='.repeat(60));
  console.log(JSON.stringify(records[0], null, 2));

  if (isDryRun) {
    console.log('\n' + '='.repeat(60));
    console.log('DRY RUN COMPLETE - No data was inserted');
    console.log('='.repeat(60));
    console.log(`Valid records: ${records.length}`);
    console.log(`Errors: ${errors.length}`);
    process.exit(0);
  }

  // Load to database
  const { successCount, failCount, failedRecords } = await loadRecordsToDatabase(records, batchSize);

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('LOADING COMPLETE');
  console.log('='.repeat(60));
  console.log(`Successfully loaded: ${successCount} records`);
  console.log(`Failed: ${failCount} records`);

  if (failedRecords.length > 0) {
    console.log('\nFailed terms:');
    failedRecords.forEach(term => console.log(`  - ${term}`));
  }

  // Get final database count
  const { count } = await supabase
    .from('medical_terms')
    .select('*', { count: 'exact', head: true });

  console.log(`\nTotal records in database: ${count}`);

  process.exit(failCount > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
