import { api, isNotFoundError } from "@/src/services/api/api";
import { parseDirectOrEnvelope } from "@/src/services/api/schemas/common";
import { OutletListSchema } from "@/src/services/api/schemas/outlets";
import type { Outlet } from "@/src/types";

export const getOutlets = async (): Promise<Outlet[]> => {
  try {
    const response = await api.get("/branches");
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: OutletListSchema,
      endpointName: "getOutlets",
    });
  } catch (error) {
    if (isNotFoundError(error)) {
      return [];
    }

    console.error("Outlets API Error:", error);
    throw error;
  }
};
