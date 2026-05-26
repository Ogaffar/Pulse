import { useNavigate } from "react-router-dom";

import { Footer } from "@/components/landing/Footer";
import { FadeIn } from "@/components/FadeIn";

const columns = ["Smart Nudges", "Relationship Maintenance", "AI Outreach", "Messaging Integration", "Pro Network"];

type CellVal = "YES" | "NO" | "PARTIAL";

const rows: { app: string; vals: CellVal[] }[] = [
  { app: "LinkedIn", vals: ["NO", "NO", "NO", "PARTIAL", "YES"] },
  { app: "Dex", vals: ["PARTIAL", "YES", "PARTIAL", "PARTIAL", "YES"] },
  { app: "Clay.earth", vals: ["NO", "YES", "NO", "PARTIAL", "YES"] },
  { app: "UpHabit", vals: ["PARTIAL", "YES", "NO", "NO", "YES"] },
];

function CheckIcon() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%", background: "#E8F5EE" }}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 5.5L4 7L7.5 3.5" stroke="#1A6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );
}

function PartialIcon() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%", background: "#F0F0EC", fontSize: 15, fontWeight: 500, color: "#888780", lineHeight: 1 }}>
      ~
    </span>
  );
}

function NoIcon() {
  return <span style={{ color: "#D0D0C8", fontWeight: 300, fontSize: 15 }}>—</span>;
}

function CellIcon({ v }: { v: CellVal }) {
  if (v === "YES") return <CheckIcon />;
  return <NoIcon />;
}

function PulseCheck() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%", background: "#D1FAE5" }}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 5.5L4 7L7.5 3.5" stroke="#1A6B4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );
}

const insights = [
  {
    num: "01",
    title: "Randomness is the enemy.",
    body: "Every competing app surfaces contacts randomly. Users told us they turned off notifications within two weeks — not because they didn't value their network, but because the prompts had no context. A nudge without a reason is just noise. Pulse nudges with evidence: recency data, milestone signals, and goal alignment.",
  },
  {
    num: "02",
    title: "The blank cursor kills more reconnections than time does.",
    body: "Our interviews revealed that 9 out of 10 times, someone means to reach out but stops at the compose screen. They have the intent. They open the app. Then they stare at a blank box and close it. Pulse solves this by treating message generation as a core feature — not a nice-to-have — with drafts that use your actual relationship history, not a template.",
  },
  {
    num: "03",
    title: "Trust is the product, not the feature.",
    body: "Privacy concerns were raised unprompted in every single customer interview we conducted. Not as an afterthought — as the first question. We built Pulse from the assumption that users would not grant access without transparency. Every data source has a plain-language explanation. Every toggle is real. Nothing reads message content. Ever.",
  },
];

const personas = [
  {
    initials: "MA",
    name: "Maya, 26",
    role: "MBA Student & Career Switcher",
    accent: "#1A6B4A",
    avatarBg: "linear-gradient(135deg,#D1FAE5,#6EE7B7)",
    avatarColor: "#065F46",
    quoteBg: "#E8F5EE",
    quoteBorder: "#1A6B4A",
    quoteColor: "#1A6B4A",
    pillBg: "#E8F5EE",
    pillColor: "#065F46",
    pillBorder: "#A7F3D0",
    quote: "I have a spreadsheet of people I should keep in touch with. I open it maybe once a month. That tells you how well it works.",
    pills: ["Forgets to follow up", "Blank page paralysis", "800 contacts, no priorities"],
  },
  {
    initials: "MR",
    name: "Marcus, 34",
    role: "Remote Finance Manager",
    accent: "#1D4ED8",
    avatarBg: "linear-gradient(135deg,#DBEAFE,#93C5FD)",
    avatarColor: "#1E3A8A",
    quoteBg: "#EFF6FF",
    quoteBorder: "#1D4ED8",
    quoteColor: "#1E40AF",
    pillBg: "#EFF6FF",
    pillColor: "#1E3A8A",
    pillBorder: "#93C5FD",
    quote: "I had 12 years of relationships in finance. I moved cities and within a year felt like I was starting over. Nobody reached out, and neither did I.",
    pills: ["Lost touch post-relocation", "Feels inauthentic mass-messaging", "Privacy conscious"],
  },
  {
    initials: "AD",
    name: "Adaeze, 29",
    role: "Diaspora Professional",
    accent: "#7C3AED",
    avatarBg: "linear-gradient(135deg,#EDE9FE,#C4B5FD)",
    avatarColor: "#4C1D95",
    quoteBg: "#F5F3FF",
    quoteBorder: "#7C3AED",
    quoteColor: "#5B21B6",
    pillBg: "#F5F3FF",
    pillColor: "#4C1D95",
    pillBorder: "#C4B5FD",
    quote: "I want something that knows my world is big and complicated and helps me stay in all of it — not just the LinkedIn part.",
    pills: ["4 time zones, 3 cultures", "AI feels too American", "Different tones for different circles"],
  },
];

const principles = [
  {
    num: "01",
    title: "You always approve before anything sends.",
    body: "Pulse is an intelligence layer, not an automation layer. Every message, every outreach, every reconnection — you see it before it goes anywhere. Auto-send is permanently off. It was never a feature we considered.",
  },
  {
    num: "02",
    title: "We tell you exactly what we read.",
    body: "No vague 'we may access your contacts' language. Every data source has a plain English description of what is read, what is not read, and why it is needed. You can turn off any source at any time.",
  },
  {
    num: "03",
    title: "Nudges have reasons, not just names.",
    body: "We will never surface a contact without a reason. A name is not a nudge. A reason is: they just changed roles, you haven't spoken in 60 days, they match your stated career goal. That is what earns your attention.",
  },
  {
    num: "04",
    title: "Students pay student prices. Always.",
    body: "The most valuable relationship-building years happen before you have a corporate expense account. We will always maintain an accessible tier for students and early-career professionals. That's not a promotional decision — it's a product principle.",
  },
];

export default function WhyPulse() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh", position: "relative", zIndex: 1 }}>
      

      {/* PAGE HEADER */}
      <section style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(26,107,74,0.10) 0%, transparent 65%), #FAFAF8", padding: "100px 24px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#1A6B4A", textTransform: "uppercase", marginBottom: 14 }}>WHY PULSE</p>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.1, color: "#1A1A18" }}>
              We didn't build another CRM. We built what CRMs forgot.
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p style={{ fontSize: 18, color: "#4A4A44", lineHeight: 1.7, maxWidth: 600, margin: "20px auto 0" }}>
              Every CRM in the market was built for salespeople managing pipelines. None of them were built for humans managing relationships. Pulse was.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* SECTION 1: THE MARKET FAILURE */}
      <section style={{ background: "#fff", padding: "80px 24px", marginBottom: 0 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#1A6B4A", textTransform: "uppercase", marginBottom: 12 }}>WHY PULSE</p>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#1A1A18", marginBottom: 32 }}>The only product that does all of this.</h2>
            <p style={{ marginTop: 16, fontSize: 16, color: "#4A4A44", lineHeight: 1.75 }}>
              LinkedIn helps you discover people. Dex and Covve remind you to follow up. Clay syncs your contacts. But not one of them closes the loop — from the right person, to the right moment, to a message that actually sounds like you.
            </p>
            <p style={{ marginTop: 12, fontSize: 16, color: "#4A4A44", lineHeight: 1.75 }}>
              We interviewed professionals across industries and heard the same thing: the problem isn't meeting people. It's maintaining them. And the tools built to help have all made the same mistake — they treat relationship management like a task to be completed, not a habit to be built.
            </p>
          </FadeIn>

          <FadeIn delay={150}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(26,26,24,0.08)", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", width: "100%", marginTop: 32 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "17.5%" }} />
                  <col style={{ width: "17.5%" }} />
                  <col style={{ width: "17.5%" }} />
                  <col style={{ width: "17.5%" }} />
                </colgroup>
                <thead>
                  <tr style={{ height: 56 }}>
                    <th style={{ background: "#fff" }} />
                    <th style={{ background: "#fff", fontSize: 14, fontWeight: 600, color: "#1A1A18", textAlign: "center", verticalAlign: "middle" }}>LinkedIn</th>
                    <th style={{ background: "#fff", fontSize: 14, fontWeight: 600, color: "#1A1A18", textAlign: "center", verticalAlign: "middle" }}>Dex</th>
                    <th style={{ background: "#fff", fontSize: 14, fontWeight: 600, color: "#1A1A18", textAlign: "center", verticalAlign: "middle" }}>Clay.earth</th>
                    <th style={{ background: "#1A6B4A", borderRadius: "12px 12px 0 0", textAlign: "center", verticalAlign: "middle", padding: "8px 0" }}>
                      <span style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 99, padding: "2px 10px", marginBottom: 4 }}>⭐ Our pick</span>
                      <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: "#fff" }}>Pulse</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { feature: "Smart Nudges", vals: [false, true, true, true] },
                    { feature: "AI Outreach", vals: [false, false, false, true] },
                    { feature: "Student-Native Pricing", vals: [false, false, false, true] },
                    { feature: "Messaging Integration", vals: [true, false, false, true] },
                    { feature: "Relationship Maintenance", vals: [false, true, true, true] },
                    { feature: "Privacy Controls", vals: [false, false, false, true] },
                  ] as const).map((row, ri) => (
                    <tr
                      key={row.feature}
                      style={{ height: 52, borderTop: "1px solid rgba(26,26,24,0.06)", background: ri % 2 === 0 ? "#fff" : "#FAFAF8", transition: "background 120ms" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F5F2"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = ri % 2 === 0 ? "#fff" : "#FAFAF8"; }}
                    >
                      <td style={{ padding: "0 0 0 20px", fontSize: 14, fontWeight: 500, color: "#1A1A18", textAlign: "left", verticalAlign: "middle" }}>{row.feature}</td>
                      {row.vals.slice(0, 3).map((has, vi) => (
                        <td key={vi} style={{ textAlign: "center", verticalAlign: "middle" }}>
                          {has ? (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ display: "inline-block" }}>
                              <circle cx="10" cy="10" r="10" fill="#E8F5EE" />
                              <path d="M6 10l3 3 5-5" stroke="#1A6B4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <span style={{ color: "#D0D0C8", fontSize: 16, fontWeight: 300 }}>—</span>
                          )}
                        </td>
                      ))}
                      <td style={{ textAlign: "center", verticalAlign: "middle", background: "rgba(26,107,74,0.04)" }}>
                        {row.vals[3] ? (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ display: "inline-block" }}>
                            <circle cx="10" cy="10" r="10" fill="#1A6B4A" />
                            <path d="M6 10l3 3 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <span style={{ color: "#D0D0C8", fontSize: 16, fontWeight: 300 }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#6B6B65", fontStyle: "italic" }}>
              Every competitor solves one part of the problem. Pulse solves all of it.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* SECTION 2: THE THREE INSIGHTS */}
      <section style={{ background: "#F7F7F4", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#1A6B4A", textTransform: "uppercase" }}>WHAT RESEARCH TAUGHT US</p>
            <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 12, marginBottom: 48, color: "#1A1A18" }}>Three things no one else is saying.</h2>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {insights.map((ins, i) => (
              <FadeIn key={ins.num} delay={i * 100}>
                <div
                  style={{
                    background: "#fff", borderRadius: 16, padding: "32px 28px",
                    border: "1px solid rgba(26,26,24,0.07)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "transform 250ms ease, box-shadow 250ms ease", cursor: "default", height: "100%",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
                >
                  <p style={{ fontSize: 64, fontWeight: 800, color: "#E8F5EE", lineHeight: 1, marginBottom: 12 }}>{ins.num}</p>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A18", marginBottom: 10 }}>{ins.title}</h3>
                  <p style={{ fontSize: 15, color: "#4A4A44", lineHeight: 1.7 }}>{ins.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: THE PERSONAS */}
      <section style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#1A6B4A", textTransform: "uppercase" }}>WHO IT'S FOR</p>
            <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 12, marginBottom: 40, color: "#1A1A18" }}>
              Built for people who know their network matters — and keep forgetting to act on it.
            </h2>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {personas.map((p, i) => (
              <FadeIn key={p.initials} delay={i * 100}>
                <div
                  style={{
                    background: "#fff", borderRadius: 16, overflow: "hidden",
                    border: "1px solid rgba(26,26,24,0.07)",
                    transition: "transform 250ms ease, box-shadow 250ms ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.09)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ height: 5, background: p.accent }} />
                  <div style={{ padding: 24 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: "50%", background: p.avatarBg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, fontWeight: 800, color: p.avatarColor,
                    }}>{p.initials}</div>
                    <p style={{ fontSize: 18, fontWeight: 700, marginTop: 12, color: "#1A1A18" }}>{p.name}</p>
                    <p style={{ fontSize: 13, color: "#6B6B65", marginBottom: 12 }}>{p.role}</p>
                    <div style={{ background: p.quoteBg, borderLeft: `3px solid ${p.quoteBorder}`, borderRadius: "0 10px 10px 0", padding: 12, marginBottom: 14 }}>
                      <p style={{ fontSize: 13, color: p.quoteColor, lineHeight: 1.6, fontStyle: "italic" }}>"{p.quote}"</p>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {p.pills.map((pill) => (
                        <span key={pill} style={{ background: p.pillBg, color: p.pillColor, border: `1px solid ${p.pillBorder}`, borderRadius: 99, fontSize: 11, fontWeight: 500, padding: "4px 12px" }}>{pill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: THE PRINCIPLES */}
      <section style={{ background: "#F7F7F4", padding: "80px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <FadeIn>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#1A6B4A", textTransform: "uppercase" }}>OUR PRINCIPLES</p>
            <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 12, marginBottom: 40, color: "#1A1A18" }}>Four things we will never compromise on.</h2>
          </FadeIn>
          {principles.map((pr, i) => (
            <FadeIn key={pr.num} delay={i * 100}>
              <div style={{ padding: "28px 0", display: "flex", gap: 32, alignItems: "flex-start", borderTop: "1px solid rgba(26,26,24,0.07)" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1A6B4A", minWidth: 32, marginTop: 4 }}>{pr.num}</span>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A18", marginBottom: 8 }}>{pr.title}</h3>
                  <p style={{ fontSize: 15, color: "#4A4A44", lineHeight: 1.7 }}>{pr.body}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* SECTION 5: FINAL CTA */}
      <section style={{ background: "linear-gradient(135deg, #1A6B4A 0%, #145238 100%)", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>You already know which relationships you've been neglecting.</h2>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", marginTop: 12, marginBottom: 32 }}>Pulse won't judge you for it. It'll just help you fix it.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
              <button onClick={() => navigate("/signup")} style={{ background: "#fff", color: "#1A6B4A", border: "none", borderRadius: 12, height: 52, padding: "0 28px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Get early access free →</button>
              <button onClick={() => navigate("/")} style={{ background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.4)", borderRadius: 12, height: 52, padding: "0 28px", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>See how it works</button>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 16 }}>Free forever plan available · No credit card · Cancel Pro anytime</p>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
