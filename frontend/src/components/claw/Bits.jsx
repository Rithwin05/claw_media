import { useEffect, useRef, useState } from "react";

export const ClawMark = ({ className = "h-8 w-8" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
    <g stroke="#00F0FF" strokeWidth="5" strokeLinecap="round">
      <path d="M14 8 L30 52" />
      <path d="M28 8 L44 52" />
      <path d="M42 8 L58 52" />
    </g>
  </svg>
);

export const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVis(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${vis ? "revealed" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export const SectionHead = ({ kicker, title, note, testid }) => (
  <div className="mb-14 md:mb-20">
    {kicker && (
      <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-claw-cyan mb-5" data-testid={testid ? `${testid}-kicker` : undefined}>
        {kicker}
      </p>
    )}
    <h2
      className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.95] tracking-tight text-claw-text"
      data-testid={testid ? `${testid}-title` : undefined}
    >
      {title}
    </h2>
    {note && <p className="font-body text-claw-muted mt-6 max-w-xl text-base md:text-lg">{note}</p>}
  </div>
);

const Corners = () => (
  <>
    <span className="reticle-corner reticle-tl opacity-0 group-hover:opacity-100 transition-opacity" />
    <span className="reticle-corner reticle-tr opacity-0 group-hover:opacity-100 transition-opacity" />
    <span className="reticle-corner reticle-bl opacity-0 group-hover:opacity-100 transition-opacity" />
    <span className="reticle-corner reticle-br opacity-0 group-hover:opacity-100 transition-opacity" />
  </>
);

export const ReticleButton = ({ children, variant = "primary", className = "", testid, onClick, href, type, disabled }) => {
  const base =
    "relative group inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 px-7 py-4 select-none";
  const styles =
    variant === "primary"
      ? "bg-claw-cyan text-black hover:bg-claw-text disabled:opacity-50"
      : "bg-transparent border border-white/25 text-claw-text hover:border-claw-cyan hover:text-claw-cyan disabled:opacity-50";
  const inner = (
    <>
      <Corners />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );
  if (href) {
    return (
      <a href={href} data-testid={testid} onClick={onClick} className={`${base} ${styles} ${className}`} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type || "button"} data-testid={testid} onClick={onClick} disabled={disabled} className={`${base} ${styles} ${className}`}>
      {inner}
    </button>
  );
};

export const Marquee = ({ items, reverse = false, testid }) => {
  const row = items.join("  //  ");
  return (
    <div className="relative w-full overflow-hidden border-y border-white/5 bg-claw-surface/40 py-4" data-testid={testid}>
      <div className={`flex whitespace-nowrap animate-marquee ${reverse ? "marquee-reverse" : ""}`}>
        {[0, 1].map((i) => (
          <span key={i} className="font-display text-xl md:text-2xl uppercase tracking-wide text-white/20 px-4">
            {row}  //  {row}  //&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
};

export const HandNote = ({ children, className = "" }) => (
  <span className={`font-body italic text-claw-blue text-lg md:text-xl ${className}`} style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
    {children}
  </span>
);
