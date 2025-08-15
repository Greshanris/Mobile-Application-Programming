import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Service } from "@/features/services/api";

type Props = {
  item: Service;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
};

export default function ServiceCard({ item, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.price != null && (
          <View style={styles.pricePill}>
            <Text style={styles.pricePillText}>NPR {item.price}</Text>
          </View>
        )}
      </View>

      {item.location && (
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={16} color="#6B7280" style={{ marginRight: 6 }} />
          <Text style={styles.cardSubtitle}>{item.location}</Text>
        </View>
      )}

      <View style={styles.metaGrid}>
        {item.createdAt && (
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={16} color="#6B7280" style={{ marginRight: 6 }} />
            <Text style={styles.cardDate}>Created: {new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        )}
        {item.expiresAt && (
          <View style={styles.metaRow}>
            <Ionicons name="hourglass-outline" size={16} color="#6B7280" style={{ marginRight: 6 }} />
            <Text style={styles.cardDate}>Expires: {new Date(item.expiresAt).toLocaleString()}</Text>
          </View>
        )}
      </View>

      {(item.barter || (Array.isArray(item.tags) && item.tags.length > 0)) && (
        <View style={styles.chipsRow}>
          {item.barter && (
            <View style={[styles.chip, { backgroundColor: '#F3E8FF', borderColor: '#9b59b6' }]}> 
              <Text style={[styles.chipText, { color: '#6b21a8' }]}>Barter: {item.barter}</Text>
            </View>
          )}
          {Array.isArray(item.tags) && item.tags.map((t, idx) => (
            <View key={`${item.id}-tag-${idx}`} style={styles.chip}>
              <Text style={styles.chipText}>#{t}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.cardActions}>
        <TouchableOpacity accessibilityLabel="Edit service" onPress={() => onEdit(item.id, item.title)} style={styles.iconButton}>
          <Ionicons name="create-outline" size={18} color="#022B3A" />
        </TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Delete service" onPress={() => onDelete(item.id)} style={[styles.iconButton, { backgroundColor: '#FEE2E2' }]}>
          <Ionicons name="trash-outline" size={18} color="#b91c1c" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: { color: "#022B3A", fontSize: 17, fontWeight: "700" },
  cardSubtitle: { color: "#6B7280", fontSize: 14 },
  cardDate: { color: "#6B7280", fontSize: 12, marginTop: 2 },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  pricePill: { backgroundColor: "#E8F7F2", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1, borderColor: "#A7F3D0" },
  pricePillText: { color: "#065F46", fontWeight: "700" },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  metaGrid: { flexDirection: "column", justifyContent: "space-between", marginTop: 6 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  chip: { backgroundColor: "#E6ECEA", borderColor: "#1F7A8C", borderWidth: 1, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10, marginRight: 6, marginBottom: 6 },
  chipText: { color: "#022B3A", fontSize: 12, fontWeight: "600" },
  cardActions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
  iconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#EFF6FF", justifyContent: "center", alignItems: "center", marginLeft: 8, borderWidth: 1, borderColor: "#DBEAFE" },
});
