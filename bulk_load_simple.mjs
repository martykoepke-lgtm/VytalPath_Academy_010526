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

// Parse CSV line respecting quotes
function parseCSVLine(line) {
  line = line.trim();
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (line[i + 1] === '"') {
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

// Parse array field
function parseArrayField(field) {
  if (!field || field === '{}') return [];
  field = field.trim();
  if (field.startsWith('{') && field.endsWith('}')) {
    field = field.slice(1, -1);
  }
  if (field.startsWith('"') && field.endsWith('"')) {
    field = field.slice(1, -1);
  }
  if (!field) return [];
  return field.split(',').map(item => item.trim()).filter(item => item.length > 0);
}

async function loadData() {
  const csvFile = process.argv[2] || 'healthcare data - Sheet1 (1).csv';
  console.log(`Reading ${csvFile}...`);

  const content = readFileSync(csvFile, 'utf-8');
  const lines = content.trim().split('\n');

  console.log(`Total lines: ${lines.length}`);

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 10) continue;

    const record = {
      term: cols[0],
      category: cols[1] || null,
      is_abbreviation: cols[2] === 'TRUE' || cols[2] === 'true',
      full_form: cols[3] || null,
      breakdown: cols[4] || null,
      definition: cols[5] || '',
      example_usage: cols[6] || null,
      synonyms: parseArrayField(cols[7]),
      aliases: parseArrayField(cols[8]),
      tags: parseArrayField(cols[9])
    };

    records.push(record);
  }

  console.log(`Parsed ${records.length} valid records`);
  console.log(`Sample record:`, JSON.stringify(records[0], null, 2));

  // Insert in batches of 50
  const batchSize = 50;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(records.length / batchSize);

    console.log(`\nProcessing batch ${batchNum}/${totalBatches} (${batch.length} records)...`);

    try {
      const { data, error } = await supabase
        .from('medical_terms')
        .upsert(batch, {
          onConflict: 'term',
          ignoreDuplicates: false
        });

      if (error) {
        console.error(`Batch ${batchNum} error:`, error.message);
        failCount += batch.length;
      } else {
        console.log(`Batch ${batchNum} ✓ loaded successfully`);
        successCount += batch.length;
      }
    } catch (err) {
      console.error(`Batch ${batchNum} exception:`, err.message);
      failCount += batch.length;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`LOADING COMPLETE`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Successfully loaded: ${successCount} records`);
  console.log(`Failed: ${failCount} records`);

  // Verify total count
  const { count, error } = await supabase
    .from('medical_terms')
    .select('*', { count: 'exact', head: true });

  if (!error) {
    console.log(`\nTotal records in database: ${count}`);
  }
}

loadData().catch(console.error);
