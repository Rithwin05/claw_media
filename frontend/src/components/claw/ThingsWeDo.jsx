import { Code2, PenTool, TrendingUp, Bot, ArrowUpRight } from "lucide-react";
import { Reveal, SectionHead } from "./Bits";
import { track } from "../../lib/analytics";

const SYSTEMS = [
  {
    id: "build",
    num: "01",
    name: "Build",
    icon: Code2,
    accent: "text-claw-blue",
    accentBg: "bg-claw-blue/10",
    items: ["Websites", "Landing Pages", "E-commerce", "Web Apps", "CRM & Software", "Custom Systems"],
  },
  {
    id: "create",
    num: "02",
    name: "Create",
    icon: PenTool,
    accent: "text-claw-text",
    accentBg: "bg-white/10",
    items: ["Brand Identity", "Creative Direction", "Content & Video", "Social Media", "Campaigns", "Design Systems"],
  },
  {
    id: "grow",
    num: "03",
    name: "Grow",
    icon: TrendingUp,
    accent: "text-claw-cyan",
    accentBg: "bg-claw-cyan/10",
    items: ["Performance Marketing", "Lead Generation", "SEO & Growth", "Conversion Funnels", "Analytics & Reporting", "Marketing Strategy"],
  },
  {
    id: "automate",
    num: "04",
    name: "Automate",
    icon: Bot,
    accent: "text-claw-blue",
    accentBg: "bg-claw-blue/10",
    items: ["AI Automation", "CRM Automation", "WhatsApp Automation", "Lead Nurturing", "Workflow Systems", "Marketing Intelligence"],
  },
];

export default function ThingsWeDo() {
  return (
    <section id="solutions" className="relative py-28 md:py-36 border-t border-white/5" data-testid="solutions-section">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3">
          <Reveal>
            <SectionHead testid="solutions-head" kicker="SYS.02 // CAPABILITIES" title={<>Things<br />We Do</>} />
          </Reveal>
          <Reveal delay={150}>
            <div className="text-claw-cyan font-display text-2xl -rotate-3 opacity-80 mt-6 hidden lg:block" data-testid="solutions-annotation">
              360°<br />Growth<br />System
              <svg className="mt-2 ml-8" width="60" height="20" viewBox="0 0 60 20" fill="none">
                <path d="M1 19C20 19 40 10 59 1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                <path d="M50 1L59 1L59 10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SYSTEMS.map((sys, i) => {
            const Icon = sys.icon;
            return (
              <Reveal key={sys.id} delay={i * 90}>
                <div
                  className="h-full bg-claw-card/70 backdrop-blur-sm p-8 border border-white/10 hover-glow group"
                  data-testid={`service-card-${sys.id}`}
                >
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${sys.accentBg} flex items-center justify-center`}>
                        <Icon size={20} className={sys.accent} />
                      </div>
                      <h3 className="font-mono text-sm tracking-[0.3em] uppercase text-claw-text">{sys.name}</h3>
                    </div>
                    <span className="font-mono text-[10px] text-claw-dim">{sys.num}</span>
                  </div>
                  <ul className="flex flex-col gap-3 mb-8">
                    {sys.items.map((item) => (
                      <li key={item} className="font-mono text-[13px] text-claw-muted flex items-center gap-3 group-hover:text-claw-text/80 transition-colors">
                        <span className="w-1 h-1 bg-claw-cyan/50 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    data-testid={`service-explore-${sys.id}`}
                    onClick={() => track("service_clicked", { system: sys.id })}
                    className="font-mono text-[11px] tracking-[0.25em] uppercase text-claw-cyan/80 hover:text-claw-cyan inline-flex items-center gap-2 transition-colors"
                  >
                    Explore <ArrowUpRight size={13} />
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
