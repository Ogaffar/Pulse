export interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  tier: "tier1" | "tier2" | "personal";
  warmth: "active" | "cooling" | "dormant";
  daysAgo: number;
  lastContactDate: string;
  howMet?: string;
  sharedHistory?: string;
  keyFacts?: string;
  notes?: string;
  tags: string[];
  suppressed: boolean;
  avatarUrl?: string;
  timeline: TimelineEvent[];
  milestone?: Milestone;
}

export interface TimelineEvent {
  id: string;
  platform: "linkedin" | "gmail" | "imessage" | "whatsapp" | "in-person" | "phone";
  description: string;
  date: string;
}

export interface Milestone {
  emoji: string;
  text: string;
  daysUntil: number;
}

export const sampleContacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Product Lead",
    company: "Stripe",
    tier: "tier1",
    warmth: "active",
    daysAgo: 3,
    lastContactDate: "January 10, 2026",
    howMet: "Stanford MBA orientation, Fall 2024",
    sharedHistory: "Worked on capstone project together",
    keyFacts: "Moving to SF in March. Interested in fintech.",
    notes: "Super sharp — great advisor on product strategy.",
    tags: ["Mentor", "Stanford MBA", "Fintech"],
    suppressed: false,
    timeline: [
      { id: "t1", platform: "linkedin", description: "Commented on your post", date: "Jan 10, 2026" },
      { id: "t2", platform: "gmail", description: "Email conversation", date: "Jan 5, 2026" },
      { id: "t3", platform: "in-person", description: "Coffee chat", date: "Dec 18, 2025" },
      { id: "t4", platform: "linkedin", description: "Connection accepted", date: "Sep 12, 2024" },
    ],
    milestone: {
      emoji: "🎉",
      text: "Work anniversary in 3 days — they've been at Stripe for 2 years. Good time to reach out?",
      daysUntil: 3,
    },
  },
  {
    id: "2",
    name: "Mike Torres",
    role: "Product Manager",
    company: "Stripe",
    tier: "tier1",
    warmth: "cooling",
    daysAgo: 47,
    lastContactDate: "November 14, 2025",
    howMet: "HBS recruiting event",
    sharedHistory: "",
    keyFacts: "Previously at JP Morgan. Runs the payments API team.",
    notes: "",
    tags: ["Recruiter", "Fintech"],
    suppressed: false,
    timeline: [
      { id: "t5", platform: "gmail", description: "Thank-you email sent", date: "Nov 14, 2025" },
      { id: "t6", platform: "linkedin", description: "LinkedIn message", date: "Nov 10, 2025" },
      { id: "t7", platform: "in-person", description: "Met at recruiting event", date: "Oct 22, 2025" },
    ],
    milestone: undefined,
  },
  {
    id: "3",
    name: "Adaeze Okafor",
    role: "Strategy Lead",
    company: "McKinsey",
    tier: "tier1",
    warmth: "cooling",
    daysAgo: 52,
    lastContactDate: "November 8, 2025",
    tags: ["Former colleague", "Consulting"],
    suppressed: false,
    timeline: [
      { id: "t8", platform: "whatsapp", description: "WhatsApp conversation", date: "Nov 8, 2025" },
      { id: "t9", platform: "in-person", description: "Dinner in Lagos", date: "Aug 15, 2025" },
    ],
    milestone: undefined,
  },
  {
    id: "4",
    name: "Jason Liu",
    role: "Engineering Manager",
    company: "Google",
    tier: "tier2",
    warmth: "dormant",
    daysAgo: 65,
    lastContactDate: "October 26, 2025",
    tags: ["Tech", "Bay Area"],
    suppressed: false,
    timeline: [
      { id: "t10", platform: "linkedin", description: "LinkedIn connection", date: "Oct 26, 2025" },
    ],
    milestone: undefined,
  },
  {
    id: "5",
    name: "Rachel Kim",
    role: "Founder",
    company: "Loom",
    tier: "tier1",
    warmth: "dormant",
    daysAgo: 78,
    lastContactDate: "October 13, 2025",
    tags: ["Founder", "Mentor"],
    suppressed: false,
    timeline: [
      { id: "t11", platform: "gmail", description: "Intro email from mutual friend", date: "Oct 13, 2025" },
      { id: "t12", platform: "phone", description: "Phone call", date: "Oct 5, 2025" },
    ],
    milestone: undefined,
  },
  {
    id: "6",
    name: "Tomás Rivera",
    role: "VP Operations",
    company: "Figma",
    tier: "tier2",
    warmth: "dormant",
    daysAgo: 90,
    lastContactDate: "September 30, 2025",
    tags: ["Design", "Operations"],
    suppressed: false,
    timeline: [
      { id: "t13", platform: "linkedin", description: "LinkedIn message", date: "Sep 30, 2025" },
    ],
    milestone: undefined,
  },
  {
    id: "7",
    name: "Priya Patel",
    role: "Data Scientist",
    company: "Meta",
    tier: "personal",
    warmth: "active",
    daysAgo: 5,
    lastContactDate: "January 8, 2026",
    howMet: "College roommate",
    tags: ["Personal", "Close friend"],
    suppressed: false,
    timeline: [
      { id: "t14", platform: "imessage", description: "iMessage conversation", date: "Jan 8, 2026" },
      { id: "t15", platform: "in-person", description: "Brunch", date: "Dec 28, 2025" },
    ],
    milestone: undefined,
  },
  {
    id: "8",
    name: "Carlos Hernandez",
    role: "Associate",
    company: "Bain",
    tier: "tier2",
    warmth: "active",
    daysAgo: 10,
    lastContactDate: "January 3, 2026",
    tags: ["Consulting", "MBA peer"],
    suppressed: false,
    timeline: [
      { id: "t16", platform: "gmail", description: "Email thread", date: "Jan 3, 2026" },
    ],
    milestone: undefined,
  },
];
