import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoggedSet } from "./sets";

const KEY = "sets"

export async function saveSets(sets: LoggedSet[]): Promise<void> {
  const text = JSON.stringify(sets)
  await AsyncStorage.setItem(KEY, text)
}

export async function loadSets(): Promise<LoggedSet[]> {
   const result = await AsyncStorage.getItem(KEY)

  if (result == null) return []
  
  return JSON.parse(result)
}