import { z } from "zod";

export const OutletSchema = z
  .object({
    id: z.union([z.number(), z.string()]).transform((value) => Number(value)),
    title: z.string(),
    description: z.string().optional(),
    images: z.array(z.string()).default([]),
    contact: z.string().optional(),
    longlat: z.string(),
    function_hall_images: z.array(z.string()).optional(),
    has_function_hall: z
      .union([z.boolean(), z.number(), z.string()])
      .optional()
      .transform((value) => {
        if (value === undefined) return undefined;
        if (typeof value === "boolean") return value;
        if (typeof value === "number") return value === 1;
        return value === "1" || value.toLowerCase() === "true";
      }),
  })
  .passthrough();

export const OutletListSchema = z.array(OutletSchema);
