import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, value, ...props }, ref) => {
    // Fix controlled/uncontrolled component warning
    // For date inputs, don't normalize the value to allow proper date picker behavior
    const controlledValue = type === "date"
      ? value
      : (value !== undefined ? value : props.defaultValue !== undefined ? undefined : "");

    return (
      <input
        type={type}
        className={cn(
          // Layout & Structure
          "flex h-10 w-full rounded-md",
          // Border & Background
          "border border-input bg-background",
          // Spacing
          "px-3 py-2",
          // Typography
          "text-sm text-foreground",
          // Shadow & Visual Effects
          "shadow-sm opacity-100",
          // Transitions
          "transition-all duration-200",
          // File Input Styling
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Placeholder Styling - Uses global ::placeholder styles from globals.css
          // The global styles provide: color: hsl(var(--color-placeholder))
          "placeholder:opacity-100",
          // Focus States
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:border-ring",
          // Disabled State
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Hover State
          "hover:border-ring/50",
          // Date Input Specific - Ensure proper text color inheritance
          type === "date" && "appearance-none",
          className
        )}
        ref={ref}
        value={controlledValue}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
