import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHead } from "./Bits";
import { track } from "../../lib/analytics";

const CASES = [
  {
    id: "kings-pride",
    name: "Kings Pride Infra",
    cat: "Real Estate",
    tags: ["Website", "Brand Experience", "Lead Generation", "Performance Marketing"],
    metrics: [
      ["+197", "Leads"],
      ["₹40.72", "CPL"],
    ],
    img: "https://images.unsplash.com/photo-1757356657991-c3fd6e2e812e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjByZWFsJTIwZXN0YXRlJTIwYXJjaGl0ZWN0dXJlJTIwbW9kZXJuJTIwZGFyayUyMGRlc2lnbnxlbnwwfHx8fDE3ODcxNTE3OTd8MA&ixlib=rb-4.1.0&q=85",
    status: "CAMPAIGN WON",
  },
  {
    id: "shonitara",
    name: "Shonitara",
    cat: "D2C / Cultural Brand",
    tags: ["Brand", "Campaign", "Digital Experience", "Growth"],
    metrics: [
      ["360°", "Brand Build"],
      ["D2C", "Launch"],
    ],
    img: "https://images.pexels.com/photos/30541170/pexels-photo-30541170.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    status: "BRAND BUILT",
  },
  {
    id: "sbj",
    name: "SBJ",
    cat: "Jewellery",
    tags: ["Brand Experience", "Website", "Creative", "Social"],
    metrics: [
      ["FULL", "Rebrand"],
      ["360°", "System"],
    ],
    img: "https://images.pexels.com/photos/30541188/pexels-photo-30541188.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    status: "SYSTEM LIVE",
  },
];

export default function CaseStudies() {
  return (
    <section id="work" className="relative py-28 md:py-36 border-t border-white/5" data-testid="work-section">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <Reveal>
          <SectionHead
            testid="work-head"
            kicker="SYS.05 // SCOREBOARD"
            title={<>The Games<br />We've Played</>}
            note="Real clients. Real numbers. No vanity metrics."
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {CASES.map((cs, i) => (
            <Reveal key={cs.id} delay={i * 100} className="h-full">
              <article
                className="group h-full flex flex-col bg-claw-surface/60 border border-white/10 hover-glow overflow-hidden"
                data-testid={`case-card-${cs.id}`}
                onClick={() => track("case_study_opened", { case: cs.id })}
              >
                <div className="relative h-64 md:h-72 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    style={{ backgroundImage: `url('${cs.img}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <span className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.25em] uppercase bg-black/70 border border-claw-cyan/40 text-claw-cyan px-3 py-1.5">
                    {cs.status}
                  </span>
                  <ArrowUpRight
                    size={20}
                    className="absolute top-4 right-4 text-claw-text opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="flex flex-col flex-1 p-7">
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-claw-cyan mb-3">{cs.cat}</p>
                  <h3 className="font-display text-3xl md:text-4xl uppercase tracking-tight text-claw-text mb-5">{cs.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-7">
                    {cs.tags.map((t) => (
                      <span key={t} className="font-mono text-[9px] tracking-[0.15em] uppercase text-claw-muted border border-white/10 px-2.5 py-1">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex gap-10 border-t border-white/10 pt-5">
                    {cs.metrics.map(([val, label]) => (
                      <div key={label}>
                        <p className="font-display text-3xl text-claw-cyan">{val}</p>
                        <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-claw-muted mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
