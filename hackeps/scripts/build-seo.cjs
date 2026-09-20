// Emit route-specific metadata for crawlers that do not execute JavaScript.
// This is not content prerendering: React still renders the page body.
process.env.NODE_ENV = "production";
require("react-scripts/config/env")();
const fs = require("node:fs");
const path = require("node:path");
const {
  SITE_ORIGIN,
  PUBLIC_PAGES,
  pageMetadata,
} = require("../src/config/seo");
const output = path.resolve(__dirname, "..", process.env.BUILD_PATH || "build");
const template = fs.readFileSync(path.join(output, "index.html"), "utf8");
const options = {
  waiting: process.env.REACT_APP_LAUNCH_PENDING === "1",
  preview:
    process.env.REACT_APP_INDEXING === "0" ||
    ["preview", "development"].includes(process.env.VERCEL_ENV),
};
const routes = Object.keys(PUBLIC_PAGES).filter(
  (route) => !options.waiting || ["/", "/terms", "/privacy"].includes(route),
);
const privateRoutes = options.waiting
  ? []
  : [
      "/login",
      "/validate-email",
      "/confirm-password",
      "/hacker-form",
      "/entrance",
      "/inscripcio",
      "/forgot-password",
      "/user-verification",
      "/assistance",
      "/perfil",
      "/hacking",
    ];
for (const route of [...routes, ...privateRoutes]) {
  const metadata = pageMetadata(route, options);
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${metadata.title}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${metadata.canonical}`)
    .replace(
      /(<meta property="og:url" content=")[^"]*/,
      `$1${metadata.canonical}`,
    )
    .replace(
      /(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*/g,
      `$1${metadata.title}`,
    )
    .replace(/(<meta name="robots" content=")[^"]*/, `$1${metadata.robots}`);
  const directory = path.join(output, route);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "index.html"), html);
}
const indexed = options.preview ? [] : routes;
fs.writeFileSync(
  path.join(output, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    indexed
      .map((route) => `  <url><loc>${SITE_ORIGIN}${route}</loc></url>`)
      .join("\n") +
    "\n</urlset>\n",
);
// Allow crawling so search engines can observe noindex on preview pages.
fs.writeFileSync(
  path.join(output, "robots.txt"),
  "User-agent: *\nAllow: /\n" +
    (options.preview ? "" : `Sitemap: ${SITE_ORIGIN}/sitemap.xml\n`),
);
console.log(
  `SEO: ${routes.length} public routes; indexing ${options.preview ? "disabled" : "enabled"}.`,
);
