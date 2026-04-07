import { UserRegistrationProvider } from "@/src/context/UserRegistrationContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../../../global.css";

export default function BookingLayout() {
  return (
    <UserRegistrationProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false, presentation: "modal" }}>
          <Stack.Screen name="book-appointment" />
        </Stack>
      </SafeAreaProvider>
    </UserRegistrationProvider>
  );
}
