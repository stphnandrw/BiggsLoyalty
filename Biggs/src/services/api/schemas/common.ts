import { z } from "zod";

export const ApiSuccessEnvelopeSchema = <T extends z.ZodTypeAny>(
  payloadSchema: T,
) =>
  z.object({
    status: z.string().optional(),
    message: z.string().optional(),
    data: payloadSchema,
  });

export const parseDirectOrEnvelope = <T>(params: {
  input: unknown;
  directSchema: z.ZodType<T>;
  endpointName: string;
}): T => {
  const envelopeSchema = ApiSuccessEnvelopeSchema(params.directSchema);
  const parsed = z
    .union([params.directSchema, envelopeSchema])
    .safeParse(params.input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new Error(
      `${params.endpointName}: response validation failed at ${issue?.path.join(".") || "root"} (${issue?.message || "invalid shape"})`,
    );
  }

  const value = parsed.data;

  if (typeof value === "object" && value !== null && "data" in value) {
    return value.data as T;
  }

  return value as T;
};
