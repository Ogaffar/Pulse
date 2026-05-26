import { Avatar } from "@/components/ui/avatar";
import { Bell } from "lucide-react";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

interface DashboardHeaderProps {
  name?: string;
  hasUnread?: boolean;
}

export function DashboardHeader({ name = "there", hasUnread = true }: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-5 pt-5 pb-2">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-medium">
          {getGreeting()}, {name} 👋
        </h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
              <Bell size={20} className="text-foreground" />
            </button>
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-error border-2 border-card" />
            )}
          </div>
          <Avatar size="md" name={name} />
        </div>
      </div>
      <p className="text-caption text-muted-foreground mt-1">{today}</p>
    </div>
  );
}
