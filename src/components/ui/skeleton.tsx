import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-shimmer rounded-md", className)} {...props} />;
}

function SkeletonLine({ width = "100%", className, ...props }: React.HTMLAttributes<HTMLDivElement> & { width?: string }) {
  return <Skeleton className={cn("h-4", className)} style={{ width }} {...props} />;
}

function SkeletonCircle({ size = 40, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { size?: number }) {
  return <Skeleton className={cn("rounded-full", className)} style={{ width: size, height: size }} {...props} />;
}

function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-lg border border-border-strong bg-card p-5 space-y-3", className)} {...props}>
      <div className="flex items-center gap-3">
        <SkeletonCircle size={40} />
        <div className="space-y-2 flex-1">
          <SkeletonLine width="60%" />
          <SkeletonLine width="40%" className="h-3" />
        </div>
      </div>
      <SkeletonLine />
      <SkeletonLine width="80%" />
    </div>
  );
}

export { Skeleton, SkeletonLine, SkeletonCircle, SkeletonCard };
