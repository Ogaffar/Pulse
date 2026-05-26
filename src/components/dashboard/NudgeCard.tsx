import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WarmthIndicator } from "@/components/WarmthIndicator";
import { Lightbulb, ChevronDown } from "lucide-react";

interface NudgeData {
  name: string;
  role: string;
  company: string;
  warmth: "active" | "cooling" | "dormant";
  reason: string;
  daysAgo: number;
}

interface NudgeCardProps {
  nudge: NudgeData;
  contactId: string;
  weekCount: string;
  elevated?: boolean;
  collapsed?: boolean;
}

export function NudgeCard({ nudge, contactId, weekCount, elevated = true, collapsed = false }: NudgeCardProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsed);
  const navigate = useNavigate();

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full bg-card rounded-xl border border-border-strong p-4 shadow-card flex items-center gap-3 transition-all duration-200 hover:shadow-elevated text-left"
      >
        <Avatar size="md" name={nudge.name} />
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-medium truncate">{nudge.name}</p>
          <p className="text-[12px] text-muted-foreground truncate">{nudge.reason.slice(0, 50)}...</p>
        </div>
        <ChevronDown size={18} className="text-muted-foreground shrink-0" />
      </button>
    );
  }

  return (
    <div className={cn(
      "bg-card rounded-xl border border-border-strong p-5 transition-all duration-200",
      elevated ? "shadow-elevated" : "shadow-card"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-caption text-primary">Today's nudge</p>
        <Badge variant="neutral" className="text-[10px]">{weekCount}</Badge>
      </div>

      {/* Contact info */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar size="lg" name={nudge.name} />
        <div className="flex-1 min-w-0">
          <h3 className="text-[18px] font-medium">{nudge.name}</h3>
          <p className="text-[13px] text-muted-foreground">{nudge.role} · {nudge.company}</p>
        </div>
        <WarmthIndicator level={nudge.warmth} />
      </div>

      {/* Reason banner */}
      <div className="bg-primary-light rounded-md p-3 flex gap-2.5 mb-4">
        <Lightbulb size={16} className="text-primary shrink-0 mt-0.5" />
        <p className="text-[13px] text-primary leading-relaxed">{nudge.reason}</p>
      </div>

      {/* Actions */}
      <Button className="w-full mb-2" onClick={() => navigate(`/draft/${contactId}`)}>Draft a message →</Button>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" className="flex-1">Snooze 3 days</Button>
        <Button variant="ghost" size="sm" className="flex-1">Not now</Button>
      </div>
    </div>
  );
}
