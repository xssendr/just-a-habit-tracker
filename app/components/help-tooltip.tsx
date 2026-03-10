import { InfoIcon } from "lucide-react"
import { useState } from "react"

type HelpTooltipProps = {
  text: string
  className?: string
}

function HelpTooltip({ text, className }: HelpTooltipProps) {
  const [open, setOpen] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className={`inline-flex items-center justify-center rounded-full border border-border/60 bg-background/80 p-0.5 align-middle text-[10px] text-muted-foreground/80 shadow-xs hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className ?? ""}`}
      aria-label="Подсказка"
    >
      <InfoIcon className="h-3 w-3" />
      {open && (
        <div className="pointer-events-auto absolute z-50 max-w-xs rounded-md border bg-popover px-3 py-2 text-left text-xs leading-relaxed text-popover-foreground shadow-md">
          {text}
        </div>
      )}
    </button>
  )
}

export { HelpTooltip }

