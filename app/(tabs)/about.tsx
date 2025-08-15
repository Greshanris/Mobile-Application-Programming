import { View, Text, StyleSheet } from "react-native";

export default function About() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About This Project</Text>
      <Text style={styles.text}>
        Local Service App lets you post and find odd services in your area. No login required!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, color: "#022B3A" },
  text: { fontSize: 16, color: "#333", textAlign: "center" },
});
