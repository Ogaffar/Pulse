import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function OnboardingComplete() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
    const timer = setTimeout(() => navigate("/"), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 text-center">
      {/* Animated checkmark */}
      <div className={`mb-6 transition-all duration-700 ease-out ${show ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
          <circle cx="48" cy="48" r="44" stroke="#1A6B4A" strokeWidth="3" opacity="0.15" />
          <circle
            cx="48" cy="48" r="44"
            stroke="#1A6B4A" strokeWidth="3"
            strokeDasharray="276.5"
            strokeDashoffset={show ? 0 : 276.5}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-out 0.2s" }}
          />
          <path
            d="M32 48 L44 60 L64 36"
            stroke="#1A6B4A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
            fill="none"
            strokeDasharray="60"
            strokeDashoffset={show ? 0 : 60}
            style={{ transition: "stroke-dashoffset 0.6s ease-out 0.8s" }}
          />
        </svg>
      </div>

      <div className={`transition-all duration-500 delay-1000 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <h2 className="mb-2">You're all set!</h2>
        <p className="text-muted-foreground text-[15px] mb-1">Your first nudges are being prepared.</p>
        <p className="text-muted-foreground text-[13px] mb-8">
          Pulse is analyzing your network and will surface your first contacts soon.
        </p>
        <Button variant="ghost" onClick={() => navigate("/")}>
          Go to Dashboard →
        </Button>
      </div>
    </div>
  );
}
