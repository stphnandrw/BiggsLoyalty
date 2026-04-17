import { api } from "@/src/services/api/api";
import { parseDirectOrEnvelope } from "@/src/services/api/schemas/common";
import {
  ClaimedVoucherListSchema,
  VoucherListSchema,
  VoucherMutationResponseSchema,
} from "@/src/services/api/schemas/vouchers";
import type {
  ApiMutationResponse,
  ClaimedVoucher,
  Voucher,
  VoucherMutationPayload,
} from "@/src/types";

const normalizeVoucherMutationResponse = (
  input: unknown,
): ApiMutationResponse<VoucherMutationPayload> => {
  const parsed = VoucherMutationResponseSchema.parse(input);
  const fallbackData: VoucherMutationPayload = {};

  if (typeof parsed.required_points === "number") {
    fallbackData.required_points = parsed.required_points;
  }

  if (typeof parsed.current_points === "number") {
    fallbackData.current_points = parsed.current_points;
  }

  if (typeof parsed.remaining_points === "number") {
    fallbackData.remaining_points = parsed.remaining_points;
  }

  return {
    status: parsed.status,
    message: parsed.message,
    data:
      parsed.data ??
      (Object.keys(fallbackData).length > 0 ? fallbackData : undefined),
  };
};

export const getClaimedVouchers = async (
  tag_uid: string,
): Promise<ClaimedVoucher[]> => {
  try {
    const response = await api.post(`/user/getClaimedVouchers`, {
      tag_uid,
    });
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: ClaimedVoucherListSchema,
      endpointName: "getClaimedVouchers",
    });
  } catch (error) {
    console.error("Get User Claimed Vouchers API Error:", error);
    throw error;
  }
};

export const getAvailableVouchers = async (
  tag_uid: string,
): Promise<Voucher[]> => {
  try {
    const response = await api.post(`/user/getAvailableVouchers`, {
      tag_uid,
    });
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: VoucherListSchema,
      endpointName: "getAvailableVouchers",
    });
  } catch (error) {
    console.error("Get Available Vouchers API Error:", error);
    throw error;
  }
};

export const getRedeemedVouchers = async (
  tag_uid: string,
): Promise<ClaimedVoucher[]> => {
  try {
    const response = await api.post(`/user/getRedeemedVouchers`, {
      tag_uid,
    });
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: ClaimedVoucherListSchema,
      endpointName: "getRedeemedVouchers",
    });
  } catch (error) {
    console.error("Get Redeemed Vouchers API Error:", error);
    throw error;
  }
};

export const claimVoucher = async (
  tag_uid: string,
  voucher_id: number,
): Promise<ApiMutationResponse<VoucherMutationPayload>> => {
  try {
    const response = await api.post(`/user/claimVoucher`, {
      tag_uid,
      voucher_id,
    });
    return normalizeVoucherMutationResponse(response.data);
  } catch (error) {
    console.error("Claim Voucher API Error:", error);
    throw error;
  }
};

export const redeemVoucher = async (
  tag_uid: string,
  claimed_voucher_id: number,
): Promise<ApiMutationResponse<VoucherMutationPayload>> => {
  try {
    console.log(
      "Redeeming voucher with tag_uid:",
      tag_uid,
      "claimed_voucher_id:",
      claimed_voucher_id,
    );
    const response = await api.post(`/user/startRedeemVoucher`, {
      tag_uid,
      claimed_voucher_id,
    });
    return normalizeVoucherMutationResponse(response.data);
  } catch (error) {
    console.error("Redeem Voucher API Error:", error);
    throw error;
  }
};

export const cancelVoucherRedemption = async (
  tag_uid: string,
  claimed_voucher_id: number,
): Promise<ApiMutationResponse<VoucherMutationPayload>> => {
  try {
    const response = await api.post(`/user/cancelVoucherRedemption`, {
      tag_uid,
      claimed_voucher_id,
    });
    return normalizeVoucherMutationResponse(response.data);
  } catch (error) {
    console.error("Cancel Voucher Redemption API Error:", error);
    throw error;
  }
};

export const checkOnProcessVoucher = async (
  tag_uid: string,
  claimed_voucher_id: number,
): Promise<VoucherMutationPayload | null> => {
  try {
    const response = await api.post(`/user/checkSelectedVoucher`, {
      tag_uid,
      claimed_voucher_id,
    });
    const parsed = VoucherMutationResponseSchema.parse(response.data);
    console.log("Check On Process Voucher API Response:", parsed);

    return parsed.data ?? null;
  } catch (error) {
    console.error("Check On Process Voucher API Error:", error);
    throw error;
  }
};
