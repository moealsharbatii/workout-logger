import { describe, expect, it } from '@jest/globals';
import { formatSet, LoggedSet, MAX_SETS_AT_ONCE, setNumber, validateSet, groupByExercise } from './sets';

const valid = { exercise: 'Squat', weight: '140', reps: '5', rpe: '8', sets: '1' };

describe('validateSet', () => {
  it('accepts a normal set and converts text to numbers', () => {
    expect(validateSet(valid)).toEqual({
      ok: true,
      set: { exercise: 'Squat', weightKg: 140, reps: 5, rpe: 8 },
      count: 1,
    });
  });

  it('trims spaces around the exercise name', () => {
    const result = validateSet({ ...valid, exercise: '  Bench press ' });
    expect(result.ok && result.set.exercise).toBe('Bench press');
  });

  it.each(['', '   '])('rejects an empty exercise: %p', (exercise) => {
    expect(validateSet({ ...valid, exercise }).ok).toBe(false);
  });

  it.each([
    ['0', true],
    ['2.5', true],
    ['-1', false],
    ['', false],
    ['abc', false],
  ])('weight %p accepted: %p', (weight, accepted) => {
    expect(validateSet({ ...valid, weight }).ok).toBe(accepted);
  });

  it.each([
    ['1', true],
    ['0', false],
    ['2.5', false],
    ['', false],
  ])('reps %p accepted: %p', (reps, accepted) => {
    expect(validateSet({ ...valid, reps }).ok).toBe(accepted);
  });

  it.each([
    ['1', true],
    ['7.5', true],
    ['10', true],
    ['0.5', false],
    ['10.5', false],
    ['7.3', false],
    ['', false],
  ])('RPE %p accepted: %p', (rpe, accepted) => {
    expect(validateSet({ ...valid, rpe }).ok).toBe(accepted);
  });

  it.each([
    ['1', true],
    ['3', true],
    [String(MAX_SETS_AT_ONCE), true],
    [String(MAX_SETS_AT_ONCE + 1), false],
    ['0', false],
    ['1.5', false],
    ['', false],
  ])('sets %p accepted: %p', (sets, accepted) => {
    expect(validateSet({ ...valid, sets }).ok).toBe(accepted);
  });

  it('returns how many sets to log', () => {
    const result = validateSet({ ...valid, sets: '3' });
    expect(result.ok && result.count).toBe(3);
  });
});

describe('setNumber', () => {
  const make = (exercise: string): LoggedSet => ({
    id: exercise + Math.random(),
    exercise,
    weightKg: 100,
    reps: 5,
    rpe: 8,
  });

  it('numbers sets separately for each exercise', () => {
    const sets = [make('Squat'), make('Bench'), make('Squat'), make('Squat')];
    expect(sets.map((_, i) => setNumber(sets, i))).toEqual([1, 1, 2, 3]);
  });

  it('counts exercise names the same regardless of capitals', () => {
    const sets = [make('Squat'), make('squat')];
    expect(setNumber(sets, 1)).toBe(2);
  });
});

describe('formatSet', () => {
  it('shows weight, reps and RPE', () => {
    const set: LoggedSet = {
      id: '1',
      exercise: 'Squat',
      weightKg: 140,
      reps: 5,
      rpe: 8
    };
    expect(formatSet(set, 2)).toBe('Set 2: 140 kg × 5 @ RPE 8');
  });
});

describe('groupByExercise', () => {
  const make = (exercise: string): LoggedSet => ({
    id: exercise + Math.random(),
    exercise,
    weightKg: 100,
    reps: 5,
    rpe: 8,
  });

  it('returns no groups for no sets', () => {
    expect(groupByExercise([])).toEqual([]);
  });

  it('groups a superset by exercise', () => {
    const sets = [make('Row'), make('Press'), make('Row'), make('Press')];
    const groups = groupByExercise(sets);

    expect(groups.length).toBe(2);
    expect(groups[0].exercise).toBe('Row');
    expect(groups[0].sets.length).toBe(2);
    expect(groups[1].exercise).toBe('Press');
    expect(groups[1].sets.length).toBe(2);
  })

  it('group exercises with same name/different capitalization', () => {
    const sets = [make('Squat'), make('squat')];
    const groups = groupByExercise(sets);

    expect(groups.length).toBe(1);
    expect(groups[0].exercise).toBe('Squat');
    expect(groups[0].sets.length).toBe(2);
  })

  it('group exercises by order of first appearance', () => {
    const sets = [make('Bench'), make('Squat'), make('Bench')];
    const groups = groupByExercise(sets);

    expect(groups.length).toBe(2);
    expect(groups[0].exercise).toBe('Bench');
    expect(groups[1].exercise).toBe('Squat');
  })
});

