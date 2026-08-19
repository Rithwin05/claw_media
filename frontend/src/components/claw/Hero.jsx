import { useEffect, useRef } from "react";
import { MoreHorizontal, Play, Eye, MessageCircle } from "lucide-react";
import { ReticleButton } from "./Bits";
import { track, waLink } from "../../lib/analytics";

const HERO_IMG =
  "https://images.unsplash.com/photo-1757356657991-c3fd6e2e812e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjByZWFsJTIwZXN0YXRlJTIwYXJjaGl0ZWN0dXJlJTIwbW9kZXJuJTIwZGFyayUyMGRlc2lnbnxlbnwwfHx8fDE3ODcxNTE3OTd8MA&ixlib=rb-4.1.0&q=85";

function HangingBoard() {
  const boardRef = useRef(null);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return undefined;
    const onMove = (e) => {
      const rect = board.getBoundingClientRect();
      const bx = rect.left + rect.width / 2;
      const by = rect.top + rect.height / 2;
      const dx = e.clientX - bx;
      const dy = e.clientY - by;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 300) {
        const intensity = 1 - dist / 300;
        const angle = (dx / 300) * 10 * intensity;
        board.style.animation = "none";
        board.style.transform = `rotate(${angle}deg)`;
      } else {
        board.style.animation = "";
        board.style.transform = "";
      }
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={boardRef} className="hanging-board-container" data-testid="hero-hanging-board" style={{ right: "0", top: "100%" }}>
      <svg
        width="110"
        height="120"
        viewBox="0 0 120 160"
        style={{ position: "absolute", top: "-112px", left: "50%", transform: "translateX(-50%)", overflow: "visible", zIndex: -1 }}
      >
        <g fill="none" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
          <path d="M60 10 C60 -5, 45 -5, 45 10" stroke="#222" strokeWidth="5" />
          <path d="M60 10 L60 90" strokeDasharray="8 6" />
          <path d="M60 90 L30 155" strokeDasharray="8 6" />
          <path d="M60 90 L90 155" strokeDasharray="8 6" />
          <circle cx="60" cy="90" fill="#222" r="4" stroke="#444" strokeWidth="2" />
          <circle cx="30" cy="155" fill="#222" r="4" stroke="#444" strokeWidth="2" />
          <circle cx="90" cy="155" fill="#222" r="4" stroke="#444" strokeWidth="2" />
        </g>
      </svg>
      <div className="metallic-board px-7 py-5 flex flex-col items-center justify-center min-w-[220px]">
        <span className="rivet tl" />
        <span className="rivet tr" />
        <span className="rivet bl" />
        <span className="rivet br" />
        <div className="neon-text-glow font-display text-4xl md:text-5xl uppercase whitespace-nowrap tracking-wider leading-none">CLAW</div>
        <div className="flex items-center gap-2 mt-2 opacity-90">
          <span className="w-5 h-px bg-claw-cyan shadow-[0_0_8px_#00F0FF]" />
          <span className="text-claw-cyan font-mono text-[10px] tracking-[0.4em] uppercase">STUDIO</span>
          <span className="w-5 h-px bg-claw-cyan shadow-[0_0_8px_#00F0FF]" />
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center overflow-hidden pt-32 pb-40" data-testid="hero-section">
      <div className="technical-grid-bg absolute inset-0 opacity-25 pointer-events-none" />
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        <div className="lg:col-span-7 flex flex-col justify-center">
          <p className="font-mono text-[11px] tracking-[0.3em] text-claw-cyan uppercase mb-8" data-testid="hero-kicker">
            Welcome to CLAW MEDIA // SYS.READY
          </p>
          <h1 className="font-display uppercase leading-[0.92] tracking-tight text-claw-text text-[15vw] sm:text-7xl lg:text-8xl xl:text-[7.5rem]" data-testid="hero-title">
            <span className="block">Let Us</span>
            <span className="block">Play Your</span>
            <span className="block relative w-fit text-claw-cyan italic pb-24 md:pb-28">
              Marketing
              <HangingBoard />
            </span>
            <span className="block">Game.</span>
          </h1>
          <p className="font-mono text-xs md:text-sm tracking-[0.35em] text-claw-muted uppercase mt-10 mb-12" data-testid="hero-tagline">
            Tech × Media × Marketing
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <ReticleButton testid="hero-start-game-button" href="#industries" onClick={() => track("hero_cta_click")}>
              Start the Game →
            </ReticleButton>
            {waLink && (
              <ReticleButton testid="hero-whatsapp-button" variant="ghost" href={waLink} onClick={() => track("hero_whatsapp_click")}>
                <MessageCircle size={14} /> WhatsApp CLAW
              </ReticleButton>
            )}
            <div className="hidden md:flex items-center gap-2 -rotate-6 opacity-60 ml-4">
              <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
                <path d="M1 19C15 19 25 10 39 1" stroke="#F5F5F5" strokeLinecap="round" strokeWidth="1.5" />
                <path d="M30 1L39 1L39 10" stroke="#F5F5F5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
              <span className="font-mono text-[10px] text-claw-text italic">Scroll to know more</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative hidden lg:block" data-testid="hero-control-room">
          <div className="absolute top-4 right-2 w-64 bg-claw-card/90 border border-white/10 p-4 shadow-2xl backdrop-blur-md rotate-3 animate-float hover-glow z-20" style={{ "--tilt": "3deg" }} data-testid="hero-card-realestate">
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono text-[10px] tracking-[0.2em] text-claw-text uppercase">Real Estate</span>
              <MoreHorizontal size={14} className="text-claw-cyan" />
            </div>
            <div className="w-full h-32 bg-black relative overflow-hidden mb-3 border border-white/10">
              <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url('${HERO_IMG}')` }} />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="font-mono text-[9px] tracking-[0.2em] text-claw-muted uppercase">Leads</p>
                <p className="font-display text-2xl text-claw-text">197</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[9px] tracking-[0.2em] text-claw-muted uppercase">Growth</p>
                <p className="font-display text-xl text-claw-cyan">+32%</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 w-72 bg-claw-card/90 border border-white/10 p-4 shadow-xl backdrop-blur-md -rotate-2 animate-float hover-glow z-30" style={{ "--tilt": "-2deg", animationDelay: "1.4s" }} data-testid="hero-card-campaign">
            <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
              <span className="font-mono text-[10px] tracking-[0.2em] text-claw-text uppercase">Digital Campaign</span>
              <Eye size={14} className="text-claw-muted" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-claw-cyan/10 rounded-full flex items-center justify-center border border-claw-cyan/20">
                <Play size={18} className="text-claw-cyan" />
              </div>
              <div>
                <p className="font-mono text-[9px] tracking-[0.2em] text-claw-muted uppercase">Reach</p>
                <p className="font-display text-xl text-claw-text">144K</p>
              </div>
              <div>
                <p className="font-mono text-[9px] tracking-[0.2em] text-claw-muted uppercase">Engmt.</p>
                <p className="font-display text-xl text-claw-cyan">7.2K</p>
              </div>
            </div>
          </div>

          <div className="absolute top-[46%] right-0 w-56 bg-claw-card/90 border border-claw-cyan/30 p-3 shadow-xl backdrop-blur-md rotate-1 animate-float hover-glow z-40" style={{ "--tilt": "1deg", animationDelay: "2.6s" }} data-testid="hero-card-alert">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-claw-cyan animate-pulse-dot" />
              <span className="font-mono text-[9px] tracking-[0.2em] text-claw-cyan uppercase">Live // Lead Alert</span>
            </div>
            <p className="font-mono text-[10px] text-claw-text">New enquiry — Kings Pride Infra</p>
            <p className="font-mono text-[10px] text-claw-muted mt-1">CPL ₹40.72 · 2m ago</p>
          </div>

          <div className="absolute top-[64%] left-[-6%] -rotate-[8deg] z-40 bg-claw-blue text-claw-text px-4 py-1.5 font-display text-lg uppercase tracking-wider" data-testid="hero-banner">
            We Build. We Grow. You Win.
          </div>
        </div>
      </div>
    </section>
  );
}
