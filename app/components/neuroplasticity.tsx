import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Check, Dumbbell, Moon, Apple, TrendingUp } from "lucide-react";
import { useNeuroplasticityStore } from "stores/neuroplasticity";

type IconType = 'dumbbell' | 'moon' | 'apple';

const iconMap: Record<IconType, React.ComponentType<any>> = {
    dumbbell: Dumbbell,
    moon: Moon,
    apple: Apple
}

function Neuroplasticity() {
    const { cards, toggleCard, isCompleted } = useNeuroplasticityStore();
    return (
        <>
        {cards.map(card => {
            const completed = isCompleted(card.title);
            const Icon = iconMap[card.icon]
            return (
                <Card 
                    key={card.title}
                    className={`group w-full transition-all duration-200 ${
                        completed
                            ? "bg-primary/5 shadow-md"
                            : "bg-card/95 shadow-sm hover:-translate-y-1 hover:shadow-md"
                    }`}
                >
                    <CardContent className="flex h-full flex-col gap-4 justify-between">
                        <div className="flex items-start gap-3">
                        
                            <div className={`rounded-lg bg-muted p-2.5 ${card.color} transition-colors ${
                                completed ? "bg-primary/10" : ""
                            }`}>
                                <Icon />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-bold tracking-tight mb-1.5">
                                    {card.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {card.description}
                                </p>
                                
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                        {completed && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                                        <TrendingUp className="h-3 w-3" />
                                        <span>Формирование привычек ускорено</span>
                                    </div>
                                )}
                            <Button
                                variant={completed ? "secondary" : "default"}
                                className={`w-full cursor-pointer transition-all duration-200 ${
                                    completed
                                        ? "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                                        : "shadow-sm hover:shadow-md"
                                }`}
                                size="lg"
                                onClick={() => toggleCard(card.title)}
                            >
                                {completed ? (
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
            );
        })}
        </>
    )
}

export { Neuroplasticity };