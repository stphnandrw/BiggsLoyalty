import { z } from "zod";

export const GenerateOtpResponseSchema = z
  .object({
    status: z.string().optional(),
    message: z.string(),
  })
  .passthrough();

export const VerifyOtpResponseSchema = z
  .object({
    status: z.string().optional(),
    message: z.string(),
    time_check: z.string().optional(),
    data: z
      .object({
        time_check: z.string().optional(),
      })
      .optional(),
  })
  .passthrough();
