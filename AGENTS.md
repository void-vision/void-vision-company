<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project notes

- All site copy lives in `src/content/site.ts` (zh + en). Keep the two languages in sync; JSON-LD, sitemap and llms.txt derive from it.
- Client components must import locale helpers from `@/content/i18n`, not `@/content/site`, to avoid shipping the dictionaries to the browser.
- `raw/` is the design source and is gitignored — never copy internal docs from it into `public/`.
- This repository is public: no secrets, tokens or private data in code or commits.
