# Onboarding Wizard Redesign

## Context

The current initial configuration flow renders `/onboarding` as a long page with all fields visible. This feels heavy and unprofessional for a first-time teacher experience.

The application already blocks incomplete users through `RequireAuth`, which redirects authenticated users with `onboardingComplete === false` or `profileRequired === true` to `/onboarding`. The backend already exposes `POST /auth/onboarding/complete`, and the frontend already has `completeOnboarding(input)`.

## Goal

Replace the long onboarding page with a centered, step-by-step wizard modal. The user should feel welcomed and guided, while the rest of the app remains unavailable until the minimum setup is complete.

## Non-Goals

- Do not create a new backend draft-onboarding persistence model.
- Do not duplicate onboarding fields in a second form.
- Do not allow access to the dashboard before completion.
- Do not redesign the whole dashboard or auth system.

## UX Design

`OnboardingPage` becomes a full-screen onboarding shell:

- The background shows a dashboard-like preview with cards, navigation, and header elements.
- The background is blurred and dimmed to communicate that the system is locked.
- A centered modal contains the wizard.
- The modal stays compact, with only one step visible at a time.
- The modal includes `Paso N de 5`, a horizontal progress bar, and clear navigation buttons.
- The final CTA is `Entrar a AulaBase`.

The user cannot close or bypass the wizard. Leaving `/onboarding` through app routes remains blocked by `RequireAuth`.

## Steps

### Step 1: Teacher And School

Fields:

- Teacher full name
- School name
- Regional
- District

Required:

- Teacher full name
- School name

### Step 2: Level, Shift, And Modality

Fields:

- Level: primary, secondary, or both
- Shift: morning, afternoon, night, extended, or multiple
- Modality: regular primary/secondary, adults, or other if applicable

Required:

- At least one level
- At least one shift
- At least one modality

### Step 3: School Year And Periods

Fields:

- School year name
- School year start date
- School year end date
- Academic periods
- Each period has name, start date, and end date
- The user can add or remove periods

Required:

- School year name
- Start date
- End date
- At least one complete period

### Step 4: First Course And Subject

Fields:

- Grade
- Section
- Area
- Subject/subarea
- Optional code
- A secondary action can add another course later, but the first implementation may submit only the first course because the backend already accepts a `courses` array and the existing UI only creates one course.

Required:

- Grade
- Section
- Subject/subarea

### Step 5: Confirmation

Show a concise summary:

- Teacher
- School
- Level, shift, and modality
- School year
- Periods
- First course created

The final button submits the current payload and is labeled `Entrar a AulaBase`.

## Data Flow

The wizard keeps local React state while open. It also saves a draft to `localStorage` under a scoped key such as `aulabase:onboarding-draft`.

Draft persistence behavior:

- Save after every successful `Siguiente`.
- Save on form changes using the same local state shape.
- Restore the draft when `/onboarding` mounts.
- Clear the draft after `completeOnboarding` succeeds.

The backend is called only on final submission. This avoids storing partial or invalid academic structure in the database.

## Mapping To Existing API

The final payload should continue using `CompleteOnboardingInput`:

- `fullName` from Step 1
- `school.name`, `school.regionalName`, `school.districtName` from Step 1
- `school.enabledSubsystems`, `school.schoolShift`, and `school.primaryModality` from Step 2
- `schoolYear` and `periods` from Step 3
- `courses[0]` from Step 4

If the UI captures `area`, it can be included in the subject display or local summary. The existing backend DTO does not need to change unless a persistent area field already exists in the course/subject model.

## Validation And Errors

Validation happens per step before moving forward:

- Missing required fields show small, clear messages in the current step.
- Date ranges should prevent obvious mistakes such as an end date before a start date.
- Periods must have all required fields.
- The final submit button shows a loading state while saving.
- Backend errors are shown in the modal as a short alert.

## Components

Keep the first implementation small:

- `OnboardingPage` owns the flow and draft state.
- Local helper components inside the same file can render the progress bar, field errors, and dashboard preview.
- Extract shared components only if the file becomes hard to read.

## Accessibility

- The modal uses a semantic `form` around each step or the whole wizard.
- Buttons use real `button` elements.
- Step errors are visible text near the fields.
- Keyboard navigation should work naturally through fields and buttons.
- The background is visual only and should not contain active controls.

## Testing

Manual verification:

- New first-time user lands on `/onboarding`.
- Only one step is visible at a time.
- Required field errors block progression.
- `Atras` and `Siguiente` preserve entered data.
- Refreshing the page restores the draft.
- Final submit completes onboarding and routes into the app.
- After completion, `/onboarding` redirects away automatically.

Automated verification, if time permits:

- Component-level tests for step validation and draft restore.
- Auth flow tests can remain focused on existing `completeOnboarding` service behavior.
