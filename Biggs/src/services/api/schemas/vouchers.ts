import { z } from "zod";

const NumberLikeSchema = z
  .union([z.number(), z.string()])
  .transform((value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  });

const NullableStringSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => value ?? null);

const StringSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => (value ?? "").trim());

export const VoucherSchema = z
  .object({
    voucher_id: NumberLikeSchema,
    voucher_name: StringSchema,
    description: StringSchema,
    required_points: NumberLikeSchema,
    image_url: StringSchema,
    start_date: NullableStringSchema,
    end_date: NullableStringSchema,
    created_at: NullableStringSchema,
  })
  .passthrough();

export const ClaimedVoucherSchema = VoucherSchema.extend({
  claimed_voucher_id: NumberLikeSchema,
  tag_uid: StringSchema,
  claimed_at: NullableStringSchema,
});

export const VoucherListSchema = z.array(VoucherSchema);
export const ClaimedVoucherListSchema = z.array(ClaimedVoucherSchema);

const MutationPayloadSchema = z
  .object({
    required_points: NumberLikeSchema.optional(),
    current_points: NumberLikeSchema.optional(),
    remaining_points: NumberLikeSchema.optional(),
  })
  .passthrough();

export const VoucherMutationResponseSchema = z
  .object({
    status: z.string().optional(),
    message: z.string(),
    data: MutationPayloadSchema.optional(),
    required_points: NumberLikeSchema.optional(),
    current_points: NumberLikeSchema.optional(),
    remaining_points: NumberLikeSchema.optional(),
  })
  .passthrough();
