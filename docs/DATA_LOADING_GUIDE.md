# Complete Data Loading Guide - 950 Medical Terms Ready!

## ✅ Status: Ready to Load

Your new CSV file is **perfectly formatted** and **100% ready to load**:
- ✅ 950 medical terms parsed successfully
- ✅ All tags properly formatted
- ✅ Zero parsing errors
- ✅ SQL generated (all_terms.sql)

## 🚀 Quick Loading Options

### Option 1: Supabase Dashboard (RECOMMENDED - EASIEST)

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Open the `all_terms.sql` file from your project
4. Copy all contents (1,447 lines)
5. Paste into SQL Editor
6. Click "Run"
7. Wait 30-60 seconds
8. Verify: `SELECT COUNT(*) FROM medical_terms;`

✅ This is the most reliable method!

# Validate CSV without loading (recommended first step)
node load_medical_terms.mjs your_file.csv --dry-run

# Load data to database
node load_medical_terms.mjs your_file.csv

# Load with custom batch size
node load_medical_terms.mjs your_file.csv --batch-size 50
```

Or use npm scripts:

```bash
# Load seed data
npm run load:seed

# Show help
npm run load:check
```

## Features

### Robust CSV Parsing
- Handles quoted fields containing commas
- Supports nested quotes and special characters
- Properly escapes SQL strings to prevent injection
- Validates field count per row

### Array Field Support
Automatically detects and parses multiple array formats:
- `{}` - empty array
- `{item1,item2}` - comma-separated in braces
- `"{item1,item2}"` - quoted comma-separated
- `item1;item2` - semicolon-separated (legacy format)

### Data Validation
- Checks required fields (term, definition)
- Validates abbreviations have full_form
- Reports errors with line numbers
- Prevents loading invalid records

### Batch Processing
- Loads data in configurable batches (default: 100)
- Shows progress during loading
- Handles rate limiting with delays
- Automatic retry on transient failures

### Error Handling
- Detailed error messages with line numbers
- Continues processing on single record failures
- Reports summary of successes and failures
- Lists failed terms for debugging

## CSV File Format

Your CSV must have these columns in order:

```csv
term,category,is_abbreviation,full_form,breakdown,definition,example_usage,synonyms,aliases,tags
```

### Example Rows

Simple term:
```csv
Hypertension,Condition,false,,,"Persistently elevated blood pressure, typically above 140/90 mmHg",Patient has hypertension,{High BP},{HBP},cardiovascular;chronic
```

Abbreviation:
```csv
HTN,Condition,true,Hypertension,,"Persistently elevated blood pressure",Patient diagnosed with HTN,{High Blood Pressure},"{HBP,BP}",cardiovascular;chronic
```

## Troubleshooting

### Parse Errors

If you get "Expected 10 fields" errors:
1. Check for unquoted commas in definition or example_usage fields
2. Ensure all fields with commas are wrapped in quotes
3. Use the `--dry-run` flag to validate before loading

### Missing Data

If records aren't loading:
1. Verify term and definition fields are not empty
2. Check that abbreviations have full_form filled in
3. Review the error report for validation failures

### Array Fields Not Parsing

The loader supports these formats:
- Empty: `{}` or leave blank
- With values: `{item1,item2}` or `item1;item2`
- Quoted: `"{item1,item2}"`

Avoid mixing formats in the same file.

## Migration from Old Scripts

The following old scripts have been replaced:
- ~~bulk_load.mjs~~ → use `load_medical_terms.mjs`
- ~~import_terms.js~~ → use `load_medical_terms.mjs`
- ~~load_csv_data.mjs~~ → use `load_medical_terms.mjs`
- ~~load_data.mjs~~ → use `load_medical_terms.mjs`

All parsing issues have been fixed in the new unified loader.
