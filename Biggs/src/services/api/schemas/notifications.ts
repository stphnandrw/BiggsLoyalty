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

export const NotificationRowSchema = z
  .object({
    notification_id: NumberLikeSchema.optional(),
    notification_recipient_id: NumberLikeSchema.optional(),
    title: z.string().nullable().optional(),
    body: z.string().nullable().optional(),
    message: z.string().nullable().optional(),
    type: z.string().nullable().optional(),
    is_read: BooleanLikeSchema.optional(),
    read_at: z.string().nullable().optional(),
    delivery_status: z.string().nullable().optional(),
    data_payload: z
      .union([z.record(z.string(), z.unknown()), z.string(), z.null()])
      .optional(),
    created_at: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
  })
  .passthrough();

export const NotificationRowListSchema = z.array(NotificationRowSchema);

export const MarkReadResultSchema = z
  .object({
    status: z.string().optional(),
    message: z.string().optional(),
    updated_count: NumberLikeSchema.optional(),
    unread_count: NumberLikeSchema.optional(),
    data: z
      .object({
        updated_count: NumberLikeSchema.optional(),
        unread_count: NumberLikeSchema.optional(),
      })
      .optional(),
  })
  .passthrough();
