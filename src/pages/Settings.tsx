import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { BottomNav } from "@/components/BottomNav";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { toast } from "sonner";
import {
  User, Bell, Clock, Shield, Lock, Users, Download, Trash2,
  BellRing, BellDot, Mail, Megaphone, Sun, Moon, Monitor,
  Send, Info, FileText, ChevronRight,
} from "lucide-react";

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn("w-11 h-6 rounded-full transition-colors duration-200 relative shrink-0", on ? "bg-primary" : "bg-muted-foreground/30")}
    >
      <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200", on ? "translate-x-6" : "translate-x-1")} />
    </button>
  );
}

function SettingsRow({ icon: Icon, label, right, onClick, danger }: {
  icon: typeof User;
  label: string;
  right?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 min-h-[52px] text-left active:bg-secondary transition-colors"
    >
      <Icon size={20} className={danger ? "text-error" : "text-muted-foreground"} />
      <span className={cn("flex-1 text-[15px] font-medium", danger ? "text-error" : "text-foreground")}>{label}</span>
      {right || <ChevronRight size={18} className="text-muted-foreground" />}
    </button>
  );
}

function SectionHeader({ title, sub, icon: Icon }: { title: string; sub?: string; icon?: typeof Lock }) {
  return (
    <div className="px-4 pt-6 pb-2">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={14} className="text-primary" />}
        <p className="text-caption text-muted-foreground">{title}</p>
      </div>
      {sub && <p className="text-[12px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [nudgeAlerts, setNudgeAlerts] = useState(true);
  const [followUpReminders, setFollowUpReminders] = useState(true);
  const [inboundAlerts, setInboundAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [appearance, setAppearance] = useState<"light" | "dark" | "system">("system");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-2xl mx-auto pb-24 md:pb-8">
          {/* Header */}
          <div className="px-5 pt-5 pb-2">
            <h1>Settings</h1>
          </div>

          {/* Profile card */}
          <div className="mx-5 mt-3 bg-card rounded-lg border border-border p-4 flex items-center gap-3">
            <Avatar size="lg" name="Alex Morrison" />
            <div className="flex-1 min-w-0">
              <p className="text-[16px] font-medium">Alex Morrison</p>
              <p className="text-[13px] text-muted-foreground">alex@example.com</p>
            </div>
            <button className="text-[13px] text-primary font-medium shrink-0">Edit profile →</button>
          </div>

          {/* Account */}
          <SectionHeader title="ACCOUNT" />
          <div className="bg-card mx-5 rounded-lg border border-border overflow-hidden divide-y divide-border">
            <SettingsRow icon={User} label="Edit profile" onClick={() => {}} />
            <SettingsRow icon={Bell} label="Notification preferences" onClick={() => {}} />
            <SettingsRow
              icon={Clock}
              label="Nudge frequency"
              right={<span className="text-[13px] text-muted-foreground mr-1">Once a week <ChevronRight size={16} className="inline text-muted-foreground" /></span>}
              onClick={() => {}}
            />
          </div>

          {/* Privacy & Data */}
          <SectionHeader title="PRIVACY & DATA" sub="Your controls, always" icon={Lock} />
          <div className="bg-card mx-5 rounded-lg border border-primary/15 overflow-hidden divide-y divide-border">
            <SettingsRow icon={Shield} label="Data sources & permissions" onClick={() => navigate("/settings/privacy/permissions")} />
            <SettingsRow icon={Users} label="Suppressed contacts" onClick={() => navigate("/settings/privacy/suppressed")} />
            <SettingsRow
              icon={Download}
              label="Download my data"
              onClick={() => toast.success("Preparing your data... you'll receive an email shortly.")}
              right={null as any}
            />
            <SettingsRow icon={Trash2} label="Delete my account" danger onClick={() => setShowDeleteConfirm(true)} />
          </div>

          {/* Notifications */}
          <SectionHeader title="NOTIFICATIONS" />
          <div className="bg-card mx-5 rounded-lg border border-border overflow-hidden divide-y divide-border">
            <SettingsRow icon={BellRing} label="Nudge alerts" right={<Toggle on={nudgeAlerts} onToggle={() => setNudgeAlerts(!nudgeAlerts)} />} />
            <SettingsRow icon={BellDot} label="Follow-up reminders" right={<Toggle on={followUpReminders} onToggle={() => setFollowUpReminders(!followUpReminders)} />} />
            <SettingsRow icon={Mail} label="Inbound message alerts" right={<Toggle on={inboundAlerts} onToggle={() => setInboundAlerts(!inboundAlerts)} />} />
            <SettingsRow icon={Megaphone} label="Marketing emails" right={<Toggle on={marketingEmails} onToggle={() => setMarketingEmails(!marketingEmails)} />} />
          </div>

          {/* App */}
          <SectionHeader title="APP" />
          <div className="bg-card mx-5 rounded-lg border border-border overflow-hidden divide-y divide-border">
            <div className="px-4 py-3.5 flex items-center gap-3">
              <Sun size={20} className="text-muted-foreground" />
              <span className="flex-1 text-[15px] font-medium">Appearance</span>
              <div className="flex bg-secondary rounded-md overflow-hidden">
                {(["light", "dark", "system"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setAppearance(mode)}
                    className={cn(
                      "px-3 py-1.5 text-[12px] font-medium capitalize transition-colors",
                      appearance === mode ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
            <SettingsRow icon={Send} label="Default send channel" right={<span className="text-[13px] text-muted-foreground mr-1">Email <ChevronRight size={16} className="inline text-muted-foreground" /></span>} onClick={() => {}} />
            <SettingsRow icon={Info} label="About Pulse" onClick={() => {}} />
          </div>

          {/* Legal links */}
          <div className="px-5 py-4 flex gap-4">
            <button className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Terms of Service</button>
            <button className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</button>
          </div>
        </div>

        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>

      {/* Delete account confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-card rounded-t-xl md:rounded-xl w-full max-w-sm p-6 pb-[max(24px,env(safe-area-inset-bottom))] animate-slide-up md:mx-4">
            <h3 className="text-[18px] font-medium mb-2">Delete your account?</h3>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
              This will permanently delete all your data, contacts, and relationship history. This action cannot be undone after 30 days.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 h-12 rounded-md bg-error text-white font-medium transition-colors hover:bg-error/90"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  toast.error("Account deletion scheduled. You can cancel within 30 days.");
                }}
              >
                Delete account
              </button>
              <button
                className="flex-1 h-12 rounded-md text-primary font-medium hover:bg-secondary transition-colors"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
