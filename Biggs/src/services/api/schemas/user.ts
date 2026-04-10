import { z } from "zod";

const NumberLikeSchema = z
  .union([z.number(), z.string()])
  .transform((value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  });

export const LoyaltyPointsSchema = z
  .object({
    points: NumberLikeSchema,
  })
  .passthrough();
