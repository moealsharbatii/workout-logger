export type LoggedSet = {
  id: string;
  exercise: string;
  weightKg: number;
  reps: number;
  rpe: number;
};

// What the user typed into the form. Text inputs always give strings.
// `sets` is how many identical sets to log at once, e.g. 3 x 12 on an accessory.
export type SetInput = {
  exercise: string;
  weight: string;
  reps: string;
  rpe: string;
  sets: string;
};

export const MAX_SETS_AT_ONCE = 10;

export type ValidationResult =
  | { ok: true; set: Omit<LoggedSet, 'id'>; count: number }
  | { ok: false; error: string };

export function validateSet(input: SetInput): ValidationResult {
  const exercise = input.exercise.trim();
  if (exercise === '') {
    return { ok: false, error: 'Enter an exercise.' };
  }

  const weightKg = Number(input.weight);
  if (input.weight.trim() === '' || !Number.isFinite(weightKg) || weightKg < 0) {
    return { ok: false, error: 'Weight must be a number, 0 or more.' };
  }

  const reps = Number(input.reps);
  if (!Number.isInteger(reps) || reps < 1) {
    return { ok: false, error: 'Reps must be a whole number, 1 or more.' };
  }

  const rpe = Number(input.rpe);
  const isHalfStep = Number.isInteger(rpe * 2);
  if (input.rpe.trim() === '' || !isHalfStep || rpe < 1 || rpe > 10) {
    return { ok: false, error: 'RPE must be from 1 to 10, in steps of 0.5.' };
  }

  const count = Number(input.sets);
  if (!Number.isInteger(count) || count < 1 || count > MAX_SETS_AT_ONCE) {
    return { ok: false, error: `Sets must be a whole number from 1 to ${MAX_SETS_AT_ONCE}.` };
  }

  return { ok: true, set: { exercise, weightKg, reps, rpe }, count };
}

// Which set this is for its exercise: the 1st, 2nd, 3rd squat set, and so on.
// Exercise names are compared ignoring capitals, so "squat" and "Squat" count together.
export function setNumber(sets: LoggedSet[], index: number): number {
  const exercise = sets[index].exercise.toLowerCase();
  return sets
    .slice(0, index + 1)
    .filter((set) => set.exercise.toLowerCase() === exercise).length;
}

export function formatSet(set: LoggedSet, number: number): string {
  return `Set ${number}: ${set.weightKg} kg × ${set.reps} @ RPE ${set.rpe}`;
}
