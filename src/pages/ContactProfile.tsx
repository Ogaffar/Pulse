import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleContacts } from "@/data/contacts";
import { toast } from "sonner";
import {
  ChevronLeft, MoreHorizontal, MessageCircle, Bell, Phone, EyeOff,
  Pencil, Linkedin, Mail, MessageSquare, Coffee, PhoneCall, X, Plus,
} from "lucide-react";

const warmthRing: Record<string, string> = { active: "ring-success", cooling: "ring-warning", dormant: "ring-accent-coral" };
const warmthBadge: Record<string, { variant: "cool" | "warm" | "cold"; label: string }> = {
  active: { variant: "cool", label: "Actively warm ●" },
  cooling: { variant: "warm", label: "Cooling ●" },
  dormant: { variant: "cold", label: "Dormant ●" },
};

const platformIcon: Record<string, typeof Linkedin> = {
  linkedin: Linkedin,
  gmail: Mail,
  imessage: MessageSquare,
  whatsapp: MessageSquare,
  "in-person": Coffee,
  phone: PhoneCall,
};

const quickActions = [
  { label: "Message", icon: MessageCircle, color: "text-primary", bg: "bg-primary/10" },
  { label: "Nudge now", icon: Bell, color: "text-warning", bg: "bg-warning/10" },
  { label: "Call", icon: Phone, color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10" },
  { label: "Suppress", icon: EyeOff, color: "text-accent-coral", bg: "bg-accent-coral/10" },
];

const commonTags = ["Mentor", "Recruiter", "Former colleague", "MBA peer", "Investor", "Friend", "Advisor", "Co-founder"];

export default function ContactProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contact = sampleContacts.find((c) => c.id === id);
  const [showMore, setShowMore] = useState(false);
  const [showSuppressSheet, setShowSuppressSheet] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [tags, setTags] = useState<string[]>(contact?.tags ?? []);
  const [suppressed, setSuppressed] = useState(contact?.suppressed ?? false);

  if (!contact) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Contact not found.</p>
      </div>
    );
  }

  const wb = warmthBadge[contact.warmth];
  const visibleTimeline = showMore ? contact.timeline : contact.timeline.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-border bg-card relative">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
          <ChevronLeft size={22} />
        </button>
        <h4 className="absolute left-1/2 -translate-x-1/2">Contact</h4>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
            <MoreHorizontal size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-elevated py-1 w-44 z-50">
              {["Edit", "Suppress contact", "Delete"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setShowMenu(false);
                    if (item === "Suppress contact") setShowSuppressSheet(true);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-[14px] hover:bg-secondary transition-colors",
                    item === "Delete" && "text-error"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pb-12">
        {/* Hero */}
        <div className="text-center pt-6 pb-4">
          <div className={cn("inline-flex rounded-full ring-[3px] p-1 mb-3", warmthRing[contact.warmth])}>
            <Avatar size="xl" name={contact.name} />
          </div>
          <h1 className="text-[28px] font-semibold">{contact.name}</h1>
          <p className="text-[15px] text-muted-foreground mt-0.5">{contact.role} · {contact.company}</p>
          <Badge variant={wb.variant} className="mt-2 text-[12px]">{wb.label}</Badge>
          <p className="text-[13px] text-muted-foreground mt-2">
            Last contact: {contact.lastContactDate} ({contact.daysAgo} days ago)
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex justify-center gap-5 py-4">
          {quickActions.map((a) => (
            <button
              key={a.label}
              className="flex flex-col items-center gap-1"
              onClick={() => {
                if (a.label === "Suppress") setShowSuppressSheet(true);
              }}
            >
              <div className={cn("w-[52px] h-[52px] rounded-full bg-secondary flex items-center justify-center", a.bg)}>
                <a.icon size={20} className={a.color} />
              </div>
              <span className="text-caption text-muted-foreground">{a.label}</span>
            </button>
          ))}
        </div>

        {/* Relationship Context Card */}
        <div className="bg-card rounded-lg border border-border p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4>Relationship context</h4>
            <button className="text-[13px] text-primary font-medium">Edit</button>
          </div>
          <div className="space-y-3">
            {[
              { label: "How you met", value: contact.howMet },
              { label: "Shared history", value: contact.sharedHistory },
              { label: "Key facts", value: contact.keyFacts },
              { label: "Notes", value: contact.notes },
            ].map((field) => (
              <div key={field.label} className="group">
                <p className="text-[12px] text-muted-foreground font-medium mb-0.5">{field.label}</p>
                <div className="flex items-start gap-2">
                  <p className={cn("text-[14px] flex-1", field.value ? "text-foreground" : "text-muted-foreground/50 italic")}>
                    {field.value || `Add ${field.label.toLowerCase()}`}
                  </p>
                  <Pencil size={14} className="text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-opacity shrink-0 mt-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone */}
        {contact.milestone && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-4">
            <p className="text-[14px] text-foreground leading-relaxed mb-3">
              {contact.milestone.emoji} {contact.milestone.text}
            </p>
            <Button size="sm">Draft a message →</Button>
          </div>
        )}

        {/* Timeline */}
        <div className="mb-4">
          <h4 className="mb-3">Interaction history</h4>
          {contact.timeline.length === 0 ? (
            <p className="text-[13px] text-muted-foreground bg-secondary rounded-lg p-4">
              No recorded interactions yet. Grant platform access to track automatically.
            </p>
          ) : (
            <div className="relative pl-6">
              <div className="absolute left-2 top-1 bottom-1 w-px bg-primary-light" />
              <div className="space-y-3">
                {visibleTimeline.map((event) => {
                  const Icon = platformIcon[event.platform] || Mail;
                  return (
                    <div key={event.id} className="relative flex items-start gap-3">
                      <div className="absolute -left-[18px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
                      <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center shrink-0">
                        <Icon size={14} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 flex items-center justify-between min-w-0">
                        <p className="text-[14px] text-foreground">{event.description}</p>
                        <p className="text-caption text-muted-foreground shrink-0 ml-2">{event.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {contact.timeline.length > 5 && !showMore && (
                <button onClick={() => setShowMore(true)} className="text-[13px] text-primary font-medium mt-3 ml-4">
                  Load more
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="mb-4">
          <h4 className="mb-3">Persona tags</h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setTags(tags.filter((t) => t !== tag))}
                className="inline-flex items-center gap-1 bg-primary-light text-primary rounded-sm px-2.5 h-[26px] text-[12px] font-medium hover:bg-primary/20 transition-colors"
              >
                {tag} <X size={12} />
              </button>
            ))}
            <div className="relative">
              <button
                onClick={() => setShowTagInput(!showTagInput)}
                className="inline-flex items-center gap-1 border border-dashed border-border rounded-sm px-2.5 h-[26px] text-[12px] font-medium text-muted-foreground hover:border-primary/40 transition-colors"
              >
                <Plus size={12} /> Add tag
              </button>
              {showTagInput && (
                <div className="absolute left-0 top-full mt-1 bg-card border border-border rounded-lg shadow-elevated py-1 w-48 z-50">
                  {commonTags
                    .filter((t) => !tags.includes(t))
                    .slice(0, 6)
                    .map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setTags([...tags, tag]);
                          setShowTagInput(false);
                        }}
                        className="w-full text-left px-3 py-2 text-[13px] hover:bg-secondary transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Suppression */}
        <div className="bg-[#FEF2F2] rounded-lg p-4 border border-error/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-foreground">Remove from Pulse suggestions</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">Hide from nudges and dashboard</p>
            </div>
            <button
              onClick={() => {
                if (!suppressed) setShowSuppressSheet(true);
                else {
                  setSuppressed(false);
                  toast.success("Contact restored.");
                }
              }}
              className={cn(
                "w-11 h-6 rounded-full transition-colors duration-200 relative",
                suppressed ? "bg-error" : "bg-muted-foreground/30"
              )}
            >
              <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200", suppressed ? "translate-x-6" : "translate-x-1")} />
            </button>
          </div>
        </div>
      </div>

      {/* Suppress Sheet */}
      {showSuppressSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSuppressSheet(false)} />
          <div className="relative bg-card rounded-t-xl w-full max-w-lg p-6 pb-[max(24px,env(safe-area-inset-bottom))] animate-slide-up">
            <h3 className="text-[18px] font-medium mb-2">Hide {contact.name} from nudges?</h3>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
              They'll remain in your contacts but will never appear in nudges, the dashboard, or AI suggestions. You can restore them anytime from Settings → Suppressed Contacts.
            </p>
            <div className="flex gap-3">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  setSuppressed(true);
                  setShowSuppressSheet(false);
                  toast.success("Contact suppressed. Find them in Settings → Suppressed Contacts.");
                }}
              >
                Suppress contact
              </Button>
              <Button variant="ghost" className="flex-1" onClick={() => setShowSuppressSheet(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
