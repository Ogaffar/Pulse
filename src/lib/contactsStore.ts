import { z } from "zod";

export interface ImportedContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  source: "csv-linkedin" | "csv-google" | "csv-icloud" | "csv-outlook" | "csv-other" | "manual";
  addedAt: number;
}

const STORAGE_KEY = "pulse:imported-contacts";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(100, "Name too long"),
  email: z.string().trim().max(255).email("Invalid email").optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  role: z.string().trim().max(120).optional().or(z.literal("")),
});

export function loadContacts(): ImportedContact[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ImportedContact[]) : [];
  } catch {
    return [];
  }
}

export function saveContacts(contacts: ImportedContact[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

export function addContacts(newOnes: Omit<ImportedContact, "id" | "addedAt">[]): ImportedContact[] {
  const existing = loadContacts();
  const existingKeys = new Set(
    existing.map((c) => `${(c.email || "").toLowerCase()}|${c.name.toLowerCase()}`)
  );
  const deduped = newOnes
    .filter((c) => {
      const key = `${(c.email || "").toLowerCase()}|${c.name.toLowerCase()}`;
      if (existingKeys.has(key)) return false;
      existingKeys.add(key);
      return true;
    })
    .map<ImportedContact>((c) => ({
      ...c,
      id: crypto.randomUUID(),
      addedAt: Date.now(),
    }));
  const merged = [...deduped, ...existing];
  saveContacts(merged);
  return merged;
}

export function removeContact(id: string) {
  const next = loadContacts().filter((c) => c.id !== id);
  saveContacts(next);
  return next;
}

/* ---------- CSV parsing ---------- */

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") {
        out.push(cur);
        cur = "";
      } else cur += ch;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

export interface ParsedCsvResult {
  contacts: Omit<ImportedContact, "id" | "addedAt">[];
  skipped: number;
  total: number;
}

const FIELD_MAP: Record<string, keyof Omit<ImportedContact, "id" | "addedAt" | "source">> = {
  // name
  "name": "name",
  "full name": "name",
  "fullname": "name",
  "display name": "name",
  // first/last handled separately
  // email
  "email": "email",
  "email address": "email",
  "e-mail address": "email",
  "email 1 - value": "email",
  "primary email": "email",
  // phone
  "phone": "phone",
  "phone number": "phone",
  "mobile": "phone",
  "mobile phone": "phone",
  "phone 1 - value": "phone",
  // company
  "company": "company",
  "organization": "company",
  "organization 1 - name": "company",
  "organization name": "company",
  // role
  "title": "role",
  "job title": "role",
  "position": "role",
  "organization 1 - title": "role",
};

export function parseContactsCsv(
  text: string,
  source: ImportedContact["source"]
): ParsedCsvResult {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return { contacts: [], skipped: 0, total: 0 };

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/^\ufeff/, ""));
  const firstNameIdx = headers.indexOf("first name");
  const lastNameIdx = headers.indexOf("last name");

  const contacts: Omit<ImportedContact, "id" | "addedAt">[] = [];
  let skipped = 0;

  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i]);
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      const target = FIELD_MAP[h];
      if (target && cells[idx]) obj[target] = cells[idx];
    });

    if (!obj.name) {
      const fn = firstNameIdx >= 0 ? cells[firstNameIdx] || "" : "";
      const ln = lastNameIdx >= 0 ? cells[lastNameIdx] || "" : "";
      const composed = `${fn} ${ln}`.trim();
      if (composed) obj.name = composed;
    }

    const parsed = contactSchema.safeParse({
      name: obj.name || "",
      email: obj.email || "",
      phone: obj.phone || "",
      company: obj.company || "",
      role: obj.role || "",
    });
    if (!parsed.success) {
      skipped++;
      continue;
    }
    contacts.push({
      name: parsed.data.name,
      email: parsed.data.email || undefined,
      phone: parsed.data.phone || undefined,
      company: parsed.data.company || undefined,
      role: parsed.data.role || undefined,
      source,
    });
  }

  return { contacts, skipped, total: lines.length - 1 };
}
