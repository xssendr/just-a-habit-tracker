import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "~/components/ui/dialog"
import { Label } from "~/components/ui/label"
import { useHabitStore } from "stores/habits"

type HabitFormValues = {
  trigger: string
  action: string
  reward: string
  old_action?: string
}

type HabitType = "Creating" | "Replacing" | "Breaking"

function EditModal({ trigger, id }: { trigger: React.ReactNode, id: number | string }) {
  const { editHabit, getHabitById } = useHabitStore()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"create" | "replace" | "break">("create")

  const habit = getHabitById(id)
  const {
    register,
    handleSubmit,
    reset
  } = useForm<HabitFormValues>({
    defaultValues: {
      trigger: habit?.trigger || "",
      action: habit?.action || "",
      old_action: habit?.old_action || "",
      reward: habit?.reward || ""
    }
  })

  useEffect(() => {
    if (open && habit) {
      reset({
        trigger: habit.trigger,
        action: habit.action,
        old_action: habit.old_action || "",
        reward: habit.reward
      })
    }
  }, [open, habit, reset])

  const onSubmit = (data: HabitFormValues) => {
    editHabit(
      id, {
      ...data,
    });
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Edit Habit</DialogTitle>

            {habit?.type === "Creating" || habit?.type === "Breaking" ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 mt-4"
              >
                <div className="flex flex-col gap-1">
                  <Label htmlFor="trigger-edit" className="text-sm font-semibold">Trigger</Label>
                  <Input
                    id="trigger-edit"
                    placeholder="e.g., After I wake up"
                    {...register("trigger", { required: "Trigger is required" })}
                    className="transition-all focus:ring-2"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="action-edit" className="text-sm font-semibold">Action</Label>
                  <Input
                    id="action-edit"
                    placeholder="e.g., Drink a glass of water"
                    {...register("action", { required: "Action is required" })}
                    className="transition-all focus:ring-2"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="reward-edit" className="text-sm font-semibold">Reward</Label>
                  <Input
                    id="reward-edit"
                    placeholder="e.g., Feel refreshed and hydrated"
                    {...register("reward", { required: "Reward is required" })}
                    className="transition-all focus:ring-2"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                    <Button 
                      className="flex-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow" 
                      type="submit"
                    >
                      Save Changes
                    </Button>
                  <DialogClose asChild>
                    <Button
                      className="flex-1 cursor-pointer"
                      type="button"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </div>
              </form>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5 mt-4"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="trigger-replace-edit" className="text-sm font-semibold">Trigger</Label>
                  <Input
                    id="trigger-replace-edit"
                    placeholder="e.g., When I feel stressed"
                    {...register("trigger", { required: "Trigger is required" })}
                    className="transition-all focus:ring-2"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="old-action-edit" className="text-sm font-semibold">Old Action</Label>
                  <Input
                    id="old-action-edit"
                    placeholder="e.g., Eat junk food"
                    {...register("old_action", {
                      required: "Old action is required",
                    })}
                    className="transition-all focus:ring-2"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="new-action-edit" className="text-sm font-semibold">New Action</Label>
                  <Input
                    id="new-action-edit"
                    placeholder="e.g., Take 5 deep breaths"
                    {...register("action", { required: "New action is required" })}
                    className="transition-all focus:ring-2"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="reward-replace-edit" className="text-sm font-semibold">Reward</Label>
                  <Input
                    id="reward-replace-edit"
                    placeholder="e.g., Feel calm and in control"
                    {...register("reward", { required: "Reward is required" })}
                    className="transition-all focus:ring-2"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                    <Button 
                      className="flex-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow" 
                      type="submit"
                    >
                      Save Changes
                    </Button>
                  <DialogClose asChild>
                    <Button
                      className="flex-1 cursor-pointer"
                      type="button"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </div>
              </form>
            )}

        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export { EditModal }
