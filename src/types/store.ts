export interface authSlice {
  otp: number | null;
  setOtp: (value: number) => void;
  token: string;
  setToken: (value: string) => void;
}

export type User = {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  photo: string;
  phone: string;
  bio: string;
  account_type: string;
  verified: boolean;
  mfa: number;
};

export interface userSlice {
  user: User | null;
  addUser: (value: User) => void;
  removeUser: () => void;
}
