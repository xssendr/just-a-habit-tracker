import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "~/components/ui/dialog"
import { Label } from "~/components/ui/label"
import { Card, CardContent } from "~/components/ui/card"
import { useHabitStore } from "stores/habits"
import { getPopularHabitsByType, type PopularHabit } from "~/data/popularHabits"
import { Sparkles } from "lucide-react"
import { HelpTooltip } from "~/components/help-tooltip"

type HabitFormValues = {
  trigger: string
  action: string
  reward: string
  old_action?: string
}

type HabitType = "Creating" | "Replacing" | "Breaking"

function CreateModal({ trigger }: { trigger: React.ReactNode }) {
  const { createHabit } = useHabitStore()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"popular" | "create" | "change" | "delete">(
    "popular"
  )
  const [selectedPopular, setSelectedPopular] = useState<PopularHabit | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm<HabitFormValues>()

  const tabToHabitType: Record<"create" | "change" | "delete", HabitType> = {
    create: "Creating",
    change: "Replacing",
    delete: "Breaking",
  }

  const handlePopularSelect = (habit: PopularHabit) => {
    setSelectedPopular(habit)
    setValue("trigger", habit.trigger)
    setValue("action", habit.action)
    setValue("reward", habit.reward)
    if (habit.type === "Replacing") {
      setValue("old_action", habit.old_action ?? undefined)
      setActiveTab("change")
    } else if (habit.type === "Breaking") {
      setActiveTab("delete")
    }
    else if (habit.type === "Creating") setActiveTab("create")
  }

  const onSubmit = (data: HabitFormValues) => {
    const habitType = selectedPopular 
      ? selectedPopular.type 
      : tabToHabitType[activeTab as "create" | "change" | "delete"]
    
    createHabit({
      id: String(Date.now()),
      ...data,
      progress: 0,
      type: habitType,
      lastCompleted: null,
      goalDays: 30,
      isAutomatic: false,
      intensityHistory: [],
      missedDays: []
    })

    reset()
    setSelectedPopular(null)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Создать привычку</DialogTitle>

          <Tabs
            value={activeTab}
            defaultValue="popular"
            onValueChange={(value) => {
              setActiveTab(value as "popular" | "create" | "change" | "delete")
              if (value !== "popular") {
                setSelectedPopular(null)
              }
            }}
            className="mt-4"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger className="cursor-pointer font-medium" value="popular">Популярные</TabsTrigger>
              <TabsTrigger className="cursor-pointer font-medium" value="create">Создать</TabsTrigger>
              <TabsTrigger className="cursor-pointer font-medium" value="change">Заменить</TabsTrigger>
              <TabsTrigger className="cursor-pointer font-medium" value="delete">Избавиться</TabsTrigger>
            </TabsList>

            <TabsContent value="popular" className="space-y-4 mt-4">
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                <p className="text-sm text-muted-foreground">
                  Выберите популярную привычку или создайте свою
                </p>
                <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-semibold mb-2 text-foreground">Создать привычку</h3>
                    <div className="space-y-2">
                      {getPopularHabitsByType("Creating").map((habit) => (
                        <Card
                          key={habit.id}
                          className="cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => handlePopularSelect(habit)}
                        >
                          <CardContent className="flex flex-col">
                            <div className="flex items-start gap-1">
                              <Sparkles className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm font-medium">{habit.name}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                  {habit.action}
                                </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-foreground">Заменить привычку</h3>
                    <div className="space-y-2">
                      {getPopularHabitsByType("Replacing").map((habit) => (
                        <Card
                          key={habit.id}
                          className="cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => handlePopularSelect(habit)}
                        >
                          <CardContent className="flex flex-col">
                            <div className="flex items-start gap-1">
                              <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm font-medium">{habit.name}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <del className="text-muted-foreground/60">{habit.old_action}</del> {habit.action}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-foreground">Избавиться от привычки</h3>
                    <div className="space-y-2">
                      {getPopularHabitsByType("Breaking").map((habit) => (
                        <Card
                          key={habit.id}
                          className="cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => handlePopularSelect(habit)}
                        >
                          <CardContent className="flex flex-col">
                            <div className="flex items-start gap-1">
                              <Sparkles className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm font-medium">{habit.name}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {habit.action}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {selectedPopular && (
                <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">Выбрано:</p>
                  <p className="text-sm font-medium">{selectedPopular.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Вы можете изменить детали на вкладке "
                    {selectedPopular.type === "Replacing" ? "Заменить" : selectedPopular.type === "Breaking" ? "Избавиться" : "Создать"}
                    " под свои триггеры и формулировки.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="create" className="space-y-4 mt-4">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1">
                  <Label htmlFor="trigger-create" className="text-sm font-semibold">Триггер</Label>
                  <Input
                    id="trigger-create"
                    placeholder="После завтрака"
                    {...register("trigger", { required: "Trigger is required" })}
                    className="transition-all focus:ring-2"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="action-create" className="text-sm font-semibold">Действие</Label>
                  <Input
                    id="action-create"
                    placeholder="Записываю 3 главные задачи на день"
                    {...register("action", { required: "Action is required" })}
                    className="transition-all focus:ring-2"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="reward-create" className="text-sm font-semibold">Награда</Label>
                  <Input
                    id="reward-create"
                    placeholder="Ясность и понимание, куда двигаться"
                    {...register("reward", { required: "Reward is required" })}
                    className="transition-all focus:ring-2"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                    <Button 
                      className="flex-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow" 
                      type="submit"
                    >
                      Создать
                    </Button>
                  <DialogClose asChild>
                    <Button
                      className="flex-1 cursor-pointer"
                      type="button"
                      variant="outline"
                      onClick={() => reset()}
                    >
                      Отменить
                    </Button>
                  </DialogClose>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="change" className="space-y-4 mt-4">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1">
                  <Label htmlFor="trigger-replace" className="text-sm font-semibold">Триггер</Label>
                  <Input
                    id="trigger-replace"
                    placeholder="Когда мне нужно начать работу"
                    {...register("trigger", { required: "Trigger is required" })}
                    className="transition-all focus:ring-2"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="old-action" className="text-sm font-semibold">Старое Действие</Label>
                  <Input
                    id="old-action"
                    placeholder="Откладываю её на потом"
                    {...register("old_action", {
                      required: activeTab === "change" ? "Old action is required" : false,
                    })}
                    className="transition-all focus:ring-2"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="new-action" className="text-sm font-semibold">Новое действие</Label>
                  <Input
                    id="new-action"
                    placeholder="Открываю задачу и работаю 5 минут"
                    {...register("action", { required: "New action is required" })}
                    className="transition-all focus:ring-2"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="reward-replace" className="text-sm font-semibold">Награда</Label>
                  <Input
                    id="reward-replace"
                    placeholder="Чувствую продуктивность и прогресс"
                    {...register("reward", { required: "Reward is required" })}
                    className="transition-all focus:ring-2"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                    <Button 
                      className="flex-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow" 
                      type="submit"
                    >
                      Заменить
                    </Button>
                  <DialogClose asChild>
                    <Button
                      className="flex-1 cursor-pointer"
                      type="button"
                      variant="outline"
                      onClick={() => reset()}
                    >
                      Отменить
                    </Button>
                  </DialogClose>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="delete" className="space-y-4 mt-4">
              <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground text-sm">
                  Как работать с вредной привычкой (я хз куда это написать, чтобы было понятно)
                </p>
                <p>
                  Полностью убрать триггер (ситуацию) часто сложно. Чаще всего помогает заранее
                  решить, что делать по‑новому, когда этот триггер снова появится.
                </p>
                <p>
                  Можно: а) уменьшить количество самих триггеров, б) придумать альтернативное
                  действие на тот же триггер.
                </p>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1">
                  <Label htmlFor="trigger-break" className="text-sm font-semibold">Триггер</Label>
                  <Input
                    id="trigger-break"
                    placeholder="Листать телефон перед сном"
                    {...register("trigger", { required: "Trigger is required" })}
                    className="transition-all focus:ring-2"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="action-break" className="text-sm font-semibold">Действие</Label>
                  <Input
                    id="action-break"
                    placeholder="Ложусь в кровать"
                    {...register("action", { required: "Action is required" })}
                    className="transition-all focus:ring-2"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="reward-break" className="text-sm font-semibold">Награда</Label>
                  <Input
                    id="reward-break"
                    placeholder="Листаю соцсети и видео"
                    {...register("reward", { required: "Reward is required" })}
                    className="transition-all focus:ring-2"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                    <Button 
                      className="flex-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow" 
                      type="submit"
                    >
                      Избавиться
                    </Button>
                  <DialogClose asChild>
                    <Button
                      className="flex-1 cursor-pointer"
                      type="button"
                      variant="outline"
                      onClick={() => reset()}
                    >
                      Отменить
                    </Button>
                  </DialogClose>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export { CreateModal }
