import type { MetadataRoute } from "next";
import { CORRIDORS } from "@/lib/corridors";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://visa-advisor.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const corridorPages = CORRIDORS.map((c) => ({
    url: `${BASE_URL}/visa/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/results`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...corridorPages,
  ];
}
