import { z } from "zod";

const BranchRowSchema = z
  .object({
    id: z.union([z.number(), z.string()]).transform((value) => Number(value)),
    title: z.string(),
    description: z.string().optional().nullable(),
    images: z
      .union([z.array(z.string()), z.string()])
      .optional()
      .nullable(),
    contact: z.string().optional().nullable(),
    latitude: z.union([z.number(), z.string()]).optional().nullable(),
    longitude: z.union([z.number(), z.string()]).optional().nullable(),
    function_hall_images: z
      .union([z.array(z.string()), z.string()])
      .optional()
      .nullable(),
    has_venue_hall: z
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

function parseImageList(value: string | string[] | null | undefined): string[] {
  if (Array.isArray(value)) {
    return value.filter((item) => item.trim().length > 0);
  }

  if (typeof value !== "string") {
    return [];
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0,
        );
      }
    } catch {
      // Fall back to the raw string handling below.
    }
  }

  return trimmed
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function parseCoordinateValue(
  value: string | number | null | undefined,
): string {
  if (typeof value === "number") {
    return String(value);
  }

  return value?.trim() ?? "";
}

export const OutletSchema = BranchRowSchema.transform((branch) => ({
  id: branch.id,
  title: branch.title,
  description: branch.description ?? undefined,
  images: parseImageList(branch.images),
  contact: branch.contact ?? undefined,
  longlat: `${parseCoordinateValue(branch.latitude)},${parseCoordinateValue(branch.longitude)}`,
  function_hall_images: parseImageList(branch.function_hall_images),
  has_function_hall: branch.has_venue_hall,
}));

export const OutletListSchema = z.array(OutletSchema);
