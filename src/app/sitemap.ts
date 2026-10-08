import type { MetadataRoute } from "next";

import { SITE } from "@/config/site";
import { repos } from "@/data";
import { safeLoad } from "@/lib/safe-load";

const STATIC_PUBLIC = ["/", "/about", "/how-it-works", "/pricing", "/blog", "/contact", "/faq", "/privacy", "/terms"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await safeLoad(() => repos.content.listArticles());
  return [
    ...STATIC_PUBLIC.map((path) => ({ url: `${SITE.url}${path}` })),
    ...(articles.ok
      ? articles.data.map((a) => ({ url: `${SITE.url}/blog/${a.slug}`, lastModified: a.last_updated_at }))
      : []),
  ];
}
