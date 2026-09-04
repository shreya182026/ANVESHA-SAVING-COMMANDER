# ANVESHA — final modification notes

This archive is a continuation of the existing ANVESHA project. It does not rebuild the application from scratch.

## Critical runtime fixes
- Removed the duplicate `SavingsDestination` type declaration that caused Vite/Rolldown to fail at startup.
- Fixed the OTP success transition. Verification now updates `loggedIn`, `screen`, and the persisted onboarding resume point together instead of navigating through the OTP route again.
- Authentication screens (`splash`, `auth`, `otp`, `app`) no longer overwrite the persisted onboarding resume step. This prevents successful OTP verification and future returning-user resume flows from becoming stuck on `otp`.

## Implemented modification areas
- Stateful Daily Money with multiple income/expense entries and historical dates.
- Daily totals and adaptive safe-to-save recommendation.
- User-confirmed savings and remaining recommendation tracking.
- Calendar/day-report support and entry editing/deletion.
- Goals with contributions, pause/resume, target and deadline controls.
- Emergency Buffer separation and editable target.
- Budget/adaptive savings presentation.
- Extra-money allocation destinations.
- Notification center and useful reminder states.
- Monthly/yearly review support.
- Persistent onboarding progress and returning-user handling.
- Settings/privacy/language/notification controls.
- Benefits & Schemes prototype presentation.
- Existing Anvi asset and visual identity retained.
- Existing UPI simulation retained; no real-money movement or banking credentials are requested.

## Validation note
The preparation environment did not have the project's npm dependencies available and `npm install` timed out, so a clean production build could not be completed inside this environment. The previous Vite error reported by the user (duplicate `SavingsDestination`) was removed, and the OTP transition was rewritten to be deterministic rather than relying on the previous route/resume-step race.
