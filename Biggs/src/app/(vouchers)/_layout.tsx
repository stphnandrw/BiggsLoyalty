import { Stack } from "expo-router";

export default function VouchersLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: "modal" }}>
      <Stack.Screen name="voucher-details" />
      <Stack.Screen name="voucher-history" />
    </Stack>
  );
}
