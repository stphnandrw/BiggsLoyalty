import { FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: PAGE_WIDTH } = Dimensions.get("window");

// â”€â”€â”€ TUNABLE: How far (in % of screen width) the user must drag before the
//              card flies off and the action triggers. Lower = easier to trigger.
//              e.g. 0.25 = 25%, 0.4 = 40%
const SWIPE_THRESHOLD = PAGE_WIDTH * 0.3;

interface CardProps {
  recipientName?: string;
  senderName?: string;
  balance?: number;
  currency?: string;
  occasion?: string;
  voucher_name?: string;
  description?: string;
  required_points?: number | string;
  image_url?: string;
  imageRef?: any;
  logoRef?: any;
  isRedeemed?: boolean;
  isFavorited?: boolean;
  /** "right" = Biggs Vouchers (like), "left" = Liked Vouchers (unlike) */
  swipeDirection?: string;
  onPress?: () => void;
  onToggleFavorite?: () => void;
}

interface ProductCardProps {
  productName?: string;
  subtitle1?: string;
  subtitle2?: string;
  price?: string;
  price2?: string;
  imageRef?: string;
  showFavoriteAction?: boolean;
  isFavorited?: boolean;
  isFavoriteActionDisabled?: boolean;
  onFavoriteToggle?: () => void;
  onAdd?: () => void;
}

// â”€â”€â”€ Gift Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function GiftCard({
  voucher_name,
  required_points,
  isRedeemed = false,
  isFavorited = false,
  swipeDirection,
  onPress,
  onToggleFavorite,
}: CardProps) {
  const swipeEnabled = swipeDirection === "left" || swipeDirection === "right";

  const formattedPoints =
    typeof required_points === "number"
      ? required_points.toLocaleString()
      : required_points;

  const checkerCells = Array.from({ length: 12 });

  // â”€â”€ Shared values (these drive all animations) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotateZ = useSharedValue(0);
  const opacity = useSharedValue(1);
  const leftHintOpacity = useSharedValue(0);
  const rightHintOpacity = useSharedValue(0);

  const fireCallback = () => {
    onToggleFavorite?.();
  };

  // â”€â”€ Fly-off animation (plays when swipe threshold is crossed) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const flyOff = (direction: "left" | "right") => {
    "worklet";
    const target = direction === "right" ? PAGE_WIDTH * 1.3 : -PAGE_WIDTH * 1.3;

    // TUNABLE: How far off-screen the card travels. 1.3 = 130% of screen width.
    //          Increase for a more dramatic exit, decrease to stop just off-edge.
    translateX.value = withTiming(target, {
      // TUNABLE: Duration of the fly-off slide in ms. Lower = snappier exit.
      duration: 320,
    });

    opacity.value = withTiming(
      0,
      {
        // TUNABLE: Duration of the fade-out. Should match or be slightly less
        //          than the slide duration above so they finish together.
        duration: 320,
      },
      (finished) => {
        if (finished) {
          runOnJS(fireCallback)();
          // Reset to rest state (invisible snap-back before fade-in)
          translateX.value = 0;
          translateY.value = 0;
          rotateZ.value = 0;
          opacity.value = withTiming(1, {
            // TUNABLE: How quickly the card fades back in after reset.
            duration: 200,
          });
          leftHintOpacity.value = 0;
          rightHintOpacity.value = 0;
        }
      },
    );
  };

  // â”€â”€ Snap-back animation (plays when swipe is released below threshold) â”€â”€â”€â”€â”€
  const snapBack = () => {
    "worklet";
    translateX.value = withSpring(0, {
      // TUNABLE: damping controls bounciness â€” lower = more bounce, higher = less.
      //          stiffness controls speed of snap â€” higher = faster return.
      damping: 15,
      stiffness: 200,
    });
    translateY.value = withSpring(0, { damping: 15, stiffness: 200 });
    rotateZ.value = withSpring(0, { damping: 15, stiffness: 200 });
    leftHintOpacity.value = withTiming(0, {
      // TUNABLE: How quickly the hint labels fade out on snap-back.
      duration: 150,
    });
    rightHintOpacity.value = withTiming(0, { duration: 150 });
  };

  // â”€â”€ Pan gesture (updates animations while the user is actively dragging) â”€â”€â”€
  const panGesture = Gesture.Pan()
    .enabled(swipeEnabled)
    .activeOffsetX([-12, 12])
    .failOffsetY([-8, 8]) // Prevent vertical drags from activating the gesture
    .onUpdate((e) => {
      // Clamp drag to the allowed direction only
      const dx =
        swipeDirection === "right"
          ? Math.max(0, e.translationX)
          : swipeDirection === "left"
            ? Math.min(0, e.translationX)
            : e.translationX;

      translateX.value = dx;

      // â”€â”€ Vertical lift â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      // TUNABLE: The card floats upward as you drag. The second value in the
      //          output range [-10] is the max upward offset in px. Set to 0
      //          to disable the lift entirely.
      translateY.value = interpolate(
        Math.abs(dx),
        [0, PAGE_WIDTH * 0.5],
        [0, 0],
        Extrapolation.CLAMP,
      );

      // â”€â”€ Tilt / rotation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      // TUNABLE: The output range [-12, 0, 12] controls max tilt in degrees.
      //          Reduce to e.g. [-5, 0, 5] for a subtle tilt, or set to
      //          [0, 0, 0] to disable rotation completely.
      rotateZ.value = interpolate(
        dx,
        [-PAGE_WIDTH * 0.5, 0, PAGE_WIDTH * 0.5],
        [0, 0, 0],
        Extrapolation.CLAMP,
      );

      // â”€â”€ Hint label fade-in â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      // TUNABLE: The input range controls at what drag distance the hint starts
      //          fading in. Currently starts at 30% of SWIPE_THRESHOLD and
      //          reaches full opacity at SWIPE_THRESHOLD.
      //          Move the 0.3 multiplier closer to 1 to delay the fade-in.
      if (swipeDirection !== "right") {
        leftHintOpacity.value = interpolate(
          dx,
          [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.3],
          [1, 0],
          Extrapolation.CLAMP,
        );
      }
      if (swipeDirection !== "left") {
        rightHintOpacity.value = interpolate(
          dx,
          [SWIPE_THRESHOLD * 0.3, SWIPE_THRESHOLD],
          [0, 1],
          Extrapolation.CLAMP,
        );
      }
    })
    .onEnd((e) => {
      const dx =
        swipeDirection === "right"
          ? Math.max(0, e.translationX)
          : swipeDirection === "left"
            ? Math.min(0, e.translationX)
            : e.translationX;

      if (swipeDirection !== "left" && dx > SWIPE_THRESHOLD) {
        flyOff("right");
      } else if (swipeDirection !== "right" && dx < -SWIPE_THRESHOLD) {
        flyOff("left");
      } else {
        snapBack();
      }
    });

  // â”€â”€ Animated styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotateZ: `${rotateZ.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const leftHintStyle = useAnimatedStyle(() => ({
    opacity: leftHintOpacity.value,
  }));

  const rightHintStyle = useAnimatedStyle(() => ({
    opacity: rightHintOpacity.value,
  }));

  return (
    <View className="w-[90%] mb-3" style={{ alignSelf: "center" }}>
      {/* â”€â”€ Action hints behind the card â”€â”€ */}
      <View
        className="absolute inset-0 flex-row justify-between items-center px-5 rounded-[18px]"
        pointerEvents="none"
      >
        {swipeEnabled && swipeDirection !== "right" ? (
          <Animated.View
            style={leftHintStyle}
            className="flex-row items-center gap-1"
          >
            <FontAwesome6 name="heart-crack" size={18} color="#FF3B5C" />
            <Text className="text-[#FF3B5C] font-kanitBold text-sm uppercase tracking-widest">
              Unlike
            </Text>
          </Animated.View>
        ) : (
          <View />
        )}

        {swipeEnabled && swipeDirection !== "left" && (
          <Animated.View
            style={rightHintStyle}
            className="flex-row items-center gap-1"
          >
            <Text className="text-[#29AAE1] font-kanitBold text-sm uppercase tracking-widest">
              Like
            </Text>
            <FontAwesome6 name="heart" size={18} color="#29AAE1" solid />
          </Animated.View>
        )}
      </View>

      {/* â”€â”€ Draggable card â”€â”€ */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[cardStyle, { borderRadius: 18, overflow: "hidden" }]}
        >
          <Pressable
            onPress={onPress}
            className="flex-row w-full h-40"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            {/* â”€â”€ LEFT: Sky blue hero panel â”€â”€ */}
            <View className="w-[210px] bg-[#29AAE1] px-4 pt-4 pb-4 justify-between overflow-hidden">
              <View>
                <Text className="text-white/60 text-[9px] font-kanitMedium uppercase tracking-[2.5px] mb-0.5">
                  Points Required
                </Text>
                <Text className="text-white text-[44px] font-kanitBold leading-none tracking-tighter">
                  {formattedPoints}
                </Text>
              </View>

              <View className="absolute bottom-0 right-0 flex-row flex-wrap w-14 opacity-30">
                {checkerCells.map((_, i) => (
                  <View
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      (Math.floor(i / 4) + (i % 4)) % 2 === 0
                        ? "bg-white"
                        : "bg-transparent"
                    }`}
                  />
                ))}
              </View>

              <View>
                <Text className="text-white/60 text-[9px] font-kanitMedium uppercase tracking-[2.5px] mb-0.5">
                  Voucher
                </Text>
                <Text
                  className="text-white text-[22px] font-kanitBold uppercase leading-tight tracking-wide"
                  numberOfLines={2}
                >
                  {voucher_name}
                </Text>
              </View>
            </View>

            {/* â”€â”€ RIGHT: Cream brand panel â”€â”€ */}
            <View className="flex-1 bg-[#F5F0E8] items-center justify-center py-3.5 px-2.5">
              <Image
                source={require("../../../assets/images/biggs-logo.png")}
                className="w-20 h-12"
                resizeMode="contain"
              />
            </View>

            {/* â”€â”€ Redeemed overlay â”€â”€ */}
            {isRedeemed && (
              <View className="absolute inset-0 bg-[#1A2F5E]/75 items-center justify-center rounded-[18px] z-10">
                <View className="border-l-[3px] border-[#29AAE1] pl-3">
                  <Text className="text-white text-2xl font-kanitBold uppercase tracking-[3px]">
                    Redeemed
                  </Text>
                </View>
              </View>
            )}
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

// â”€â”€â”€ Discount Voucher Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function VoucherCard({
  description = "50% Discount",
  isRedeemed = false,
  imageRef,
  logoRef,
  onPress,
}: {
  description?: string;
  isRedeemed?: boolean;
  imageRef?: any;
  logoRef?: any;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl overflow-hidden w-72 h-32 bg-red-400 shadow-md"
    >
      {imageRef && (
        <Image
          source={imageRef}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
      )}

      <View className="flex-1 p-4 justify-between">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-lg font-kanitBold opacity-70">
            {description}
          </Text>

          {logoRef ? (
            <Image source={logoRef} className="w-12 h-6" resizeMode="contain" />
          ) : (
            <View className="bg-red-700 rounded-xl px-2 py-1">
              <Text className="text-white font-extrabold text-xs tracking-widest">
                WIMPY
              </Text>
            </View>
          )}
        </View>

        {isRedeemed && (
          <Text className="text-white text-2xl font-extrabold border-l-4 border-white pl-2">
            Redeemed
          </Text>
        )}
      </View>
    </Pressable>
  );
}
// â”€â”€â”€ Product Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function ProductCard({
  productName,
  subtitle1,
  subtitle2,
  price,
  price2,
  imageRef,
  showFavoriteAction = true,
  isFavorited = false,
  isFavoriteActionDisabled = false,
  onFavoriteToggle,
  onAdd,
}: ProductCardProps) {
  const [favorited, setFavorited] = useState(isFavorited);

  useEffect(() => {
    setFavorited(isFavorited);
  }, [isFavorited]);

  const handleFavorite = () => {
    if (isFavoriteActionDisabled || favorited) {
      return;
    }
    onFavoriteToggle?.();
  };

  const handleCardPress = () => {
    if (showFavoriteAction) {
      handleFavorite();
      return;
    }

    onAdd?.();
  };

  return (
    <Pressable
      className="w-full h-72 rounded-lg shadow-lg overflow-hidden relative"
      onPress={handleCardPress}
      disabled={showFavoriteAction && (isFavoriteActionDisabled || favorited)}
    >
      {/* Image fills entire card */}
      {imageRef ? (
        <Image
          source={{
            uri: "https://biggs.ph/biggs_website/controls/uploads/" + imageRef,
          }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          className="items-center justify-center bg-[#2a2a2a]"
        >
          <Text className="text-3xl font-kanitBold text-white">No Image</Text>
        </View>
      )}

      {/* Favorite action button */}
      {showFavoriteAction && (
        <View
          className="absolute top-3 right-3 bg-darkBlue py-[2px] px-3 rounded-3xl border-4 border-saffron flex-row items-center"
          style={{ opacity: isFavoriteActionDisabled || favorited ? 0.75 : 1 }}
        >
          <Text className="text-center font-kanitBold text-white">
            {favorited ? "Selected" : "Select"}
          </Text>
        </View>
      )}

      {favorited && showFavoriteAction && (
        <View className="absolute inset-0 bg-[#14284d]/65 items-center justify-center">
          <View className="bg-saffron px-4 py-2 rounded-2xl border-2 border-darkBlue">
            <Text className="text-darkBlue font-kanitBold uppercase tracking-wide">
              Selected
            </Text>
          </View>
        </View>
      )}

      {/* Info bar pinned to bottom */}
      <View
        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
        className="flex-row items-center justify-between px-4 py-3 bg-black/50"
      >
        <View className="flex-1 mr-2">
          <Text className="text-sm font-kanitBold text-white" numberOfLines={1}>
            {productName}
          </Text>
          {subtitle1 && (
            <Text className="text-xs text-gray-400 mt-0.5" numberOfLines={1}>
              {subtitle1}
            </Text>
          )}
          {subtitle2 && (
            <Text className="text-xs text-gray-400" numberOfLines={1}>
              {subtitle2}
            </Text>
          )}
        </View>
        <View className="items-end">
          <Text className="text-base font-extrabold text-yellow-400">
            {price}
          </Text>
          {price2 && <Text className="text-xs text-gray-400">{price2}</Text>}
        </View>
      </View>
    </Pressable>
  );
}
