import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Badge } from '@/types'
import { calculateUserLevel } from '@/lib/utils'

interface UserState {
  user: User | null
  isLoading: boolean
  error: string | null
}

interface UserActions {
  setUser: (user: User) => void
  updatePoints: (points: number) => void
  addBadge: (badge: Badge) => void
  updateLocation: (location: { lat: number; lng: number; address: string }) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

type UserStore = UserState & UserActions

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      setUser: (user: User) => {
        set({ user, error: null })
      },

      updatePoints: (points: number) => {
        const { user } = get()
        if (!user) return

        const newPoints = user.points + points
        const newLevel = calculateUserLevel(newPoints).level

        set({
          user: {
            ...user,
            points: newPoints,
            level: newLevel,
            lastActiveAt: new Date(),
          },
        })
      },

      addBadge: (badge: Badge) => {
        const { user } = get()
        if (!user) return

        const existingBadge = user.badges.find(b => b.id === badge.id)
        if (existingBadge) return

        set({
          user: {
            ...user,
            badges: [...user.badges, badge],
          },
        })
      },

      updateLocation: (location) => {
        const { user } = get()
        if (!user) return

        set({
          user: {
            ...user,
            location,
          },
        })
      },

      clearUser: () => {
        set({ user: null, error: null })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)