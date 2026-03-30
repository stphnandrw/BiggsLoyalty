import { SmallPrimaryButton } from "@/src/components/ui/Buttons";
import { NormalInput } from "@/src/components/ui/Inputs";
import { HorizontalOrLine } from "@/src/components/ui/Lines";
import { WelcomeText } from "@/src/components/ui/Texts";
import { useRegistration } from "@/src/context/UserRegistrationContext";
import { usePushNotifications } from "@/src/hooks/usePushNotifications";
import { generateOTP } from "@/src/services/api/otp";
import { checkUserByTagUid } from "@/src/services/api/user";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Step = "tag_uid" | "phone";

export default function MobileNumber() {
  const [step, setStep] = useState<Step>("tag_uid");

  const [tagUid, setTagUid] = useState("");
  const [tagUidError, setTagUidError] = useState("");

  const [rawPhone, setRawPhone] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { resetFormData, updateFormData } = useRegistration();
  const { expoPushToken } = usePushNotifications();

  useFocusEffect(
    useCallback(() => {
      setStep("tag_uid");
      setTagUid("");
      setTagUidError("");
      setRawPhone("");
      setFormattedPhone("");
      setPhoneError("");
      setHasSubmitted(false);
      resetFormData();
    }, [resetFormData]),
  );

  const handleTagUidChange = (text: string) => {
    setTagUid(text);
    setTagUidError("");
  };

  const handlePhoneChange = (digits: string) => {
    setRawPhone(digits);
    setPhoneError("");
    let fmt = digits;
    if (digits.length > 6) {
      fmt = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    } else if (digits.length > 3) {
      fmt = `${digits.slice(0, 3)} ${digits.slice(3)}`;
    }
    setFormattedPhone(fmt);
  };

  // Add this derived value (place it near your other state/variables)
  const maskedPhone = (() => {
    if (rawPhone.length <= 6) return formattedPhone;
    const visible = `${rawPhone.slice(0, 3)}${"*".repeat(rawPhone.length - 6)}${rawPhone.slice(-3)}`;
    // Re-apply spacing to masked string
    return `${visible.slice(0, 3)} ${visible.slice(3, 6)} ${visible.slice(6)}`;
  })();

  const handleChangeTagUid = () => {
    setStep("tag_uid");
    setTagUid("");
    setTagUidError("");
    setRawPhone("");
    setFormattedPhone("");
    setPhoneError("");
    setHasSubmitted(false);
  };

  // Step 1 — verify tag_uid exists before showing phone input
  const checkMutation = useMutation({
    mutationFn: async (tag_uid: string) => checkUserByTagUid(tag_uid),
    onSuccess: (data) => {
      // Auto-fill phone from the server response (strips leading 0 for the raw input)
      const serverPhone: string = data?.phone_number ?? "";
      const digits = serverPhone.replace(/^0/, "").replace(/^\+63/, "");
      if (digits) {
        setRawPhone(digits);
        let fmt = digits;
        if (digits.length > 6) {
          fmt = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
        } else if (digits.length > 3) {
          fmt = `${digits.slice(0, 3)} ${digits.slice(3)}`;
        }
        setFormattedPhone(fmt);
      }
      setStep("phone");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ??
        (error?.request
          ? "Unable to reach the server. Please check your connection."
          : "Unexpected error occurred.");
      setTagUidError(message);
    },
  });

  // Step 2 — generate OTP and navigate to verify
  const otpMutation = useMutation({
    mutationFn: async (phone_number: string) =>
      generateOTP(phone_number, tagUid.trim(), false),
    onSuccess: (_data, phone_number) => {
      router.replace({
        pathname: "/(auth)/verify",
        params: { phone_number, expoPushToken: expoPushToken ?? "" },
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ??
        (error?.request
          ? "Unable to reach the server. Please check your connection."
          : "Unexpected error occurred.");
      setPhoneError(message);
      setHasSubmitted(false);
    },
  });

  const handleCheckTagUid = () => {
    if (!tagUid.trim()) {
      setTagUidError("Please enter your Tag UID.");
      return;
    }
    checkMutation.mutate(tagUid.trim());
  };

  const handleSendCode = () => {
    if (hasSubmitted) return;
    if (!rawPhone) {
      setPhoneError("Please enter your mobile number.");
      return;
    }
    if (!/^9\d{9}$/.test(rawPhone)) {
      setPhoneError(
        "Enter a valid Philippine mobile number starting with 9 (10 digits).",
      );
      return;
    }
    setHasSubmitted(true);
    const phone_number = `0${rawPhone}`;
    updateFormData({ tag_uid: tagUid.trim(), phone_number });
    otpMutation.mutate(phone_number);
  };

  const handleGuestContinue = () => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    router.push("/(tabs)");
  };

  const isCheckPending = checkMutation.isPending;
  const isOtpPending = otpMutation.isPending || hasSubmitted;

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <ScrollView
        className="w-full h-full bg-lightBlue"
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Hero / Brand Band ── */}
        <View className="w-full h-60 items-center justify-center overflow-visible">
          <View className="absolute -bottom-7 -right-10 -rotate-[20deg]">
            <Image
              source={require("../../../assets/images/white_checker.png")}
              style={{ width: 230, height: 100 }}
              contentFit="contain"
            />
          </View>
          <View className="w-full h-full items-center justify-center">
            <Image
              source={require("../../../assets/images/biggs-logo.png")}
              style={{ width: 350, height: 300 }}
              contentFit="contain"
            />
          </View>
        </View>

        <View className="w-full h-full rounded-t-3xl bg-white px-6 pt-5 pb-8">
          {/* ── Heading ── */}
          <View className="mb-5">
            <WelcomeText text="Welcome back!" />
          </View>

          {/* ── Step 1: Tag UID input (hidden once confirmed) ── */}
          {step === "tag_uid" ? (
            <View className="mb-4">
              <Text className="text-darkBlue/60 font-kanitBold text-2xl leading-tight mb-2">
                Enter your Tag UID
              </Text>
              <NormalInput
                inputName=""
                placeholder="e.g. A1B2C3D4"
                inputWidth="100%"
                value={tagUid}
                onChangeText={handleTagUidChange}
              />
              {tagUidError ? (
                <Text className="text-red-500 font-kanit text-xs mt-2 ml-1">
                  {tagUidError}
                </Text>
              ) : (
                <Text className="text-gray-400 font-kanit text-sm mt-2 ml-1">
                  The unique ID found on your Biggs Club card.
                </Text>
              )}
              <View className="mt-4">
                <SmallPrimaryButton
                  buttonName={isCheckPending ? "Checking..." : "Check"}
                  isCentered={true}
                  onPress={handleCheckTagUid}
                  isFontSmall={true}
                  isDisabled={!tagUid.trim() || isCheckPending}
                />
              </View>
            </View>
          ) : (
            /* ── Confirmed Tag UID pill ── */
            <View className="flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 mb-4">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="check-circle" size={18} color="#14284d" />
                <View>
                  <Text className="text-xs font-kanit text-gray-400">
                    Tag UID
                  </Text>
                  <Text className="font-kanitBold text-darkBlue text-base">
                    {tagUid}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={handleChangeTagUid}
                className="bg-darkBlue/10 rounded-xl px-3 py-1.5"
              >
                <Text className="text-darkBlue font-kanitBold text-sm">
                  Change
                </Text>
              </Pressable>
            </View>
          )}

          {/* ── Step 2: Mobile number + Login button ── */}
          {step === "phone" && (
            <View className="mb-4">
              {/* <Text className="text-darkBlue/60 font-kanitBold text-2xl leading-tight mb-2">
                Mobile number
              </Text> */}
              <View className="flex-row items-center rounded-2xl p-1.5 gap-0">
                <View className="flex-row items-center gap-2 border border-gray-300 bg-gray-100 rounded-xl px-3 py-2">
                  <Image
                    source={require("../../../assets/images/philippines.png")}
                    style={{ width: 22, height: 23 }}
                    contentFit="contain"
                  />
                  <Text className="font-kanitBold text-2xl text-gray-500 py-[5px]">
                    +63
                  </Text>
                </View>
                <View className="w-px h-7 bg-gray-300 mx-1.5" />
                <View className="flex-1">
                  <NormalInput
                    inputName=""
                    placeholder="9XX XXX XXXX"
                    inputWidth="100%"
                    value={maskedPhone}
                    onChangeText={handlePhoneChange}
                    isNumeric={true}
                    maxLength={10}
                    isDisabled
                    // editable={!formattedPhone}
                  />
                </View>
                {formattedPhone ? (
                  <MaterialIcons
                    name="lock"
                    size={18}
                    color="#9ca3af"
                    style={{ marginLeft: 8 }}
                  />
                ) : null}
              </View>

              {phoneError ? (
                <Text className="text-red-500 font-kanit text-xs mt-2 ml-1">
                  {phoneError}
                </Text>
              ) : (
                <Text className="text-gray-400 font-kanit text-sm mt-2 ml-1">
                  {formattedPhone
                    ? "Make sure you have access to this number to receive the OTP code"
                    : "We'll send you a one-time verification code"}
                </Text>
              )}

              <View className="mt-4">
                <SmallPrimaryButton
                  buttonName={
                    isOtpPending ? "Logging in..." : "Log in / Sign up"
                  }
                  isCentered={true}
                  onPress={handleSendCode}
                  isFontSmall={true}
                  isDisabled={rawPhone.length < 10 || isOtpPending}
                />
              </View>
            </View>
          )}

          <View className="mb-3 w-[90%] self-center">
            <HorizontalOrLine />
          </View>

          <SmallPrimaryButton
            buttonName={isOtpPending ? "Redirecting..." : "Continue as Guest"}
            buttonWidth="60%"
            isCentered={true}
            onPress={handleGuestContinue}
            isFontSmall={true}
            isDisabled={isOtpPending || isCheckPending}
          />

          {/* ── Legal / Consent ── */}
          <View className="border-t border-gray-100 pt-5">
            <Text className="text-gray-400 font-kanit text-xs mb-2">
              By continuing, you agree to:
            </Text>
            <View className="gap-2">
              <View className="flex-row items-start gap-2">
                <View className="w-1 h-1 rounded-full bg-gray-300 mt-1.5" />
                <Pressable
                  onPress={() =>
                    Linking.openURL("https://biggs.ph/privacy-policy")
                  }
                  className="flex-1"
                >
                  <Text className="text-gray-400 font-kanit text-xs leading-relaxed underline decoration-gray-300">
                    Allow Biggs to use the information you provide to keep your
                    Biggs Club account secure.
                  </Text>
                </Pressable>
              </View>
              <View className="flex-row items-start gap-2">
                <View className="w-1 h-1 rounded-full bg-gray-300 mt-1.5" />
                <Pressable
                  onPress={() =>
                    Linking.openURL("https://biggs.ph/terms-and-conditions")
                  }
                  className="flex-1"
                >
                  <Text className="text-gray-400 font-kanit text-xs leading-relaxed underline decoration-gray-300">
                    Allow Biggs to send you marketing updates and offers via
                    call or text.
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
