import { router } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

interface ButtonProps {
  buttonName: string;
  route?: any;
  icon?: any;
  buttonWidth?: any;
  fontUsed?: any;
  isCentered?: boolean;
  isSticky?: boolean;
  isFontSmall?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  onPress?: () => void;
}

const handlePress = (route?: any, customOnPress?: () => void) => {
  if (customOnPress) {
    customOnPress();
  } else if (route) {
    console.log(`Navigating to ${route}`);
    router.push(route);
  } else {
    console.warn("Button pressed, but no action defined.");
  }
};

// ─── NORMAL ───────────────────────────────────────────────────────────────────

export function NormalButton({
  buttonName,
  route,
  icon,
  buttonWidth,
  isCentered,
  onPress: customOnPress,
  isSticky,
}: ButtonProps) {
  return (
    <View
      className={`w-full items-center mb-4 ${isSticky ? "sticky bottom-4" : ""}`}
    >
      <Pressable
        className="bg-blue-500 p-4 rounded-lg"
        style={{ width: buttonWidth }}
        onPress={() => handlePress(route, customOnPress)}
      >
        {icon && <View className="mr-2">{icon}</View>}
        <Text
          className={`${isCentered ? "text-center" : ""} text-white font-kanit`}
        >
          {buttonName}
        </Text>
      </Pressable>
    </View>
  );
}

// ─── PRIMARY ──────────────────────────────────────────────────────────────────

export function PrimaryButton({
  buttonName,
  route,
  icon,
  buttonWidth,
  fontUsed,
  isFontSmall,
  isCentered,
  onPress: customOnPress,
  isSticky,
  isDisabled,
}: ButtonProps) {
  return (
    <View
      className={`w-full items-center mb-4 ${isSticky ? "sticky bottom-4" : ""}`}
    >
      <Pressable
        className="bg-[#14284d] py-3 px-4 rounded-3xl border-8 border-saffron"
        style={{
          width: buttonWidth,
          opacity: isDisabled ? 0.5 : 1,
        }}
        disabled={isDisabled}
        onPress={() => handlePress(route, customOnPress)}
      >
        {icon && <View className="mr-2">{icon}</View>}
        <Text
          className={`${isCentered ? "text-center" : ""} text-white ${fontUsed || "font-kanit"} uppercase ${isFontSmall ? "text-xl" : "text-4xl"}`}
        >
          {buttonName}
        </Text>
      </Pressable>
    </View>
  );
}

export function MiniPrimaryButton({
  buttonName,
  route,
  onPress: customOnPress,
}: ButtonProps) {
  return (
    <View className="w-full items-center">
      <Pressable
        className="bg-darkBlue py-[2px] px-3 rounded-3xl border-4 border-saffron"
        onPress={() => handlePress(route, customOnPress)}
      >
        <Text className="text-center font-kanitBold text-white">
          {buttonName}
        </Text>
      </Pressable>
    </View>
  );
}

export function SmallPrimaryButton({
  buttonName,
  route,
  onPress: customOnPress,
  isDisabled,
}: ButtonProps) {
  return (
    <View className="w-full items-center">
      <Pressable
        className="w-full bg-darkBlue p-2 rounded-2xl border-4 border-saffron "
        onPress={() => handlePress(route, customOnPress)}
        disabled={isDisabled}
        style={{ opacity: isDisabled ? 0.5 : 1 }}
      >
        <Text className="text-center font-kanitBold text-lg text-white">
          {buttonName}
        </Text>
      </Pressable>
    </View>
  );
}

// ─── WARNING ──────────────────────────────────────────────────────────────────

export function WarningButton({
  buttonName,
  route,
  icon,
  buttonWidth,
  fontUsed,
  isFontSmall,
  isCentered,
  onPress: customOnPress,
  isSticky,
  isDisabled,
  isLoading,
}: ButtonProps) {
  return (
    <View
      className={`w-full items-center mb-4 ${isSticky ? "sticky bottom-4" : ""}`}
    >
      <Pressable
        className="bg-amber-400 py-3 px-4 rounded-3xl border-8 border-amber-600"
        style={{
          width: buttonWidth,
          opacity: isDisabled || isLoading ? 0.5 : 1,
        }}
        disabled={isDisabled || isLoading}
        onPress={() => handlePress(route, customOnPress)}
      >
        {icon && !isLoading && <View className="mr-2">{icon}</View>}
        {isLoading ? (
          <ActivityIndicator color="#78350f" />
        ) : (
          <Text
            className={`${isCentered ? "text-center" : ""} text-amber-900 ${fontUsed || "font-kanitBold"} uppercase ${isFontSmall ? "text-xl" : "text-4xl"}`}
          >
            {buttonName}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

export function MiniWarningButton({
  buttonName,
  route,
  onPress: customOnPress,
}: ButtonProps) {
  return (
    <View className="w-full items-center">
      <Pressable
        className="bg-amber-400 py-[2px] px-3 rounded-3xl border-4 border-amber-600"
        onPress={() => handlePress(route, customOnPress)}
      >
        <Text className="text-center font-kanitBold text-amber-900">
          {buttonName}
        </Text>
      </Pressable>
    </View>
  );
}

export function SmallWarningButton({
  buttonName,
  route,
  onPress: customOnPress,
}: ButtonProps) {
  return (
    <View className="w-full items-center">
      <Pressable
        className="bg-amber-400 w-full p-2 rounded-2xl border-4 border-amber-600"
        onPress={() => handlePress(route, customOnPress)}
      >
        <Text className="text-center font-kanitBold text-lg text-amber-900">
          {buttonName}
        </Text>
      </Pressable>
    </View>
  );
}

// ─── DANGER ───────────────────────────────────────────────────────────────────

export function DangerButton({
  buttonName,
  route,
  icon,
  buttonWidth,
  fontUsed,
  isFontSmall,
  isCentered,
  onPress: customOnPress,
  isSticky,
  isDisabled,
  isLoading,
}: ButtonProps) {
  return (
    <View
      className={`w-full items-center mb-4 ${isSticky ? "sticky bottom-4" : ""}`}
    >
      <Pressable
        className="bg-red-600 py-3 px-4 rounded-3xl border-8 border-red-900"
        style={{
          width: buttonWidth,
          opacity: isDisabled || isLoading ? 0.5 : 1,
        }}
        disabled={isDisabled || isLoading}
        onPress={() => handlePress(route, customOnPress)}
      >
        {icon && !isLoading && <View className="mr-2">{icon}</View>}
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            className={`${isCentered ? "text-center" : ""} text-white ${fontUsed || "font-kanitBold"} uppercase ${isFontSmall ? "text-xl" : "text-4xl"}`}
          >
            {buttonName}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

export function MiniDangerButton({
  buttonName,
  route,
  onPress: customOnPress,
}: ButtonProps) {
  return (
    <View className="w-full items-center">
      <Pressable
        className="bg-red-600 py-[2px] px-3 rounded-3xl border-4 border-red-900"
        onPress={() => handlePress(route, customOnPress)}
      >
        <Text className="text-center font-kanitBold text-white">
          {buttonName}
        </Text>
      </Pressable>
    </View>
  );
}

export function SmallDangerButton({
  buttonName,
  route,
  onPress: customOnPress,
}: ButtonProps) {
  return (
    <View className="w-full items-center">
      <Pressable
        className="bg-red-600 w-full p-2 rounded-2xl border-4 border-red-900"
        onPress={() => handlePress(route, customOnPress)}
      >
        <Text className="text-center font-kanitBold text-lg text-white">
          {buttonName}
        </Text>
      </Pressable>
    </View>
  );
}

// ─── SUCCESS ──────────────────────────────────────────────────────────────────

export function SuccessButton({
  buttonName,
  route,
  icon,
  buttonWidth,
  fontUsed,
  isFontSmall,
  isCentered,
  onPress: customOnPress,
  isSticky,
  isDisabled,
  isLoading,
}: ButtonProps) {
  return (
    <View
      className={`w-full items-center mb-4 ${isSticky ? "sticky bottom-4" : ""}`}
    >
      <Pressable
        className="bg-emerald-500 py-3 px-4 rounded-3xl border-8 border-emerald-800"
        style={{
          width: buttonWidth,
          opacity: isDisabled || isLoading ? 0.5 : 1,
        }}
        disabled={isDisabled || isLoading}
        onPress={() => handlePress(route, customOnPress)}
      >
        {icon && !isLoading && <View className="mr-2">{icon}</View>}
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            className={`${isCentered ? "text-center" : ""} text-white ${fontUsed || "font-kanitBold"} uppercase ${isFontSmall ? "text-xl" : "text-4xl"}`}
          >
            {buttonName}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

export function MiniSuccessButton({
  buttonName,
  route,
  onPress: customOnPress,
}: ButtonProps) {
  return (
    <View className="w-full items-center">
      <Pressable
        className="bg-emerald-500 py-[2px] px-3 rounded-3xl border-4 border-emerald-800"
        onPress={() => handlePress(route, customOnPress)}
      >
        <Text className="text-center font-kanitBold text-white">
          {buttonName}
        </Text>
      </Pressable>
    </View>
  );
}

export function SmallSuccessButton({
  buttonName,
  route,
  onPress: customOnPress,
}: ButtonProps) {
  return (
    <View className="w-full items-center">
      <Pressable
        className="bg-emerald-500 w-full p-2 rounded-2xl border-4 border-emerald-800"
        onPress={() => handlePress(route, customOnPress)}
      >
        <Text className="text-center font-kanitBold text-lg text-white">
          {buttonName}
        </Text>
      </Pressable>
    </View>
  );
}

// ─── INFO ─────────────────────────────────────────────────────────────────────

export function InfoButton({
  buttonName,
  route,
  icon,
  buttonWidth,
  fontUsed,
  isFontSmall,
  isCentered,
  onPress: customOnPress,
  isSticky,
  isDisabled,
  isLoading,
}: ButtonProps) {
  return (
    <View
      className={`w-full items-center mb-4 ${isSticky ? "sticky bottom-4" : ""}`}
    >
      <Pressable
        className="bg-sky-500 py-3 px-4 rounded-3xl border-8 border-sky-800"
        style={{
          width: buttonWidth,
          opacity: isDisabled || isLoading ? 0.5 : 1,
        }}
        disabled={isDisabled || isLoading}
        onPress={() => handlePress(route, customOnPress)}
      >
        {icon && !isLoading && <View className="mr-2">{icon}</View>}
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            className={`${isCentered ? "text-center" : ""} text-white ${fontUsed || "font-kanitBold"} uppercase ${isFontSmall ? "text-xl" : "text-4xl"}`}
          >
            {buttonName}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

export function MiniInfoButton({
  buttonName,
  route,
  onPress: customOnPress,
}: ButtonProps) {
  return (
    <View className="w-full items-center">
      <Pressable
        className="bg-sky-500 py-[2px] px-3 rounded-3xl border-4 border-sky-800"
        onPress={() => handlePress(route, customOnPress)}
      >
        <Text className="text-center font-kanitBold text-white">
          {buttonName}
        </Text>
      </Pressable>
    </View>
  );
}

export function SmallInfoButton({
  buttonName,
  route,
  onPress: customOnPress,
}: ButtonProps) {
  return (
    <View className="w-full items-center">
      <Pressable
        className="bg-sky-500 w-full p-2 rounded-2xl border-4 border-sky-800"
        onPress={() => handlePress(route, customOnPress)}
      >
        <Text className="text-center font-kanitBold text-lg text-white">
          {buttonName}
        </Text>
      </Pressable>
    </View>
  );
}

// ─── GHOST ────────────────────────────────────────────────────────────────────

export function GhostButton({
  buttonName,
  route,
  icon,
  buttonWidth,
  fontUsed,
  isFontSmall,
  isCentered,
  onPress: customOnPress,
  isSticky,
  isDisabled,
  isLoading,
}: ButtonProps) {
  return (
    <View
      className={`w-full items-center mb-4 ${isSticky ? "sticky bottom-4" : ""}`}
    >
      <Pressable
        className="bg-transparent py-3 px-4 rounded-3xl border-8 border-gray-400"
        style={{
          width: buttonWidth,
          opacity: isDisabled || isLoading ? 0.4 : 1,
        }}
        disabled={isDisabled || isLoading}
        onPress={() => handlePress(route, customOnPress)}
      >
        {icon && !isLoading && <View className="mr-2">{icon}</View>}
        {isLoading ? (
          <ActivityIndicator color="#9ca3af" />
        ) : (
          <Text
            className={`${isCentered ? "text-center" : ""} text-gray-400 ${fontUsed || "font-kanitBold"} uppercase ${isFontSmall ? "text-xl" : "text-4xl"}`}
          >
            {buttonName}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

export function MiniGhostButton({
  buttonName,
  route,
  onPress: customOnPress,
}: ButtonProps) {
  return (
    <View className="w-full items-center">
      <Pressable
        className="bg-transparent py-[2px] px-3 rounded-3xl border-4 border-gray-400"
        onPress={() => handlePress(route, customOnPress)}
      >
        <Text className="text-center font-kanitBold text-gray-400">
          {buttonName}
        </Text>
      </Pressable>
    </View>
  );
}

export function SmallGhostButton({
  buttonName,
  route,
  onPress: customOnPress,
}: ButtonProps) {
  return (
    <View className="w-full items-center">
      <Pressable
        className="bg-transparent w-full p-2 rounded-2xl border-4 border-gray-400"
        onPress={() => handlePress(route, customOnPress)}
      >
        <Text className="text-center font-kanitBold text-lg text-gray-400">
          {buttonName}
        </Text>
      </Pressable>
    </View>
  );
}
