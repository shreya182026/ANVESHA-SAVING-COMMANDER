/**
 * ANVESHA financial planning helpers.
 * Prototype-only: recommendations, never automatic money movement.
 */
export type DailyPlan = {
  income: number;
  expenses: number;
  emergencyBuffer: number;
  emergencyTarget: number;
  goalContribution?: number;
};

export type SavingsRecommendation = {
  recommended: number;
  range: [number, number];
  remaining: number;
  emergencyPriority: boolean;
  reason: string;
};

/**
 * Adaptive recommendation:
 * - protects essential spending first
 * - scales with income rather than forcing one fixed percentage
 * - keeps a small floor on very low-income days
 * - becomes more conservative when expenses consume most income
 *
 * This is a hackathon prototype heuristic, not financial advice.
 */
export function getAdaptiveSavings(p: DailyPlan): SavingsRecommendation {
  const income = Math.max(0, p.income || 0);
  const expenses = Math.max(0, p.expenses || 0);
  const available = Math.max(0, income - expenses);

  if (income === 0 || available <= 0) {
    return {
      recommended: 0,
      range: [0, 0],
      remaining: income,
      emergencyPriority: p.emergencyBuffer < p.emergencyTarget,
      reason: "No safe amount is recommended today because there is no money left after today's recorded expenses."
    };
  }

  let rate: number;
  if (income < 500) rate = available < 100 ? 0.05 : 0.08;
  else if (income < 800) rate = 0.08;
  else if (income < 1200) rate = 0.10;
  else if (income < 1800) rate = 0.12;
  else rate = 0.15;

  // Never recommend more than 25% of what remains after expenses.
  let recommended = Math.round(Math.min(available * rate, available * 0.25) / 5) * 5;

  // Very small recommendations should remain optional and can be zero.
  if (available < 100) recommended = Math.min(10, Math.round(available / 5) * 5);

  const low = Math.max(0, Math.round(recommended * 0.75 / 5) * 5);
  const high = Math.min(available, Math.max(recommended, Math.round(recommended * 1.25 / 5) * 5));
  const emergencyPriority = p.emergencyBuffer < p.emergencyTarget;

  return {
    recommended,
    range: [low, high],
    remaining: available,
    emergencyPriority,
    reason: emergencyPriority
      ? "Your emergency buffer is still building, so keeping a small part of today's safe-to-save amount for it is a priority."
      : "This amount changes with today's income and expenses. It is a recommendation, not an automatic deduction."
  };
}

export function getEmergencyProgress(current: number, target: number) {
  if (target <= 0) return 100;
  return Math.min(100, Math.round((Math.max(0, current) / target) * 100));
}
