import { HeaderBigLogo } from "@/src/components/layout/header";
import { ToggleItem } from "@/src/components/ToggleItem";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationAccess, setLocationAccess] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <HeaderBigLogo hasBackButton={true} hasNotifications={false} />

        <View className="items-center mt-10 mb-6">
          <Text className="text-darkBlue text-2xl font-kanitMedium uppercase">
            Settings
          </Text>
        </View>

        <Text className="text-gray-400 uppercase text-xs mb-2 mt-6 px-6">
          Preferences
        </Text>
        <View className="bg-gray-50 rounded-xl px-4 mx-6">
          <ToggleItem
            label="Enable Notifications"
            value={notifications}
            onValueChange={setNotifications}
          />
          {/* <ToggleItem
            label="Dark Mode"
            value={darkMode}
            onValueChange={setDarkMode}
          /> */}
          <ToggleItem
            label="Location Access"
            value={locationAccess}
            onValueChange={setLocationAccess}
          />
          <ToggleItem
            label="Want us to send you updates on events?"
            value={locationAccess}
            onValueChange={setLocationAccess}
          />
          <ToggleItem
            label="Are you interested in receiving franchise offers?"
            value={locationAccess}
            onValueChange={setLocationAccess}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
