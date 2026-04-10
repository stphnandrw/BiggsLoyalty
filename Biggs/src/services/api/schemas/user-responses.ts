import { z } from "zod";

const NumberLikeSchema = z
  .union([z.number(), z.string()])
  .transform((value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  });

export const CheckTagUidResponseSchema = z
  .object({
    status: z.boolean().optional(),
    message: z.string().optional(),
    phone_number: z.string().nullable().optional(),
  })
  .passthrough();

export const CheckUserExistsResponseSchema = z
  .object({
    exists: z.boolean(),
    tag_uid: z.string().optional(),
    is_incomplete: z.boolean().optional(),
    name: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    phone_number: z.string().nullable().optional(),
    birthday: z.string().nullable().optional(),
    expo_push_token: z.string().nullable().optional(),
    events_flag: NumberLikeSchema.optional(),
    franchising_flag: NumberLikeSchema.optional(),
  })
  .passthrough();

export const UserMutationResponseSchema = z
  .object({
    status: z.string().optional(),
    message: z.string(),
  })
  .passthrough();

export const FavoriteCodeResponseSchema = z.union([
  z.string(),
  z
    .object({
      fave_location: z.string().nullable().optional(),
      fave_item: z.string().nullable().optional(),
    })
    .passthrough(),
]);

export const FavoriteEntitySchema = z
  .record(z.string(), z.unknown())
  .or(z.array(z.unknown()));
