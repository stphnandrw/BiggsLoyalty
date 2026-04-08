import { api } from "@/src/services/api/api";

export type BookingPackage = {
  branch_id: number | string;
  details: string;
  package_id: number | string;
  package_name: string;
  pax_size: number | string;
  price: number | string;
};

export type BookingSlot = {
  id: number;
  branch_id: number;
  slot_date: string;
  time_start: string;
  time_end: string;
  booked_seats: number;
  available_seats: number;
  is_available: boolean;
};

export type CreateBookingPayload = {
  tag_uid: string;
  slot_id: number;
  package_id: number;
  note?: string;
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
  status?: "pending" | "confirmed" | "cancelled";
  slot_date?: string;
  time_start?: string;
  time_end?: string;
  created_at?: string;
};

export const getBranchPackages = async (branch_id: number) => {
  try {
    const response = await api.post("/booking/branch-packages", { branch_id });
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

export const cancelBooking = async (booking_id: number, tag_uid: string) => {
  try {
    const response = await api.post("/booking/cancel", { booking_id, tag_uid });
    return response.data;
  } catch (error) {
    console.error("Cancel Booking API Error:", error);
    throw error;
  }
};

export const getBookingCountByTagUid = async (tag_uid: string) => {
  try {
    const response = await api.post("/booking/count", { tag_uid });
    console.log("Booking count for user:", response.data);
    console.log("Full response:");
    return response.data.data.booking_count;
  } catch (error) {
    console.error("Get Booking Count API Error:", error);
    throw error;
  }
};
