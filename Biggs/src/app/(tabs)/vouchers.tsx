import { VoucherPageContent } from "@/src/components/features/VoucherPageContent";
import { Tab, VoucherTabBar } from "@/src/components/features/VoucherTabBar";
import { HeaderBigLogo } from "@/src/components/layout/header";
import LoadingOverlay from "@/src/components/ui/LoadingOverlay";
import { useAuthStatus } from "@/src/hooks/useAuthStatus";
import { getLoyaltyPoints } from "@/src/services/api/user";
import {
  claimVoucher,
  getUserClaimedVouchers,
  getVouchersExcludingClaimed,
} from "@/src/services/api/vouchers";
import { getItem } from "@/src/utils/asyncStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS: Tab[] = [
  { key: "current", label: "Biggs Vouchers", icon: null },
  { key: "claimed", label: "Claimed Vouchers", icon: "heart" },
];

const { width: screenWidth } = Dimensions.get("window");

export default function Vouchers() {
  const { isLoggedIn } = useAuthStatus();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [currentSearch, setCurrentSearch] = useState("");
  const [claimedSearch, setClaimedSearch] = useState("");
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

  const { data: loyaltyData, isLoading: isLoadingLoyalty } = useQuery({
    queryKey: ["loyaltyPoints", tagUid],
    queryFn: () => getLoyaltyPoints(tagUid as string),
    enabled: !!tagUid,
  });

  const { data: allVouchers = [], isLoading: isLoadingVouchers } = useQuery({
    queryKey: ["vouchers", tagUid],
    queryFn: () => getVouchersExcludingClaimed(tagUid as string),
    enabled: !!tagUid,
    select: (data) => (Array.isArray(data) ? data : []),
  });

  const { data: claimedVouchers = [], isLoading: isLoadingClaimed } = useQuery({
    queryKey: ["claimedVouchers", tagUid],
    queryFn: () => getUserClaimedVouchers(tagUid as string),
    enabled: !!tagUid,
    select: (data) => (Array.isArray(data) ? data : []),
  });

  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());

  const { mutate: claim } = useMutation({
    mutationFn: ({
      voucher_id,
      isClaimed,
    }: {
      voucher_id: number;
      isClaimed: boolean;
    }) => {
      if (!tagUid) throw new Error("User not loaded");
      if (isClaimed) {
        return Promise.resolve({ message: "Voucher already claimed" });
      }
      return claimVoucher(tagUid, voucher_id);
    },
    onMutate: ({ voucher_id }) => {
      // Mark this voucher as in-flight so the UI cannot fire again.
      setTogglingIds((prev) => new Set(prev).add(voucher_id));
    },
    onSettled: (_, __, { voucher_id }) => {
      // Always clear the lock, success or fail
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(voucher_id);
        return next;
      });
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["vouchers", tagUid] });
      queryClient.refetchQueries({ queryKey: ["claimedVouchers", tagUid] });
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

  type Voucher = {
    voucher_id: number;
    voucher_name?: string;
    claimed_voucher_id?: number;
    claimed_at?: string | null;
    date_redeemed?: string | null;
    [key: string]: any;
  };

  const isRedeemedVoucher = (voucher: Voucher) =>
    Boolean(voucher.date_redeemed ?? voucher.claimed_at);

  const activeClaimedVouchers = claimedVouchers.filter(
    (voucher: Voucher) => !isRedeemedVoucher(voucher),
  );

  const claimedVoucherIds = claimedVouchers.map((p) => p.voucher_id);

  const filteredAllVouchers = allVouchers.filter((p: Voucher) =>
    (p.voucher_name || "").toLowerCase().includes(currentSearch.toLowerCase()),
  );

  const filteredClaimedVouchers = activeClaimedVouchers.filter((p: Voucher) =>
    (p.voucher_name || "").toLowerCase().includes(claimedSearch.toLowerCase()),
  );

  const openVoucherDetails = (voucher: Voucher, redeemable: boolean) => {
    router.push({
      pathname: "/(vouchers)/voucher-details",
      params: {
        voucher_id: String(voucher.voucher_id),
        claimed_voucher_id: String(voucher.claimed_voucher_id ?? ""),
        tag_uid: tagUid ?? "",
        voucher_name: voucher.voucher_name ?? "",
        description: voucher.description ?? "",
        required_points: String(voucher.required_points ?? ""),
        image_url: voucher.image_url ?? "",
        claimed_at: voucher.claimed_at ?? "",
        date_redeemed: voucher.date_redeemed ?? "",
        redeemable: redeemable ? "true" : "false",
        current_points: String(loyaltyData?.points ?? "0"),
      },
    });
  };

  const isLoading = !tagUid || isLoadingVouchers || isLoadingClaimed;

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="w-full h-full bg-white">
        <HeaderBigLogo
          hasNotifications
          hasHistory
          isLoggedIn={isLoggedIn}
          onHistoryPress={() => router.push("/(vouchers)/voucher-history")}
        />

        {isLoading ? (
          <LoadingOverlay />
        ) : (
          <>
            <View className="w-full items-center justify-center mt-16">
              <Text className="text-darkBlue text-2xl leading-none font-kanitMedium uppercase">
                Total Points
              </Text>
            </View>
            {isLoadingLoyalty ? (
              <LoadingOverlay />
            ) : (
              <View className="w-full items-center justify-center mb-6">
                <Text className="text-darkBlue text-7xl leading-none font-kanitBold">
                  {loyaltyData?.points ?? "0"}
                </Text>
              </View>
            )}

            <VoucherTabBar
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
                <VoucherPageContent
                  searchPlaceholder="Search Current Vouchers"
                  onSearchChange={setCurrentSearch}
                  vouchers={filteredAllVouchers}
                  claimedVoucherIds={claimedVoucherIds}
                  emptyMessage="No vouchers available at the moment."
                  onViewVoucher={(voucher) =>
                    openVoucherDetails(voucher, false)
                  }
                  onToggleClaim={(voucher_id, isFavorite) => {
                    if (togglingIds.has(voucher_id)) return;
                    claim({ voucher_id, isClaimed: isFavorite });
                  }}
                  scope="all"
                />
              </View>

              <View key="claimed" className="flex-1">
                <VoucherPageContent
                  searchPlaceholder="Search Claimed Vouchers"
                  onSearchChange={setClaimedSearch}
                  vouchers={filteredClaimedVouchers}
                  claimedVoucherIds={claimedVoucherIds}
                  emptyMessage={`No claimed vouchers yet.\nClaim any voucher from the current list.`}
                  onViewVoucher={(voucher) => openVoucherDetails(voucher, true)}
                  onToggleClaim={() => {}}
                  scope="claimed"
                />
              </View>
            </PagerView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
