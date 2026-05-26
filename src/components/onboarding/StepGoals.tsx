import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";

const goals = [
  { id: "role", emoji: "🎯", label: "Land a new role or internship" },
  { id: "maintain", emoji: "🤝", label: "Maintain my professional network" },
  { id: "industry", emoji: "📈", label: "Build relationships in a new industry" },
  { id: "mentors", emoji: "🧠", label: "Stay connected with mentors & advisors" },
  { id: "international", emoji: "🌍", label: "Nurture my international network" },
  { id: "other", emoji: "✏️", label: "Something else (I'll tell you)" },
];

interface StepGoalsProps {
  selected: string[];
  onSelect: (goals: string[]) => void;
  otherText: string;
  onOtherText: (text: string) => void;
}

export function StepGoals({ selected, onSelect, otherText, onOtherText }: StepGoalsProps) {
  const toggle = (id: string) => {
    onSelect(
      selected.includes(id)
        ? selected.filter((g) => g !== id)
        : [...selected, id]
    );
  };

  return (
    <div className="pt-6">
      {/* Illustration */}
      <div className="flex justify-center mb-8">
        <div className="relative w-48 h-32">
          {[
            { x: 24, y: 16, size: 12, delay: 0 },
            { x: 72, y: 8, size: 16, delay: 0.3 },
            { x: 120, y: 24, size: 10, delay: 0.6 },
            { x: 48, y: 56, size: 14, delay: 0.2 },
            { x: 96, y: 48, size: 18, delay: 0.5 },
            { x: 144, y: 60, size: 12, delay: 0.1 },
            { x: 36, y: 88, size: 10, delay: 0.4 },
            { x: 108, y: 80, size: 14, delay: 0.7 },
          ].map((node, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary"
              style={{
                left: node.x,
                top: node.y,
                width: node.size,
                height: node.size,
                animation: `pulse 2s ease-in-out ${node.delay}s infinite`,
                opacity: 0.6 + Math.random() * 0.4,
              }}
            />
          ))}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 192 128">
            {[
              [30, 22, 80, 16],
              [80, 16, 55, 63],
              [55, 63, 103, 57],
              [103, 57, 128, 30],
              [103, 57, 115, 87],
              [42, 93, 55, 63],
            ].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1A6B4A" strokeWidth="1" opacity="0.2" />
            ))}
          </svg>
        </div>
      </div>

      <h2 className="text-center mb-2">What brings you to Pulse?</h2>
      <p className="text-center text-muted-foreground text-[15px] mb-6">
        Your goals shape which relationships Pulse prioritizes for you.
      </p>

      <div className="space-y-3">
        {goals.map((goal) => {
          const isSelected = selected.includes(goal.id);
          return (
            <div key={goal.id}>
              <button
                onClick={() => toggle(goal.id)}
                className={cn(
                  "w-full flex items-center justify-between px-5 py-4 rounded-lg border-[1.5px] transition-all duration-200 text-left",
                  isSelected
                    ? "border-primary bg-primary-light"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <span className="text-[15px] font-medium">
                  {goal.emoji} {goal.label}
                </span>
                {isSelected && (
                  <Check size={18} className="text-primary shrink-0 ml-2" strokeWidth={2.5} />
                )}
              </button>
              {goal.id === "other" && isSelected && (
                <div
                  className="overflow-hidden transition-all duration-300 ease-out"
                  style={{ maxHeight: isSelected ? 80 : 0, marginTop: isSelected ? 8 : 0 }}
                >
                  <Input
                    placeholder="Tell us what you're working toward..."
                    value={otherText}
                    onChange={(e) => onOtherText(e.target.value)}
                    autoFocus
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
