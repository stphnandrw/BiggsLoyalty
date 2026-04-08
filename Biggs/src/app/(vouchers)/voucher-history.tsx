import { VoucherPageContent } from "@/src/components/features/VoucherPageContent";
import { HeaderBigLogo } from "@/src/components/layout/header";
import LoadingOverlay from "@/src/components/ui/LoadingOverlay";
import { useAuthStatus } from "@/src/hooks/useAuthStatus";
import { getUserClaimedVouchers } from "@/src/services/api/vouchers";
import { getItem } from "@/src/utils/asyncStorage";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Voucher = {
  voucher_id: number;
  voucher_name?: string;
  claimed_voucher_id?: number;
  claimed_at?: string | null;
  date_redeemed?: string | null;
  [key: string]: any;
};

export default function VoucherHistory() {
  const { isLoggedIn } = useAuthStatus();
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

  const { data: claimedVouchers = [], isLoading } = useQuery({
    queryKey: ["claimedVouchers", tagUid],
    queryFn: () => getUserClaimedVouchers(tagUid as string),
    enabled: !!tagUid,
    select: (data) => (Array.isArray(data) ? data : []),
  });

  const isRedeemedVoucher = (voucher: Voucher) =>
    Boolean(voucher.date_redeemed ?? voucher.claimed_at);

  const redeemedVouchers = claimedVouchers.filter((voucher: Voucher) =>
    isRedeemedVoucher(voucher),
  );

  const redeemedVoucherIds = redeemedVouchers.map(
    (voucher: Voucher) => voucher.voucher_id,
  );

  const filteredRedeemedVouchers = redeemedVouchers.filter((voucher: Voucher) =>
    (voucher.voucher_name || "").toLowerCase().includes(search.toLowerCase()),
  );

  const openVoucherDetails = (voucher: Voucher) => {
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
        redeemable: "false",
      },
    });
  };

  const loading = !tagUid || isLoading;

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="w-full h-full bg-white">
        <HeaderBigLogo hasBackButton hasNotifications isLoggedIn={isLoggedIn} />

        {loading ? (
          <LoadingOverlay />
        ) : (
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
              onViewVoucher={(voucher) => openVoucherDetails(voucher)}
              onToggleClaim={() => {}}
              scope="history"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
