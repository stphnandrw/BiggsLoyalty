import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkAllStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys);

    console.log("--- Current AsyncStorage Content ---");
    result.forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    console.log("------------------------------------");
  } catch (error) {
    console.error("Error loading AsyncStorage keys:", error);
  }
};

export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    console.log("Retrieved auth token from AsyncStorage:", token);
    return token;
  } catch (error) {
    console.error("Error retrieving auth token from AsyncStorage:", error);
    return null;
  }
};

export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage cleared successfully.");
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
};

export const logout = async () => {
  try {
    // clear storage except for last login timestamp
    const last_login_timestamp = await AsyncStorage.getItem(
      "last_login_timestamp",
    );
    await AsyncStorage.clear();
    if (last_login_timestamp) {
      await AsyncStorage.setItem("last_login_timestamp", last_login_timestamp);
    }
    console.log("User logged out and AsyncStorage cleared.");
    return true;
  } catch (error) {
    console.error("Error during logout and clearing AsyncStorage:", error);
    return false;
  }
};

export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`AsyncStorage item with key "${key}" removed successfully.`);
  } catch (error) {
    console.error(`Error removing AsyncStorage item with key "${key}":`, error);
  }
};

export const setItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log(`AsyncStorage item set: ${key} = ${value}`);
  } catch (error) {
    console.error(`Error setting AsyncStorage item ${key}:`, error);
  }
};

export const getItem = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    console.log(`AsyncStorage item retrieved: ${key} = ${value}`);
    return value;
  } catch (error) {
    console.error(`Error getting AsyncStorage item ${key}:`, error);
    return null;
  }
};

export const isUserAuthenticated = async () => {
  try {
    const [isLoggedIn, userData] = await Promise.all([
      AsyncStorage.getItem("isLoggedIn"),
      AsyncStorage.getItem("userData"),
    ]);

    return isLoggedIn === "true" && !!userData;
  } catch (error) {
    console.error("Error checking auth status:", error);
    return false;
  }
};
