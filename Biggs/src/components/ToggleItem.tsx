import { Switch, Text, View } from "react-native";

type ToggleItemProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export const ToggleItem = ({
  label,
  value,
  onValueChange,
}: ToggleItemProps) => {
  return (
    <View className="w-full flex-row items-center justify-between py-4 border-b border-gray-200">
      <Text className="text-base text-gray-800 font-kanitMedium">{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#ccc", true: "#4ade80" }}
        thumbColor={value ? "#22c55e" : "#f4f4f5"}
      />
    </View>
  );
};
