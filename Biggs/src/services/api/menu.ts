import { api } from "@/src/services/api/api";

export const getAllMenu = async () => {
  try {
    const response = await api.get("/menu");
    return response.data;
  } catch (error) {
    console.error("Menus API Error:", error);
    throw error;
  }
};
