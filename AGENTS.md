# Kubera — personal finance app

Tauri 2 desktop app. Frontend: React 19 + Vite 8 (rolldown) + TypeScript + Tailwind v4. Backend: Rust (Tauri).

## Layout

```
kubera/                 # repo root — tauri CLI runs from here (`pnpm tauri ...`)
├── package.json        # workspace stub; scripts proxy to kubera/ via ./kubera/node_modules/.bin/tauri
├── src-tauri/          # Rust side — do not modify unless asked
└── kubera/             # frontend root (has its own package.json)
    └── src/
        ├── App.tsx
        ├── index.css   # Tailwind + theme tokens + global radius/shadow overrides
        ├── state/
        │   ├── atoms.ts        # jotai atoms (lists + derived totals)
        │   └── AppContext.tsx  # React Context (user, currency, formatters)
        ├── components/
        │   ├── ui/        # reusable, NO domain state — Card, Button, Badge, Avatar, Delta, StatTile, ProgressStack, LineChart, SidebarItem
        │   ├── layout/    # AppShell, Sidebar, TopBar
        │   └── dashboard/ # feature components — read atoms + compose ui/
        └── shadeui/       # shadcn-style components (mostly unused; keep for now)
```

## Design rules

**Flat aesthetic — non-negotiable.**

- **No shadows** anywhere. No `shadow-*` utilities.
- **Zero border-radius** anywhere. No `rounded-*` utilities. Square corners only (avatars, pills, cards, badges, chart tooltips — all square).
- Enforced globally in `kubera/src/index.css`:
  ```css
  @layer utilities {
    *, *::before, *::after {
      border-radius: 0 !important;
      box-shadow: none !important;
    }
  }
  ```
- Don't add `rounded-*`/`shadow-*` classes to new components — they're overridden anyway, so skipping keeps intent honest.
- If a single rounded element is ever needed, scope/remove the global rule rather than fighting `!important`.

**Typography**
- Sans body: `IBM Plex Sans Variable` (via `--font-sans`)
- Headings: `Geist Mono Variable` (via `--font-heading`, use `font-heading` utility)
- Numbers/mono: `JetBrains Mono Variable` (`font-mono`)

**Colors** — use Tailwind tokens backed by oklch CSS vars (`bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`, etc.). Defined in `kubera/src/index.css` `:root` + `.dark`.

## State conventions

- **jotai** for domain state: lists of assets, transactions, etc. + derived sums via `atom((get) => ...)`. All in `state/atoms.ts`.
- **React Context** for cross-cutting UI concerns: currency, locale, formatters, user. In `state/AppContext.tsx`. Access via `useApp()`.
- Provider order in `App.tsx`: `JotaiProvider` → `AppProvider` → `AppShell`.

## Component conventions

- `ui/` knows nothing about app domain — pure props in, JSX out. Safe to reuse anywhere.
- `dashboard/` reads atoms + Context, composes `ui/` primitives.
- `layout/` wraps pages, owns sidebar/topbar.
- Import alias `@/` → `kubera/src/`.
- Phosphor icons (`@phosphor-icons/react`) for all iconography.
- `cn()` from `@/shadeui/lib/utils` for conditional classes (clsx + tailwind-merge).

## Build & dev

From repo root (`/Volumes/ext/2026/dev/money/kubera`):
- `pnpm tauri dev` — launches Vite (port 1420) + Tauri window with HMR.
- `pnpm tauri build` — full production bundle.
- `pnpm build` — frontend only (calls `pnpm --dir kubera build`).

Tauri config: `src-tauri/tauri.conf.json` — `beforeDevCommand` / `beforeBuildCommand` run `pnpm --dir kubera ...` from the repo root cwd. `frontendDist: ../kubera/dist`.

## Don'ts

- Don't touch Rust files (`src-tauri/`) unless explicitly asked.
- Don't add `shadow-*` / `rounded-*` utilities.
- Don't create new top-level folders without reason — frontend lives in `kubera/`, not the repo root.
- Don't introduce CSS-in-JS, styled-components, or vanilla CSS files. Tailwind utilities + tokens only.
