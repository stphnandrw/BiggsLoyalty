import { isUserAuthenticated } from "@/src/utils/asyncStorage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

export function useAuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuthStatus = useCallback(async () => {
    const authenticated = await isUserAuthenticated();
    setIsLoggedIn(authenticated);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshAuthStatus();
  }, [refreshAuthStatus]);

  useFocusEffect(
    useCallback(() => {
      refreshAuthStatus();
    }, [refreshAuthStatus]),
  );

  return {
    isLoggedIn,
    isLoading,
    refreshAuthStatus,
  };
}
