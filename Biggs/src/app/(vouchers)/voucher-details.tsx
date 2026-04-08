import { HeaderBigLogo } from "@/src/components/layout/header";
import { redeemVoucher } from "@/src/services/api/vouchers";
import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type VoucherDetailsParams = {
  tag_uid?: string | string[];
  voucher_id?: string | string[];
  claimed_voucher_id?: string | string[];
  voucher_name?: string | string[];
  description?: string | string[];
  required_points?: string | string[];
  image_url?: string | string[];
  claimed_at?: string | string[];
  date_redeemed?: string | string[];
  redeemable?: string | string[];
  current_points?: string | string[];
};

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : (value ?? "");
}

export default function VoucherDetails() {
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<VoucherDetailsParams>();
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isWaitingForNfc, setIsWaitingForNfc] = useState(false);
  const [manualTagUid, setManualTagUid] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const tagUid = getParamValue(params.tag_uid);
  const claimedVoucherId = getParamValue(params.claimed_voucher_id);
  const voucherName = getParamValue(params.voucher_name) || "Voucher Details";
  const description = getParamValue(params.description);
  const requiredPoints = getParamValue(params.required_points);
  const imageUrl = getParamValue(params.image_url);
  const claimedAt = getParamValue(params.claimed_at);
  const dateRedeemed = getParamValue(params.date_redeemed);
  const redeemable = getParamValue(params.redeemable) === "true";
  const currentPoints = getParamValue(params.current_points);

  const isRedeemed = useMemo(
    () => Boolean(dateRedeemed || claimedAt),
    [claimedAt, dateRedeemed],
  );

  const handleRedeem = () => {
    if (!claimedVoucherId || isRedeeming) {
      return;
    }

    setStatusMessage("Waiting for NFC tap...");
    setIsWaitingForNfc(true);
  };

  const handleManualSubmit = async () => {
    if (!claimedVoucherId || isRedeeming) {
      return;
    }

    try {
      setIsRedeeming(true);
      const submittedTagUid = manualTagUid.trim();

      if (!submittedTagUid) {
        setStatusMessage("Tag UID is required.");
        return;
      }

      await redeemVoucher(submittedTagUid, Number(claimedVoucherId));
      await queryClient.invalidateQueries({
        queryKey: ["claimedVouchers", submittedTagUid],
      });
      await queryClient.invalidateQueries({
        queryKey: ["vouchers", submittedTagUid],
      });
      await queryClient.invalidateQueries({
        queryKey: ["loyaltyPoints", submittedTagUid],
      });

      if (tagUid && tagUid !== submittedTagUid) {
        await queryClient.invalidateQueries({
          queryKey: ["claimedVouchers", tagUid],
        });
        await queryClient.invalidateQueries({ queryKey: ["vouchers", tagUid] });
        await queryClient.invalidateQueries({
          queryKey: ["loyaltyPoints", tagUid],
        });
      }

      setStatusMessage("Voucher redeemed successfully.");
      setIsWaitingForNfc(false);
      setManualTagUid("");
      router.back();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Redeem voucher failed.";
      setStatusMessage(message);
      console.error("Redeem voucher failed:", error);
    } finally {
      setIsRedeeming(false);
    }
  };

  const hintTagUid = tagUid ? `Hint: current user tag UID is ${tagUid}` : "";
  const requiredPointsValue = Number(requiredPoints || 0);
  const canAttemptRedeem =
    redeemable &&
    !isRedeemed &&
    Boolean(claimedVoucherId) &&
    requiredPointsValue > 0;

  return (
    <SafeAreaView
      className="flex-1 items-center justify-center bg-black"
      edges={["top", "left", "right"]}
    >
      <View className="w-full h-full bg-white">
        <HeaderBigLogo hasBackButton={true} hasNotifications={false} />

        <View className="w-full h-auto items-center justify-center mt-16 px-6">
          <Text className="text-darkBlue text-2xl leading-none font-kanitMedium uppercase text-center">
            {voucherName}
          </Text>
        </View>

        {imageUrl ? (
          <View className="w-full items-center justify-center mt-6 px-6">
            <Image
              source={{ uri: imageUrl }}
              style={{ width: "100%", height: 180, borderRadius: 18 }}
              contentFit="cover"
            />
          </View>
        ) : null}

        <View className="w-full h-auto items-center justify-center mt-6 px-6">
          <Text className="text-gray-700 text-base leading-relaxed text-center">
            {description || "No description available for this voucher."}
          </Text>
        </View>

        <View className="w-full h-auto items-center justify-center mt-6 px-6">
          <Text className="text-darkBlue font-kanitMedium uppercase tracking-wide">
            Required Points: {requiredPoints || "-"}
          </Text>
          <Text className="text-gray-500 mt-2">
            Current Points: {currentPoints || "-"}
          </Text>
          <Text className="text-gray-500 mt-1">
            {isRedeemed
              ? "Redeemed"
              : redeemable
                ? "Ready to redeem"
                : "Claim this voucher first"}
          </Text>
        </View>

        {canAttemptRedeem ? (
          <View className="w-full px-6 mt-8">
            {!isWaitingForNfc ? (
              <Pressable
                onPress={handleRedeem}
                className="w-full h-12 rounded-xl bg-darkBlue items-center justify-center"
              >
                <Text className="text-white font-kanitMedium uppercase tracking-wide">
                  Redeem Voucher
                </Text>
              </Pressable>
            ) : (
              <View className="w-full rounded-xl border border-gray-200 p-4">
                <View className="flex-row items-center mb-3">
                  <ActivityIndicator color="#0a1f62" />
                  <Text className="ml-3 text-darkBlue font-kanitMedium">
                    Waiting for NFC tap...
                  </Text>
                </View>

                <Text className="text-gray-600 mb-3">
                  NFC is not integrated yet. Enter tag_uid manually to simulate
                  the scan.
                </Text>

                <TextInput
                  value={manualTagUid}
                  onChangeText={setManualTagUid}
                  placeholder="Enter tag_uid"
                  autoCapitalize="characters"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-darkBlue"
                />

                {hintTagUid ? (
                  <Text className="text-xs text-gray-500 mt-2">
                    {hintTagUid}
                  </Text>
                ) : null}

                <Pressable
                  onPress={handleManualSubmit}
                  disabled={isRedeeming}
                  className="w-full h-11 rounded-xl bg-darkBlue items-center justify-center mt-4"
                >
                  {isRedeeming ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-kanitMedium uppercase tracking-wide">
                      Submit Tag UID
                    </Text>
                  )}
                </Pressable>
              </View>
            )}
          </View>
        ) : null}

        {statusMessage ? (
          <View className="w-full px-6 mt-4">
            <Text className="text-center text-sm text-gray-700">
              {statusMessage}
            </Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
