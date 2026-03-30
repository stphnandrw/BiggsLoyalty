import { GiftCard } from "@/src/components/ui/Cards";
import { SearchInput } from "@/src/components/ui/Inputs";
import { FontAwesome6 } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type Promo = {
  promo_id: number;
  promo_name: string;
  description: string;
  required_points: number;
  image_url: string;
  favorite_id?: number;
  [key: string]: any;
};

type PromoPageContentProps = {
  searchPlaceholder: string;
  onSearchChange: (text: string) => void;
  promos: Promo[];
  favoritePromoIds: number[];
  emptyMessage: string;
  onViewPromo: () => void;
  onToggleFavorite: (promoId: number, isFavorite: boolean) => void;
  scope: "all" | "liked";
};

function getPromoCardKey(promo: Promo, index: number, scope: string): string {
  if (promo.favorite_id) return `${scope}-favorite-${promo.favorite_id}`;
  if (promo.promo_id) return `${scope}-promo-${promo.promo_id}-${index}`;
  return `${scope}-index-${index}`;
}

export function PromoPageContent({
  searchPlaceholder,
  onSearchChange,
  promos,
  favoritePromoIds,
  emptyMessage,
  onViewPromo,
  onToggleFavorite,
  scope,
}: PromoPageContentProps) {
  // Biggs Promos tab → swipe right to like
  // Liked Promos tab → swipe left to unlike
  const swipeDirection = scope === "all" ? "right" : "left";

  return (
    <View className="flex-1">
      <SearchInput
        inputName={searchPlaceholder}
        inputWidth="90%"
        onChangeText={onSearchChange}
        icon={<FontAwesome6 name="magnifying-glass" size={20} color="gray" />}
      />
      <ScrollView className="w-full flex-1">
        <View className="items-center">
          {promos.length > 0 ? (
            promos.map((promo, index) => (
              <GiftCard
                key={getPromoCardKey(promo, index, scope)}
                onPress={onViewPromo}
                promo_name={promo.promo_name}
                description={promo.description}
                required_points={promo.required_points}
                image_url={promo.image_url}
                isRedeemed={false}
                isFavorited={favoritePromoIds.includes(promo.promo_id)}
                swipeDirection={swipeDirection}
                onToggleFavorite={() =>
                  onToggleFavorite(
                    promo.promo_id,
                    favoritePromoIds.includes(promo.promo_id),
                  )
                }
              />
            ))
          ) : (
            <View className="flex-1 items-center justify-center mt-24 px-8">
              <FontAwesome6 name="heart" size={48} color="#d1d5db" />
              <Text className="text-gray-400 font-kanitMedium text-lg mt-4 text-center">
                {emptyMessage}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
