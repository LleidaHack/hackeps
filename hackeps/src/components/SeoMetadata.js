import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageMetadata } from "src/config/seo";

export default function SeoMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const metadata = pageMetadata(pathname, {
      waiting: process.env.REACT_APP_LAUNCH_PENDING === "1",
      preview:
        process.env.REACT_APP_INDEXING === "0" ||
        window.location.hostname !== "hackeps.dev",
    });
    document.title = metadata.title;
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", metadata.canonical);
    for (const [selector, value] of [
      ['meta[property="og:url"]', metadata.canonical],
      ['meta[property="og:title"]', metadata.title],
      ['meta[name="twitter:title"]', metadata.title],
      ['meta[name="robots"]', metadata.robots],
    ]) {
      document.querySelector(selector)?.setAttribute("content", value);
    }
  }, [pathname]);
  return null;
}
