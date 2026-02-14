import { useEffect } from "react";
import { registerServiceWorker, initPwaPrompt } from "~/utils/pwa";

export function PwaInit() {
  useEffect(() => {
    registerServiceWorker();
    initPwaPrompt();
  }, []);

  return null;
}
