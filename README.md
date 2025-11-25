# Pocket Medical Reference

A production-ready web application for searching medical terms and abbreviations with plain-language definitions. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Smart Search**: Debounced search with exact match, trigram similarity, and full-text search
- **Rich Definitions**: Comprehensive term details including etymology, examples, and synonyms
- **Agent-Centered**: All responses sourced exclusively from the Supabase database
- **Fast Performance**: Sub-200ms search queries with optimized indexing
- **Responsive UI**: Modern, accessible interface with beautiful transitions

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Search**: pg_trgm, full-text search with custom RPC

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- Supabase account (database already provisioned)

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

The `.env` file is already configured with your Supabase credentials:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Upload Medical Terms Data

The database schema is already created. Now upload your medical terms data using the robust CSV loader:

#### Recommended: Use the CSV Loader Script

The project includes a production-ready CSV loader with validation, error handling, and batch processing:

```bash
# Validate CSV without loading (dry-run mode)
node load_medical_terms.mjs medical_terms_seed.csv --dry-run

# Load data to database
node load_medical_terms.mjs new_terms.csv

# Load with custom batch size
node load_medical_terms.mjs medical_terms_part1.csv --batch-size 50
```

**Features:**
- Proper CSV parsing that handles quotes, commas, and special characters
- Array field support (handles both `{item1,item2}` and `item1;item2` formats)
- Record validation before insertion
- Batch processing with progress reporting
- Detailed error messages with line numbers
- Dry-run mode for validation
- Automatic upsert (prevents duplicates)

**CSV Format:**
```csv
term,category,is_abbreviation,full_form,breakdown,definition,example_usage,synonyms,aliases,tags
HTN,Condition,true,Hypertension,,"Persistently elevated blood pressure...",Patient diagnosed with HTN.,High Blood Pressure,"HBP,BP",cardiovascular;chronic
```

#### Alternative: Upload via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** → **medical_terms**
3. Click **Insert** → **Import data from CSV**
4. Upload your CSV file
5. Map columns and import

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

## Database Schema

The `medical_terms` table includes:

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `term` | text | Medical term or abbreviation |
| `term_lc` | text | Lowercase normalized term |
| `is_abbreviation` | boolean | Whether term is an abbreviation |
| `full_form` | text | Full expansion of abbreviation |
| `category` | text | Classification (Condition, Procedure, etc.) |
| `breakdown` | text | Etymology breakdown |
| `definition` | text | Concise 1-3 sentence definition |
| `example_usage` | text | Usage example |
| `synonyms` | text[] | Alternative names |
| `aliases` | text[] | Other recognized forms |
| `tags` | text[] | Search tags |
| `created_at` | timestamptz | Creation timestamp |

## Search Functionality

The search uses a custom RPC function `search_terms(q, max_results)` that:

1. **Exact Match**: Highest priority for direct term or alias matches
2. **Trigram Similarity**: Fuzzy matching using pg_trgm
3. **Full-Text Search**: Weighted search across term, full_form, synonyms, and definition

Results are ranked by relevance and limited to top matches.

## Testing the App

Try these sample queries:

- **HTN** - Should return hypertension
- **TSH vs T4** - Should find both thyroid tests
- **What is IR?** - Should expand Interventional Radiology
- **spirometry** - Should return the lung function test
- **Pap smear** - Should return cervical screening procedure
- **encounter** - Should return the workflow term

## CSV Template

The `medical_terms_seed.csv` file uses this format:

```csv
term,category,is_abbreviation,full_form,breakdown,definition,example_usage,synonyms,aliases,tags
HTN,Condition,true,Hypertension,,"Persistently elevated blood pressure...","Patient diagnosed with HTN...",High Blood Pressure,"HBP,BP",cardiovascular;chronic
```

### Categories

- Condition
- Procedure
- Diagnostic
- Anatomy
- Specialty
- Insurance
- Workflow
- Regulatory
- Medication
- General

## Performance Metrics

The search service logs performance metrics:

```javascript
Search: "HTN" | Results: 1 | Latency: 45ms
```

Target: <200ms median query latency on 10k+ records

## Agent Behavior

The app follows strict guidelines:

- **Only DB Content**: Never fabricates information
- **Plain Language**: 1-3 sentence definitions
- **Concise Output**: Term, full form, category, definition, examples
- **Not Found**: Shows "Not in dataset" with nearest matches
- **No Medical Advice**: Reference only, not diagnosis or treatment

## Project Structure

```
src/
├── components/          # React components
│   ├── SearchInput.tsx
│   ├── ResultsList.tsx
│   ├── TermDetail.tsx
│   └── EmptyState.tsx
├── hooks/              # Custom hooks
│   └── useDebounce.ts
├── lib/                # Core libraries
│   ├── supabase.ts
│   └── database.types.ts
├── services/           # Business logic
│   └── searchService.ts
├── types/              # TypeScript types
│   └── medical.ts
└── App.tsx             # Main application
```

## License

MIT
