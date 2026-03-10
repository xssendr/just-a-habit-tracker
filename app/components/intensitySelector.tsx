import { Button } from "~/components/ui/button";
import type { IntensityLevel } from "stores/habits";
import { TrendingUp, Activity, Zap } from "lucide-react";

interface IntensitySelectorProps {
  onSelect: (level: IntensityLevel) => void;
  selected?: IntensityLevel;
}

const intensityOptions: Array<{
  level: IntensityLevel;
  label: string;
  description: string;
  color: string;
}> = [
  {
    level: 'easy',
    label: 'Легко',
    description: 'Минимальные усилия',
    color: 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500',
  },
  {
    level: 'medium',
    label: 'Средне',
    description: 'Умеренные усилия',
    color: 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500',
  },
  {
    level: 'hard',
    label: 'Тяжело',
    description: 'Требует много усилий',
    color: 'bg-rose-500 hover:bg-rose-600 text-white border-rose-500',
  },
];

function IntensitySelector({ onSelect, selected }: IntensitySelectorProps) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {intensityOptions.map((option) => (
          <Button
            key={option.level}
            variant={selected === option.level ? "default" : "outline"}
            onClick={() => onSelect(option.level)}
            className={`flex flex-col items-center gap-1.5 h-auto py-3 px-2 cursor-pointer transition-all ${
              selected === option.level
                ? option.color
                : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            }`}
          >
            <span className="text-xs font-medium text-white">{option.label}</span>

          </Button>
        ))}
      </div>
    </div>
  );
}

export { IntensitySelector };
