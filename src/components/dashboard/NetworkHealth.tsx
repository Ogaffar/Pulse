import { cn } from "@/lib/utils";

interface MetricCardProps {
  count: number;
  label: string;
  color: string;
  bgClass: string;
  borderClass: string;
}

function MetricCard({ count, label, color, bgClass, borderClass }: MetricCardProps) {
  return (
    <div className={cn("flex-1 rounded-lg p-3 text-center border", bgClass, borderClass)}>
      <p className={cn("text-[22px] font-semibold", color)}>{count}</p>
      <p className={cn("text-caption", color === "text-success" ? "text-muted-foreground" : color)}>
        {label}
      </p>
    </div>
  );
}

interface NetworkHealthProps {
  active: number;
  cooling: number;
  dormant: number;
}

export function NetworkHealth({ active, cooling, dormant }: NetworkHealthProps) {
  const total = active + cooling + dormant;
  const activeP = Math.round((active / total) * 100);
  const coolingP = Math.round((cooling / total) * 100);
  const dormantP = 100 - activeP - coolingP;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4>Your network health</h4>
        <button className="text-[14px] text-primary font-medium">View all</button>
      </div>

      <div className="flex gap-2 mb-3">
        <MetricCard count={active} label="Active" color="text-success" bgClass="bg-success/10" borderClass="border-success/20" />
        <MetricCard count={cooling} label="Cooling" color="text-warning" bgClass="bg-warning/10" borderClass="border-warning/20" />
        <MetricCard count={dormant} label="Dormant" color="text-accent-coral" bgClass="bg-accent-coral/10" borderClass="border-accent-coral/20" />
      </div>

      {/* Stacked bar */}
      <div className="flex h-2 rounded-full overflow-hidden">
        <div className="bg-success rounded-l-full" style={{ width: `${activeP}%` }} />
        <div className="bg-warning" style={{ width: `${coolingP}%` }} />
        <div className="bg-accent-coral rounded-r-full" style={{ width: `${dormantP}%` }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-muted-foreground">{activeP}%</span>
        <span className="text-[10px] text-muted-foreground">{coolingP}%</span>
        <span className="text-[10px] text-muted-foreground">{dormantP}%</span>
      </div>
    </div>
  );
}
