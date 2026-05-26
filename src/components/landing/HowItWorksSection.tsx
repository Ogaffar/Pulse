import { FadeIn } from "@/components/FadeIn";

const steps = [
  {
    num: "1",
    title: "Set your goals",
    desc: "Tell Pulse what you're working toward and who matters most. Takes 3 minutes.",
  },
  {
    num: "2",
    title: "Get intelligent nudges",
    desc: "Pulse monitors your network and surfaces the right contact with a reason that's actually relevant.",
  },
  {
    num: "3",
    title: "Send with one tap",
    desc: "Approve the AI-drafted message, edit if you want, and reconnect — without leaving the app.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-card py-16 md:py-20 px-5">
      <div className="max-w-4xl mx-auto">
        <FadeIn className="text-center mb-10 md:mb-14">
          <h2 className="text-[22px] md:text-[28px] font-semibold text-foreground">
            From zero to your first reconnection in under 5 minutes
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-6 left-[16.66%] right-[16.66%] h-px border-t-2 border-dashed border-primary/30" />

          {steps.map((s, i) => (
            <FadeIn key={i} delay={i * 150} className="text-center relative">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[18px] font-semibold mx-auto mb-4 relative z-10">
                {s.num}
              </div>
              <h3 className="text-[16px] font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                {s.desc}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
