import { StateCreator } from "zustand";
import { authSlice } from "../types/store";

export const createAuthSlice: StateCreator<authSlice> = (set) => ({
  otp: null,
  token: "",
  setOtp: (value: number) => set(() => ({ otp: value })),
  setToken: (value: string) => set(() => ({ token: value })),
});
