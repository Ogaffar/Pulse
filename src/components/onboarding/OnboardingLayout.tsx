import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Activity } from "lucide-react";

interface OnboardingLayoutProps {
  step: number;
  totalSteps: number;
  children: ReactNode;
  ctaLabel: string;
  ctaDisabled?: boolean;
  onCta: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  skipLabel?: string;
  ctaLarge?: boolean;
}

export function OnboardingLayout({
  step,
  totalSteps,
  children,
  ctaLabel,
  ctaDisabled = false,
  onCta,
  onBack,
  onSkip,
  skipLabel = "Skip for now",
  ctaLarge = false,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-2">
        <div className="w-10">
          {onBack && (
            <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
              <ChevronLeft size={22} className="text-foreground" />
            </button>
          )}
        </div>
        <Activity size={22} className="text-primary" strokeWidth={2.5} />
        <p className="text-caption text-muted-foreground w-10 text-right whitespace-nowrap">
          {step}/{totalSteps}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-36">
        {children}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-5 pt-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <Button
          className={cn("w-full", ctaLarge && "h-14 text-[16px] font-semibold")}
          disabled={ctaDisabled}
          onClick={onCta}
        >
          {ctaLabel}
        </Button>
        {onSkip && (
          <button
            onClick={onSkip}
            className="w-full text-center text-[13px] text-muted-foreground mt-2 py-1 hover:text-foreground transition-colors"
          >
            {skipLabel}
          </button>
        )}
      </div>
    </div>
  );
}
