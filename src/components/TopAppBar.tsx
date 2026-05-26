import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopAppBarProps {
  title: string;
  largeTitle?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export function TopAppBar({ title, largeTitle = false, onBack, rightAction, className }: TopAppBarProps) {
  if (largeTitle) {
    return (
      <div className={cn("bg-card border-b border-border", className)}>
        <div className="h-14 flex items-center justify-between px-4">
          {onBack ? (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ChevronLeft size={22} />
            </Button>
          ) : <div className="w-10" />}
          <div className="w-10 flex justify-end">{rightAction}</div>
        </div>
        <div className="px-4 pb-3">
          <h2>{title}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-14 bg-card border-b border-border flex items-center justify-between px-4", className)}>
      {onBack ? (
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft size={22} />
        </Button>
      ) : <div className="w-10" />}
      <h4 className="absolute left-1/2 -translate-x-1/2">{title}</h4>
      <div className="w-10 flex justify-end">{rightAction}</div>
    </div>
  );
}
