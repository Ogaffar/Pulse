import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface Contact {
  name: string;
  role: string;
  company: string;
  daysAgo: number;
  warmth: "cooling" | "dormant";
}

const contacts: Contact[] = [
  { name: "Mike Torres", role: "Product Manager", company: "Stripe", daysAgo: 47, warmth: "cooling" },
  { name: "Adaeze Okafor", role: "Strategy Lead", company: "McKinsey", daysAgo: 52, warmth: "cooling" },
  { name: "Jason Liu", role: "Engineering Manager", company: "Google", daysAgo: 65, warmth: "dormant" },
  { name: "Rachel Kim", role: "Founder", company: "Loom", daysAgo: 78, warmth: "dormant" },
  { name: "Tomás Rivera", role: "VP Operations", company: "Figma", daysAgo: 90, warmth: "dormant" },
];

const filters = ["All", "Cooling", "Dormant"] as const;

export function AttentionList() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filtered = activeFilter === "All"
    ? contacts
    : contacts.filter((c) => c.warmth === activeFilter.toLowerCase());

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4>Needs your attention</h4>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-none">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors whitespace-nowrap",
              activeFilter === f
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Contact rows */}
      <div className="space-y-2">
        {filtered.slice(0, 5).map((c) => {
          const ringColor = c.warmth === "cooling" ? "ring-warning" : "ring-accent-coral";
          const badgeVariant = c.warmth === "cooling" ? "warm" : "cold";
          const timeColor = c.warmth === "cooling" ? "text-warning" : "text-accent-coral";

          return (
            <button
              key={c.name}
              className="w-full flex items-center gap-3 bg-card rounded-lg border border-border p-3.5 transition-all duration-200 hover:shadow-card hover:-translate-y-px text-left"
            >
              <div className={cn("rounded-full ring-2 p-0.5", ringColor)}>
                <Avatar size="md" name={c.name} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium">{c.name}</p>
                <p className="text-[13px] text-muted-foreground truncate">{c.role} · {c.company}</p>
                <p className={cn("text-caption mt-0.5", timeColor)}>{c.daysAgo} days ago</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={badgeVariant} className="text-[10px] capitalize">{c.warmth}</Badge>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </button>
          );
        })}
      </div>

      <button className="w-full text-center text-[14px] text-primary font-medium mt-3 py-2">
        See all 13 contacts →
      </button>
    </div>
  );
}
