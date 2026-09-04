ANVESHA — SECTION 1 + SECTION 2 MODIFICATIONS

Section 1: Location + Language
- Added 10 supported language choices with native-script names.
- Added region/state mapping for recommendations.
- Added manual state/region selection with broad Indian coverage.
- Location recommendation uses only coarse labels; coordinates are not persisted.
- Selected language is persisted with the active account.
- Added localized core onboarding/auth/profile/financial strings in Hindi and expanded language dictionaries for the supported languages.

Section 2: Authentication + First-time Onboarding + Personal/Financial Information
- Added separate prototype accounts stored locally by normalized mobile/email identifier.
- Sign Up creates a fresh empty account after OTP verification; it no longer reuses the demo profile.
- Login restores the selected existing account; unknown accounts receive a clear message to sign up.
- Existing demo account remains available through the original demo mobile number.
- OTP authentication now switches into the correct account and destination in one state transition.
- Personal Information supports progressive profile completion and Save & Exit persistence.
- Financial Information remains conversational/stepwise rather than one giant form.
- Financial question progress is persisted and restored after Save & Exit.
- Existing entered financial information is retained when resuming.
- Privacy explanation remains before sensitive collection.
- Existing ANVESHA visual identity and Anvi asset are preserved.

Validation
- TypeScript syntax/parse validation was run on the modified source set; no TS syntax diagnostics were reported.
- Full dependency installation/build was not available in this environment because npm dependency download is network/time limited, so runtime validation should still be performed locally.
