# Section Reorder & Insurance/Billing Consolidation Analysis

## Current Navigation Order

| # | Section | Route | Status |
|---|---------|-------|--------|
| 1 | Foundations | `/foundations` | ✅ Keep |
| 2 | Medical Law & Ethics | `/medical-law-ethics` | 🔄 Rename to "Compliance" |
| 3 | Insurance Training | `/insurance` | 🔄 Rename to "Insurance & Billing" |
| 4 | Medical Terminology | `/terminology` | 🔄 Move to end |
| 5 | Navigating Workflows | `/workflows` | ✅ Keep |

## Proposed New Order

| # | Section | Route | Change |
|---|---------|-------|--------|
| 1 | Healthcare Foundations | `/foundations` | No change |
| 2 | Medical Law & Compliance | `/compliance` | Rename (route change) |
| 3 | Insurance & Billing | `/billing` | Rename + expand (route change) |
| 4 | Front Office Workflows | `/workflows` | No change |
| 5 | Medical Terminology | `/terminology` | Moved to end |

---

## Insurance → Billing Consolidation Analysis

### Current "Insurance Training" Content

**Module 1: Insurance Basics**
- Why Insurance Exists
- Types of Payers & Plan Types (commercial, Medicare, Medicaid, TRICARE, self-pay)
- Key Insurance Terms (premium, deductible, copay, coinsurance, OOP max, network, prior auth)
- Eligibility & Payments Overview

**Module 2: Insurance Operations**
- Reading an Insurance Card
- Real-Time Eligibility Verification
- Understanding Copays
- Deductibles & Out-of-Pocket Maximum
- Coinsurance Calculations
- Collecting Patient Payments

**Interactive Features:**
- Insurance Card Explorer
- Eligibility Report Explorer
- Insurance Term Matching Exercise

### Revenue Cycle Mapping

The current Insurance content maps directly to Revenue Cycle phases:

| Current Content | Revenue Cycle Phase |
|-----------------|---------------------|
| Payer types, plan types | Background knowledge |
| Insurance terms | Background knowledge |
| Eligibility verification | **Phase 1: Pre-Registration** |
| Reading insurance cards | **Phase 2: Registration** |
| Copay/deductible discussions | **Phase 3: Charge Capture** (patient responsibility) |
| Collecting payments | **Phase 5: Payment Collection** |

### What's Missing (Gaps to Fill Later)

| Missing Content | Revenue Cycle Phase |
|-----------------|---------------------|
| Revenue cycle overview | Meta-level understanding |
| Medicare vs Medicaid deep dive | Background knowledge |
| CMS billing requirements | Compliance |
| Claim submission process | **Phase 4: Claim Submission** |
| Reading EOBs/ERAs | **Phase 5: Payment Posting** |
| Aging reports, collections | **Phase 6: AR Follow-up** |
| Denials and appeals | **Phase 6: AR Follow-up** |

### Recommendation

**Rename section to "Insurance & Billing"** (or "Billing & Revenue Cycle")

**Restructure into 3 modules:**

1. **Insurance Fundamentals** (existing content, no changes)
   - Why Insurance Exists
   - Types of Payers & Plan Types
   - Key Insurance Terms
   - Eligibility & Payments Overview

2. **Front Desk Insurance Operations** (existing content, no changes)
   - Reading an Insurance Card
   - Real-Time Eligibility Verification
   - Understanding Copays
   - Deductibles & Out-of-Pocket Maximum
   - Coinsurance Calculations
   - Collecting Patient Payments

3. **Billing & Revenue Cycle** (NEW MODULE - add later)
   - The Revenue Cycle: Your Role
   - Medicare vs Medicaid Deep Dive
   - CMS Documentation Requirements
   - Understanding Claims & EOBs
   - Aging Reports & Collections Basics

---

## Scripts That MUST Change

### 1. Insurance Section Intro Video Script

**File:** `docs/03-Insurance/scripts/basics/insurance-heyGen-scripts.md`

**Current text (lines 74-76):**
```
[instructional] You've got two modules here. [pause] Start with Insurance Basics [pause]
that's your foundation. [pause] Then move to Insurance Operations [pause]
that's where it gets hands-on. [pause]
```

**Would need to change to:**
```
[instructional] You've got three modules here. [pause] Start with Insurance Fundamentals [pause]
that's your foundation. [pause] Then move to Front Desk Operations [pause]
that's where it gets hands-on. [pause] And finally, Billing & Revenue Cycle [pause]
which shows you how everything connects to getting paid. [pause]
```

**Impact:** Would need to **re-record section intro video** if adding Module 3.

### 2. Video File References

**Files that reference `insuranceintro.mp4`:**
- `src/components/sections/InsuranceSection.tsx` (line 215)

If route changes from `/insurance` to `/billing`:
- Update all route references
- Consider keeping intro video as-is (it's still valid content)

### 3. Navigation & Routing

**Files requiring route changes if section renamed:**

| File | Current | New |
|------|---------|-----|
| `src/router.tsx` | `/insurance` routes (lines 77-87) | `/billing` routes |
| `src/components/layout/RoleBasedSidebar.tsx` | `path: '/insurance'` | `path: '/billing'` |
| `src/components/sections/InsuranceSection.tsx` | Internal link paths | Update to `/billing` |
| `src/components/SEO.tsx` | `seoConfigs.insurance` | `seoConfigs.billing` |

### 4. Component Renaming (Optional but Recommended)

| Current | Proposed |
|---------|----------|
| `InsuranceSection.tsx` | `BillingSection.tsx` |
| `insuranceModules` array | `billingModules` array |

---

## Scripts That Need NO Changes (Keep As-Is)

The following videos can remain unchanged:

1. **Video 1: Understanding Healthcare Payers** - Content is accurate
2. **Video 2: Key Insurance Terms** - Content is accurate
3. **Video 3: Insurance Operations** - Content is accurate
4. **All Insurance Operations videos** (Reading card, eligibility, copays, etc.)

These videos teach insurance fundamentals which remain valid regardless of section naming.

---

## Implementation Phases

### Phase 1: Reorder Only (Minimal Changes)
Just reorder the nav without renaming:
1. Move Terminology to position 5
2. Keep all routes and names the same
3. **Scripts affected:** NONE

### Phase 2: Rename Sections (Moderate Changes)
1. Rename "Insurance Training" → "Insurance & Billing"
2. Rename "Medical Law & Ethics" → "Compliance"
3. Update routes, nav, components
4. **Scripts affected:** None (keep existing intro video)

### Phase 3: Add Billing Module (Content Creation)
1. Create new Module 3: "Billing & Revenue Cycle"
2. Create new videos for revenue cycle content
3. Update section intro to mention 3 modules
4. **Scripts affected:** Section intro script needs rewrite + re-record

---

## Specific File Changes for Phase 1+2

### router.tsx changes:
```typescript
// Change order in route definitions
// Rename paths:
// '/medical-law-ethics' → '/compliance'
// '/insurance' → '/billing'
```

### RoleBasedSidebar.tsx changes:
```typescript
// Line 22: { path: '/insurance', label: 'Insurance' }
// Change to: { path: '/billing', label: 'Insurance & Billing' }

// Line 21: { path: '/medical-law-ethics', label: 'Medical Law & Ethics' }
// Change to: { path: '/compliance', label: 'Compliance' }

// Reorder array to put Terminology last
```

### InsuranceSection.tsx changes:
- Rename file to BillingSection.tsx
- Update component name
- Update header text from "Insurance Training" to "Insurance & Billing"
- Update link paths from `/insurance/` to `/billing/`

### MedicalLawEthicsSection.tsx changes:
- Rename file to ComplianceSection.tsx
- Update component name
- Update header text
- Update link paths from `/medical-law-ethics/` to `/compliance/`

---

## Summary: Scripts Requiring Changes

| Change Type | Script/Asset | Required For |
|-------------|--------------|--------------|
| **MUST re-record** | Section Intro Video | Phase 3 (adding Module 3) |
| **No change needed** | Video 1-3 Insurance content | Any phase |
| **No change needed** | Operations videos | Any phase |
| **Update docs folder structure** | `docs/03-Insurance/` | Phase 2 (rename to `docs/03-Billing/`) |

---

## Recommendation

**Do Phase 1 + 2 now:**
1. Reorder nav (Terminology to end)
2. Rename sections in UI (keep routes for now to avoid breaking links)
3. Don't re-record videos yet

**Do Phase 3 later:**
1. When you have new billing content ready
2. Re-record section intro to mention all 3 modules
3. Then change routes if desired

This approach:
- Immediately improves learning flow
- Doesn't require re-recording any videos
- Positions for future billing content
- Minimal code changes
