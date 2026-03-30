import { Stack } from "expo-router";
import "../../../../global.css";

export default function SignUpLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="personal-details" />
      <Stack.Screen name="confirm-password" />
    </Stack>
  );
}
