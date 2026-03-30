import { api } from "@/src/services/api/api";

export const getOutlets = async () => {
  try {
    const response = await api.get(
      "https://biggs.ph/biggs_website/api/outlets",
    );
    return response.data;
  } catch (error) {
    console.error("Outlets API Error:", error);
    throw error;
  }
};
