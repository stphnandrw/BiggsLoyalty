import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "@/global.css";
import { UserRegistrationProvider } from "@/src/context/UserRegistrationContext";

export default function NotificationsLayout() {
  return (
    <UserRegistrationProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="notifications" />
        </Stack>
      </SafeAreaProvider>
    </UserRegistrationProvider>
  );
}
