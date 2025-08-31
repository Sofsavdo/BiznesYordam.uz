import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "gradient-primary text-primary-foreground hover:shadow-glow scale-hover font-semibold",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 scale-hover",
        outline:
          "border-2 border-primary bg-background text-primary hover:gradient-primary hover:text-primary-foreground scale-hover",
        secondary:
          "gradient-secondary text-secondary-foreground hover:shadow-elegant scale-hover font-semibold",
        ghost: "hover:bg-accent/10 hover:text-accent scale-hover",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "gradient-business text-primary-foreground hover:shadow-business scale-hover font-bold tracking-wide",
        success: "gradient-success text-accent-foreground hover:shadow-glow scale-hover font-semibold",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-md px-4 py-2",
        lg: "h-14 rounded-xl px-10 py-4 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
