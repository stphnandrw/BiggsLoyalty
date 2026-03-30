import { HeaderBigLogo } from "@/src/components/layout/header";
import { HorizontalLine } from "@/src/components/ui/Lines";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  return (
    <SafeAreaView
      className="flex-1 items-center justify-center bg-black"
      edges={["top", "left", "right"]}
    >
      <View className="w-full h-full bg-white">
        <HeaderBigLogo hasLogout useConfirmation />

        {/* View for Card Number and Current Points */}
        <View className="w-full h-auto items-center justify-center mt-10">
          <Text className="text-darkBlue text-2xl leading-none font-kanitMedium uppercase">
            Total Points
          </Text>
        </View>
        <View className="w-full h-auto items-center justify-center mb-6">
          <Text className="text-darkBlue text-7xl leading-none font-kanitBold">
            1,234
          </Text>
        </View>

        <HorizontalLine />

        <View className="w-full h-[25%] items-center p-4">
          <View className="w-full h-full bg-white items-center border p-3 rounded-2xl">
            <View className="w-full">
              <Text className="text-darkBlue text-lg mb-5">
                BIGGS Loyalty Card
              </Text>
            </View>
            {/* <View>
              <Text className="text-darkBlue text-lg font-bold">
                Card Number: 1234 5678 9012 3456
              </Text>
              <Pressable></Pressable>
            </View> */}

            <View className="w-full flex-row justify-start">
              <MaterialCommunityIcons
                name="star-four-points-outline"
                size={24}
                color="black"
              />
              <Text className="text-darkBlue text-2xl font-bold">1,234</Text>
              <Text className="text-darkBlue text-sm font-bold"> Points</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        {/* <View className="mt-6 mx-4 bg-white rounded-2xl p-2">
          <ProfileMenuItem
            icon="person-outline"
            label="Edit Profile"
            onPress={() => {}}
          />
          <ProfileMenuItem
            icon="location-outline"
            label="My Addresses"
            onPress={() => {}}
          />
          <ProfileMenuItem
            icon="receipt-outline"
            label="Order History"
            onPress={() => {}}
          />
          <ProfileMenuItem
            icon="heart-outline"
            label="Favorites"
            onPress={() => {}}
          />
          <ProfileMenuItem
            icon="settings-outline"
            label="Settings"
            onPress={() => {}}
          />
        </View> */}
      </View>
    </SafeAreaView>
  );
}

function ProfileMenuItem({
  icon,
  label,
  onPress,
  danger = false,
}: {
  icon: any;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-4 px-3"
    >
      <Ionicons name={icon} size={22} color={danger ? "#e74c3c" : "#3db5e7"} />
      <Text
        className={`ml-4 text-base flex-1 ${
          danger ? "text-red-500" : "text-gray-800"
        }`}
      >
        {label}
      </Text>
      {!danger && <Ionicons name="chevron-forward" size={20} color="#ccc" />}
    </TouchableOpacity>
  );
}
