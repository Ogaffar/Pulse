import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, Users, Bell, User, ChevronRight, UserCog, Clock, BellRing,
  Shield, EyeOff, Download, Sun, Info, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const tabs = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Contacts", icon: Users, path: "/contacts" },
  { label: "Nudges", icon: Bell, path: "/nudges" },
  { label: "Profile", icon: User, path: "/profile" },
];

export default function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState(() => localStorage.getItem("pulse_name") || "Alex J.");
  const [role, setRole] = useState(() => localStorage.getItem("pulse_role") || "MBA Student · UNC Kenan-Flagler");
  const [editOpen, setEditOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [appearance, setAppearance] = useState<"Light" | "Dark" | "System">("Light");
  const [appearanceOpen, setAppearanceOpen] = useState(false);

  const goal = (() => {
    try {
      const arr = JSON.parse(localStorage.getItem("pulse_goals") || "[]");
      return arr[0] || "Land a new role or internship";
    } catch { return "Land a new role or internship"; }
  })();

  const initials = name.split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "AJ";

  const Row = ({ icon: Icon, label, right, onClick, danger }: any) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3"
      style={{
        height: 52,
        padding: "0 16px",
        borderBottom: "1px solid #F0EFE8",
        background: "transparent",
        cursor: "pointer",
        transition: "background 150ms",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAF8")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <Icon size={20} color={danger ? "#DC2626" : "#6B6B65"} />
      <span className="flex-1 text-left" style={{ fontSize: 15, fontWeight: 500, color: danger ? "#DC2626" : "#1A1A18" }}>{label}</span>
      {right}
      {!danger && <ChevronRight size={14} color="#A8A89E" />}
    </button>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <div style={{ fontSize: 11, color: "#6B6B65", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 16px 6px", background: "#FAFAF8" }}>
      {title}
    </div>
  );

  return (
    <div className="page-enter min-h-screen bg-[hsl(60,13%,97%)] pb-20" style={{ position: "relative", zIndex: 1 }}>
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-[28px] font-bold text-foreground">Profile</h1>
      </div>

      <div className="mx-4">
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0EFE8", padding: 24, marginBottom: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#065F46" }}>
            {initials}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 12, color: "#1A1A18" }}>{name}</h2>
          <p style={{ fontSize: 14, color: "#6B6B65", marginBottom: 12 }}>{role}</p>
          <span style={{ background: "#E8F5EE", color: "#1A6B4A", fontSize: 12, fontWeight: 500, borderRadius: 99, padding: "4px 12px", display: "inline-block" }}>
            🎯 {goal}
          </span>
        </div>

        <div className="flex gap-2" style={{ margin: "16px 0" }}>
          {[
            { v: "7", l: "Reconnections" },
            { v: "24", l: "Active contacts" },
            { v: "2", l: "Weeks streak" },
          ].map((s) => (
            <div key={s.l} style={{ flex: 1, background: "#F0F7F3", borderRadius: 12, padding: 14, textAlign: "center" }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#1A6B4A" }}>{s.v}</p>
              <p style={{ fontSize: 12, color: "#6B6B65" }}>{s.l}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0EFE8", overflow: "hidden" }}>
          <SectionHeader title="Account" />
          <Row icon={UserCog} label="Edit profile" onClick={() => setEditOpen(true)} />
          <Row icon={Clock} label="Nudge frequency" onClick={() => navigate("/settings")} />
          <Row icon={BellRing} label="Notification preferences" onClick={() => navigate("/settings")} />

          <SectionHeader title="Privacy & Data" />
          <Row icon={Shield} label="Data sources & permissions" onClick={() => navigate("/settings/privacy/permissions")} />
          <Row icon={EyeOff} label="Suppressed contacts" onClick={() => navigate("/settings/privacy/suppressed")} />
          <Row icon={Download} label="Download my data" onClick={() => toast.success("We'll email your data export within 24 hours.")} />

          <SectionHeader title="App" />
          <Row
            icon={Sun}
            label="Appearance"
            right={<span style={{ fontSize: 13, color: "#1A6B4A", marginRight: 4 }}>{appearance}</span>}
            onClick={() => setAppearanceOpen((v) => !v)}
          />
          {appearanceOpen && (
            <div style={{ display: "flex", gap: 6, padding: "10px 16px 14px", background: "#FAFAF8", borderBottom: "1px solid #F0EFE8" }}>
              {(["Light", "Dark", "System"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAppearance(opt)}
                  style={{
                    flex: 1,
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #E0EDE6",
                    background: appearance === opt ? "#1A6B4A" : "#fff",
                    color: appearance === opt ? "#fff" : "#1A1A18",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
          <Row icon={Info} label="About Pulse" onClick={() => setAboutOpen(true)} />
          <Row
            icon={LogOut}
            label="Sign out"
            danger
            onClick={() => { localStorage.clear(); navigate("/"); }}
          />
        </div>
      </div>

      {editOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white w-full max-w-sm" style={{ borderRadius: 20, padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#1A1A18" }}>Edit profile</h2>
            <label style={{ display: "block", fontSize: 12, color: "#6B6B65", marginBottom: 5 }}>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", height: 44, border: "1.5px solid rgba(26,26,24,0.12)", borderRadius: 10, padding: "0 12px", fontSize: 14, marginBottom: 14, boxSizing: "border-box" }}
            />
            <label style={{ display: "block", fontSize: 12, color: "#6B6B65", marginBottom: 5 }}>Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: "100%", height: 44, border: "1.5px solid rgba(26,26,24,0.12)", borderRadius: 10, padding: "0 12px", fontSize: 14, marginBottom: 20, boxSizing: "border-box" }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setEditOpen(false)}
                style={{ flex: 1, height: 44, borderRadius: 10, background: "transparent", border: "1px solid #E0EDE6", color: "#6B6B65", fontWeight: 500, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.setItem("pulse_name", name);
                  localStorage.setItem("pulse_role", role);
                  setEditOpen(false);
                  toast.success("Profile updated.");
                }}
                style={{ flex: 1, height: 44, borderRadius: 10, background: "#1A6B4A", border: "none", color: "#fff", fontWeight: 600, cursor: "pointer" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {aboutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setAboutOpen(false)}>
          <div className="bg-white w-full max-w-sm text-center" style={{ borderRadius: 20, padding: 28 }} onClick={(e) => e.stopPropagation()}>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#1A6B4A", marginBottom: 12 }}>⚡ Pulse</p>
            <p style={{ fontSize: 13, color: "#6B6B65", lineHeight: 1.6 }}>
              Pulse v1.0 · Built for MBA 753A Product Management · UNC Kenan-Flagler · April 2026
            </p>
            <button
              onClick={() => setAboutOpen(false)}
              style={{ marginTop: 18, width: "100%", height: 44, borderRadius: 10, background: "#1A6B4A", border: "none", color: "#fff", fontWeight: 600, cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-[hsl(100,18%,91%)] flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = tab.path === "/profile";
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
            >
              <tab.icon size={22} strokeWidth={isActive ? 2.2 : 1.6} className={isActive ? "text-[hsl(152,62%,26%)]" : "text-[hsl(50,8%,64%)]"} />
              <span className={cn("text-[10px] font-medium", isActive ? "text-[hsl(152,62%,26%)]" : "text-[hsl(50,8%,64%)]")}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
