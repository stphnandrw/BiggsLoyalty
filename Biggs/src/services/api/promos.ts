import { api } from "@/src/services/api/api";

export const getAllPromos = async () => {
  try {
    const response = await api.get("/promos");
    return response.data;
  } catch (error) {
    console.error("Get All Promos API Error:", error);
    throw error;
  }
};

// export const getUserFavoriteMenus = async (tag_uid: string) => {
//   try {
//     const response = await api.post(`/favorites/menus`, { tag_uid });
//     console.log("Get User Favorite Menus API Response:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Get User Favorites API Error:", error);
//     throw error;
//   }
// };

export const getUserFavoritePromos = async (tag_uid: string) => {
  try {
    const response = await api.post(`/favorites/promos`, {
      tag_uid,
    });
    return response.data;
  } catch (error) {
    console.error("Get User Favorite Promos API Error:", error);
    throw error;
  }
};

export const getPromosExcludingFavorites = async (tag_uid: string) => {
  try {
    const response = await api.post(`/promos/exclude-favorites`, {
      tag_uid,
    });
    return response.data;
  } catch (error) {
    console.error("Get Promos Excluding Favorites API Error:", error);
    throw error;
  }
};

export const addFavoritePromo = async (tag_uid: string, promo_id: number) => {
  try {
    const response = await api.post(`/favorites/add`, {
      tag_uid,
      promo_id,
    });
    return response.data;
  } catch (error) {
    console.error("Add Favorite Promo API Error:", error);
    throw error;
  }
};

export const removeFavoritePromo = async (
  tag_uid: string,
  promo_id: number,
) => {
  try {
    const response = await api.post(`/favorites/remove`, {
      tag_uid,
      promo_id,
    });
    return response.data;
  } catch (error) {
    console.error("Remove Favorite Promo API Error:", error);
    throw error;
  }
};
