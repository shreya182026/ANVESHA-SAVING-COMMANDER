export type SavingsGoal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline?: string;
  priority?: "high" | "medium" | "low";
};

export type EmergencyBuffer = {
  current: number;
  target: number;
};

export function goalProgress(goal: SavingsGoal) {
  if (goal.target <= 0) return 100;
  return Math.min(100, Math.round((goal.saved / goal.target) * 100));
}

export function bufferProgress(buffer: EmergencyBuffer) {
  if (buffer.target <= 0) return 100;
  return Math.min(100, Math.round((buffer.current / buffer.target) * 100));
}

export function allocateOptionalSaving(
  amount: number,
  goals: SavingsGoal[],
  buffer: EmergencyBuffer
) {
  const safeAmount = Math.max(0, Math.floor(amount));
  if (!safeAmount) return { emergency: 0, goals: {} as Record<string, number> };

  // Recommendation only: emergency buffer gets priority while below target.
  const emergencyGap = Math.max(0, buffer.target - buffer.current);
  const emergency = Math.min(safeAmount, emergencyGap);
  let remaining = safeAmount - emergency;

  const allocations: Record<string, number> = {};
  const active = goals.filter(g => g.saved < g.target);

  for (const goal of active) {
    if (remaining <= 0) break;
    const gap = Math.max(0, goal.target - goal.saved);
    const share = Math.min(gap, Math.max(0, Math.round((remaining / Math.max(1, active.length)) / 5) * 5));
    if (share > 0) {
      allocations[goal.id] = share;
      remaining -= share;
    }
  }

  return { emergency, goals: allocations };
}

export function monthlyReview(goals: SavingsGoal[], buffer: EmergencyBuffer) {
  return {
    emergencyProgress: bufferProgress(buffer),
    goals: goals.map(g => ({ ...g, progress: goalProgress(g) })),
    activeGoals: goals.filter(g => g.saved < g.target).length,
    completedGoals: goals.filter(g => g.saved >= g.target).length,
  };
}
