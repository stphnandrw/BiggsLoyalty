import CustomTabBar from "@/src/components/layout/customTabBar";
import { Tabs } from "expo-router";
import "../../../global.css";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="promos" />
      <Tabs.Screen name="store-locator" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
