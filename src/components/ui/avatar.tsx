import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-[13px]",
  lg: "h-[52px] w-[52px] text-[15px]",
  xl: "h-[72px] w-[72px] text-[20px]",
} as const;

type AvatarSize = keyof typeof sizeClasses;

const fallbackColors = [
  "bg-primary text-primary-foreground",
  "bg-primary-mid text-white",
  "bg-accent-warm text-white",
  "bg-accent-coral text-white",
  "bg-success text-white",
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface PulseAvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  size?: AvatarSize;
  src?: string;
  name?: string;
  showOnline?: boolean;
}

const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, PulseAvatarProps>(
  ({ className, size = "md", src, name = "", showOnline = false, ...props }, ref) => {
    const colorClass = fallbackColors[hashName(name) % fallbackColors.length];
    const indicatorSize = size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";

    return (
      <div className="relative inline-flex">
        <AvatarPrimitive.Root
          ref={ref}
          className={cn("relative flex shrink-0 overflow-hidden rounded-full", sizeClasses[size], className)}
          {...props}
        >
          {src && (
            <AvatarPrimitive.Image className="aspect-square h-full w-full object-cover" src={src} alt={name} />
          )}
          <AvatarPrimitive.Fallback className={cn("flex h-full w-full items-center justify-center rounded-full font-medium", colorClass)}>
            {getInitials(name)}
          </AvatarPrimitive.Fallback>
        </AvatarPrimitive.Root>
        {showOnline && (
          <span className={cn("absolute bottom-0 right-0 rounded-full bg-success border-2 border-card", indicatorSize)} />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

// Re-export primitives for backward compat
const AvatarImage = AvatarPrimitive.Image;
const AvatarFallback = AvatarPrimitive.Fallback;

export { Avatar, AvatarImage, AvatarFallback };
