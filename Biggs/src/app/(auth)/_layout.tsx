import { UserRegistrationProvider } from "@/src/context/UserRegistrationContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../../../global.css";

export default function AuthLayout() {
  return (
    <UserRegistrationProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(signup)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="verify" />
        </Stack>
      </SafeAreaProvider>
    </UserRegistrationProvider>
  );
}
