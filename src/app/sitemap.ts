import type { MetadataRoute } from "next";
import { getAllDocs } from "@/lib/content";
import { SITE_URL } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await getAllDocs();
  const today = new Date().toISOString().slice(0, 10);

  const contentEntries = docs.map((doc) => ({
    url: `${SITE_URL}${doc.url}`,
    lastModified: doc.lastModified ?? today,
    changeFrequency: "monthly" as const,
    priority: doc.slug.length === 1 ? 0.9 : 0.7,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/glossary`,
      lastModified: today,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/playground`,
      lastModified: today,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/playground/animations`,
      lastModified: today,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/playground/layout`,
      lastModified: today,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  return [...contentEntries, ...staticPages];
}
