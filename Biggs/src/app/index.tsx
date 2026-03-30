import LoadingScreen from "@/src/app/loading";
import { checkAllStorage } from "@/src/utils/asyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const checkIfNewUser = async () => {
    try {
      // Run auth check and minimum delay in parallel
      const [isLoggedIn, userData] = await Promise.all([
        AsyncStorage.getItem("isLoggedIn"),
        AsyncStorage.getItem("userData"),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);

      if (isLoggedIn === "true" && userData) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/login");
      }
    } catch (error) {
      console.error("Error checking user data:", error);
      router.replace("/(auth)/login");
    }
  };

  useEffect(() => {
    checkAllStorage();
    checkIfNewUser();
  }, []);

  return <LoadingScreen />;
}
