import { api } from "@/src/services/api/api";

export const getAllVouchers = async () => {
  try {
    const response = await api.get("/vouchers");
    return response.data;
  } catch (error) {
    console.error("Get All Vouchers API Error:", error);
    throw error;
  }
};

export const getUserClaimedVouchers = async (tag_uid: string) => {
  try {
    const response = await api.post(`/claimed-vouchers/vouchers`, {
      tag_uid,
    });
    return response.data;
  } catch (error) {
    console.error("Get User Claimed Vouchers API Error:", error);
    throw error;
  }
};

export const getVouchersExcludingClaimed = async (tag_uid: string) => {
  try {
    const response = await api.post(`/vouchers/exclude-claimed`, {
      tag_uid,
    });
    return response.data;
  } catch (error) {
    console.error("Get Vouchers Excluding Claimed API Error:", error);
    throw error;
  }
};

export const claimVoucher = async (tag_uid: string, voucher_id: number) => {
  try {
    const response = await api.post(`/claimed-vouchers/claim`, {
      tag_uid,
      voucher_id,
    });
    return response.data;
  } catch (error) {
    console.error("Claim Voucher API Error:", error);
    throw error;
  }
};

export const redeemVoucher = async (
  tag_uid: string,
  claimed_voucher_id: number,
) => {
  try {
    const response = await api.post(`/claimed-vouchers/redeem`, {
      tag_uid,
      claimed_voucher_id,
    });
    return response.data;
  } catch (error) {
    console.error("Redeem Voucher API Error:", error);
    throw error;
  }
};
