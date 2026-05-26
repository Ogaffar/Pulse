import { FadeIn } from "@/components/FadeIn";
import { Bell, Sparkles, BarChart3, Shield } from "lucide-react";

const features = [
  {
    icon: Bell,
    title: "The right person, at the right time.",
    body: "Pulse surfaces 2–3 contacts per session, 1–2 times a week — each with a specific, contextual reason to reach out. No random alerts. No guilt.",
    mockupLabel: "Smart Nudges",
    mockupContent: (
      <div style={{ padding: 12 }}>
        <div style={{ background: "#1A6B4A", borderRadius: "12px 12px 0 0", padding: "10px 14px" }}>
          <p style={{ color: "#fff", fontSize: 10, opacity: 0.8 }}>TODAY'S NUDGE</p>
          <p style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>Sarah Chen</p>
        </div>
        <div style={{ background: "#E8F5EE", padding: 10, fontSize: 10, color: "#1A6B4A", lineHeight: 1.5 }}>
          47 days since last contact. She just joined Stripe.
        </div>
        <div style={{ background: "#1A6B4A", color: "#fff", margin: "8px 0 0", borderRadius: 8, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>Draft message →</div>
      </div>
    ),
  },
  {
    icon: Sparkles,
    title: "Never stare at a blank screen again.",
    body: "When you're ready to reach out, Pulse drafts a personalized message using your relationship history and the contact's recent activity. You edit and approve. Nothing sends without you.",
    mockupLabel: "AI Drafts",
    mockupContent: (
      <div style={{ padding: 12 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {["Professional", "Warm", "Casual"].map((t, i) => (
            <span key={t} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 99, background: i === 0 ? "#1A6B4A" : "#F2F1EC", color: i === 0 ? "#fff" : "#6B6B65", fontWeight: 500 }}>{t}</span>
          ))}
        </div>
        <div style={{ background: "#FAFAF8", border: "1px solid #E0EDE6", borderRadius: 8, padding: 10, fontSize: 10, color: "#1A1A18", lineHeight: 1.6 }}>
          Hi Sarah, I saw you recently joined Stripe as a PM — that's a fantastic move...
        </div>
      </div>
    ),
  },
  {
    icon: BarChart3,
    title: "See your entire network at a glance.",
    body: "Active, Cooling, Dormant — your relationship health dashboard shows you exactly which connections need attention before the gap becomes awkward.",
    mockupLabel: "Dashboard",
    mockupContent: (
      <div style={{ padding: 12 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {[
            { n: "24", l: "Active", bg: "#F0FDF4", c: "#16A34A" },
            { n: "8", l: "Cooling", bg: "#FFFBEB", c: "#D97706" },
            { n: "3", l: "Dormant", bg: "#FEF2F2", c: "#DC2626" },
          ].map((m) => (
            <div key={m.l} style={{ flex: 1, background: m.bg, borderRadius: 8, padding: 6, textAlign: "center" }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: m.c }}>{m.n}</p>
              <p style={{ fontSize: 8, color: "#6B6B65" }}>{m.l}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[{ name: "Sarah C.", days: "47d", dot: "#F59E0B" }, { name: "Marcus T.", days: "62d", dot: "#DC2626" }].map((c) => (
            <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 6, background: "#F7F7F5", borderRadius: 6, padding: "6px 8px" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#E8F5EE" }} />
              <span style={{ flex: 1, fontSize: 10, fontWeight: 600 }}>{c.name}</span>
              <span style={{ fontSize: 9, color: "#6B6B65" }}>{c.days}</span>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot }} />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Shield,
    title: "You control everything.",
    body: "Plain-language permissions. Individual toggles per platform. Revoke access anytime. Pulse is transparent about every byte it reads — because trust is the product.",
    mockupLabel: "Privacy",
    mockupContent: (
      <div style={{ padding: 12 }}>
        {["Contacts", "Gmail", "LinkedIn"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? "1px solid #F0F0EC" : "none" }}>
            <span style={{ fontSize: 11, fontWeight: 500 }}>{s}</span>
            <div style={{ width: 36, height: 20, borderRadius: 10, background: i < 2 ? "#1A6B4A" : "#D0D0C8", position: "relative" }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: i < 2 ? 18 : 2, transition: "left 200ms" }} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-background py-16 md:py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-12 md:mb-16">
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#1A6B4A", marginBottom: 12 }}>THE SOLUTION</p>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#1A1A18" }}>
            Everything you need to maintain relationships effortlessly
          </h2>
        </FadeIn>

        <div>
          {features.map((f, i) => {
            const isEven = i % 2 === 0;
            return (
              <FadeIn key={i} delay={i * 100}>
                <div
                  className="flex flex-col md:flex-row items-center gap-8 md:gap-12 py-10 md:py-12"
                  style={{
                    flexDirection: isEven ? undefined : undefined,
                    borderBottom: i < features.length - 1 ? "1px solid rgba(26,26,24,0.06)" : "none",
                  }}
                >
                  <div className={`flex-1 ${isEven ? "md:order-1" : "md:order-2"}`}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      <f.icon size={24} color="#1A6B4A" />
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A18", marginBottom: 8 }}>{f.title}</h3>
                    <p style={{ fontSize: 16, color: "#4A4A44", lineHeight: 1.7, maxWidth: 400 }}>{f.body}</p>
                  </div>
                  <div className={`flex-shrink-0 ${isEven ? "md:order-2" : "md:order-1"}`}>
                    <div style={{
                      width: 220,
                      height: 360,
                      borderRadius: 32,
                      border: "3px solid #1A1A18",
                      background: "#fff",
                      overflow: "hidden",
                      position: "relative",
                    }}>
                      <div style={{ height: 24, background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 60, height: 14, borderRadius: 10, background: "#0A0A0A" }} />
                      </div>
                      {f.mockupContent}
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
