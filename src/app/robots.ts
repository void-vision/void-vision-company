import type { MetadataRoute } from "next";
import { absolute, isIndexable, siteUrl } from "@/lib/seo";

// Search engines and AI assistants/crawlers are welcome to read the whole site.
const aiAgents = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-User", "Claude-SearchBot", "anthropic-ai",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot-Extended", "Bingbot", "DuckAssistBot",
  "Meta-ExternalAgent", "Amazonbot", "Bytespider", "CCBot", "cohere-ai", "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: aiAgents, allow: "/" },
    ],
    sitemap: absolute("/sitemap.xml"),
    host: siteUrl,
  };
}
