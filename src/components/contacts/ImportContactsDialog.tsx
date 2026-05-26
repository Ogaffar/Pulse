import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone, Briefcase, Mail, MessageCircle, Upload, FileText, CheckCircle2, AlertCircle, ChevronLeft } from "lucide-react";
import { addContacts, contactSchema, parseContactsCsv, type ImportedContact } from "@/lib/contactsStore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type SourceId = "linkedin" | "phone" | "google" | "outlook" | "whatsapp";

interface SourceMeta {
  id: SourceId;
  label: string;
  icon: typeof Smartphone;
  iconColor: string;
  csvSource: ImportedContact["source"];
  steps: string[];
  noteTone?: "info" | "warn";
  note?: string;
}

const SOURCES: SourceMeta[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: Briefcase,
    iconColor: "text-[#0A66C2]",
    csvSource: "csv-linkedin",
    steps: [
      "Open linkedin.com on desktop and sign in.",
      "Go to Me → Settings & Privacy → Data Privacy.",
      "Click \"Get a copy of your data\".",
      "Select \"Connections\" only, then \"Request archive\".",
      "LinkedIn will email you a Connections.csv file (usually within 10 minutes).",
      "Come back here and upload that CSV below.",
    ],
  },
  {
    id: "phone",
    label: "Phone contacts",
    icon: Smartphone,
    iconColor: "text-primary",
    csvSource: "csv-google",
    steps: [
      "iPhone: open Settings → Contacts → Accounts → iCloud, make sure Contacts is on. Then on a computer go to icloud.com/contacts, select all (⌘A), click the gear icon, choose \"Export vCard\", then convert to CSV at any free vCard-to-CSV tool.",
      "Android: open contacts.google.com on desktop → Export → Google CSV.",
      "Upload the resulting .csv file below.",
    ],
    note: "Browsers can't read your phone's address book directly — exporting via iCloud or Google is the only way.",
    noteTone: "info",
  },
  {
    id: "google",
    label: "Gmail / Google",
    icon: Mail,
    iconColor: "text-[#EA4335]",
    csvSource: "csv-google",
    steps: [
      "Go to contacts.google.com on desktop.",
      "Tick the contacts you want (or select all).",
      "Click the three-dot menu → Export.",
      "Choose \"Google CSV\" and download.",
      "Upload that file below.",
    ],
  },
  {
    id: "outlook",
    label: "Outlook",
    icon: Mail,
    iconColor: "text-[#0078D4]",
    csvSource: "csv-outlook",
    steps: [
      "Open outlook.live.com → People.",
      "Click Manage → Export contacts.",
      "Choose \"All contacts\" and export as CSV.",
      "Upload the file below.",
    ],
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    iconColor: "text-[#25D366]",
    csvSource: "csv-other",
    steps: [
      "WhatsApp doesn't expose a contacts export.",
      "Your WhatsApp contacts are the same people in your phone's address book.",
      "Use the \"Phone contacts\" option above to export from iCloud or Google, then upload the CSV.",
    ],
    note: "WhatsApp has no public contact API — phone-export is the workaround.",
    noteTone: "warn",
  },
];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onImported?: (count: number) => void;
}

export function ImportContactsDialog({ open, onOpenChange, onImported }: Props) {
  const { toast } = useToast();
  const [activeSource, setActiveSource] = useState<SourceMeta | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const [manual, setManual] = useState({ name: "", email: "", phone: "", company: "", role: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setActiveSource(null);
    setManual({ name: "", email: "", phone: "", company: "", role: "" });
    setErrors({});
  };

  const handleFile = async (file: File) => {
    if (!activeSource) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB.", variant: "destructive" });
      return;
    }
    const text = await file.text();
    const result = parseContactsCsv(text, activeSource.csvSource);
    if (result.contacts.length === 0) {
      toast({
        title: "No contacts found",
        description: "We couldn't read names or emails from that CSV. Make sure it has a header row with at least a Name or Email column.",
        variant: "destructive",
      });
      return;
    }
    addContacts(result.contacts);
    toast({
      title: `Imported ${result.contacts.length} contact${result.contacts.length === 1 ? "" : "s"}`,
      description: result.skipped > 0 ? `${result.skipped} row${result.skipped === 1 ? "" : "s"} skipped (missing data).` : "All set.",
    });
    onImported?.(result.contacts.length);
    reset();
    onOpenChange(false);
  };

  const handleManualAdd = () => {
    const parsed = contactSchema.safeParse(manual);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    const data = parsed.data;
    addContacts([
      {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        company: data.company || undefined,
        role: data.role || undefined,
        source: "manual",
      },
    ]);
    toast({ title: "Contact added", description: data.name });
    onImported?.(1);
    setManual({ name: "", email: "", phone: "", company: "", role: "" });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {activeSource ? (
            <button
              onClick={() => setActiveSource(null)}
              className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors -ml-1 mb-1"
            >
              <ChevronLeft size={16} /> All sources
            </button>
          ) : null}
          <DialogTitle className="text-[20px]">
            {activeSource ? `Import from ${activeSource.label}` : "Import contacts"}
          </DialogTitle>
          <DialogDescription>
            {activeSource
              ? "Follow the steps, then upload the CSV file."
              : "Bring in the people who matter most to you."}
          </DialogDescription>
        </DialogHeader>

        {!activeSource && (
          <Tabs defaultValue="sources" className="mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sources">Import from a source</TabsTrigger>
              <TabsTrigger value="manual">Add manually</TabsTrigger>
            </TabsList>

            <TabsContent value="sources" className="mt-4 space-y-2">
              {SOURCES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSource(s)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-lg border-[1.5px] border-border bg-card hover:border-primary/40 hover:bg-secondary transition-all text-left"
                >
                  <s.icon size={22} className={cn("shrink-0", s.iconColor)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-foreground">{s.label}</p>
                    <p className="text-[12px] text-muted-foreground">
                      {s.id === "whatsapp" ? "Use phone export" : "CSV upload — instructions inside"}
                    </p>
                  </div>
                  <FileText size={16} className="text-muted-foreground shrink-0" />
                </button>
              ))}
            </TabsContent>

            <TabsContent value="manual" className="mt-4 space-y-3">
              <div>
                <Label htmlFor="m-name">Name *</Label>
                <Input id="m-name" value={manual.name} onChange={(e) => setManual({ ...manual, name: e.target.value })} placeholder="Sarah Chen" maxLength={100} />
                {errors.name && <p className="text-[12px] text-destructive mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="m-email">Email</Label>
                  <Input id="m-email" type="email" value={manual.email} onChange={(e) => setManual({ ...manual, email: e.target.value })} placeholder="sarah@..." maxLength={255} />
                  {errors.email && <p className="text-[12px] text-destructive mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="m-phone">Phone</Label>
                  <Input id="m-phone" value={manual.phone} onChange={(e) => setManual({ ...manual, phone: e.target.value })} placeholder="+1 555…" maxLength={40} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="m-company">Company</Label>
                  <Input id="m-company" value={manual.company} onChange={(e) => setManual({ ...manual, company: e.target.value })} placeholder="Stripe" maxLength={120} />
                </div>
                <div>
                  <Label htmlFor="m-role">Role</Label>
                  <Input id="m-role" value={manual.role} onChange={(e) => setManual({ ...manual, role: e.target.value })} placeholder="Product Manager" maxLength={120} />
                </div>
              </div>
              <Button onClick={handleManualAdd} className="w-full mt-2">Add contact</Button>
            </TabsContent>
          </Tabs>
        )}

        {activeSource && (
          <div className="mt-2 space-y-4">
            <div className="rounded-lg bg-secondary p-4">
              <p className="text-[13px] font-semibold text-foreground mb-2">How to get your CSV</p>
              <ol className="space-y-1.5">
                {activeSource.steps.map((step, i) => (
                  <li key={i} className="text-[13px] text-foreground/80 flex gap-2">
                    <span className="text-primary font-semibold shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              {activeSource.note && (
                <div className={cn(
                  "mt-3 flex gap-2 items-start p-2.5 rounded-md text-[12px]",
                  activeSource.noteTone === "warn" ? "bg-[hsl(var(--accent-warm)/0.15)] text-foreground" : "bg-primary-light text-foreground"
                )}>
                  <AlertCircle size={14} className="shrink-0 mt-0.5 text-primary" />
                  <span>{activeSource.note}</span>
                </div>
              )}
            </div>

            {activeSource.id !== "whatsapp" && (
              <>
                <input
                  ref={fileInput}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                    e.target.value = "";
                  }}
                />
                <button
                  onClick={() => fileInput.current?.click()}
                  className="w-full border-[1.5px] border-dashed border-primary/40 rounded-lg p-6 flex flex-col items-center gap-2 hover:bg-primary-light transition-colors"
                >
                  <Upload size={22} className="text-primary" />
                  <span className="text-[14px] font-medium text-foreground">Upload CSV file</span>
                  <span className="text-[12px] text-muted-foreground">Max 5MB · processed locally</span>
                </button>
                <p className="text-[12px] text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-primary" />
                  Your file never leaves your browser.
                </p>
              </>
            )}
            {activeSource.id === "whatsapp" && (
              <Button variant="secondary" onClick={() => setActiveSource(SOURCES.find((s) => s.id === "phone")!)} className="w-full">
                Go to phone export
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
