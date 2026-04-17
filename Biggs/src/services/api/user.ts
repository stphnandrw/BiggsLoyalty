import { api } from "@/src/services/api/api";
import { parseDirectOrEnvelope } from "@/src/services/api/schemas/common";
import { MenuItemSchema } from "@/src/services/api/schemas/menu";
import { LoyaltyPointsSchema } from "@/src/services/api/schemas/user";
import {
    CheckTagUidResponseSchema,
    CheckUserExistsResponseSchema,
    FavoriteCodeResponseSchema,
    FavoriteEntitySchema,
    UserMutationResponseSchema,
} from "@/src/services/api/schemas/user-responses";
import type {
    CheckTagUidResponse,
    CheckUserExistsResponse,
    LoyaltyPoints,
    UserMutationResponse,
} from "@/src/types";

export const checkUserByTagUid = async (
  tag_uid: string,
): Promise<CheckTagUidResponse> => {
  try {
    const response = await api.post(`/user/checkTagUID`, {
      tag_uid,
    });

    console.log("Check User By Tag UID API Response:", response.data);
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: CheckTagUidResponseSchema,
      endpointName: "checkUserByTagUid",
    });
  } catch (error) {
    console.error("Check User By Tag UID API Error:", error);
    throw error;
  }
};

export const checkUserExists = async (
  phone_number: string,
): Promise<CheckUserExistsResponse> => {
  try {
    const response = await api.post(`/user/check`, {
      phone_number,
    });
    console.log("Check User Exists API Response:", response.data);
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: CheckUserExistsResponseSchema,
      endpointName: "checkUserExists",
    });
  } catch (error) {
    console.error("Check User Exists API Error:", error);
    throw error;
  }
};

export const getLoyaltyPoints = async (
  tag_uid: string,
): Promise<LoyaltyPoints> => {
  try {
    const response = await api.post(`/user/loyalty-points`, {
      tag_uid,
    });
    console.log("Get Loyalty Points API Response:", response.data);
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: LoyaltyPointsSchema,
      endpointName: "getLoyaltyPoints",
    });
  } catch (error) {
    console.error("Get Loyalty Points API Error:", error);
    throw error;
  }
};

export const createUser = async (userData: {
  tag_uid: string;
  name: string;
  email: string;
  phone_number: string;
  password: string;
  fave_location?: string;
  fave_item?: string;
  birthday?: string;
  expo_push_token?: string;
  events_flag?: boolean;
  franchising_flag?: boolean;
}): Promise<UserMutationResponse> => {
  try {
    const response = await api.post("/user/create", userData);
    console.log("Create User API Response:", response.data);
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: UserMutationResponseSchema,
      endpointName: "createUser",
    });
  } catch (error) {
    console.error("Create User API Error:", error);
    throw error;
  }
};

export const updateUser = async (
  tag_uid: string,
  userData: Partial<{
    name: string;
    email: string;
    phone_number: string;
    birthday?: string;
    expo_push_token?: string;
    fave_location?: string;
    fave_item?: string;
    events_flag?: boolean;
    franchising_flag?: boolean;
  }>,
): Promise<UserMutationResponse> => {
  try {
    const response = await api.post(`/user/update/`, { ...userData, tag_uid });
    console.log("Update User API Response:", response.data);
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: UserMutationResponseSchema,
      endpointName: "updateUser",
    });
  } catch (error) {
    console.error("Update User API Error:", error);
    throw error;
  }
};

export const addFavoriteLocation = async (
  tag_uid: string,
  branch_id: number,
): Promise<UserMutationResponse> => {
  try {
    const response = await api.post(`/user/addFavoriteLocation`, {
      tag_uid,
      branch_id,
    });
    console.log("Add Favorite Location API Response:", response.data);
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: UserMutationResponseSchema,
      endpointName: "addFavoriteLocation",
    });
  } catch (error) {
    console.error("Add Favorite Location API Error:", error);
    throw error;
  }
};

export const addFavoriteMenu = async (
  tag_uid: string,
  m_id: number,
): Promise<UserMutationResponse> => {
  try {
    const response = await api.post(`/user/addFavoriteMenu`, {
      tag_uid,
      m_id,
    });
    console.log("Add Favorite Menu API Response:", response.data);
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: UserMutationResponseSchema,
      endpointName: "addFavoriteMenu",
    });
  } catch (error) {
    console.error("Add Favorite Menu API Error:", error);
    throw error;
  }
};

export const getFavoriteBranchByCode = async (branch_code: string) => {
  try {
    const response = await api.post(`/user/getFavoriteBranchByCode`, {
      branch_code,
    });

    console.log("Get Favorite Branch By Code API Response:", response.data);
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: FavoriteEntitySchema,
      endpointName: "getFavoriteBranchByCode",
    });
  } catch (error) {
    console.error("Get Favorite Branch By Code API Error:", error);
    throw error;
  }
};

export const getFavoriteLocationByTagUid = async (tag_uid: string) => {
  try {
    const response = await api.post(`/user/getFavoriteLocationByTagUid`, {
      tag_uid,
    });
    console.log(
      "Get Favorite Location By Tag UID API Response:",
      response.data,
    );
    const parsed = parseDirectOrEnvelope({
      input: response.data,
      directSchema: FavoriteCodeResponseSchema,
      endpointName: "getFavoriteLocationByTagUid",
    });
    if (typeof parsed === "string") {
      return parsed;
    }

    return parsed.fave_location ?? null;
  } catch (error) {
    console.error("Get Favorite Location By Tag UID API Error:", error);
    throw error;
  }
};

export const getFavoriteMenuByCode = async (menu_code: string) => {
  try {
    const response = await api.post(`/user/getFavoriteMenuByCode`, {
      menu_code,
    });

    console.log("Get Favorite Menu By Code API Response:", response.data);
    return parseDirectOrEnvelope({
      input: response.data,
      directSchema: MenuItemSchema,
      endpointName: "getFavoriteMenuByCode",
    });
  } catch (error) {
    console.error("Get Favorite Menu By Code API Error:", error);
    throw error;
  }
};

export const getFavoriteMenuByTagUid = async (tag_uid: string) => {
  try {
    const response = await api.post(`/user/getFavoriteMenuByTagUid`, {
      tag_uid,
    });

    console.log("Get Favorite Menu By Tag UID API Response:", response.data);

    const parsed = parseDirectOrEnvelope({
      input: response.data,
      directSchema: FavoriteCodeResponseSchema,
      endpointName: "getFavoriteMenuByTagUid",
    });
    if (typeof parsed === "string") {
      return parsed;
    }

    return parsed.fave_item ?? null;
  } catch (error) {
    console.error("Get Favorite Menu By Tag UID API Error:", error);
    throw error;
  }
};
