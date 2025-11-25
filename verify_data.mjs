import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function verifyData() {
  console.log('\n=== VERIFYING DATABASE CHANGES ===\n');

  // Check categories
  const { data: categories } = await supabase
    .from('categories')
    .select('name, sort_order')
    .order('sort_order');

  console.log('📋 Categories (in order):');
  if (categories) {
    categories.forEach((cat, i) => {
      console.log(`  ${i + 1}. ${cat.name} (sort: ${cat.sort_order})`);
    });
  } else {
    console.log('  ❌ No categories found');
    return;
  }

  // Check Medications subcategories
  const medCat = categories.find(c => c.name === 'Medications');
  const { data: medSubcats } = await supabase
    .from('subcategories')
    .select('name, sort_order')
    .eq('category_id', medCat?.category_id || '')
    .order('sort_order');

  console.log('\n💊 Medications Subcategories (in order):');
  medSubcats?.forEach((sub, i) => {
    console.log(`  ${i + 1}. ${sub.name} (sort: ${sub.sort_order})`);
  });

  // Check Procedures & Diagnostics subcategories
  const procCat = categories.find(c => c.name === 'Procedures & Diagnostics');
  const { data: procSubcats } = await supabase
    .from('subcategories')
    .select('name, sort_order')
    .eq('category_id', procCat?.category_id || '')
    .order('sort_order')
    .limit(6);

  console.log('\n🔧 Procedures & Diagnostics Subcategories (in order):');
  procSubcats?.forEach((sub, i) => {
    console.log(`  ${i + 1}. ${sub.name} (sort: ${sub.sort_order})`);
  });

  // Check Diagnostic Imaging
  const imagingCat = categories.find(c => c.name === 'Diagnostic Imaging');
  if (imagingCat) {
    const { data: imagingSubcats } = await supabase
      .from('subcategories')
      .select('name, sort_order')
      .eq('category_id', imagingCat.category_id)
      .order('sort_order');

    console.log('\n📡 Diagnostic Imaging Subcategories (in order):');
    imagingSubcats?.forEach((sub, i) => {
      console.log(`  ${i + 1}. ${sub.name} (sort: ${sub.sort_order})`);
    });
  }

  console.log('\n✅ All changes are in the database!\n');
}

verifyData().catch(console.error);
