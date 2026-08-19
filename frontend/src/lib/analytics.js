import { API } from "./api";

export const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || "";

export const waLink = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hey CLAW MEDIA — let's play my marketing game.")}`
  : null;

export const track = (event, data = {}) => {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", event, data);
    }
    fetch(`${API}/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data }),
      keepalive: true,
    }).catch(() => {});
  } catch (e) {
    /* analytics must never break UX */
  }
};
