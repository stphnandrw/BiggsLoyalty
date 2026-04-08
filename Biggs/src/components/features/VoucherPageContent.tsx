import { GiftCard } from "@/src/components/ui/Cards";
import { SearchInput } from "@/src/components/ui/Inputs";
import { FontAwesome6 } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type Voucher = {
  voucher_id: number;
  voucher_name: string;
  description: string;
  required_points: number;
  image_url: string;
  claimed_voucher_id?: number;
  claimed_at?: string | null;
  date_redeemed?: string | null;
  [key: string]: any;
};

type VoucherPageContentProps = {
  searchPlaceholder: string;
  onSearchChange: (text: string) => void;
  vouchers: Voucher[];
  claimedVoucherIds: number[];
  emptyMessage: string;
  onViewVoucher: (voucher: Voucher) => void;
  onToggleClaim: (voucherId: number, isClaimed: boolean) => void;
  scope: "all" | "claimed" | "history";
};

function getVoucherCardKey(
  voucher: Voucher,
  index: number,
  scope: string,
): string {
  if (voucher.claimed_voucher_id)
    return `${scope}-claimed-${voucher.claimed_voucher_id}`;
  if (voucher.voucher_id)
    return `${scope}-voucher-${voucher.voucher_id}-${index}`;
  return `${scope}-index-${index}`;
}

export function VoucherPageContent({
  searchPlaceholder,
  onSearchChange,
  vouchers,
  claimedVoucherIds,
  emptyMessage,
  onViewVoucher,
  onToggleClaim,
  scope,
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
      <ScrollView className="w-full flex-1">
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
                isRedeemed={Boolean(
                  voucher.date_redeemed ?? voucher.claimed_at,
                )}
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
