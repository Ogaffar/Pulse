import { FadeIn } from "@/components/FadeIn";

const capabilities = [
  "Smart Nudges",
  "AI Outreach",
  "Student-Native Pricing",
  "Messaging Integration",
  "Relationship Maintenance",
  "Privacy Controls",
];

const competitors: Record<string, boolean[]> = {
  LinkedIn: [false, false, false, true, false, false],
  Dex: [true, false, false, false, true, false],
  "Clay.earth": [true, false, false, false, true, false],
  Pulse: [true, true, true, true, true, true],
};

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="#E8F5EE" />
      <path d="M5.5 9.5L7.5 11.5L12.5 6.5" stroke="#1A6B4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashIcon() {
  return <span style={{ color: "#D0D0C8", fontSize: 14 }}>—</span>;
}

export function ComparisonSection() {
  const cols = Object.keys(competitors);

  return (
    <section className="bg-secondary py-16 md:py-20 px-5">
      <div className="max-w-[900px] mx-auto">
        <FadeIn>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#1A6B4A", marginBottom: 12 }}>WHY PULSE</p>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#1A1A18", marginBottom: 32 }}>
            The only product that does all of this.
          </h2>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="bg-card rounded-lg border border-[rgba(26,26,24,0.08)] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-5" style={{ background: "#F7F7F4" }}>
              <div className="p-3 md:p-4" />
              {cols.map((col) => (
                <div
                  key={col}
                  className="p-3 md:p-4 text-center"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: col === "Pulse" ? "#1A6B4A" : "#6B6B65",
                    ...(col === "Pulse"
                      ? { background: "rgba(26,107,74,0.04)", borderLeft: "2px solid rgba(26,107,74,0.2)", borderRight: "2px solid rgba(26,107,74,0.2)" }
                      : {}),
                  }}
                >
                  {col === "Pulse" && (
                    <span style={{ display: "block", background: "#1A6B4A", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 99, padding: "3px 10px", marginBottom: 6, textAlign: "center" }}>
                      ⭐ Our pick
                    </span>
                  )}
                  {col}
                </div>
              ))}
            </div>

            {/* Rows */}
            {capabilities.map((cap, ri) => (
              <div
                key={cap}
                className="grid grid-cols-5 transition-colors duration-150 hover:bg-[#FAFAF8]"
                style={{ borderBottom: ri < capabilities.length - 1 ? "1px solid rgba(26,26,24,0.06)" : "none" }}
              >
                <div className="p-3 md:p-4 text-[13px] md:text-[14px] text-foreground font-medium flex items-center">
                  {cap}
                </div>
                {cols.map((col) => {
                  const has = competitors[col][ri];
                  return (
                    <div
                      key={col}
                      className="p-3 md:p-4 flex items-center justify-center"
                      style={col === "Pulse" ? { background: "rgba(26,107,74,0.04)", borderLeft: "2px solid rgba(26,107,74,0.2)", borderRight: "2px solid rgba(26,107,74,0.2)" } : {}}
                    >
                      {has ? <CheckIcon /> : <DashIcon />}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <p className="text-[13px] text-muted-foreground text-center mt-4">
            Every competitor solves one part of the problem. Pulse solves all of it.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
