import type { MetadataRoute } from "next";
import { site } from "@/site.config";
import { apps } from "@/content/apps";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...apps.map((app) => ({
      url: `${site.url}/${app.slug}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...apps
      .filter((app) => app.legal)
      .flatMap((app) =>
        ["privacy", "delete-account"].map((doc) => ({
          url: `${site.url}/${app.slug}/${doc}/`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.4,
        })),
      ),
    { url: `${site.url}/privacy/`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
}
