import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, Home, Users, Bell, User, Plus, X, UploadCloud, UserPlus, Briefcase, ArrowLeft, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import appContacts, {
  getSuppressedIds,
  warmthMeta,
  tagMeta,
  getContactTags,
  setContactTags,
  type AppContact,
} from "@/data/appContacts";

const WARMTH_PILLS = ["All", "Active", "Cooling", "Dormant"];
const TAG_FILTER_IDS = ["mentor", "recruiter", "classmate", "colleague", "tier-1", "tier-2", "personal"];

// Reusable tag pill
function TagPill({ tagId, onRemove }: { tagId: string; onRemove?: () => void }) {
  const t = tagMeta(tagId);
  return (
    <span
      style={{
        background: t.bg,
        color: t.color,
        border: `1px solid ${t.color}40`,
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 10px",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {t.label}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          aria-label={`Remove ${t.label}`}
          style={{ marginLeft: 4, color: t.color, fontSize: 12, lineHeight: 1, cursor: "pointer", background: "transparent" }}
        >
          ×
        </button>
      )}
    </span>
  );
}

const tabs = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Contacts", icon: Users, path: "/contacts" },
  { label: "Nudges", icon: Bell, path: "/nudges" },
  { label: "Profile", icon: User, path: "/profile" },
];

const PULSE_FIELDS = ["First Name", "Last Name", "Email", "Company", "Role", "Notes"] as const;
type PulseField = typeof PULSE_FIELDS[number];

interface ImportedLocalContact {
  id: string;
  name: string;
  initials: string;
  role: string;
  company: string;
  email: string;
  notes: string;
  warmth: "active" | "cooling" | "dormant";
  lastContact: string;
  avatarBg: string;
  avatarColor: string;
  isImported: true;
}

function loadStoredImports(): ImportedLocalContact[] {
  try {
    return JSON.parse(localStorage.getItem("pulse_contacts") || "[]");
  } catch {
    return [];
  }
}

function autoMatchColumn(field: PulseField, headers: string[]): string {
  const h = headers.map((x) => x.toLowerCase());
  const find = (preds: ((s: string) => boolean)[]) => {
    for (const p of preds) {
      const i = h.findIndex(p);
      if (i >= 0) return headers[i];
    }
    return "";
  };
  switch (field) {
    case "First Name":
      return find([(s) => s.includes("first"), (s) => s.includes("fname"), (s) => s === "name"]);
    case "Last Name":
      return find([(s) => s.includes("last"), (s) => s.includes("lname"), (s) => s.includes("surname")]);
    case "Email":
      return find([(s) => s.includes("email") || s.includes("e-mail")]);
    case "Company":
      return find([(s) => s.includes("company") || s.includes("org")]);
    case "Role":
      return find([(s) => s.includes("role") || s.includes("title") || s.includes("position") || s.includes("job")]);
    case "Notes":
      return find([(s) => s.includes("note") || s.includes("memo")]);
  }
}

export default function Contacts() {
  const navigate = useNavigate();
  const [activeWarmth, setActiveWarmth] = useState<string>(() => {
    try { return sessionStorage.getItem("contacts_warmth_filter") || "All"; } catch { return "All"; }
  });
  const [activeTag, setActiveTag] = useState<string>(() => {
    try { return sessionStorage.getItem("contacts_tag_filter") || ""; } catch { return ""; }
  });
  // tag-state version: bumps when a tag changes so cards re-render
  const [tagsVersion, setTagsVersion] = useState(0);
  const [search, setSearch] = useState("");
  const [fabMenuOpen, setFabMenuOpen] = useState(false);

  // Imported contacts from localStorage
  const [stored, setStored] = useState<ImportedLocalContact[]>(() => loadStoredImports());
  const refreshStored = () => setStored(loadStoredImports());

  // ===== CSV import modal state =====
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<{ headers: string[]; rows: Record<string, string>[] } | null>(null);
  const [columnMap, setColumnMap] = useState<Record<PulseField, string>>({
    "First Name": "", "Last Name": "", Email: "", Company: "", Role: "", Notes: "",
  });
  const [importedCount, setImportedCount] = useState(0);
  const [lastImportedIds, setLastImportedIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openModal = () => {
    setFabMenuOpen(false);
    resetModal();
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setTimeout(resetModal, 250);
  };
  const resetModal = () => {
    setStep(1);
    setDragging(false);
    setSelectedFile(null);
    setError(null);
    setLoading(false);
    setParsedData(null);
    setImportedCount(0);
    setColumnMap({ "First Name": "", "Last Name": "", Email: "", Company: "", Role: "", Notes: "" });
  };

  // Auto-match columns when parsed data lands
  useEffect(() => {
    if (parsedData) {
      const next = { ...columnMap };
      PULSE_FIELDS.forEach((f) => { next[f] = autoMatchColumn(f, parsedData.headers); });
      setColumnMap(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedData]);

  const downloadTemplate = () => {
    const csvContent = `First Name,Last Name,Email,Company,Role,LinkedIn URL,Notes
Sarah,Chen,sarah.chen@email.com,Stripe,Product Manager,linkedin.com/in/sarahchen,Met at career fair
Marcus,Thompson,marcus.t@email.com,Deloitte,Finance Manager,linkedin.com/in/marcust,Former colleague
James,Kim,james.kim@email.com,Google,Engineering Lead,linkedin.com/in/jameskim,MBA classmate`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pulse-contacts-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv") && file.type !== "text/csv" && file.type !== "application/csv") {
      setError("Please upload a CSV file. Other file types are not supported.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.");
      return;
    }
    setError(null);
    setSelectedFile(file);
    parseCSV(file);
  };

  const parseCSV = (file: File) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = String(e.target?.result || "");
        const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
        if (lines.length < 2) {
          setError("This file looks empty. Add at least one contact row and try again.");
          setLoading(false);
          return;
        }
        const splitLine = (line: string) => {
          const values: string[] = [];
          let current = "";
          let inQuotes = false;
          for (const char of line) {
            if (char === '"') inQuotes = !inQuotes;
            else if (char === "," && !inQuotes) { values.push(current.trim()); current = ""; }
            else current += char;
          }
          values.push(current.trim());
          return values.map((v) => v.replace(/^["']|["']$/g, ""));
        };
        const headers = splitLine(lines[0]).map((h) => h.trim());
        const rows = lines.slice(1).map((line) => {
          const values = splitLine(line);
          const row: Record<string, string> = {};
          headers.forEach((h, i) => { row[h] = values[i] || ""; });
          return row;
        }).filter((row) => Object.values(row).some((v) => v !== ""));
        setParsedData({ headers, rows });
        setLoading(false);
        setStep(2);
      } catch {
        setError("Could not read this file. Please check it is a valid CSV.");
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError("File could not be read. Please try again.");
      setLoading(false);
    };
    reader.readAsText(file);
  };

  const processImport = () => {
    if (!parsedData) return;
    setLoading(true);
    const newContacts: ImportedLocalContact[] = parsedData.rows.map((row, index) => {
      const first = row[columnMap["First Name"]] || "";
      const last = row[columnMap["Last Name"]] || "";
      const name = [first, last].filter(Boolean).join(" ").trim();
      return {
        id: "imported-" + Date.now() + "-" + index,
        name,
        initials: ((first[0] || "") + (last[0] || "")).toUpperCase() || (name[0] || "·").toUpperCase(),
        role: row[columnMap.Role] || "Contact",
        company: row[columnMap.Company] || "",
        email: row[columnMap.Email] || "",
        notes: row[columnMap.Notes] || "",
        warmth: "active" as const,
        lastContact: "Just imported",
        avatarBg: "#E8F5EE",
        avatarColor: "#065F46",
        isImported: true as const,
      };
    }).filter((c) => c.name.trim() !== "");
    const existing = loadStoredImports();
    const merged = [...existing, ...newContacts];
    localStorage.setItem("pulse_contacts", JSON.stringify(merged));
    setTimeout(() => {
      setLoading(false);
      setImportedCount(newContacts.length);
      setLastImportedIds(newContacts.map((c) => c.id));
      setStored(merged);
      setStep(3);
    }, 800);
  };

  const bulkTagImported = (tagId: string) => {
    lastImportedIds.forEach((id) => setContactTags(id, [tagId]));
    setTagsVersion((v) => v + 1);
    closeModal();
    refreshStored();
  };

  // Persist filter selections
  useEffect(() => { try { sessionStorage.setItem("contacts_warmth_filter", activeWarmth); } catch {} }, [activeWarmth]);
  useEffect(() => { try { sessionStorage.setItem("contacts_tag_filter", activeTag); } catch {} }, [activeTag]);

  // ===== Filtering / list =====
  const suppressed = getSuppressedIds();
  const visibleApp = appContacts.filter((c) => !suppressed.includes(c.id));

  const matchesWarmth = (warmth: string) => {
    if (activeWarmth === "All") return true;
    if (activeWarmth === "Active") return warmth === "active";
    if (activeWarmth === "Cooling") return warmth === "cooling";
    if (activeWarmth === "Dormant") return warmth === "dormant";
    return true;
  };
  const matchesTagFor = (id: string, baseTags: string[] = []) => {
    if (!activeTag) return true;
    // Re-read latest tags so picker updates filter immediately
    void tagsVersion;
    const tags = getContactTags({ id, tags: baseTags });
    return tags.includes(activeTag);
  };
  const matchesSearch = (text: string) =>
    !search.trim() || text.toLowerCase().includes(search.toLowerCase());

  const visibleSeed = visibleApp.filter((c) =>
    matchesWarmth(c.warmth) &&
    matchesTagFor(c.id, c.tags) &&
    matchesSearch(`${c.name} ${c.role} ${c.company}`)
  );
  const visibleStored = stored.filter((c) =>
    matchesWarmth(c.warmth) &&
    matchesTagFor(c.id, []) &&
    matchesSearch(`${c.name} ${c.role} ${c.company} ${c.email}`)
  );
  const cooling = visibleSeed.filter((c) => c.warmth === "cooling" || c.warmth === "dormant");
  const active = visibleSeed.filter((c) => c.warmth === "active");

  const totalAll = visibleApp.length + stored.length;
  const isEmpty = totalAll === 0;
  const hasVisible = visibleSeed.length + visibleStored.length > 0;

  const renderTagRow = (tags: string[]) => {
    if (!tags || tags.length === 0) return null;
    const visibleTags = tags.slice(0, 2);
    const extra = tags.length - visibleTags.length;
    return (
      <div className="flex flex-wrap items-center" style={{ gap: 4, marginTop: 6 }}>
        {visibleTags.map((tid) => <TagPill key={tid} tagId={tid} />)}
        {extra > 0 && (
          <span style={{ background: "#F2F1EC", color: "#6B6B65", borderRadius: 99, fontSize: 11, fontWeight: 600, padding: "3px 10px" }}>
            +{extra}
          </span>
        )}
      </div>
    );
  };

  const renderRow = (c: AppContact) => {
    const meta = warmthMeta(c.warmth);
    const tags = getContactTags(c);
    return (
      <button
        key={c.id}
        onClick={() => navigate("/draft", { state: { contactId: c.id } })}
        className="w-full flex items-start gap-3 bg-white rounded-[14px] border border-[hsl(48,30%,94%)] p-3.5 text-left hover:bg-[hsl(50,20%,97%)] transition-colors"
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-semibold shrink-0"
          style={{ background: c.avatarBg, color: c.avatarColor, boxShadow: `0 0 0 3px ${meta.bg}` }}
        >
          {c.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-foreground">{c.name}</p>
          <p className="text-[12px] text-[hsl(55,3%,53%)]">{c.role} · {c.company}</p>
          <p className="text-[11px]" style={{ color: meta.dot }}>Last contact: {c.lastContact}</p>
          {renderTagRow(tags)}
        </div>
        <span className="text-[11px] rounded-full px-2 py-0.5 font-medium shrink-0 mt-0.5" style={{ background: meta.bg, color: meta.text }}>
          {meta.label}
        </span>
        <ChevronRight size={16} className="text-[hsl(50,8%,76%)] shrink-0 mt-1" />
      </button>
    );
  };

  const renderImportedRow = (c: ImportedLocalContact) => {
    const tags = getContactTags({ id: c.id, tags: [] });
    return (
      <div
        key={c.id}
        className="w-full flex items-start gap-3 bg-white rounded-[14px] border border-[hsl(48,30%,94%)] p-3.5"
      >
        <div className="w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-semibold shrink-0" style={{ background: c.avatarBg, color: c.avatarColor, boxShadow: `0 0 0 3px #E8F5EE` }}>
          {c.initials || "·"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[14px] font-semibold text-foreground truncate">{c.name}</p>
            <span style={{ background: "#F0F0EC", color: "#6B6B65", fontSize: 10, fontWeight: 500, borderRadius: 99, padding: "2px 8px" }}>
              Imported
            </span>
          </div>
          <p className="text-[12px] text-[hsl(55,3%,53%)] truncate">
            {[c.role, c.company].filter(Boolean).join(" · ") || c.email || "—"}
          </p>
          {renderTagRow(tags)}
        </div>
        <ChevronRight size={16} className="text-[hsl(50,8%,76%)] shrink-0 mt-1" />
      </div>
    );
  };

  const importableRows = useMemo(() => parsedData?.rows.filter((r) => {
    const f = r[columnMap["First Name"]] || "";
    const l = r[columnMap["Last Name"]] || "";
    return (f + l).trim() !== "";
  }).length || 0, [parsedData, columnMap]);

  return (
    <div className="page-enter min-h-screen bg-[hsl(60,13%,97%)] pb-20" style={{ position: "relative", zIndex: 1 }}>
      <div className="px-4 pt-4 pb-2 flex items-center justify-between gap-3">
        <h1 className="text-[28px] font-bold text-foreground">My Contacts</h1>
      </div>

      {/* Import banner */}
      <button
        onClick={openModal}
        className="flex items-center gap-3.5 w-auto text-left"
        style={{
          background: "linear-gradient(135deg, #E8F5EE, #F0F7F3)",
          border: "1.5px solid #A8D5BB",
          borderRadius: 14,
          padding: "16px 20px",
          margin: "0 16px 16px",
        }}
      >
        <div className="shrink-0 flex items-center justify-center" style={{ width: 44, height: 44, background: "white", borderRadius: "50%", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
          <UploadCloud size={24} color="#1A6B4A" />
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A18" }}>Import your contacts</p>
          <p style={{ fontSize: 12, color: "#6B6B65", marginTop: 2 }}>
            Upload a CSV from LinkedIn, Gmail, or your phone in seconds.
          </p>
        </div>
        <span className="shrink-0" style={{ background: "#1A6B4A", color: "white", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
          Import CSV →
        </span>
      </button>

      <div className="mx-4 mb-2 h-11 bg-[hsl(40,14%,93%)] rounded-full px-4 flex items-center gap-2">
        <Search size={16} className="text-[hsl(50,8%,64%)] shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contacts..."
          className="bg-transparent border-none outline-none flex-1 text-[14px] text-foreground placeholder:text-[hsl(50,8%,64%)]"
        />
      </div>

      <div className="flex items-center gap-2 px-4 pb-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {WARMTH_PILLS.map((p) => (
          <button
            key={p}
            onClick={() => setActiveWarmth(p)}
            className={cn(
              "h-8 px-3.5 rounded-full text-[12px] font-medium whitespace-nowrap shrink-0 transition-colors",
              activeWarmth === p ? "bg-[hsl(152,62%,26%)] text-white" : "bg-[hsl(40,14%,93%)] text-[hsl(55,3%,40%)]"
            )}
          >
            {p}
          </button>
        ))}
        <span style={{ display: "inline-block", width: 1, height: 20, background: "#E0E0D8", margin: "0 4px", verticalAlign: "middle", flexShrink: 0 }} />
        {TAG_FILTER_IDS.map((id) => {
          const t = tagMeta(id);
          const isActive = activeTag === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTag(isActive ? "" : id)}
              className="h-8 px-3.5 rounded-full text-[12px] font-medium whitespace-nowrap shrink-0 transition-colors"
              style={
                isActive
                  ? { background: t.color, color: "white", border: `1px solid ${t.color}` }
                  : { background: t.bg, color: t.color, border: `1px solid ${t.color}40` }
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center px-4" style={{ paddingTop: 48, paddingBottom: 24 }}>
          <div className="flex items-center justify-center" style={{ width: 64, height: 64, borderRadius: "50%", background: "#E8F5EE" }}>
            <UploadCloud size={28} color="#1A6B4A" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A18", marginTop: 16, textAlign: "center" }}>Add your first contacts</h2>
          <p style={{ fontSize: 14, color: "#6B6B65", textAlign: "center", maxWidth: 260, margin: "8px auto 0" }}>
            Import from CSV, LinkedIn, or Gmail — or add contacts one by one.
          </p>
          <div className="w-full flex flex-col gap-[10px]" style={{ marginTop: 24, maxWidth: 280 }}>
            <button onClick={openModal} style={{ background: "#1A6B4A", color: "white", borderRadius: 12, height: 48, fontWeight: 600, fontSize: 14 }}>
              Upload a CSV file →
            </button>
            <button onClick={() => navigate("/settings/privacy/permissions")} style={{ background: "white", color: "#0A66C2", border: "1.5px solid #0A66C2", borderRadius: 12, height: 48, fontWeight: 500, fontSize: 14 }}>
              Import from LinkedIn
            </button>
            <button onClick={openModal} style={{ background: "transparent", color: "#6B6B65", border: "1.5px solid #E0E0D8", borderRadius: 12, height: 48, fontWeight: 500, fontSize: 14 }}>
              Add manually
            </button>
          </div>
        </div>
      ) : !hasVisible ? (
        <div className="text-center" style={{ padding: "40px 20px" }}>
          <div style={{ fontSize: 32 }} className="mb-2">🔍</div>
          <p style={{ fontSize: 14, color: "#6B6B65" }}>
            No {activeWarmth === "All" && !activeTag ? "" : (activeTag ? tagMeta(activeTag).label + " " : activeWarmth + " ")}contacts right now.
          </p>
          <p style={{ fontSize: 14, color: "#6B6B65" }} className="mt-1">
            Pulse will surface contacts here as your network data updates.
          </p>
        </div>
      ) : (
        <>
          {visibleStored.length > 0 && (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[hsl(55,3%,40%)] px-4 pt-3 pb-1.5">
                Imported — {visibleStored.length} contacts
              </p>
              <div className="px-4 space-y-2 mb-2">{visibleStored.map(renderImportedRow)}</div>
            </>
          )}
          {cooling.length > 0 && (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[hsl(55,3%,40%)] px-4 pt-3 pb-1.5">
                Cooling — {cooling.length} contacts
              </p>
              <div className="px-4 space-y-2">{cooling.map(renderRow)}</div>
            </>
          )}
          {active.length > 0 && (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[hsl(55,3%,40%)] px-4 pt-3 pb-1.5">
                Active — {active.length} contacts
              </p>
              <div className="px-4 space-y-2">{active.map(renderRow)}</div>
            </>
          )}
        </>
      )}

      {/* FAB */}
      <button
        onClick={() => setFabMenuOpen(true)}
        aria-label="Add contacts"
        className="fixed z-40 flex items-center justify-center hover:opacity-90 transition-opacity"
        style={{ right: 20, bottom: 88, width: 56, height: 56, borderRadius: "50%", background: "#1A6B4A", color: "white", boxShadow: "0 6px 16px rgba(26,107,74,0.35)" }}
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {fabMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.3)" }} onClick={() => setFabMenuOpen(false)}>
          <div
            className="w-full bg-white"
            style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18, paddingBottom: 12, animation: "fadeUp 0.2s ease-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E0E0D8", margin: "10px auto 6px" }} />
            <button onClick={openModal} className="w-full flex items-center" style={{ height: 52, padding: "0 20px", gap: 12, fontSize: 14, fontWeight: 500, color: "#1A1A18", borderBottom: "1px solid #F0EFE8" }}>
              <UploadCloud size={20} color="#1A6B4A" /> Import CSV file
            </button>
            <button onClick={openModal} className="w-full flex items-center" style={{ height: 52, padding: "0 20px", gap: 12, fontSize: 14, fontWeight: 500, color: "#1A1A18", borderBottom: "1px solid #F0EFE8" }}>
              <UserPlus size={20} color="#1A6B4A" /> Add contact manually
            </button>
            <button onClick={() => { setFabMenuOpen(false); navigate("/settings/privacy/permissions"); }} className="w-full flex items-center" style={{ height: 52, padding: "0 20px", gap: 12, fontSize: 14, fontWeight: 500, color: "#1A1A18" }}>
              <Briefcase size={20} color="#0A66C2" /> Import from LinkedIn
            </button>
          </div>
        </div>
      )}

      {/* CSV IMPORT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end" style={{ background: "rgba(0,0,0,0.45)" }} onClick={closeModal}>
          <div
            className="w-full bg-white flex flex-col"
            style={{
              borderRadius: "24px 24px 0 0",
              maxHeight: "92vh",
              overflowY: "auto",
              animation: "slideUpModal 300ms ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`@keyframes slideUpModal { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-2">
              {step === 2 ? (
                <button onClick={() => { setStep(1); }} aria-label="Back" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F0EFE8]">
                  <ArrowLeft size={20} color="#1A1A18" />
                </button>
              ) : <div className="w-9" />}
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A18" }}>
                {step === 1 ? "Import Contacts" : step === 2 ? "Map your columns" : "Imported!"}
              </h2>
              <button onClick={closeModal} aria-label="Close" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F0EFE8]">
                <X size={20} color="#1A1A18" />
              </button>
            </div>

            <div className="px-5 pb-8">
              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <p style={{ fontSize: 13, color: "#6B6B65", marginBottom: 16 }}>
                    Upload a CSV file from LinkedIn, Gmail, or any contact manager.
                  </p>
                  <p style={{ fontSize: 13, color: "#6B6B65", marginBottom: 12 }}>
                    Not sure about the format?{" "}
                    <button onClick={downloadTemplate} style={{ color: "#1A6B4A", fontWeight: 600, textDecoration: "underline" }}>
                      Download our CSV template
                    </button>
                  </p>

                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      const file = e.dataTransfer.files[0];
                      if (file) handleFileSelect(file);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: dragging ? "2px dashed #1A6B4A" : "2px dashed #A8D5BB",
                      borderRadius: 16,
                      padding: "40px 24px",
                      textAlign: "center",
                      background: dragging ? "#E8F5EE" : "#F7FBF8",
                      cursor: "pointer",
                      transition: "all 200ms ease",
                      transform: dragging ? "scale(1.01)" : "scale(1)",
                      marginBottom: 16,
                    }}
                  >
                    {loading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 size={32} color="#1A6B4A" className="animate-spin" />
                        <p style={{ fontSize: 14, color: "#6B6B65" }}>Reading your file...</p>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={32} color="#1A6B4A" style={{ margin: "0 auto" }} />
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1A1A18", marginTop: 12 }}>
                          Drag your CSV file here
                        </h3>
                        <p style={{ fontSize: 13, color: "#A8A89E", margin: "8px 0" }}>or</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                          style={{ background: "white", border: "1.5px solid #1A6B4A", color: "#1A6B4A", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 600 }}
                        >
                          Browse files
                        </button>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,text/csv,application/csv"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                        e.target.value = "";
                      }}
                    />
                  </div>

                  {error && (
                    <div style={{ background: "#FEF2F2", borderLeft: "3px solid #DC2626", borderRadius: "0 8px 8px 0", padding: "10px 14px", fontSize: 13, color: "#991B1B" }}>
                      {error}
                    </div>
                  )}
                  {selectedFile && !error && !loading && (
                    <p style={{ fontSize: 12, color: "#6B6B65" }}>Selected: {selectedFile.name}</p>
                  )}
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && parsedData && (
                <>
                  <p style={{ fontSize: 13, color: "#6B6B65", marginBottom: 20 }}>
                    We found {parsedData.rows.length} contact{parsedData.rows.length === 1 ? "" : "s"} in your file. Match your columns to Pulse fields.
                  </p>

                  <div style={{ marginBottom: 20 }}>
                    {PULSE_FIELDS.map((field) => (
                      <div key={field} className="flex items-center gap-3" style={{ padding: "10px 0", borderBottom: "1px solid #F0EFE8" }}>
                        <label style={{ fontSize: 14, fontWeight: 500, color: "#1A1A18", minWidth: 100 }}>{field}</label>
                        <select
                          value={columnMap[field]}
                          onChange={(e) => setColumnMap({ ...columnMap, [field]: e.target.value })}
                          style={{ flex: 1, height: 40, border: "1.5px solid #E0E0D8", borderRadius: 8, padding: "0 12px", fontSize: 14, color: "#1A1A18", background: "white" }}
                        >
                          <option value="">-- Skip this field --</option>
                          {parsedData.headers.map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <p style={{ fontSize: 12, color: "#6B6B65", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                    Preview (first 3 rows)
                  </p>
                  <div style={{ border: "1px solid #E8EDE6", borderRadius: 10, overflow: "hidden", overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#F7F7F4" }}>
                          {parsedData.headers.map((h) => (
                            <th key={h} style={{ padding: "8px 12px", fontSize: 11, fontWeight: 600, color: "#6B6B65", textTransform: "uppercase", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.rows.slice(0, 3).map((row, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#FAFAF8" }}>
                            {parsedData.headers.map((h) => (
                              <td key={h} style={{ padding: "8px 12px", fontSize: 13, color: "#1A1A18", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {row[h]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={processImport}
                    disabled={loading || importableRows === 0}
                    style={{
                      width: "100%",
                      height: 52,
                      background: importableRows === 0 ? "#A8C9B7" : "#1A6B4A",
                      color: "white",
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: 600,
                      marginTop: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    {loading ? <><Loader2 size={18} className="animate-spin" /> Importing...</> : <>Import {importableRows} contact{importableRows === 1 ? "" : "s"} →</>}
                  </button>
                  {importableRows === 0 && (
                    <p style={{ fontSize: 12, color: "#991B1B", marginTop: 8, textAlign: "center" }}>
                      Map at least First Name or Last Name to continue.
                    </p>
                  )}
                </>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="flex flex-col items-center" style={{ paddingTop: 12 }}>
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "#1A6B4A",
                      animation: "fadeUp 0.4s ease-out",
                    }}
                  >
                    <Check size={32} color="white" strokeWidth={3} />
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A18", marginTop: 16 }}>Imported!</h2>
                  <p style={{ fontSize: 14, color: "#6B6B65", textAlign: "center", marginTop: 8 }}>
                    {importedCount} contact{importedCount === 1 ? "" : "s"} added to your network.
                  </p>

                  <div style={{ background: "#E8F5EE", borderRadius: 12, padding: "14px 18px", margin: "20px 0", width: "100%" }}>
                    <p style={{ fontSize: 13, color: "#1A6B4A", lineHeight: 1.55 }}>
                      Pulse will begin surfacing these contacts in your nudges based on relationship warmth and your stated goals.
                    </p>
                  </div>

                  <button
                    onClick={() => { closeModal(); refreshStored(); }}
                    style={{ width: "100%", height: 48, background: "#1A6B4A", color: "white", borderRadius: 12, fontSize: 14, fontWeight: 600 }}
                  >
                    View my contacts →
                  </button>

                  {lastImportedIds.length > 0 && (
                    <div className="w-full" style={{ marginTop: 18 }}>
                      <p style={{ fontSize: 13, color: "#6B6B65", textAlign: "center", marginBottom: 12 }}>
                        Want to tag your imported contacts?
                      </p>
                      <div className="flex flex-wrap justify-center" style={{ gap: 8 }}>
                        <button
                          onClick={() => bulkTagImported("colleague")}
                          style={{ background: "white", border: "1.5px solid #E0E0D8", color: "#6B6B65", borderRadius: 99, padding: "6px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer" }}
                        >
                          Tag all as colleagues →
                        </button>
                        <button
                          onClick={() => bulkTagImported("tier-2")}
                          style={{ background: "white", border: "1.5px solid #E0E0D8", color: "#6B6B65", borderRadius: 99, padding: "6px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer" }}
                        >
                          Tag all as Tier 2 →
                        </button>
                        <button
                          onClick={() => { closeModal(); refreshStored(); }}
                          style={{ background: "white", border: "1.5px solid #E0E0D8", color: "#6B6B65", borderRadius: 99, padding: "6px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer" }}
                        >
                          I'll tag them individually →
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => { resetModal(); }}
                    style={{ width: "100%", height: 48, background: "transparent", color: "#6B6B65", borderRadius: 12, fontSize: 14, fontWeight: 500, marginTop: 10 }}
                  >
                    Import another file
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-[hsl(100,18%,91%)] flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = tab.path === "/contacts";
          return (
            <button key={tab.path} onClick={() => navigate(tab.path)} className="flex flex-col items-center justify-center gap-1 flex-1 h-full">
              <tab.icon size={22} strokeWidth={isActive ? 2.2 : 1.6} className={isActive ? "text-[hsl(152,62%,26%)]" : "text-[hsl(50,8%,64%)]"} />
              <span className={cn("text-[10px] font-medium", isActive ? "text-[hsl(152,62%,26%)]" : "text-[hsl(50,8%,64%)]")}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
