import { api } from "@/src/services/api/api";

export type BookingPackage = {
  id: number;
  name: string;
  price_per_head: number;
  min_pax: number;
  max_pax: number;
  inclusions: string[];
  best_for: string;
};

export type BookingSlot = {
  id: number;
  branch_id: number;
  slot_date: string;
  time_start: string;
  time_end: string;
  max_seats: number;
  booked_seats: number;
  available_seats: number;
  is_available: boolean;
};

export type CreateBookingPayload = {
  tag_uid: string;
  branch_id: number;
  slot_id: number;
  package_id: number;
  user_name: string;
  user_email?: string;
  user_phone?: string;
  party_size: number;
  note?: string;
  promo_id?: number | null;
};

export type BookingRecord = {
  id: number;
  branch_id: number;
  slot_id: number;
  package_id?: number;
  package_name?: string;
  user_name?: string;
  user_phone?: string;
  user_email?: string;
  party_size?: number;
  status?: "pending" | "confirmed" | "cancelled";
  slot_date?: string;
  time_start?: string;
  time_end?: string;
  created_at?: string;
};

export const getBranchPackages = async (branch_id: number) => {
  try {
    const response = await api.post("/booking/packages", { branch_id });
    return response.data;
  } catch (error) {
    console.error("Get Branch Packages API Error:", error);
    throw error;
  }
};

export const getAvailableBookingSlots = async (
  branch_id: number,
  slot_date: string,
) => {
  try {
    const response = await api.post("/booking/slots", { branch_id, slot_date });
    return response.data;
  } catch (error) {
    console.error("Get Booking Slots API Error:", error);
    throw error;
  }
};

export const createBooking = async (payload: CreateBookingPayload) => {
  try {
    const response = await api.post("/booking/create", payload);
    return response.data;
  } catch (error) {
    console.error("Create Booking API Error:", error);
    throw error;
  }
};

export const getMyBookings = async (tag_uid: string) => {
  try {
    const response = await api.post("/booking/my-bookings", { tag_uid });
    return response.data;
  } catch (error) {
    console.error("Get My Bookings API Error:", error);
    throw error;
  }
};
