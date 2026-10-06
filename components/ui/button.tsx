import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-45 active:translate-y-px select-none",
  {
    variants: {
      variant: {
        default: "bg-volt text-slate-950 hover:bg-cyan-400 shadow-glow-volt",
        bull: "bg-bull text-slate-950 hover:bg-emerald-300 shadow-glow-bull font-bold",
        bear: "bg-bear text-white hover:bg-red-400 shadow-glow-bear font-bold",
        neon: "bg-neon text-white hover:bg-violet-400",
        outline: "border border-white/12 bg-white/[0.03] text-plat hover:bg-white/[0.08] hover:border-white/20",
        ghost: "text-slate-300 hover:bg-white/[0.07] hover:text-white",
        "ghost-bull": "border border-bull/35 text-bull hover:bg-bull/12",
        "ghost-bear": "border border-bear/35 text-bear hover:bg-bear/12",
        link: "text-volt underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 text-[13px]",
        sm: "h-7 px-2.5 text-[11px] rounded",
        lg: "h-11 px-6 text-sm",
        icon: "h-8 w-8",
        "icon-sm": "h-7 w-7",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
