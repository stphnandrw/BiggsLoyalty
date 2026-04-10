import { api } from "@/src/services/api/api";
import {
  BookingCancelResultSchema,
  BookingCountSchema,
  BookingPackageListSchema,
  BookingRecordListSchema,
  BookingSlotListSchema,
  CreateBookingResultSchema,
} from "@/src/services/api/schemas/bookings";
import { parseDirectOrEnvelope } from "@/src/services/api/schemas/common";
import type {
  BookingCancelResult,
  BookingPackage,
  BookingRecord,
  BookingSlot,
  CreateBookingPayload,
  CreateBookingResult,
} from "@/src/types";

export type {
  BookingCancelResult,
  BookingPackage,
  BookingRecord,
  BookingSlot,
  CreateBookingPayload,
  CreateBookingResult
} from "@/src/types";

export const getBranchPackages = async (
  branch_id: number,
): Promise<BookingPackage[]> => {
  try {
    const response = await api.post("/booking/branch-packages", { branch_id });
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: BookingPackageListSchema,
      endpointName: "getBranchPackages",
    });
  } catch (error) {
    console.error("Get Branch Packages API Error:", error);
    throw error;
  }
};

export const getAvailableBookingSlots = async (
  branch_id: number,
  slot_date: string,
): Promise<BookingSlot[]> => {
  try {
    const response = await api.post("/booking/slots", { branch_id, slot_date });
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: BookingSlotListSchema,
      endpointName: "getAvailableBookingSlots",
    });
  } catch (error) {
    console.error("Get Booking Slots API Error:", error);
    throw error;
  }
};

export const createBooking = async (
  payload: CreateBookingPayload,
): Promise<CreateBookingResult> => {
  try {
    const response = await api.post("/booking/create", payload);
    const parsed = CreateBookingResultSchema.parse(response.data);
    const bookingId = parsed.booking_id ?? parsed.data?.booking_id ?? 0;

    return {
      status: parsed.status,
      message: parsed.message,
      booking_id: bookingId,
    };
  } catch (error) {
    console.error("Create Booking API Error:", error);
    throw error;
  }
};

export const getMyBookings = async (
  tag_uid: string,
): Promise<BookingRecord[]> => {
  try {
    const response = await api.post("/booking/my-bookings", { tag_uid });
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: BookingRecordListSchema,
      endpointName: "getMyBookings",
    });
  } catch (error) {
    console.error("Get My Bookings API Error:", error);
    throw error;
  }
};

export const cancelBooking = async (
  booking_id: number,
  tag_uid: string,
): Promise<BookingCancelResult> => {
  try {
    const response = await api.post("/booking/cancel", { booking_id, tag_uid });
    return BookingCancelResultSchema.parse(response.data);
  } catch (error) {
    console.error("Cancel Booking API Error:", error);
    throw error;
  }
};

export const getBookingCountByTagUid = async (
  tag_uid: string,
): Promise<number> => {
  try {
    const response = await api.post("/booking/count", { tag_uid });
    const parsed = parseDirectOrEnvelope({
      input: response.data,
      directSchema: BookingCountSchema,
      endpointName: "getBookingCountByTagUid",
    });

    return parsed.booking_count;
  } catch (error) {
    console.error("Get Booking Count API Error:", error);
    throw error;
  }
};
