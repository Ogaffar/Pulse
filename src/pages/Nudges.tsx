import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Users, Bell, User, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import appContacts, { getSuppressedIds, warmthMeta, type AppContact } from "@/data/appContacts";
import { toast } from "sonner";

const tabs = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Contacts", icon: Users, path: "/contacts" },
  { label: "Nudges", icon: Bell, path: "/nudges" },
  { label: "Profile", icon: User, path: "/profile" },
];

const PENDING_IDS = ["sarah-chen", "marcus-t"];
const COMPLETED_IDS = ["james-kim", "lisa-park"];
const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

function loadSnoozed(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem("pulse_snoozed") || "{}"); } catch { return {}; }
}
function loadDismissed(): string[] {
  try { return JSON.parse(localStorage.getItem("pulse_dismissed") || "[]"); } catch { return []; }
}

export default function Nudges() {
  const navigate = useNavigate();
  const [snoozed, setSnoozed] = useState<Record<string, number>>(() => loadSnoozed());
  const [dismissed, setDismissed] = useState<string[]>(() => loadDismissed());
  const [animatingOut, setAnimatingOut] = useState<Record<string, boolean>>({});

  const freq = (typeof window !== "undefined" && localStorage.getItem("pulse_frequency")) || "twice";
  const limit = freq === "once" ? 1 : freq === "daily" ? 7 : 2;
  const used = 1;

  const suppressed = getSuppressedIds();
  const now = Date.now();

  const pending = useMemo<AppContact[]>(() => {
    return PENDING_IDS
      .map((id) => appContacts.find((c) => c.id === id)!)
      .filter((c) => c && !suppressed.includes(c.id))
      .filter((c) => !dismissed.includes(c.id))
      .filter((c) => !(snoozed[c.id] && snoozed[c.id] > now));
  }, [snoozed, dismissed, suppressed, now]);

  const completed = useMemo<AppContact[]>(() => {
    return COMPLETED_IDS.map((id) => appContacts.find((c) => c.id === id)!).filter(Boolean);
  }, []);

  const animateOut = (id: string, after: () => void) => {
    setAnimatingOut((s) => ({ ...s, [id]: true }));
    setTimeout(after, 300);
  };

  const handleSnooze = (c: AppContact) => {
    animateOut(c.id, () => {
      const next = { ...snoozed, [c.id]: Date.now() + THREE_DAYS };
      setSnoozed(next);
      try { localStorage.setItem("pulse_snoozed", JSON.stringify(next)); } catch {}
      toast.success(`Snoozed! ${c.name} will resurface in 3 days.`);
    });
  };

  const handleDismiss = (c: AppContact) => {
    animateOut(c.id, () => {
      const next = [...dismissed, c.id];
      setDismissed(next);
      try { localStorage.setItem("pulse_dismissed", JSON.stringify(next)); } catch {}
      toast(`Dismissed. ${c.name} won't appear in nudges this week.`);
    });
  };

  return (
    <div className="page-enter min-h-screen bg-[hsl(60,13%,97%)] pb-20" style={{ position: "relative", zIndex: 1 }}>
      <div className="px-4 pt-5 pb-2">
        <h1 className="text-[28px] font-bold text-foreground" style={{ marginBottom: 4 }}>My Nudges</h1>
        <p style={{ fontSize: 13, color: "#6B6B65" }}>
          {pending.length} {pending.length === 1 ? "nudge" : "nudges"} this week · {Math.max(0, limit - used)} remaining
        </p>
      </div>

      <div className="px-4 mb-4">
        <div className="flex items-center justify-between" style={{ fontSize: 12, color: "#6B6B65", marginBottom: 6 }}>
          <span>Weekly nudge limit</span>
          <span>{used} of {limit} used</span>
        </div>
        <div style={{ height: 6, borderRadius: 99, background: "#E0EDE6", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(100, (used / limit) * 100)}%`, background: "#1A6B4A", transition: "width 300ms ease" }} />
        </div>
      </div>

      <div className="px-4 space-y-3">
        {pending.length === 0 ? (
          <div className="text-center" style={{ padding: "60px 24px" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#E8F5EE", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={28} color="#1A6B4A" strokeWidth={2.5} />
            </div>
            <h2 className="text-[22px] font-bold text-foreground mb-2">You're all caught up!</h2>
            <p style={{ fontSize: 13, color: "#6B6B65", marginBottom: 20 }}>Your next nudges arrive on Thursday.</p>
            <button
              onClick={() => navigate("/contacts")}
              style={{ background: "transparent", border: "1.5px solid #1A6B4A", color: "#1A6B4A", borderRadius: 10, padding: "10px 18px", fontWeight: 500, cursor: "pointer" }}
            >
              View your contacts →
            </button>
          </div>
        ) : (
          pending.map((c) => {
            const meta = warmthMeta(c.warmth);
            const isOut = animatingOut[c.id];
            return (
              <div
                key={c.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1.5px solid #E0EDE6",
                  padding: 18,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  opacity: isOut ? 0 : 1,
                  maxHeight: isOut ? 0 : 1000,
                  overflow: "hidden",
                  transition: "opacity 300ms ease, max-height 300ms ease, padding 300ms ease",
                  paddingTop: isOut ? 0 : 18,
                  paddingBottom: isOut ? 0 : 18,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-semibold shrink-0" style={{ background: c.avatarBg, color: c.avatarColor }}>
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[16px] font-semibold text-foreground">{c.name}</h3>
                    <p className="text-[13px]" style={{ color: "#6B6B65" }}>{c.role} · {c.company}</p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: meta.dot }} />
                </div>

                <div style={{ background: "#E8F5EE", borderRadius: 10, padding: "10px 12px", margin: "10px 0", display: "flex", gap: 8 }}>
                  <Sparkles size={16} color="#1A6B4A" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: 13, color: "#1A6B4A", lineHeight: 1.5 }}>{c.nudgeReason}</p>
                </div>

                <button
                  onClick={() => navigate("/draft", { state: { contactId: c.id } })}
                  className="w-full h-11 rounded-lg text-white text-[14px] font-semibold"
                  style={{ background: "#1A6B4A" }}
                >
                  Draft message →
                </button>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSnooze(c)}
                    className="flex-1 h-10 rounded-lg text-[13px] font-medium"
                    style={{ background: "transparent", border: "1px solid #E0EDE6", color: "#1A6B4A" }}
                  >
                    Snooze 3 days
                  </button>
                  <button
                    onClick={() => handleDismiss(c)}
                    className="flex-1 h-10 rounded-lg text-[13px] font-medium"
                    style={{ background: "transparent", border: "1px solid #E0EDE6", color: "#6B6B65" }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })
        )}

        {completed.length > 0 && (
          <>
            <p className="text-caption" style={{ color: "#6B6B65", padding: "16px 0 8px" }}>Completed this week</p>
            <div className="space-y-2">
              {completed.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3"
                  style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0EFE8", padding: "12px 14px", opacity: 0.7 }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-semibold shrink-0" style={{ background: c.avatarBg, color: c.avatarColor }}>
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-foreground">{c.name}</p>
                    <p style={{ fontSize: 12, color: "#16A34A" }}>Message sent 5 days ago</p>
                  </div>
                  <Check size={18} color="#16A34A" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-[hsl(100,18%,91%)] flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = tab.path === "/nudges";
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
            >
              <tab.icon size={22} strokeWidth={isActive ? 2.2 : 1.6} className={isActive ? "text-[hsl(152,62%,26%)]" : "text-[hsl(50,8%,64%)]"} />
              <span className={cn("text-[10px] font-medium", isActive ? "text-[hsl(152,62%,26%)]" : "text-[hsl(50,8%,64%)]")}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
