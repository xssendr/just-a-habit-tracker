import * as React from "react";
import { Link, useLocation } from "react-router";
import { Brain, Home } from "lucide-react";
import { cn } from "~/lib/utils";

type TabItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: (pathname: string) => boolean;
};

const tabs: TabItem[] = [
  {
    to: "/",
    label: "Главная",
    icon: <Home className="size-5" />,
    isActive: (p) => p === "/" || p === "",
  },
  {
    to: "/ai-psychologist",
    label: "ИИ",
    icon: <Brain className="size-5" />,
    isActive: (p) => p.startsWith("/ai-psychologist"),
  },
];

export function BottomTabs() {
  const { pathname } = useLocation();

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-50",
        "border-t bg-background/80 backdrop-blur"
      )}
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      aria-label="Навигация"
    >
      <div className="mx-auto grid w-full max-w-5xl grid-cols-2 px-3 py-2 gap-1">
        {tabs.map((t) => {
          const active = t.isActive(pathname);
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-medium",
                "transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                active
                  ? "text-foreground bg-muted/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
              aria-current={active ? "page" : undefined}
            >
              {t.icon}
              <span>{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

