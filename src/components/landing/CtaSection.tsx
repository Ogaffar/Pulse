import { useState, useRef } from "react";
import { FadeIn } from "@/components/FadeIn";
import { useNavigate } from "react-router-dom";

export function CtaSection() {
  const [email, setEmail] = useState("");
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setShaking(true);
      setTimeout(() => setShaking(false), 300);
      return;
    }
    navigate(`/signup?email=${encodeURIComponent(email)}`);
  };

  return (
    <section
      id="cta"
      className="py-16 md:py-24 px-5"
      style={{
        background: "linear-gradient(135deg, #1A6B4A, #2D9E6B, #145238, #1A6B4A)",
        backgroundSize: "300% 300%",
        animation: "gradientShift 8s ease infinite",
      }}
    >
      <div className="max-w-xl mx-auto text-center">
        <FadeIn>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Your most important relationships are already going cold.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 32 }}>
            Join 200+ professionals who are changing that.
          </p>
        </FadeIn>

        <FadeIn delay={100}>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
            <input
              ref={inputRef}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={shaking ? "shake-input" : ""}
              style={{
                flex: 1,
                height: 52,
                background: "#fff",
                borderRadius: 10,
                padding: "0 20px",
                fontSize: 15,
                border: shaking ? "2px solid #DC2626" : "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#fff",
                color: "#1A6B4A",
                fontWeight: 700,
                height: 52,
                borderRadius: 10,
                padding: "0 24px",
                border: "none",
                cursor: "pointer",
                fontSize: 15,
                whiteSpace: "nowrap",
                transition: "background 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#E8F5EE"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
            >
              Get Early Access
            </button>
          </form>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
            No credit card. No spam. Cancel anytime.
          </p>
        </FadeIn>
      </div>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shakeInput {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .shake-input {
          animation: shakeInput 300ms ease;
        }
      `}</style>
    </section>
  );
}
