import { useEffect } from "react";
import { initPwaPrompt } from "~/utils/pwa";

export function PwaInit() {
  useEffect(() => {
    initPwaPrompt();
  }, []);

  return null;
}
