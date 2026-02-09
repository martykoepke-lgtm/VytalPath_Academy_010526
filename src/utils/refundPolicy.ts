// ─── Refund Policy ───
// Tiered refund policy based on enrollment duration and course completion.
// Used by AccountPage (student view) and SuperAdminDashboard (admin view).

export interface RefundTier {
  label: string;
  percent: number;
  amount: number;
  condition: string;
  color: 'green' | 'yellow' | 'orange' | 'red';
}

export const COURSE_PRICE = 327;

export const REFUND_TIERS: RefundTier[] = [
  { label: 'Full Refund', percent: 100, amount: 327, condition: 'Within first 3 days', color: 'green' },
  { label: '75% Refund', percent: 75, amount: 245, condition: 'Day 4+, less than 25% complete', color: 'green' },
  { label: '50% Refund', percent: 50, amount: 163, condition: 'Day 4+, 25–49% complete', color: 'yellow' },
  { label: '25% Refund', percent: 25, amount: 82, condition: 'Day 4+, 50–74% complete', color: 'orange' },
  { label: 'No Refund', percent: 0, amount: 0, condition: '75% or more complete', color: 'red' },
];

export function calculateRefundEligibility(
  subscriptionStartDate: Date,
  completionPercent: number,
): RefundTier {
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceStart = Math.floor((now.getTime() - subscriptionStartDate.getTime()) / msPerDay);

  // Days 1-3: full refund regardless of progress
  if (daysSinceStart < 3) {
    return REFUND_TIERS[0]; // 100%
  }

  // Day 4+: based on completion percentage
  if (completionPercent < 25) return REFUND_TIERS[1]; // 75%
  if (completionPercent < 50) return REFUND_TIERS[2]; // 50%
  if (completionPercent < 75) return REFUND_TIERS[3]; // 25%
  return REFUND_TIERS[4]; // 0%
}

export function getDaysSinceStart(startDate: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((new Date().getTime() - startDate.getTime()) / msPerDay);
}
