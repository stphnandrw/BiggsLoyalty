import { Image, ImageSource } from "expo-image";
import { useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import LoadingOverlay from "./LoadingOverlay";

const { width: screenWidth } = Dimensions.get("window");

// ─── Types ───────────────────────────────────────────────────────────────────

export type CarouselImageSource = { uri: string } | number;

export type CarouselItem = {
  id?: string | number;
  image: CarouselImageSource;
  /** Shown as a bold overlay label at the bottom of the slide */
  title?: string;
  /** Shown below the title in portrait mode */
  subtitle?: string;
  /** Body description — used in promo variant */
  description?: string;
  /** CTA button label — used in promo variant */
  ctaLabel?: string;
};

export type CarouselVariant = "landscape" | "portrait" | "promo";

export type AppCarouselProps = {
  data: CarouselItem[];

  /**
   * "landscape" — wide/horizontal slides (default).
   * "portrait"  — tall cards shown 1-at-a-time with peek of adjacent slides.
   * "promo"     — structured card: image top, title + description middle, CTA bottom.
   */
  variant?: CarouselVariant;

  /** Horizontal width of the carousel container. Defaults to screenWidth - 32 */
  width?: number;
  /**
   * Aspect ratio used to derive slide height.
   * - landscape default: 1.5  (3:2, wider than tall)
   * - portrait  default: 0.65 (2:3, taller than wide)
   * - promo: ignored; card height is fixed
   */
  aspectRatio?: number;

  /** Show pagination dots. Defaults to false */
  showPagination?: boolean;

  /** Auto-advance slides. Defaults to true */
  autoPlay?: boolean;
  /** Milliseconds between slides when autoPlay is true. Defaults to 5000 */
  autoPlayInterval?: number;

  /** Called when a slide is pressed */
  onItemPress?: (item: CarouselItem, index: number) => void;

  /** Called when the CTA button is pressed — promo variant only */
  onCtaPress?: (item: CarouselItem, index: number) => void;

  /** Fills parent container width via onLayout measurement */
  fullWidth?: boolean;
};

// ─── Image Source Helper ──────────────────────────────────────────────────────

/**
 * Safely resolves a CarouselImageSource into an expo-image–compatible source.
 * - Local assets (number) are returned as-is.
 * - Remote URIs get an optional downsample width to reduce memory usage.
 */
const getSource = (
  source: CarouselImageSource,
  downsampleWidth?: number,
): ImageSource | number => {
  if (typeof source === "number") {
    return source;
  }
  return {
    uri: source.uri,
    width: downsampleWidth ?? undefined,
  };
};

// ─── Promo Pagination (animated pill dots) ───────────────────────────────────
// Note: Animated.View does not support className — animated width/color stay in style

type PromoPaginationProps = {
  index: number;
  count: number;
  progress: SharedValue<number>;
  onPress: (index: number) => void;
};

const PromoPaginationDot = ({
  index,
  count,
  progress,
  onPress,
}: PromoPaginationProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = Math.round(progress.value) % count === index;
    return {
      width: isActive ? 18 : 6,
      backgroundColor: isActive ? "#1a3a6b" : "#c8d0dc",
      opacity: isActive ? 1 : 0.6,
    };
  });

  return (
    <TouchableOpacity onPress={() => onPress(index)} hitSlop={8}>
      <Animated.View style={[{ height: 6, borderRadius: 3 }, animatedStyle]} />
    </TouchableOpacity>
  );
};

// ─── Pagination Dot (landscape/portrait) ─────────────────────────────────────

type PaginationDotProps = {
  index: number;
  progress: SharedValue<number>;
  onPress: (index: number) => void;
};

const PaginationDot = ({ index, progress, onPress }: PaginationDotProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = Math.round(progress.value) === index;
    return { backgroundColor: isActive ? "#f1f1f1" : "#262626" };
  });

  return (
    <TouchableOpacity onPress={() => onPress(index)} hitSlop={8}>
      <Animated.View
        style={[{ width: 25, height: 4, borderRadius: 2 }, animatedStyle]}
      />
    </TouchableOpacity>
  );
};

// ─── Portrait Pagination Pill ─────────────────────────────────────────────────

type PortraitPaginationProps = {
  index: number;
  total: number;
  progress: SharedValue<number>;
  onPress: (index: number) => void;
};

const PortraitPaginationPill = ({
  index,
  total,
  progress,
  onPress,
}: PortraitPaginationProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = Math.round(progress.value) === index;
    return {
      width: isActive ? 20 : 6,
      backgroundColor: isActive ? "#fff" : "rgba(255,255,255,0.4)",
    };
  });

  return (
    <TouchableOpacity onPress={() => onPress(index)} hitSlop={8}>
      <Animated.View style={[{ height: 6, borderRadius: 3 }, animatedStyle]} />
    </TouchableOpacity>
  );
};

// ─── Landscape Slide ─────────────────────────────────────────────────────────

type LandscapeSlideProps = {
  item: CarouselItem;
  index: number;
  width: number;
  height: number;
  onItemPress?: (item: CarouselItem, index: number) => void;
};

const LandscapeSlide = ({
  item,
  index,
  width,
  height,
  onItemPress,
}: LandscapeSlideProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Pressable
      onPress={() => onItemPress?.(item, index)}
      disabled={!onItemPress}
      className="flex-1 rounded-lg overflow-hidden"
    >
      {/* aspectRatio is a runtime value — must stay in style */}
      <Image
        source={getSource(item.image, width * 0.05)}
        style={{ width: "100%", aspectRatio: width / height }}
        contentFit="cover"
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
      />
      {isLoading && (
        <View className="absolute inset-0">
          <LoadingOverlay />
        </View>
      )}
      {item.title ? (
        <View className="absolute bottom-0 left-0 right-0 bg-[rgba(10,24,60,0.75)] px-3 py-2">
          <Text className="text-white text-xl font-kanitBold">
            {item.title}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
};

// ─── Portrait Slide ───────────────────────────────────────────────────────────

type PortraitSlideProps = {
  item: CarouselItem;
  index: number;
  slideWidth: number;
  slideHeight: number;
  onItemPress?: (item: CarouselItem, index: number) => void;
};

const PortraitSlide = ({
  item,
  index,
  slideWidth,
  slideHeight,
  onItemPress,
}: PortraitSlideProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    // slideWidth/slideHeight are dynamic — keep in style; everything else className
    <Pressable
      onPress={() => onItemPress?.(item, index)}
      disabled={!onItemPress}
      className="rounded-2xl overflow-hidden"
      style={{ width: slideWidth, height: slideHeight, elevation: 6 }}
    >
      <Image
        source={getSource(item.image, slideWidth * 0.05)}
        className="w-full h-full"
        contentFit="cover"
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
      />
      {isLoading && (
        <View className="absolute inset-0">
          <LoadingOverlay />
        </View>
      )}
      {(item.title || item.subtitle) && (
        <View className="absolute bottom-0 left-0 right-0 px-3.5 pt-10 pb-3.5 bg-[rgba(0,0,0,0.45)]">
          {item.title && (
            <Text
              className={`text-white text-lg font-kanitBold ${item.subtitle ? "mb-0.5" : ""}`}
              numberOfLines={2}
            >
              {item.title}
            </Text>
          )}
          {item.subtitle && (
            <Text
              className="text-white/80 text-sm font-kanit"
              numberOfLines={2}
            >
              {item.subtitle}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
};

// ─── Promo Slide ──────────────────────────────────────────────────────────────

const PROMO_CARD_WIDTH = 300;
const PROMO_IMAGE_HEIGHT = 200;
const PROMO_CARD_HEIGHT = 420;

type PromoSlideProps = {
  item: CarouselItem;
  index: number;
  width?: number;
  onItemPress?: (item: CarouselItem, index: number) => void;
  onCtaPress?: (item: CarouselItem, index: number) => void;
};

const PromoSlide = ({
  item,
  index,
  width = PROMO_CARD_WIDTH,
  onItemPress,
  onCtaPress,
}: PromoSlideProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Pressable
      onPress={() => onItemPress?.(item, index)}
      disabled={!onItemPress}
      className="bg-white overflow-hidden rounded-2xl"
      style={{
        width,
        height: PROMO_CARD_HEIGHT,
      }}
    >
      {/* ── Image section ── */}
      <View
        className="w-full overflow-hidden"
        style={{ height: PROMO_IMAGE_HEIGHT }}
      >
        <Image
          source={getSource(item.image, width * 0.05)}
          style={{
            width: "100%",
            height: PROMO_IMAGE_HEIGHT,
          }}
          contentFit="cover"
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => setIsLoading(false)}
        />
        {isLoading && (
          <View className="absolute inset-0">
            <LoadingOverlay />
          </View>
        )}
      </View>

      {/* ── Text + CTA section ── */}
      <View className="flex-1 px-[18px] pt-4 pb-3 justify-between">
        <View className="flex-1">
          {item.title && (
            <Text
              className="text-[#0f1f3d] text-[17px] font-kanitBold mb-2 leading-snug"
              numberOfLines={2}
            >
              {item.title}
            </Text>
          )}
          {(item.description ?? item.subtitle) ? (
            <Text
              className="text-[#5a6478] text-[13px] font-kanit leading-[19px]"
              numberOfLines={5}
            >
              {item.description ?? item.subtitle}
            </Text>
          ) : null}
        </View>

        {/* ── CTA Button ── */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            onCtaPress?.(item, index);
          }}
          className="mt-3.5 bg-[#1a3a6b] active:bg-[#162d58] rounded-[10px] py-3 items-center"
        >
          <Text className="text-white text-sm font-kanitBold tracking-wide">
            {item.ctaLabel ?? "Learn More"}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

// ─── AppCarousel ──────────────────────────────────────────────────────────────

export default function AppCarousel({
  data,
  variant = "landscape",
  width = screenWidth - 32,
  aspectRatio,
  showPagination = false,
  autoPlay = true,
  autoPlayInterval = 5000,
  onItemPress,
  onCtaPress,
  fullWidth = false,
}: AppCarouselProps) {
  const isPortrait = variant === "portrait";
  const isPromo = variant === "promo";

  // ── Dimensions ──────────────────────────────────────────────────────────────
  const PEEK_RATIO = 0.15;
  const slideWidth = isPortrait ? width * (1 - PEEK_RATIO * 2) : width;
  const resolvedAspectRatio = aspectRatio ?? (isPortrait ? 0.65 : 1.5);
  const slideHeight = isPortrait
    ? slideWidth / resolvedAspectRatio
    : width / resolvedAspectRatio;

  const carouselWidth = isPromo ? width : isPortrait ? slideWidth : width;
  const containerHeight = isPromo ? PROMO_CARD_HEIGHT : slideHeight;
  const containerWidth = isPromo
    ? fullWidth
      ? ("100%" as any)
      : width
    : fullWidth
      ? ("100%" as any)
      : width;

  const progress = useSharedValue<number>(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  const handlePaginationPress = (index: number) => {
    carouselRef.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const loop = data.length > 1;

  return (
    // containerWidth is dynamic — keep in style; alignment via className
    <View className="items-center" style={{ width: containerWidth }}>
      <Carousel
        ref={carouselRef}
        width={carouselWidth}
        height={containerHeight}
        autoPlay={autoPlay && loop}
        autoPlayInterval={autoPlayInterval}
        data={data}
        loop={loop}
        pagingEnabled
        snapEnabled
        style={
          isPortrait
            ? { width, height: containerHeight, overflow: "visible" }
            : {
                width: isPromo ? PROMO_CARD_WIDTH : width,
                height: containerHeight,
              }
        }
        onProgressChange={(_, absoluteProgress) => {
          progress.value = absoluteProgress;
        }}
        renderItem={({ item, index }) => {
          if (isPromo) {
            return (
              <PromoSlide
                item={item}
                index={index}
                width={carouselWidth}
                onItemPress={onItemPress}
                onCtaPress={onCtaPress}
              />
            );
          }
          if (isPortrait) {
            return (
              <View className="flex-1 items-center justify-center">
                <PortraitSlide
                  item={item}
                  index={index}
                  slideWidth={slideWidth}
                  slideHeight={slideHeight}
                  onItemPress={onItemPress}
                />
              </View>
            );
          }
          return (
            <LandscapeSlide
              item={item}
              index={index}
              width={width}
              height={containerHeight}
              onItemPress={onItemPress}
            />
          );
        }}
      />

      {/* ── Pagination ──────────────────────────────────────────────────────── */}
      {showPagination && data.length > 1 && (
        // marginTop is dynamic — keep in style
        <View
          className="flex-row items-center gap-1.5"
          style={{ marginTop: isPromo ? 14 : isPortrait ? 12 : 10 }}
        >
          {isPromo
            ? data.map((_, i) => (
                <PromoPaginationDot
                  key={i}
                  index={i}
                  count={data.length}
                  progress={progress}
                  onPress={handlePaginationPress}
                />
              ))
            : isPortrait
              ? data.map((_, i) => (
                  <PortraitPaginationPill
                    key={i}
                    index={i}
                    total={data.length}
                    progress={progress}
                    onPress={handlePaginationPress}
                  />
                ))
              : data.map((_, i) => (
                  <PaginationDot
                    key={i}
                    index={i}
                    progress={progress}
                    onPress={handlePaginationPress}
                  />
                ))}
        </View>
      )}
    </View>
  );
}
