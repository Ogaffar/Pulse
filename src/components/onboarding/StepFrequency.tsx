import { cn } from "@/lib/utils";
import { Check, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const frequencies = [
  { id: "weekly", label: "Once a week", desc: "2–3 contacts per nudge. Gentle and easy to keep up with.", recommended: true },
  { id: "biweekly", label: "Twice a week", desc: "2–3 contacts per nudge. Good for active job seekers.", recommended: false },
  { id: "daily", label: "Daily", desc: "2–3 contacts per nudge. For the deeply relationship-focused.", recommended: false },
];

const times = [
  { id: "morning", label: "Morning (8–10am)" },
  { id: "afternoon", label: "Afternoon (12–2pm)" },
  { id: "evening", label: "Evening (6–8pm)" },
];

interface StepFrequencyProps {
  selectedFreq: string;
  onSelectFreq: (id: string) => void;
  selectedTime: string;
  onSelectTime: (id: string) => void;
}

export function StepFrequency({ selectedFreq, onSelectFreq, selectedTime, onSelectTime }: StepFrequencyProps) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const shortTz = new Date().toLocaleTimeString("en-US", { timeZoneName: "short" }).split(" ").pop();

  return (
    <div className="pt-6">
      {/* Illustration */}
      <div className="flex justify-center mb-6">
        <div className="relative w-24 h-24">
          <div className="w-24 h-24 rounded-full border-[3px] border-primary/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
              <span className="text-[28px]">🔔</span>
            </div>
          </div>
          {[0, 120, 240].map((deg) => (
            <div
              key={deg}
              className="absolute w-3 h-3 rounded-full bg-primary"
              style={{
                top: `${48 - 42 * Math.cos((deg * Math.PI) / 180)}px`,
                left: `${48 + 42 * Math.sin((deg * Math.PI) / 180)}px`,
                transform: "translate(-50%, -50%)",
                animation: `pulse 2s ease-in-out ${deg / 360}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <h2 className="text-center mb-2">How often should Pulse nudge you?</h2>
      <p className="text-center text-muted-foreground text-[15px] mb-6">
        You can change this anytime in Settings.
      </p>

      {/* Frequency cards */}
      <div className="space-y-3 mb-8">
        {frequencies.map((freq) => {
          const isSelected = selectedFreq === freq.id;
          return (
            <button
              key={freq.id}
              onClick={() => onSelectFreq(freq.id)}
              className={cn(
                "w-full flex items-center justify-between px-5 py-4 rounded-lg border-[1.5px] transition-all duration-200 text-left",
                isSelected
                  ? "border-primary bg-primary-light"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-medium">{freq.label}</span>
                  {freq.recommended && <Badge variant="cool" className="text-[10px]">Recommended</Badge>}
                </div>
                <p className="text-[13px] text-muted-foreground mt-0.5">{freq.desc}</p>
              </div>
              {isSelected && <Check size={18} className="text-primary shrink-0 ml-3" strokeWidth={2.5} />}
            </button>
          );
        })}
      </div>

      {/* Best time */}
      <div className="mb-6">
        <p className="text-[13px] font-medium text-muted-foreground mb-3">Best time for nudges</p>
        <div className="flex gap-2">
          {times.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTime(t.id)}
              className={cn(
                "flex-1 py-2.5 rounded-full text-[12px] font-medium transition-all duration-200",
                selectedTime === t.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timezone */}
      <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground mb-6">
        <MapPin size={14} />
        <span>{shortTz}</span>
        <button className="text-primary text-[12px] font-medium ml-1">Change</button>
      </div>

      {/* Reassurance card */}
      <div className="bg-primary-light rounded-lg p-4 border border-primary/10">
        <p className="text-[13px] text-primary leading-relaxed">
          💡 Pulse will never send more than 3 nudges per week. You set hard limits in Settings at any time.
        </p>
      </div>
    </div>
  );
}
