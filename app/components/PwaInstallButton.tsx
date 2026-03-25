import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { showPwaPrompt } from "~/utils/pwa";
import { useDeferredPrompt } from "~/utils/pwa"; // Optional hook if created

export function PwaInstallButton() {
  const [installPrompt, setInstallPrompt] = useState(false);

  const handleInstall = () => {
    showPwaPrompt();
    setInstallPrompt(false);
  };

  // Simple trigger - show after some time or user action
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleInstall}
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Установить приложение
    </Button>
  );
}

