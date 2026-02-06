# Pre-Video Migration Backup

**Created:** February 5, 2026
**Purpose:** Safety backup before implementing new video structure

## Archived Files

- `FoundationsSection.tsx` - Original foundations section
- `MedicalLawEthicsSection.tsx` - Original medical law section
- `InsuranceSection.tsx` - Original insurance section
- `TerminologySection.tsx` - Original terminology section
- `WorkflowsSection.tsx` - Original workflows section

## Original Video URL Mappings

All videos referenced Supabase Storage:
`https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos/`

### Foundations
- vytalpath-academy-introduction.mp4
- healthcare-front-office-foundations.mp4
- acute-vs-ambulatory-care.mp4

### Medical Law & Ethics
- hipaa-essentials-explained.mp4
- phi-explained.mp4
- hipaa-access-rules.mp4

### Insurance Module 1 (Basics)
- introduction-to-health-insurance.mp4
- types-of-payers-and-plan-types.mp4
- key-insurance-terms.mp4

### Insurance Module 2 (Operations) - KEEPING
- reading-an-insurance-card.mp4
- insurance-eligibility-verification.mp4
- understanding-copays.mp4
- deductibles-and-out-of-pocket-maximum.mp4
- coinsurance-calculations.mp4
- collecting-patient-payments.mp4

### Terminology
- (No videos - reading lessons only)

### Workflows
- (No videos - SOPs only)

## Restore Instructions

To revert to previous state:
1. Copy archived .tsx files back to `src/components/sections/`
2. Run `npm run build` to verify
