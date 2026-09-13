import type { MetadataRoute } from "next";
import { site } from "@/site.config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, lastModified: new Date() },
    { url: `${site.url}/calosnap/`, lastModified: new Date() },
  ];
}
