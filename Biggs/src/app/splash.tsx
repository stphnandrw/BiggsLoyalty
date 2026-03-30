import { router } from "expo-router";
import { useEffect } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.1, {
        duration: 800,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    router.push("/(auth)/login");
  };

  return (
    <SafeAreaView
      className="flex-1 items-center justify-center bg-black"
      edges={["top", "left", "right"]}
    >
      <Pressable
        className="w-full h-full items-center justify-center bg-lightBlue overflow-hidden"
        onPress={handlePress}
      >
        <Image
          className="w-full h-full ml-[350px] absolute rotate-[120deg] mt-[-550px] opacity-60"
          source={require("../../assets/images/white-splash-rounded.png")}
        />

        <View className="w-full h-20 top-0 absolute shadow-slate-800 shadow-sm rounded-b-3xl">
          <Image
            className="w-full h-20 "
            source={require("../../assets/images/mosaic-1.png")}
          />
        </View>

        <Animated.View className="items-center" style={animatedStyle}>
          <Text className="text-[62px] font-kanitExtraBold uppercase leading-none text-white">
            Welcome to
          </Text>
          <Text className="text-[54px] font-kanitExtraBold uppercase leading-none text-white">
            Biggs loyaty!
          </Text>
          <Text className="text-[56px] font-kanitExtraBold uppercase leading-none text-darkBlue">
            Press Screen
          </Text>
          <Text className="text-[33px] font-kanitExtraBold uppercase leading-none text-white">
            to start the program
          </Text>
        </Animated.View>

        <Image
          className="w-full h-full mr-[370px] absolute rotate-[-120deg] mt-[450px] opacity-60 -z-10"
          source={require("../../assets/images/white-splash-rounded.png")}
        />

        <Image
          className="w-full h-20 bottom-0 absolute"
          source={require("../../assets/images/mosaic-2.png")}
        />
      </Pressable>
    </SafeAreaView>
  );
}
