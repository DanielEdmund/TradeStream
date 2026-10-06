import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-white/5 text-slate-300",
        bull: "border-bull/30 bg-bull/10 text-bull",
        bear: "border-bear/30 bg-bear/10 text-bear",
        volt: "border-volt/35 bg-volt/10 text-volt",
        alert: "border-alert/35 bg-alert/10 text-alert",
        neon: "border-neon/35 bg-neon/10 text-neon",
        outline: "border-white/15 text-slate-300",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
