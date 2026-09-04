# ANVESHA financial update

Added:
- `src/lib/anvesha-finance.ts`: adaptive savings recommendation engine.
- `src/components/anvesha/AdaptiveSavingsCard.tsx`: reusable recommendation card.

Behavior:
- Uses today's income and expenses.
- Scales the recommendation with available money instead of forcing one fixed percentage.
- Low/no-income days can recommend ₹0 or a very small amount.
- Shows the recommendation as optional; it never performs an automatic transfer.
- Flags when the emergency buffer is below target.

This is a hackathon prototype heuristic, not financial advice.
