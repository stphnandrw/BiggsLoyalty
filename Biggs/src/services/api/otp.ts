import {
  GenerateOtpResponseSchema,
  VerifyOtpResponseSchema,
} from "@/src/services/api/schemas/otp";
import type { GenerateOtpResponse, VerifyOtpResponse } from "@/src/types";
import { api } from "./api";

export const generateOTP = async (
  phone_number: string,
  tag_uid: string,
  force: boolean,
): Promise<GenerateOtpResponse> => {
  try {
    const response = await api.post("/user/generate-otp", {
      phone_number,
      tag_uid,
      force,
    });
    console.log("Generate OTP API Response:", response.data);
    return GenerateOtpResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Generate OTP API Error:", error);
    throw error;
  }
};

export const verifyOTP = async (
  phone_number: string,
  otp_code: string,
): Promise<VerifyOtpResponse> => {
  try {
    const response = await api.post("/user/verify-otp", {
      phone_number,
      otp_code,
    });
    console.log("Verify OTP API Response:", response.data);
    const parsed = VerifyOtpResponseSchema.parse(response.data);

    return VerifyOtpResponseSchema.parse({
      ...parsed,
      time_check:
        parsed.time_check ??
        (typeof parsed.data === "object" &&
        parsed.data !== null &&
        "time_check" in parsed.data
          ? (parsed.data as { time_check?: string }).time_check
          : undefined),
    });
  } catch (error) {
    console.error("Verify OTP API Error:", error);
    throw error;
  }
};
