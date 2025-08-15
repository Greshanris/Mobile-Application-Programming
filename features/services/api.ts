import { ref, onValue, push, remove, update } from "firebase/database";
import { db } from "@/firebaseConfig";

// Domain types
export type Service = {
  id: string;
  title: string;
  tags?: string[];
  description?: string;
  location?: string;
  phone?: string;
  price?: number | null;
  barter?: string | null;
  createdAt?: number;
  expiresAt?: number;
  userId?: string;
  status?: string; // e.g., 'active', 'archived'
};

export type ServiceCreateInput = {
  title: string;
  tags?: string[];
  description?: string;
  location?: string;
  phone?: string;
  price?: number | null;
  barter?: string | null;
  expiresAt?: number; // absolute timestamp in ms
  userId?: string;
  status?: string;
};

export type ServiceUpdateInput = Partial<Omit<Service, "id" | "createdAt">>;

// Helpers
export function normalizePhone(input: string): string {
  return input.replace(/\D/g, "");
}

export function filterActiveServices(list: Service[], now: number = Date.now()): Service[] {
  return list.filter((s) => !s.expiresAt || s.expiresAt > now);
}

// Subscription to the services collection
export function subscribeServices(callback: (services: Service[]) => void): () => void {
  const servicesRef = ref(db, "services");
  const unsubscribe = onValue(servicesRef, (snapshot) => {
    const data = snapshot.val() || {};
    const items: Service[] = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
    callback(items);
  });
  // onValue returns the unsubscribe function itself
  return () => unsubscribe();
}

// Create a new service
export async function createService(input: ServiceCreateInput): Promise<string> {
  const servicesRef = ref(db, "services");
  const now = Date.now();
  const payload = {
    title: input.title.trim(),
    tags: input.tags ?? [],
    description: input.description ?? "",
    location: input.location ?? "",
    phone: input.phone ? normalizePhone(input.phone) : undefined,
    price: typeof input.price === "number" ? input.price : null,
    barter: input.barter ?? null,
    createdAt: now,
    expiresAt: input.expiresAt,
    userId: input.userId ?? undefined,
    status: input.status ?? "active",
  };
  const newRef = await push(servicesRef, payload);
  if (!newRef.key) throw new Error("Failed to create service");
  return newRef.key;
}

// Update an existing service
export async function updateService(id: string, patch: ServiceUpdateInput): Promise<void> {
  if (!id) throw new Error("Missing service id");
  await update(ref(db, `services/${id}`), patch);
}

// Delete a service
export async function deleteService(id: string): Promise<void> {
  if (!id) throw new Error("Missing service id");
  await remove(ref(db, `services/${id}`));
}
