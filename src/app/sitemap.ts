import type { MetadataRoute } from "next";
import { getAllDocs } from "@/lib/content";
import { SITE_URL } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await getAllDocs();
  const today = new Date().toISOString().slice(0, 10);

  // Homepage — highest priority
  const homepage: MetadataRoute.Sitemap[number] = {
    url: SITE_URL,
    lastModified: today,
    changeFrequency: "daily",
    priority: 1.0,
  };

  // Chapter index pages — readers' primary entry points
  const chapterPages = docs
    .filter((d) => d.slug.length === 1)
    .map((doc) => ({
      url: `${SITE_URL}${doc.url}`,
      lastModified: doc.lastModified ?? today,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

  // Section pages — detail content
  const sectionPages = docs
    .filter((d) => d.slug.length > 1)
    .map((doc) => ({
      url: `${SITE_URL}${doc.url}`,
      lastModified: doc.lastModified ?? today,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  // Public pages — tools & reference
  const publicPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/glossary`,
      lastModified: today,
      changeFrequency: "weekly" as const,
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
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/playground/layout`,
      lastModified: today,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  return [homepage, ...chapterPages, ...publicPages, ...sectionPages];
}
