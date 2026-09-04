# ANVESHA final implementation pass

This pass refactors onboarding to behave like a real interactive financial companion rather than a forced linear questionnaire.

## Changes
- Added an explicit Onboarding Journey hub after Anvi introduction/tour.
- Portals are cards with persistent status; tapping a card selects it and moves Anvi into the contextual area. A second explicit Open Portal action enters the portal.
- Personal Information is conversational: one question at a time, Anvi explains why each item is requested, with back/save-exit controls.
- Personal Information no longer auto-opens after the tour or abruptly starts collecting data.
- Financial Information Save & Exit returns to the journey hub while preserving progress.
- Added Odia, Assamese and Urdu to supported language choices in addition to the existing Indian-language set.
- Added localized journey/portal copy for the major supported languages.
- Existing stateful Daily Money, goals, buffer, budget, UPI simulation, wallet, calendar, notifications, reviews and settings are preserved.
- Existing Anvi asset/animation and visual identity are preserved.

## Source basis
The implementation follows the supplied 24-page ANVESHA modification specification, especially the requirements for a real app, interactive portals, language/location, first-time onboarding, conversational personal/financial information and persistent progress.


## Adaptive savings correction
- Corrected the recommendation to calculate from actual recorded daily income minus actual recorded daily expenses, avoiding double-counting estimated essential expenses.
- Recommendation remains a transparent prototype heuristic, rounded to ₹5 and capped at 25% of the day's safe surplus.
