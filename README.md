# Workout Logger

A workout logging app for lifters, built with React Native, Expo and TypeScript. I'm a powerlifter and coach, and I'm building the logger I'd want to use between sets.

## What it does so far

- Log a set with exercise, weight (kg), reps and RPE
- Log several identical sets at once, for accessories like 3 × 12
- Sets are numbered per exercise, ignoring capitals, so "squat" and "Squat" count together
- Input is validated with clear messages: RPE from 1 to 10 in half steps, whole-number reps, no negative weights
- The form keeps its values after logging, so the next set only needs small edits
- Sets are grouped by exercise, so supersets stay readable, while the order they were logged is kept

## How it's built

I'm building this with Claude Code. I review every change, and test it on my iPhone. Testing on a real phone is how I found the usability issues which I will expand on more as I make more progress in this project.

The logic lives in `src/sets.ts`, separate from the screen in `App.tsx`, so it can be tested on its own.

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

31 Jest tests cover the validation rules at their boundaries, invalid input, and set numbering.

## Next up

- Save workouts on the phone, so they survive closing the app
- Workout history by date
- Estimated one-rep max from weight, reps and RPE
- Rest timer
- Option to mark a superset