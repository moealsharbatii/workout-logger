import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  formatSet,
  LoggedSet,
  validateSet,
  groupByExercise,
} from "./src/sets";

export default function App() {
  // What's currently typed in the form
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [rpe, setRpe] = useState("");
  const [setCount, setSetCount] = useState("1");

  const [error, setError] = useState("");
  const [sets, setSets] = useState<LoggedSet[]>([]);

  function logSet() {
    const result = validateSet({ exercise, weight, reps, rpe, sets: setCount });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError("");

    // One entry per set, so 3 x 12 becomes three entries.
    const now = Date.now();
    const newSets: LoggedSet[] = [];
    for (let i = 0; i < result.count; i++) {
      newSets.push({ id: `${now}-${i}`, ...result.set });
    }
    setSets([...sets, ...newSets]);

    // The form keeps its values on purpose: the next set is usually the same
    // exercise and weight, so only small edits are needed. Sets goes back to 1.
    setSetCount("1");
  }

  const sections = groupByExercise(sets).map((group) => ({
    title: group.exercise,
    data: group.sets,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's workout</Text>

      <TextInput
        style={styles.input}
        placeholder="Exercise (e.g. Squat)"
        value={exercise}
        onChangeText={setExercise}
      />
      <View style={styles.row}>
        <LabelledInput
          label="kg"
          value={weight}
          onChange={setWeight}
          keyboard="decimal-pad"
        />
        <LabelledInput
          label="Reps"
          value={reps}
          onChange={setReps}
          keyboard="number-pad"
        />
        <LabelledInput
          label="RPE"
          value={rpe}
          onChange={setRpe}
          keyboard="decimal-pad"
        />
        <LabelledInput
          label="Sets"
          value={setCount}
          onChange={setSetCount}
          keyboard="number-pad"
        />
      </View>

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.button} onPress={logSet}>
        <Text style={styles.buttonText}>Log set</Text>
      </Pressable>

      <SectionList
        sections={sections}
        keyExtractor={(set) => set.id}
        renderSectionHeader={({ section }) => (
          <Text style={styles.setExercise}>{section.title}</Text>
        )}
        renderItem={({ item, index }) => (
          <View style={styles.setRow}>
            <Text>{formatSet(item, index + 1)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No sets logged yet.</Text>
        }
      />

      <StatusBar style="auto" />
    </View>
  );
}

// A small number box with its label above it, used for kg, reps, RPE and sets.
function LabelledInput(props: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  keyboard: "decimal-pad" | "number-pad";
}) {
  return (
    <View style={styles.small}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        style={styles.input}
        keyboardType={props.keyboard}
        value={props.value}
        onChangeText={props.onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 64,
    paddingHorizontal: 16,
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  row: { flexDirection: "row", gap: 8 },
  small: { flex: 1 },
  label: { fontSize: 12, color: "#555", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  error: { color: "#c62828", marginBottom: 8 },
  button: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  setRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  setExercise: { fontWeight: "600" },
  empty: { color: "#888", marginTop: 8 },
});
