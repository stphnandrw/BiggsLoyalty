import { HeaderBigLogo } from "@/src/components/layout/header";
import { PrimaryButton } from "@/src/components/ui/Buttons";
import { ConfirmBottomSheet } from "@/src/components/ui/Modal";
import {
  cancelVoucherRedemption,
  checkOnProcessVoucher,
  redeemVoucher,
} from "@/src/services/api/vouchers";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  BackHandler,
  RefreshControl,
  ScrollView,
  Text,
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
  redeemed_at?: string | string[];
  redeemable?: string | string[];
  current_points?: string | string[];
};

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : (value ?? "");
}

export default function VoucherDetails() {
  const params = useLocalSearchParams<VoucherDetailsParams>();
  const [isWaitingForNfc, setIsWaitingForNfc] = useState(false);
  const [showBackConfirmSheet, setShowBackConfirmSheet] = useState(false);
  const [pendingLeaveAction, setPendingLeaveAction] = useState<
    "cancel" | "back" | null
  >(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const tagUid = getParamValue(params.tag_uid);
  const claimedVoucherId = getParamValue(params.claimed_voucher_id);
  const voucherName = getParamValue(params.voucher_name) || "Voucher Details";
  const description = getParamValue(params.description);
  const requiredPoints = getParamValue(params.required_points);
  const imageUrl = getParamValue(params.image_url);
  const redeemedAt = getParamValue(params.redeemed_at);
  const redeemable = getParamValue(params.redeemable) === "true";
  const currentPoints = getParamValue(params.current_points);

  const isRedeemed = useMemo(() => Boolean(redeemedAt), [redeemedAt]);

  const checkPendingRedemption = async () => {
    if (!tagUid) {
      return;
    }
    const pendingRedemption = await checkOnProcessVoucher(
      tagUid,
      Number(claimedVoucherId),
    );
    if (pendingRedemption) {
      setIsWaitingForNfc(true);
      setStatusMessage("Waiting for NFC tap...");
    }
  };

  useEffect(() => {
    checkPendingRedemption();
  }, [tagUid, claimedVoucherId]);

  const handleRedeem = async () => {
    if (!claimedVoucherId || isWaitingForNfc) {
      return;
    }

    await redeemVoucher(tagUid, Number(claimedVoucherId));

    setStatusMessage("Waiting for NFC tap...");
    setIsWaitingForNfc(true);
  };

  const handleCancelRedemption = async () => {
    await cancelVoucherRedemption(tagUid, Number(claimedVoucherId));

    setStatusMessage("Redemption cancelled.");
    setIsWaitingForNfc(false);
  };

  const openLeaveConfirmSheet = (action: "cancel" | "back") => {
    if (!isWaitingForNfc) {
      if (action === "back") {
        router.back();
      }
      return;
    }

    setPendingLeaveAction(action);
    setShowBackConfirmSheet(true);
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (!isWaitingForNfc) {
          return false;
        }

        setPendingLeaveAction("back");
        setShowBackConfirmSheet(true);
        return true;
      },
    );

    return () => subscription.remove();
  }, [isWaitingForNfc]);

  const handleConfirmLeaveWhileWaiting = async () => {
    const action = pendingLeaveAction;
    await handleCancelRedemption();
    setShowBackConfirmSheet(false);
    setPendingLeaveAction(null);

    if (action === "back") {
      router.back();
    }
  };

  const handleStayWhileWaiting = () => {
    setShowBackConfirmSheet(false);
    setPendingLeaveAction(null);
  };

  const requiredPointsValue = Number(requiredPoints || 0);
  const currentPointsValue = Number(currentPoints || 0);
  const canAttemptRedeem =
    redeemable &&
    !isRedeemed &&
    Boolean(claimedVoucherId) &&
    requiredPointsValue <= currentPointsValue;

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh - in a real app, this would refetch voucher details
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <SafeAreaView
      className="flex-1 items-center justify-center bg-black"
      edges={["top", "left", "right"]}
    >
      <View className="w-full h-full bg-white">
        <HeaderBigLogo
          hasBackButton={true}
          hasNotifications={false}
          onBackPress={() => openLeaveConfirmSheet("back")}
        />

        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        >
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

          {statusMessage ? (
            <View className="w-full px-6 mt-4">
              <Text className="text-center text-sm text-gray-700">
                {statusMessage}
              </Text>
            </View>
          ) : null}

          {canAttemptRedeem ? (
            <View className="w-full px-6 mt-8">
              {!isWaitingForNfc ? (
                <PrimaryButton
                  buttonName="Redeem Voucher"
                  onPress={handleRedeem}
                  isFontSmall
                />
              ) : (
                <PrimaryButton
                  buttonName="Cancel Redemption"
                  onPress={() => openLeaveConfirmSheet("cancel")}
                />
              )}
            </View>
          ) : null}
        </ScrollView>

        <ConfirmBottomSheet
          visible={showBackConfirmSheet}
          title="Cancel waiting for NFC tap?"
          description={
            pendingLeaveAction === "back"
              ? "You are still waiting for a card tap. Leaving now will cancel this redemption."
              : "You are still waiting for a card tap. Cancel this redemption?"
          }
          confirmLabel={pendingLeaveAction === "back" ? "Leave" : "Cancel"}
          cancelLabel="Stay"
          onConfirm={handleConfirmLeaveWhileWaiting}
          onCancel={handleStayWhileWaiting}
        />
      </View>
    </SafeAreaView>
  );
}
