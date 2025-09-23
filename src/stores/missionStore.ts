import { create } from 'zustand'
import { EnergyMission, SafetyReport, TeamMission } from '@/types'

interface MissionState {
  activeMissions: EnergyMission[]
  completedMissions: EnergyMission[]
  safetyReports: SafetyReport[]
  teamMissions: TeamMission[]
  isLoading: boolean
  error: string | null
}

interface MissionActions {
  setActiveMissions: (missions: EnergyMission[]) => void
  addActiveMission: (mission: EnergyMission) => void
  updateMissionProgress: (missionId: string, currentValue: number) => void
  completeMission: (missionId: string) => void
  addSafetyReport: (report: SafetyReport) => void
  updateSafetyReport: (reportId: string, updates: Partial<SafetyReport>) => void
  setTeamMissions: (missions: TeamMission[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

type MissionStore = MissionState & MissionActions

export const useMissionStore = create<MissionStore>((set, get) => ({
  activeMissions: [],
  completedMissions: [],
  safetyReports: [],
  teamMissions: [],
  isLoading: false,
  error: null,

  setActiveMissions: (missions) => {
    set({ activeMissions: missions })
  },

  addActiveMission: (mission) => {
    const { activeMissions } = get()
    set({ activeMissions: [...activeMissions, mission] })
  },

  updateMissionProgress: (missionId, currentValue) => {
    const { activeMissions } = get()
    const updatedMissions = activeMissions.map(mission =>
      mission.id === missionId
        ? { ...mission, currentValue }
        : mission
    )
    set({ activeMissions: updatedMissions })
  },

  completeMission: (missionId) => {
    const { activeMissions, completedMissions } = get()
    const mission = activeMissions.find(m => m.id === missionId)

    if (mission) {
      const completedMission = { ...mission, status: 'completed' as const }
      set({
        activeMissions: activeMissions.filter(m => m.id !== missionId),
        completedMissions: [...completedMissions, completedMission]
      })
    }
  },

  addSafetyReport: (report) => {
    const { safetyReports } = get()
    set({ safetyReports: [report, ...safetyReports] })
  },

  updateSafetyReport: (reportId, updates) => {
    const { safetyReports } = get()
    const updatedReports = safetyReports.map(report =>
      report.id === reportId
        ? { ...report, ...updates }
        : report
    )
    set({ safetyReports: updatedReports })
  },

  setTeamMissions: (missions) => {
    set({ teamMissions: missions })
  },

  setLoading: (loading) => {
    set({ isLoading: loading })
  },

  setError: (error) => {
    set({ error })
  },
}))