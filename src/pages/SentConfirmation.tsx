import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function SentConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const stateName = (location.state as { contactName?: string } | null)?.contactName;
  const queryName = params.get("name");
  const name = stateName || queryName || "your contact";
  const [count, setCount] = useState(4);

  useEffect(() => {
    if (!stateName && !queryName) {
      navigate("/dashboard", { replace: true });
      return;
    }
    const tick = setInterval(() => setCount((c) => Math.max(1, c - 1)), 1000);
    const timer = setTimeout(() => navigate("/dashboard"), 4000);
    return () => { clearInterval(tick); clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-enter min-h-screen bg-white flex flex-col items-center justify-center px-4" style={{ position: "relative", zIndex: 1 }}>
      <header className="fixed top-0 left-0 right-0 h-14 flex items-center px-4">
        <button onClick={() => navigate("/dashboard")} className="text-[14px] text-[hsl(55,3%,40%)] flex items-center gap-1.5">
          <ArrowLeft size={18} /> Back
        </button>
      </header>

      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mb-5">
        <circle cx="40" cy="40" r="36" fill="hsl(146,47%,93%)" stroke="hsl(152,62%,26%)" strokeWidth="2.5" strokeDasharray="226" strokeDashoffset="226" style={{ animation: "circle-draw 0.8s ease forwards" }} />
        <path d="M26 40 L36 50 L54 32" stroke="hsl(152,62%,26%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="40" strokeDashoffset="40" style={{ animation: "check-draw 0.4s ease forwards 0.6s" }} />
        <style>{`
          @keyframes circle-draw { to { stroke-dashoffset: 0; } }
          @keyframes check-draw { to { stroke-dashoffset: 0; } }
        `}</style>
      </svg>

      <h2 className="text-[22px] font-bold text-foreground">Sent to {name}!</h2>
      <p className="text-[14px] text-[hsl(55,3%,40%)] max-w-[280px] text-center mt-2 leading-relaxed">
        Pulse has logged this touchpoint. {name.split(" ")[0]} will resurface in your nudges in 6 weeks.
      </p>

      <div className="bg-[hsl(146,47%,93%)] rounded-xl px-4 py-3.5 mt-5 mx-4 w-full max-w-sm">
        <p className="text-[13px] font-semibold text-[hsl(152,62%,26%)] text-center">{name}: Cooling → Active ✓</p>
      </div>

      <div className="w-full max-w-sm mt-5 space-y-2 px-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full h-12 rounded-xl bg-[hsl(152,62%,26%)] text-white text-[15px] font-semibold hover:bg-[hsl(152,62%,22%)] transition-colors"
        >
          Back to dashboard →
        </button>
        <button
          onClick={() => navigate("/contacts")}
          className="w-full h-12 rounded-xl bg-transparent border-[1.5px] border-[hsl(140,24%,90%)] text-[hsl(152,62%,26%)] text-[15px] font-medium hover:bg-[hsl(146,47%,96%)] transition-colors"
        >
          View {name.split(" ")[0]}'s profile
        </button>
        <button
          onClick={() => { localStorage.clear(); navigate("/"); }}
          style={{
            display: "block",
            marginTop: 8,
            fontSize: 13,
            color: "#A8A89E",
            textDecoration: "underline",
            cursor: "pointer",
            textAlign: "center",
            background: "none",
            border: "none",
            width: "100%",
          }}
        >
          Start the demo over →
        </button>
        <p style={{ fontSize: 12, color: "#A8A89E", textAlign: "center", marginTop: 8 }}>
          Returning to dashboard in {count}s…
        </p>
      </div>
    </div>
  );
}
