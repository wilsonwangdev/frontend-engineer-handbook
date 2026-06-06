import type { MetadataRoute } from "next";
import { getAllDocs } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await getAllDocs();

  const contentEntries = docs.map((doc) => ({
    url: `https://frontend-engineer-handbook.vercel.app${doc.url}`,
    lastModified: doc.lastModified ?? new Date().toISOString().slice(0, 10),
    changeFrequency: "monthly" as const,
    priority: doc.slug.length === 1 ? 0.9 : 0.7,
  }));

  const staticPages = [
    {
      url: "https://frontend-engineer-handbook.vercel.app/glossary",
      lastModified: new Date().toISOString().slice(0, 10),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: "https://frontend-engineer-handbook.vercel.app/playground",
      lastModified: new Date().toISOString().slice(0, 10),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: "https://frontend-engineer-handbook.vercel.app/playground/animations",
      lastModified: new Date().toISOString().slice(0, 10),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: "https://frontend-engineer-handbook.vercel.app/playground/layout",
      lastModified: new Date().toISOString().slice(0, 10),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  return [...contentEntries, ...staticPages];
}
