import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 프로토타입용 단순화된 사용자 상태
interface DemoUserState {
  isDemo: boolean
  currentLocation: { lat: number; lng: number; address: string } | null
}

interface DemoUserActions {
  setLocation: (location: { lat: number; lng: number; address: string }) => void
  clearLocation: () => void
}

type DemoUserStore = DemoUserState & DemoUserActions

export const useUserStore = create<DemoUserStore>()(
  persist(
    (set) => ({
      isDemo: true,
      currentLocation: null,

      setLocation: (location) => {
        set({ currentLocation: location })
      },

      clearLocation: () => {
        set({ currentLocation: null })
      },
    }),
    {
      name: 'demo-user-storage',
      partialize: (state) => ({ currentLocation: state.currentLocation }),
    }
  )
)