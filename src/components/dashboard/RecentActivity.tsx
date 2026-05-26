import { Avatar } from "@/components/ui/avatar";

interface Activity {
  name: string;
  action: string;
  timeAgo: string;
}

const activities: Activity[] = [
  { name: "Sarah Johnson", action: "You reconnected with", timeAgo: "2 days ago" },
  { name: "David Kim", action: "You sent a follow-up to", timeAgo: "4 days ago" },
  { name: "Maya Rodriguez", action: "You reconnected with", timeAgo: "1 week ago" },
];

export function RecentActivity() {
  return (
    <div>
      <h4 className="mb-3">Recent activity</h4>

      <div className="space-y-2">
        {activities.map((a, i) => (
          <div key={i} className="flex items-center gap-3 border-l-[3px] border-l-primary pl-3 py-2">
            <Avatar size="sm" name={a.name} />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] text-foreground">
                {a.action} <span className="font-medium">{a.name}</span>
              </p>
            </div>
            <p className="text-caption text-muted-foreground shrink-0">{a.timeAgo}</p>
          </div>
        ))}
      </div>

      <button className="text-[14px] text-primary font-medium mt-3">View all activity →</button>
    </div>
  );
}
