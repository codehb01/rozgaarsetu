import * as React from "react"
import { cn } from "@/lib/utils"

function LabelBadge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="label-badge"
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border",
        className
      )}
      {...props}
    />
  )
}

export { LabelBadge }
