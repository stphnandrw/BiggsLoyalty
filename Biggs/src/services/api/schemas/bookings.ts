import { z } from "zod";

const NumberLikeSchema = z
  .union([z.number(), z.string()])
  .transform((value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  });

const BooleanLikeSchema = z
  .union([z.boolean(), z.number(), z.string()])
  .transform((value) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;
    return value === "1" || value.toLowerCase() === "true";
  });

const NullableStringSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => value ?? undefined);

export const BookingPackageSchema = z
  .object({
    branch_id: NumberLikeSchema,
    details: z.string(),
    package_id: NumberLikeSchema,
    package_name: z.string(),
    pax_size: NumberLikeSchema,
    price: NumberLikeSchema,
  })
  .passthrough();

export const BookingSlotSchema = z
  .object({
    id: NumberLikeSchema,
    branch_id: NumberLikeSchema,
    slot_date: z.string(),
    time_start: z.string(),
    time_end: z.string(),
    booked_seats: NumberLikeSchema,
    available_seats: NumberLikeSchema,
    is_available: BooleanLikeSchema,
  })
  .passthrough();

export const BookingRecordSchema = z
  .object({
    id: NumberLikeSchema,
    branch_id: NumberLikeSchema,
    slot_id: NumberLikeSchema,
    package_id: NumberLikeSchema.optional(),
    package_name: NullableStringSchema,
    user_name: NullableStringSchema,
    user_phone: NullableStringSchema,
    user_email: NullableStringSchema,
    status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
    slot_date: NullableStringSchema,
    time_start: NullableStringSchema,
    time_end: NullableStringSchema,
    created_at: NullableStringSchema,
  })
  .passthrough();

export const BookingPackageListSchema = z.array(BookingPackageSchema);
export const BookingSlotListSchema = z.array(BookingSlotSchema);
export const BookingRecordListSchema = z.array(BookingRecordSchema);

export const CreateBookingResultSchema = z
  .object({
    status: z.string().optional(),
    message: z.string(),
    booking_id: NumberLikeSchema.optional(),
    data: z.object({ booking_id: NumberLikeSchema }).partial().optional(),
  })
  .passthrough();

export const BookingCancelResultSchema = z
  .object({
    status: z.string().optional(),
    message: z.string(),
  })
  .passthrough();

export const BookingCountSchema = z
  .object({
    booking_count: NumberLikeSchema,
  })
  .passthrough();
