import { PromoPageContent } from "@/src/components/features/PromoPageContent";
import { PromoTabBar, Tab } from "@/src/components/features/PromoTabBar";
import { HeaderBigLogo } from "@/src/components/layout/header";
import LoadingOverlay from "@/src/components/ui/LoadingOverlay";
import { useAuthStatus } from "@/src/hooks/useAuthStatus";
import {
  addFavoritePromo,
  getPromosExcludingFavorites,
  getUserFavoritePromos,
  removeFavoritePromo,
} from "@/src/services/api/promos";
import { getItem } from "@/src/utils/asyncStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS: Tab[] = [
  { key: "current", label: "Biggs Promos", icon: null },
  { key: "liked", label: "Liked Promos", icon: "heart" },
];

const { width: screenWidth } = Dimensions.get("window");

export default function Promo() {
  const { isLoggedIn } = useAuthStatus();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [currentSearch, setCurrentSearch] = useState("");
  const [likedSearch, setLikedSearch] = useState("");
  const [tagUid, setTagUid] = useState<string | null>(null);

  const pagerRef = useRef<PagerView>(null);
  const pillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await getItem("userData");
        if (storedUser) {
          const parsed =
            typeof storedUser === "string"
              ? JSON.parse(storedUser)
              : storedUser;
          setTagUid(parsed.tag_uid || parsed.user_id?.toString() || null);
        }
      } catch (err) {
        console.error("Error loading userData:", err);
      }
    };
    loadUser();
  }, []);

  const { data: allPromos = [], isLoading: isLoadingPromos } = useQuery({
    queryKey: ["promos", tagUid],
    queryFn: () => getPromosExcludingFavorites(tagUid as string),
    enabled: !!tagUid,
    select: (data) => (Array.isArray(data) ? data : []),
  });

  const { data: favoritePromos = [], isLoading: isLoadingFavorites } = useQuery(
    {
      queryKey: ["favoritePromos", tagUid],
      queryFn: () => getUserFavoritePromos(tagUid as string),
      enabled: !!tagUid,
      select: (data) => (Array.isArray(data) ? data : []),
    },
  );

  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: ({
      promo_id,
      isFavorite,
    }: {
      promo_id: number;
      isFavorite: boolean;
    }) => {
      if (!tagUid) throw new Error("User not loaded");
      return isFavorite
        ? removeFavoritePromo(tagUid, promo_id)
        : addFavoritePromo(tagUid, promo_id);
    },
    onMutate: ({ promo_id }) => {
      // Mark this promo as in-flight so the UI can't fire again
      setTogglingIds((prev) => new Set(prev).add(promo_id));
    },
    onSettled: (_, __, { promo_id }) => {
      // Always clear the lock, success or fail
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(promo_id);
        return next;
      });
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["promos", tagUid] });
      queryClient.refetchQueries({ queryKey: ["favoritePromos", tagUid] });
    },
  });

  const animatePill = (index: number) => {
    Animated.spring(pillAnim, {
      toValue: index * ((screenWidth * 0.9) / 2),
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  };

  const handleTabPress = (index: number) => {
    pagerRef.current?.setPage(index);
    setActiveTab(index);
    animatePill(index);
  };

  const handlePageSelected = (e: { nativeEvent: { position: number } }) => {
    const index = e.nativeEvent.position;
    setActiveTab(index);
    animatePill(index);
  };

  const favoritePromoIds = favoritePromos.map((p) => p.promo_id);

  type Promo = {
    promo_id: number;
    promo_name?: string;
    [key: string]: any;
  };

  const filteredAllPromos = allPromos.filter((p: Promo) =>
    (p.promo_name || "").toLowerCase().includes(currentSearch.toLowerCase()),
  );

  const filteredFavoritePromos = favoritePromos.filter((p: Promo) =>
    (p.promo_name || "").toLowerCase().includes(likedSearch.toLowerCase()),
  );

  const isLoading = !tagUid || isLoadingPromos || isLoadingFavorites;

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="w-full h-full bg-white">
        <HeaderBigLogo hasNotifications isLoggedIn={isLoggedIn} />

        {isLoading ? (
          <LoadingOverlay />
        ) : (
          <>
            <View className="w-full items-center justify-center mt-16">
              <Text className="text-darkBlue text-2xl leading-none font-kanitMedium uppercase">
                Total Points
              </Text>
            </View>
            <View className="w-full items-center justify-center mb-6">
              <Text className="text-darkBlue text-7xl leading-none font-kanitBold">
                1,234
              </Text>
            </View>

            <PromoTabBar
              tabs={TABS}
              activeTab={activeTab}
              onTabPress={handleTabPress}
              pillAnim={pillAnim}
            />

            <PagerView
              ref={pagerRef}
              style={{ flex: 1 }}
              initialPage={0}
              onPageSelected={handlePageSelected}
            >
              <View key="current" className="flex-1">
                <PromoPageContent
                  searchPlaceholder="Search Current Promos"
                  onSearchChange={setCurrentSearch}
                  promos={filteredAllPromos}
                  favoritePromoIds={favoritePromoIds}
                  emptyMessage="No promos available at the moment."
                  onViewPromo={() => router.push("/(promos)/promo-details")}
                  onToggleFavorite={(promo_id, isFavorite) => {
                    if (togglingIds.has(promo_id)) return; // 🔒 block duplicate fires
                    toggleFavorite({ promo_id, isFavorite });
                  }}
                  scope="all"
                />
              </View>

              <View key="liked" className="flex-1">
                <PromoPageContent
                  searchPlaceholder="Search Liked Promos"
                  onSearchChange={setLikedSearch}
                  promos={filteredFavoritePromos}
                  favoritePromoIds={favoritePromoIds}
                  emptyMessage={`No liked promos yet.\nTap the heart on any promo to save it here.`}
                  onViewPromo={() => router.push("/(promos)/promo-details")}
                  onToggleFavorite={(promo_id, isFavorite) => {
                    if (togglingIds.has(promo_id)) return;
                    toggleFavorite({ promo_id, isFavorite });
                  }}
                  scope="liked"
                />
              </View>
            </PagerView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
