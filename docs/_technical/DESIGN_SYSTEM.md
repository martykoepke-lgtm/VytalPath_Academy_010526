# VytalPath Academy Design System

## Overview
This design system establishes consistent visual language and interaction patterns across the VytalPath Academy application, ensuring a cohesive and professional user experience.

---

## Color Palette

### Primary Colors
Based on the Home tab's approved color scheme:

**Teal (Primary)**
- `teal-50`: #F0FDFA (Light backgrounds)
- `teal-100`: #CCFBF1 (Icon backgrounds)
- `teal-200`: #99F6E4 (Borders, hover states)
- `teal-500`: #14B8A6 (Gradients)
- `teal-600`: #0D9488 (Primary actions, icons)
- `teal-700`: #0F766E (Hover states)

**Blue (Secondary)**
- `blue-50`: #EFF6FF (Light backgrounds)
- `blue-100`: #DBEAFE (Icon backgrounds)
- `blue-200`: #BFDBFE (Borders)
- `blue-500`: #3B82F6 (Gradients)
- `blue-600`: #2563EB (Icons, metrics)

**Indigo (Tertiary)**
- `indigo-50`: #EEF2FF
- `indigo-100`: #E0E7FF
- `indigo-200`: #C7D2FE
- `indigo-500`: #6366F1
- `indigo-600`: #4F46E5

**Supporting Colors**
- `emerald-600`: #059669 (Success states)
- `violet-600`: #7C3AED (Special features)
- `rose-600`: #E11D48 (Important highlights)

### Neutral Colors
- `gray-50`: #F9FAFB
- `gray-100`: #F3F4F6
- `gray-500`: #6B7280
- `gray-600`: #4B5563
- `gray-700`: #374151
- `gray-900`: #111827 (Headings)

### Usage Guidelines
- **Primary actions**: Teal-600
- **Secondary actions**: Blue-600
- **Tertiary actions**: Indigo-600
- **Body text**: Gray-700
- **Headings**: Gray-900
- **Subtle text**: Gray-600
- **Backgrounds**: White, Gray-50, or gradient combinations

---

## Typography

### Font Family
- **Primary**: System font stack (default Tailwind)
- Ensures optimal readability and performance across all devices

### Type Scale

**Headings**
- `text-5xl`: 3rem / 48px - Hero headings (font-bold)
- `text-4xl`: 2.25rem / 36px - Page headings (font-bold)
- `text-3xl`: 1.875rem / 30px - Section headings (font-bold)
- `text-2xl`: 1.5rem / 24px - Subsection headings (font-semibold)
- `text-xl`: 1.25rem / 20px - Card headings (font-semibold)
- `text-lg`: 1.125rem / 18px - Subheadings (font-semibold)

**Body Text**
- `text-base`: 1rem / 16px - Standard body text
- `text-sm`: 0.875rem / 14px - Secondary text, captions
- `text-xs`: 0.75rem / 12px - Labels, metadata

### Font Weights
- `font-bold`: 700 - Primary headings
- `font-semibold`: 600 - Secondary headings, emphasis
- `font-medium`: 500 - Navigation, buttons
- `font-normal`: 400 - Body text

### Line Height
- **Headings**: Default (tight)
- **Body text**: `leading-relaxed` (1.625)
- **Compact text**: `leading-normal` (1.5)

---

## Spacing System

### Base Unit: 4px (0.25rem)

**Common Spacing**
- `gap-2`: 0.5rem / 8px - Tight spacing
- `gap-3`: 0.75rem / 12px - Default icon-text gap
- `gap-4`: 1rem / 16px - Card grid gaps
- `gap-6`: 1.5rem / 24px - Section gaps
- `gap-8`: 2rem / 32px - Large section gaps

**Padding**
- `p-4`: 1rem - Compact cards
- `p-6`: 1.5rem - Standard cards
- `p-8`: 2rem - Large sections

**Margins**
- `mb-2`: 0.5rem - Tight vertical spacing
- `mb-4`: 1rem - Standard spacing
- `mb-6`: 1.5rem - Section spacing
- `mb-12`: 3rem - Major section spacing

---

## Card Component System

### FeatureCard Component
Unified card component with consistent styling and interactions.

**Props**
```typescript
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: 'teal' | 'blue' | 'indigo' | 'emerald' | 'violet' | 'rose';
  metric?: string | number;
  badge?: string;
  onClick?: () => void;
  featured?: boolean;
}
```

**Visual Specifications**
- **Background**: White (`bg-white`)
- **Border**: 2px solid transparent, color on hover
- **Border Radius**: `rounded-xl` (0.75rem)
- **Shadow**: `shadow-md` base, `shadow-xl` on hover
- **Padding**: `p-6` (1.5rem)

**Icon Container**
- **Size**: 48px × 48px (`w-12 h-12`)
- **Background**: Color-100 (e.g., `bg-teal-100`)
- **Border Radius**: `rounded-lg` (0.5rem)
- **Icon Size**: 24px × 24px (`w-6 h-6`)
- **Icon Color**: Color-600 (e.g., `text-teal-600`)

**States**
- **Default**: Clean white card with subtle shadow
- **Hover**: Elevated shadow, colored border, translate-y animation
- **Focus**: Same as hover (accessibility)

---

## Elevation & Shadows

### Shadow Scale
- `shadow-sm`: Subtle elevation (0 1px 2px)
- `shadow-md`: Default card elevation (0 4px 6px)
- `shadow-lg`: Featured content (0 10px 15px)
- `shadow-xl`: Hover state, modals (0 20px 25px)

### Usage
- **Cards**: `shadow-md` → `shadow-xl` on hover
- **Buttons**: `shadow-md` → `shadow-xl` on hover
- **Modals**: `shadow-xl`
- **Navigation**: `shadow-lg`

---

## Animations & Transitions

### Transition Duration
- **Fast**: `duration-200` (200ms) - Small UI changes
- **Default**: `duration-300` (300ms) - Standard interactions
- **Slow**: `duration-500` (500ms) - Large movements

### Easing
- **Default**: `ease-in-out` - Smooth starts and ends
- **Bounce**: Custom for special interactions

### Common Animations

**Hover Lift**
```css
hover:-translate-y-1
transition-all duration-300
```
Applied to: Cards, buttons, clickable elements

**Scale**
```css
hover:scale-105
transition-transform duration-300
```
Applied to: Logo, important icons

**Slide Right**
```css
group-hover:translate-x-1
transition-transform duration-300
```
Applied to: Arrow icons in CTAs

**Background Transition**
```css
transition-colors duration-300
```
Applied to: Icon backgrounds, button backgrounds

---

## Button Styles

### Primary Button
```css
bg-teal-600 text-white px-6 py-3 rounded-lg
font-semibold hover:bg-teal-700
shadow-md hover:shadow-xl hover:-translate-y-0.5
transition-all duration-300
```

### Secondary Button
```css
bg-white text-gray-700 px-6 py-3 rounded-lg
font-medium border-2 border-gray-300
hover:bg-gray-50 hover:border-teal-300
transition-all duration-300
```

### Icon Button
```css
w-12 h-12 rounded-lg
flex items-center justify-center
hover:bg-gray-100 transition-colors
```

---

## Interactive Elements

### Hover States
**Cards**
- Shadow elevation increase
- Border color change
- Subtle upward movement (-translate-y-1)
- Icon background color change

**Buttons**
- Background color darkening
- Shadow elevation increase
- Subtle upward movement (-translate-y-0.5)
- Icon animation (arrows, etc.)

**Links**
- Color change
- Underline appearance
- No movement (for text flow)

### Focus States
All interactive elements must have visible focus states for accessibility:
```css
focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
```

---

## Layout Patterns

### Grid Systems
**3-Column** (Features)
```css
grid md:grid-cols-3 gap-6
```

**2-Column** (Details)
```css
grid md:grid-cols-2 gap-6
```

**Responsive Breakpoints**
- Mobile: Default (single column)
- Tablet: `md:` prefix (768px+)
- Desktop: `lg:` prefix (1024px+)

### Container Widths
- **Standard**: `max-w-6xl mx-auto` (72rem)
- **Wide**: `max-w-7xl mx-auto` (80rem)
- **Text Content**: `max-w-3xl mx-auto` (48rem)

---

## Accessibility

### Color Contrast
All text must meet WCAG AA standards:
- **Normal text**: 4.5:1 contrast ratio
- **Large text**: 3:1 contrast ratio
- **UI components**: 3:1 contrast ratio

### Focus Indicators
All interactive elements must have visible focus states using ring utilities.

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Use semantic elements (nav, main, section, article)
- Include ARIA labels where necessary

### Motion
- Provide `prefers-reduced-motion` support for animations
- Keep animations subtle and purposeful

---

## Component Inventory

### Core Components
1. **FeatureCard** - Unified card for all feature highlights
2. **Navigation** - Sidebar and bottom navigation
3. **SearchBar** - Search input with icon
4. **CategorySection** - Expandable term categories
5. **SOPList** - SOP card grid
6. **Academy** - Learning module pages

### Utility Components
- **Badge** - Status indicators, labels
- **Button** - Primary, secondary, icon buttons
- **Modal** - Term details, confirmations
- **EmptyState** - No results, no data states

---

## Implementation Guidelines

### When Creating New Components

1. **Use the color palette**: Stick to approved colors
2. **Apply consistent spacing**: Use the 4px base unit
3. **Add hover animations**: Include lift and shadow transitions
4. **Ensure accessibility**: Include focus states and ARIA labels
5. **Make it responsive**: Test on mobile, tablet, desktop
6. **Use FeatureCard when possible**: Don't create redundant card styles

### When Modifying Existing Components

1. **Check existing patterns**: Look for similar components first
2. **Maintain visual consistency**: Use established spacing and colors
3. **Test interactions**: Ensure hover/focus states work correctly
4. **Update this document**: Document any new patterns

---

## Examples

### Good: Consistent Card
```tsx
<FeatureCard
  icon={BookOpen}
  title="Medical Terms"
  description="Browse organized categories"
  color="blue"
  metric="846"
  onClick={() => navigate('terms')}
/>
```

### Good: Consistent Button
```tsx
<button className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5">
  Get Started
</button>
```

### Avoid: Inconsistent Styling
```tsx
// ❌ Don't create cards with different shadows/animations
<div className="bg-white p-4 shadow-sm hover:shadow-md">
  // Inconsistent with design system
</div>

// ❌ Don't use colors outside the palette
<div className="bg-purple-300 text-yellow-600">
  // Clashing colors
</div>
```

---

## Maintenance

This design system should be treated as a living document. When adding new patterns or components:

1. Document the decision in this file
2. Update relevant components to maintain consistency
3. Ensure all team members are aware of changes
4. Test across all breakpoints and states

**Last Updated**: 2025-10-02
**Version**: 1.0.0
