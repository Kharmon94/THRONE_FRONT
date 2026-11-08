// Public site configuration. Values come from build-time env (VITE_*) with
// known-good defaults. Nothing here is secret.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://www.thronetechnology.com").replace(/\/$/, "");
export const BLOG_URL = "https://blog.thronetechnology.com/";

// Google readiness placeholders — intentionally empty until Kyle creates the
// properties. No tracking or verification tag is emitted while these are unset.
//   VITE_GA4_MEASUREMENT_ID   e.g. G-XXXXXXXXXX (GA4 > Admin > Data streams)
//   Search Console: prefer DNS TXT verification (no code change needed).
export const GA4_MEASUREMENT_ID = (import.meta.env.VITE_GA4_MEASUREMENT_ID || "").trim();
