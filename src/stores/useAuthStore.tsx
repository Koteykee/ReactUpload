import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

import { loginUser, registerUser, refreshToken } from "../api/auth.api";
import type { LoginSchemaType } from "../features/auth/validation/login.schema";
import type { RegistrationSchemaType } from "../features/auth/validation/registration.schema";

export interface DecodedToken {
  email: string;
  userId: string;
}

interface AuthStore {
  user: DecodedToken | null;
  accessToken: string | null;

  logout: () => void;
  setToken: (newToken: string) => void;
  login: (values: LoginSchemaType) => Promise<void>;
  register: (values: RegistrationSchemaType) => Promise<{ message: string }>;
  refresh: () => Promise<{ accessToken: string }>;
}

const decodeToken = (accessToken: string): DecodedToken | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(accessToken);
    return { email: decoded.email, userId: decoded.userId };
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      setToken: (newToken: string) => {
        const decoded = decodeToken(newToken);

        if (!decoded) {
          set({ user: null, accessToken: null });
          return;
        }

        set({
          accessToken: newToken,
          user: decoded,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
        });
      },

      login: async (values: LoginSchemaType) => {
        try {
          const data = await loginUser(values);
          set({
            accessToken: data.accessToken,
            user: decodeToken(data.accessToken),
          });
        } catch (err) {
          console.log(err);
          throw err;
        }
      },

      register: async (values: RegistrationSchemaType) => {
        try {
          const data = await registerUser(values);
          return data;
        } catch (err) {
          console.log(err);
          throw err;
        }
      },

      refresh: async () => {
        try {
          const data = await refreshToken();
          set((state) => {
            state.setToken(data.accessToken);
            return state;
          });
          return data;
        } catch (err) {
          set({ user: null, accessToken: null });
          console.log(err);
          throw err;
        }
      },
    }),
    {
      name: "authStore",
      partialize: (state) => ({
        accessToken: state.accessToken,
      }),
    },
  ),
);
