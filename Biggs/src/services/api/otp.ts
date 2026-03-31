import { api } from "./api";

export const generateOTP = async (
  phone_number: string,
  tag_uid: string,
  force: boolean,
) => {
  try {
    const response = await api.post("/user/generate-otp", {
      phone_number,
      tag_uid,
      force,
    });
    console.log("Generate OTP API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Generate OTP API Error:", error);
    throw error;
  }
};

export const verifyOTP = async (phone_number: string, otp_code: string) => {
  try {
    const response = await api.post("/user/verify-otp", {
      phone_number,
      otp_code,
    });
    console.log("Verify OTP API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Verify OTP API Error:", error);
    throw error;
  }
};
