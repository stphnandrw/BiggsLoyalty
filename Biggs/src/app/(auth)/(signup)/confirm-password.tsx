import { PrimaryButton } from "@/src/components/ui/Buttons";
import { NormalInput } from "@/src/components/ui/Inputs";
import { AlertModal } from "@/src/components/ui/Modal";
import { useRegistration } from "@/src/context/UserRegistrationContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConfirmPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const { updateFormData, generateAndSetOTP } = useRegistration();

  const handleNext = () => {
    updateFormData({ password: formData.confirmPassword });
    const otp = generateAndSetOTP();
    console.log(
      "Password confirmed. OTP generated:",
      otp,
      "Proceeding to verification...",
    );
    router.push("/(auth)/verify");
  };

  const checkPasswordMatch = () => {
    if (!formData.password || !formData.confirmPassword) {
      setAlertMessage("Please fill in all fields.");
      setAlertVisible(true);
      return;
    }
    if (formData.password === formData.confirmPassword) {
      handleNext();
    } else {
      setAlertMessage("Passwords do not match. Please try again.");
      setAlertVisible(true);
    }
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView
        className="flex-1 items-center justify-center bg-black"
        edges={["top", "left", "right"]}
      >
        <View className="w-full h-full">
          <View className="w-full items-center justify-center">
            <Text className="text-2xl font-kanit text-darkBlue mb-1">
              Please confirm your password
            </Text>
            <NormalInput
              inputName="Password"
              inputWidth={"85%"}
              icon={<AntDesign name="eye" size={24} color="black" />}
              icon2={<AntDesign name="eye-invisible" size={24} color="black" />}
              iconClickable={true}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
            />
            <NormalInput
              inputName="Confirm Password"
              inputWidth={"85%"}
              icon={<AntDesign name="eye" size={24} color="black" />}
              icon2={<AntDesign name="eye-invisible" size={24} color="black" />}
              iconClickable={true}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
            />
            <PrimaryButton
              buttonName="Next"
              buttonWidth={"30%"}
              isCentered={true}
              onPress={checkPasswordMatch}
              isSticky={true}
              isFontSmall={true}
            />
          </View>
        </View>
        <AlertModal
          description={alertMessage}
          visible={alertVisible}
          onClose={() => setAlertVisible(false)}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
