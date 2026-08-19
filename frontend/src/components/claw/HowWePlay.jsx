import { Reveal, SectionHead } from "./Bits";

const LEVELS = [
  { num: "01", title: "Understand", desc: "We study your business — the market, the margins, the moves your competitors missed.", xp: "+100 XP" },
  { num: "02", title: "Build", desc: "We create your digital infrastructure — website, brand, CRM, the whole machine.", xp: "+250 XP" },
  { num: "03", title: "Launch", desc: "We put the brand into the market — campaigns live, content rolling, ads firing.", xp: "+400 XP" },
  { num: "04", title: "Optimize", desc: "We measure what's working — every click, every lead, every rupee accounted for.", xp: "+650 XP" },
  { num: "05", title: "Scale", desc: "We double down on what wins — budget, reach and systems pointed at the winners.", xp: "+1000 XP" },
];

export default function HowWePlay() {
  return (
    <section className="relative py-28 md:py-36 border-t border-white/5" data-testid="process-section">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <Reveal>
          <SectionHead
            testid="process-head"
            kicker="SYS.04 // METHODOLOGY"
            title={<>How We Play</>}
            note="Five levels. No mystery. You always know which level your business is on."
          />
        </Reveal>

        <div className="relative border-l border-white/10 ml-2 md:ml-6" data-testid="process-levels">
          {LEVELS.map((lvl, i) => (
            <Reveal key={lvl.num} delay={i * 80}>
              <div
                className="relative pl-10 md:pl-16 py-8 md:py-10 group border-b border-white/5 last:border-b-0"
                data-testid={`process-level-${lvl.num}`}
              >
                <span className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-claw-surface border border-claw-cyan/60 group-hover:bg-claw-cyan transition-colors" />
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-10">
                  <div className="flex items-center gap-4 md:w-56 shrink-0">
                    <span className="font-mono text-[11px] tracking-[0.3em] text-claw-cyan uppercase">Level {lvl.num}</span>
                    <span className="font-mono text-[10px] text-claw-dim border border-white/10 px-2 py-0.5">{lvl.xp}</span>
                  </div>
                  <h3 className="font-display text-4xl md:text-6xl uppercase tracking-tight text-claw-text/90 group-hover:text-claw-cyan group-hover:translate-x-2 transition-all duration-300 md:w-72 shrink-0">
                    {lvl.title}
                  </h3>
                  <p className="font-body text-claw-muted text-base md:text-lg max-w-xl">{lvl.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
