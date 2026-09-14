import type { MetadataRoute } from "next";
import { site } from "@/site.config";
import { apps } from "@/content/apps";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, lastModified: new Date() },
    ...apps.map((app) => ({
      url: `${site.url}/${app.slug}/`,
      lastModified: new Date(),
    })),
    ...apps
      .filter((app) => app.legal)
      .flatMap((app) =>
        ["privacy", "delete-account"].map((doc) => ({
          url: `${site.url}/${app.slug}/${doc}/`,
          lastModified: new Date(),
        })),
      ),
    { url: `${site.url}/privacy/`, lastModified: new Date() },
  ];
}
