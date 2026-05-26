export type Warmth = "active" | "cooling" | "dormant";

export interface TagDef {
  id: string;
  label: string;
  color: string;
  bg: string;
}

export const AVAILABLE_TAGS: TagDef[] = [
  { id: "mentor", label: "Mentor", color: "#7C3AED", bg: "#F5F3FF" },
  { id: "recruiter", label: "Recruiter", color: "#1D4ED8", bg: "#EFF6FF" },
  { id: "classmate", label: "Classmate", color: "#065F46", bg: "#E8F5EE" },
  { id: "colleague", label: "Colleague", color: "#1A6B4A", bg: "#F0FDF4" },
  { id: "investor", label: "Investor", color: "#9D174D", bg: "#FCE7F3" },
  { id: "founder", label: "Founder", color: "#92400E", bg: "#FEF3C7" },
  { id: "advisor", label: "Advisor", color: "#1E3A8A", bg: "#DBEAFE" },
  { id: "client", label: "Client", color: "#166534", bg: "#DCFCE7" },
  { id: "tier-1", label: "Tier 1", color: "#1A6B4A", bg: "#E8F5EE" },
  { id: "tier-2", label: "Tier 2", color: "#6B6B65", bg: "#F2F1EC" },
  { id: "personal", label: "Personal", color: "#5B21B6", bg: "#EDE9FE" },
];

export interface AppContact {
  id: string;
  name: string;
  initials: string;
  role: string;
  company: string;
  warmth: Warmth;
  lastContact: string;
  avatarBg: string;
  avatarColor: string;
  nudgeReason: string;
  draftProfessional: string;
  draftWarm: string;
  draftCasual: string;
  tags: string[];
}

const appContacts: AppContact[] = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    initials: "SC",
    role: "Product Manager",
    company: "Stripe",
    warmth: "cooling",
    lastContact: "47 days ago",
    avatarBg: "#FEF3C7",
    avatarColor: "#92400E",
    nudgeReason:
      "You haven't connected in 47 days. She just joined Stripe as a PM — a natural moment to congratulate and reconnect.",
    draftProfessional:
      "Hi Sarah, I hope you're doing well! I saw you recently joined Stripe as a PM — that's a fantastic move. I've been thinking about our conversation at the career fair last spring and wanted to reconnect. Would love to hear how the transition has been going. Would you be open to a quick catch-up?",
    draftWarm:
      "Hey Sarah! Just saw you joined Stripe — congrats, that's so exciting! It's been way too long since we properly caught up. I'd love to hear all about the new role. Coffee chat soon?",
    draftCasual:
      "Sarah! Saw the Stripe news — huge congrats! We should catch up soon, it's been ages. Let me know if you're up for it!",
    tags: ["recruiter", "tier-1"],
  },
  {
    id: "marcus-t",
    name: "Marcus T.",
    initials: "MT",
    role: "Finance Manager",
    company: "Deloitte",
    warmth: "dormant",
    lastContact: "62 days ago",
    avatarBg: "#DBEAFE",
    avatarColor: "#1E3A8A",
    nudgeReason:
      "No contact in 62 days. Marcus relocated recently — checking in after a move is a natural and low-pressure reason to reconnect.",
    draftProfessional:
      "Hi Marcus, I hope the relocation has been going smoothly! It has been a while since we caught up and I wanted to reach out. Would love to hear how things are going at Deloitte. Are you open to a quick call sometime this month?",
    draftWarm:
      "Hey Marcus! Been thinking about you since the move — hope you're settling in well! Would love to catch up soon and hear how everything is going.",
    draftCasual:
      "Marcus! Hope the new city is treating you well. Let's catch up soon — it's been too long!",
    tags: ["colleague", "tier-2"],
  },
  {
    id: "james-kim",
    name: "James Kim",
    initials: "JK",
    role: "Engineering Lead",
    company: "Google",
    warmth: "active",
    lastContact: "8 days ago",
    avatarBg: "#EDE9FE",
    avatarColor: "#5B21B6",
    nudgeReason:
      "You spoke 8 days ago — relationship is warm. James recently posted about a new project launch at Google, a good reason to follow up.",
    draftProfessional:
      "Hi James, great catching up recently! I saw your post about the new project launch at Google — sounds like an exciting initiative. Would love to hear more about it when you have a moment.",
    draftWarm:
      "James! Congrats on the project launch — saw the post and it looks really exciting. Let's find time to catch up properly soon!",
    draftCasual:
      "James! That Google project looks amazing — congrats! We should grab a call soon.",
    tags: ["classmate", "tier-1"],
  },
  {
    id: "lisa-park",
    name: "Lisa Park",
    initials: "LP",
    role: "Recruiter",
    company: "Meta",
    warmth: "active",
    lastContact: "12 days ago",
    avatarBg: "#D1FAE5",
    avatarColor: "#065F46",
    nudgeReason:
      "Lisa reached out 12 days ago and you haven't fully followed up. Recruiters move fast — a timely reply keeps the relationship warm.",
    draftProfessional:
      "Hi Lisa, apologies for the delayed reply! Thank you for reaching out. I would love to reconnect and hear about what you're working on at Meta. Would a quick call this week work for you?",
    draftWarm:
      "Lisa! So sorry for the slow reply — things have been hectic. Would love to catch up and hear what's new at Meta!",
    draftCasual:
      "Lisa! Sorry for the late reply. Let's catch up soon — would love to hear what's going on at Meta.",
    tags: ["recruiter", "tier-1"],
  },
  {
    id: "diana-rodriguez",
    name: "Diana Rodriguez",
    initials: "DR",
    role: "VP Strategy",
    company: "Salesforce",
    warmth: "active",
    lastContact: "5 days ago",
    avatarBg: "#FCE7F3",
    avatarColor: "#9D174D",
    nudgeReason:
      "You connected 5 days ago. Diana is a senior contact worth nurturing — a brief follow-up while the conversation is fresh keeps momentum going.",
    draftProfessional:
      "Hi Diana, it was great speaking with you recently. I wanted to follow up and say I really appreciated the insights you shared about strategy at Salesforce. I would love to stay in touch.",
    draftWarm:
      "Diana! So good connecting recently. Really valued our conversation — let's definitely stay in touch!",
    draftCasual: "Diana! Great talking recently. Let's keep in touch!",
    tags: ["mentor", "tier-1"],
  },
];

export default appContacts;

export function getSuppressedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem("pulse_suppressed") || "[]");
  } catch {
    return [];
  }
}

export function getVisibleContacts(): AppContact[] {
  const suppressed = getSuppressedIds();
  return appContacts.filter((c) => !suppressed.includes(c.id));
}

export function warmthMeta(w: Warmth) {
  if (w === "active") return { dot: "#16A34A", bg: "#DCFCE7", text: "#166534", label: "Active" };
  if (w === "cooling") return { dot: "#D97706", bg: "#FEF3C7", text: "#92400E", label: "Cooling" };
  return { dot: "#DC2626", bg: "#FEE2E2", text: "#991B1B", label: "Dormant" };
}

// ===== Tag helpers =====

const CUSTOM_TAGS_KEY = "pulse_custom_tags";
const CONTACT_TAGS_KEY = "pulse_contact_tags";

export function getCustomTags(): TagDef[] {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_TAGS_KEY) || "[]");
  } catch { return []; }
}

export function saveCustomTag(tag: TagDef) {
  const existing = getCustomTags();
  if ([...AVAILABLE_TAGS, ...existing].some((t) => t.id === tag.id)) return;
  localStorage.setItem(CUSTOM_TAGS_KEY, JSON.stringify([...existing, tag]));
}

export function getAllTags(): TagDef[] {
  return [...AVAILABLE_TAGS, ...getCustomTags()];
}

export function tagMeta(id: string): TagDef {
  return getAllTags().find((t) => t.id === id) || { id, label: id, color: "#1A6B4A", bg: "#E8F5EE" };
}

export function getStoredContactTags(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem(CONTACT_TAGS_KEY) || "{}");
  } catch { return {}; }
}

export function setContactTags(contactId: string, tags: string[]) {
  const all = getStoredContactTags();
  all[contactId] = tags;
  localStorage.setItem(CONTACT_TAGS_KEY, JSON.stringify(all));
}

export function getContactTags(contact: { id: string; tags?: string[] }): string[] {
  const stored = getStoredContactTags();
  if (stored[contact.id]) return stored[contact.id];
  return contact.tags || [];
}

