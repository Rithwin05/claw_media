import { useEffect, useState } from "react";

export default function Preloader({ onEnter }) {
  const [phase, setPhase] = useState(0);
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (phase !== 2) return undefined;
    const iv = setInterval(() => {
      setPct((p) => {
        if (p >= 100) {
          clearInterval(iv);
          setPhase(3);
          return 100;
        }
        return Math.min(100, p + Math.ceil(Math.random() * 5));
      });
    }, 40);
    return () => clearInterval(iv);
  }, [phase]);

  const start = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onEnter, 750);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter" && phase === 3) start();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, leaving]);

  return (
    <div
      data-testid="preloader"
      className={`fixed inset-0 z-[9990] bg-black flex flex-col items-center justify-center transition-all duration-700 ${
        leaving ? "-translate-y-full opacity-90" : ""
      }`}
    >
      <div className="technical-grid-bg absolute inset-0 opacity-20 pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex gap-3 md:gap-5" data-testid="preloader-claw-word">
          {["C", "L", "A", "W"].map((l, i) => (
            <span
              key={l}
              className={`font-display text-6xl md:text-8xl text-claw-text transition-all duration-500 ${
                phase >= 0 ? "opacity-100 translate-y-0" : ""
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {l}
            </span>
          ))}
        </div>
        <p
          className={`font-mono text-sm md:text-base tracking-[0.6em] text-claw-cyan mt-3 transition-all duration-700 ${
            phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          data-testid="preloader-media-word"
        >
          M E D I A
        </p>

        <div className={`mt-14 w-64 md:w-80 transition-opacity duration-500 ${phase >= 2 ? "opacity-100" : "opacity-0"}`}>
          <div className="flex justify-between font-mono text-[10px] tracking-[0.25em] text-claw-muted mb-2">
            <span data-testid="preloader-loading-label">LOADING THE GAME...</span>
            <span className="text-claw-cyan" data-testid="preloader-percent">{pct}%</span>
          </div>
          <div className="h-px bg-white/10 w-full">
            <div className="h-px bg-claw-cyan transition-all duration-100" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div
          className={`mt-12 flex flex-col items-center gap-5 transition-all duration-700 ${
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <p className="font-display text-2xl md:text-3xl text-claw-text tracking-wide" data-testid="preloader-ready">READY?</p>
          <button
            data-testid="preloader-start-button"
            onClick={start}
            className="relative group px-10 py-4 bg-claw-cyan text-black font-mono text-xs uppercase tracking-[0.3em] hover:bg-claw-text transition-colors"
          >
            <span className="reticle-corner reticle-tl" />
            <span className="reticle-corner reticle-tr" />
            <span className="reticle-corner reticle-bl" />
            <span className="reticle-corner reticle-br" />
            Press Start
            <span className="animate-blink ml-2">_</span>
          </button>
          <p className="font-mono text-[10px] text-claw-dim tracking-[0.2em]">OR HIT ENTER</p>
        </div>
      </div>
      <div className="absolute bottom-8 font-mono text-[10px] tracking-[0.3em] text-claw-dim">CLAW OS // v2.6 // BOOT SEQUENCE</div>
    </div>
  );
}
