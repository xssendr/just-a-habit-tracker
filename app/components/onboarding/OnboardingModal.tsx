import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { useOnboardingStore } from "../../../stores/onboarding";
import { Sparkles, Target, Brain, Zap, ArrowRight } from "lucide-react";

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: OnboardingStep[] = [
  {
    title: "Добро пожаловать в Just a habit tracker!",
    description: "Сейчас расскажем, как тут всё работает",
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    title: "Триггер, Действие и Награда",
    description: "Каждая привычка состоит из триггера (причина действия), действия (что вы делаете) и награды (стимул повторить действие).",
    icon: <Target className="h-6 w-6" />,
  },
  {
    title: "Нейропластичность",
    description: "Такие факторы, как упражнения, сон и питание ускоряют формирование привычек за счёт создания нейронных связей в мозге.",
    icon: <Brain className="h-6 w-6" />,
  },
  {
    title: "Интенсивность",
    description: "Отслеживайте уровень усилий при выполнении привычки. Это помогает ускорить прогресс, при этом избежав выгорания.",
    icon: <Zap className="h-6 w-6" />,
  },
];

function OnboardingModal() {
  const { markStepCompleted, completedSteps } = useOnboardingStore();
  const [currentStep, setCurrentStep] = useState(0);
  const isOpen = !completedSteps.includes('welcome');

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      markStepCompleted('welcome');
    }
  };

  const handleSkip = () => {
    markStepCompleted('welcome');
  };

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              {step.icon}
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-center">
            {step.title}
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed pt-2 text-center">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Progress indicators */}
          <div className="flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "bg-primary w-8"
                    : index < currentStep
                    ? "bg-primary/50 w-2"
                    : "bg-muted w-2"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSkip}
              variant="outline"
              className="flex-1 cursor-pointer"
              size="lg"
            >
              Пропустить
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
              size="lg"
            >
              {isLast ? "Начать" : "Далее"}
              {!isLast && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { OnboardingModal };
