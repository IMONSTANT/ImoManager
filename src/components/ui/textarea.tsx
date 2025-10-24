import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        // Layout & Structure
        "flex min-h-[80px] w-full rounded-md",
        // Border & Background
        "border border-input bg-background",
        // Spacing
        "px-3 py-2",
        // Typography
        "text-sm text-foreground",
        // Ring Offset for Focus
        "ring-offset-background",
        // Transitions
        "transition-colors",
        // Placeholder Styling - Uses global ::placeholder styles from globals.css
        // The global styles provide: color: hsl(var(--color-placeholder))
        "placeholder:opacity-100",
        // Focus States
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Disabled State
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Resize Behavior
        "resize-vertical",
        // Hover State
        "hover:border-ring/50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
