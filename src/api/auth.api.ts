import { Api } from "./api";
import type { LoginSchemaType } from "../features/auth/validation/login.schema";
import type { RegistrationSchemaType } from "../features/auth/validation/registration.schema";

export const loginUser = async (loginData: LoginSchemaType) => {
  const { data } = await Api.post<{ accessToken: string }>(
    "/auth/login",
    loginData,
  );
  return data;
};

export const registerUser = async (registerData: RegistrationSchemaType) => {
  const { data } = await Api.post<{ message: string }>(
    "/auth/register",
    registerData,
  );
  return data;
};

export const refreshToken = async () => {
  const { data } = await Api.get<{ accessToken: string }>("/auth/refresh");
  return data;
};
