import { create } from "zustand"

interface BlockState {
  blockedUsers: number[]
  blockUser: (userId: number) => void
  unblockUser: (userId: number) => void
  isBlocked: (userId: number) => boolean
}

export const useBlockStore = create<BlockState>((set, get) => ({
  blockedUsers: [],
  blockUser: (userId) =>
    set((state) => ({
      blockedUsers: [...state.blockedUsers, userId],
    })),
  unblockUser: (userId) =>
    set((state) => ({
      blockedUsers: state.blockedUsers.filter((id) => id !== userId),
    })),
  isBlocked: (userId) => get().blockedUsers.includes(userId),
}))
