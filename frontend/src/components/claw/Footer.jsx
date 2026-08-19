import { Instagram, Linkedin, Youtube, Mail } from "lucide-react";
import { ClawMark } from "./Bits";

const COLS = [
  { head: "Studio", links: [["Work", "#work"], ["Solutions", "#solutions"]] },
  { head: "Intelligence", links: [["Lab", "#lab"], ["Playground", "#play"]] },
  { head: "Company", links: [["About", "#why"], ["Contact", "#contact"]] },
];

const SOCIALS = [
  { icon: Instagram, label: "Instagram", href: "#", id: "instagram" },
  { icon: Linkedin, label: "LinkedIn", href: "#", id: "linkedin" },
  { icon: Youtube, label: "YouTube", href: "#", id: "youtube" },
  { icon: Mail, label: "Email", href: "mailto:hello@clawmedia.in", id: "email" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-claw-surface/60 backdrop-blur-md" data-testid="footer">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/5 pb-12">
          <div className="md:col-span-5 flex flex-col gap-6">
            <a href="#top" className="flex items-center gap-3 glitch-hover w-fit" data-testid="footer-logo">
              <ClawMark className="h-8 w-8" />
              <span className="font-display text-2xl tracking-tight uppercase text-claw-text">CLAW MEDIA</span>
            </a>
            <p className="font-mono text-[11px] tracking-[0.3em] text-claw-muted uppercase">Tech × Media × Marketing</p>
            <p className="font-display text-xl uppercase text-claw-text/80">Build. Create. Grow.</p>
            <div className="flex gap-3">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.id}
                    href={s.href}
                    aria-label={s.label}
                    data-testid={`footer-social-${s.id}`}
                    className="w-10 h-10 border border-white/10 flex items-center justify-center text-claw-muted hover:text-claw-cyan hover:border-claw-cyan/50 transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>
          {COLS.map((col) => (
            <div key={col.head} className="md:col-span-2 flex flex-col gap-4">
              <h4 className="font-mono text-[10px] tracking-[0.3em] uppercase text-claw-dim">{col.head}</h4>
              <nav className="flex flex-col gap-2.5">
                {col.links.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    data-testid={`footer-link-${label.toLowerCase()}`}
                    className="font-mono text-[11px] tracking-[0.2em] uppercase text-claw-muted hover:text-claw-cyan transition-colors w-fit"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          ))}
          <div className="md:col-span-1" />
        </div>
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.2em] text-claw-dim uppercase" data-testid="footer-copyright">
            © 2026 CLAW MEDIA — Let us play your marketing game.
          </span>
          <span className="font-mono text-[10px] tracking-[0.3em] text-claw-cyan uppercase flex items-center gap-2" data-testid="footer-status">
            <span className="w-1.5 h-1.5 rounded-full bg-claw-cyan animate-pulse-dot" />
            System Ready // 001
          </span>
        </div>
      </div>
    </footer>
  );
}
