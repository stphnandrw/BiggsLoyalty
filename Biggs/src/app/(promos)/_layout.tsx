import { Stack } from "expo-router";

export default function PromosLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: "modal" }}>
      <Stack.Screen name="promo-details" />
    </Stack>
  );
}
