import { pageMetadata, PUBLIC_PAGES } from "src/config/seo";

test("public routes have distinct canonical URLs on the production domain", () => {
  for (const route of Object.keys(PUBLIC_PAGES)) {
    expect(pageMetadata(route)).toMatchObject({
      canonical: `https://hackeps.dev${route}`,
      robots: "index,follow",
    });
  }
});

test("previews and account routes are not indexable", () => {
  expect(pageMetadata("/sponsors", { preview: true }).robots).toBe("noindex,follow");
  expect(pageMetadata("/validate-email").robots).toBe("noindex,follow");
  expect(pageMetadata("/perfil/12").robots).toBe("noindex,follow");
  expect(pageMetadata("/unknown").robots).toBe("noindex,follow");
});

test("only available waiting-page routes are indexed", () => {
  expect(pageMetadata("/sponsors", { waiting: true }).robots).toBe("noindex,follow");
  expect(pageMetadata("/privacy", { waiting: true }).robots).toBe(
    "index,follow",
  );
});

test("legacy and trailing-slash URLs canonicalize to the same page", () => {
  expect(pageMetadata("/hackeps/sponsors/").canonical).toBe(
    "https://hackeps.dev/sponsors",
  );
  expect(pageMetadata("/home").canonical).toBe("https://hackeps.dev/");
});

test("pages folded into the home page are no longer indexed on their own", () => {
  for (const route of ["/faq", "/dates", "/contacte"]) {
    expect(PUBLIC_PAGES[route]).toBeUndefined();
    expect(pageMetadata(route).robots).toBe("noindex,follow");
  }
});
