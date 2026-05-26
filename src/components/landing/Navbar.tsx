import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Activity, Menu, X } from "lucide-react";

type LinkDef = {
  label: string;
  isActive: (pathname: string) => boolean;
  onClick: (e: React.MouseEvent | React.TouchEvent) => void;
};

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isAuthed = typeof window !== "undefined" && localStorage.getItem("pulse_authed") === "true";
  const logoDestination = isAuthed ? "/dashboard" : "/";

  const isAppRoute = ["/dashboard", "/contacts", "/draft", "/sent", "/nudges", "/profile", "/settings"].some((p) =>
    location.pathname.startsWith(p)
  );

  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.scrollBy(0, -72);
    }
  };

  const handleHowItWorksClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      scrollToHowItWorks();
    } else {
      navigate("/", { state: { scrollTo: "how-it-works" } });
    }
  };

  const marketingLinks: LinkDef[] = [
    {
      label: "How it works",
      isActive: (p) => p === "/",
      onClick: handleHowItWorksClick,
    },
    {
      label: "Why Pulse",
      isActive: (p) => p === "/why-pulse",
      onClick: () => navigate("/why-pulse"),
    },
    {
      label: "Pricing",
      isActive: (p) => p === "/pricing",
      onClick: () => navigate("/pricing"),
    },
  ];

  const appLinks: LinkDef[] = [
    {
      label: "Dashboard",
      isActive: (p) => p.startsWith("/dashboard"),
      onClick: () => navigate("/dashboard"),
    },
    {
      label: "Contacts",
      isActive: (p) => p.startsWith("/contacts"),
      onClick: () => navigate("/contacts"),
    },
    {
      label: "My Nudges",
      isActive: () => false,
      onClick: () => navigate("/dashboard"),
    },
  ];

  const centerLinks = isAppRoute ? appLinks : marketingLinks;

  const signInActive = location.pathname === "/signin";
  const signUpActive = location.pathname === "/signup";

  const linkStyle = (active: boolean): React.CSSProperties => ({
    fontWeight: active ? 600 : 500,
    color: active ? "#1A6B4A" : "#4A4A44",
    borderBottom: active ? "2px solid #1A6B4A" : "1.5px solid transparent",
    paddingBottom: 2,
  });

  return (
    <>
      <nav
        className="h-16"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          background: "rgba(250,250,248,0.92)",
          borderBottom: "1px solid rgba(26,26,24,0.07)",
          transition: "all 200ms ease",
        }}
      >
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-5 md:px-8">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(logoDestination)}
          >
            <Activity size={22} style={{ color: "#1A6B4A" }} strokeWidth={2.5} />
            <span style={{ fontSize: 22, fontWeight: 800, color: "#1A6B4A" }}>
              Pulse
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {centerLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.onClick}
                className="hidden md:inline-flex px-3 py-1.5 text-sm transition-all duration-150 bg-transparent border-none cursor-pointer"
                style={linkStyle(link.isActive(location.pathname))}
              >
                {link.label}
              </button>
            ))}

            {!isAuthed && (
              <button
                onClick={() => navigate("/signin")}
                className="hidden md:inline-flex px-3 py-1.5 text-sm transition-all duration-150 bg-transparent border-none cursor-pointer"
                style={linkStyle(signInActive)}
              >
                Sign in
              </button>
            )}

            {isAuthed ? (
              <button
                onClick={() => navigate("/dashboard")}
                style={{
                  background: "#1A6B4A",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Go to dashboard →
              </button>
            ) : (
              <button
                onClick={() => navigate("/signup")}
                style={{
                  background: "#1A6B4A",
                  color: "#fff",
                  border: signUpActive ? "2px solid #0F4A33" : "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Get Early Access
              </button>
            )}

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center bg-transparent border-none cursor-pointer"
              style={{ width: 36, height: 36, color: "#1A1A18" }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            className="md:hidden"
            style={{
              background: "#fff",
              borderBottom: "1px solid rgba(26,26,24,0.08)",
            }}
          >
            <div className="max-w-6xl mx-auto px-5">
              {centerLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={(e) => {
                    link.onClick(e);
                    setMobileOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    height: 48,
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(26,26,24,0.05)",
                    fontSize: 15,
                    fontWeight: link.isActive(location.pathname) ? 600 : 500,
                    color: link.isActive(location.pathname) ? "#1A6B4A" : "#1A1A18",
                    cursor: "pointer",
                  }}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => {
                  navigate("/signin");
                  setMobileOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  height: 48,
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  fontSize: 15,
                  fontWeight: signInActive ? 600 : 500,
                  color: signInActive ? "#1A6B4A" : "#1A1A18",
                  cursor: "pointer",
                }}
              >
                Sign in
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
