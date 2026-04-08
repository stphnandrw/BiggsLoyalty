import { FontAwesome6 } from "@expo/vector-icons";
import { Animated, Dimensions, Text, TouchableOpacity, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TAB_WIDTH = (SCREEN_WIDTH * 0.9) / 2;

export type Tab = {
  key: string;
  label: string;
  icon?: string | null;
};

type VoucherTabBarProps = {
  tabs: Tab[];
  activeTab: number;
  onTabPress: (index: number) => void;
  pillAnim: Animated.Value;
};

export function VoucherTabBar({ tabs, activeTab, onTabPress, pillAnim }: VoucherTabBarProps) {
  return (
    <View className="w-[90%] self-center mb-4">
      <View className="flex-row rounded-xl border border-gray-200 overflow-hidden relative h-11">
        {/* Sliding pill background */}
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: TAB_WIDTH,
            transform: [{ translateX: pillAnim }],
          }}
          className="bg-darkBlue rounded-xl"
        />

        {/* Tab buttons */}
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.key}
            className="flex-1 items-center justify-center flex-row gap-1.5 z-10"
            onPress={() => onTabPress(index)}
            activeOpacity={0.8}
          >
            {tab.icon && (
              <FontAwesome6
                name={tab.icon}
                size={13}
                color={activeTab === index ? "white" : "#00008B"}
                solid={activeTab === index}
              />
            )}
            <Text
              className={`font-kanitMedium text-sm uppercase tracking-wide ${
                activeTab === index ? "text-white" : "text-darkBlue"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
