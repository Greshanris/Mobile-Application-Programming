import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from "react-native";

type Props = {
  visible: boolean;
  title: string;
  onChangeTitle: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export default function EditServiceModal({ visible, title, onChangeTitle, onClose, onSave }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} style={{ flex: 1 }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Service</Text>
            <TextInput style={styles.input} value={title} onChangeText={onChangeTitle} placeholder="Title" />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createBtn} onPress={onSave}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(31, 122, 140, 0.8)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 24, width: "85%", borderWidth: 1, borderColor: "#022B3A" },
  modalTitle: { color: "#022B3A", fontSize: 18, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  input: { backgroundColor: "#E6ECEA", color: "#022B3A", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12, borderWidth: 1, borderColor: "#1F7A8C" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  cancelBtn: { backgroundColor: "#6B7280", borderRadius: 8, padding: 10, flex: 1, marginRight: 8, alignItems: "center" },
  createBtn: { backgroundColor: "#022B3A", borderRadius: 8, padding: 10, flex: 1, marginLeft: 8, alignItems: "center" },
  btnText: { color: "#FFFFFF", fontWeight: "bold" },
});
