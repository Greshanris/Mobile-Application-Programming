import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView } from "react-native";

type Props = {
  visible: boolean;
  searchQuery: string;
  onChangeSearchQuery: (v: string) => void;
  filterLocation: string;
  onChangeFilterLocation: (v: string) => void;
  onClose: () => void;
};

export default function FilterModal({ visible, searchQuery, onChangeSearchQuery, filterLocation, onChangeFilterLocation, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <ScrollView style={styles.modalContent} scrollEnabled>
          <Text style={styles.modalTitle}>Search Services</Text>
          <TextInput style={styles.input} placeholder="Search..." value={searchQuery} onChangeText={onChangeSearchQuery} />
          <TextInput style={styles.input} placeholder="Filter by Location (e.g., Kathmandu)" value={filterLocation} onChangeText={onChangeFilterLocation} />
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.btnText}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(31, 122, 140, 0.8)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 24, width: "85%", borderWidth: 1, borderColor: "#022B3A" },
  modalTitle: { color: "#022B3A", fontSize: 18, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  input: { backgroundColor: "#E6ECEA", color: "#022B3A", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12, borderWidth: 1, borderColor: "#1F7A8C" },
  cancelBtn: { backgroundColor: "#6B7280", borderRadius: 8, padding: 10, alignItems: "center" },
  btnText: { color: "#FFFFFF", fontWeight: "bold" },
});
