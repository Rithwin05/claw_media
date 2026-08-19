import { useEffect, useRef, useState } from "react";
import { Loader2, Send, RotateCcw, Check } from "lucide-react";
import { Reveal, SectionHead, ReticleButton } from "./Bits";
import { api } from "../../lib/api";
import { track } from "../../lib/analytics";

const CATEGORIES = [
  ["brand", "Brand"],
  ["experience", "Website Experience"],
  ["mobile", "Mobile Experience"],
  ["conversion", "Conversion"],
  ["seo", "SEO"],
  ["performance", "Performance"],
  ["social", "Social Presence"],
  ["growth", "Growth Potential"],
];

const LOADING_MSGS = [
  "ESTABLISHING UPLINK...",
  "FETCHING YOUR SITE...",
  "READING THE CODE...",
  "SCORING THE GAME...",
  "CONSULTING THE CLAW BRAIN...",
];

const INDUSTRY_OPTIONS = ["Real Estate", "Hospitality", "Café & Nightlife", "Jewellery", "Education", "Coaching", "Study Abroad", "Other"];

function ScoreDial({ score }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setShown(score), 150);
    return () => clearTimeout(t);
  }, [score]);
  return (
    <div className="relative w-44 h-44" data-testid="score-dial">
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="#00F0FF"
          strokeWidth="6"
          strokeDasharray={c}
          strokeDashoffset={c - (c * shown) / 100}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl text-claw-cyan" data-testid="score-dial-value">{score}</span>
        <span className="font-mono text-[9px] tracking-[0.3em] text-claw-muted uppercase mt-1">/ 100</span>
      </div>
    </div>
  );
}

export default function PlayWithClaw() {
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState("idle");
  const [loadMsg, setLoadMsg] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [barsOn, setBarsOn] = useState(false);
  const [lead, setLead] = useState({ name: "", email: "", phone: "", company: "", industry: "" });
  const [leadPhase, setLeadPhase] = useState("idle");
  const resultRef = useRef(null);

  useEffect(() => {
    if (phase !== "loading") return undefined;
    const iv = setInterval(() => setLoadMsg((m) => (m + 1) % LOADING_MSGS.length), 800);
    return () => clearInterval(iv);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") {
      const t = setTimeout(() => setBarsOn(true), 250);
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return () => clearTimeout(t);
    }
    return undefined;
  }, [phase]);

  const analyse = async (e) => {
    e.preventDefault();
    if (!url.trim() || phase === "loading") return;
    setPhase("loading");
    setError("");
    setBarsOn(false);
    setLeadPhase("idle");
    track("assessment_started", { url });
    try {
      const { data } = await api.post("/assess", { url });
      setResult(data);
      setPhase("done");
      track("assessment_completed", { url, score: data.claw_score });
    } catch (err) {
      setError(err?.response?.data?.detail || "Diagnostic failed. Try another URL.");
      setPhase("error");
    }
  };

  const submitLead = async (e) => {
    e.preventDefault();
    if (leadPhase === "sending") return;
    setLeadPhase("sending");
    try {
      await api.post("/assess/report", { assessment_id: result.assessment_id, ...lead });
      setLeadPhase("sent");
      track("report_requested", { url: result.url, score: result.claw_score });
    } catch (err) {
      setLeadPhase("idle");
      setError(err?.response?.data?.detail || "Couldn't queue the report. Try again.");
    }
  };

  return (
    <section id="play" className="relative py-28 md:py-36 border-t border-white/5" data-testid="play-section">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <Reveal>
          <SectionHead
            testid="play-head"
            kicker="SYS.06 // INTERACTIVE"
            title={<>Don't Take Our<br />Word For It.<br /><span className="text-claw-cyan">Play With CLAW.</span></>}
            note="Enter your website. The CLAW engine reads it, scores it across eight categories, and tells you the one move that matters most."
          />
        </Reveal>

        <Reveal delay={100}>
          <form onSubmit={analyse} className="flex flex-col sm:flex-row gap-4 max-w-3xl" data-testid="score-form">
            <input
              data-testid="score-url-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="yourwebsite.com"
              className="claw-input flex-1 !py-4 !text-sm"
              disabled={phase === "loading"}
            />
            <ReticleButton testid="score-analyse-button" type="submit" disabled={phase === "loading"}>
              {phase === "loading" ? <Loader2 size={14} className="animate-spin" /> : null}
              Analyse →
            </ReticleButton>
          </form>
        </Reveal>

        {phase === "loading" && (
          <div className="mt-12 border border-white/10 bg-claw-surface/50 p-8 max-w-3xl" data-testid="score-loading">
            <p className="font-mono text-[11px] tracking-[0.3em] text-claw-cyan uppercase">
              {LOADING_MSGS[loadMsg]}
              <span className="animate-blink">_</span>
            </p>
            <div className="mt-4 h-px bg-white/10 w-full overflow-hidden">
              <div className="h-px bg-claw-cyan w-1/3 animate-[marquee-x_1.2s_linear_infinite]" />
            </div>
          </div>
        )}

        {(phase === "error" || error) && phase !== "done" && (
          <div className="mt-12 border border-red-500/30 bg-red-500/5 p-6 max-w-3xl flex items-center justify-between gap-4" data-testid="score-error">
            <p className="font-mono text-[12px] text-red-400">{error}</p>
            <button onClick={() => { setPhase("idle"); setError(""); }} className="text-claw-muted hover:text-claw-cyan" data-testid="score-error-reset">
              <RotateCcw size={16} />
            </button>
          </div>
        )}

        {phase === "done" && result && (
          <div ref={resultRef} className="mt-14 border border-white/10 bg-claw-surface/40 backdrop-blur-sm" data-testid="score-result-panel">
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 md:px-10 py-5 border-b border-white/10">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-claw-muted">
                Diagnostic // <span className="text-claw-text">{result.url}</span>
              </p>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-claw-cyan">
                CLAW SCORE™ {result.ai_powered ? "// AI ANALYSIS" : "// SIGNAL ANALYSIS"}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 p-6 md:p-10">
              <div className="lg:col-span-4 flex flex-col items-center lg:items-start gap-6">
                <ScoreDial score={result.claw_score} />
                <p className="font-display text-2xl md:text-3xl uppercase leading-tight text-claw-text text-center lg:text-left" data-testid="score-headline">
                  {result.insights.headline}
                </p>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5" data-testid="score-bars">
                {CATEGORIES.map(([key, label]) => (
                  <div key={key}>
                    <div className="flex justify-between font-mono text-[10px] tracking-[0.2em] uppercase mb-2">
                      <span className="text-claw-muted">{label}</span>
                      <span className="text-claw-text">{result.scores[key]}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 w-full">
                      <div
                        className={`h-full score-bar-fill ${result.scores[key] >= 70 ? "bg-claw-cyan" : result.scores[key] >= 45 ? "bg-claw-blue" : "bg-red-400/80"}`}
                        style={{ width: barsOn ? `${result.scores[key]}%` : "0%" }}
                        data-testid={`score-bar-${key}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 md:px-10 pb-10">
              <div className="border-l-2 border-claw-cyan pl-6 py-2 max-w-3xl" data-testid="score-opportunity">
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-claw-cyan mb-2">Your Biggest Opportunity</p>
                <p className="font-body text-lg md:text-xl text-claw-text">{result.insights.opportunity}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 max-w-4xl" data-testid="score-plays">
                {result.insights.plays.map((play, i) => (
                  <div key={i} className="border border-white/10 bg-black/40 p-4">
                    <p className="font-mono text-[9px] tracking-[0.25em] text-claw-cyan uppercase mb-2">Move {String(i + 1).padStart(2, "0")}</p>
                    <p className="font-body text-sm text-claw-muted">{play}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 px-6 md:px-10 py-10 bg-black/40" data-testid="report-section">
              {leadPhase === "sent" ? (
                <div className="flex items-center gap-4" data-testid="report-success">
                  <span className="w-10 h-10 border border-claw-cyan flex items-center justify-center">
                    <Check size={18} className="text-claw-cyan" />
                  </span>
                  <div>
                    <p className="font-display text-2xl uppercase text-claw-text">Report Queued</p>
                    <p className="font-mono text-[11px] text-claw-muted mt-1">Check your inbox — the CLAW report is on its way.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={submitLead}>
                  <p className="font-display text-2xl md:text-3xl uppercase text-claw-text mb-2">Get The Full CLAW Report →</p>
                  <p className="font-mono text-[11px] text-claw-muted mb-8">Your data enters the CLAW system. No spam. Only strategy.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                    <input data-testid="report-name-input" required className="claw-input" placeholder="NAME *" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
                    <input data-testid="report-email-input" required type="email" className="claw-input" placeholder="EMAIL *" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} />
                    <input data-testid="report-phone-input" className="claw-input" placeholder="PHONE / WHATSAPP" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} />
                    <input data-testid="report-company-input" className="claw-input" placeholder="COMPANY" value={lead.company} onChange={(e) => setLead({ ...lead, company: e.target.value })} />
                    <select data-testid="report-industry-select" className="claw-input" value={lead.industry} onChange={(e) => setLead({ ...lead, industry: e.target.value })}>
                      <option value="">INDUSTRY</option>
                      {INDUSTRY_OPTIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                    <ReticleButton testid="report-submit-button" type="submit" disabled={leadPhase === "sending"}>
                      {leadPhase === "sending" ? <Loader2 size={14} className="animate-spin" /> : <Send size={13} />}
                      Send My Report
                    </ReticleButton>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
