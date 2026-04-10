export type LoyaltyPoints = {
  points: number;
};

export type CheckTagUidResponse = {
  status?: boolean;
  message?: string;
  phone_number?: string | null;
};

export type CheckUserExistsResponse = {
  exists: boolean;
  tag_uid?: string;
  is_incomplete?: boolean;
  name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  birthday?: string | null;
  expo_push_token?: string | null;
  events_flag?: number;
  franchising_flag?: number;
};

export type UserMutationResponse = {
  status?: string;
  message: string;
};
