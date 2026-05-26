import { cn } from "@/lib/utils";

type WarmthLevel = "active" | "cooling" | "dormant";

const warmthColors: Record<WarmthLevel, string> = {
  active: "bg-success",
  cooling: "bg-warning",
  dormant: "bg-accent-coral",
};

const warmthLabels: Record<WarmthLevel, string> = {
  active: "Active",
  cooling: "Cooling",
  dormant: "Dormant",
};

interface WarmthIndicatorProps {
  level: WarmthLevel;
  showLabel?: boolean;
  className?: string;
}

export function WarmthIndicator({ level, showLabel = false, className }: WarmthIndicatorProps) {
  if (showLabel) {
    return (
      <div className={cn("inline-flex items-center gap-1.5", className)}>
        <span className={cn("w-2 h-2 rounded-full", warmthColors[level])} />
        <span className="text-[13px] text-muted-foreground">{warmthLabels[level]}</span>
      </div>
    );
  }

  return (
    <div className={cn("w-12 h-1 rounded-full", warmthColors[level], className)} />
  );
}
