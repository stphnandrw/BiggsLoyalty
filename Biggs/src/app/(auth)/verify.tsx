import { SmallGhostButton } from "@/src/components/ui/Buttons";
import { OTPInput } from "@/src/components/ui/Inputs";
import { ConfirmBottomSheet } from "@/src/components/ui/Modal";
import { WelcomeText } from "@/src/components/ui/Texts";
import { useRegistration } from "@/src/context/UserRegistrationContext";
import { generateOTP, verifyOTP } from "@/src/services/api/otp";
import { checkUserExists, updateUser } from "@/src/services/api/user";
import { getItem, setItem } from "@/src/utils/asyncStorage";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CELL_COUNT = 6;
const RESEND_COOLDOWN = 120;

function formatPhone(raw: string) {
  if (!raw) return "";
  let digits = raw.replace(/^\+63/, "").replace(/^0/, "");
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6);
  return `+63 ${a} ${b} ${c}`;
}

function VerifyScreen() {
  const openCloseConfirmation = useCallback(() => {
    Keyboard.dismiss();
    setConfirmVisible(true);
  }, []);

  const params = useLocalSearchParams<{
    phone_number: string;
    expoPushToken?: string;
  }>();
  const { formData } = useRegistration();
  const phone_number = params.phone_number ?? formData.phone_number ?? "";
  const tag_uid = formData.tag_uid;

  const [expoPushToken, setExpoPushToken] = useState(
    params.expoPushToken ?? formData.expoPushToken ?? "",
  );
  useEffect(() => {
    if (!expoPushToken) {
      getItem("expoPushToken").then((stored) => {
        if (stored) setExpoPushToken(stored);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [code, setCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [formError, setFormError] = useState("");
  const [autoFocus, setAutoFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoFocusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    if (autoFocusTimerRef.current) clearTimeout(autoFocusTimerRef.current);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setCode("");
      setOtpError("");
      setFormError("");
      setAutoFocus(false);
      setIsLoading(false);
      setCooldown(0);
      autoFocusTimerRef.current = setTimeout(() => setAutoFocus(true), 250);

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          openCloseConfirmation();
          return true;
        },
      );

      return () => {
        clearTimers();
        setConfirmVisible(false);
        backHandler.remove();
      };
    }, [clearTimers, openCloseConfirmation]),
  );

  const startCooldown = useCallback(() => {
    setCooldown(RESEND_COOLDOWN);
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    cooldownTimerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownTimerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // ✅ Fixed: properly awaits and handles errors from generateOTP
  const handleResend = useCallback(async () => {
    setCode("");
    setOtpError("");
    setFormError("");
    try {
      await generateOTP(phone_number, tag_uid, true);
      startCooldown();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        (error?.request
          ? "Unable to reach the server. Please check your connection."
          : "Unexpected error occurred.");
      setFormError(message);
    }
  }, [phone_number, tag_uid, startCooldown]);

  const handleVerify = useCallback(
    async (enteredCode?: string) => {
      const codeToVerify = enteredCode ?? code;
      console.log("[OTP] handleVerify called with code:", codeToVerify);

      if (codeToVerify.length < CELL_COUNT) {
        setOtpError(`Please enter all ${CELL_COUNT} digits.`);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        console.log("[OTP] Not enough digits entered.");
        return;
      }

      Keyboard.dismiss();
      setIsLoading(true);

      try {
        if (!phone_number) {
          setFormError(
            "Mobile number is missing. Please go back and re-enter.",
          );
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          console.log("[OTP] Missing phone_number, aborting.");
          return;
        }

        console.log("[OTP] Calling verifyOTP API...");
        await verifyOTP(phone_number, codeToVerify);
        console.log("[OTP] verifyOTP success!");

        const userData = await checkUserExists(phone_number);
        console.log("[OTP] checkUserExists response:", userData);

        const isProfileIncomplete =
          Boolean(userData.is_incomplete) || !userData.name;

        if (!userData.exists || isProfileIncomplete) {
          console.log(
            "[OTP] User does not exist or profile incomplete, navigating to signup.",
          );
          router.replace({
            pathname: "/(auth)/(signup)/personal-details",
            params: { phone_number, expoPushToken },
          });
        } else {
          const tokenMismatch =
            expoPushToken && expoPushToken !== userData.expo_push_token;
          if (tokenMismatch && userData.tag_uid) {
            console.log("[OTP] Updating user expo_push_token...");
            await updateUser(userData.tag_uid, {
              expo_push_token: expoPushToken,
            });
          }
          const updatedUserData = await checkUserExists(phone_number);
          await setItem("userData", JSON.stringify(updatedUserData));
          await setItem("isLoggedIn", "true");
          console.log("[OTP] Login success, navigating to /tabs.");
          router.replace("/(tabs)");
        }
      } catch (error: any) {
        setCode("");
        const message =
          error?.response?.data?.message ??
          (error?.request
            ? "Unable to reach the server. Please check your connection."
            : "Unexpected error occurred.");
        const status = error?.response?.status;
        console.log(
          "[OTP] Error during verification:",
          error,
          "Message:",
          message,
          "Status:",
          status,
        );
        if (status === 400 || status === 401) {
          setOtpError(message);
        } else {
          setFormError(message);
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } finally {
        setIsLoading(false);
        console.log("[OTP] handleVerify finished.");
      }
    },
    [code, phone_number, expoPushToken],
  );

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode);
      setOtpError("");
      if (newCode.length === CELL_COUNT) {
        setTimeout(() => void handleVerify(newCode), 0);
      }
    },
    [handleVerify],
  );

  const closeConfirmSheet = useCallback(() => setConfirmVisible(false), []);

  const handleLeaveVerification = useCallback(() => {
    closeConfirmSheet();
    router.replace("/(auth)/login");
  }, [closeConfirmSheet]);

  const phoneDisplay = formatPhone(phone_number);
  const canResend = cooldown === 0 && !isLoading;

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <ScrollView
        className="w-full h-full bg-lightBlue"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full flex-1 bg-white px-6 pt-5 pb-8">
          <View className="mb-4 items-center">
            <WelcomeText text={`Verify your \n account`} />
            <View className="w-14 h-1 bg-yellow-400 rounded-full self-center mt-2" />
          </View>

          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={0}
            className="items-center flex-1"
          >
            <View className="bg-gray-50 rounded-2xl border border-gray-200 px-4 py-5 mb-4 w-full">
              <Text className="font-kanit text-gray-500 text-sm text-center mb-3">
                Enter the verification code sent to your mobile number.
              </Text>
              <OTPInput
                cellCount={CELL_COUNT}
                value={code}
                onChangeText={handleCodeChange}
                autoFocus={autoFocus}
              />
              {otpError ? (
                <Text className="font-kanit text-red-500 text-xs text-center mt-2">
                  {otpError}
                </Text>
              ) : null}
            </View>

            <View className="flex-row items-center justify-center mb-4">
              <Text className="font-kanit text-gray-400 text-lg">
                Didn&apos;t receive a code?{" "}
              </Text>
              {cooldown > 0 ? (
                <Text className="font-kanit text-gray-400 text-lg">
                  Resend in {cooldown}s
                </Text>
              ) : (
                <Pressable onPress={handleResend} disabled={!canResend}>
                  <Text
                    className={`font-kanitBold text-lg underline ${canResend ? "text-darkBlue" : "text-gray-400"}`}
                  >
                    Send again
                  </Text>
                </Pressable>
              )}
            </View>

            {formError ? (
              <Text className="font-kanit text-red-500 text-xs text-center mb-4">
                {formError}
              </Text>
            ) : null}

            <View className="w-[40%]">
              <SmallGhostButton
                buttonName={"Cancel"}
                isFontSmall
                isCentered={true}
                onPress={openCloseConfirmation}
              />
            </View>
          </KeyboardAvoidingView>
        </View>

        <View className="absolute -bottom-14 right-36 w-full rotate-[45deg] overflow-hidden">
          <Image
            source={require("../../../assets/images/blue_checker_1.png")}
            style={{ width: 400, height: 220 }}
            contentFit="contain"
          />
        </View>

        <View className="absolute bottom-10 right-16 w-full overflow-hidden">
          <Image
            source={require("../../../assets/images/cat1.png")}
            style={{ width: 400, height: 220 }}
            contentFit="contain"
          />
        </View>
      </ScrollView>

      <ConfirmBottomSheet
        visible={confirmVisible}
        title="Cancel verification?"
        description="Your verification code will be discarded and you'll need to re-enter your mobile number."
        confirmLabel="Leave"
        cancelLabel="Stay"
        onConfirm={handleLeaveVerification}
        onCancel={closeConfirmSheet}
      />
    </SafeAreaView>
  );
}

export default VerifyScreen;
