// ─── Refund Policy ───
// 3-day no-risk guarantee: full refund within 3 days, no refund after.
// Used by AccountPage (student view) and process-cancellation edge function.

export interface RefundTier {
  label: string;
  percent: number;
  amount: number;
  condition: string;
  color: 'green' | 'red';
}

export const COURSE_PRICE = 327;

export const REFUND_TIERS: RefundTier[] = [
  { label: 'Full Refund', percent: 100, amount: 327, condition: 'Within first 3 days', color: 'green' },
  { label: 'No Refund', percent: 0, amount: 0, condition: 'After 3 days', color: 'red' },
];

export function calculateRefundEligibility(
  subscriptionStartDate: Date,
): RefundTier {
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceStart = Math.floor((now.getTime() - subscriptionStartDate.getTime()) / msPerDay);

  // Days 0-2 (within first 3 days): full refund
  if (daysSinceStart < 3) {
    return REFUND_TIERS[0];
  }

  // Day 3+: no refund
  return REFUND_TIERS[1];
}

export function getDaysSinceStart(startDate: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((new Date().getTime() - startDate.getTime()) / msPerDay);
}

export function isWithinGuaranteePeriod(startDate: Date): boolean {
  return getDaysSinceStart(startDate) < 3;
}
