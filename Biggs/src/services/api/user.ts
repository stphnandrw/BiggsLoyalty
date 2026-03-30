import { api } from "@/src/services/api/api";

export const getUsers = async () => {
  try {
    const response = await api.get("/user/getUsers");
    console.log("Users API Response:", response.data);
  } catch (error) {
    console.error("Users API Error:", error);
  }
};

export const checkUserByTagUid = async (tag_uid: string) => {
  try {
    const response = await api.post(`/user/checkTagUID`, {
      tag_uid,
    });

    console.log("Check User By Tag UID API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Check User By Tag UID API Error:", error);
    throw error;
  }
};

export const checkUserExists = async (phone_number: string) => {
  try {
    const response = await api.post(`/user/check`, {
      phone_number,
    });
    console.log("Check User Exists API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Check User Exists API Error:", error);
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
}) => {
  try {
    const response = await api.post("/user/create", userData);
    console.log("Create User API Response:", response.data);
    return response.data;
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
) => {
  try {
    const response = await api.post(`/user/update/`, { ...userData, tag_uid });
    console.log("Update User API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Update User API Error:", error);
    throw error;
  }
};
