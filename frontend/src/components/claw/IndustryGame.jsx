import { useEffect, useState } from "react";
import { Building2, UtensilsCrossed, Coffee, Gem, GraduationCap, Brain, Plane, ChevronRight } from "lucide-react";
import { Reveal, SectionHead } from "./Bits";
import { track } from "../../lib/analytics";

const INDUSTRIES = [
  { id: "real-estate", num: "01", name: "Real Estate", icon: Building2, funnel: ["Website", "Leads", "CRM", "Content", "Ads", "Conversion"], note: "Last campaign: +197 leads at ₹40.72 CPL." },
  { id: "hospitality", num: "02", name: "Hospitality", icon: UtensilsCrossed, funnel: ["Discovery", "Social", "Booking", "Retention"], note: "Direct bookings, not OTA dependence." },
  { id: "cafe-nightlife", num: "03", name: "Café & Nightlife", icon: Coffee, funnel: ["Hype", "Social", "Footfall", "Loyalty"], note: "Full houses are engineered, not wished for." },
  { id: "jewellery", num: "04", name: "Jewellery", icon: Gem, funnel: ["Brand", "Trust", "Showcase", "Consultation", "Sale"], note: "High-ticket needs high-trust experiences." },
  { id: "education", num: "05", name: "Education", icon: GraduationCap, funnel: ["Awareness", "Landing Page", "Counselling", "Enrolment"], note: "Admissions are a funnel, not a season." },
  { id: "coaching", num: "06", name: "Coaching", icon: Brain, funnel: ["Traffic", "Landing Page", "Lead", "Counselling", "Admission"], note: "Every click routed to a counsellor." },
  { id: "study-abroad", num: "07", name: "Study Abroad", icon: Plane, funnel: ["Reach", "Webinar", "Application", "Visa", "Departure"], note: "From first scroll to first flight." },
];

export default function IndustryGame() {
  const [selected, setSelected] = useState(0);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, [selected]);

  const active = INDUSTRIES[selected];

  return (
    <section id="industries" className="relative py-28 md:py-36 border-t border-white/5" data-testid="industry-section">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 relative">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <SectionHead
              testid="industry-head"
              kicker="SYS.01 // PLAYER SELECT"
              title={<>What's<br />Your Game?</>}
            />
            <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-claw-muted flex items-center gap-2 md:pb-6">
              Choose your industry <ChevronRight size={14} className="text-claw-cyan" />
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3" data-testid="industry-grid">
          {INDUSTRIES.map((ind, i) => {
            const Icon = ind.icon;
            const isActive = i === selected;
            return (
              <Reveal key={ind.id} delay={i * 60}>
                <button
                  data-testid={`industry-card-${ind.id}`}
                  onClick={() => {
                    setSelected(i);
                    track("industry_selected", { industry: ind.id });
                  }}
                  onMouseEnter={() => setSelected(i)}
                  className={`relative w-full min-h-[150px] p-5 flex flex-col items-center justify-center gap-3 border transition-all duration-300 group ${
                    isActive
                      ? "bg-claw-cyan border-claw-cyan text-black"
                      : "bg-claw-surface/70 border-white/10 text-claw-text hover:border-claw-cyan/50"
                  }`}
                >
                  <Icon
                    size={26}
                    className={`transition-all duration-300 ${isActive ? "text-black scale-110" : "text-claw-muted group-hover:text-claw-cyan group-hover:scale-110"}`}
                  />
                  <span className={`font-mono text-[10px] tracking-[0.15em] uppercase text-center leading-tight ${isActive ? "text-black" : "text-claw-text"}`}>
                    {ind.name}
                  </span>
                  <span className={`absolute bottom-2 font-mono text-[9px] ${isActive ? "text-black/60" : "text-claw-dim"}`}>{ind.num}</span>
                </button>
              </Reveal>
            );
          })}
        </div>

        <div
          className={`mt-10 border border-white/10 bg-claw-surface/50 backdrop-blur-sm p-6 md:p-10 transition-all duration-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          data-testid="industry-funnel-panel"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-claw-cyan" data-testid="industry-funnel-label">
              Gaming Plan // {active.name}
            </p>
            <p className="font-body italic text-claw-blue text-sm md:text-base -rotate-1" data-testid="industry-funnel-note">{active.note}</p>
          </div>
          <div className="flex flex-wrap items-center gap-y-4" data-testid="industry-funnel-steps">
            {active.funnel.map((step, i) => (
              <div key={`${active.id}-${step}`} className="flex items-center">
                <div
                  className="flex items-center gap-3 border border-white/15 bg-black/60 px-4 py-3 hover:border-claw-cyan/60 transition-colors"
                  data-testid={`funnel-step-${i}`}
                >
                  <span className="font-mono text-[9px] text-claw-dim">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-claw-text">{step}</span>
                </div>
                {i < active.funnel.length - 1 && (
                  <svg width="34" height="12" viewBox="0 0 34 12" className="mx-1 hidden sm:block">
                    <line x1="0" y1="6" x2="28" y2="6" stroke="#00F0FF" strokeWidth="1" className="flow-line" />
                    <path d="M26 2 L32 6 L26 10" fill="none" stroke="#00F0FF" strokeWidth="1" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute right-4 -top-4 hidden xl:block text-claw-blue font-body italic text-xl rotate-6 opacity-80 max-w-[160px] leading-tight pointer-events-none">
          We play every game to help you win.
        </div>
      </div>
    </section>
  );
}
