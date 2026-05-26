import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronLeft, EyeOff } from "lucide-react";

interface SuppressedContact {
  id: string;
  name: string;
  suppressedDate: string;
}

const initialSuppressed: SuppressedContact[] = [
  { id: "s1", name: "Jordan Banks", suppressedDate: "Jan 5, 2026" },
  { id: "s2", name: "Lisa Park", suppressedDate: "Dec 20, 2025" },
];

export default function SuppressedPage() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState(initialSuppressed);

  const restore = (id: string) => {
    const c = contacts.find((x) => x.id === id);
    setContacts(contacts.filter((x) => x.id !== id));
    toast.success(`Restored. ${c?.name} will start appearing in your nudges again.`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="h-14 flex items-center px-4 border-b border-border bg-card">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
          <ChevronLeft size={22} />
        </button>
        <h4 className="ml-2">Suppressed Contacts</h4>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-5">
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">
          These contacts will never appear in nudges, the health dashboard, or AI suggestions. Restore them anytime.
        </p>

        {contacts.length === 0 ? (
          <div className="text-center py-16">
            <EyeOff size={48} className="text-muted-foreground/40 mx-auto mb-4" />
            <h4 className="text-foreground mb-1">No suppressed contacts</h4>
            <p className="text-[14px] text-muted-foreground">
              Contacts you suppress appear here. You can always restore them.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {contacts.map((c) => (
              <div key={c.id} className="bg-card rounded-lg border border-border p-4 flex items-center gap-3">
                <div className="opacity-70">
                  <Avatar size="md" name={c.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-medium text-muted-foreground">{c.name}</p>
                  <p className="text-[13px] text-muted-foreground/70">Suppressed {c.suppressedDate}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary shrink-0 h-8 px-3"
                  onClick={() => restore(c.id)}
                >
                  Restore
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
