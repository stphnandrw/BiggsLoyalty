import { HeaderBigLogo } from "@/src/components/layout/header";
import { MiniPrimaryButton } from "@/src/components/ui/Buttons";
import LoadingOverlay from "@/src/components/ui/LoadingOverlay";
import { getBookingCountByTagUid } from "@/src/services/api/bookings";
import {
    getFavoriteBranchByCode,
    getFavoriteLocationByTagUid,
    getFavoriteMenuByCode,
    getFavoriteMenuByTagUid,
} from "@/src/services/api/user";
import { getItem } from "@/src/utils/asyncStorage";
import {
    setFavoriteBranchSelectionMode,
    setFavoriteMenuItemSelectionMode,
} from "@/src/utils/favoriteBranch";
import { parseAndRemoveOtherLines } from "@/src/utils/htmlParser";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [favoriteBranch, setFavoriteBranch] = useState<any>(null);
  const [favoriteMenuItem, setFavoriteMenuItem] = useState<any>(null);
  const [pendingBookingCount, setPendingBookingCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const parseBranchAddress = (description?: string) => {
    if (!description) return "";

    const cleanText = description
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?[^>]+(>|$)/g, "");

    const lines = cleanText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return lines[2] || lines[1] || "";
  };

  const loadProfileData = useCallback(async () => {
    try {
      const userData = await getItem("userData");

      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        if (parsedUser.tag_uid) {
          try {
            const branch_code = await getFavoriteLocationByTagUid(
              parsedUser.tag_uid,
            );

            if (branch_code) {
              const branch = await getFavoriteBranchByCode(branch_code);
              setFavoriteBranch(branch);
            }
          } catch {
            setFavoriteBranch(null);
          }

          try {
            const menu_code = await getFavoriteMenuByTagUid(parsedUser.tag_uid);

            if (menu_code) {
              const menu = await getFavoriteMenuByCode(menu_code);
              setFavoriteMenuItem(menu);
            } else {
              setFavoriteMenuItem(null);
            }
          } catch {
            setFavoriteMenuItem(null);
          }

          try {
            const bookingCount = await getBookingCountByTagUid(
              parsedUser.tag_uid,
            );

            setPendingBookingCount(bookingCount);
            console.log("Booking count for user:", bookingCount);
          } catch (error) {
            console.error("Failed to fetch booking count:", error);
            setPendingBookingCount(0);
          }
        } else {
          setFavoriteBranch(null);
          setFavoriteMenuItem(null);
        }
      } else {
        setUser(null);
        setFavoriteBranch(null);
        setFavoriteMenuItem(null);
      }
    } catch {
      setUser(null);
      setFavoriteBranch(null);
      setFavoriteMenuItem(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);

      const loadUser = async () => {
        await loadProfileData();
      };

      loadUser();

      return () => {};
    }, [loadProfileData]),
  );

  const handleChangeFavoriteLocation = async () => {
    try {
      await setFavoriteBranchSelectionMode(true);
      router.push("/(tabs)/store-locator?mode=favorite");
    } catch (error) {
      console.error("Failed to enable favorite branch selection mode:", error);
    }
  };

  const handleChangeFavoriteMenu = async () => {
    try {
      await setFavoriteMenuItemSelectionMode(true);
      router.push("/(tabs)/menu?mode=favorite");
    } catch (error) {
      console.error("Failed to enable favorite menu selection mode:", error);
    }
  };

  const userData = {
    title: user?.name || "Guest User",
    data1: user?.phone_number || "No phone number",
    data2: user?.email || null,
    data3: user?.tag_uid,
  };

  const favoriteLocation = {
    title: favoriteBranch?.title || "No favorite branch",
    data1:
      parseBranchAddress(favoriteBranch?.description) ||
      "Tap Change to pick from Store Locator",
  };

  const favoriteMenu = {
    title:
      parseAndRemoveOtherLines(favoriteMenuItem?.m_title) || "No favorite menu",
    data1:
      favoriteMenuItem?.m_desc === null ||
      "Tap Change to pick from Store Locator",
  };

  console.log("User data in Profile screen:", userData);

  return (
    <SafeAreaView
      className="flex-1 items-center justify-center bg-black"
      edges={["top", "left", "right"]}
    >
      <View className="w-full h-full bg-white">
        <HeaderBigLogo hasLogout useConfirmation />

        {isLoading ? (
          <LoadingOverlay />
        ) : (
          <>
            <View className="w-full h-12 flex-row overflow-visible items-center justify-center ">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <View
                  key={i}
                  className={`${i % 2 === 0 ? "rotate-180" : ""}`}
                  style={{ width: 100 }}
                >
                  <Image
                    source={require("../../../assets/images/blue_checker.png")}
                    style={{ width: "100%", height: 30 }}
                    contentFit="cover"
                  />
                </View>
              ))}
            </View>

            <View className="w-full h-full p-4 gap-4">
              {/* Group 1: Navigation items */}
              <View className="bg-white rounded-2xl  border border-gray-100 overflow-hidden">
                <ItemWithButton
                  buttonName="Edit"
                  icon={
                    <Ionicons name="person-outline" size={16} color="#1a8fc4" />
                  }
                  icon2={
                    <Ionicons name="pencil-outline" size={12} color="white" />
                  }
                  data={userData}
                  onPress={() => router.push("/(more)/edit-profile")}
                />
              </View>

              {/* Group 2: Favorites — merged into one card */}
              <View className="bg-white rounded-2xl border border-gray-100 py-3">
                <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-3 pb-1">
                  Favorites
                </Text>
                <ItemWithButton
                  buttonName="Change"
                  icon={<Feather name="map-pin" size={16} color="#1a8fc4" />}
                  label="Favorite Location"
                  data={favoriteLocation}
                  onPress={handleChangeFavoriteLocation}
                />
                <View className="h-[0.5px] bg-gray-100 mx-4" />
                <ItemWithButton
                  buttonName="Change"
                  icon={<Feather name="heart" size={16} color="#1a8fc4" />}
                  label="Favorite Menu"
                  data={favoriteMenu}
                  onPress={handleChangeFavoriteMenu}
                />
              </View>

              {/* Group 3: Settings */}
              <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <ProfileMenuItem
                  icon="receipt-outline"
                  label="Scheduled Events"
                  count={pendingBookingCount}
                  onPress={() => router.push("/(more)/scheduled-events")}
                />
                <ProfileMenuItem
                  icon="settings-outline"
                  label="Settings"
                  onPress={() => router.push("/(more)/settings")}
                />
              </View>
            </View>

            <View className="absolute -bottom-4 left-60 w-full rotate-[-40deg] overflow-hidden">
              <Image
                source={require("../../../assets/images/blue_checker_1.png")}
                style={{ width: 250, height: 220 }}
                contentFit="contain"
              />
            </View>

            <View className="absolute bottom-10 left-40 w-full overflow-hidden">
              <Image
                source={require("../../../assets/images/cat1.png")}
                style={{ width: 250, height: 180 }}
                contentFit="contain"
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Standard menu item ──────────────────────────────────────────────────────

function ProfileMenuItem({
  icon,
  label,
  onPress,
  count,
  danger = false,
}: {
  icon: any;
  label: string;
  onPress: () => void;
  count?: number;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-4 px-3"
      activeOpacity={0.65}
    >
      <Ionicons name={icon} size={22} color={danger ? "#e74c3c" : "#3db5e7"} />
      <Text
        className={`ml-4 text-base flex-1 ${
          danger ? "text-red-500" : "text-gray-800"
        }`}
      >
        {label}
      </Text>

      {count !== undefined && count > 0 && (
        <View className="bg-[#1a8fc4] rounded-full min-w-[22px] h-[22px] items-center justify-center px-1.5 mr-2">
          <Text className="text-white text-[11px] font-kanitBold">
            {count > 99 ? "99+" : count}
          </Text>
        </View>
      )}

      {!danger && <Ionicons name="chevron-forward" size={20} color="#ccc" />}
    </TouchableOpacity>
  );
}

// ─── Favorite item (no outer card — lives inside the shared Favorites card) ──

function ItemWithButton({
  buttonName,
  icon,
  icon2,
  label,
  onPress,
  data,
}: {
  buttonName: string;
  icon: any;
  icon2?: any;
  label?: string;
  data: any;
  onPress: () => void;
}) {
  return (
    <View className="flex-row items-center px-4 py-3 gap-3">
      <View className="w-9 h-9 rounded-full bg-[#1a8fc4]/15 items-center justify-center">
        {icon}
      </View>
      <View className="flex-1">
        {label && <Text className="text-gray-400 text-xs mb-0.5">{label}</Text>}
        <Text className="text-gray-800 text-sm font-kanitMedium">
          {data.title}
        </Text>
        {data.data1 && (
          <Text className="text-gray-400 text-xs mt-0.5" numberOfLines={1}>
            {data.data1}
          </Text>
        )}
        {data.data2 && (
          <Text className="text-gray-400 text-xs" numberOfLines={1}>
            {data.data2}
          </Text>
        )}
      </View>
      <MiniPrimaryButton
        icon={icon2}
        buttonName={buttonName}
        onPress={() => onPress()}
      />
    </View>
  );
}
