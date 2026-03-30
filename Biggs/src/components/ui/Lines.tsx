import { Text, View } from "react-native";

export function HorizontalLine() {
  return (
    <View className="w-full items-center">
      <View className="w-[90%] bg-dirtyWhite border-b-[3px] border-gray-300 rounded-full" />
    </View>
  );
}

export function HorizontalOrLine() {
  return (
    <View className="w-full flex-row items-center justify-center gap-1">
      <View className="w-[50%] bg-dirtyWhite border-b-[3px] border-gray-300 rounded-full" />
      <View className="">
        <Text className="text-gray-400 font-kanit text-xl justify-center">
          or
        </Text>
      </View>
      <View className="w-[50%] bg-dirtyWhite border-b-[3px] border-gray-300 rounded-full" />
    </View>
  );
}
