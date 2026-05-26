import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";
import { useState } from "react";

interface Permission {
  id: string;
  icon: string;
  name: string;
  desc: string;
  defaultOn: boolean;
}

const permissions: Permission[] = [
  { id: "contacts", icon: "📱", name: "Phone Contacts", desc: "Names and contact info only. Pulse never reads your messages.", defaultOn: true },
  { id: "gmail", icon: "📧", name: "Gmail", desc: "Reads who you've emailed recently to track relationship recency. Never reads message content.", defaultOn: false },
  { id: "linkedin", icon: "💼", name: "LinkedIn", desc: "Reads your connections list and public activity. No private messages.", defaultOn: false },
  { id: "messaging", icon: "💬", name: "iMessage / WhatsApp", desc: "Detects if a conversation thread exists. Never reads content.", defaultOn: false },
];

const faqs = [
  { q: "Does Pulse read my messages?", a: "No. Pulse only detects that a conversation exists and when it last happened — never the content." },
  { q: "Can I revoke access later?", a: "Yes. Go to Settings → Privacy anytime to toggle any source off or delete your data entirely." },
  { q: "Is my data shared with anyone?", a: "Never. Your relationship data is private and is never sold or shared with third parties." },
];

interface StepPrivacyProps {
  toggles: Record<string, boolean>;
  onToggle: (id: string) => void;
}

export function StepPrivacy({ toggles, onToggle }: StepPrivacyProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="pt-6">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center">
          <Shield size={32} className="text-primary" />
        </div>
      </div>

      <h2 className="text-center mb-2">Here's exactly what Pulse reads — and what it never touches.</h2>
      <p className="text-center text-muted-foreground text-[15px] mb-6">
        You control every data source. Toggle anything off, anytime.
      </p>

      <div className="bg-card rounded-lg border border-border overflow-hidden mb-6">
        {permissions.map((p, i) => (
          <div
            key={p.id}
            className={cn(
              "flex items-start gap-3 px-4 py-3.5",
              i < permissions.length - 1 && "border-b border-border"
            )}
          >
            <span className="text-[20px] mt-0.5 shrink-0">{p.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-medium text-foreground">{p.name}</p>
              <p className="text-[13px] text-muted-foreground leading-relaxed mt-0.5">{p.desc}</p>
            </div>
            <button
              onClick={() => onToggle(p.id)}
              className={cn(
                "shrink-0 mt-1 w-11 h-6 rounded-full transition-colors duration-200 relative",
                toggles[p.id] ? "bg-primary" : "bg-muted-foreground/30"
              )}
            >
              <div
                className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                  toggles[p.id] ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="mb-4">
        <p className="text-[13px] font-medium text-muted-foreground mb-3">Frequently asked questions</p>
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {faqs.map((faq, i) => (
            <div key={i} className={cn(i < faqs.length - 1 && "border-b border-border")}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-4 py-3 flex items-center justify-between"
              >
                <span className="text-[14px] font-medium text-foreground pr-4">{faq.q}</span>
                <span className={cn("text-muted-foreground transition-transform duration-200 shrink-0", openFaq === i && "rotate-180")}>
                  ▾
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-200 ease-out"
                style={{ maxHeight: openFaq === i ? 200 : 0 }}
              >
                <p className="px-4 pb-3 text-[13px] text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
