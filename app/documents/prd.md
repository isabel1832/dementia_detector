# Product Requirements Document (PRD)

# Dementia Memory & Puzzle App for Senior Citizens

**Primary Users:** Older adults experiencing memory/cognitive difficulties and the family members, caregivers, or clinicians who support them.

**Goal:** Provide simple, engaging cognitive games while helping caregivers understand changes in game performance over time.

---

# 1. General Product Idea

Create a calm, highly accessible app where older adults can complete short memory games and puzzles with minimal assistance, while authorized caregivers can review meaningful performance trends.

---

# 2. Users

## User A: Older Adult / Player

An older adult who wants to play simple games independently.

---

## User B: Family / Close Friend Caregiver (Optional)

A family member who wants to understand how the user's performance changes over time.

---

## User C: Professional Caregiver / Clinician (Optional)

An authorized professional who may review information provided by a patient or caregiver.

---

# 3. User Experience

The primary player experience should follow this general flow:

1. Open app
2. See simple welcome screen
3. Log in or enter a caregiver-provided access code
4. Arrive at Today's Activities
5. Select a game
6. Hear/read instructions
7. Complete game
8. Receive encouraging feedback
9. See a simple completion summary

---

# 4. Caregiver Experience

The caregiver experience should follow this general flow:

1. Log in
2. Select a player they take care of
3. View recent sessions
4. View performance trends
5. Compare performance against the player's historical baseline
6. Review notable changes

---

# 5. Feature Requirements

## 5.1 Login & Format

The application should support:

- Large text and buttons
- High contrast
- Email/password login where appropriate
- Password reset
- Caregiver-assisted login
- Voice assistance when needed

---

# 6. First Steps After Joining

After joining the application, the user should go through:

1. Welcome Screen
2. Explanation of what the games are for
3. Optional caregiver connection
4. Accessibility preferences
5. Begin first activity

---

# 7. Accessibility Preferences

Allow the user/caregiver to configure:

- Text size
- Contrast
- Animation level
- Sound
- Music
- Voice instructions
- Instruction repetition
- Touch sensitivity where technically feasible

---

# 8. Home Screen

The player's home screen should answer one question:

> **"What should I do next?"**

Example:

> Good morning, (Name)! Ready for today's activity?

### Today's Activities

- Memory Match — 5 min
- Picture Recall — 5 min
- Word Puzzle — 5 min

### Other Options

- Hear instructions
- My progress
- Settings
- Get help

For the actual player/patient, it is best to avoid statistics or confusing numbers if they are too old.

Instead, the more detailed analytics will be sent to the caregiver.

---

# 9. Game & Puzzle Framework

## 9.1 Game Ideas

The initial game ideas include:

1. Memory Card Matching
2. Picture Recall
3. Sequence Game

---

# 10. Memory Card Matching

The player matches pairs of cards.

The app will analyze:

- Accuracy
- Number of attempts
- Completion time
- Hints used

---

# 11. Picture Recall

The player views several objects and later identifies which objects were shown.

The app will analyze:

- Correct answers
- Incorrect answers
- Response time
- Hints used

---

# 12. Sequence Game

The player reproduces a sequence of colors, shapes, numbers, or sounds after the app randomly generates an initial sequence.

The app will analyze:

- Maximum sequence length
- Accuracy
- Attempts
- Response time

---

# 13. Difficulty

The system may adjust difficulty based on previous performance.

Each game should have different difficulty levels.

Difficulty changes must be recorded so the analytics will account for the change.

---

# 14. Session Tracking

For every completed game session, store:

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

# 15. Results

## 15.1 Player-Facing Results

Results should be encouraging and simple.

Example:

> Great job! You completed today's memory activity. Come back tomorrow for another activity.

The application should **not** present the player with statements such as:

> "Your memory has declined."

or

> "You performed below normal."

---

# 16. Caregiver Screen

The caregiver gets the more detailed version of analytics.

The caregiver screen should include:

- Sessions completed
- Recent performance
- Historical trend
- Game-specific performance
- Average completion time
- Accuracy trends
- Activity frequency

---

# 17. Trends

Performance trends should be available across different time periods, such as:

- Week
- Month
- Year
- Other appropriate time ranges

The system should emphasize the individual's historical baseline instead of "normal analytics."

---

# 18. Reports

Caregivers should be able to generate a report about the player's activity and performance in the game.

The report should explicitly state that game performance is **not a diagnosis of dementia or another medical condition**.

The report could be a PDF that caregivers can print out for a physical copy of the statistics.

---

# 19. Player Settings

Player settings should include:

- Text size
- Sound
- Voice instructions
- Contrast
- Notifications
- Language

---

# 20. Caregiver Settings

Caregiver settings should include:

- Player connections
- Notifications
- Reporting
- Account/security
- Export
- Delete account

---

# 21. Help & Support

The app should provide a persistent, easily accessible **Help** option.

Features within the Help button should include:

- Replay instructions
- Contact caregiver
- Contact support
- Frequently asked questions
- Explain how scores work
- Report a technical problem

---

# 22. Product Principles

## 22.1 Observe, Don't Diagnose

The app measures game behavior.

It should not turn that information into a medical diagnosis.

---

## 22.2 Encourage, Don't Punish

A poor game result should never make the player feel that they have failed as a person.

---

## 22.3 Optimize for Independence

The ideal player experience requires as little caregiver intervention as possible.

---

## 22.4 Privacy by Default

Cognitive-performance data should be treated as sensitive personal information.