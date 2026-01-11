import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { AlertTriangle, Calendar, Home, Heart, Briefcase, Users } from "lucide-react";

interface SkipReasonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  habitName?: string;
}

const skipReasons = [
  {
    id: "sick",
    label: "Заболел(а)",
    icon: Heart,
    description: "Плохое самочувствие, болезнь",
  },
  {
    id: "busy",
    label: "Занятость",
    icon: Briefcase,
    description: "Работа, учеба, важные дела",
  },
  {
    id: "forgot",
    label: "Забыл(а)",
    description: "Просто вспомнил(а) о привычке",
  },
  {
    id: "lazy",
    label: "Не хватило мотивации",
    description: "Не было сил или желания",
  },
  {
    id: "other",
    label: "Другое",
    description: "Своя причина",
  },
];

export function SkipReasonModal({ open, onOpenChange, onConfirm, habitName }: SkipReasonModalProps) {
  const handleReasonSelect = (reason: string) => {
    onConfirm(reason);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Стрик сброшен
          </DialogTitle>
          <DialogDescription>
            {habitName && `Привычка "${habitName}" была пропущена и стрик обнулен. `}
            Пожалуйста, укажите причину - это поможет нам лучше понять ваши паттерны и предложить поддержку в будущем.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-2 py-4">
          {skipReasons.map((reason) => {
            const IconComponent = reason.icon;
            return (
              <Button
                key={reason.id}
                variant="outline"
                className="h-auto p-3 justify-start text-left"
                onClick={() => handleReasonSelect(reason.label)}
              >
                {IconComponent && (
                  <IconComponent className="h-4 w-4 mr-3 flex-shrink-0" />
                )}
                <div className="flex flex-col">
                  <span className="font-medium">{reason.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {reason.description}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
