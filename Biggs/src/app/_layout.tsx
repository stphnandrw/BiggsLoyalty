import { ScreenDebug } from "@/src/components/ScreenDebug";
import { UserRegistrationProvider } from "@/src/context/UserRegistrationContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../../global.css";
// import { usePushNotifications } from "../hooks/usePushNotifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const queryClient = new QueryClient();

export default function RootLayout() {
  // usePushNotifications();
  const [loaded] = useFonts({
    KanitRegular: require("../../assets/fonts/Kanit-Regular.otf"),
    KanitBold: require("../../assets/fonts/Kanit-Bold.otf"),
    KanitSemiBold: require("../../assets/fonts/Kanit-SemiBold.otf"),
    KanitExtraBold: require("../../assets/fonts/Kanit-ExtraBold.otf"),
    KanitLight: require("../../assets/fonts/Kanit-Light.otf"),
    KanitMedium: require("../../assets/fonts/Kanit-Medium.otf"),
  });

  if (!loaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <UserRegistrationProvider>
          <SafeAreaProvider>
            <BottomSheetModalProvider>
              <Stack
                screenOptions={{ headerShown: false }}
                initialRouteName="index"
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="splash" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(promos)" />
                <Stack.Screen name="(notifications)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(booking)" />
                <Stack.Screen name="+not-found" />
              </Stack>
              <ScreenDebug />
            </BottomSheetModalProvider>
          </SafeAreaProvider>
        </UserRegistrationProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
