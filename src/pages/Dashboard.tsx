import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Bell, User, Activity, Plus, Target, BarChart3, Sparkles, Mail, Briefcase, UploadCloud, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadContacts, type ImportedContact } from "@/lib/contactsStore";
import appContacts, { getSuppressedIds, warmthMeta } from "@/data/appContacts";

const baseMetrics = [
  { value: 24, label: "Active", bg: "bg-[hsl(138,76%,97%)]", color: "text-[hsl(142,76%,36%)]" },
  { value: 8, label: "Cooling", bg: "bg-[hsl(48,96%,89%)]", color: "text-[hsl(32,95%,44%)]" },
  { value: 3, label: "Dormant", bg: "bg-[hsl(0,86%,97%)]", color: "text-[hsl(0,72%,51%)]" },
];

const tabs = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Contacts", icon: Users, path: "/contacts" },
  { label: "Nudges", icon: Bell, path: "/nudges" },
  { label: "Profile", icon: User, path: "/profile" },
];

function hasRealConnection() {
  try {
    const storedRaw = localStorage.getItem("pulse_contacts");
    const stored = storedRaw ? JSON.parse(storedRaw) : [];
    const hasImports = Array.isArray(stored) && stored.length > 0;
    const gmail = localStorage.getItem("pulse_perm_gmail") === "true";
    const linkedin = localStorage.getItem("pulse_perm_linkedin") === "true";
    return hasImports || gmail || linkedin;
  } catch { return false; }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const justSignedUp = (location.state as { justSignedUp?: boolean } | null)?.justSignedUp;

  const [imported, setImported] = useState<ImportedContact[]>([]);
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    return Boolean(justSignedUp) || localStorage.getItem("pulse_modal_seen") !== "true";
  });
  const [welcomeStep, setWelcomeStep] = useState<1 | 2 | 3>(1);
  const [showBanner, setShowBanner] = useState<boolean>(() => {
    return localStorage.getItem("pulse_demo_banner_hidden") !== "true" && !hasRealConnection();
  });

  const name = localStorage.getItem("pulse_name") || "Alex";
  const goals: string[] = (() => {
    try { return JSON.parse(localStorage.getItem("pulse_goals") || "[]"); } catch { return []; }
  })();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    setImported(loadContacts());
    const onFocus = () => {
      setImported(loadContacts());
      if (hasRealConnection()) {
        localStorage.setItem("pulse_demo_banner_hidden", "true");
        setShowBanner(false);
      }
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const visibleAttention = useMemo(() => {
    const suppressed = getSuppressedIds();
    return appContacts
      .filter((c) => !suppressed.includes(c.id) && c.id !== "sarah-chen")
      .slice(0, 3);
  }, []);

  const featured = useMemo(() => {
    const suppressed = getSuppressedIds();
    return appContacts.find((c) => c.id === "sarah-chen" && !suppressed.includes(c.id)) || appContacts[0];
  }, []);

  const metrics = [
    { ...baseMetrics[0], value: baseMetrics[0].value + imported.length },
    baseMetrics[1],
    baseMetrics[2],
  ];

  const dismissWelcome = () => {
    localStorage.setItem("pulse_modal_seen", "true");
    localStorage.setItem("pulse_onboarded", "true");
    setShowWelcome(false);
  };

  return (
    <div className="page-enter min-h-screen bg-[hsl(60,13%,97%)]" style={{ position: "relative", zIndex: 1 }}>
      {showBanner && (
        <div
          className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between gap-3"
          style={{ background: "#1A6B4A", padding: "10px 20px" }}
        >
          <span className="flex items-center gap-1.5" style={{ fontSize: 12, color: "white", fontWeight: 500 }}>
            <Zap size={14} fill="white" /> Demo mode — connect real accounts to see your actual network
          </span>
          <button
            onClick={() => navigate("/settings/privacy/permissions", { state: { fromOnboarding: false } })}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              borderRadius: 99,
              padding: "4px 12px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.3)",
              whiteSpace: "nowrap",
            }}
          >
            Connect now →
          </button>
        </div>
      )}

      <header
        className="fixed left-0 right-0 z-50 h-14 bg-white border-b border-[hsl(100,18%,91%)] flex items-center justify-between px-4"
        style={{ top: showBanner ? 41 : 0 }}
      >
        <div className="flex items-center gap-1.5">
          <Activity size={20} className="text-[hsl(152,62%,26%)]" strokeWidth={2.5} />
          <span className="text-[18px] font-bold text-[hsl(152,62%,26%)]">Pulse</span>
        </div>
        <span className="text-[15px] text-foreground">{greeting}, {name} 👋</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { localStorage.clear(); navigate("/"); }}
            style={{ fontSize: 12, color: "#A8A89E", textDecoration: "underline", cursor: "pointer", background: "none", border: "none" }}
          >
            Reset demo
          </button>
          <button className="relative w-10 h-10 rounded-full flex items-center justify-center">
            <Bell size={20} className="text-[hsl(55,3%,53%)]" />
            <span className="absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded-full bg-[hsl(0,72%,51%)] text-white text-[10px] font-bold flex items-center justify-center">1</span>
          </button>
          <div className="w-9 h-9 rounded-full bg-[hsl(149,80%,90%)] flex items-center justify-center text-[13px] font-semibold text-[hsl(152,68%,20%)]">
            {(name[0] || "A").toUpperCase()}J
          </div>
        </div>
      </header>

      <main className={cn("pb-20 px-4", showBanner ? "pt-[113px]" : "pt-[72px]")}>
        <div className="flex gap-2.5">
          {metrics.map((m) => (
            <div key={m.label} className={cn("flex-1 rounded-xl p-3 text-center", m.bg)}>
              <p className={cn("text-[28px] font-bold", m.color)}>{m.value}</p>
              <p className="text-[12px] text-[hsl(55,3%,40%)]">{m.label}</p>
            </div>
          ))}
        </div>

        {goals.length > 0 && (
          <div
            style={{
              background: "#E8F5EE",
              borderRadius: 12,
              padding: "12px 16px",
              margin: "12px 0",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Target size={16} color="#1A6B4A" />
            <span style={{ fontSize: 13, color: "#1A6B4A", fontWeight: 500 }}>
              Focused on: {goals[0]}
              {goals.length > 1 && (
                <span style={{ fontSize: 12, color: "#2D9E6B", marginLeft: 6 }}>+ {goals.length - 1} more</span>
              )}
            </span>
            <button
              onClick={() => navigate("/profile")}
              style={{ marginLeft: "auto", fontSize: 12, color: "#1A6B4A", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
            >
              Edit goals
            </button>
          </div>
        )}

        {/* Today's Nudge */}
        <div className="mt-4 bg-white rounded-2xl border-[1.5px] border-[hsl(140,24%,90%)] p-[18px]" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[hsl(152,62%,26%)]">Today's Nudge</span>
            <span className="text-[11px] text-[hsl(55,3%,53%)] bg-[hsl(50,20%,95%)] px-2 py-0.5 rounded-full">1 of 2 this week</span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-[14px] font-semibold shrink-0"
              style={{ background: featured.avatarBg, color: featured.avatarColor }}
            >
              {featured.initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[16px] font-semibold text-foreground">{featured.name}</h3>
              <p className="text-[12px] text-[hsl(55,3%,53%)]">{featured.role} · {featured.company}</p>
            </div>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: warmthMeta(featured.warmth).dot }} />
          </div>

          <div className="mt-3 bg-[hsl(146,47%,93%)] rounded-[10px] p-3 flex gap-2">
            <span className="text-[14px] shrink-0">✨</span>
            <p className="text-[13px] text-[hsl(152,62%,26%)] leading-relaxed">{featured.nudgeReason}</p>
          </div>

          <div className="flex gap-2 mt-3">
            <button className="flex-1 h-10 rounded-lg border border-[hsl(140,40%,88%)] text-[13px] font-medium text-[hsl(152,62%,26%)] bg-transparent hover:bg-[hsl(146,47%,96%)] transition-colors">Snooze</button>
            <button className="flex-1 h-10 rounded-lg border border-[hsl(140,40%,88%)] text-[13px] font-medium text-[hsl(152,62%,26%)] bg-transparent hover:bg-[hsl(146,47%,96%)] transition-colors">Not now</button>
          </div>

          <button
            onClick={() => navigate("/draft", { state: { contactId: featured.id } })}
            className="w-full mt-3 h-12 rounded-lg bg-[hsl(152,62%,26%)] text-white text-[15px] font-semibold hover:bg-[hsl(152,62%,22%)] transition-colors"
          >
            Draft a message →
          </button>
        </div>

        {/* Needs Attention */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold text-foreground">Needs attention</span>
            <button onClick={() => navigate("/contacts")} className="text-[13px] font-medium text-[hsl(152,62%,26%)]">See all</button>
          </div>

          <div className="space-y-2">
            {visibleAttention.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate("/draft", { state: { contactId: c.id } })}
                className="w-full flex items-center gap-3 bg-white rounded-xl border border-[hsl(50,20%,94%)] p-3 hover:bg-[hsl(50,20%,97%)] transition-colors text-left"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-semibold shrink-0"
                  style={{ background: c.avatarBg, color: c.avatarColor }}
                >
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-foreground">{c.name}</p>
                  <p className="text-[12px] text-[hsl(55,3%,53%)]">{c.role} · {c.company} · {c.lastContact}</p>
                </div>
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: warmthMeta(c.warmth).dot }} />
              </button>
            ))}
          </div>
        </div>

        {imported.length > 0 ? (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-semibold text-foreground">Your imported contacts</span>
              <button onClick={() => navigate("/contacts")} className="text-[13px] font-medium text-[hsl(152,62%,26%)]">View all ({imported.length})</button>
            </div>
            <div className="space-y-2">
              {imported.slice(0, 5).map((c) => {
                const initials = c.name.split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
                return (
                  <button
                    key={c.id}
                    onClick={() => navigate("/contacts")}
                    className="w-full flex items-center gap-3 bg-white rounded-xl border border-[hsl(50,20%,94%)] p-3 hover:bg-[hsl(50,20%,97%)] transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-semibold shrink-0 bg-[hsl(147,52%,93%)] text-[hsl(152,62%,26%)]">
                      {initials || "·"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-foreground truncate">{c.name}</p>
                      <p className="text-[12px] text-[hsl(55,3%,53%)] truncate">
                        {[c.role, c.company].filter(Boolean).join(" · ") || c.email || c.phone || "Newly added"}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wide text-[hsl(152,62%,26%)] bg-[hsl(147,52%,93%)] px-2 py-0.5 rounded-full shrink-0">New</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-[hsl(140,24%,80%)] bg-white p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[hsl(147,52%,93%)] flex items-center justify-center text-[hsl(152,62%,26%)]">
              <Plus size={16} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-foreground">Bring in your real contacts</p>
              <p className="text-[12px] text-[hsl(55,3%,53%)]">Import from LinkedIn, phone, Gmail, or add manually.</p>
            </div>
            <button onClick={() => navigate("/contacts")} className="h-8 px-3 rounded-full bg-[hsl(152,62%,26%)] text-white text-[12px] font-medium shrink-0">Import</button>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-[hsl(100,18%,91%)] flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = tab.path === "/dashboard";
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

      {showWelcome && (
        <div
          className="fixed inset-0"
          style={{
            background: "rgba(15,15,15,0.65)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 100,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              borderRadius: 24,
              padding: "36px 28px",
              maxWidth: 400,
              width: "calc(100% - 48px)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
              maxHeight: "calc(100vh - 48px)",
              overflowY: "auto",
            }}
          >
            {/* Step dots */}
            <div className="flex items-center justify-center gap-2" style={{ marginBottom: 20 }}>
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: welcomeStep === n ? "#1A6B4A" : welcomeStep > n ? "#A8D5BB" : "#E0E0D8",
                    transition: "background 200ms",
                  }}
                />
              ))}
            </div>

            {welcomeStep === 1 && (
              <>
                <div style={{ fontSize: 48, textAlign: "center" }}>👋</div>
                <h2 style={{ fontSize: 22, fontWeight: 800, textAlign: "center", color: "#1A1A18", marginTop: 12 }}>
                  Welcome to Pulse, {name}!
                </h2>
                <p style={{ fontSize: 14, color: "#6B6B65", lineHeight: 1.65, textAlign: "center", maxWidth: 320, margin: "12px auto 0" }}>
                  Everything you see on this dashboard is sample data — a demo network we've set up so you can explore how Pulse works before connecting your real accounts.
                </p>
                <div style={{ background: "#E8F5EE", borderRadius: 12, padding: "14px 18px", margin: "20px 0", textAlign: "left" }}>
                  <p style={{ fontSize: 13, color: "#1A6B4A", lineHeight: 1.55, marginBottom: 6 }}>
                    👤 Sarah Chen, Marcus T. and others are demo contacts — not real people from your network.
                  </p>
                  <p style={{ fontSize: 13, color: "#1A6B4A", lineHeight: 1.55, margin: 0 }}>
                    📊 The warmth scores, nudges, and activity are simulated examples.
                  </p>
                </div>
                <button
                  onClick={() => setWelcomeStep(2)}
                  style={{ width: "100%", height: 50, background: "#1A6B4A", color: "white", borderRadius: 12, fontSize: 15, fontWeight: 600 }}
                >
                  Got it — show me around →
                </button>
              </>
            )}

            {welcomeStep === 2 && (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 700, textAlign: "center", color: "#1A1A18", marginBottom: 20 }}>
                  Your dashboard, explained
                </h2>
                <div className="flex flex-col" style={{ gap: 12 }}>
                  {[
                    { bg: "#F0FDF4", color: "#16A34A", Icon: BarChart3, label: "Active · Cooling · Dormant", sub: "How warm each relationship is — based on how recently you've been in touch." },
                    { bg: "#E8F5EE", color: "#1A6B4A", Icon: Bell, label: "Today's Nudge", sub: "Pulse picks 2–3 people per session with a specific reason to reach out — never random." },
                    { bg: "#EFF6FF", color: "#1D4ED8", Icon: Sparkles, label: "Draft a message", sub: "Tap any contact and Pulse writes a personalized message using your relationship history." },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start gap-3">
                      <div
                        className="shrink-0 flex items-center justify-center"
                        style={{ width: 36, height: 36, borderRadius: "50%", background: row.bg }}
                      >
                        <row.Icon size={18} color={row.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A18" }}>{row.label}</p>
                        <p style={{ fontSize: 12, color: "#6B6B65", marginTop: 2, lineHeight: 1.5 }}>{row.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setWelcomeStep(3)}
                  style={{ width: "100%", height: 50, background: "#1A6B4A", color: "white", borderRadius: 12, fontSize: 15, fontWeight: 600, marginTop: 22 }}
                >
                  Makes sense →
                </button>
                <button
                  onClick={() => setWelcomeStep(1)}
                  style={{ width: "100%", color: "#6B6B65", fontSize: 13, fontWeight: 500, marginTop: 8, padding: "8px 0", background: "transparent" }}
                >
                  ← Back
                </button>
              </>
            )}

            {welcomeStep === 3 && (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 700, textAlign: "center", color: "#1A1A18" }}>
                  Ready to use your real network?
                </h2>
                <p style={{ fontSize: 14, color: "#6B6B65", textAlign: "center", marginTop: 8, lineHeight: 1.55 }}>
                  The demo gives you a feel for how Pulse works. When you're ready, connect your real accounts to see your actual contacts.
                </p>

                <div className="flex flex-col" style={{ gap: 8, marginTop: 20 }}>
                  {[
                    { Icon: Mail, color: "#EA4335", label: "Connect Gmail", action: () => { dismissWelcome(); navigate("/settings/privacy/permissions"); } },
                    { Icon: Briefcase, color: "#0A66C2", label: "Connect LinkedIn", action: () => { dismissWelcome(); navigate("/settings/privacy/permissions"); } },
                    { Icon: UploadCloud, color: "#1A6B4A", label: "Upload a CSV file", action: () => { dismissWelcome(); navigate("/contacts"); } },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={opt.action}
                      className="flex items-center"
                      style={{ background: "white", border: "1px solid #F0EFE8", borderRadius: 12, padding: "12px 16px", gap: 12, textAlign: "left" }}
                    >
                      <opt.Icon size={20} color={opt.color} className="shrink-0" />
                      <span className="flex-1" style={{ fontSize: 14, fontWeight: 600, color: "#1A1A18" }}>{opt.label}</span>
                      <ArrowRight size={16} color="#A8A89E" />
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2" style={{ margin: "16px 0" }}>
                  <div style={{ flex: 1, height: 1, background: "#E0E0D8" }} />
                  <span style={{ fontSize: 12, color: "#A8A89E" }}>or</span>
                  <div style={{ flex: 1, height: 1, background: "#E0E0D8" }} />
                </div>

                <button
                  onClick={dismissWelcome}
                  style={{ width: "100%", background: "#F7F7F4", color: "#6B6B65", borderRadius: 12, height: 44, fontSize: 14, fontWeight: 500 }}
                >
                  Explore the demo first →
                </button>
                <p style={{ fontSize: 11, color: "#A8A89E", marginTop: 8, textAlign: "center" }}>
                  You can always connect accounts from Settings later.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
