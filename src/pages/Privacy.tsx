import { useNavigate } from "react-router-dom";

const sections = [
  {
    title: "What we collect",
    body: "Pulse reads metadata about your interactions: who you've contacted and when. We never read message content, subject lines, or attachments. We access only what we tell you we access — nothing more.",
  },
  {
    title: "How we use your data",
    body: "Your data is used exclusively to surface relationship insights within your own account. It is never sold, never shared with advertisers, and never used to train AI models without your explicit consent.",
  },
  {
    title: "Your controls",
    body: "You can revoke access to any data source at any time from Settings → Privacy. You can download all your data or delete your account entirely — both take effect within 24 hours.",
  },
  {
    title: "Data security",
    body: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We undergo annual SOC 2 Type II audits. We do not store message content on our servers — ever.",
  },
  {
    title: "Contact us",
    body: 'Questions? Email us at <a href="mailto:privacy@pulse.app" style="color:#1A6B4A;text-decoration:underline">privacy@pulse.app</a>. We respond within 48 hours.',
  },
];

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px" }}>
        <button
          onClick={() => navigate("/")}
          style={{ background: "none", border: "none", color: "#1A6B4A", fontSize: 14, fontWeight: 500, cursor: "pointer", marginBottom: 32, padding: 0 }}
        >
          ← Back to Pulse
        </button>

        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1A1A18", letterSpacing: "-0.02em", marginBottom: 8 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 14, color: "#6B6B65", marginBottom: 48 }}>
          Last updated April 2026 · We wrote this in plain English on purpose.
        </p>

        {sections.map((s) => (
          <div key={s.title} style={{ borderLeft: "3px solid #E8F5EE", paddingLeft: 20, marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A18", marginBottom: 8 }}>{s.title}</h2>
            <p style={{ fontSize: 15, color: "#4A4A44", lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: s.body }} />
          </div>
        ))}
      </div>
    </div>
  );
}
