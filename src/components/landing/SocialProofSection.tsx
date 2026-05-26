import { Avatar } from "@/components/ui/avatar";
import { FadeIn } from "@/components/FadeIn";

const quotes = [
  {
    text: "I have a spreadsheet of people I should keep in touch with. I open it maybe once a month. That tells you how well it works.",
    name: "Maya",
    role: "MBA Student",
  },
  {
    text: "I had 12 years of relationships in finance. I moved cities and within a year felt like I was starting over.",
    name: "Marcus",
    role: "Finance Manager",
  },
  {
    text: "I want something that knows my world is big and complicated and helps me stay in all of it.",
    name: "Adaeze",
    role: "Diaspora Professional",
  },
];

export function SocialProofSection() {
  return (
    <section className="bg-secondary py-12 md:py-16 px-5">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <p className="text-center text-[18px] md:text-[22px] font-semibold text-foreground mb-8 md:mb-10">
            Built from real conversations with professionals just like you
          </p>
        </FadeIn>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {quotes.map((q, i) => (
            <FadeIn key={i} delay={i * 100} className="snap-start">
              <div className="min-w-[280px] md:min-w-0 bg-card rounded-lg p-5 border border-[rgba(26,26,24,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated relative" style={{ borderLeft: "3px solid #1A6B4A", borderRadius: "0 12px 12px 0" }}>
                {/* Decorative quote */}
                <span style={{ position: "absolute", top: 12, left: 16, fontSize: 48, color: "#E8F5EE", lineHeight: 1, fontFamily: "Georgia, serif", pointerEvents: "none" }}>❝</span>
                <p className="text-[15px] text-foreground leading-relaxed mb-5" style={{ paddingTop: 20 }}>
                  "{q.text}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar size="md" name={q.name} />
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-foreground">{q.name}</p>
                    <p className="text-caption text-muted-foreground">{q.role}</p>
                  </div>
                  <span style={{ fontSize: 10, color: "#1A6B4A", background: "#E8F5EE", borderRadius: 99, padding: "2px 8px", fontWeight: 500 }}>✓ Real user interview</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
