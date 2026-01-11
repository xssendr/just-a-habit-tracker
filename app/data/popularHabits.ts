import type { HabitType } from "stores/habits";

export interface PopularHabit {
  id: string;
  name: string;
  trigger: string;
  old_action: string | null;
  action: string;
  reward: string;
  type: HabitType;
}

export const popularHabits: PopularHabit[] = [

    {
      id: "daily-planning",
      name: "Планирование дня",
      trigger: "После завтрака",
      old_action: null,
      action: "Записываю 3 главные задачи на день",
      reward: "Ясность и понимание, куда двигаться",
      type: "Creating",
    },
    {
      id: "procrastinating",
      name: "Прокрастинация",
      trigger: "Когда мне нужно начать работу",
      old_action: "Откладываю её на потом",
      action: "Открываю задачу и работаю 5 минут",
      reward: "Чувствую продуктивность и прогресс",
      type: "Replacing",
    },
    {
    id: "scrolling",
    name: "Листать телефон перед сном",
    trigger: "Ложусь в кровать",
    old_action: null,
    action: "Листаю соцсети и видео",
    reward: "Краткое удовольствие и отвлечение",
    type: "Breaking",
  },
];

export const getPopularHabitsByType = (type: HabitType): PopularHabit[] => {
  return popularHabits.filter((habit) => habit.type === type);
};
