import { HeaderText } from "@/src/components/layout/header";
import { PrimaryButton } from "@/src/components/ui/Buttons";
import { NormalInput } from "@/src/components/ui/Inputs";
import { useRegistration } from "@/src/context/UserRegistrationContext";
import {
  checkUserExists,
  createUser,
  updateUser,
} from "@/src/services/api/user";
import { saveLastLogin } from "@/src/services/notifications";
import { getItem, setItem } from "@/src/utils/asyncStorage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PersonalDetails() {
  const [localFormData, setLocalFormData] = useState({
    name: "",
    email: "",
    birthday: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    birthday: "",
    form: "",
  });
  const [tcAccepted, setTcAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const { updateFormData, getFormData, formData } = useRegistration();

  // Resolve expoPushToken: context → AsyncStorage (written by usePushNotifications)
  const [resolvedPushToken, setResolvedPushToken] = useState(
    formData.expoPushToken ?? "",
  );
  useEffect(() => {
    if (!resolvedPushToken) {
      getItem("expoPushToken").then((stored) => {
        if (stored) setResolvedPushToken(stored);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 70,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleNext = async () => {
    if (isLoading) return;

    const newErrors = {
      name: "",
      email: "",
      birthday: "",
      form: "",
    };
    let hasError = false;

    if (!localFormData.name.trim()) {
      newErrors.name = "We'd love to know your name!";
      hasError = true;
    }
    if (!localFormData.email.trim()) {
      newErrors.email = "Pop in your email so we can stay in touch.";
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localFormData.email)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }
    if (
      localFormData.birthday &&
      !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(
        localFormData.birthday,
      )
    ) {
      newErrors.birthday = "Use the format YYYY-MM-DD (e.g. 1995-08-23).";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      updateFormData({
        name: localFormData.name,
        email: localFormData.email,
        birthday: localFormData.birthday,
      });

      // getFormData() is used only for phone_number set earlier
      const registrationData = { ...getFormData(), ...formData };
      const phoneNumber = registrationData.phone_number;

      if (!phoneNumber) {
        setErrors((prev) => ({
          ...prev,
          form: "Missing phone number. Please go back and verify your number.",
        }));
        return;
      }

      const userData = await checkUserExists(phoneNumber);
      const isIncomplete = Boolean(userData.is_incomplete);

      if (isIncomplete) {
        if (!userData.tag_uid) {
          setErrors((prev) => ({
            ...prev,
            form: "Unable to complete profile. Please try again.",
          }));
          return;
        }

        // User stub already exists — update it with full profile details
        await updateUser(userData.tag_uid, {
          name: localFormData.name,
          email: localFormData.email,
          birthday: localFormData.birthday,
          expo_push_token: resolvedPushToken,
        });
        const freshUser = await checkUserExists(phoneNumber);
        await setItem("userData", JSON.stringify(freshUser));
        saveLastLogin();
        router.replace("/(tabs)");
      } else {
        // Brand-new user — create, then re-fetch to get the full record
        await createUser({
          tag_uid: registrationData.tag_uid || "",
          name: localFormData.name,
          email: localFormData.email,
          phone_number: phoneNumber,
          password: registrationData.password || "",
          birthday: localFormData.birthday,
          expo_push_token: resolvedPushToken,
        });
        const freshUser = await checkUserExists(phoneNumber);
        await setItem("userData", JSON.stringify(freshUser));
        saveLastLogin();
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      const message =
        error?.response?.data?.message ??
        (error?.message ||
          "Failed to complete registration. Please try again.");
      setErrors((prev) => ({ ...prev, form: message }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => router.back();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView
          className="flex-1 bg-black"
          edges={["top", "left", "right"]}
        >
          <View className="flex-1 w-full bg-dirtyWhite">
            <HeaderText
              hasBackButton={true}
              onBackPress={handleBack}
              useConfirmation
              confirmTitle="Are you sure you want to go back?"
              confirmDescription="Your details won't be saved."
            />

            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
              keyboardShouldPersistTaps="handled"
              className="w-full px-6"
            >
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                  width: "100%",
                }}
              >
                {/* Step indicator */}
                <View className="flex-row items-center justify-center gap-3 mb-8 mt-2">
                  <View className="flex-row items-center gap-1">
                    <View className="w-7 h-7 rounded-full bg-darkBlue items-center justify-center">
                      <MaterialIcons name="check" size={14} color="white" />
                    </View>
                    <Text className="text-xs font-kanit text-darkBlue">
                      Phone
                    </Text>
                  </View>
                  <View className="w-10 h-0.5 bg-darkBlue" />
                  <View className="flex-row items-center gap-1">
                    <View className="w-7 h-7 rounded-full bg-darkBlue items-center justify-center">
                      <Text className="text-xs font-bold text-white">2</Text>
                    </View>
                    <Text className="text-xs font-kanitBold text-darkBlue">
                      Details
                    </Text>
                  </View>
                </View>

                {/* Header */}
                <View className="w-full mb-8">
                  <Text className="text-4xl font-bold text-gray-800 mb-2">
                    Let&apos;s get started
                  </Text>
                  <Text className="text-base text-gray-400">
                    Just a couple of details and you&apos;re in.
                  </Text>
                </View>

                {/* Name */}
                <View className="w-full mb-4">
                  <Text className="text-sm font-semibold text-gray-500 mb-2 ml-1">
                    Name
                  </Text>
                  <NormalInput
                    inputName=""
                    inputWidth={"100%"}
                    onChangeText={(text) => {
                      setLocalFormData((prev) => ({ ...prev, name: text }));
                      setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                  />
                  {errors.name ? (
                    <Text className="text-red-500 text-sm mt-1 ml-1">
                      {errors.name}
                    </Text>
                  ) : null}
                </View>

                {/* Email */}
                <View className="w-full mb-4">
                  <Text className="text-sm font-semibold text-gray-500 mb-2 ml-1">
                    Email
                  </Text>
                  <NormalInput
                    inputName=""
                    inputWidth={"100%"}
                    onChangeText={(text) => {
                      setLocalFormData((prev) => ({ ...prev, email: text }));
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                  />
                  {errors.email ? (
                    <Text className="text-red-500 text-sm mt-1 ml-1">
                      {errors.email}
                    </Text>
                  ) : (
                    <Text className="text-xs text-gray-400 mt-2 ml-1">
                      We&apos;ll send you updates and never spam — promise.
                    </Text>
                  )}
                </View>

                {/* Birthday */}
                <View className="w-full mb-6">
                  <Text className="text-sm font-semibold text-gray-500 mb-2 ml-1">
                    Birthday
                  </Text>
                  <NormalInput
                    inputName=""
                    placeholder="YYYY-MM-DD"
                    inputWidth={"100%"}
                    onChangeText={(text) => {
                      setLocalFormData((prev) => ({ ...prev, birthday: text }));
                      setErrors((prev) => ({ ...prev, birthday: "" }));
                    }}
                  />
                  {errors.birthday ? (
                    <Text className="text-red-500 text-sm mt-1 ml-1">
                      {errors.birthday}
                    </Text>
                  ) : (
                    <Text className="text-xs text-gray-400 mt-2 ml-1">
                      Optional · format YYYY-MM-DD
                    </Text>
                  )}
                </View>

                {/* T&C Checkbox */}
                <Pressable
                  className="flex-row items-center gap-2 mb-6"
                  onPress={() => setTcAccepted((v) => !v)}
                >
                  <MaterialIcons
                    name={tcAccepted ? "check-box" : "check-box-outline-blank"}
                    size={24}
                    color="#14284d"
                  />
                  <Text className="text-sm font-kanit text-gray-700 flex-1">
                    I agree to the{" "}
                    <Text className="text-darkBlue underline">
                      Terms &amp; Conditions
                    </Text>{" "}
                    and{" "}
                    <Text className="text-darkBlue underline">
                      Privacy Policy
                    </Text>
                  </Text>
                </Pressable>

                {/* Form-level error (network / API) */}
                {errors.form ? (
                  <Text className="text-red-500 text-sm mb-4 text-center">
                    {errors.form}
                  </Text>
                ) : null}

                <PrimaryButton
                  buttonName={isLoading ? "Creating account…" : "Let's go!"}
                  buttonWidth={"100%"}
                  isCentered={true}
                  onPress={handleNext}
                  isSticky={false}
                  isFontSmall={false}
                  isDisabled={!tcAccepted || isLoading}
                />
              </Animated.View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
