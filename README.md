# Workout Logger

A workout logging app for lifters, built with React Native, Expo and TypeScript. I'm a powerlifter and coach, and I'm building the logger I'd want to use between sets.

## What it does so far

- Log a set with exercise, weight (kg), reps and RPE
- Log several identical sets at once, for accessories like 3 × 12
- Sets are numbered per exercise, ignoring capitals, so "squat" and "Squat" count together
- Input is validated with clear messages: RPE from 1 to 10 in half steps, whole-number reps, no negative weights
- The form keeps its values after logging, so the next set only needs small edits
- Sets are grouped by exercise, so supersets stay readable, while the order they were logged is kept
- Delete a logged set from its row
- Each set is saved with the date it was logged, and the list shows only today's sets
- Sets are saved on the phone, so they're still there after closing the app
- If the saved data is ever corrupted, the app opens with an empty list instead of crashing

## How it's built

I started this project with Claude Code generating code that I reviewed. I now write the features myself, using Claude Code as a tutor, and test them on my iPhone.

## Running it

```
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone. If your phone can't connect to your computer over Wi-Fi, use a tunnel instead:

```
npx expo start --tunnel ngrok
```

## Tests

```
npm test
```

Jest tests cover the validation rules at their boundaries, invalid input, set numbering and grouping, date formatting, deleting a set, and saving and loading, including corrupted data. GitHub Actions runs the tests and a TypeScript type check on every push.

## Next up

- Workout history by date, including sets logged before dates were added
- Estimated one-rep max from weight, reps and RPE
- Rest timer
- Option to mark a superset