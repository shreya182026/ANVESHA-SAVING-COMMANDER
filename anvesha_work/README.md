# Anvesha Savings Buddy

ANVESHA — FULL FUNCTIONAL MOBILE APP PROTOTYPE

Build a complete, high-fidelity, interactive mobile-first web application prototype called ANVESHA.

ANVESHA is a simple, trustworthy savings assistant designed primarily for platform-based delivery workers in India who have irregular daily income.

CRITICAL BUILD REQUIREMENT

This must be a WORKING INTERACTIVE APPLICATION, NOT a collection of static screens, slides, wireframes, or screenshots.

Build the application so that:

Every important button is clickable.

Every CTA performs its intended action.

Navigation between screens actually works.

Forms accept input.

Selections change application state.

Modals open and close correctly.

Confirmations appear after actions.

Data entered by the user is retained during the prototype session.

Savings calculations update based on entered income and expenses.

Goal progress updates when savings are made.

Wallet balance updates after simulated deposits and withdrawals.

Bottom navigation works.

Back navigation works wherever appropriate.

Language selection changes the displayed interface language.

Guided onboarding can be completed.

Skip buttons work.

Error, disabled, loading and success states are represented.

No major screen should be a dead end.

Do not create fake buttons that have no interaction.

Do not create a slideshow.

Do not merely make visually similar pages.

The final result must feel like a real mobile application that can be demonstrated live during a hackathon.

Use realistic sample data so the prototype feels alive immediately.

If a real external service is not appropriate for a hackathon prototype, create a clearly labeled simulation/mock flow rather than pretending that a real financial transaction occurred.

1. PRODUCT

Product name:

ANVESHA

Tagline:

“Save today. Stay ready for tomorrow.”

Target user:

Indian platform-based delivery workers with irregular daily income.

Core problem:

Traditional savings systems assume a predictable monthly salary. Delivery workers may earn different amounts every day.

ANVESHA therefore recommends savings dynamically according to the user's income, expenses, emergency needs and goals.

Core principle:

Save more when you earn more. Save less when you earn less. Never make saving feel like a punishment.

2. DESIGN DIRECTION

Create a premium but warm Indian fintech aesthetic.

The product should look:

trustworthy

simple

modern

human

approachable

premium

financially responsible

It must NOT look:

childish

cartoonish

overly futuristic

cyberpunk

excessively AI-generated

cluttered

like a college project

like a generic banking dashboard

COLORS

Deep Teal:
#0F5C5E

Primary Teal:
#168A83

Soft Turquoise:
#DDF3EF

Warm Cream:
#FFF9F2

Soft Orange:
#F28C52

Dark Text:
#173536

White:
#FFFFFF

Light Grey:
#F4F6F5

Use teal as the primary brand color.

Use orange selectively for:

savings highlights

important alerts

goals

progress

positive financial actions

illustrations

Use cream and white as primary backgrounds.

Avoid large black areas.

Use:

subtle gradients

soft shadows

rounded cards

clean spacing

clear hierarchy

generous touch targets

3. TYPOGRAPHY

Use Inter or another modern highly readable sans-serif font.

Headings:

Bold but not oversized.

Body:

Short, simple sentences.

The target user may have limited financial literacy.

Avoid complicated financial terminology.

Use ₹ for Indian currency.

Use Indian number formatting where appropriate.

Example:

₹1,050

₹10,000

₹4,850

4. RESPONSIVE MOBILE EXPERIENCE

Design primarily for a mobile phone.

The main experience should resemble a real Android/iOS fintech app.

Use:

mobile-width layouts

touch-friendly buttons

large tap targets

bottom navigation

swipe-friendly cards where useful

responsive behavior

On desktop, display the application inside a convincing mobile-app frame/container rather than stretching the UI unnaturally across the entire screen.

5. APPLICATION STATE

Create a centralized prototype state so that the application behaves consistently.

Maintain at minimum:

user name

selected language

location permission state

occupation

income

income variability

expenses

family information

emergency savings

savings goals

UPI connection state

wallet balance

emergency buffer

transaction history

today's income

today's expenses

recommended saving

onboarding completion

notification settings

privacy settings

Use realistic initial sample values so the app is immediately demonstrable.

Example initial user:

Name:
Rahul

Occupation:
Delivery Worker

Today's income:
₹1,050

Today's expenses:
₹320

Savings wallet:
₹4,850

Emergency buffer:
₹2,500 / ₹10,000

Active goal:
Emergency Fund

Goal:
₹4,850 / ₹10,000

6. ANVI — AI ASSISTANT

Create a friendly assistant named:

Anvi

Anvi should visually resemble a realistic/simple friendly Indian woman.

Do NOT make her:

a robot

a cartoon

a floating AI brain

an obviously AI-generated character

Anvi should appear through:

small speech bubbles

contextual cards

onboarding guidance

help responses

Do not allow Anvi to dominate the interface.

Anvi should explain:

what a section means

why information is requested

why saving matters

how much the user can safely save

why today's saving amount changed

how the budget works

how the emergency buffer works

when the user is close to a goal

how to get help

For the prototype, Anvi's responses may use predefined contextual responses instead of a live AI API.

7. LANGUAGE + LOCATION

On first use:

Show:

“Make Anvesha yours”

First ask for location permission.

Explain clearly:

“We use your location only to suggest relevant languages and regions. We do not need your precise location to manage your savings.”

Button:

Use my location

Also provide:

Choose manually

After location selection, show 2–3 locally relevant language options first.

Then show:

Hindi (हिन्दी)

English (English)

Bengali (বাংলা)

Language names must appear in their own script with English in brackets.

After the user chooses a language, update the onboarding interface to that language.

Allow language changes later from Profile → Settings.

Location permission must be represented as a prototype state.

8. SPLASH SCREEN

Screen:

ANVESHA

Tagline:

“Save today. Stay ready for tomorrow.”

Create a minimal premium visual related to:

Indian delivery worker

everyday financial security

savings

Do not use an existing external logo.

CTA:

Get started

Interaction:

Get started → Login / Sign Up

9. LOGIN / SIGN UP

Title:

Welcome to Anvesha

Buttons:

Login

Sign Up

Allow:

Mobile number / OTP

Email

Create a simulated OTP verification flow.

When OTP is submitted:

valid OTP → success state

invalid OTP → error state

For prototype purposes, allow a clearly defined demo OTP such as:

123456

After successful login:

→ Language & Location

Sign Up:

→ OTP

→ Language & Location

10. LANGUAGE & LOCATION

Title:

Make Anvesha yours

Location:

Use my location

Then recommended languages.

CTA:

Continue

Interaction:

Continue → Name

11. NAME

Anvi welcomes the user.

Question:

“What should we call you?”

Input:

Name

CTA:

Continue

Store the name.

Continue → Welcome / Anvi Introduction

12. WELCOME + ANVI INTRODUCTION

Show:

“Hi [Name]! I’m Anvi.”

Anvi says:

“I’ll help you save without making your daily life difficult.”

Create a guided interactive tour.

Tour highlights:

Savings

Daily Money

Budget

Wallet

Goals

Help

Language

Settings

Each highlighted feature should have a tooltip/card.

Buttons:

Continue

Skip tour

Continue advances through tour steps.

Skip tour immediately completes the tour.

After completion:

→ Personal Information

13. PERSONAL INFORMATION

Title:

Let’s create your profile

Anvi explains why information is needed.

Collect:

Full name

Age

Mobile number

City/area

Occupation

Preferred language

Marital status — optional

Number of family members

Emergency contact — optional

Use:

input fields

cards

dropdowns

radio buttons

Do not ask unnecessary sensitive information.

CTA:

Save & Continue

Validate required fields.

Continue:

→ Financial Information

14. FINANCIAL INFORMATION

Create a conversational step-by-step experience.

Do NOT dump all questions onto one screen.

Ask one question at a time.

INCOME

Question:

“Where do you currently earn from?”

Options:

Delivery work

Other work

Both

Question:

“Approximately how much do you earn on a normal working day?”

Question:

“How much can your income change between a low-income and high-income day?”

Question:

“Do you have another source of income?”

Yes / No

If Yes:

“What is it?”

“How much do you approximately earn from it?”

FAMILY

Ask:

“How many people live in your household?”

“How many members currently earn?”

“Does your spouse/wife/husband work?”

Yes / No

If Yes:

“What is their approximate monthly income?”

“Does anyone else in your family contribute income?”

“What is their approximate income?”

EXPENSES

Ask approximate monthly expenses:

Rent / housing

Food

Electricity / utilities

Phone / internet

Fuel / vehicle

Education

Medical

Debt/loan repayments

Family support

Other

Allow ranges:

₹0–₹2,000

₹2,000–₹5,000

₹5,000–₹10,000

₹10,000+

Do not force exact numbers.

EMERGENCY SAVINGS

Question:

“Do you currently have money kept aside for emergencies?”

Yes / No

If Yes:

“Approximately how much?”

Then display a summary:

Income

Essential expenses

Other expenses

Existing savings

Possible savings capacity

CTA:

Create my plan

→ Why Save

15. WHY SAVE

Create a short educational section.

Include a realistic video-style card/placeholder representing a 2–3 minute educational video.

Anvi explains:

irregular income

importance of small savings

medical emergencies

vehicle repairs

family emergencies

income gaps

emergency buffers

financial discipline

how Anvesha helps

Buttons:

Watch video

Skip

For prototype purposes, the video can be a simulated educational experience with play/pause state or a short placeholder interaction.

After completion:

→ Saving Goals

16. SAVING GOALS

Title:

What are you saving for?

Goal options:

Emergency Fund

Medical Emergency

Vehicle Repair

Family Need

Education

Personal Goal

Other

Then ask:

“How much would you like to save?”

Then:

“When would you like to reach this goal?”

Allow multiple goals.

Every goal should store:

name

target amount

current amount

target date

progress

Show progress bars.

CTA:

Continue

→ UPI Setup

Also allow:

Add another goal

17. UPI SETUP

Explain:

“Connect your UPI account to make saving easier.”

Privacy warning:

Never ask for UPI PIN.

Never ask for bank password.

Never store credentials.

Never imply that this prototype has real banking access.

CTA:

Connect UPI

Create a simulated UPI authorization flow.

Show:

“Connecting securely…”

Then:

“UPI connected ✓”

State:

Your money stays in your linked bank account unless you choose to save.

Clearly label this:

Prototype simulation — no real money is transferred.

Continue:

→ Budget

Also provide:

Skip for now

which continues to Budget but leaves UPI disconnected.

18. FLEXIBLE BUDGET + SAVINGS BUFFER

This is a key feature of ANVESHA.

Do NOT create a fixed monthly savings target.

Calculate recommendations dynamically.

Example rules:

If today's income = ₹1,000:

Recommended saving = ₹100

If today's income = ₹500:

Recommended saving = ₹30–₹50

If today's income = ₹1,500:

Recommended saving = ₹150–₹200

The recommendation should consider:

today's income

estimated essential expenses

recent spending

emergency buffer

active savings goals

Clearly state:

“Your savings amount changes with your income.”

And:

“This is a recommendation, not a mandatory deduction.”

Show:

Estimated essential expenses

Flexible expenses

Emergency buffer

Recommended savings

Available spending

Continue:

→ Main Dashboard

19. MAIN DASHBOARD

Greeting:

Good morning, [Name]

Small Anvi greeting.

Cards:

TODAY'S INCOME

₹1,050

SAFE TO SAVE

₹100

CTA:

Save ₹100

SAVINGS WALLET

₹4,850

EMERGENCY BUFFER

₹2,500 / ₹10,000

ACTIVE GOAL

Emergency Fund

₹4,850 / ₹10,000

TODAY'S EXPENSES

₹320

WEEKLY PROGRESS

Goal:

₹700

Saved:

₹620

Bottom navigation:

Home

Money

Goals

Wallet

Profile

Floating Anvi/Help button.

All navigation items must work.

20. DAILY MONEY

Title:

Today’s money

Question:

“How much did you earn today?”

Large number input.

Then:

“Did you spend anything today?”

Yes / No

If Yes:

Expense amount

Category:

Fuel

Food

Vehicle

Family

Other

CTA:

Save today’s record

After saving:

Calculate recommendation dynamically.

Example:

“Nice! You earned ₹1,050 today.”

“Based on your plan, you can safely save ₹100.”

Buttons:

Save ₹100

Not now

Save ₹100:

→ Savings Action

Not now:

→ Dashboard

The user should not need to manually transfer money every day simply to use the app.

21. SAVINGS ACTION

Show:

“You can safely save ₹100 today.”

Explain:

“This recommendation is based on today’s income, your expenses and your goals.”

Buttons:

Yes, save ₹100

Maybe later

If Yes:

simulate a UPI savings transaction.

Show loading state:

“Saving…”

Then success:

“₹100 moved to your Anvesha savings wallet.”

Clearly label:

Prototype simulation — no real money transferred.

Update:

wallet balance

goal progress

transaction history

emergency buffer if applicable

Then:

View Wallet

→ Wallet

22. SAVINGS WALLET

Show:

Total savings

₹4,950

This week:

₹620 saved

Goal:

₹10,000

Progress bar.

Sections:

Emergency Fund

Medical Fund

Other Goals

Transaction history:

+₹100 Today

+₹80 Yesterday

+₹120 Monday

CTA:

Withdraw

→ Withdraw

23. WITHDRAW

Ask:

Amount

Show:

“Where should we send it?”

Linked UPI account.

CTA:

Withdraw ₹500

Show confirmation modal.

Then success state:

“₹500 withdrawal requested.”

Clearly state:

Prototype simulation — no real money transferred.

Update wallet balance after confirmation.

24. GOALS

Show all goals.

Each card contains:

Goal name

Target amount

Current amount

Progress

Target date

Clicking a goal opens:

Goal Details

Show:

progress

amount remaining

target date

recent contributions

Anvi advice

CTA:

Add to this goal

CTA:

Add new goal

All actions must work.

25. HELP / ANVI

Title:

How can I help?

Suggested question chips:

“How much should I save?”

“Why did my saving amount change?”

“How does my budget work?”

“How do I withdraw?”

“Why should I keep an emergency fund?”

“How do I change my language?”

Each chip must be clickable.

Clicking one opens an answer card or overlay from Anvi.

Include:

Ask Anvi

with a simple prototype conversational interaction.

Responses can be predefined but should be contextual and useful.

26. PROFILE / SETTINGS

Show:

Name

Language

Location permission

Linked UPI

Savings preferences

Notification settings

Privacy

Help

Logout

Allow:

language change

notification toggle

location permission toggle/state

UPI disconnect simulation

Logout should return to Login.

27. PRIVACY

Create a clear privacy section.

Explain:

“We only ask for information that helps personalize your savings plan.”

Include:

information collected

why it is used

location permissions

financial information

UPI connection

data controls

Important:

Never request UPI PIN.

Never display bank passwords.

Never store UPI credentials.

Show consent before financial connection.

Allow UPI disconnection.

Allow privacy settings.

28. GLOBAL NAVIGATION

Bottom navigation must work across all relevant authenticated screens.

Items:

Home

Money

Goals

Wallet

Profile

Clicking each should immediately navigate to the correct section.

Use active/inactive states.

29. MODALS AND OVERLAYS

Use functional modals for:

OTP verification

Anvi explanations

UPI authorization simulation

saving confirmation

withdrawal confirmation

guided tour

language selection where appropriate

success states

error states

Every modal must have a working close/cancel action where appropriate.

30. BUTTON STATES

All important buttons must have:

default state

pressed/active state

disabled state where appropriate

loading state where appropriate

success state

error state where appropriate

Buttons must never look clickable but do nothing.

31. ERROR HANDLING

Implement basic prototype validation.

Examples:

Empty required input:

“Please enter this information.”

Invalid OTP:

“Incorrect OTP. Please try again.”

Invalid amount:

“Please enter a valid amount.”

Withdrawal greater than wallet:

“You cannot withdraw more than your available savings.”

Missing goal information:

“Please complete your goal details.”

UPI disconnected:

“Connect UPI to use this simulated savings action.”

32. DATA BEHAVIOR

The prototype should behave like one coherent application.

For example:

If the user enters:

Today's income = ₹1,200

Today's expenses = ₹400

then the recommendation should update.

If the user saves ₹100:

Wallet should increase by ₹100.

Goal progress should increase by the appropriate amount.

Transaction history should show:

+₹100 Today

Dashboard should reflect the new wallet balance.

If the user withdraws ₹500:

Wallet should decrease by ₹500.

Transaction history should show:

-₹500 Withdrawal

All connected screens must use the same underlying state.

Use local/session persistence where practical so refreshing the prototype does not unnecessarily reset the demo state.

33. DEMO MODE

Create a realistic demo experience.

If no user data has been entered yet, initialize with realistic sample data.

Allow the hackathon presenter to demonstrate:

Login

Onboarding

Financial profile

Savings plan

Dashboard

Daily income

Adaptive recommendation

Saving action

Wallet update

Goal progress

Withdrawal

Help/Anvi

Do not require real banking credentials or real money.

34. VISUAL CONSISTENCY

Every screen must belong to the same product.

Maintain:

same spacing

same typography

same button style

same card radius

same icon style

same teal/orange palette

same Anvi identity

same navigation

same interaction language

Avoid:

excessive gradients

excessive illustrations

cartoon graphics

huge text

clutter

unnecessary financial jargon

too many buttons

black backgrounds

35. REQUIRED USER JOURNEY

The primary happy-path journey must work completely:

Splash

↓

Login / Sign Up

↓

OTP

↓

Language & Location

↓

Name

↓

Anvi Introduction

↓

Guided Tour

↓

Personal Information

↓

Financial Information

↓

Why Save

↓

Saving Goals

↓

UPI Setup

↓

Flexible Budget

↓

Main Dashboard

↓

Daily Money

↓

Savings Recommendation

↓

Savings Confirmation

↓

Wallet

↓

Goals

↓

Withdraw

↓

Help / Anvi

↓

Profile / Settings

Every arrow above must represent an actual working navigation/action.

36. FINAL QUALITY STANDARD

Before considering the build complete, test the entire application as if you are a real user.

Check:

Can the app be opened?

Can onboarding be completed?

Do inputs work?

Does OTP work?

Does language selection work?

Does the tour work?

Does the financial profile work?

Does the savings plan calculate?

Does the dashboard load?

Does Daily Money work?

Does the savings recommendation update?

Does Save work?

Does the wallet update?

Does the goal update?

Does withdrawal work?

Does Help work?

Does Profile work?

Does logout work?

Does bottom navigation work?

Do modals open and close?

Are there any dead buttons?

Are there any dead-end screens?

Are there console/runtime errors?

Does the application remain visually consistent?

Fix obvious functional issues before considering the first build complete.

MOST IMPORTANT INSTRUCTION

Prioritize the following order:

FUNCTIONALITY

USER FLOW

USABILITY

TRUST

DATA CONSISTENCY

VISUAL POLISH

Do not sacrifice functionality for visual decoration.

The final result should feel like a real Indian fintech mobile product for delivery workers, not a slideshow, design mockup, or collection of disconnected screens.

Build the complete functional prototype now.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3ff93af7-5c10-492c-b194-d37711f98189).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
