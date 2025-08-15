import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ServiceCard from "@/components/services/ServiceCard";
import CreateServiceModal, { CreatePayload } from "@/components/services/CreateServiceModal";
import EditServiceModal from "@/components/services/EditServiceModal";
import FilterModal from "@/components/services/FilterModal";
import { createService, deleteService, subscribeServices, updateService, filterActiveServices, type Service } from "@/features/services/api";

export default function OddServicesScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  useEffect(() => {
    const unsub = subscribeServices((items) => {
      setServices(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const loc = filterLocation.trim().toLowerCase();
    return filterActiveServices(services)
      .filter((s) => !q || s.title.toLowerCase().includes(q))
      .filter((s) => !loc || s.location?.toLowerCase().includes(loc))
      .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  }, [services, searchQuery, filterLocation]);

  const handleCreate = async (payload: CreatePayload) => {
    try {
      await createService({
        title: payload.title,
        tags: payload.tags,
        description: payload.description,
        location: payload.location,
        phone: payload.phone,
        price: payload.price,
        barter: payload.barter,
        expiresAt: payload.expiresAt,
      });
      setCreateModalVisible(false);
    } catch (e) {
      Alert.alert("Error", "Failed to create service. Please try again.");
    }
  };

  const handleDeleteService = (id: string) => {
    Alert.alert("Confirm", "Delete this service?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteService(id);
          } catch (e) {
            Alert.alert("Error", "Failed to delete service.");
          }
        },
      },
    ]);
  };

  const handleEditService = (id: string, title: string) => {
    setEditServiceId(id);
    setEditTitle(title);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (editServiceId && editTitle.trim()) {
      try {
        await updateService(editServiceId, { title: editTitle });
      } catch (e) {
        Alert.alert("Error", "Failed to save changes.");
      }
    }
    setEditModalVisible(false);
    setEditServiceId(null);
    setEditTitle("");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Odd Services</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity accessibilityLabel="Open search and filters" onPress={() => setFilterModalVisible(true)}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Create service" onPress={() => setCreateModalVisible(true)} style={{ marginLeft: 16 }}>
            <MaterialIcons name="add-circle" size={26} color="#2ecc40" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ServiceCard item={item} onEdit={handleEditService} onDelete={handleDeleteService} />
        )}
        initialNumToRender={8}
        windowSize={11}
        removeClippedSubviews
      />

      <CreateServiceModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onCreate={handleCreate}
      />

      <FilterModal
        visible={filterModalVisible}
        searchQuery={searchQuery}
        onChangeSearchQuery={setSearchQuery}
        filterLocation={filterLocation}
        onChangeFilterLocation={setFilterLocation}
        onClose={() => setFilterModalVisible(false)}
      />

      <EditServiceModal
        visible={editModalVisible}
        title={editTitle}
        onChangeTitle={setEditTitle}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveEdit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16, marginTop: 23, backgroundColor: "#022B3A", padding: 10, borderRadius: 8 },
  headerTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold" },
  headerActions: { flexDirection: "row", alignItems: "center" },
  loadingText: { color: "#6B7280", textAlign: "center", marginTop: 20 },
});
