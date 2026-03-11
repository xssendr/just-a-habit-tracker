import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import { CreateModal } from "~/components/createModal";
import { Habits } from "~/components/habits";
import { Plus } from "lucide-react";
import { useHabitStore } from "stores/habits";
import { Neuroplasticity } from "~/components/neuroplasticity";
import { Card, CardContent } from "~/components/ui/card";
import { OnboardingModal } from "~/components/onboarding/OnboardingModal";
import { useEffect } from "react";
import { useLaunchParams } from '@tma.js/sdk-react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Just a habit tracker" },
    {
      name: "description",
      content: "Track your habits, build streaks, and support your brain with short neuroplasticity tasks.",
    },
  ];
}

export default function Home() {
  console.log(useLaunchParams());
  const { habits } = useHabitStore();
  const maxHabits = 68;
  const isLimitReached = habits.length >= maxHabits;

  return (
    <div className="min-h-screen bg-background">
      <OnboardingModal />
      <div className="flex w-full flex-col gap-8 px-4 py-6 md:gap-10 md:px-6 lg:px-10 lg:py-10">
        <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3 flex-1">
            <div>
              <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Just a habit tracker
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Просто трекер привычек, не иначе
              </p>
            </div>
          </div>

          <Card className="w-full md:w-auto shadow-sm transition-all hover:shadow-md">
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Активные привычки</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight">
                  {habits.length}
                </span>
                <span className="text-xl mfont-medium text-muted-foreground">
                  / {maxHabits}
                </span>
              </div>
              <p className="text-xs text-muted-foreground/80">
                Чем меньше, тем лучше
              </p>
            </div>
              <CreateModal
                trigger={
                  <Button
                    size="lg"
                    className="cursor-pointer whitespace-nowrap w-full sm:w-auto shadow-sm hover:shadow transition-shadow"
                    disabled={isLimitReached}
                  >
                    <Plus className="h-4 w-4" />
                    {isLimitReached ? "Достигнут лимит" : "Новая привычка"}
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </header>

        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              Привычки
            </h2>
            {habits.length > 0 && (
              <p className="text-xs text-muted-foreground max-w-md">
                Стрики - штука манипулятивная, зато рабочая
              </p>
            )}
          </div>

          {habits.length ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Habits />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border/60 bg-muted/30 backdrop-blur-sm px-6 py-16 text-center transition-all hover:border-border hover:bg-muted/40">
              <div className="rounded-full bg-muted p-4 mb-2">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold sm:text-xl">
                Пока привычек нет
              </h3>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                Чем проще привычка, тем быстрее сформируется
              </p>
              <CreateModal
                trigger={
                  <Button className="mt-2 cursor-pointer shadow-sm hover:shadow transition-shadow" size="lg">
                    <Plus className="h-4 w-4" /> Создать первую привычку
                  </Button>
                }
              />
            </div>
          )}
        </section>
        <section className="space-y-4 pb-8 md:pb-10 lg:pb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              Нейропластичность
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground max-w-md sm:text-right">
              Факторы, которые позволяют ускорить формирование любой привычки
            </p>
          </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Neuroplasticity />
            </div>
        </section>
      </div>
    </div>
  );
}
