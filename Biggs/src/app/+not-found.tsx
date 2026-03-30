import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFound404() {
  return (
    <SafeAreaView
      className="flex-1 items-center justify-center bg-black"
      edges={["top", "left", "right"]}
    >
      <Text className="text-2xl font-bold">404 - Not Found</Text>
    </SafeAreaView>
  );
}
