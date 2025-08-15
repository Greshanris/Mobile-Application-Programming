import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";

const expirationOptions = [
  { label: "7 days", value: 7 * 24 * 60 * 60 * 1000 },
  { label: "3 days", value: 3 * 24 * 60 * 60 * 1000 },
  { label: "1 hour", value: 1 * 60 * 60 * 1000 },
];

export type CreatePayload = {
  title: string;
  tags: string[];
  description: string;
  location: string;
  phone: string;
  price: number | null;
  barter: string | null;
  expiresAt: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (payload: CreatePayload) => Promise<void>;
};

export default function CreateServiceModal({ visible, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [price, setPrice] = useState("");
  const [barter, setBarter] = useState("");
  const [expiration, setExpiration] = useState(expirationOptions[0].value);

  const resetForm = () => {
    setTitle("");
    setTags("");
    setDescription("");
    setLocation("");
    setPhone("");
    setPrice("");
    setBarter("");
    setExpiration(expirationOptions[0].value);
  };

  const handleSubmit = async () => {
    const titleVal = title.trim();
    const barterVal = barter.trim();
    const priceVal = price.trim();
    if (!titleVal) {
      Alert.alert("Error", "Title is required");
      return;
    }
    if (!priceVal && !barterVal) {
      Alert.alert("Error", "Price or barter is required");
      return;
    }
    const parsedPrice = Number(priceVal);
    if (priceVal && (Number.isNaN(parsedPrice) || parsedPrice < 0)) {
      Alert.alert("Error", "Valid non-negative price is required");
      return;
    }
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits && phoneDigits.length < 7) {
      Alert.alert("Error", "Enter a valid phone number");
      return;
    }

    const tagsArray = tags.split(",").map((t) => t.trim()).filter(Boolean);

    await onCreate({
      title: titleVal,
      tags: tagsArray,
      description,
      location,
      phone: phoneDigits,
      price: priceVal ? parsedPrice : null,
      barter: barterVal || null,
      expiresAt: Date.now() + expiration,
    });

    resetForm();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create Service</Text>
              <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
              <TextInput style={styles.input} placeholder="Tags (comma-separated)" value={tags} onChangeText={setTags} />
              <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} multiline />
              <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
              <TextInput style={styles.input} placeholder="Phone (e.g., 9841234567)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              <TextInput style={styles.input} placeholder="Price (NPR)" value={price} onChangeText={setPrice} keyboardType="numeric" />
              <TextInput style={styles.input} placeholder="Barter (e.g., Want: English lessons)" value={barter} onChangeText={setBarter} />

              <Text style={{ color: "#fff", marginBottom: 8 }}>Expiration</Text>
              <View style={{ flexDirection: "row", marginBottom: 12 }}>
                {expirationOptions.map((opt) => (
                  <TouchableOpacity key={opt.label} style={[styles.expBtn, expiration === opt.value && styles.expBtnActive]} onPress={() => setExpiration(opt.value)}>
                    <Text style={{ color: "#fff" }}>{opt.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createBtn} onPress={handleSubmit}>
                  <Text style={styles.btnText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
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
  expBtn: { backgroundColor: "#E6ECEA", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, marginRight: 8, borderWidth: 1, borderColor: "#1F7A8C" },
  expBtnActive: { backgroundColor: "#1F7A8C", borderColor: "#014D64" },
});
