import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ClawMark } from "./Bits";
import { track } from "../../lib/analytics";

const LINKS = [
  { label: "WORK", href: "#work" },
  { label: "SOLUTIONS", href: "#solutions" },
  { label: "LAB", href: "#lab" },
  { label: "ABOUT", href: "#why" },
  { label: "CONTACT", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-[100] bg-black/60 backdrop-blur-xl border-b border-white/5" data-testid="navbar">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 glitch-hover" data-testid="nav-logo">
          <ClawMark className="h-7 w-7" />
          <span className="font-display text-lg md:text-xl tracking-tight uppercase text-claw-text">CLAW MEDIA</span>
        </a>

        <nav className="hidden lg:flex items-center gap-9" data-testid="nav-links">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className="font-mono text-[11px] tracking-[0.25em] uppercase text-claw-muted hover:text-claw-cyan transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <span className="hidden md:flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-claw-muted" data-testid="nav-status">
            <span className="w-1.5 h-1.5 rounded-full bg-claw-cyan animate-pulse-dot" />
            ONLINE
          </span>
          <a
            href="#contact"
            data-testid="nav-play-button"
            onClick={() => track("nav_play_click")}
            className="relative group hidden sm:inline-flex px-5 py-2.5 bg-claw-cyan text-black font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-claw-text transition-colors"
          >
            <span className="reticle-corner reticle-tl" />
            <span className="reticle-corner reticle-tr" />
            <span className="reticle-corner reticle-bl" />
            <span className="reticle-corner reticle-br" />
            Play With Us →
          </a>
          <button
            className="lg:hidden text-claw-text"
            onClick={() => setOpen(!open)}
            data-testid="nav-menu-toggle"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/5 bg-black/95 backdrop-blur-xl" data-testid="nav-mobile-menu">
          <div className="flex flex-col px-6 py-4">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                data-testid={`nav-mobile-link-${l.label.toLowerCase()}`}
                className="font-mono text-sm tracking-[0.25em] uppercase text-claw-muted hover:text-claw-cyan py-3 border-b border-white/5 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              data-testid="nav-mobile-play-button"
              className="mt-4 mb-2 text-center px-5 py-3 bg-claw-cyan text-black font-mono text-xs uppercase tracking-[0.2em]"
            >
              Play With Us →
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
