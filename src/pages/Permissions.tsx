import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ChevronLeft, Shield, Smartphone, Mail, Briefcase, MessageSquare, X, Check, Loader2 } from "lucide-react";

interface DataSource {
  id: string;
  name: string;
  icon: typeof Mail;
  iconColor: string;
  iconBg: string;
  brandColor: string;
  defaultOn: boolean;
  reads: string[];
  never: string[];
  why: string;
  lastSynced?: string;
}

const sources: DataSource[] = [
  {
    id: "phone",
    name: "Phone Contacts",
    icon: Smartphone,
    iconColor: "text-primary",
    iconBg: "#E8F5EE",
    brandColor: "#1A6B4A",
    defaultOn: true,
    reads: ["Contact names and numbers"],
    never: ["Call logs", "SMS content"],
    why: "your phone contacts are the foundation of your network map. We read names and numbers only.",
    lastSynced: "2 hours ago",
  },
  {
    id: "gmail",
    name: "Gmail",
    icon: Mail,
    iconColor: "text-[#EA4335]",
    iconBg: "#FEF2F2",
    brandColor: "#EA4335",
    defaultOn: false,
    reads: ["Email thread metadata (who, when)", "Recent contact frequency"],
    never: ["Message content", "Subject lines", "Attachments"],
    why: "to detect who you've emailed recently so we know which relationships are warm and which are cooling.",
    lastSynced: "1 hour ago",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Briefcase,
    iconColor: "text-[#0A66C2]",
    iconBg: "#EFF6FF",
    brandColor: "#0A66C2",
    defaultOn: false,
    reads: ["Connections list", "Public profile updates"],
    never: ["Messages", "Private posts"],
    why: "to track your connections list and notice when contacts change roles — a natural moment to reach out.",
    lastSynced: "Yesterday",
  },
  {
    id: "messaging",
    name: "iMessage / WhatsApp",
    icon: MessageSquare,
    iconColor: "text-[#34C759]",
    iconBg: "#E8F5EE",
    brandColor: "#1A6B4A",
    defaultOn: false,
    reads: ["Whether a conversation exists", "Last interaction date"],
    never: ["Message content"],
    why: "to detect that a conversation thread exists and when it last happened — never what was said.",
    lastSynced: undefined,
  },
];

const neverAccessed = [
  "Message content — Pulse never reads what you wrote or received in any message, on any platform.",
  "Private posts or stories — only public profile activity is ever accessed.",
  "Passwords or login credentials — we use secure OAuth connections only.",
  "Your data is never sold — not to advertisers, not to anyone. Ever.",
];

const auditLog = [
  { label: "Gmail read", time: "Today at 9:42am" },
  { label: "LinkedIn sync", time: "Yesterday at 11:30pm" },
  { label: "Phone contacts sync", time: "Yesterday at 8:15am" },
  { label: "Gmail read", time: "Jan 11 at 2:20pm" },
];

// Sheet content per platform
const sheetContent: Record<
  string,
  {
    iconBg: string;
    brandColor: string;
    title: string;
    sub: string;
    reads: string[];
    never: string[];
    reassurance: string;
    primaryLabel: string;
    successToast: string;
    disconnectToast: string;
  }
> = {
  gmail: {
    iconBg: "#FEF2F2",
    brandColor: "#EA4335",
    title: "Connect Gmail",
    sub: "Pulse will read the following from your Gmail account:",
    reads: ["Who you have emailed and when", "How frequently you contact each person", "Whether a thread exists with a contact"],
    never: ["Message subject lines", "Message body or content", "Attachments or files", "Drafts or sent content"],
    reassurance: "🔒 Pulse uses read-only OAuth access. We cannot send emails, delete anything, or modify your account in any way.",
    primaryLabel: "Connect Gmail →",
    successToast: "Gmail connected! Pulse is now tracking email interactions.",
    disconnectToast: "Gmail disconnected.",
  },
  linkedin: {
    iconBg: "#EFF6FF",
    brandColor: "#0A66C2",
    title: "Connect LinkedIn",
    sub: "Pulse will read the following from your LinkedIn:",
    reads: ["Your connections list", "Public profile updates from connections", "Job change and promotion announcements"],
    never: ["Private messages or InMail", "Who viewed your profile", "Your job applications or saved jobs"],
    reassurance: "🔒 Read-only access via LinkedIn OAuth. Pulse cannot post, message, or modify anything on your behalf.",
    primaryLabel: "Connect LinkedIn →",
    successToast: "LinkedIn connected! Pulse will now surface job change milestones from your network.",
    disconnectToast: "LinkedIn disconnected.",
  },
  phone: {
    iconBg: "#E8F5EE",
    brandColor: "#1A6B4A",
    title: "Connect Phone Contacts",
    sub: "Pulse will read the following from your device contacts:",
    reads: ["Contact names", "Phone numbers", "Email addresses stored in contacts"],
    never: ["Call history or logs", "SMS or text message content", "Voicemails"],
    reassurance: "🔒 Contact data is stored locally on your device and encrypted. It is never shared with third parties.",
    primaryLabel: "Allow Access →",
    successToast: "Phone contacts connected! Your network foundation is ready.",
    disconnectToast: "Phone Contacts disconnected.",
  },
  messaging: {
    iconBg: "#E8F5EE",
    brandColor: "#1A6B4A",
    title: "Connect Messaging",
    sub: "Choose which messaging platform to connect:",
    reads: ["Whether a conversation thread exists", "Date of last message exchange"],
    never: ["Message content — ever", "Who initiated the conversation", "Group chat memberships"],
    reassurance: "🔒 Pulse uses metadata only. The content of every message you have ever sent or received is completely private.",
    primaryLabel: "Connect Messaging →",
    successToast: "Messaging connected! Pulse will track interaction recency without reading any message content.",
    disconnectToast: "Messaging disconnected.",
  },
};

const PERM_KEYS = ["pulse_perm_gmail", "pulse_perm_linkedin", "pulse_perm_phone", "pulse_perm_messaging"];

export default function PermissionsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromOnboarding = (location.state as { fromOnboarding?: boolean } | null)?.fromOnboarding === true;

  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sources.forEach((s) => {
      try {
        const stored = localStorage.getItem(`pulse_perm_${s.id}`);
        initial[s.id] = stored === null ? s.defaultOn : stored === "true";
      } catch {
        initial[s.id] = s.defaultOn;
      }
    });
    return initial;
  });
  const [connectTarget, setConnectTarget] = useState<string | null>(null);
  const [disconnectTarget, setDisconnectTarget] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [messagingChoice, setMessagingChoice] = useState<"imessage" | "whatsapp">("imessage");
  // tick used to recompute connected count after sheet actions
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // sync toggles -> tick whenever changes happen
    setTick((t) => t + 1);
  }, [toggles]);

  const setToggleValue = (id: string, value: boolean) => {
    setToggles((t) => {
      const next = { ...t, [id]: value };
      try { localStorage.setItem(`pulse_perm_${id}`, value ? "true" : "false"); } catch {}
      return next;
    });
  };

  const handleToggleClick = (id: string) => {
    if (toggles[id]) {
      // turning OFF -> open disconnect confirm
      setDisconnectTarget(id);
    } else {
      // turning ON -> open connect sheet
      setConnectTarget(id);
      setConnecting(false);
    }
  };

  const handleConnect = () => {
    if (!connectTarget) return;
    const id = connectTarget;
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnectTarget(null);
      setToggleValue(id, true);
      toast.success(sheetContent[id].successToast, {
        style: { borderLeft: "4px solid #1A6B4A", borderRadius: 10 },
      });
    }, 1200);
  };

  const handleDisconnect = () => {
    if (!disconnectTarget) return;
    const id = disconnectTarget;
    setToggleValue(id, false);
    toast(sheetContent[id].disconnectToast);
    setDisconnectTarget(null);
  };

  const connectedCount = (() => {
    void tick;
    let n = 0;
    PERM_KEYS.forEach((k) => {
      try { if (localStorage.getItem(k) === "true") n++; } catch {}
    });
    return n;
  })();

  const handleFinishOnboarding = () => {
    try {
      localStorage.setItem("pulse_authed", "true");
      localStorage.setItem("pulse_onboarded", "true");
    } catch {}
    navigate("/dashboard", { replace: true });
  };

  const activeSheet = connectTarget ? sheetContent[connectTarget] : null;
  const ActiveIcon = connectTarget ? sources.find((s) => s.id === connectTarget)?.icon : null;

  return (
    <div className="page-enter min-h-screen bg-background" style={{ overflowY: "auto", paddingBottom: 120 }}>
      {/* Top bar */}
      <div className="h-14 flex items-center px-4 border-b border-border bg-card">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
          <ChevronLeft size={22} />
        </button>
        <h4 className="ml-2">Privacy & Permissions</h4>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-5 space-y-4">
        {/* Intro banner */}
        <div className="bg-primary-light rounded-lg p-4 flex gap-3">
          <Shield size={20} className="text-primary shrink-0 mt-0.5" />
          <p className="text-[13px] text-primary leading-relaxed">
            Pulse is transparent about every data source it uses. Toggle off anything, anytime — the app adapts.
          </p>
        </div>

        {/* What Pulse never accesses */}
        <div className="bg-card rounded-lg border border-border shadow-card p-5">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A18", marginBottom: 16 }}>
            What Pulse never accesses
          </h3>
          <div>
            {neverAccessed.map((line, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: i < neverAccessed.length - 1 ? "1px solid #F0EFE8" : "none",
                }}
              >
                <X size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: 3 }} />
                <p style={{ fontSize: 13, color: "#4A4A44", lineHeight: 1.6, margin: 0 }}>{line}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Data source cards */}
        {sources.map((src) => {
          const isOn = toggles[src.id];
          return (
            <div key={src.id} className="bg-card rounded-lg border border-border shadow-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <src.icon size={24} className={src.iconColor} />
                  <h4>{src.name}</h4>
                </div>
                <div className="flex items-center gap-2">
                  {!isOn && (
                    <span className="text-[11px] font-medium text-muted-foreground bg-secondary rounded-sm px-2 py-0.5">Not connected</span>
                  )}
                  <button
                    onClick={() => handleToggleClick(src.id)}
                    className={cn("w-11 h-6 rounded-full transition-colors duration-200 relative", isOn ? "bg-primary" : "bg-muted-foreground/30")}
                    aria-label={`Toggle ${src.name}`}
                  >
                    <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200", isOn ? "translate-x-6" : "translate-x-1")} />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-[12px] font-medium text-muted-foreground mb-1">What Pulse reads:</p>
                <ul className="space-y-0.5">
                  {src.reads.map((r) => (
                    <li key={r} className="text-[13px] text-muted-foreground">• {r}</li>
                  ))}
                </ul>
                <p className="text-[12px] font-medium text-muted-foreground mt-2 mb-1">Never:</p>
                <ul className="space-y-0.5">
                  {src.never.map((n) => (
                    <li key={n} className="text-[13px] text-muted-foreground">• {n}</li>
                  ))}
                </ul>
                <p style={{ fontSize: 12, fontStyle: "italic", color: "#6B6B65", marginTop: 8 }}>
                  Why we need this: {src.why}
                </p>
              </div>

              <div className="flex items-center justify-between">
                {isOn ? (
                  <p style={{ fontSize: 12, color: "#16A34A", margin: 0, fontWeight: 500 }}>
                    ● Connected · Last synced just now
                  </p>
                ) : src.lastSynced ? (
                  <p className="text-caption text-muted-foreground">Last synced: {src.lastSynced}</p>
                ) : (
                  <span />
                )}
                {isOn && (
                  <button
                    onClick={() => setDisconnectTarget(src.id)}
                    style={{ fontSize: 12, color: "#DC2626", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Trust badge bar */}
        <div
          style={{
            background: "#F0F7F3",
            borderRadius: 10,
            padding: "14px 20px",
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 12, color: "#1A6B4A", fontWeight: 500 }}>🔒 256-bit encryption</span>
          <span style={{ fontSize: 12, color: "#1A6B4A", fontWeight: 500 }}>✓ Never sells your data</span>
          <span style={{ fontSize: 12, color: "#1A6B4A", fontWeight: 500 }}>⚙ Revoke access anytime</span>
        </div>

        {/* Audit log */}
        <div className="pt-2">
          <h4 className="mb-3">Access log</h4>
          <div className="bg-card rounded-lg border border-border overflow-hidden divide-y divide-border">
            {auditLog.map((entry, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between">
                <p className="text-[13px] text-foreground">{entry.label}</p>
                <p className="text-caption text-muted-foreground">{entry.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#FFFFFF",
          borderTop: "1px solid rgba(26,26,24,0.08)",
          padding: "16px 24px",
          paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
          boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
          zIndex: 40,
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {/* Connection summary */}
          {connectedCount === 0 ? (
            <p style={{ fontSize: 13, color: "#A8A89E", textAlign: "center", marginBottom: 12 }}>
              {fromOnboarding
                ? "No sources connected yet — you can always add them later"
                : "0 of 4 sources connected"}
            </p>
          ) : (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 13, color: "#1A6B4A", fontWeight: 500, textAlign: "center", margin: 0 }}>
                {connectedCount} of 4 sources connected
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 6 }}>
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: i < connectedCount ? "#1A6B4A" : "#E0EDE6",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {fromOnboarding ? (
            <>
              <button
                onClick={handleFinishOnboarding}
                style={{
                  width: "100%",
                  height: 52,
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: connectedCount === 0 ? 500 : 600,
                  fontSize: 15,
                  background: connectedCount === 0 ? "#F2F1EC" : "#1A6B4A",
                  color: connectedCount === 0 ? "#6B6B65" : "#FFFFFF",
                }}
              >
                {connectedCount === 0 ? "Skip for now →" : "Looks good — take me to my dashboard →"}
              </button>
              <button
                onClick={handleFinishOnboarding}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  background: "none",
                  border: "none",
                  fontSize: 13,
                  color: "#A8A89E",
                  marginTop: 10,
                  cursor: "pointer",
                }}
              >
                I'll connect sources later from Settings
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate(-1)}
                style={{
                  width: "100%",
                  height: 52,
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 15,
                  background: "#1A6B4A",
                  color: "#FFFFFF",
                }}
              >
                Save & return to settings
              </button>
              <p style={{ fontSize: 12, color: "#A8A89E", textAlign: "center", marginTop: 8 }}>
                Changes are saved automatically
              </p>
            </>
          )}
        </div>
      </div>

      {/* Connect bottom sheet */}
      {connectTarget && activeSheet && ActiveIcon && (
        <div className="fixed inset-0 z-50">
          <div
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }}
            onClick={() => !connecting && setConnectTarget(null)}
          />
          <div
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              background: "#FFFFFF",
              borderRadius: "20px 20px 0 0",
              padding: "28px 24px 40px",
              maxHeight: "70vh",
              overflowY: "auto",
              animation: "sheetSlideUp 300ms cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <style>{`@keyframes sheetSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>

            {/* Icon */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: activeSheet.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
              }}
            >
              {connectTarget === "messaging" ? (
                <div style={{ display: "flex", width: 28, height: 28, borderRadius: "50%", overflow: "hidden" }}>
                  <div style={{ flex: 1, background: "#34C759" }} />
                  <div style={{ flex: 1, background: "#25D366" }} />
                </div>
              ) : (
                <ActiveIcon size={24} color={activeSheet.brandColor} />
              )}
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A18", textAlign: "center", margin: "0 0 8px" }}>
              {activeSheet.title}
            </h2>
            <p style={{ fontSize: 14, color: "#6B6B65", textAlign: "center", marginBottom: 20 }}>
              {activeSheet.sub}
            </p>

            {/* Messaging platform selector */}
            {connectTarget === "messaging" && (
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                {([
                  { id: "imessage" as const, label: "iMessage", sub: "iOS only", color: "#34C759" },
                  { id: "whatsapp" as const, label: "WhatsApp", sub: "All devices", color: "#25D366" },
                ]).map((card) => {
                  const selected = messagingChoice === card.id;
                  return (
                    <button
                      key={card.id}
                      onClick={() => setMessagingChoice(card.id)}
                      style={{
                        flex: 1,
                        background: selected ? "#E8F5EE" : "#FFFFFF",
                        border: `1.5px solid ${selected ? "#1A6B4A" : "#E0E0D8"}`,
                        borderRadius: 12,
                        padding: 14,
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      <MessageSquare size={20} color={card.color} style={{ margin: "0 auto 6px" }} />
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A18" }}>{card.label}</div>
                      <div style={{ fontSize: 11, color: "#A8A89E" }}>{card.sub}</div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Reads */}
            <div style={{ marginBottom: 12 }}>
              {activeSheet.reads.map((r) => (
                <div key={r} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0" }}>
                  <Check size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: "#1A1A18" }}>{r}</span>
                </div>
              ))}
            </div>

            {/* Never */}
            <div style={{ marginBottom: 4 }}>
              {activeSheet.never.map((n) => (
                <div key={n} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0" }}>
                  <X size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: "#4A4A44" }}>{n}</span>
                </div>
              ))}
            </div>

            {/* Reassurance box */}
            <div
              style={{
                background: "#E8F5EE",
                borderRadius: 10,
                padding: "12px 16px",
                margin: "16px 0",
                fontSize: 13,
                color: "#1A6B4A",
                lineHeight: 1.55,
              }}
            >
              {activeSheet.reassurance}
            </div>

            {/* Buttons */}
            <button
              onClick={handleConnect}
              disabled={connecting}
              style={{
                width: "100%",
                height: 52,
                borderRadius: 12,
                border: "none",
                background: activeSheet.brandColor,
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: 15,
                cursor: connecting ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {connecting ? <Loader2 size={20} className="animate-spin" /> : activeSheet.primaryLabel}
            </button>
            <button
              onClick={() => !connecting && setConnectTarget(null)}
              style={{
                background: "transparent",
                color: "#6B6B65",
                border: "none",
                fontSize: 14,
                textAlign: "center",
                width: "100%",
                marginTop: 8,
                cursor: "pointer",
                padding: "10px 0",
              }}
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {/* Disconnect confirmation bottom sheet */}
      {disconnectTarget && (
        <div className="fixed inset-0 z-50">
          <div
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }}
            onClick={() => setDisconnectTarget(null)}
          />
          <div
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              background: "#FFFFFF",
              borderRadius: "20px 20px 0 0",
              padding: "28px 24px 40px",
              animation: "sheetSlideUp 300ms cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A18", margin: "0 0 8px" }}>
              Disconnect {sources.find((s) => s.id === disconnectTarget)?.name}?
            </h3>
            <p style={{ fontSize: 14, color: "#6B6B65", lineHeight: 1.55, marginBottom: 20 }}>
              Pulse will stop tracking interactions from this source. Your existing relationship data will be preserved.
            </p>
            <button
              onClick={handleDisconnect}
              style={{
                width: "100%",
                height: 52,
                borderRadius: 12,
                border: "none",
                background: "#DC2626",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Disconnect
            </button>
            <button
              onClick={() => setDisconnectTarget(null)}
              style={{
                background: "transparent",
                color: "#6B6B65",
                border: "none",
                fontSize: 14,
                textAlign: "center",
                width: "100%",
                marginTop: 8,
                cursor: "pointer",
                padding: "10px 0",
              }}
            >
              Keep connected
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
