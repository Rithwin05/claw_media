import { useState } from "react";
import { Loader2, Send, Check, MessageCircle } from "lucide-react";
import { Reveal, ReticleButton } from "./Bits";
import { api } from "../../lib/api";
import { track, waLink } from "../../lib/analytics";

const INDUSTRIES = ["Real Estate", "Hospitality", "Café & Nightlife", "Jewellery", "Education", "Coaching", "Study Abroad", "Other"];
const SERVICES = ["Build", "Create", "Grow", "Automate", "Not Sure Yet"];
const BUDGETS = ["₹50K – ₹1L", "₹1L – ₹3L", "₹3L – ₹10L", "₹10L+", "Let's Talk"];
const CONTACT_PREFS = ["email", "whatsapp", "call"];

const EMPTY = {
  name: "", email: "", company: "", phone: "", website: "",
  industry: "", services: [], budget: "", description: "", preferred_contact: "email",
};

export default function FinalCTA() {
  const [tab, setTab] = useState("project");
  const [form, setForm] = useState(EMPTY);
  const [hello, setHello] = useState({ name: "", email: "", message: "" });
  const [phase, setPhase] = useState("idle");
  const [helloPhase, setHelloPhase] = useState("idle");
  const [error, setError] = useState("");

  const toggleService = (s) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s],
    }));
  };

  const submitProject = async (e) => {
    e.preventDefault();
    if (phase === "sending") return;
    setPhase("sending");
    setError("");
    track("contact_form_completed", { type: "project", industry: form.industry });
    try {
      await api.post("/enquiries", { ...form, lead_source: "project_form" });
      setPhase("sent");
    } catch (err) {
      setError(err?.response?.data?.detail || "Transmission failed. Try again.");
      setPhase("idle");
    }
  };

  const submitHello = async (e) => {
    e.preventDefault();
    if (helloPhase === "sending") return;
    setHelloPhase("sending");
    setError("");
    track("contact_form_completed", { type: "hello" });
    try {
      await api.post("/contact", hello);
      setHelloPhase("sent");
    } catch (err) {
      setError(err?.response?.data?.detail || "Transmission failed. Try again.");
      setHelloPhase("idle");
    }
  };

  return (
    <section id="contact" className="relative py-28 md:py-40 border-t border-white/5" data-testid="contact-section">
      <div className="technical-grid-bg absolute inset-0 opacity-15 pointer-events-none" />
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 relative">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-claw-cyan mb-6">SYS.09 // FINAL LEVEL</p>
          <h2 className="font-display text-6xl sm:text-7xl lg:text-9xl uppercase leading-[0.9] tracking-tight text-claw-text" data-testid="contact-title">
            Ready<br />To <span className="text-claw-cyan">Play?</span>
          </h2>
          <p className="font-body text-lg md:text-xl text-claw-muted mt-8 max-w-xl">
            Tell us what you're building. We'll figure out the game.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="flex flex-wrap gap-3 mt-14" data-testid="contact-tabs">
            <button
              data-testid="tab-start-project"
              onClick={() => { setTab("project"); track("contact_form_started", { type: "project" }); }}
              className={`relative group px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
                tab === "project" ? "bg-claw-cyan text-black" : "border border-white/20 text-claw-muted hover:text-claw-text"
              }`}
            >
              Start a Project →
            </button>
            <button
              data-testid="tab-say-hello"
              onClick={() => { setTab("hello"); track("contact_form_started", { type: "hello" }); }}
              className={`relative group px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
                tab === "hello" ? "bg-claw-cyan text-black" : "border border-white/20 text-claw-muted hover:text-claw-text"
              }`}
            >
              Just Say Hello →
            </button>
            {waLink && (
              <ReticleButton testid="contact-whatsapp-button" variant="ghost" href={waLink} onClick={() => track("contact_whatsapp_click")}>
                <MessageCircle size={14} /> WhatsApp CLAW
              </ReticleButton>
            )}
          </div>
        </Reveal>

        <div className="mt-12 border border-white/10 bg-claw-surface/40 backdrop-blur-sm p-6 md:p-12 max-w-5xl" data-testid="contact-panel">
          {error && (
            <p className="font-mono text-[12px] text-red-400 mb-6" data-testid="contact-error">{error}</p>
          )}

          {tab === "project" ? (
            phase === "sent" ? (
              <div className="flex items-center gap-5 py-8" data-testid="enquiry-success">
                <span className="w-12 h-12 border border-claw-cyan flex items-center justify-center">
                  <Check size={22} className="text-claw-cyan" />
                </span>
                <div>
                  <p className="font-display text-3xl uppercase text-claw-text">Brief Received</p>
                  <p className="font-mono text-[11px] tracking-[0.2em] text-claw-muted mt-2">LEVEL 01 UNLOCKED — a CLAW strategist replies within 24 hours.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={submitProject} data-testid="enquiry-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input data-testid="enquiry-name-input" required className="claw-input" placeholder="NAME *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <input data-testid="enquiry-email-input" required type="email" className="claw-input" placeholder="EMAIL *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <input data-testid="enquiry-company-input" className="claw-input" placeholder="COMPANY" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                  <input data-testid="enquiry-phone-input" className="claw-input" placeholder="PHONE / WHATSAPP" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <input data-testid="enquiry-website-input" className="claw-input" placeholder="WEBSITE (IF ANY)" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                  <select data-testid="enquiry-industry-select" className="claw-input" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
                    <option value="">INDUSTRY</option>
                    {INDUSTRIES.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                <div className="mt-6">
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-claw-muted mb-3">Services Required</p>
                  <div className="flex flex-wrap gap-2" data-testid="enquiry-services">
                    {SERVICES.map((s) => (
                      <button
                        type="button"
                        key={s}
                        data-testid={`enquiry-service-${s.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => toggleService(s)}
                        className={`px-4 py-2 font-mono text-[11px] tracking-[0.15em] uppercase border transition-colors ${
                          form.services.includes(s)
                            ? "bg-claw-cyan text-black border-claw-cyan"
                            : "border-white/15 text-claw-muted hover:border-claw-cyan/50 hover:text-claw-text"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <select data-testid="enquiry-budget-select" className="claw-input" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
                    <option value="">BUDGET RANGE</option>
                    {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <div className="flex items-center gap-4 border border-white/10 px-4" data-testid="enquiry-contact-pref">
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-claw-muted shrink-0">Reach me via</span>
                    {CONTACT_PREFS.map((p) => (
                      <label key={p} className="flex items-center gap-1.5 font-mono text-[11px] uppercase text-claw-text">
                        <input
                          type="radio"
                          name="preferred_contact"
                          data-testid={`enquiry-pref-${p}`}
                          checked={form.preferred_contact === p}
                          onChange={() => setForm({ ...form, preferred_contact: p })}
                          className="accent-[#00F0FF]"
                        />
                        {p}
                      </label>
                    ))}
                  </div>
                </div>

                <textarea
                  data-testid="enquiry-description-input"
                  className="claw-input mt-4 min-h-[120px] resize-y"
                  placeholder="WHAT ARE YOU BUILDING? THE MORE DETAIL, THE BETTER THE FIRST MOVE."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <div className="mt-8">
                  <ReticleButton testid="enquiry-submit-button" type="submit" disabled={phase === "sending"}>
                    {phase === "sending" ? <Loader2 size={14} className="animate-spin" /> : <Send size={13} />}
                    Start a Project →
                  </ReticleButton>
                </div>
              </form>
            )
          ) : helloPhase === "sent" ? (
            <div className="flex items-center gap-5 py-8" data-testid="hello-success">
              <span className="w-12 h-12 border border-claw-cyan flex items-center justify-center">
                <Check size={22} className="text-claw-cyan" />
              </span>
              <div>
                <p className="font-display text-3xl uppercase text-claw-text">Message In The System</p>
                <p className="font-mono text-[11px] tracking-[0.2em] text-claw-muted mt-2">A human from CLAW will reply soon.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={submitHello} data-testid="hello-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input data-testid="hello-name-input" required className="claw-input" placeholder="NAME *" value={hello.name} onChange={(e) => setHello({ ...hello, name: e.target.value })} />
                <input data-testid="hello-email-input" required type="email" className="claw-input" placeholder="EMAIL *" value={hello.email} onChange={(e) => setHello({ ...hello, email: e.target.value })} />
              </div>
              <textarea
                data-testid="hello-message-input"
                required
                className="claw-input mt-4 min-h-[120px] resize-y"
                placeholder="SAY HELLO. OR ANYTHING ELSE."
                value={hello.message}
                onChange={(e) => setHello({ ...hello, message: e.target.value })}
              />
              <div className="mt-8">
                <ReticleButton testid="hello-submit-button" type="submit" disabled={helloPhase === "sending"}>
                  {helloPhase === "sending" ? <Loader2 size={14} className="animate-spin" /> : <Send size={13} />}
                  Send Hello →
                </ReticleButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
