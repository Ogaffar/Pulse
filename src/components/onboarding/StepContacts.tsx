import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Smartphone, Briefcase, Mail, PenLine, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ImportContactsDialog } from "@/components/contacts/ImportContactsDialog";
import { loadContacts } from "@/lib/contactsStore";

const importSources = [
  { id: "phone", icon: Smartphone, label: "From your contacts", badge: "Quick import", badgeVariant: "cool" as const, color: "text-primary" },
  { id: "linkedin", icon: Briefcase, label: "From LinkedIn", badge: "Recommended", badgeVariant: "cool" as const, color: "text-[#0A66C2]" },
  { id: "gmail", icon: Mail, label: "From Gmail", badge: null, badgeVariant: null, color: "text-[#EA4335]" },
  { id: "manual", icon: PenLine, label: "Add manually", badge: "Start small", badgeVariant: "neutral" as const, color: "text-muted-foreground" },
];

const sampleNames = ["Sarah Johnson", "Mike Torres", "Lisa Chen", "David Kim", "Priya Patel", "James Wright", "Aisha Rahman", "Carlos Rivera"];

interface StepContactsProps {
  selectedSources: string[];
  onToggleSource: (id: string) => void;
  addedContacts: string[];
  onAddContact: (name: string) => void;
  onRemoveContact: (name: string) => void;
}

export function StepContacts({ selectedSources, onToggleSource, addedContacts, onAddContact, onRemoveContact }: StepContactsProps) {
  const [searchText, setSearchText] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  useEffect(() => {
    setImportedCount(loadContacts().length);
  }, [importOpen]);

  const filteredSuggestions = searchText.length >= 2
    ? sampleNames.filter((n) => n.toLowerCase().includes(searchText.toLowerCase()) && !addedContacts.includes(n))
    : [];

  return (
    <div className="pt-6">
      <h2 className="text-center mb-2">Let's find the people who matter most.</h2>
      <p className="text-center text-muted-foreground text-[15px] mb-6">
        Pulse works best when it knows who's in your world.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {importSources.map((src) => {
          const isSelected = selectedSources.includes(src.id);
          return (
            <button
              key={src.id}
              onClick={() => {
                onToggleSource(src.id);
                setImportOpen(true);
              }}
              className={cn(
                "flex flex-col items-center p-5 rounded-lg border-[1.5px] transition-all duration-200 text-center",
                isSelected
                  ? "border-primary bg-primary-light"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              <src.icon size={28} className={cn(src.color, "mb-2")} />
              <span className="text-[14px] font-medium text-foreground mb-1">{src.label}</span>
              {src.badge && (
                <Badge variant={src.badgeVariant!} className="text-[10px]">{src.badge}</Badge>
              )}
              {isSelected && (
                <Check size={16} className="text-primary mt-1.5" strokeWidth={2.5} />
              )}
            </button>
          );
        })}
      </div>

      {importedCount > 0 && (
        <div className="mb-4 rounded-lg bg-primary-light px-3 py-2.5 text-[13px] text-foreground flex items-center gap-2">
          <Check size={14} className="text-primary shrink-0" strokeWidth={2.5} />
          <span><strong>{importedCount}</strong> contact{importedCount === 1 ? "" : "s"} imported. Manage them on the Contacts page later.</span>
        </div>
      )}

      {/* Top 10 section */}
      <div className="mb-4">
        <p className="text-[15px] font-medium text-foreground mb-2">Or start with your Top 10</p>
        <div className="relative">
          <Input
            placeholder="Type a name to search your contacts..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-elevated z-10 overflow-hidden">
              {filteredSuggestions.slice(0, 4).map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    onAddContact(name);
                    setSearchText("");
                  }}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-2.5 hover:bg-secondary transition-colors"
                >
                  <Avatar size="sm" name={name} />
                  <span className="text-[14px]">{name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Added contacts chips */}
      {addedContacts.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {addedContacts.map((name) => (
            <div key={name} className="flex items-center gap-1.5 bg-primary-light rounded-full pl-1 pr-2 py-1">
              <Avatar size="sm" name={name} className="w-6 h-6 text-[9px]" />
              <span className="text-[12px] font-medium text-primary">{name}</span>
              <button onClick={() => onRemoveContact(name)} className="text-primary/60 hover:text-primary">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Helper text */}
      {addedContacts.length === 0 && selectedSources.length === 0 && (
        <p className="text-[13px] text-muted-foreground text-center mt-2">
          Even 3 contacts is enough to get started.
        </p>
      )}

      <ImportContactsDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  );
}
