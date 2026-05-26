import { FadeIn } from "@/components/FadeIn";
import { Unplug, MailX, Clock } from "lucide-react";

const problems = [
  {
    icon: Unplug,
    text: "You meet the right people. Then life gets busy.",
  },
  {
    icon: MailX,
    text: "You mean to follow up. But the moment passes.",
  },
  {
    icon: Clock,
    text: "Months later, reaching out feels awkward.",
  },
];

export function ProblemSection() {
  return (
    <section className="bg-card py-16 md:py-20 px-5">
      <div className="max-w-[760px] mx-auto">
        <FadeIn>
          <p className="text-caption text-primary mb-3">THE PROBLEM</p>
          <h2 className="text-[22px] md:text-[28px] font-semibold leading-tight text-foreground mb-10">
            Relationships don't end. They just go unattended.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10">
          {problems.map((p, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="text-center md:text-left">
                <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mx-auto md:mx-0 mb-4">
                  <p.icon size={22} className="text-primary" />
                </div>
                <p className="text-[15px] text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={300}>
          <p className="text-[15px] md:text-[17px] text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-4">
            The modern world is extraordinarily good at helping people meet. It has built almost nothing to help them stay connected after they do.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
