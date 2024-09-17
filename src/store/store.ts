import { persist } from "zustand/middleware";
import create from "solid-zustand";
import { authSlice, userSlice } from "./../types/store";
import { createAuthSlice } from "./AuthSlice";
import { createUserSlice } from "./userSlice";

// combine store
// interface SharedSlice {
//   addBoth: () => void;
//   getBoth: () => void;
// }

// const createSharedSlice: StateCreator<
//   BearSlice & FishSlice,
//   [],
//   [],
//   SharedSlice
// > = (set, get) => ({
//   addBoth: () => {
//     // you can reuse previous methods
//     get().addBear();
//     get().addFish();
//     // or do them from scratch
//     // set((state) => ({ bears: state.bears + 1, fishes: state.fishes + 1 })
//   },
//   getBoth: () => get().bears + get().fishes,
// });

// const useBoundStore = create<BearSlice & FishSlice & SharedSlice>()((...a) => ({
//   ...createBearSlice(...a),
//   ...createFishSlice(...a),
//   ...createSharedSlice(...a),
// }));

const useAuthAppStore = create<authSlice & userSlice>()((...a) => ({
  ...createAuthSlice(...a),
  ...createUserSlice(...a),
}));

// const useAuthAppStore = create<authSlice & userSlice>()(
//   persist(
//     (...a) => ({
//       ...createAuthSlice(...a),
//       ...createUserSlice(...a),
//     }),
//     {
//       name: "user", // Name of the key in localStorage
//       getStorage: () => localStorage, // Use localStorage
//       // Optionally you can whitelist/blacklist specific states
//       partialize: (state) => ({ user: state.user }), // Persist only necessary parts
//     }
//   )
// );

export default useAuthAppStore;
