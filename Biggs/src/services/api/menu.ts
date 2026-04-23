import { api, isNotFoundError } from "@/src/services/api/api";
import { parseDirectOrEnvelope } from "@/src/services/api/schemas/common";
import { MenuListSchema } from "@/src/services/api/schemas/menu";
import type { MenuItem } from "@/src/types";

export const getAllMenu = async (): Promise<MenuItem[]> => {
  try {
    const response = await api.get("/menu");
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: MenuListSchema,
      endpointName: "getAllMenu",
    });
  } catch (error) {
    if (isNotFoundError(error)) {
      return [];
    }

    console.error("Menus API Error:", error);
    throw error;
  }
};
