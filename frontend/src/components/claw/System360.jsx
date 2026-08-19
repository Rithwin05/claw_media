import { Reveal, SectionHead } from "./Bits";

const NODES = [
  { label: "Brand", sub: "Identity" },
  { label: "Media", sub: "Content" },
  { label: "Traffic", sub: "Ads" },
  { label: "Tech", sub: "Website" },
  { label: "Data", sub: "Analytics" },
  { label: "CRM", sub: "Leads" },
  { label: "Automation", sub: "Follow-up" },
];

export default function System360() {
  return (
    <section className="relative py-28 md:py-40 border-t border-white/5 overflow-hidden" data-testid="system360-section">
      <div className="technical-grid-bg absolute inset-0 opacity-15 pointer-events-none" />
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 relative">
        <Reveal>
          <SectionHead
            testid="system360-head"
            kicker="SYS.03 // THE 360° ENGINE"
            title={<>One Business.<br />One System.</>}
            note="Not seven vendors. Not twenty tools. One connected growth ecosystem — where every part feeds the next."
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="relative hidden lg:block w-full max-w-[680px] aspect-square mx-auto" data-testid="system360-radial">
            {NODES.map((n, i) => {
              const deg = (i / NODES.length) * 360 - 90;
              return (
                <div
                  key={`line-${n.label}`}
                  className="absolute left-1/2 top-1/2 h-px origin-left"
                  style={{ width: "42%", transform: `rotate(${deg}deg)` }}
                >
                  <div className="w-full border-t border-dashed border-claw-cyan/20" />
                </div>
              );
            })}

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-claw-cyan/40 bg-black/80 backdrop-blur flex flex-col items-center justify-center text-center animate-hub z-10" data-testid="system360-hub">
              <p className="font-display text-2xl uppercase leading-tight text-claw-text">One<br />Business.</p>
              <p className="font-display text-2xl uppercase leading-tight text-claw-cyan">One<br />System.</p>
            </div>

            {NODES.map((n, i) => {
              const deg = (i / NODES.length) * 360 - 90;
              const rad = (deg * Math.PI) / 180;
              const x = 50 + Math.cos(rad) * 42;
              const y = 50 + Math.sin(rad) * 42;
              return (
                <div
                  key={n.label}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  data-testid={`system360-node-${n.label.toLowerCase()}`}
                >
                  <div className="border border-white/15 bg-claw-surface/90 backdrop-blur px-4 py-2.5 group-hover:border-claw-cyan transition-colors">
                    <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-claw-text">{n.label}</p>
                  </div>
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-claw-dim">→ {n.sub}</p>
                </div>
              );
            })}
          </div>
        </Reveal>

        <div className="lg:hidden grid grid-cols-2 gap-3 mt-4" data-testid="system360-grid">
          {NODES.map((n) => (
            <div key={n.label} className="border border-white/10 bg-claw-surface/70 px-4 py-4 flex flex-col gap-1">
              <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-claw-text">{n.label}</p>
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-claw-dim">→ {n.sub}</p>
            </div>
          ))}
          <div className="border border-claw-cyan/50 bg-claw-cyan/10 px-4 py-4 flex flex-col justify-center">
            <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-claw-cyan">Growth</p>
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-claw-cyan/60">→ The Output</p>
          </div>
        </div>

        <Reveal delay={200}>
          <div className="hidden lg:flex flex-col items-center mt-2" data-testid="system360-growth">
            <div className="h-14 border-l border-dashed border-claw-cyan/40" />
            <div className="px-10 py-4 bg-claw-cyan text-black font-display text-2xl uppercase tracking-wider">
              Growth
            </div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-claw-muted mt-4">Everything connects back to it.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
