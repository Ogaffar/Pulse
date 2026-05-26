import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const goals = [
  { emoji: "🎯", label: "Land a new role or internship" },
  { emoji: "🤝", label: "Maintain my professional network" },
  { emoji: "📈", label: "Build in a new industry" },
  { emoji: "🌍", label: "Nurture my international network" },
];

function getStrength(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const strengthColors = ["#D0D0C8", "#DC2626", "#D97706", "#D97706", "#16A34A"];

export default function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [slideDir, setSlideDir] = useState<"left" | "right">("left");

  const strength = getStrength(password);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "Required";
    if (!lastName.trim()) errs.lastName = "Required";
    if (!email.trim()) errs.email = "Required";
    if (!password.trim()) errs.password = "Required";
    if (!agreed) errs.agreed = "Please agree to continue";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      localStorage.setItem("pulse_authed", "true");
      localStorage.setItem("pulse_name", firstName.trim());
    } catch {}
    setSlideDir("left");
    setStep(2);
  };

  const toggleGoal = (i: number) => {
    setSelectedGoals((prev) => {
      const next = prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i];
      try {
        localStorage.setItem(
          "pulse_goals",
          JSON.stringify(next.map((idx) => goals[idx].label))
        );
      } catch {}
      return next;
    });
  };

  const handleStep2 = () => {
    setLoading(true);
    try {
      localStorage.setItem("pulse_onboarded", "true");
      localStorage.setItem("pulse_authed", "true");
      if (!localStorage.getItem("pulse_frequency")) {
        localStorage.setItem("pulse_frequency", "twice");
      }
    } catch {}
    setTimeout(() => navigate("/dashboard", { state: { justSignedUp: true }, replace: true }), 800);
  };

  const inputStyle = (err?: string): React.CSSProperties => ({
    width: "100%",
    height: 48,
    border: err ? "1.5px solid #DC2626" : "1.5px solid rgba(26,26,24,0.12)",
    borderRadius: 10,
    padding: "0 16px",
    fontSize: 15,
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 150ms, box-shadow 150ms",
  });

  const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#1A6B4A";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,107,74,0.10)";
  };
  const blurHandler = (field: string) => (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = errors[field] ? "#DC2626" : "rgba(26,26,24,0.12)";
    e.currentTarget.style.boxShadow = "none";
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
          overflow: "hidden",
        }}
      >
        <p style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: "#1A6B4A", marginBottom: 8 }}>
          ⚡ Pulse
        </p>
        <p style={{ textAlign: "center", fontSize: 13, color: "#6B6B65", marginBottom: 24 }}>
          Build relationships that actually last.
        </p>

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24 }}>
          {[1, 2, 3].map((d) => (
            <div
              key={d}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: d <= step ? "#1A6B4A" : "#D0D0C8",
                transition: "background 200ms ease",
              }}
            />
          ))}
        </div>

        <div style={{ position: "relative" }}>
          {step === 1 && (
            <form onSubmit={handleStep1} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "#6B6B65", fontWeight: 500, marginBottom: 5 }}>First name</label>
                  <input value={firstName} onChange={(e) => { setFirstName(e.target.value); setErrors((p) => ({ ...p, firstName: "" })); }} style={inputStyle(errors.firstName)} onFocus={focusHandler} onBlur={blurHandler("firstName")} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "#6B6B65", fontWeight: 500, marginBottom: 5 }}>Last name</label>
                  <input value={lastName} onChange={(e) => { setLastName(e.target.value); setErrors((p) => ({ ...p, lastName: "" })); }} style={inputStyle(errors.lastName)} onFocus={focusHandler} onBlur={blurHandler("lastName")} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "#6B6B65", fontWeight: 500, marginBottom: 5 }}>Email</label>
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }} style={inputStyle(errors.email)} onFocus={focusHandler} onBlur={blurHandler("email")} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "#6B6B65", fontWeight: 500, marginBottom: 5 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showPw ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }} style={{ ...inputStyle(errors.password), paddingRight: 44 }} onFocus={focusHandler} onBlur={blurHandler("password")} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#6B6B65" }}>
                    {showPw ? "🙈" : "👁"}
                  </button>
                </div>
                {/* Strength bar */}
                <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: password.length > 0 && i <= strength ? strengthColors[strength] : "#E8E8E4", transition: "background 200ms" }} />
                  ))}
                </div>
              </div>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#6B6B65", cursor: "pointer" }}>
                <input type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setErrors((p) => ({ ...p, agreed: "" })); }} style={{ marginTop: 2, accentColor: "#1A6B4A" }} />
                <span>
                  I agree to the{" "}
                  <span style={{ color: "#1A6B4A", cursor: "pointer" }}>Terms of Service</span> and{" "}
                  <span style={{ color: "#1A6B4A", cursor: "pointer" }}>Privacy Policy</span>
                </span>
              </label>
              {errors.agreed && <p style={{ fontSize: 12, color: "#DC2626", marginTop: -8 }}>{errors.agreed}</p>}
              <button type="submit" style={{ marginTop: 12, width: "100%", height: 52, background: "#1A6B4A", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                Create my account →
              </button>
            </form>
          )}

          {step === 2 && (
            <div style={{ animation: "slideIn 300ms ease-out" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: "#1A1A18" }}>What are you working toward?</h3>
              <p style={{ fontSize: 13, color: "#6B6B65", marginBottom: 20 }}>Pulse tailors your experience to your goals.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {goals.map((g, i) => {
                  const selected = selectedGoals.includes(i);
                  return (
                    <button
                      key={i}
                      onClick={() => toggleGoal(i)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: selected ? "1.5px solid #1A6B4A" : "1.5px solid rgba(26,26,24,0.10)",
                        background: selected ? "#E8F5EE" : "#fff",
                        fontSize: 14,
                        fontWeight: 500,
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 150ms",
                        color: "#1A1A18",
                      }}
                    >
                      {g.emoji} {g.label}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={handleStep2}
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
                ) : "Almost there →"}
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#6B6B65", marginTop: 24 }}>
          Already have an account?{" "}
          <span onClick={() => navigate("/signin")} style={{ color: "#1A6B4A", fontWeight: 600, cursor: "pointer" }}>
            Sign in →
          </span>
        </p>

        <p style={{ textAlign: "center", fontSize: 11, color: "#A8A89E", marginTop: 16 }}>
          🔒 256-bit encrypted · Never shared · Delete anytime
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}
