import { StateCreator } from "zustand";
import { userSlice } from "../types/store";
import { persist } from "zustand/middleware";
// import { persist } from "zustand/middleware";

const storedUser = localStorage.getItem("user");
const initialUser = storedUser ? JSON.parse(storedUser) : null;

console.log("initialUser", initialUser);

// export const createUserSlice: StateCreator<userSlice> = (set) => ({
//   user: initialUser,
//   addUser: (value) => set((state) => ({ ...state, user: value })),
//   // if u want you can add removeUser fn in this case we set addUser type as User | null so i use addUser as a logout function
//   removeUser: () => {
//     localStorage.removeItem("user");
//     set({ user: null });
//   },
// });

// ------------------- Middleware good but it's automatically reset the state when reload or other action (reset the localstorage data) so we don't need it , we need just get data that's it
// Wrap `userSlice` in the `persist` middleware
export const createUserSlice: StateCreator<
  userSlice,
  [],
  [["zustand/persist", Partial<userSlice>]]
> = persist(
  (set) => ({
    user: null,
    addUser: (value) => set((state) => ({ ...state, user: value })),
    removeUser: () => {
      localStorage.removeItem("user");
      set({ user: null });
    },
  }),
  // {
  //   name: "user", // Key to store in localStorage
  //   getStorage: () => localStorage, // Define storage (localStorage)
  // }
  // {
  //   name: "user", // Key in localStorage
  //   getStorage: () => localStorage, // Ensure localStorage is used
  //   // Fix to prevent resetting state on reload
  //   onRehydrateStorage: () => (state) => {
  //     if (state) {
  //       // Optionally log state to check if it's properly rehydrated
  //       console.log("Rehydrated state: ", state);
  //     }
  //   },
  // }
  {
    name: "user", // Key in localStorage
    getStorage: () => localStorage, // Use localStorage for persistence
    // Optionally whitelist/blacklist specific parts of the state for persistence
    partialize: (state) => ({ user: state.user }), // Persist only user slice
  }
);
