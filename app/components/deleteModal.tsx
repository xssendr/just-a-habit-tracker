import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { useHabitStore } from "stores/habits"
import { AlertTriangle } from "lucide-react"

function DeleteModal({ trigger, id }: { trigger: React.ReactNode, id: number | string }) {
  const { deleteHabit } = useHabitStore()
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    deleteHabit(id)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <DialogTitle className="text-center text-xl font-bold">Delete Habit?</DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Are you sure you want to delete this habit? This action cannot be undone and all your progress will be lost.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4 sm:flex-row-reverse">
          <Button 
            className="flex-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow" 
            variant="destructive" 
            onClick={handleDelete}
          >
            Delete Habit
          </Button>
          <DialogClose asChild>
            <Button className="flex-1 cursor-pointer" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { DeleteModal }