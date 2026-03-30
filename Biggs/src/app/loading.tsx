import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const SQUARES = ["bg-red-700", "bg-saffron", "bg-lightBlue"];
const BOUNCE = { height: -8, duration: 400, stagger: 150 };
const easeOut = Easing.out(Easing.quad);
const easeIn = Easing.in(Easing.quad);
const half = BOUNCE.duration / 2;

const bounceSequence = (delay: number) =>
  withDelay(
    delay,
    withRepeat(
      withSequence(
        withTiming(-BOUNCE.height, { duration: half, easing: easeOut }),
        withTiming(0, { duration: half, easing: easeIn }),
        withTiming(0, { duration: BOUNCE.stagger }),
      ),
      -1,
      false,
    ),
  );

const wiggleSequence = withRepeat(
  withSequence(
    withTiming(-15, { duration: 200, easing: Easing.inOut(Easing.quad) }),
    withTiming(15, { duration: 400, easing: Easing.inOut(Easing.quad) }),
    withTiming(0, { duration: 200, easing: Easing.inOut(Easing.quad) }),
  ),
  -1,
  false,
);

function BouncingSquare({ color, delay }: { color: string; delay: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = bounceSequence(delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View className={`w-4 h-4 ${color}`} style={animatedStyle} />;
}

export default function LoadingScreen() {
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = wiggleSequence;
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <SafeAreaView
      className="flex-1 items-center justify-center bg-black"
      edges={["top", "left", "right"]}
    >
      <View className="flex-1 w-full items-center justify-center bg-white">
        <View className="items-center gap-4">
          <Animated.Image
            style={[{ width: 100, height: 150 }, animatedStyle]}
            source={require("../../assets/images/cat1.png")}
            resizeMode="contain"
          />
          <View className="flex-row items-end gap-2 h-9">
            {SQUARES.map((color, i) => (
              <BouncingSquare
                key={color}
                color={color}
                delay={i * BOUNCE.stagger}
              />
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
