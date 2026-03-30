import "../../../global.css";
import { UserRegistrationProvider } from "@/src/context/UserRegistrationContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function BookingLayout() {
  return (
    <UserRegistrationProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="booking" />
        </Stack>
      </SafeAreaProvider>
    </UserRegistrationProvider>
  );
}
