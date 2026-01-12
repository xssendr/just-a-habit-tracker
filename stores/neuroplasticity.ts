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
  toggleCard: (title: string) => void;
  isCompleted: (title: string) => boolean;
};

export const useNeuroplasticityStore = create<NeuroplasticityStore>()(
  persist(
    (set, get) => ({
      cards: [
        {
        title: "Упражнения",
        description: "Физическая активность всячески помогает создавать новые нейроны за счет... ээээ...",
        icon: "dumbbell",
        color: "text-red-600 dark:text-red-400"
    },
    {
        title: "Сон",
        description: "Во время сна мозг обрабатывает полученную информацию и создает новые нейронные связи. 8 часов сна - минимум",
        icon: "moon",
        color: "text-indigo-600 dark:text-indigo-400"
    },
    {
        title: "Полезное питание",
        description: "Возможно, не знаю",
        icon: "apple",
        color: "text-emerald-600 dark:text-emerald-400"
    }
      ],
      completed: {},
      lastResetDate: null,

      toggleCard: (title) =>
        set((state) => {
          const today = new Date().toISOString().split("T")[0];
          
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
        const today = new Date().toISOString().split("T")[0];
        const state = get();

        if (state.lastResetDate !== today) {
          set({
            completed: {},
            lastResetDate: today,
          });
          return false;
        }

        return state.completed[title] || false;
      },
    }),
    {
      name: 'neuroplasticity-store', // 🔑 localStorage key
    }
  )
);
