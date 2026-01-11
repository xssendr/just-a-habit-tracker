import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HabitType = 'Creating' | 'Replacing' | 'Breaking';
export type IntensityLevel = 'easy' | 'medium' | 'hard';

export interface Habit {
  id: string;
  trigger: string;
  old_action?: string;
  action: string;
  reward: string;
  progress: number;
  type: HabitType;
  lastCompleted: string | null;
  goalDays: number;
  isAutomatic: boolean;
  intensityHistory: Array<{
    date: string;
    level: IntensityLevel;
  }>;
  missedDays: string[];
}

type HabitStore = {
  habits: Habit[];
  createHabit: (habit: Habit) => void;
  toggleHabit: (id: string, intensity?: IntensityLevel) => void;
  editHabit: (id: string, data: Partial<Omit<Habit, 'id'>>) => void;
  deleteHabit: (id: string) => void;
  getHabitById: (id: string) => Habit | undefined;
  markAsAutomatic: (id: string) => void;
  getIntensityStats: (id: string) => { average: number; trend: 'increasing' | 'decreasing' | 'stable'; consecutiveHard: number } | null;
  checkMissedDays: () => { missedHabits: Array<{ habit: Habit; daysMissed: string[] }> };
  resetStreak: (id: string, reason: string) => void;
};

const migrateHabit = (habit: any): Habit => {
  if ('goalDays' in habit && 'isAutomatic' in habit && 'intensityHistory' in habit && 'missedDays' in habit) {
    return habit as Habit;
  }
  return {
    ...habit,
    goalDays: habit.goalDays ?? 30,
    isAutomatic: habit.isAutomatic ?? false,
    intensityHistory: habit.intensityHistory ?? [],
    missedDays: habit.missedDays ?? [],
    skipReason: habit.skipReason ?? undefined,
  };
};

export const useHabitStore = create<HabitStore>()(
  persist<HabitStore>(
    (set, get) => ({
      habits: [],

      createHabit: (habit) =>
        set((state) => ({
          habits: [...state.habits, {
            ...habit,
            goalDays: habit.goalDays ?? 30,
            isAutomatic: habit.isAutomatic ?? false,
            intensityHistory: habit.intensityHistory ?? [],
            missedDays: habit.missedDays ?? [],
          }],
        })),

      editHabit: (id, data) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id ? { ...habit, ...data } : habit
          ),
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        })),

      getHabitById: (id) => {
        const habit = get().habits.find((habit) => habit.id === id);
        return habit ? migrateHabit(habit) : undefined;
      },

      toggleHabit: (id, intensity) =>
        set((state) => {
          const today = new Date().toISOString().split("T")[0];
          return {
            habits: state.habits.map((habit) => {
              if (habit.id !== id) return migrateHabit(habit);

              const migratedHabit = migrateHabit(habit);

              if (migratedHabit.lastCompleted === today) {
                
                const updatedHistory = migratedHabit.intensityHistory.filter(
                  (entry) => entry.date !== today
                );
                return {
                  ...migratedHabit,
                  progress: Math.max(0, migratedHabit.progress - 1),
                  lastCompleted: null,
                  intensityHistory: updatedHistory,
                };
              }

              const newHistory = intensity
                ? [
                    ...migratedHabit.intensityHistory.filter((entry) => entry.date !== today),
                    { date: today, level: intensity },
                  ]
                : migratedHabit.intensityHistory;

              return {
                ...migratedHabit,
                progress: migratedHabit.progress + 1,
                lastCompleted: today,
                intensityHistory: newHistory,
              };
            }),
          };
        }),

      markAsAutomatic: (id) =>
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== id) return migrateHabit(habit);
            const migratedHabit = migrateHabit(habit);
            return {
              ...migratedHabit,
              goalDays: 60,
              isAutomatic: true,
            };
          }),
        })),

      getIntensityStats: (id) => {
        const habit = get().habits.find((h) => h.id === id);
        if (!habit) return null;

        const migratedHabit = migrateHabit(habit);
        const history = migratedHabit.intensityHistory;

        if (history.length === 0) {
          return { average: 0, trend: 'stable' as const, consecutiveHard: 0 };
        }

        // Расчет средней интенсивности
        const levelToNumber = { easy: 0, medium: 1, hard: 2 };
        const numbers = history.map((entry) => levelToNumber[entry.level]);
        const average = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;

        // Последняя неделя
        const recent = history.slice(-7);
        if (recent.length < 2) {
          return { average, trend: 'stable' as const, consecutiveHard: 0 };
        }

        const recentNumbers = recent.map((entry) => levelToNumber[entry.level]);
        const firstHalf = recentNumbers.slice(0, Math.floor(recentNumbers.length / 2));
        const secondHalf = recentNumbers.slice(Math.floor(recentNumbers.length / 2));

        const firstAvg = firstHalf.reduce((sum, n) => sum + n, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, n) => sum + n, 0) / secondHalf.length;

        let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
        if (secondAvg > firstAvg + 0.2) trend = 'increasing';
        else if (secondAvg < firstAvg - 0.2) trend = 'decreasing';

        // Подсчет дней подряд с высокой интенсивностью
        let consecutiveHard = 0;
        const sortedByDate = [...history].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        for (const entry of sortedByDate) {
          if (entry.level === 'hard') {
            consecutiveHard++;
          } else {
            break;
          }
        }

        return { average, trend, consecutiveHard };
      },

      checkMissedDays: () => {
        const today = new Date();
        const missedHabits: Array<{ habit: Habit; daysMissed: string[] }> = [];
        
        set((state) => {
          const updatedHabits = state.habits.map((habit) => {
            const migratedHabit = migrateHabit(habit);
            if (!migratedHabit.lastCompleted) return migratedHabit;
            
            const lastCompletedDate = new Date(migratedHabit.lastCompleted);
            const currentDate = new Date(today);
            currentDate.setDate(currentDate.getDate() - 1);
            
            const missedDays: string[] = [];
            
            while (currentDate > lastCompletedDate) {
              const dateStr = currentDate.toISOString().split("T")[0];
          
              if (!migratedHabit.missedDays.includes(dateStr)) {
                missedDays.push(dateStr);
              }
              currentDate.setDate(currentDate.getDate() - 1);
            }
            
            if (missedDays.length > 0) {
              missedHabits.push({ habit: migratedHabit, daysMissed: missedDays });
              
              // Сброс стрика
              return {
                ...migratedHabit,
                progress: 0,
                lastCompleted: null,
                missedDays: [...migratedHabit.missedDays, ...missedDays].filter((date, index, arr) => arr.indexOf(date) === index), // Уникальные даты
                intensityHistory: [],
              };
            }
            
            return migratedHabit;
          });
          
          return { habits: updatedHabits };
        });
        
        return { missedHabits };
      },

      resetStreak: (id, reason) =>
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== id) return migrateHabit(habit);
            
            const migratedHabit = migrateHabit(habit);
            
            return {
              ...migratedHabit,
              skipReason: reason,
            };
          }),
        })),
    }),
    {
      name: 'habit-store',
      migrate: (persistedState: any) => {
        if (persistedState?.state?.habits) {
          return {
            ...persistedState,
            state: {
              ...persistedState.state,
              habits: persistedState.state.habits.map((habit: any) => migrateHabit(habit)),
            },
          };
        }
        return persistedState;
      },
    }
  )
);
