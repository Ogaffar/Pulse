import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardClickable, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton, SkeletonLine, SkeletonCircle, SkeletonCard } from "@/components/ui/skeleton";
import { WarmthIndicator } from "@/components/WarmthIndicator";
import { TopAppBar } from "@/components/TopAppBar";
import { BottomNav } from "@/components/BottomNav";
import { Label } from "@/components/ui/label";
import { Settings, Plus } from "lucide-react";
import { toast } from "sonner";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <p className="text-caption text-muted-foreground">{title}</p>
    {children}
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <TopAppBar
        title="Pulse"
        largeTitle
        rightAction={
          <Button variant="ghost" size="icon">
            <Settings size={20} />
          </Button>
        }
      />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
        <Section title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Danger</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex gap-3">
            <Button size="sm">Small</Button>
            <Button size="icon"><Plus size={18} /></Button>
          </div>
        </Section>

        <Section title="Inputs">
          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter your name" />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Write a note about this person..." />
            </div>
          </div>
        </Section>

        <Section title="Avatars">
          <div className="flex items-end gap-3">
            <Avatar size="sm" name="Alice Chen" />
            <Avatar size="md" name="Bob Smith" showOnline />
            <Avatar size="lg" name="Carol Davis" />
            <Avatar size="xl" name="David Lee" showOnline />
          </div>
        </Section>

        <Section title="Badges & Chips">
          <div className="flex flex-wrap gap-2">
            <Badge variant="warm">Warm</Badge>
            <Badge variant="cool">Cool</Badge>
            <Badge variant="cold">Cold</Badge>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="default">Default</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </Section>

        <Section title="Warmth Indicators">
          <div className="flex items-center gap-6">
            <WarmthIndicator level="active" />
            <WarmthIndicator level="cooling" />
            <WarmthIndicator level="dormant" />
          </div>
          <div className="flex items-center gap-6">
            <WarmthIndicator level="active" showLabel />
            <WarmthIndicator level="cooling" showLabel />
            <WarmthIndicator level="dormant" showLabel />
          </div>
        </Section>

        <Section title="Cards">
          <Card>
            <CardHeader>
              <CardTitle>Static Card</CardTitle>
              <CardDescription>For display purposes only.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-small text-muted-foreground">Cards use warm backgrounds and subtle borders.</p>
            </CardContent>
          </Card>

          <CardClickable onClick={() => toast("Card tapped!")}>
            <div className="flex items-center gap-3">
              <Avatar size="md" name="Sarah Johnson" showOnline />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[15px]">Sarah Johnson</p>
                <p className="text-small text-muted-foreground truncate">Last connected 3 days ago</p>
              </div>
              <WarmthIndicator level="active" />
            </div>
          </CardClickable>

          <CardClickable onClick={() => toast("Card tapped!")}>
            <div className="flex items-center gap-3">
              <Avatar size="md" name="Mike Torres" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[15px]">Mike Torres</p>
                <p className="text-small text-muted-foreground truncate">Last connected 45 days ago</p>
              </div>
              <WarmthIndicator level="cooling" />
            </div>
          </CardClickable>
        </Section>

        <Section title="Loading States">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <SkeletonCircle />
              <div className="flex-1 space-y-2">
                <SkeletonLine width="50%" />
                <SkeletonLine width="30%" className="h-3" />
              </div>
            </div>
            <SkeletonCard />
          </div>
        </Section>

        <Section title="Toasts">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => toast.success("Connection saved")}>Success</Button>
            <Button size="sm" variant="secondary" onClick={() => toast("Time to reconnect with Sarah", { description: "You haven't spoken in 30 days" })}>Info</Button>
            <Button size="sm" variant="destructive" onClick={() => toast.error("Something went wrong")}>Error</Button>
          </div>
        </Section>
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
