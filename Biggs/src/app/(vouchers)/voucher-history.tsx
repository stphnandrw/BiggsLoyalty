import { VoucherPageContent } from "@/src/components/features/VoucherPageContent";
import { HeaderBigLogo } from "@/src/components/layout/header";
import LoadingOverlay from "@/src/components/ui/LoadingOverlay";
import { getRedeemedVouchers } from "@/src/services/api/vouchers";
import type { ClaimedVoucher } from "@/src/types";
import { getItem } from "@/src/utils/asyncStorage";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VoucherHistory() {
  const [tagUid, setTagUid] = useState<string | null>(null);
  const [search, setSearch] = useState("");

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
      } catch (error) {
        console.error("Error loading userData:", error);
      }
    };

    loadUser();
  }, []);

  const {
    data: claimedVouchers = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["claimedVouchers", tagUid],
    queryFn: () => getRedeemedVouchers(tagUid as string),
    enabled: !!tagUid,
  });

  const isRedeemedVoucher = (voucher: ClaimedVoucher) =>
    Boolean(voucher.redeemed_at);

  const redeemedVouchers = claimedVouchers.filter((voucher) =>
    isRedeemedVoucher(voucher),
  );

  const redeemedVoucherIds = redeemedVouchers.map(
    (voucher) => voucher.voucher_id,
  );

  const filteredRedeemedVouchers = redeemedVouchers.filter((voucher) =>
    voucher.voucher_name.toLowerCase().includes(search.toLowerCase()),
  );

  const openVoucherDetails = (voucher: ClaimedVoucher) => {
    router.push({
      pathname: "/(vouchers)/voucher-details",
      params: {
        voucher_id: String(voucher.voucher_id),
        claimed_voucher_id: String(voucher.claimed_voucher_id ?? ""),
        tag_uid: tagUid ?? "",
        voucher_name: voucher.voucher_name,
        description: voucher.description,
        required_points: String(voucher.required_points),
        image_url: voucher.image_url,
        redeemed_at: voucher.redeemed_at ?? "",
        redeemable: "false",
      },
    });
  };

  const loading = !tagUid || isLoading;

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="w-full h-full bg-white">
        <HeaderBigLogo hasBackButton hasLogo title="Redeemed History" />

        {loading ? (
          <LoadingOverlay />
        ) : (
          <ScrollView
            className="flex-1"
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => {
                  void refetch();
                }}
              />
            }
          >
            <View className="flex-1 pt-16">
              <View className="w-full items-center justify-center mb-6">
                <Text className="text-darkBlue text-2xl leading-none font-kanitMedium uppercase">
                  Redeemed History
                </Text>
              </View>

              <VoucherPageContent
                searchPlaceholder="Search Redeemed Vouchers"
                onSearchChange={setSearch}
                vouchers={filteredRedeemedVouchers}
                claimedVoucherIds={redeemedVoucherIds}
                emptyMessage={`No redeemed vouchers yet.\nRedeem a voucher to see it here.`}
                onViewVoucher={(voucher) => {
                  if ("claimed_voucher_id" in voucher) {
                    openVoucherDetails(voucher);
                  }
                }}
                onToggleClaim={() => {}}
                scope="history"
              />
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
