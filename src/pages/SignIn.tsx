import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthed, setAuthed } from "@/lib/auth";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthed()) navigate("/dashboard", { replace: true });
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = "Please enter your email";
    if (!password.trim()) newErrors.password = "Please enter your password";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setTimeout(() => { setAuthed(); navigate("/dashboard"); }, 800);
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4" style={{ background: "#FAFAF8", position: "relative", zIndex: 1 }}>
      <div
        className="w-full"
        style={{
          maxWidth: 420,
          marginTop: 80,
          background: "#fff",
          borderRadius: 20,
          border: "1px solid rgba(26,26,24,0.08)",
          padding: "40px 36px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <p style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: "#1A6B4A", marginBottom: 8 }}>
          ⚡ Pulse
        </p>
        <p style={{ textAlign: "center", fontSize: 13, color: "#6B6B65", marginBottom: 28 }}>
          Welcome back. Your network missed you.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#6B6B65", fontWeight: 500, marginBottom: 5 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
              style={{
                width: "100%",
                height: 48,
                border: errors.email ? "1.5px solid #DC2626" : "1.5px solid rgba(26,26,24,0.12)",
                borderRadius: 10,
                padding: "0 16px",
                fontSize: 15,
                background: "#fff",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 150ms, box-shadow 150ms",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#1A6B4A"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,107,74,0.10)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? "#DC2626" : "rgba(26,26,24,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
            />
            {errors.email && <p style={{ fontSize: 12, color: "#DC2626", marginTop: 4 }}>{errors.email}</p>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, color: "#6B6B65", fontWeight: 500, marginBottom: 5 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
              style={{
                width: "100%",
                height: 48,
                border: errors.password ? "1.5px solid #DC2626" : "1.5px solid rgba(26,26,24,0.12)",
                borderRadius: 10,
                padding: "0 16px",
                fontSize: 15,
                background: "#fff",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 150ms, box-shadow 150ms",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#1A6B4A"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,107,74,0.10)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.password ? "#DC2626" : "rgba(26,26,24,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
            />
            <div style={{ textAlign: "right", marginTop: 4 }}>
              <span style={{ fontSize: 12, color: "#1A6B4A", cursor: "pointer" }}>Forgot password?</span>
            </div>
            {errors.password && <p style={{ fontSize: 12, color: "#DC2626", marginTop: 4 }}>{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 20,
              width: "100%",
              height: 52,
              background: "#1A6B4A",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "0.01em",
              cursor: loading ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading ? (
              <svg width="20" height="20" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" fill="none" strokeDasharray="31 31" strokeLinecap="round" />
              </svg>
            ) : "Sign in to Pulse"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(26,26,24,0.08)" }} />
          <span style={{ fontSize: 12, color: "#A8A89E" }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: "rgba(26,26,24,0.08)" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => { setAuthed(); navigate("/dashboard"); }}
            style={{
              width: "100%",
              height: 48,
              background: "#fff",
              border: "1.5px solid rgba(26,26,24,0.12)",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              color: "#1A1A18",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <button
            onClick={() => { setAuthed(); navigate("/dashboard"); }}
            style={{
              width: "100%",
              height: 48,
              background: "#fff",
              border: "1.5px solid rgba(26,26,24,0.12)",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              color: "#1A1A18",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            Continue with LinkedIn
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#6B6B65", marginTop: 24 }}>
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} style={{ color: "#1A6B4A", fontWeight: 600, cursor: "pointer" }}>
            Sign up free →
          </span>
        </p>

        <p style={{ textAlign: "center", fontSize: 11, color: "#A8A89E", marginTop: 16 }}>
          🔒 256-bit encrypted · Never shared · Delete anytime
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
