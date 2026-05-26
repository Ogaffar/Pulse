import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center h-[22px] px-2 rounded-sm text-[11px] font-medium",
  {
    variants: {
      variant: {
        warm: "bg-[#FEF3C7] text-[#92400E]",
        cool: "bg-[#D1FAE5] text-[#065F46]",
        cold: "bg-[#FEE2E2] text-[#991B1B]",
        neutral: "bg-[#F3F4F6] text-[#374151]",
        default: "bg-primary-light text-primary",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive/10 text-destructive",
        outline: "border border-border-strong text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
