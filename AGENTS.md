# Repository Guidelines

## Project Structure & Module Organization
- `src/pages/` holds route entry points (Astro pages).
- `src/components/` contains reusable UI sections, named in `PascalCase` (e.g., `Hero.astro`).
- `src/layouts/` provides shared page layout(s).
- `src/content/` stores content collections; `src/content/work/` includes case study markdown.
- `src/styles/global.css` contains global Tailwind and base styles.
- `public/` stores static assets served as-is (fonts, images, `robots.txt`).

## Build, Test, and Development Commands
- `npm run dev` starts the Astro dev server with hot reload.
- `npm run build` outputs the production build to `dist/`.
- `npm run preview` serves the production build locally.
- `npm run astro` runs Astro CLI tasks (e.g., `npm run astro -- --help`).

## Coding Style & Naming Conventions
- Use 2-space indentation in `.astro` and `.ts` files, matching existing files.
- Prefer `PascalCase` for component filenames and `kebab-case` for content slugs in `src/content/work/`.
- Keep styling in Tailwind classes or `src/styles/global.css`; avoid ad-hoc inline styles unless needed.
- No formatter/linter is configured; keep changes consistent with nearby code.

## Testing Guidelines
- No automated test framework is configured in this repo.
- Validate changes manually via `npm run dev` and spot-check the affected pages.

## Commit & Pull Request Guidelines
- Commit messages are short, imperative, and lowercase (e.g., `update selected work order`).
- PRs should include a clear summary, list of notable UI changes, and screenshots for visual updates.
- Link relevant issues or tasks when available.

## Configuration Tips
- Site-wide settings live in `src/config/site.ts`.
- Astro/Tailwind config files: `astro.config.ts`, `tailwind.config.mjs`, `postcss.config.cjs`.

## Plans
- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.