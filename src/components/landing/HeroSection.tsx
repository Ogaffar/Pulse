import { useNavigate } from "react-router-dom";
import { FadeIn } from "@/components/FadeIn";
import { Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

const proofAvatars = ["Sarah K.", "James M.", "Aisha L.", "David R.", "Priya N."];

export function HeroSection() {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-5 pt-20 pb-12 overflow-hidden"
      style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(26,107,74,0.08) 0%, transparent 70%), #FAFAF8" }}
    >
      <FadeIn className="text-center max-w-3xl mx-auto">
        <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A18" }}>
          Your network is your net worth.{" "}
          <span style={{ background: "linear-gradient(135deg, #1A6B4A, #2D9E6B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Stop letting it go cold.
          </span>
        </h1>
      </FadeIn>

      <FadeIn className="text-center max-w-[560px] mx-auto mt-5" delay={100}>
        <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "#4A4A44", lineHeight: 1.7, fontWeight: 400 }}>
          Pulse surfaces the right person at the right moment — and writes the message for you. Intelligent, proactive relationship maintenance for the career you're building.
        </p>
      </FadeIn>

      <FadeIn className="flex flex-col sm:flex-row items-center gap-3 mt-8" delay={200}>
        <button
          onClick={() => navigate("/signup")}
          style={{ background: "#1A6B4A", color: "#fff", border: "none", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
        >
          Get Early Access →
        </button>
        <button
          onClick={() => scrollTo("how-it-works")}
          style={{ background: "rgba(26,107,74,0.08)", color: "#1A6B4A", border: "none", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
        >
          See how it works
        </button>
      </FadeIn>

      <FadeIn className="flex items-center gap-3 mt-8" delay={300}>
        <div className="flex -space-x-2">
          {proofAvatars.map((name) => (
            <Avatar key={name} size="sm" name={name} className="border-2 border-[#FAFAF8]" />
          ))}
        </div>
        <div className="text-small text-muted-foreground">
          <span className="font-medium text-foreground">Trusted by 200+</span> professionals
          <span className="ml-1.5 inline-flex items-center gap-0.5">
            <Star size={12} className="text-accent-warm fill-accent-warm" />
            4.9
          </span>
        </div>
      </FadeIn>

      {/* iPhone 15 Pro Mockup */}
      <FadeIn className="mt-10 md:mt-14 relative" delay={400}>
        <div className="relative" style={{ width: 340, margin: "0 auto" }}>
          {/* Floating pills */}
          <div style={{ position: "absolute", left: -20, top: 180, background: "#fff", color: "#1A6B4A", border: "1px solid #A8D5BB", borderRadius: 99, padding: "6px 12px", fontSize: 11, fontWeight: 600, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", whiteSpace: "nowrap", zIndex: 5 }}>
            ✦ AI-powered drafts
          </div>
          <div style={{ position: "absolute", left: -10, top: 280, background: "#fff", color: "#1A6B4A", border: "1px solid #A8D5BB", borderRadius: 99, padding: "6px 12px", fontSize: 11, fontWeight: 600, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", whiteSpace: "nowrap", zIndex: 5 }}>
            🔒 Privacy first
          </div>
          <div style={{ position: "absolute", right: -20, top: 220, background: "#fff", color: "#1A6B4A", border: "1px solid #A8D5BB", borderRadius: 99, padding: "6px 12px", fontSize: 11, fontWeight: 600, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", whiteSpace: "nowrap", zIndex: 5 }}>
            ⚡ 2–3 nudges/week
          </div>
          <div style={{ position: "absolute", right: -10, top: 340, background: "#fff", color: "#1A6B4A", border: "1px solid #A8D5BB", borderRadius: 99, padding: "6px 12px", fontSize: 11, fontWeight: 600, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", whiteSpace: "nowrap", zIndex: 5 }}>
            🌍 Cultural context
          </div>

          {/* Phone frame */}
          <div
            style={{
              width: 280,
              height: 560,
              margin: "0 auto",
              background: "linear-gradient(145deg, #2A2A2A 0%, #1A1A1A 50%, #2C2C2C 100%)",
              borderRadius: 50,
              border: "1.5px solid rgba(255,255,255,0.15)",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.5), 0 32px 64px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
              position: "relative",
              animation: "float 4s ease-in-out infinite",
            }}
          >
            {/* Side buttons */}
            <div style={{ position: "absolute", left: -4, top: 120, width: 4, height: 32, background: "#2A2A2A", borderRadius: "2px 0 0 2px", border: "1px solid rgba(255,255,255,0.08)" }} />
            <div style={{ position: "absolute", left: -4, top: 164, width: 4, height: 32, background: "#2A2A2A", borderRadius: "2px 0 0 2px", border: "1px solid rgba(255,255,255,0.08)" }} />
            <div style={{ position: "absolute", right: -4, top: 140, width: 4, height: 64, background: "#2A2A2A", borderRadius: "0 2px 2px 0", border: "1px solid rgba(255,255,255,0.08)" }} />

            {/* Dynamic Island */}
            <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 100, height: 30, background: "#0A0A0A", borderRadius: 20, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1A1A1A" }} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1A1A1A" }} />
            </div>

            {/* Inner screen */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 48, overflow: "hidden", background: "#fff" }}>
              {/* Status bar */}
              <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", fontSize: 12, fontWeight: 600, color: "#1A1A18", paddingTop: 8 }}>
                <span>9:41</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {/* Signal */}
                  <svg width="14" height="10" viewBox="0 0 14 10"><rect x="0" y="6" width="2.5" height="4" rx="0.5" fill="#1A1A18"/><rect x="3.5" y="4" width="2.5" height="6" rx="0.5" fill="#1A1A18"/><rect x="7" y="2" width="2.5" height="8" rx="0.5" fill="#1A1A18"/><rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill="#1A1A18"/></svg>
                  {/* WiFi */}
                  <svg width="12" height="10" viewBox="0 0 12 10"><path d="M6 8.5a1 1 0 100 2 1 1 0 000-2zM2.5 6.5C3.5 5.5 4.7 5 6 5s2.5.5 3.5 1.5" stroke="#1A1A18" strokeWidth="1.2" fill="none" strokeLinecap="round"/><path d="M.5 4.5C2 3 3.8 2 6 2s4 1 5.5 2.5" stroke="#1A1A18" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>
                  {/* Battery */}
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <div style={{ width: 22, height: 11, border: "1.5px solid #1A1A18", borderRadius: 3, position: "relative", overflow: "hidden" }}>
                      <div style={{ width: "80%", height: "100%", background: "#16A34A", borderRadius: 1 }} />
                    </div>
                    <div style={{ width: 3, height: 5, background: "#1A1A18", borderRadius: "0 1px 1px 0", marginLeft: 0.5 }} />
                  </div>
                </div>
              </div>

              {/* App bar */}
              <div style={{ background: "#1A6B4A", padding: "12px 16px 10px" }}>
                <p style={{ color: "#fff", fontSize: 13, opacity: 0.85 }}>Good morning 👋</p>
                <p style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>Your network</p>
              </div>

              {/* Metrics */}
              <div style={{ display: "flex", gap: 6, padding: "10px 10px 6px" }}>
                {[
                  { n: "24", l: "Active", bg: "#F0FDF4", c: "#16A34A" },
                  { n: "8", l: "Cooling", bg: "#FFFBEB", c: "#D97706" },
                  { n: "3", l: "Dormant", bg: "#FEF2F2", c: "#DC2626" },
                ].map((m) => (
                  <div key={m.l} style={{ flex: 1, background: m.bg, borderRadius: 8, padding: "8px 4px", textAlign: "center" }}>
                    <p style={{ fontSize: 18, fontWeight: 700, color: m.c }}>{m.n}</p>
                    <p style={{ fontSize: 9, color: "#6B6B65" }}>{m.l}</p>
                  </div>
                ))}
              </div>

              {/* Nudge card */}
              <div style={{ margin: "0 10px", background: "#fff", borderRadius: 12, border: "1px solid #E8EDE6", padding: 12 }}>
                <p style={{ fontSize: 9, fontWeight: 600, color: "#1A6B4A", textTransform: "uppercase", letterSpacing: "0.08em" }}>TODAY'S NUDGE</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#92400E", flexShrink: 0 }}>SC</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A18" }}>Sarah Chen</p>
                    <p style={{ fontSize: 10, color: "#6B6B65" }}>Stripe · PM</p>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B" }} />
                </div>
                <div style={{ background: "#E8F5EE", borderRadius: 8, padding: 8, margin: "6px 0", fontSize: 10, color: "#1A6B4A", lineHeight: 1.4 }}>
                  47 days · just joined Stripe — good time to reconnect
                </div>
                <div style={{ background: "#1A6B4A", color: "#fff", borderRadius: 8, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>
                  Draft message →
                </div>
              </div>

              {/* Contact list */}
              <div style={{ margin: "8px 10px 0", display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { init: "MT", bg: "#DBEAFE", name: "Marcus T.", dot: "#DC2626" },
                  { init: "JK", bg: "#EDE9FE", name: "James K.", dot: "#F59E0B" },
                  { init: "LP", bg: "#D1FAE5", name: "Lisa P.", dot: "#22C55E" },
                ].map((c) => (
                  <div key={c.init} style={{ height: 36, display: "flex", alignItems: "center", gap: 8, background: "#F7F7F5", borderRadius: 8, padding: "0 10px" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#1A1A18", flexShrink: 0 }}>{c.init}</div>
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "#1A1A18" }}>{c.name}</span>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
