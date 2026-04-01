import { getItem, removeItem, setItem } from "@/src/utils/asyncStorage";

// API calls related to favorite Branches
export const FAVORITE_BRANCH_SELECTION_MODE_KEY = "favoriteBranchSelectionMode";

export const setFavoriteBranchSelectionMode = async (isEnabled: boolean) => {
  await setItem(
    FAVORITE_BRANCH_SELECTION_MODE_KEY,
    isEnabled ? "true" : "false",
  );
};

export const getFavoriteBranchSelectionMode = async (): Promise<boolean> => {
  const raw = await getItem(FAVORITE_BRANCH_SELECTION_MODE_KEY);
  return raw === "true";
};

export const clearFavoriteBranchSelectionMode = async () => {
  await removeItem(FAVORITE_BRANCH_SELECTION_MODE_KEY);
};

// API calls related to favorite Menus
export const FAVORITE_MENU_SELECTION_MODE_KEY = "favoriteMenuSelectionMode";

export const setFavoriteMenuItemSelectionMode = async (isEnabled: boolean) => {
  await setItem(FAVORITE_MENU_SELECTION_MODE_KEY, isEnabled ? "true" : "false");
};

export const getFavoriteMenuItemSelectionMode = async (): Promise<boolean> => {
  const raw = await getItem(FAVORITE_MENU_SELECTION_MODE_KEY);
  return raw === "true";
};

export const clearFavoriteMenuItemSelectionMode = async () => {
  await removeItem(FAVORITE_MENU_SELECTION_MODE_KEY);
};
