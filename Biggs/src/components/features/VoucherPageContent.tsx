import { GiftCard } from "@/src/components/ui/Cards";
import { SearchInput } from "@/src/components/ui/Inputs";
import type { ClaimedVoucher, VoucherListItem } from "@/src/types";
import { FontAwesome6 } from "@expo/vector-icons";
import { RefreshControl, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type VoucherPageContentProps = {
  searchPlaceholder: string;
  onSearchChange: (text: string) => void;
  vouchers: VoucherListItem[];
  claimedVoucherIds: number[];
  emptyMessage: string;
  onViewVoucher: (voucher: VoucherListItem) => void;
  onToggleClaim: (voucherId: number, isClaimed: boolean) => void;
  scope: "all" | "claimed" | "history";
  isRefetching?: boolean;
  onRefresh?: () => void;
};

function getVoucherCardKey(
  voucher: VoucherListItem,
  index: number,
  scope: string,
): string {
  if (isClaimedVoucher(voucher))
    return `${scope}-claimed-${voucher.claimed_voucher_id}`;
  if (voucher.voucher_id)
    return `${scope}-voucher-${voucher.voucher_id}-${index}`;
  return `${scope}-index-${index}`;
}

const isClaimedVoucher = (
  voucher: VoucherListItem,
): voucher is ClaimedVoucher => "claimed_voucher_id" in voucher;

export function VoucherPageContent({
  searchPlaceholder,
  onSearchChange,
  vouchers,
  claimedVoucherIds,
  emptyMessage,
  onViewVoucher,
  onToggleClaim,
  scope,
  isRefetching = false,
  onRefresh,
}: VoucherPageContentProps) {
  const swipeDirection = "right";

  return (
    <View className="flex-1">
      <SearchInput
        inputName={searchPlaceholder}
        inputWidth="90%"
        onChangeText={onSearchChange}
        icon={<FontAwesome6 name="magnifying-glass" size={20} color="gray" />}
      />
      <ScrollView
        className="w-full flex-1"
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        <View className="items-center">
          {vouchers.length > 0 ? (
            vouchers.map((voucher, index) => (
              <GiftCard
                key={getVoucherCardKey(voucher, index, scope)}
                onPress={() => onViewVoucher(voucher)}
                voucher_name={voucher.voucher_name}
                description={voucher.description}
                required_points={voucher.required_points}
                image_url={voucher.image_url}
                isRedeemed={
                  isClaimedVoucher(voucher)
                    ? Boolean(voucher.redeemed_at)
                    : false
                }
                isFavorited={claimedVoucherIds.includes(voucher.voucher_id)}
                swipeDirection={swipeDirection}
                onToggleFavorite={() =>
                  onToggleClaim(
                    voucher.voucher_id,
                    claimedVoucherIds.includes(voucher.voucher_id),
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
