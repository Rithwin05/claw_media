# CLAW MEDIA — PRD

## Original Problem Statement
Build the CLAW MEDIA agency website: "LET US PLAY YOUR MARKETING GAME." Not a generic agency site — the entire website behaves like a game / operating interface for business growth. Dark Editorial × Technical Interface × Creative Studio × Game System aesthetic (black, neon cyan #00F0FF, Anton/Hanken Grotesk/JetBrains Mono, reticle cursor, scanlines, hanging CLAW STUDIO sign). Full 13-section single-page experience: Preloader → Navbar → Hero → What's Your Game (industry selector with funnels) → Things We Do (Build/Create/Grow/Automate) → 360° System → How We Play (5 levels) → The Games We've Played (case studies: Kings Pride Infra +197 leads ₹40.72 CPL, Shonitara, SBJ) → Play With CLAW (real Website Score tool + lead capture) → CLAW Lab → Why The CLAW → Ready To Play (project enquiry + hello forms) → Footer.

## User Decisions (v1)
- Scope: full homepage, all sections, modular components, one continuous game feel.
- PLAY WITH CLAW: REAL working diagnostic (not fake scores) + DB lead capture.
- Project enquiries: saved to DB with statuses NEW/CONTACTED/QUALIFIED/PROPOSAL/WON/LOST (structured for a future admin dashboard).
- Integrations: Resend (managed) for notification + confirmation emails; server-side LLM (Emergent universal key, gpt-5.4) for assessment insights; WhatsApp secondary CTA; GA/GTM architected via REACT_APP_GA_ID.
- Platform constraint mapping: MongoDB instead of Supabase, FastAPI instead of Next.js (platform stack).

## Architecture
- Frontend: React 19 + Tailwind, components in /app/frontend/src/components/claw/ (Preloader, BackgroundFX WebGL, Cursor, Navbar, Hero, IndustryGame, ThingsWeDo, System360, HowWePlay, CaseStudies, PlayWithClaw, ClawLab, WhyClaw, FinalCTA, Footer, Bits). Analytics helper: /src/lib/analytics.js (track() → /api/analytics + gtag if configured).
- Backend: FastAPI /app/backend/server.py. Endpoints: GET /api/health, POST /api/assess (real site fetch + 8-category scoring + LLM insight with heuristic fallback), POST /api/assess/report (lead capture + emails), POST /api/enquiries, POST /api/contact, GET /api/leads, GET /api/enquiries, POST /api/analytics.
- DB collections: assessments, leads, enquiries, contacts, analytics.
- Email: Emergent managed Resend proxy (EMERGENT_EMAIL_KEY in backend/.env), from_name "CLAW MEDIA", templates in server.py.

## Implemented (2026-08-19)
- All 13 sections built and visually verified (screenshots).
- Working diagnostic: server-side fetch, real signal extraction (title/meta/viewport/forms/socials/CTA/load time), 8 category scores + CLAW SCORE, AI-written headline/opportunity/3 plays (ai_powered flag), graceful fallback.
- Lead capture, project enquiry (all fields + preferred contact), hello form — all persist with status NEW and source tracking.
- Confirmation emails to submitters verified sending (no errors); owner notification emails coded but INACTIVE until OWNER_EMAIL is set.
- Analytics events stored in Mongo; GA auto-injects if REACT_APP_GA_ID is set.
- WhatsApp CTA coded; hidden until REACT_APP_WHATSAPP_NUMBER is set.

## Backlog
- P0: Set OWNER_EMAIL (notification emails), REACT_APP_WHATSAPP_NUMBER (WhatsApp CTAs), REACT_APP_GA_ID (Google Analytics).
- P1: Admin dashboard for leads/enquiries with status pipeline (DB already structured). Real CLAW PDF report generation + email delivery.
- P2: Case-study detail pages, per-industry landing pages, CLAW Lab experiment detail views, trademark/domain check reminder, newsletter capture, Vercel-style analytics dashboard from /api/analytics data.
