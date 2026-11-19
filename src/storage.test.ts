import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadSets, saveSets } from './storage';
import { LoggedSet } from './sets';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

beforeEach(async () => {
  await AsyncStorage.clear();   // every test starts with empty storage
});

describe('loadSets', () => {
  it('returns an empty list when nothing is saved', async () => {
    expect(await loadSets()).toEqual([]);
  });
    
    it('returns an empty list with corrupt data', async () => {
        const text = "{ oops";
        await AsyncStorage.setItem("sets", text);
        expect(await loadSets()).toEqual([]);
    });

    it('returns the same equal list with an identical list', async () => {
        const sets: LoggedSet[] = [
            {
                id: "1",
                exercise: "Squat",
                weightKg: 100,
                reps: 5,
                rpe: 9
            }]
        await saveSets(sets)
        expect(await loadSets()).toEqual(sets)
    })
});