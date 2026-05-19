import { View, Text, StyleSheet } from "react-native";
import Header from "@/components/Header";

export default function AdminScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Stuff as a placeholder</Text>
        <Text style={styles.subtitle}>
          This is a placeholder for admin screen
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666" },
});
