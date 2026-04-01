// components/CustomTabBar.tsx
import { AuthRequiredBottomSheet } from "@/src/components/ui/Modal";
import { isUserAuthenticated } from "@/src/utils/asyncStorage";
import {
  getFavoriteBranchSelectionMode,
  getFavoriteMenuItemSelectionMode,
} from "@/src/utils/favoriteBranch";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Pressable, View } from "react-native";

const { width } = Dimensions.get("window");
const TAB_COUNT = 5;
const TAB_WIDTH = width / TAB_COUNT;
const LINE_WIDTH = TAB_WIDTH * 0.9; // Width of the indicator line

const iconMap: Record<
  string,
  { focused: string; unfocused: string; size: number }
> = {
  index: { focused: "home", unfocused: "home-outline", size: 24 },
  "store-locator": { focused: "map", unfocused: "map-outline", size: 24 },
  more: { focused: "menu", unfocused: "menu-outline", size: 36 },
  menu: { focused: "fast-food", unfocused: "fast-food-outline", size: 28 },
  promos: { focused: "pricetags", unfocused: "pricetags-outline", size: 22 },
};

const PROTECTED_TABS = new Set(["promos", "profile"]);

export default function CustomTabBar({
  state,
  navigation,
  descriptors,
}: BottomTabBarProps) {
  const [showAuthSheet, setShowAuthSheet] = useState(false);
  const [tabsDisabled, setTabsDisabled] = useState(false);

  // Sliding line X position
  const lineX = useRef(
    new Animated.Value((TAB_WIDTH - LINE_WIDTH) / 2),
  ).current;

  // Individual icon animations
  const scales = useRef(
    state.routes.map(
      (_, i) => new Animated.Value(i === state.index ? 1.15 : 0.85),
    ),
  ).current;
  const translateYs = useRef(
    state.routes.map((_, i) => new Animated.Value(i === state.index ? -4 : 0)),
  ).current;
  const opacities = useRef(
    state.routes.map(
      (_, i) => new Animated.Value(i === state.index ? 1 : 0.45),
    ),
  ).current;

  useEffect(() => {
    const i = state.index;

    Animated.spring(lineX, {
      // (Tab Index * Full Width) + Centering Offset
      toValue: i * TAB_WIDTH + (TAB_WIDTH - LINE_WIDTH) / 2,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();

    // Animate all icons based on focus state
    state.routes.forEach((_, index) => {
      const isFocused = index === i;

      Animated.parallel([
        Animated.spring(scales[index], {
          toValue: isFocused ? 1.15 : 0.85,
          useNativeDriver: true,
          friction: 6,
        }),
        Animated.spring(translateYs[index], {
          toValue: isFocused ? -4 : 0,
          useNativeDriver: true,
          friction: 6,
        }),
        Animated.timing(opacities[index], {
          toValue: isFocused ? 1 : 0.45,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [lineX, opacities, scales, state.index, state.routes, translateYs]);

  useEffect(() => {
    const loadTabDisabledState = async () => {
      const activeRoute = state.routes[state.index];
      const activeParams = descriptors[activeRoute.key]?.route?.params as
        | { mode?: string | string[] }
        | undefined;

      const modeParam = Array.isArray(activeParams?.mode)
        ? activeParams?.mode[0]
        : activeParams?.mode;

      const isFavoriteModeParam = modeParam === "favorite";
      const isBranchSelectionMode = await getFavoriteBranchSelectionMode();
      const isMenuSelectionMode = await getFavoriteMenuItemSelectionMode();

      setTabsDisabled(
        isFavoriteModeParam || isBranchSelectionMode || isMenuSelectionMode,
      );
    };

    loadTabDisabledState();
  }, [state.index, state.routes, descriptors]);

  return (
    <>
      <View className="flex-row bg-[#f0f0ec] border-t border-[#e0e0e0] h-20 items-center">
        {/* Animated Indicator Line */}
        <Animated.View
          className={"absolute bg-lightBlue h-1 rounded-lg"}
          style={{
            width: LINE_WIDTH,
            top: -1, // Sits exactly on the top border
            transform: [{ translateX: lineX }],
          }}
        />

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const iconConfig = iconMap[route.name]; // Get the full config object

          const iconName: any = isFocused
            ? iconConfig?.focused
            : iconConfig?.unfocused;
          const iconSize = iconConfig?.size || 24; // Fallback to 24 if not defined

          const onPress = async () => {
            if (isFocused) return;

            if (tabsDisabled) {
              return;
            }

            if (PROTECTED_TABS.has(route.name)) {
              const isLoggedIn = await isUserAuthenticated();
              if (!isLoggedIn) {
                setShowAuthSheet(true);
                return;
              }
            }

            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              disabled={tabsDisabled}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                opacity: tabsDisabled ? 0.5 : 1,
              }}
            >
              <Animated.View
                style={{
                  transform: [
                    { scale: scales[index] },
                    { translateY: translateYs[index] },
                  ],
                  opacity: opacities[index],
                }}
              >
                <Ionicons
                  name={iconName}
                  size={iconSize} // Use the custom size here
                  color={isFocused ? "#3db5e7" : "#888"}
                />
              </Animated.View>
            </Pressable>
          );
        })}
      </View>

      <AuthRequiredBottomSheet
        visible={showAuthSheet}
        onClose={() => setShowAuthSheet(false)}
      />
    </>
  );
}
