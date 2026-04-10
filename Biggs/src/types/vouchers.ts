export type Voucher = {
  voucher_id: number;
  voucher_name: string;
  description: string;
  required_points: number;
  image_url: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string | null;
};

export type ClaimedVoucher = Voucher & {
  claimed_voucher_id: number;
  tag_uid: string;
  claimed_at: string | null;
};

export type VoucherListItem = Voucher | ClaimedVoucher;

export type VoucherMutationPayload = {
  required_points?: number;
  current_points?: number;
  remaining_points?: number;
};
