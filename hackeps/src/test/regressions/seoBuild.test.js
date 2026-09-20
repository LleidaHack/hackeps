const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const root = process.cwd();
const template = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
let output;
beforeEach(() => {
  output = fs.mkdtempSync(path.join(os.tmpdir(), "hackeps-seo-test-"));
  fs.writeFileSync(path.join(output, "index.html"), template);
});
afterEach(() => fs.rmSync(output, { recursive: true, force: true }));
function build(env = {}) {
  execFileSync(process.execPath, [path.join(root, "scripts/build-seo.cjs")], {
    env: {
      ...process.env,
      BUILD_PATH: output,
      REACT_APP_LAUNCH_PENDING: "0",
      REACT_APP_INDEXING: "1",
      VERCEL_ENV: "production",
      ...env,
    },
  });
  return fs.readFileSync(path.join(output, "sitemap.xml"), "utf8");
}

test("full build emits route-specific HTML and only public canonical sitemap entries", () => {
  const sitemap = build();
  expect(sitemap).toContain("https://hackeps.dev/faq");
  expect(sitemap).not.toMatch(/lleidahack|\/login|\/perfil/);
  const faq = fs.readFileSync(path.join(output, "faq/index.html"), "utf8");
  expect(faq).toContain('rel="canonical" href="https://hackeps.dev/faq"');
  expect(faq).toContain('property="og:url" content="https://hackeps.dev/faq"');
  expect(
    fs.readFileSync(path.join(output, "validate-email/index.html"), "utf8"),
  ).toContain('name="robots" content="noindex,follow"');
});

test("waiting build advertises only its three available pages", () => {
  const sitemap = build({ REACT_APP_LAUNCH_PENDING: "1" });
  expect((sitemap.match(/<loc>/g) || []).length).toBe(3);
  expect(sitemap).not.toContain("/faq");
});

test.each([{ VERCEL_ENV: "preview" }, { REACT_APP_INDEXING: "0" }])(
  "preview build cannot advertise indexable pages: %j",
  (env) => {
    expect(build(env)).not.toContain("<loc>");
    expect(fs.readFileSync(path.join(output, "index.html"), "utf8")).toContain(
      'name="robots" content="noindex,follow"',
    );
    expect(
      fs.readFileSync(path.join(output, "robots.txt"), "utf8"),
    ).not.toContain("Sitemap:");
  },
);
