import { FlaskConical } from "lucide-react";
import { Reveal, SectionHead } from "./Bits";

const EXPERIMENTS = [
  { id: "ai-agents", num: "EXP.01", title: "AI Marketing Agents", desc: "Autonomous agents that plan, launch and tune campaigns while you sleep.", status: "BUILDING" },
  { id: "web-experiences", num: "EXP.02", title: "New Web Experiences", desc: "Sites that behave like games, tools and stories — not brochures.", status: "TESTING" },
  { id: "campaign-experiments", num: "EXP.03", title: "Campaign Experiments", desc: "Structured creative testing frameworks that find winners fast.", status: "LIVE" },
  { id: "creator-systems", num: "EXP.04", title: "Creator Systems", desc: "Repeatable content engines for founders and brands.", status: "TESTING" },
  { id: "automation", num: "EXP.05", title: "Marketing Automation", desc: "WhatsApp, CRM and follow-up flows that never drop a lead.", status: "LIVE" },
  { id: "intelligence", num: "EXP.06", title: "Data & Intelligence", desc: "Dashboards that tell you the next move, not just the last one.", status: "BUILDING" },
];

const STATUS_STYLE = {
  LIVE: "text-claw-cyan border-claw-cyan/40 bg-claw-cyan/10",
  TESTING: "text-claw-blue border-claw-blue/40 bg-claw-blue/10",
  BUILDING: "text-claw-muted border-white/15 bg-white/5",
};

export default function ClawLab() {
  return (
    <section id="lab" className="relative py-28 md:py-36 border-t border-white/5" data-testid="lab-section">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <Reveal>
          <SectionHead
            testid="lab-head"
            kicker="SYS.07 // R&D"
            title={<>The CLAW Lab</>}
            note="Things we're building, testing and breaking. This is where the agency becomes a technology company."
          />
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXPERIMENTS.map((exp, i) => (
            <Reveal key={exp.id} delay={i * 70} className="h-full">
              <div
                className="h-full border border-white/10 bg-claw-surface/50 p-7 flex flex-col gap-4 hover-glow group"
                data-testid={`lab-card-${exp.id}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-claw-dim">{exp.num}</span>
                  <span className={`font-mono text-[9px] tracking-[0.25em] uppercase border px-2.5 py-1 ${STATUS_STYLE[exp.status]}`}>
                    {exp.status}
                  </span>
                </div>
                <FlaskConical size={22} className="text-claw-muted group-hover:text-claw-cyan transition-colors" />
                <h3 className="font-display text-2xl uppercase tracking-tight text-claw-text">{exp.title}</h3>
                <p className="font-body text-sm text-claw-muted leading-relaxed">{exp.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
