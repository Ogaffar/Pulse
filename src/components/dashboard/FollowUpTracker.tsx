import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface FollowUpTrackerProps {
  name: string;
  platform: string;
  hoursAgo: number;
}

export function FollowUpTracker({ name, platform, hoursAgo }: FollowUpTrackerProps) {
  return (
    <div className="bg-[#FEF3C7] border border-warning rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Clock size={20} className="text-warning shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-foreground mb-1">1 unacknowledged message</h4>
          <p className="text-[13px] text-foreground/80 leading-relaxed mb-3">
            {name} messaged you on {platform} {hoursAgo} hours ago and hasn't heard back.
          </p>
          <Button variant="ghost" size="sm" className="text-warning hover:text-warning hover:bg-warning/10 px-0">
            Reply now →
          </Button>
        </div>
      </div>
    </div>
  );
}
