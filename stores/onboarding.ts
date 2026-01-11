import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type OnboardingStore = {
  completedSteps: string[];
  isCompleted: boolean;
  markStepCompleted: (step: string) => void;
  reset: () => void;
  hasSeenTooltip: (tooltipId: string) => boolean;
  markTooltipSeen: (tooltipId: string) => void;
};

const ONBOARDING_STEPS = [
  'welcome',
  'habits-overview',
  'create-habit',
  'neuroplasticity',
  'intensity',
  'complete',
] as const;

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      completedSteps: [],
      isCompleted: false,

      markStepCompleted: (step) =>
        set((state) => {
          const newSteps = state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step];
          
          const isCompleted = ONBOARDING_STEPS.every((s) => newSteps.includes(s));
          
          return {
            completedSteps: newSteps,
            isCompleted,
          };
        }),

      reset: () =>
        set({
          completedSteps: [],
          isCompleted: false,
        }),

      hasSeenTooltip: (tooltipId) => {
        const state = get();
        return state.completedSteps.includes(`tooltip-${tooltipId}`);
      },

      markTooltipSeen: (tooltipId) => {
        get().markStepCompleted(`tooltip-${tooltipId}`);
      },
    }),
    {
      name: 'onboarding-store',
    }
  )
);
