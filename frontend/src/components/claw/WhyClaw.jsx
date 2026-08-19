import { Reveal, SectionHead } from "./Bits";

const TRUTHS = [
  { claim: "We don't just make content.", answer: "We build the system around it." },
  { claim: "We don't just run ads.", answer: "We connect attention to conversion." },
  { claim: "We don't just build websites.", answer: "We build digital experiences that work." },
  { claim: "We don't chase trends.", answer: "We build things worth remembering." },
];

export default function WhyClaw() {
  return (
    <section id="why" className="relative py-28 md:py-36 border-t border-white/5" data-testid="why-section">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <Reveal>
          <SectionHead testid="why-head" kicker="SYS.08 // MANIFESTO" title={<>Why The CLAW?</>} />
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
          {TRUTHS.map((t, i) => (
            <Reveal key={t.claim} delay={i * 80}>
              <div className="border-t border-white/10 py-10 md:py-12 group" data-testid={`why-statement-${i + 1}`}>
                <span className="font-mono text-[10px] tracking-[0.3em] text-claw-dim">0{i + 1}</span>
                <h3 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-claw-text mt-4 leading-tight group-hover:text-claw-cyan transition-colors duration-300">
                  {t.claim}
                </h3>
                <p className="font-body text-lg md:text-xl text-claw-muted mt-4 italic">{t.answer}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
