import { Stack } from "expo-router";

export default function MoreLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: "modal" }}>
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="scheduled-events" />
      <Stack.Screen name="favorite-location" />
      <Stack.Screen name="favorite-menu" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
