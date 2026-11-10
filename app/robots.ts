import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/site-config";
export const dynamic = "force-dynamic";
export default function robots(): MetadataRoute.Robots {
  const { origin, indexable } = getSiteConfig();
  // Allow crawling of HTML so crawlers can observe noindex on a preview deployment.
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ...(origin && indexable ? { sitemap: `${origin}/sitemap.xml`, host: origin } : {}),
  };
}
