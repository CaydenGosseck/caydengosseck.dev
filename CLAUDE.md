@AGENTS.md

# Project Overview

Personal blog and project showcase site. Stack: Next.js 16, React 19, Tailwind CSS v4, TypeScript.

---

# UI — ShadCN UI First

ShadCN UI is the primary component library. **Always check if a ShadCN component or block exists before building a custom one.**

- Docs: https://ui.shadcn.com/llms.txt
- Community blocks and component libraries: https://ui.shadcn.com/docs/directory
- Install components via CLI: `npx shadcn@latest add <component>`
- Config lives in `components.json`. Components install to `components/ui/`.
- Use `cn()` from `lib/utils.ts` for all conditional class merging.
- Do **not** manually edit files in `components/ui/` — they are ShadCN-managed.

---

# RetroUI — NeoBrutalist Component Library

RetroUI is used for the card-based UI. It is a NeoBrutalist design system installed via the ShadCN CLI registry.

- Docs: https://retroui.dev
- Install components: `npx shadcn@latest add 'https://retroui.dev/r/<component>.json'`
- Components install to `components/retroui/`. These **can** be manually edited to match the site theme.
- Available installed components: `Card`, `Text`, `Button`, `Badge`
- `Card` uses a compound component pattern: `Card.Header`, `Card.Title`, `Card.Description`, `Card.Content`, `Card.Footer`
- Theming is via CSS custom properties (`--shadow`, `--border-color`, `--accent`, etc.) — RetroUI reads these automatically

---

# Design — Retro Sci-Fi Theme on Readable Foundations

ShadCN components provide the readable, accessible base. The retro aesthetic is applied through theming — not by replacing components with custom ones.

- **Fonts**:
  - **Nova Slim** (`font-pixel`, `--font-nova-slim`) — site title, card label bars, buttons, and all decorative/accent text. Classic sci-fi feel.
  - **Forum** (`font-sans`, `--font-forum`) — all body text, descriptions, blog content, and anything meant to be read at length.
  - **Philosopher** (`font-serif`, `--font-philosopher`) — headings (`h1–h6`). Elegant and editorial.
  - **Geist Mono** (`font-mono`) — code blocks only. Do not use for UI.
  - Geist Sans is kept as a fallback but is not the primary body font.
- **Colors**: The active theme is `html.bw` (hardcoded in `app/layout.tsx`) — a dark space palette with deep wine/berry backgrounds, cream borders (`--border-color: #f0e8d8`), strawberry-red accents (`--accent: #8b1c30`), and blue-tinted primary (`--primary: #859ddb`). The original purple theme remains in `:root` in `app/globals.css` as an alternate. All theming is via CSS custom properties — never hardcode color values in components.
- **Background**: An animated canvas starfield (`components/starfield.tsx`) sits at `z-index: 0` fixed behind all content. The `html` element holds the background color; `body` and content panels are transparent so the stars show through.
- **Cards**: 1px cream border (`--border-color`), dark berry background (`--card-bg`). No box shadow.
- **Buttons**: Unified style — 1px cream border, transparent background, Nova Slim uppercase label, `hover:bg-[var(--muted-bg)]`, `active:bg-[var(--accent)]`. Apply consistently to all interactive buttons including social icons and form submit buttons.
- **Readability is the priority.** Never sacrifice legibility for aesthetic. If something is hard to read, the aesthetic loses.

---

# TypeScript Conventions

- Always use `type`. Never use `interface`.
- Define shared and reusable types in the `types/` folder, not inline in component files.
- Extract component prop types to a named `type` (e.g., `type CardProps = { ... }`). Do not use inline object types in function signatures for anything non-trivial.

---

# Project Structure

| Path | Purpose |
|---|---|
| `components/ui/` | ShadCN primitives — do not manually edit |
| `components/` | App-specific composed components |
| `types/` | Shared TypeScript types |
| `lib/dal/` | Data access layer |
| `lib/utils.ts` | `cn()` helper (ShadCN standard) |
| `config/` | Static JSON data (updates, etc.) |
| `app/` | Next.js app router pages and API routes |

Use React Server Components by default. Add `"use client"` only when a component requires browser APIs or interactivity.
