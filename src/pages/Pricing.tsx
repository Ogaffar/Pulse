import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    badge: "Current",
    badgeBg: "#E8F5EE",
    badgeColor: "#1A6B4A",
    price: "$0",
    period: "/month",
    tagline: "Perfect for getting started",
    features: ["Up to 50 contacts", "2 nudges per week", "AI message drafts (5/month)", "Basic relationship dashboard", "Email support"],
    cta: "Get started free →",
    action: "signup",
    featured: false,
  },
  {
    name: "Pro",
    badge: "Most popular",
    badgeBg: "#1A6B4A",
    badgeColor: "#fff",
    price: "$12",
    period: "/month",
    sub: "Billed annually",
    tagline: "For serious networkers",
    features: ["Unlimited contacts", "Daily nudges", "Unlimited AI drafts", "Relationship context memory", "Priority support", "Cultural tone adaptation"],
    cta: "Start Pro free →",
    action: "signup",
    featured: true,
  },
  {
    name: "Team",
    badge: null,
    price: "$29",
    period: "per user/month",
    tagline: "For cohorts, clubs & teams",
    features: ["Everything in Pro", "Team relationship graph", "Shared contact notes", "Admin dashboard", "SSO & compliance", "Dedicated onboarding"],
    cta: "Contact us",
    action: "email",
    featured: false,
  },
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#1A6B4A", marginBottom: 12 }}>PRICING</p>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1A1A18", letterSpacing: "-0.02em", marginBottom: 12 }}>Simple, honest pricing.</h1>
          <p style={{ fontSize: 16, color: "#6B6B65" }}>Free while we're in beta. No credit card ever required.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: "#fff",
                borderRadius: 20,
                border: plan.featured ? "2px solid #1A6B4A" : "1px solid rgba(26,26,24,0.08)",
                padding: 32,
                boxShadow: plan.featured ? "0 8px 32px rgba(26,107,74,0.15)" : "0 2px 12px rgba(0,0,0,0.04)",
                position: "relative",
              }}
            >
              {plan.featured && (
                <div style={{
                  position: "absolute",
                  top: -14,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#1A6B4A",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 16px",
                  borderRadius: 99,
                  whiteSpace: "nowrap",
                }}>
                  Most popular
                </div>
              )}
              {plan.badge && !plan.featured && (
                <span style={{
                  display: "inline-block",
                  fontSize: 11,
                  fontWeight: 600,
                  background: plan.badgeBg,
                  color: plan.badgeColor,
                  padding: "3px 10px",
                  borderRadius: 99,
                  marginBottom: 16,
                }}>
                  {plan.badge}
                </span>
              )}
              <div style={{ marginTop: plan.featured ? 8 : 0 }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: "#1A1A18" }}>{plan.price}</span>
                <span style={{ fontSize: 16, color: "#6B6B65" }}>{plan.period}</span>
              </div>
              {plan.sub && <p style={{ fontSize: 12, color: "#6B6B65", marginTop: 2 }}>{plan.sub}</p>}
              <p style={{ fontSize: 14, color: "#6B6B65", marginTop: 8, marginBottom: 20 }}>{plan.tagline}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: 24 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#4A4A44", marginBottom: 10 }}>
                    <Check size={16} color="#1A6B4A" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => plan.action === "email" ? window.location.href = "mailto:hello@pulse.app" : navigate("/signup")}
                style={{
                  width: "100%",
                  height: 48,
                  background: plan.featured ? "#1A6B4A" : "#fff",
                  color: plan.featured ? "#fff" : "#1A6B4A",
                  border: plan.featured ? "none" : "1.5px solid #1A6B4A",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#A8A89E", marginTop: 32 }}>
          🔒 Cancel anytime · No contracts · SOC 2 compliant
        </p>
      </div>
    </div>
  );
}
