# UI/UX Specification
# Dementia Memory & Puzzle App

**Document Type:** UI/UX Specification  
**Purpose:** Implementation guide for Devin  
**Application:** Dementia Memory & Puzzle App  
**Framework:** Next.js  
**Target:** Polished MVP  
**Primary Device:** Tablet / iPad  
**Secondary Devices:** Mobile phone and desktop  
**Primary Language:** English  
**Design Direction:** Calm, friendly, professional

---

# 1. DOCUMENT PURPOSE

This document defines the UI/UX requirements for the Dementia Memory & Puzzle App.

This document should be used together with the Product Requirements Document (PRD).

The PRD and this document should be treated as the primary sources of truth for the product's user experience.

The goal is to create a simple, accessible application where older adults can complete short memory games and puzzles independently while authorized caregivers and professionals can review meaningful activity and performance trends.

The application must follow these core principles:

1. Observe, don't diagnose.
2. Encourage, don't punish.
3. Optimize for independence.
4. Privacy by default.

Devin should not add major features, change the user experience, or change the product's purpose without approval.

---

# 2. PRODUCT OVERVIEW

The application has three user roles:

## User A: Older Adult / Player

An older adult who uses the application to complete simple memory games and puzzles.

The player experience should be:

- Simple
- Calm
- Accessible
- Encouraging
- Easy to understand
- Easy to navigate
- Designed for independence

The player should not be overwhelmed by statistics or complicated analytics.

---

## User B: Family / Close Friend Caregiver

A caregiver who wants to understand how the player's game activity and performance change over time.

Caregivers can:

- Connect to players
- View recent sessions
- View historical trends
- Review game-specific performance
- Review activity frequency
- Generate reports
- Export data
- Configure notifications

---

## User C: Professional Caregiver / Clinician

An authorized professional who can review information provided by a player or caregiver.

Professionals can:

- View multiple players
- Search players
- Filter players
- View recent activity
- View session details
- Review historical trends
- Generate reports
- Export data

---

# 3. V1 SCOPE

## 3.1 Player Features

V1 should include:

- Welcome screen
- About page
- Login
- Caregiver access-code login
- Player onboarding
- Accessibility setup
- Optional caregiver connection
- Today's Activities
- Memory Match
- Picture Recall
- Sequence Game
- Game instructions
- Voice instructions
- Instruction replay
- Pause
- Skip
- Exit confirmation
- Completion screen
- My Progress
- Settings
- Help

---

## 3.2 Caregiver Features

V1 should include:

- Login
- Account creation
- Password reset
- Player connection
- Player creation
- Player list
- Player overview
- Recent sessions
- Individual session details
- Performance trends
- Game-specific trends
- Historical baseline
- Descriptive insights
- PDF reports
- Data export
- Settings
- Notifications

---

## 3.3 Professional Features

V1 should include:

- Professional login
- Multi-player dashboard
- Player search
- Player filtering
- Player selection
- Player overview
- Session details
- Trends
- Reports
- Export
- Settings

---

# 4. FEATURES DEFERRED FROM V1

Do not implement the following unless specifically approved:

- Medical diagnosis
- Population "normal" comparisons
- AI-based medical interpretation
- Advanced AI analysis
- Sound-based Sequence Game
- Two-factor authentication
- Advanced automated reporting
- Complex clinical workflows
- Offline mode

The V1 should prioritize a polished and accessible core experience rather than a large number of advanced features.

---

# 5. DESIGN PRINCIPLES

## 5.1 Observe, Don't Diagnose

The application measures game behavior.

It must not turn game performance into a medical diagnosis.

The application should never tell a player or caregiver that game performance proves or suggests that the player has dementia or another medical condition.

---

## 5.2 Encourage, Don't Punish

A poor game result should never make the player feel that they have failed as a person.

Avoid:

- Punitive sounds
- Harsh colors
- Large "WRONG" messages
- Negative point deductions shown to the player
- Shame-based language
- Competitive rankings

Preferred language:

- "Not quite. Let's try again."
- "Good effort."
- "Let's try one more time."
- "Great job completing today's activity."

---

## 5.3 Optimize for Independence

The player should require as little caregiver assistance as possible.

Instructions should be:

- Clear
- Short
- Available as text
- Available through voice
- Replayable

---

## 5.4 Privacy by Default

Cognitive-performance information should be treated as sensitive personal information.

Only authorized users should be able to access player information.

Notifications should not expose sensitive performance information.

---

# 6. VISUAL DESIGN

## 6.1 Overall Style

The application should feel:

- Calm
- Friendly
- Professional
- Warm
- Trustworthy
- Simple

Avoid making the app look:

- Childish
- Overly medical
- Overly clinical
- Gamified like a mobile game
- Visually overwhelming

---

# 7. COLOR DIRECTION

Primary visual direction:

- Warm cream background
- Deep green primary color
- Very dark text
- Muted green/gray secondary colors
- White/light cards

The interface should use color sparingly.

Color must never be the only way important information is communicated.

All important text and controls must meet appropriate accessibility contrast requirements.

---

# 8. TYPOGRAPHY

Primary font:

**Inter**

Use appropriate fallback fonts for localization.

Recommended minimum sizes:

| Element | Recommended Size |
|---|---:|
| Body text | 18px |
| Important instructions | 20–24px |
| Page titles | 28–36px |
| Buttons | 18–22px |
| Game content | Larger when appropriate |

Typography should prioritize readability.

Do not reduce font size simply to fit more content on a screen.

Recommended weights:

- Body: Regular
- Secondary text: Regular
- Buttons: Semi-bold
- Headings: Semi-bold/Bold
- Important instructions: Semi-bold

---

# 9. ACCESSIBILITY

Target accessibility standard:

**WCAG 2.2 AA**

The application should support:

- Keyboard navigation
- Visible focus states
- Semantic HTML
- Screen-reader labels
- Sufficient contrast
- Accessible buttons
- Accessible form fields
- Reduced motion
- Large touch targets
- Large text
- Voice instructions
- No color-only communication

Interactive elements should generally have a minimum touch target of approximately 44x44px.

Important player controls can be larger.

---

# 10. DEVICE AND RESPONSIVE DESIGN

The design priority is:

1. Tablet / iPad
2. Mobile phone
3. Desktop

The application must be responsive.

---

## 10.1 Tablet

Tablet should be considered the primary player device.

The player interface should use the available screen space without becoming visually overwhelming.

---

## 10.2 Mobile

The application should work comfortably on modern phones.

Important controls should remain easy to tap.

Do not require precision tapping.

---

## 10.3 Desktop Player

The player experience should not stretch across the entire desktop screen.

Use a comfortable maximum content width and center the player experience.

---

## 10.4 Desktop Caregiver / Professional

Caregiver and professional dashboards should take advantage of larger screens.

Use:

- Sidebar navigation
- Cards
- Charts
- Tables
- Filters

---

# 11. ORIENTATION

Support:

- Portrait
- Landscape

Game layouts should adapt to the available screen dimensions.

---

# 12. PLAYER NAVIGATION

The player should have simple bottom navigation.

Recommended:

- Home
- Progress
- Settings

The Help button remains separate and persistent.

Do not introduce complicated navigation.

---

# 13. PERSISTENT HELP BUTTON

The Help button should remain accessible throughout the player experience.

Position:

**Lower-right corner**

The Help button should:

- Be easy to see
- Be easy to tap
- Be large enough for older adults
- Not dominate the interface
- Remain visually consistent throughout the application

Help should contain:

- Hear instructions again
- Contact caregiver
- Contact support
- Frequently asked questions
- Explain how scores work
- Report a technical problem

---

# 14. WELCOME SCREEN

Purpose:

Introduce the application without overwhelming the user.

Suggested layout:

    Memory & Puzzle

    Simple activities to keep your mind active.

    [ Get Started ]

    [ I Already Have an Account ]

    About Memory & Puzzle

The page should have:

- Calm background
- Simple logo placeholder
- Large typography
- Clear primary CTA
- Minimal decoration

---

# 15. ABOUT PAGE

The About page should explain:

- What the application is
- What the games are for
- That the application tracks game activity
- That performance does not constitute a medical diagnosis

Suggested messaging:

"Memory & Puzzle provides short memory games and puzzles designed to be simple, engaging, and easy to use."

Additional explanation:

"Your activities help track how you perform in the games over time."

Important disclaimer:

"Game performance is not a diagnosis of dementia or another medical condition."

Primary CTA:

    [ Get Started ]

---

# 16. AUTHENTICATION

Use real authentication for V1.

The authentication system should support:

- Email/password
- Password reset
- Email verification where appropriate
- Caregiver-assisted login
- Player access-code login

Devin may choose the appropriate production-ready authentication technology for the Next.js stack.

Do not build insecure custom password authentication.

---

# 17. CAREGIVER / PROFESSIONAL LOGIN

Suggested layout:

    Welcome back

    Email
    [________________________]

    Password
    [________________________]

    [ Log In ]

    Forgot password?

    Don't have an account?
    [ Create Account ]

Inputs should have:

- Clear labels
- Large text
- Large touch targets
- Accessible error states
- Password visibility toggle

---

# 18. PLAYER LOGIN

The player should have a simplified authentication experience.

Suggested layout:

    Welcome back

    [ Log In ]

    or

    [ Enter Caregiver Code ]

The player should not be forced through a complicated authentication flow.

---

# 19. CAREGIVER CONNECTION

Caregiver connection should use a simple access-code system.

Example player screen:

    Connect a Caregiver

    Give this code to your caregiver:

    482 731

    This code expires in 24 hours.

The caregiver enters the code from their account.

The system must verify that the caregiver is authorized to connect.

---

# 20. PLAYER CREATION

Caregivers should be able to create a player.

Required:

- First name

Optional:

- Last name
- Profile picture
- Preferred language
- Accessibility preferences

Do not require unnecessary personal information.

After creating a player, provide an access code that can be used to connect the player.

---

# 21. FIRST-TIME PLAYER ONBOARDING

Recommended flow:

    Welcome
       ↓
    Explain the application
       ↓
    Optional caregiver connection
       ↓
    Accessibility preferences
       ↓
    Home screen
       ↓
    First activity

Do not automatically launch a game immediately after onboarding.

Show the player the home screen first.

---

# 22. ACCESSIBILITY PREFERENCES

Allow the player/caregiver to configure:

- Text size
- Contrast
- Animation level
- Sound
- Music
- Voice instructions
- Instruction repetition
- Touch sensitivity where technically feasible
- Notifications
- Language

---

## 22.1 Text Size

Provide:

- Standard
- Large
- Extra Large

Show a text preview.

---

## 22.2 Contrast

Provide:

- Standard
- High Contrast

The application should maintain appropriate contrast regardless of setting.

---

## 22.3 Voice Instructions

Provide:

- Voice instructions ON/OFF
- Voice speed

Options:

- Slow
- Normal
- Fast

---

## 22.4 Sound

Provide:

- Sound effects ON/OFF
- Music ON/OFF

Music should be optional and should never interfere with instructions.

---

## 22.5 Animation

Provide animation preferences.

Support reduced-motion behavior.

Avoid excessive animation throughout the application.

---

# 23. PLAYER HOME SCREEN

The home screen should answer one question:

**"What should I do next?"**

Suggested layout:

    Good morning, Sarah!

    Ready for today's activity?

    ┌─────────────────────────────┐
    │ Recommended                 │
    │                             │
    │ Memory Match                │
    │ About 5 minutes             │
    │                             │
    │ [ Start Activity ]          │
    └─────────────────────────────┘

    Other Activities

    [ Picture Recall ]

    [ Sequence Game ]

    Hear Instructions

    My Progress

    Settings

The recommended activity should be visually prominent.

The player can still choose another activity.

---

# 24. ACTIVITY RECOMMENDATIONS

The application may recommend an activity.

Recommendations should not feel mandatory.

If a player chooses a different activity, do not make them feel that they made a bad decision.

Preferred:

"That's okay. You can choose another activity."

Avoid:

"You should complete the recommended activity first."

---

# 25. GAME FRAMEWORK

V1 includes:

1. Memory Match
2. Picture Recall
3. Sequence Game

Each game must have different difficulty levels.

Difficulty changes must be recorded.

Difficulty should be considered when interpreting analytics.

---

# 26. GAME INSTRUCTIONS

Every game should provide:

- Written instructions
- Voice instructions
- Replay instructions

Example:

    Find the matching pairs.

    [ Hear Instructions Again ]

    [ Start ]

Instructions should be short and easy to understand.

---

# 27. MEMORY MATCH

The player matches pairs of cards.

The system records:

- Accuracy
- Attempts
- Completion time
- Hints used
- Errors
- Difficulty
- Completion status

---

## 27.1 Memory Match Difficulty

Recommended V1 levels:

| Difficulty | Cards | Pairs |
|---|---:|---:|
| Easy | 4 | 2 |
| Medium | 8 | 4 |
| Hard | 12 | 6 |

Do not start with an unnecessarily large card grid.

---

## 27.2 Memory Match Interaction

Player taps two cards.

If incorrect:

- Cards remain visible briefly
- Approximately 1 second
- Cards flip back

If correct:

- Provide subtle positive feedback
- Keep matched cards visible

Avoid punitive sounds or animations.

---

## 27.3 Memory Match Hints

Hints should be available.

Hints should not make the player feel punished.

The system records:

    hintsUsed

The player does not need to see a numerical penalty for using hints.

---

# 28. PICTURE RECALL

The player views several objects and later identifies which objects were shown.

The system records:

- Correct answers
- Incorrect answers
- Response time
- Hints used
- Difficulty
- Completion status

---

## 28.1 Picture Recall Difficulty

Recommended:

| Difficulty | Objects Remembered | Choices |
|---|---:|---:|
| Easy | 3 | 6 |
| Medium | 4 | 8 |
| Hard | 6 | 10 |

---

## 28.2 Picture Viewing

Do not force a countdown for the player.

Suggested:

    Take your time looking at these pictures.

    When you're ready:

    [ I'm Ready ]

This avoids unnecessary time pressure.

---

## 28.3 Picture Labels

At easier difficulty levels, images should include labels.

Example:

    [ IMAGE ]

    Apple

Higher difficulty levels can eventually reduce or remove labels.

---

## 28.4 Picture Answering

Recommended interaction:

    Select all

    [ Check My Answers ]

Do not immediately reveal whether every individual selection is correct.

---

# 29. SEQUENCE GAME

V1 should use a visual sequence.

Example:

    Watch carefully.

    ● → ■ → ▲

Then:

    Now repeat the sequence.

The player taps the corresponding shapes/colors.

---

## 29.1 Sequence Difficulty

Recommended:

| Difficulty | Sequence Length |
|---|---:|
| Easy | 3 |
| Medium | 4–5 |
| Hard | 6–8 |

After an incorrect attempt, provide another attempt.

Do not immediately end the game after one mistake.

---

# 30. SOUND SEQUENCE

Sound-based sequence gameplay is deferred from V1.

Do not implement sound-based sequences unless specifically approved.

---

# 31. GAME RANDOMIZATION

Game content should be randomized.

Randomization must not unintentionally change difficulty.

Example:

Two Medium Memory Match sessions can use different card arrangements while still being Medium difficulty.

---

# 32. ADAPTIVE DIFFICULTY

V1 should use a simple rule-based adaptive difficulty system.

Conceptually:

    Strong performance
           ↓
    Increase difficulty

    Expected performance
           ↓
    Maintain difficulty

    Consistent difficulty problems
           ↓
    Reduce difficulty

Do not use an AI model for V1 adaptive difficulty.

The exact thresholds should be documented in the implementation.

Difficulty changes must be recorded.

---

# 33. PLAYER-FACING DIFFICULTY LANGUAGE

Do not tell the player:

"You have been moved from Level 2 to Level 3."

Instead use:

- "Ready for a new challenge?"
- "Let's try something new."

Detailed difficulty information belongs primarily in caregiver analytics.

---

# 34. PAUSE

Players should be able to pause activities.

Suggested screen:

    Activity Paused

    Take your time.

    [ Continue ]

    [ Exit Activity ]

Pausing should not automatically count as failure.

---

# 35. EXITING AN UNFINISHED GAME

If a player attempts to leave an unfinished activity:

    Are you sure?

    Your activity isn't finished yet.

    [ Continue Activity ]

    [ Exit ]

Only use this type of confirmation for leaving an unfinished activity.

---

# 36. SKIPPING

Players should be allowed to skip activities.

Suggested wording:

    Skip this activity

After skipping:

    That's okay. You can choose another activity.

Do not use punitive language.

---

# 37. SESSION STATUS

Track:

- Completed
- Skipped
- Exited early
- Interrupted

An interrupted game should not automatically be classified as a failure.

---

# 38. GAME COMPLETION

Completion screen:

    Great job, Sarah!

    You completed today's
    memory activity.

    Come back tomorrow for
    another activity.

    [ Back to Activities ]

    [ Choose Another Activity ]

Do not display negative interpretations.

Do not tell the player that their memory has declined.

Do not compare the player to "normal" performance.

---

# 39. PLAYER PROGRESS

The player's Progress section should remain simple.

Avoid:

- Complex analytics
- Population comparisons
- Percentile rankings
- Medical interpretations
- Large amounts of numerical data

Example:

    Your Progress

    You've completed
    12 activities.

    Keep up the great work!

    [ View Activities ]

Detailed analytics belong primarily to caregivers and professionals.

---

# 40. CAREGIVER NAVIGATION

Recommended caregiver navigation:

    Dashboard
    Players
    Reports
    Settings
    Help
    Sign Out

Use a sidebar on larger screens.

Use a mobile-friendly navigation solution on small screens.

---

# 41. CAREGIVER DASHBOARD

Example:

    Dashboard

    Sarah

    Last active
    Today

    Activities
    18 completed

    This week
    4 activities

    -------------------------

    Recent Activity

    Memory Match       Today
    Picture Recall     Yesterday
    Sequence           Aug 24

    -------------------------

    Performance

    [ View Trends ]

    [ View Game Details ]

    [ Generate Report ]

---

# 42. PLAYER LIST

Caregivers can have multiple players.

Example:

    Your Players

    Sarah
    Last active: Today

    Robert
    Last active: Yesterday

    Maria
    Last active: Aug 24

    [ + Add Player ]

---

# 43. PLAYER SWITCHER

Caregivers/professionals with multiple players should have a quick player switcher.

Example:

    Sarah ▼

Opening the control displays:

    Sarah
    Robert
    Maria

---

# 44. PROFESSIONAL DASHBOARD

Professionals should have a dashboard designed for multiple players.

Example:

    Professional Dashboard

    Patients

    [ Search by name ]

    Sarah Lee
    John Smith
    Robert Davis
    Maria Garcia

Provide:

- Search
- Filtering
- Sorting
- Player selection

---

# 45. SESSION DETAIL

Caregivers/professionals should be able to open individual sessions.

Example:

    Memory Match

    August 27, 2026

    Completed

    Difficulty
    Medium

    Time
    4:12

    Accuracy
    87%

    Attempts
    15

    Hints
    1

    Errors
    2

Include difficulty alongside performance information.

---

# 46. PERFORMANCE TRENDS

Caregivers/professionals should be able to view performance over:

- Week
- Month
- 3 months
- 6 months
- Year
- All time

Metrics may include:

- Accuracy
- Completion time
- Attempts
- Hints
- Activity frequency

Filters should include:

- All games
- Memory Match
- Picture Recall
- Sequence

---

# 47. HISTORICAL BASELINE

The system should prioritize the player's own historical performance rather than population norms.

Initial baseline should be established after:

**5 valid completed sessions for the relevant game.**

Each game should have its own baseline.

Example:

    Memory Match

    Current
    72%

    Historical baseline
    78%

Before enough data exists:

    We're still learning this player's
    typical performance.

Baseline should be clearly explained.

---

# 48. DIFFICULTY IN ANALYTICS

Difficulty should always be associated with performance data.

Example:

    January
    Easy
    90%

    February
    Medium
    82%

    March
    Hard
    75%

The system should not automatically describe this as decline because difficulty increased.

---

# 49. PERFORMANCE CHANGES

The system should not react to one isolated poor session.

Meaningful changes should be based on persistent changes across multiple sessions.

Possible descriptive message:

"Recent performance has differed from the player's historical activity across several sessions."

Never:

"Sarah's memory is declining."

---

# 50. DESCRIPTIVE INSIGHTS

The application may generate descriptive observations.

Allowed:

"Average completion time has increased over the past four weeks."

Allowed:

"Sarah completed 8 activities this month compared with 5 last month."

Not allowed:

"Sarah may be developing dementia."

Not allowed:

"Sarah's memory is declining."

Not allowed:

"Sarah shows signs of cognitive impairment."

---

# 51. GLOBAL MEDICAL LANGUAGE RESTRICTION

This is a hard product constraint.

The application must never generate medical diagnoses or imply a diagnosis based on game performance.

Do not use:

- "You have dementia."
- "You may have dementia."
- "Your memory is declining."
- "You show signs of cognitive impairment."
- "You performed below normal."
- "You are at risk for dementia."

Game performance is observational information, not a medical diagnosis.

This restriction applies to:

- Player screens
- Caregiver screens
- Professional screens
- Reports
- Notifications
- Future AI-generated text
- Automated summaries

---

# 52. V1 AI BOUNDARY

V1 should not use AI to diagnose or medically analyze cognitive performance.

Adaptive difficulty should be rule-based.

Analytics should be descriptive.

AI may potentially be introduced later for descriptive summaries, but it must still follow the medical-language restriction.

---

# 53. REPORTS

Caregivers and professionals can generate reports.

Reports should contain:

- Player
- Reporting period
- Activities completed
- Game-specific performance
- Accuracy
- Completion time
- Activity frequency
- Relevant trends
- Difficulty context
- Historical baseline when available

Reports should contain the following disclaimer:

"Game performance is not a diagnosis of dementia or another medical condition."

V1 report format:

**PDF**

---

# 54. DATA EXPORT

Caregivers and authorized professionals can export appropriate player data.

Exports must respect:

- Permissions
- Privacy
- Account access
- Player connections

---

# 55. PLAYER SETTINGS

Player settings should include:

- Text size
- Sound
- Voice instructions
- Contrast
- Notifications
- Language
- Animation
- Music
- Instruction repetition
- Account
- Privacy

---

# 56. CAREGIVER SETTINGS

Caregiver settings should include:

- Player connections
- Notifications
- Reporting
- Account/security
- Export
- Delete account

---

# 57. PRIVACY

Cognitive-performance information should be treated as sensitive information.

Only authorized users should be able to view it.

Notifications should not reveal detailed cognitive-performance information.

Bad notification:

"Sarah's memory performance dropped 15%."

Better notification:

"A new activity update is available."

---

# 58. CAREGIVER DISCONNECTION

Disconnecting a caregiver should:

- Remove that caregiver's access
- Preserve historical player data

Disconnecting a caregiver should not automatically delete player history.

---

# 59. ACCOUNT DELETION

Deleting an account should require confirmation.

Example:

    Delete Account

    This will permanently delete:

    • Your account
    • Your game history
    • Your settings
    • Your caregiver connections

    This cannot be undone.

    [ Cancel ]

    [ Delete My Account ]

The deletion behavior should be implemented consistently across the application.

---

# 60. LOADING STATES

Never show completely blank screens while data is loading.

Examples:

    Loading your activities...

    Loading Sarah's activity...

Loading states should be simple and reassuring.

Avoid technical messages.

---

# 61. ERROR STATES

Example:

    Something went wrong.

    We couldn't load your activities.

    Please check your internet connection
    and try again.

    [ Try Again ]

    [ Get Help ]

Do not expose technical error codes to ordinary users.

---

# 62. EMPTY STATES

Example:

    No players connected yet.

    Connect a player to start viewing
    their activity.

    [ + Connect Player ]

Every empty state should explain what happened and provide a clear next action.

---

# 63. FIRST-TIME CAREGIVER

After creating a caregiver account, provide a clear first action.

Example:

    Add Your First Player

The caregiver should not initially see an empty dashboard with no guidance.

---

# 64. FIRST-TIME PLAYER

After completing onboarding:

1. Show the home screen.
2. Highlight the recommended activity.
3. Allow the player to choose an activity.

Do not automatically force the player into a game.

---

# 65. OFFLINE FUNCTIONALITY

Offline mode is not part of V1.

The application may require an internet connection.

---

# 66. DATABASE

Use a production-ready relational database.

The exact database technology can be selected by Devin based on the Next.js architecture.

Conceptual structure:

    User
     ├── Player Profile
     └── Caregiver Profile

    Player
     ├── Sessions
     ├── Settings
     └── Caregiver Connections

    Game Session
     ├── Game
     ├── Difficulty
     ├── Performance
     └── Completion Status

---

# 67. SESSION DATA

Every completed game session should store:

- Player ID
- Game type
- Game version
- Difficulty level
- Date/time
- Duration
- Score
- Accuracy
- Number of attempts
- Hints used
- Skips
- Errors
- Response-time statistics
- Completion status
- Device/app version

---

# 68. SCORE

The system should internally calculate a standardized score.

Possible inputs:

- Accuracy
- Completion
- Attempts
- Time
- Hints

The player should generally not see the numerical score.

Caregivers and professionals may see the score.

The scoring formula must be documented and consistent.

---

# 69. ACCURACY

Recommended definition:

    Accuracy =
    Correct responses / Total scored responses

This definition should remain consistent across sessions.

---

# 70. DIFFICULTY AND ANALYTICS

Difficulty must be associated with performance.

Analytics should account for difficulty changes.

Example:

    Easy → Medium → Hard

should not automatically be interpreted as performance decline.

---

# 71. RANDOMIZED GAME DATA

Game data should be randomized while preserving intended difficulty.

Randomization should not introduce unintended differences in difficulty.

---

# 72. DEMO / SEED DATA

During development, Devin should provide sample data so dashboards and reports can be tested.

Example development data:

    Sarah
    18 sessions
    4 this week

    Robert
    12 sessions
    3 this week

Seed data should be clearly development/test data.

---

# 73. LOCALIZATION

V1 language:

**English**

The application architecture should be localization-ready.

User-facing text should not be hard-coded in a way that makes future translation unnecessarily difficult.

---

# 74. BRANDING

Current working product name:

**Memory & Puzzle**

Treat this as a working name.

V1 logo:

**Simple placeholder**

Do not spend significant V1 development time creating an elaborate branding system.

---

# 75. LOGO DIRECTION

Future branding should be:

- Simple
- Calm
- Friendly
- Related to memory/puzzles
- Not overly medical
- Not childish

---

# 76. ANIMATION

Use gentle animations such as:

- Card flipping
- Fading
- Small success transitions
- Subtle page transitions

Avoid:

- Flashing
- Rapid movement
- Excessive confetti
- Constant motion
- Time-pressure animations

Respect reduced-motion settings.

---

# 77. MISTAKE FEEDBACK

Preferred:

"Not quite. Let's try again."

Other appropriate messages:

"Good effort. Let's try one more time."

Avoid:

"WRONG!"

Avoid punitive sound effects.

Avoid showing negative point deductions to the player.

---

# 78. CONFIRMATION DIALOG RULES

Use confirmation dialogs for:

- Account deletion
- Data deletion
- Caregiver disconnection
- Exiting an unfinished game
- Other destructive actions

Do not use confirmation dialogs for ordinary navigation.

---

# 79. PERMISSIONS

Recommended permissions:

| Capability | Player | Family Caregiver | Professional |
|---|---:|---:|---:|
| Play games | Yes | No | No |
| View own simple progress | Yes | No | No |
| View player activity | No | Yes | Yes |
| View trends | No | Yes | Yes |
| View session details | No | Yes | Yes |
| Generate reports | No | Yes | Yes |
| Export data | No | Yes | Yes |
| Manage players | No | Yes | Yes |
| Multiple players | No | Yes | Yes |
| Configure player settings | Yes | Yes | Yes |

Actual permissions must be enforced at the application/data layer.

Do not rely only on hiding UI elements.

---

# 80. RESPONSIVE NAVIGATION

## Player

Use simple bottom navigation.

Help remains persistent.

## Caregiver / Professional

Desktop:

    Sidebar
       ↓
    Main Content

Mobile:

    Menu
       ↓
    Dashboard
       ↓
    Cards
       ↓
    Charts
       ↓
    Tables

---

# 81. DEVIN IMPLEMENTATION RULE

Where this document does not define an implementation detail, Devin should use standard:

- Next.js best practices
- Accessibility best practices
- Security best practices
- Responsive design best practices
- Software engineering best practices

Devin does not need approval for minor implementation details.

---

# 82. DEVIN MAY DECIDE

Devin may independently choose:

- Component organization
- Folder structure
- CSS implementation
- Database technology
- API structure
- Internal naming conventions
- Appropriate libraries
- Exact responsive breakpoints
- Loading-state implementation
- Internal code architecture

---

# 83. DEVIN MUST NOT DECIDE WITHOUT APPROVAL

Devin must not independently add or change:

- New user-facing features
- New analytics
- Medical interpretations
- New data collection
- Major visual changes
- Permission changes
- Major navigation changes
- Major changes to the player experience
- Features outside the V1 scope

---

# 84. DO NOT DEVIATE WITHOUT APPROVAL

The following are explicit product constraints.

Do not:

- Add medical diagnoses.
- Compare players to population "normal" performance.
- Make the player experience statistics-heavy.
- Use punitive language.
- Remove the persistent Help button.
- Add aggressive animations.
- Make the interface visually overwhelming.
- Add unnecessary gamification.
- Collect unnecessary personal information.
- Change the green/cream visual direction without approval.
- Create complicated navigation.
- Expose caregiver analytics to players without approval.
- Add features outside the defined V1 scope.
- Change the fundamental player workflow without approval.

---

# 85. PRODUCT DECISION: POLISHED MVP

The goal is a **polished MVP**.

The application should be:

- Functional
- Accessible
- Visually polished
- Responsive
- Demonstrable
- Consistent

Prioritize quality of the core experience over implementing large numbers of advanced features.

---

# 86. RECOMMENDED DEVELOPMENT ORDER

Devin should build the application incrementally.

Do not attempt to implement the entire application in one giant step.

---

## Phase 1 — Player Shell

Build:

1. Welcome
2. About
3. Login
4. Onboarding
5. Accessibility setup
6. Home
7. Navigation
8. Persistent Help

---

## Phase 2 — Games

Build:

9. Memory Match
10. Picture Recall
11. Sequence Game
12. Instructions
13. Voice instructions
14. Pause
15. Skip
16. Exit confirmation
17. Completion screens

---

## Phase 3 — Data Infrastructure

Build:

18. Authentication
19. Database
20. Session tracking
21. Difficulty system
22. Adaptive difficulty
23. Player settings

---

## Phase 4 — Caregiver

Build:

24. Caregiver dashboard
25. Player connection
26. Player creation
27. Player list
28. Session details
29. Trends
30. Historical baselines
31. Descriptive insights
32. Reports
33. Export

---

## Phase 5 — Professional

Build:

34. Professional dashboard
35. Multi-player management
36. Search
37. Filtering
38. Player overview
39. Analytics
40. Reports
41. Export

---

## Phase 6 — Polish

Complete:

42. Accessibility audit
43. Responsive testing
44. Error states
45. Empty states
46. Loading states
47. Permission testing
48. Privacy testing
49. Medical-language review
50. Final UI polish

---

# 87. DEFINITION OF DONE — PLAYER

- [ ] Welcome works
- [ ] About works
- [ ] Authentication works
- [ ] Caregiver-code flow works
- [ ] Onboarding works
- [ ] Accessibility preferences work
- [ ] Home works
- [ ] Recommended activity works
- [ ] Memory Match works
- [ ] Picture Recall works
- [ ] Sequence Game works
- [ ] Difficulty works
- [ ] Difficulty is recorded
- [ ] Voice instructions work
- [ ] Instructions can be replayed
- [ ] Games can pause
- [ ] Games can be skipped
- [ ] Exit confirmation works
- [ ] Completion screens work
- [ ] Results use encouraging language
- [ ] Help is persistent
- [ ] Settings work
- [ ] Responsive layouts work

---

# 88. DEFINITION OF DONE — CAREGIVER

- [ ] Login works
- [ ] Account creation works
- [ ] Password reset works
- [ ] Player connection works
- [ ] Player creation works
- [ ] Player list works
- [ ] Player switching works
- [ ] Recent sessions work
- [ ] Session details work
- [ ] Trends work
- [ ] Difficulty is visible in analytics
- [ ] Historical baseline works
- [ ] Descriptive insights work
- [ ] PDF reports work
- [ ] Data export works
- [ ] Settings work
- [ ] Permissions work

---

# 89. DEFINITION OF DONE — PROFESSIONAL

- [ ] Professional login works
- [ ] Multi-player dashboard works
- [ ] Search works
- [ ] Filtering works
- [ ] Player selection works
- [ ] Player switching works
- [ ] Analytics work
- [ ] Trends work
- [ ] Reports work
- [ ] Export works
- [ ] Permissions work

---

# 90. DEFINITION OF DONE — ACCESSIBILITY

- [ ] WCAG 2.2 AA target
- [ ] Keyboard navigation works
- [ ] Screen-reader support
- [ ] Visible focus states
- [ ] Appropriate contrast
- [ ] Large touch targets
- [ ] Reduced motion
- [ ] Large text options
- [ ] Voice instructions
- [ ] Responsive layouts
- [ ] No color-only communication

---

# 91. DEFINITION OF DONE — PRIVACY

- [ ] Role permissions are enforced
- [ ] Cognitive-performance data is protected
- [ ] Notifications do not expose sensitive metrics
- [ ] Account deletion works
- [ ] Caregiver disconnection removes access
- [ ] Player history is preserved when a caregiver disconnects
- [ ] Reports contain the medical disclaimer
- [ ] No unnecessary personal information is collected

---

# 92. FINAL INSTRUCTION TO DEVIN

Use this UI/UX specification and the Product Requirements Document as the primary source of truth.

Build a polished, accessible MVP in the existing Next.js application.

Before changing or creating major architecture, review the existing codebase and reuse existing components where appropriate.

Do not blindly rebuild functionality that already exists.

Build incrementally in the development phases defined above.

Do not add new product features without approval.

If an implementation detail is not specified, use standard Next.js, accessibility, security, and software-engineering best practices.

If a decision materially affects:

- UX
- Privacy
- Security
- Permissions
- Data collection
- Data structure
- Product behavior

then explain the proposed approach before making the change.

The final application should feel:

**Calm. Friendly. Professional. Accessible. Simple. Encouraging.**

Most importantly:

**The application observes game performance; it does not diagnose medical conditions.**