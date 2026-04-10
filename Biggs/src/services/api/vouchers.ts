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

export const getAllVouchers = async (): Promise<Voucher[]> => {
  try {
    const response = await api.get("/vouchers");
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: VoucherListSchema,
      endpointName: "getAllVouchers",
    });
  } catch (error) {
    console.error("Get All Vouchers API Error:", error);
    throw error;
  }
};

export const getUserClaimedVouchers = async (
  tag_uid: string,
): Promise<ClaimedVoucher[]> => {
  try {
    const response = await api.post(`/claimed-vouchers/vouchers`, {
      tag_uid,
    });
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: ClaimedVoucherListSchema,
      endpointName: "getUserClaimedVouchers",
    });
  } catch (error) {
    console.error("Get User Claimed Vouchers API Error:", error);
    throw error;
  }
};

export const getVouchersExcludingClaimed = async (
  tag_uid: string,
): Promise<Voucher[]> => {
  try {
    const response = await api.post(`/vouchers/exclude-claimed`, {
      tag_uid,
    });
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: VoucherListSchema,
      endpointName: "getVouchersExcludingClaimed",
    });
  } catch (error) {
    console.error("Get Vouchers Excluding Claimed API Error:", error);
    throw error;
  }
};

export const claimVoucher = async (
  tag_uid: string,
  voucher_id: number,
): Promise<ApiMutationResponse<VoucherMutationPayload>> => {
  try {
    const response = await api.post(`/claimed-vouchers/claim`, {
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
    const response = await api.post(`/claimed-vouchers/redeem`, {
      tag_uid,
      claimed_voucher_id,
    });
    return normalizeVoucherMutationResponse(response.data);
  } catch (error) {
    console.error("Redeem Voucher API Error:", error);
    throw error;
  }
};
