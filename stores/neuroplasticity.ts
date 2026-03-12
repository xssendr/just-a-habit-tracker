import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type IconType = 'dumbbell' | 'moon' | 'apple';

interface NeuroplasticityCard {
    title: string;
    description: string;
    icon: IconType;
    color: string;
}

type NeuroplasticityStore = {
  cards: NeuroplasticityCard[];
  completed: Record<string, boolean>;
  lastResetDate: string | null;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  ensureToday: () => void;
  toggleCard: (title: string) => void;
  isCompleted: (title: string) => boolean;
};

function getLocalDayKey(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export const useNeuroplasticityStore = create<NeuroplasticityStore>()(
  persist(
    (set, get) => ({
      cards: [
        {
          title: "Движение и мозг",
          description: "Регулярные лёгкие тренировки усиливают приток крови к мозгу и помогают укреплять новые связи. Даже 5–10 минут движения после привычного триггера уже дают эффект.",
          icon: "dumbbell",
          color: "text-red-600 dark:text-red-400"
        },
        {
          title: "Сон и закрепление привычек",
          description: "Во время сна мозг «перепаковывает» день и закрепляет повторяющиеся цепочки триггер → действие → награда. Стабильный сон делает новые привычки более прочными.",
          icon: "moon",
          color: "text-indigo-600 dark:text-indigo-400"
        },
        {
          title: "Питание и энергия",
          description: "Стабильное питание и вода снижают резкие провалы энергии. Так проще не срываться на старые триггеры вроде сладкого «на автомате» и удерживать новые привычки.",
          icon: "apple",
          color: "text-emerald-600 dark:text-emerald-400"
        }
      ],
      completed: {},
      lastResetDate: null,
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),

      ensureToday: () => {
        const today = getLocalDayKey();
        const state = get();
        if (state.lastResetDate !== today) {
          set({ completed: {}, lastResetDate: today });
        }
      },

      toggleCard: (title) =>
        set((state) => {
          const today = getLocalDayKey();
          
          if (state.lastResetDate !== today) {
            return {
              completed: { [title]: true },
              lastResetDate: today,
            };
          }

          return {
            completed: {
              ...state.completed,
              [title]: !state.completed[title],
            },
          };
        }),

      isCompleted: (title) => {
        return get().completed[title] || false;
      },
    }),
    {
      name: 'neuroplasticity-store', // 🔑 localStorage key
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        state?.ensureToday();
      },
    }
  )
);
