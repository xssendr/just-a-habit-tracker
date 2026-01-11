import { useState, useEffect } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { PenLine, Check, Trash, Flame, Zap, AlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useHabitStore } from "stores/habits";
import type { IntensityLevel } from "stores/habits";
import { EditModal } from "~/components/editModal";
import { DeleteModal } from "~/components/deleteModal";
import { AutomaticCheckModal } from "~/components/automaticCheckModal";
import { IntensityModal } from "~/components/intensityModal";
import { SkipReasonModal } from "~/components/skipReasonModal";

function Habits() {
  const { habits, toggleHabit, getIntensityStats, checkMissedDays, resetStreak } = useHabitStore();
  const [automaticCheckOpen, setAutomaticCheckOpen] = useState<{ [key: string]: boolean }>({});
  const [intensityModalOpen, setIntensityModalOpen] = useState<{ [key: string]: boolean }>({});
  const [skipReasonModalOpen, setSkipReasonModalOpen] = useState<{ [key: string]: boolean }>({});
  const [missedHabits, setMissedHabits] = useState<Array<{ habit: any; daysMissed: string[] }>>([]);
  const [hasCheckedMissedDays, setHasCheckedMissedDays] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Проверка достижения 30 дней
  useEffect(() => {
    habits.forEach((habit) => {
      const goalDays = habit.goalDays ?? 30;
      if (habit.progress === 30 && goalDays === 30 && !habit.isAutomatic) {
        setAutomaticCheckOpen((prev) => ({ ...prev, [habit.id]: true }));
      }
    });
  }, [habits]);

  // Проверка пропущенных дней
  useEffect(() => {
    if (!hasCheckedMissedDays && habits.length > 0) {
      const { missedHabits } = checkMissedDays();
      if (missedHabits.length > 0) {
        setMissedHabits(missedHabits);
        // Модальное окно
        missedHabits.forEach(({ habit }) => {
          setSkipReasonModalOpen((prev) => ({ ...prev, [habit.id]: true }));
        });
      }
      setHasCheckedMissedDays(true);
    }
  }, [habits.length, hasCheckedMissedDays]);

  const handleSkipReason = (habitId: string, reason: string) => {
    resetStreak(habitId, reason);
    setSkipReasonModalOpen((prev) => ({ ...prev, [habitId]: false }));
  };

  return (
    <>
      {habits.map((habit) => {
        const goalDays = habit.goalDays ?? 30;
        const isCompletedToday = habit.lastCompleted === today;
        const progressPercent = (habit.progress * 100) / goalDays;
        const typeColor =
          habit.type === "Replacing"
            ? "text-amber-500 bg-amber-500/10"
            : habit.type === "Creating"
            ? "text-emerald-500 bg-emerald-500/10"
            : "text-rose-500 bg-rose-500/10";
        
        const intensityStats = getIntensityStats(habit.id);
        const averagePercentage = intensityStats ? Math.round((intensityStats.average / 2) * 100) : 0;
        
        const getIntensityColor = (percentage: number) => {
          if (percentage <= 33) return { color: "text-emerald-500", bg: "bg-emerald-500/10" };
          if (percentage <= 67) return { color: "text-amber-500", bg: "bg-amber-500/10" };
          return { color: "text-rose-500", bg: "bg-rose-500/10" };
        };
        
        const intensityColor = getIntensityColor(averagePercentage);

        return (
          <>
            <Card
              className={`group w-full max-w-full flex-shrink transition-all duration-200 ${
                isCompletedToday
                  ? "bg-primary/5 shadow-md"
                  : "bg-card/95 shadow-sm hover:-translate-y-1 hover:shadow-md"
              }`}
              key={habit.id}
            >
            <CardContent className="flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-3 flex-1 min-w-0">
                  <span
                    className={`inline-flex items-center w-min rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide ${typeColor}`}
                  >
                    {habit.type === "Breaking" ? "Избавляемся" : (habit.type === "Creating" ? "Создаём" : "Заменяем")}
                  </span>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Триггер</span>
                      <p className="font-medium text-foreground leading-relaxed">
                        {habit.trigger}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Действие</span>
                      <p className="text-foreground leading-relaxed">
                        {habit.old_action && (
                          <>
                            <del className="mr-2 text-muted-foreground/60">
                              {habit.old_action}
                            </del>
                          </>
                        )}
                        <span className="font-medium">{habit.action}</span>
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Награда</span>
                      <p className="text-foreground font-medium leading-relaxed">
                        {habit.reward}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <EditModal
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer text-muted-foreground transition-all hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110"
                        aria-label="Edit habit"
                      >
                        <PenLine className="h-4 w-4" />
                      </Button>
                    }
                    id={habit.id}
                  />
                  <DeleteModal
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:scale-110"
                        aria-label="Delete habit"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    }
                    id={habit.id}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-border/50 mt-2 pt-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      <Flame className={`transition-colors ${isCompletedToday ? "text-amber-500 fill-amber-500/20" : "text-muted-foreground/50"}`} size={16} />
                      Стрик
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {habit.progress} <span className="text-xs font-normal text-muted-foreground">/ {goalDays}</span>
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={progressPercent} className="h-2.5" />
                    {isCompletedToday && (
                      <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>

                {intensityStats && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        <Zap className={`${intensityColor.color}`} size={16} />
                        Интенсивность
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${intensityColor.bg} ${intensityColor.color}`}>
                        {averagePercentage}%
                      </span>
                    </div>
                    {intensityStats.consecutiveHard >= 7 && (
                      <div className="flex items-center gap-2 p-2 rounded-md bg-amber-500/10 border border-amber-500/20">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-xs text-amber-700 dark:text-amber-300">
                          Высокая интенсивность {intensityStats.consecutiveHard} дней подряд. Главное не выгореть!
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  variant={isCompletedToday ? "secondary" : "default"}
                  onClick={() => {
                    if (isCompletedToday) {
                      toggleHabit(habit.id);
                    } else {
                      setIntensityModalOpen((prev) => ({ ...prev, [habit.id]: true }));
                    }
                  }}
                  className={`cursor-pointer text-sm font-semibold transition-all duration-200 ${
                    isCompletedToday
                      ? "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                      : "shadow-sm hover:shadow-md"
                  }`}
                  size="lg"
                >
                  {isCompletedToday ? (
                    <>
                      <Check className="h-4 w-4" /> Выполнено
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" /> Выполнить
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          <AutomaticCheckModal
            habitId={habit.id}
            open={automaticCheckOpen[habit.id] ?? false}
            onOpenChange={(open) =>
              setAutomaticCheckOpen((prev) => ({ ...prev, [habit.id]: open }))
            }
          />
          <IntensityModal
            open={intensityModalOpen[habit.id] ?? false}
            onOpenChange={(open) =>
              setIntensityModalOpen((prev) => ({ ...prev, [habit.id]: open }))
            }
            onConfirm={(intensity: IntensityLevel) => {
              toggleHabit(habit.id, intensity);
            }}
            id={habit.id}
          />
          <SkipReasonModal
            open={skipReasonModalOpen[habit.id] ?? false}
            onOpenChange={(open) =>
              setSkipReasonModalOpen((prev) => ({ ...prev, [habit.id]: open }))
            }
            onConfirm={(reason: string) => handleSkipReason(habit.id, reason)}
            habitName={habit.action}
          />
        </>
        );
      })}
    </>
  );
}

export { Habits };
