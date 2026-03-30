import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useState } from "react";

interface UserRegistrationData {
  tag_uid: string;
  name: string;
  email: string;
  phone_number: string;
  password: string;
  expoPushToken?: string;
  birthday?: string;
}

interface UserRegistrationDataTypes {
  formData: UserRegistrationData;
  updateFormData: (newData: Partial<UserRegistrationData>) => void;
  resetFormData: () => void;
  getFormData: () => UserRegistrationData;
  generateAndSetOTP: () => string;
}

const UserRegistrationContext = createContext<
  UserRegistrationDataTypes | undefined
>(undefined);

export const UserRegistrationProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  const [formData, setFormData] = useState<UserRegistrationData>({
    tag_uid: "",
    name: "",
    email: "",
    phone_number: "",
    password: "",
    expoPushToken: "",
    birthday: "",
  });

  const resetFormData = () => {
    setFormData({
      tag_uid: "",
      name: "",
      email: "",
      phone_number: "",
      password: "",
      expoPushToken: "",
      birthday: "",
    });
    AsyncStorage.removeItem("pending_otp").catch(() => {});
  };

  const getFormData = () => {
    return formData;
  };

  const generateAndSetOTP = () => {
    const otp = generateOTP(6);
    console.log("Generated OTP:", otp);
    AsyncStorage.setItem("pending_otp", otp).catch(() => {});
    return otp;
  };

  const updateFormData = (newData: Partial<UserRegistrationData>) => {
    console.log("Updating form data with:", newData);
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <UserRegistrationContext.Provider
      value={{
        formData,
        updateFormData,
        resetFormData,
        getFormData,
        generateAndSetOTP,
      }}
    >
      {children}
    </UserRegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(UserRegistrationContext);
  if (!context) {
    throw new Error(
      "useRegistration must be used within a UserRegistrationProvider",
    );
  }
  return context;
};

function generateOTP(length: number) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}
