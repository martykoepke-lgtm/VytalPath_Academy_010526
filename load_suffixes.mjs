import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const obj = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index] || '';
    });
    return obj;
  });
}

async function loadSuffixes() {
  try {
    console.log('Loading suffixes data...');

    const csvData = readFileSync('./suffixes_data.csv', 'utf-8');
    const suffixes = parseCSV(csvData);

    console.log(`Parsed ${suffixes.length} suffixes from CSV`);

    const { data: category, error: catError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', 'Medical Terminology')
      .maybeSingle();

    if (catError || !category) {
      console.error('Error finding Medical Terminology category:', catError);
      return;
    }

    console.log('Found Medical Terminology category:', category.id);

    let subcategory = await supabase
      .from('subcategories')
      .select('id')
      .eq('name', 'Suffixes')
      .eq('category_id', category.id)
      .maybeSingle();

    if (!subcategory.data) {
      console.log('Creating Suffixes subcategory...');
      const { data: newSubcat, error: subcatError } = await supabase
        .from('subcategories')
        .insert({
          name: 'Suffixes',
          description: 'Word endings that modify meaning and often indicate a procedure, condition, disease, or specialty.',
          category_id: category.id,
          sort_order: 2
        })
        .select()
        .single();

      if (subcatError) {
        console.error('Error creating subcategory:', subcatError);
        return;
      }
      subcategory.data = newSubcat;
    }

    console.log('Using Suffixes subcategory:', subcategory.data.id);

    console.log('Inserting suffix terms...');
    let successCount = 0;
    let errorCount = 0;

    for (const suffix of suffixes) {
      const termData = {
        term: suffix.breakdown || `-${suffix.term.toLowerCase()}`,
        definition: `${suffix.full_form}. ${suffix.definition}`,
        full_form: suffix.full_form,
        is_abbreviation: false,
        example_usage: suffix.example_usage,
        category: 'Medical Terminology',
        subcategory_id: subcategory.data.id
      };

      const { error: insertError } = await supabase
        .from('medical_terms')
        .upsert(termData, {
          onConflict: 'term',
          ignoreDuplicates: false
        });

      if (insertError) {
        console.error(`Error inserting ${suffix.term}:`, insertError.message);
        errorCount++;
      } else {
        successCount++;
        if (successCount % 10 === 0) {
          console.log(`Inserted ${successCount} suffixes...`);
        }
      }
    }

    console.log(`\nCompleted!`);
    console.log(`✓ Successfully inserted: ${successCount}`);
    console.log(`✗ Errors: ${errorCount}`);

  } catch (error) {
    console.error('Error loading suffixes:', error);
  }
}

loadSuffixes();
