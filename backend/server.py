from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import json
import time
import uuid
import asyncio
import logging
import ipaddress
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
import httpx
from bs4 import BeautifulSoup

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logger = logging.getLogger(__name__)

# ---------------- Email (Emergent managed Resend proxy) ----------------
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "CLAW MEDIA")
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
OWNER_EMAIL = os.environ.get("OWNER_EMAIL", "")
SITE_URL = os.environ.get("SITE_URL", "")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str) -> Optional[str]:
    if not EMAIL_KEY:
        logger.warning("EMERGENT_EMAIL_KEY not set; skipping email send")
        return None
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if EMAIL_REPLY_TO:
        payload["contact_email"] = EMAIL_REPLY_TO
    try:
        async with httpx.AsyncClient(timeout=30) as client_http:
            resp = await client_http.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        return None


def _email_shell(title: str, rows: str, footer_note: str) -> str:
    site_link = f'<a href="{escape(SITE_URL)}" style="color:#00F0FF;text-decoration:none">CLAW MEDIA</a>' if SITE_URL else "CLAW MEDIA"
    return (
        '<table role="presentation" width="100%" style="background:#000000;padding:32px 0">'
        '<tr><td align="center">'
        '<table role="presentation" width="560" style="background:#131313;border:1px solid #2a2a2a;padding:32px;'
        'font-family:Arial,sans-serif;color:#F5F5F5">'
        f'<tr><td><p style="font-family:monospace;font-size:11px;letter-spacing:3px;color:#00F0FF;margin:0 0 16px">CLAW MEDIA // SYSTEM</p>'
        f'<h1 style="font-size:26px;margin:0 0 20px;text-transform:uppercase;letter-spacing:1px">{escape(title)}</h1></td></tr>'
        f'<tr><td style="font-size:14px;line-height:22px;color:#c9c9c9">{rows}</td></tr>'
        f'<tr><td><p style="font-size:11px;color:#555;margin:28px 0 0;border-top:1px solid #2a2a2a;padding-top:16px">'
        f'{footer_note}<br/>Sent by {site_link} — Tech x Media x Marketing. We never ask for passwords or card details by email.</p></td></tr>'
        '</table></td></tr></table>'
    )


async def notify_owner(subject: str, rows: str) -> None:
    if OWNER_EMAIL:
        await send_email(to=OWNER_EMAIL, subject=subject, html=_email_shell(subject, rows, "New activity on your CLAW MEDIA system."))


# ---------------- Models ----------------
class AssessRequest(BaseModel):
    url: str


class ReportRequest(BaseModel):
    assessment_id: str
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    company: Optional[str] = ""
    industry: Optional[str] = ""


class EnquiryRequest(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = ""
    phone: Optional[str] = ""
    website: Optional[str] = ""
    industry: Optional[str] = ""
    services: List[str] = []
    budget: Optional[str] = ""
    description: Optional[str] = ""
    preferred_contact: Optional[str] = "email"
    lead_source: Optional[str] = "website"


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str


class AnalyticsEvent(BaseModel):
    event: str
    data: dict = {}


# ---------------- Website diagnostic engine ----------------
SOCIAL_DOMAINS = ["instagram.com", "facebook.com", "fb.com", "linkedin.com", "youtube.com",
                  "twitter.com", "x.com", "wa.me", "wa.link", "t.me"]
CTA_WORDS = ["contact", "book", "buy", "enquire", "inquire", "get started", "call now",
             "whatsapp", "quote", "demo", "subscribe", "sign up", "apply", "register", "order"]

UA = {"User-Agent": "Mozilla/5.0 (compatible; CLAW-Diagnostic/1.0)"}


def _normalize_url(raw: str) -> str:
    u = raw.strip()
    if not u:
        raise HTTPException(status_code=400, detail="Enter a website URL.")
    if not u.startswith(("http://", "https://")):
        u = "https://" + u
    host = urlparse(u).hostname or ""
    if "." not in host:
        raise HTTPException(status_code=400, detail="That doesn't look like a valid website.")
    return u


def _clamp(v: float) -> int:
    return max(5, min(100, int(round(v))))


def analyze_site(html: str, final_url: str, elapsed_ms: float, https: bool) -> dict:
    soup = BeautifulSoup(html, "html.parser")
    title = (soup.title.string or "").strip() if soup.title and soup.title.string else ""
    meta_desc = ""
    tag = soup.find("meta", attrs={"name": re.compile("^description$", re.I)})
    if tag and tag.get("content"):
        meta_desc = tag["content"].strip()
    viewport = bool(soup.find("meta", attrs={"name": re.compile("^viewport$", re.I)}))
    h1s = soup.find_all("h1")
    links = [a.get("href", "") or "" for a in soup.find_all("a")]
    text_blob = soup.get_text(" ", strip=True).lower()
    link_blob = " ".join(links).lower()
    forms = soup.find_all("form")
    imgs = soup.find_all("img")
    imgs_alt = [i for i in imgs if i.get("alt")]
    og_tags = soup.find_all("meta", attrs={"property": re.compile("^og:", re.I)})
    canonical = bool(soup.find("link", attrs={"rel": re.compile("canonical", re.I)}))
    favicon = bool(soup.find("link", attrs={"rel": re.compile("icon", re.I)}))
    socials = sorted({d for d in SOCIAL_DOMAINS if d in link_blob})
    cta_hits = [w for w in CTA_WORDS if w in text_blob or w in link_blob]
    tel_mail = sum(1 for l in links if l.startswith(("tel:", "mailto:")))
    has_nav = bool(soup.find("nav")) or "menu" in text_blob[:2000]
    word_count = len(text_blob.split())
    page_kb = len(html) / 1024
    has_blog = any(k in link_blob for k in ("blog", "journal", "insights", "news"))
    has_analytics = any(k in html for k in ("gtag", "googletagmanager", "analytics", "meta pixel", "fbq"))

    t = elapsed_ms
    performance = 92 if t < 800 else 78 if t < 1500 else 62 if t < 2500 else 45 if t < 4000 else 28
    if page_kb > 3000:
        performance -= 12
    elif page_kb > 1500:
        performance -= 6

    mobile = 55 if viewport else 22
    if viewport and soup.find_all("img", attrs={"srcset": True}):
        mobile += 18
    if viewport and soup.find_all("meta", attrs={"name": re.compile("theme-color", re.I)}):
        mobile += 8
    if viewport and not soup.find_all("table"):
        mobile += 8

    seo = 20
    if 10 <= len(title) <= 70:
        seo += 22
    elif title:
        seo += 10
    if 50 <= len(meta_desc) <= 170:
        seo += 22
    elif meta_desc:
        seo += 10
    if len(h1s) == 1:
        seo += 14
    elif h1s:
        seo += 7
    if canonical:
        seo += 8
    if og_tags:
        seo += 8
    if https:
        seo += 6

    brand = 25
    if title:
        brand += 18
    if favicon:
        brand += 14
    if any(m.get("property") == "og:image" for m in og_tags):
        brand += 16
    if word_count > 300:
        brand += 12
    if len(set(socials)) >= 2:
        brand += 10
    if any(k in text_blob for k in ("about", "our story", "who we are")):
        brand += 8

    alt_ratio = (len(imgs_alt) / len(imgs)) if imgs else 0.6
    experience = 30
    if https:
        experience += 16
    if has_nav:
        experience += 12
    experience += int(alt_ratio * 18)
    if viewport:
        experience += 10
    if word_count > 200:
        experience += 8
    if t < 2000:
        experience += 8

    conversion = 15
    if forms:
        conversion += 25
    conversion += min(len(cta_hits) * 7, 28)
    if tel_mail:
        conversion += 14
    if any(d in link_blob for d in ("wa.me", "wa.link")):
        conversion += 10
    if any(k in text_blob for k in ("testimonial", "review", "clients")):
        conversion += 8

    social = min(20 + len(socials) * 16, 92) if socials else 12

    growth = 25
    if has_blog:
        growth += 22
    if has_analytics:
        growth += 20
    if forms or cta_hits:
        growth += 12
    if socials:
        growth += 10
    if meta_desc and title:
        growth += 8

    scores = {
        "brand": _clamp(brand),
        "experience": _clamp(experience),
        "mobile": _clamp(mobile),
        "conversion": _clamp(conversion),
        "seo": _clamp(seo),
        "performance": _clamp(performance),
        "social": _clamp(social),
        "growth": _clamp(growth),
    }
    claw_score = _clamp(sum(scores.values()) / len(scores))

    signals = {
        "title": title[:120],
        "meta_description": meta_desc[:200],
        "https": https,
        "load_ms": int(t),
        "page_kb": int(page_kb),
        "has_viewport": viewport,
        "h1_count": len(h1s),
        "forms": len(forms),
        "cta_hits": cta_hits[:6],
        "social_profiles": socials,
        "has_blog": has_blog,
        "has_analytics": has_analytics,
        "word_count": word_count,
    }
    return {"scores": scores, "claw_score": claw_score, "signals": signals}


WEAKNESS_COPY = {
    "conversion": "Your website looks alive, but your conversion infrastructure is weak — traffic has nowhere to go.",
    "seo": "You're nearly invisible to search. The game is being played without you on the board.",
    "mobile": "Most of your audience is on mobile — and your experience isn't ready for them.",
    "performance": "Your site is slow. Every extra second quietly deletes potential customers.",
    "social": "Your social presence is disconnected from your website. Attention isn't compounding.",
    "brand": "The brand signal is thin. People can't remember what they can't feel.",
    "experience": "The experience is functional, not memorable. Functional doesn't win games.",
    "growth": "There's no growth engine behind the site — no content, no measurement, no compounding.",
}


async def llm_insights(url: str, analysis: dict) -> Optional[dict]:
    key = os.environ.get("EMERGENT_LLM_KEY")
    if not key:
        return None
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

        scores = analysis["scores"]
        signals = analysis["signals"]
        chat = LlmChat(
            api_key=key,
            session_id=f"claw-diag-{uuid.uuid4()}",
            system_message=(
                "You are CLAW MEDIA's growth diagnostic engine — sharp, confident, a little playful, never generic. "
                "You analyse websites like a game strategist. Reply ONLY with valid JSON, no markdown fences."
            ),
        ).with_model("openai", "gpt-5.4")
        prompt = (
            f"Website: {url}\nScores (0-100): {json.dumps(scores)}\n"
            f"Signals: {json.dumps(signals)}\n\n"
            'Return JSON: {"headline": one punchy 6-10 word verdict about this digital presence, '
            '"opportunity": 1-2 sentences naming their single biggest opportunity, direct second-person, '
            '"plays": [3 concrete next moves, each under 12 words, imperative voice]}. '
            "Sound like an elite creative-tech studio, not an SEO tool."
        )

        async def _run():
            buf = ""
            async for ev in chat.stream_message(UserMessage(text=prompt)):
                if isinstance(ev, TextDelta):
                    buf += ev.content
                elif isinstance(ev, StreamDone):
                    break
            return buf

        raw = await asyncio.wait_for(_run(), timeout=30)
        m = re.search(r"\{.*\}", raw, re.S)
        if not m:
            return None
        data = json.loads(m.group(0))
        if not all(k in data for k in ("headline", "opportunity", "plays")):
            return None
        return data
    except Exception as e:
        logger.warning(f"LLM insight fallback: {e}")
        return None


def fallback_insights(analysis: dict) -> dict:
    scores = analysis["scores"]
    weakest = min(scores, key=scores.get)
    strongest = max(scores, key=scores.get)
    return {
        "headline": f"Strong {strongest} game, but the system isn't connected yet.",
        "opportunity": WEAKNESS_COPY[weakest],
        "plays": [
            f"Fix the {weakest} layer first — it's your biggest leak.",
            f"Weaponise your {strongest} strength across every channel.",
            "Connect website, CRM and follow-up into one system.",
        ],
    }


# ---------------- Routes ----------------
@api_router.get("/health")
async def health():
    return {"status": "ok", "system": "CLAW MEDIA", "ready": True}


@api_router.post("/assess")
async def assess(req: AssessRequest):
    url = _normalize_url(req.url)
    started = time.time()
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=15, headers=UA) as http_client:
            resp = await http_client.get(url)
    except Exception:
        raise HTTPException(status_code=400, detail="We couldn't reach that website. Check the URL and try again.")
    elapsed_ms = (time.time() - started) * 1000
    if resp.status_code >= 400:
        raise HTTPException(status_code=400, detail=f"That site returned an error ({resp.status_code}).")
    final_url = str(resp.url)
    analysis = analyze_site(resp.text, final_url, elapsed_ms, final_url.startswith("https://"))

    insights = await llm_insights(final_url, analysis) or fallback_insights(analysis)

    doc = {
        "assessment_id": str(uuid.uuid4()),
        "url": final_url,
        "scores": analysis["scores"],
        "claw_score": analysis["claw_score"],
        "signals": analysis["signals"],
        "insights": insights,
        "ai_powered": insights != fallback_insights(analysis),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.assessments.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.post("/assess/report")
async def assess_report(req: ReportRequest):
    assessment = await db.assessments.find_one({"assessment_id": req.assessment_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found.")
    lead = {
        "lead_id": str(uuid.uuid4()),
        "name": req.name,
        "email": req.email,
        "phone": req.phone,
        "company": req.company,
        "website": assessment["url"],
        "industry": req.industry,
        "score": assessment["claw_score"],
        "scores": assessment["scores"],
        "insights": assessment["insights"],
        "status": "NEW",
        "lead_source": "claw_assessment",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.leads.insert_one(lead)
    lead.pop("_id", None)

    rows = (
        f"<p>GAME ON, {escape(req.name)}.</p>"
        f"<p>Your CLAW SCORE&#8482; for <strong>{escape(assessment['url'])}</strong>:</p>"
        f'<p style="font-size:44px;color:#00F0FF;font-family:monospace;margin:12px 0">{assessment["claw_score"]} / 100</p>'
        f"<p><strong>YOUR BIGGEST OPPORTUNITY</strong><br/>{escape(assessment['insights']['opportunity'])}</p>"
        "<p>The full CLAW report is being prepared by our strategy desk. Expect it within 48 hours.</p>"
    )
    await send_email(to=req.email, subject=f"Your CLAW SCORE: {assessment['claw_score']}/100", html=_email_shell("Your CLAW Report Is Coming", rows, "This is your diagnostic confirmation."))
    await notify_owner(
        f"NEW ASSESSMENT LEAD — {req.name} ({assessment['claw_score']}/100)",
        f"<p><strong>{escape(req.name)}</strong> — {escape(req.company or '-')}</p>"
        f"<p>Email: {escape(req.email)}<br/>Phone: {escape(req.phone or '-')}<br/>Industry: {escape(req.industry or '-')}</p>"
        f"<p>Site: {escape(assessment['url'])}<br/>Score: {assessment['claw_score']}/100</p>",
    )
    return {"status": "ok", "lead_id": lead["lead_id"]}


@api_router.post("/enquiries")
async def create_enquiry(req: EnquiryRequest):
    doc = req.model_dump()
    doc.update({
        "enquiry_id": str(uuid.uuid4()),
        "status": "NEW",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.enquiries.insert_one(doc)
    doc.pop("_id", None)

    services = ", ".join(req.services) if req.services else "Not specified"
    rows = (
        f"<p>Hi {escape(req.name)}, your brief just landed in our control room.</p>"
        f"<p><strong>Project:</strong> {escape(req.company or 'Independent')}<br/>"
        f"<strong>Systems:</strong> {escape(services)}<br/>"
        f"<strong>Budget:</strong> {escape(req.budget or 'To be discussed')}<br/>"
        f"<strong>Reach you via:</strong> {escape(req.preferred_contact or 'email')}</p>"
        "<p>A CLAW strategist will come back to you within 24 hours with the first move.</p>"
    )
    await send_email(to=req.email, subject="Game received — CLAW MEDIA", html=_email_shell("Your Brief Is In The Game", rows, "This confirms your project enquiry."))
    await notify_owner(
        f"NEW PROJECT ENQUIRY — {req.name} / {req.company or '-'}",
        f"<p><strong>{escape(req.name)}</strong> — {escape(req.company or '-')} ({escape(req.industry or '-')})</p>"
        f"<p>Email: {escape(req.email)}<br/>Phone: {escape(req.phone or '-')}<br/>Website: {escape(req.website or '-')}</p>"
        f"<p>Services: {escape(services)}<br/>Budget: {escape(req.budget or '-')}<br/>Preferred: {escape(req.preferred_contact or '-')}</p>"
        f"<p>Brief: {escape((req.description or '')[:800])}</p>",
    )
    return {"status": "ok", "enquiry_id": doc["enquiry_id"]}


@api_router.post("/contact")
async def contact(req: ContactRequest):
    doc = req.model_dump()
    doc.update({"contact_id": str(uuid.uuid4()), "status": "NEW", "lead_source": "hello_form",
                "created_at": datetime.now(timezone.utc).isoformat()})
    await db.contacts.insert_one(doc)
    doc.pop("_id", None)
    await send_email(
        to=req.email,
        subject="Hello received — CLAW MEDIA",
        html=_email_shell("Message In The System", f"<p>Hi {escape(req.name)}, got your message. A human from CLAW will reply soon.</p>", "This confirms your message."),
    )
    await notify_owner(f"NEW HELLO — {req.name}", f"<p>{escape(req.name)} ({escape(req.email)})</p><p>{escape(req.message[:800])}</p>")
    return {"status": "ok", "contact_id": doc["contact_id"]}


@api_router.get("/leads")
async def list_leads():
    return await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)


@api_router.get("/enquiries")
async def list_enquiries():
    return await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)


@api_router.post("/analytics")
async def analytics(ev: AnalyticsEvent):
    await db.analytics.insert_one({
        "event": ev.event[:80],
        "data": ev.data,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"status": "ok"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
