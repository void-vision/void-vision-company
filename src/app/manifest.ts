import type { MetadataRoute } from "next";
import { company, getDictionary } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.name,
    short_name: company.name,
    description: getDictionary("en").meta.description,
    start_url: "/",
    display: "browser",
    background_color: "#04060c",
    theme_color: "#04060c",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
