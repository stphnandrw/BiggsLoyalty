import { HeaderBigLogo } from "@/src/components/layout/header";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PromoDetails() {
  return (
    <SafeAreaView
      className="flex-1 items-center justify-center bg-black"
      edges={["top", "left", "right"]}
    >
      <View className="w-full h-full bg-white">
        <HeaderBigLogo hasBackButton={true} hasNotifications={false} />
        <View className="w-full h-auto items-center justify-center mt-16">
          <Text className="text-darkBlue text-2xl leading-none font-kanitMedium uppercase">
            Promo Details
          </Text>
        </View>
        <View className="w-full h-auto items-center justify-center mb-6 px-6">
          <Text className="text-gray-700 text-base leading-relaxed text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
            consequatur autem vitae distinctio et saepe doloremque cupiditate
            quae provident reiciendis obcaecati cumque voluptas fugit, maiores
            nesciunt vero expedita labore ullam.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
