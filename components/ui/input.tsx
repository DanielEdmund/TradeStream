import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "focus-ring h-9 w-full rounded-md border bg-surface-950/80 px-3 text-sm text-plat placeholder:text-slate-500 transition-colors",
        invalid ? "border-bear/60" : "border-white/10 hover:border-white/20",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
