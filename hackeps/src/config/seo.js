// Shared by the browser and the build-time HTML/sitemap generator.
const SITE_ORIGIN = "https://hackeps.dev";
const PUBLIC_PAGES = {
  "/": "HackEPS 2026",
  "/terms": "Termes i condicions · HackEPS 2026",
  "/privacy": "Política de privadesa · HackEPS 2026",
  "/dates": "Dates i programa · HackEPS 2026",
  "/faq": "Preguntes freqüents · HackEPS 2026",
  "/contacte": "Contacte · HackEPS 2026",
  "/contacte-mentor": "Mentoria · HackEPS 2026",
  "/sponsors": "Patrocinadors · HackEPS 2026",
};

function pageMetadata(pathname, { waiting = false, preview = false } = {}) {
  let path =
    pathname.replace(/^\/hackeps(?=\/|$)/i, "").replace(/\/+$/, "") || "/";
  if (path === "/home") path = "/";
  const publicPage = Boolean(PUBLIC_PAGES[path]);
  const available = !waiting || ["/", "/terms", "/privacy"].includes(path);
  return {
    canonical: SITE_ORIGIN + path,
    title: PUBLIC_PAGES[path] || "HackEPS 2026",
    robots:
      !preview && publicPage && available ? "index,follow" : "noindex,follow",
  };
}

module.exports = { SITE_ORIGIN, PUBLIC_PAGES, pageMetadata };
