import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Users, Check, Plus } from "lucide-react";
import appContacts, {
  getAllTags,
  getContactTags,
  setContactTags,
  saveCustomTag,
  tagMeta,
  type TagDef,
} from "@/data/appContacts";

type Tone = "Professional" | "Warm" | "Casual";
const TONES: Tone[] = ["Professional", "Warm", "Casual"];
const CHANNELS = ["LinkedIn", "Email", "iMessage"] as const;

function DraftTagPill({ tagId, onRemove }: { tagId: string; onRemove?: () => void }) {
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
          onClick={onRemove}
          aria-label={`Remove ${t.label}`}
          style={{ marginLeft: 4, color: t.color, fontSize: 12, lineHeight: 1, cursor: "pointer", background: "transparent" }}
        >
          ×
        </button>
      )}
    </span>
  );
}

export default function DraftMessage() {
  const navigate = useNavigate();
  const location = useLocation();
  const stateContactId = (location.state as { contactId?: string } | null)?.contactId;
  const contact = appContacts.find((c) => c.id === stateContactId) || appContacts[0];

  const [tone, setTone] = useState<Tone>("Professional");
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [sendEnabled, setSendEnabled] = useState(false);
  const [channel, setChannel] = useState<string>("LinkedIn");
  const [isDirty, setIsDirty] = useState(false);
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ===== Tags state =====
  const [tags, setTags] = useState<string[]>(() => getContactTags(contact));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [allTags, setAllTags] = useState<TagDef[]>(() => getAllTags());

  useEffect(() => {
    setTags(getContactTags(contact));
  }, [contact.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const persistTags = (next: string[]) => {
    setTags(next);
    setContactTags(contact.id, next);
  };
  const toggleTag = (id: string) => {
    persistTags(tags.includes(id) ? tags.filter((t) => t !== id) : [...tags, id]);
  };
  const removeTag = (id: string) => persistTags(tags.filter((t) => t !== id));
  const createCustomTag = () => {
    const label = tagSearch.trim();
    if (!label) return;
    const id = label.toLowerCase().replace(/\s+/g, "-");
    if (allTags.some((t) => t.id === id)) {
      toggleTag(id);
    } else {
      const tag: TagDef = { id, label, color: "#1A6B4A", bg: "#E8F5EE" };
      saveCustomTag(tag);
      setAllTags(getAllTags());
      persistTags([...tags, id]);
    }
    setTagSearch("");
  };
  const filteredTags = useMemo(() => {
    const q = tagSearch.trim().toLowerCase();
    if (!q) return allTags;
    return allTags.filter((t) => t.label.toLowerCase().includes(q) || t.id.includes(q));
  }, [allTags, tagSearch]);
  const exactMatch = useMemo(
    () => allTags.some((t) => t.label.toLowerCase() === tagSearch.trim().toLowerCase()),
    [allTags, tagSearch]
  );

  const draftFor = (t: Tone) =>
    t === "Professional" ? contact.draftProfessional : t === "Warm" ? contact.draftWarm : contact.draftCasual;

  const typeText = useCallback((target: string) => {
    setIsTyping(true);
    setText("");
    let i = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      i++;
      setText(target.slice(0, i));
      if (i >= target.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsTyping(false);
      }
    }, 16);
  }, []);

  useEffect(() => {
    typeText(draftFor("Professional"));
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact.id]);

  const switchTone = (t: Tone) => {
    if (t === tone) return;
    setTone(t);
    typeText(draftFor(t));
  };

  const handleBack = () => {
    if (isDirty) {
      const ok = window.confirm("Discard your draft? Your changes will be lost.");
      if (!ok) return;
    }
    if (stateContactId) navigate(-1);
    else navigate("/dashboard");
  };

  const handleSend = async () => {
    if (!sendEnabled || sending) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    navigate("/sent", { state: { contactId: contact.id, contactName: contact.name } });
  };

  // No contactId in router state and direct nav → friendly empty state
  if (!stateContactId) {
    return (
      <div className="page-enter min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center" style={{ position: "relative", zIndex: 1 }}>
        <Users size={48} color="#A8A89E" />
        <h3 className="mt-4 text-[20px] font-semibold text-foreground">No contact selected</h3>
        <p className="mt-2 text-[14px] text-[hsl(55,3%,40%)] max-w-[300px]">
          Go back to your dashboard to select a contact to message.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-5 h-12 px-6 rounded-xl bg-[hsl(152,62%,26%)] text-white text-[15px] font-semibold"
        >
          Go to dashboard →
        </button>
      </div>
    );
  }

  const charCount = text.length;

  return (
    <div className="page-enter min-h-screen bg-white flex flex-col" style={{ position: "relative", zIndex: 1 }}>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-[hsl(100,18%,91%)] flex items-center justify-between px-4">
        <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center">
          <ArrowLeft size={22} className="text-[hsl(55,3%,40%)]" />
        </button>
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold"
            style={{ background: contact.avatarBg, color: contact.avatarColor }}
          >
            {contact.initials}
          </div>
          <span className="text-[15px] font-semibold text-foreground">{contact.name}</span>
        </div>
        <button
          onClick={handleSend}
          disabled={!sendEnabled || sending}
          className={`text-[13px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${sendEnabled ? "bg-[hsl(152,62%,26%)] text-white" : "bg-[hsl(50,8%,82%)] text-white cursor-not-allowed"}`}
        >
          {sending ? "…" : "Send →"}
        </button>
      </header>

      <main className="pt-[72px] pb-24 px-4 flex-1">
        {/* Tag editor */}
        <div className="relative" style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#6B6B65", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
            Tags
          </p>
          <div className="flex flex-wrap" style={{ gap: 6 }}>
            {tags.map((tid) => (
              <DraftTagPill key={tid} tagId={tid} onRemove={() => removeTag(tid)} />
            ))}
            <button
              onClick={() => setPickerOpen((v) => !v)}
              style={{
                border: "1.5px dashed #A8A89E",
                color: "#6B6B65",
                background: "transparent",
                borderRadius: 99,
                fontSize: 11,
                padding: "3px 10px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Plus size={11} strokeWidth={2.5} /> Add tag
            </button>
          </div>

          {pickerOpen && (
            <>
              <div className="fixed inset-0" style={{ zIndex: 40 }} onClick={() => { setPickerOpen(false); setTagSearch(""); }} />
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: 6,
                  background: "white",
                  borderRadius: 12,
                  border: "1px solid #E0E0D8",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                  padding: 8,
                  width: 220,
                  zIndex: 50,
                }}
              >
                <input
                  autoFocus
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  placeholder="Search tags..."
                  style={{ width: "100%", height: 36, border: "1px solid #E0E0D8", borderRadius: 8, padding: "0 10px", fontSize: 13, outline: "none", marginBottom: 6 }}
                />
                <div style={{ maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
                  {filteredTags.map((t) => {
                    const applied = tags.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        onClick={() => toggleTag(t.id)}
                        className="flex items-center justify-between"
                        style={{ padding: "6px 4px", borderRadius: 6, background: "transparent", textAlign: "left" }}
                      >
                        <DraftTagPill tagId={t.id} />
                        {applied && <Check size={14} color="#1A6B4A" />}
                      </button>
                    );
                  })}
                  {tagSearch.trim() && !exactMatch && (
                    <button
                      onClick={createCustomTag}
                      style={{ padding: "8px 4px", fontSize: 13, color: "#1A6B4A", textAlign: "left", fontWeight: 500, borderTop: "1px solid #F0EFE8", marginTop: 4 }}
                    >
                      + Create "{tagSearch.trim()}"
                    </button>
                  )}
                  {filteredTags.length === 0 && !tagSearch.trim() && (
                    <p style={{ fontSize: 12, color: "#A8A89E", padding: "8px 4px" }}>No tags yet.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-[hsl(146,47%,93%)] rounded-xl px-4 py-3.5 flex gap-2.5">
          <span className="text-[16px] shrink-0">✨</span>
          <p className="text-[13px] leading-[1.5] text-[hsl(152,62%,26%)]">{contact.nudgeReason}</p>
        </div>

        <div className="mt-3">
          <p className="text-[12px] text-[hsl(55,3%,40%)] mb-1.5">Tone</p>
          <div className="flex gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => switchTone(t)}
                className={`px-4 py-[7px] rounded-full text-[13px] font-medium transition-all ${
                  tone === t
                    ? "bg-[hsl(152,62%,26%)] text-white"
                    : "bg-white border-[1.5px] border-[hsl(50,8%,80%)] text-[hsl(55,3%,40%)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => { setText(e.target.value); setIsDirty(true); }}
            onFocus={() => setSendEnabled(true)}
            className="w-full min-h-[140px] bg-[hsl(60,13%,97%)] border-[1.5px] border-[hsl(140,24%,90%)] rounded-xl p-4 text-[14px] leading-[1.65] text-[hsl(0,0%,10%)] resize-none focus:outline-none focus:border-[hsl(152,62%,26%)] transition-colors"
            readOnly={isTyping}
          />
        </div>

        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <button onClick={() => typeText(draftFor(tone))} className="px-3 py-1.5 rounded-lg border border-[hsl(140,24%,90%)] text-[12px] font-medium text-[hsl(152,62%,26%)] hover:bg-[hsl(146,47%,96%)] transition-colors">
            ↻ Regenerate
          </button>
          <span className="ml-auto text-[11px] text-[hsl(50,8%,64%)]">{charCount} / 500</span>
        </div>

        <div className="mt-3">
          <p className="text-[12px] text-[hsl(55,3%,40%)] mb-2">Send via</p>
          <div className="flex gap-2">
            {CHANNELS.map((ch) => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                className={`flex-1 h-11 rounded-[10px] text-[12px] font-medium transition-all ${
                  channel === ch
                    ? "border-[1.5px] border-[hsl(152,62%,26%)] bg-[hsl(146,47%,93%)] text-[hsl(152,62%,26%)]"
                    : "border-[1.5px] border-[hsl(50,8%,88%)] bg-white text-[hsl(55,3%,40%)]"
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 px-4 pb-[max(12px,env(safe-area-inset-bottom))] bg-white">
        <button
          onClick={handleSend}
          disabled={!sendEnabled || sending}
          className={`w-full h-14 rounded-xl text-[15px] font-semibold transition-all flex items-center justify-center gap-2 ${
            sendEnabled
              ? "bg-[hsl(152,62%,26%)] text-white hover:bg-[hsl(152,62%,22%)]"
              : "bg-[hsl(50,8%,82%)] text-white cursor-not-allowed"
          }`}
        >
          {sending ? (
            <span style={{ width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 600ms linear infinite" }} />
          ) : sendEnabled ? `Send via ${channel} →` : "Review the message above first"}
        </button>
      </div>
    </div>
  );
}
