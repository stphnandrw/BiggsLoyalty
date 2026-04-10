export type BookingPackage = {
  branch_id: number;
  details: string;
  package_id: number;
  package_name: string;
  pax_size: number;
  price: number;
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

export type CreateBookingResult = {
  status?: string;
  message: string;
  booking_id: number;
};

export type BookingCancelResult = {
  status?: string;
  message: string;
};
