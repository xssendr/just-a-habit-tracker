import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { useHabitStore } from "stores/habits";
import { EditModal } from "~/components/editModal";
import { Sparkles, Edit } from "lucide-react";

interface AutomaticCheckModalProps {
  habitId: number | string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AutomaticCheckModal({ habitId, open, onOpenChange }: AutomaticCheckModalProps) {
  const { markAsAutomatic, getHabitById } = useHabitStore();
  const [showEdit, setShowEdit] = useState(false);
  const habit = getHabitById(habitId);

  if (!habit) return null;

  const handleYes = () => {
    markAsAutomatic(habitId);
    onOpenChange(false);
  };

  const handleNo = () => {
    setShowEdit(true);
  };

  return (
    <>
      <Dialog open={open && !showEdit} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-full bg-primary/10 p-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                30 дней завершено!
              </DialogTitle>
            </div>
            <DialogDescription className="text-base leading-relaxed pt-2">
              Поздравляем! Вы прошли первые 30 дней формирования привычки.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Дается ли вам это легко? Если привычка уже стала автоматической, мы продлим цель до 60 дней для закрепления.
            </p>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={handleYes}
                className="w-full cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                size="lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Да, это легко
              </Button>
              <Button
                onClick={handleNo}
                variant="outline"
                className="w-full cursor-pointer"
                size="lg"
              >
                <Edit className="mr-2 h-4 w-4" />
                Нет, нужно изменить действие
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showEdit && (
        <EditModal
          trigger={<div style={{ display: 'none' }} />}
          id={habitId}
        />
      )}
    </>
  );
}

export { AutomaticCheckModal };
