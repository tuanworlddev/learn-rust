import type { MetadataRoute } from "next";
import { indexableRoutes } from "@/lib/seo";
import { routeHref } from "@/lib/routes";
import { getSiteConfig } from "@/lib/site-config";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { origin, indexable } = getSiteConfig();
  if (!origin || !indexable) return [];
  return (await indexableRoutes()).map(route => ({ url: `${origin}${routeHref(route)}` }));
}
