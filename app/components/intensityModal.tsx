import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { IntensitySelector } from "~/components/intensitySelector";
import type { IntensityLevel } from "stores/habits";
import { useHabitStore } from "stores/habits";

interface IntensityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (intensity: IntensityLevel) => void;
  id?: any;
}

function IntensityModal({ open, onOpenChange, onConfirm, id }: IntensityModalProps) {
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityLevel | undefined>();

  const { toggleHabit, getHabitById } = useHabitStore()

  const habitName = getHabitById(id)?.action

  const handleConfirm = () => {
    if (selectedIntensity) {
      onConfirm(selectedIntensity);
      setSelectedIntensity(undefined);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Отметить выполнение
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed pt-2">
            {habitName ? `Как сложно было выполнить "${habitName}"?` : "Как сложно было выполнить привычку?"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <IntensitySelector
            onSelect={setSelectedIntensity}
            selected={selectedIntensity}
          />

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleConfirm}
              disabled={!selectedIntensity}
              className="flex-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
              size="lg"
            >
              Подтвердить
            </Button>
            <Button
              onClick={() => {
                setSelectedIntensity(undefined);
                onOpenChange(false);
              }}
              variant="outline"
              className="flex-1 cursor-pointer"
              size="lg"
            >
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { IntensityModal };
