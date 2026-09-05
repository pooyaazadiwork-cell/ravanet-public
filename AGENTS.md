# Instructions for development agents

This repository is the **Ravanet public website only**. A separate repository/session owns the authenticated user and therapist dashboards.

## First steps

1. Read `README.md` and `docs/README.md`.
2. Use the Node version declared in `package.json`.
3. Run `npm ci`.
4. Run `npm run verify` before and after consequential changes.
5. Configure `.env.local` only when testing the separate dashboard handoff.

## Product boundary

Do not add an internal user dashboard, therapist dashboard, or authenticated dashboard route here. Public-to-dashboard navigation is intentionally limited to the optional build-time variable:

```dotenv
VITE_DASHBOARD_URL=https://dashboard.example.com
```

When unset, dashboard links remain hidden and registration completion returns to the public site. When set, the same external URL is used for public “دنیای من” links and the registration-complete CTA. Authentication, persistence, user identity, consent records, scheduling, clinical data, and the true registration API belong to the separate dashboard/backend implementation.

The current guided chat and registration sequence are front-end prototype interactions. They do not persist or transmit user input. The reusable widget accepts an asynchronous `onSend(text, history)` callback; see `ro-widget/README.md`.

## Experience invariants

- Preserve the empathy-first progression: shared reality → recognition → «تنها نیستی» → safe expression → low-pressure exploration → trust → user-chosen next step → optional human therapy.
- Do not turn the homepage into an AI-first, sign-up-first, marketplace, medical, SaaS, or therapy-sales page.
- Ro is a warm bridge to human therapists—not a therapist, replacement for therapy, emergency service, or diagnostic authority.
- Registration must remain an invitation after value is experienced, never a gate before conversation.
- Keep memory language transparent, consensual, private, user-controlled, and correctly scoped to the authenticated person once implemented elsewhere.
- Preserve concise Persian RTL copy and progressive disclosure.

## Visual and motion invariants

- Palette: `#0D0D0D`, `#303030`, `#B7FF00`, `#D8D8D8`.
- Keep the hero dark without filtering, desaturating, transforming, scaling, zooming, or applying parallax to the hero video.
- Mobile hero composition uses `object-position` so both animated figures remain readable; do not reposition it with transforms.
- Motion should be restrained and applied at coherent component level, not independently to every nested element.
- Preserve the original reusable Ro widget and keep it mounted visibly on the public site.
- In the «وقتی آماده‌ای حرف بزنی» section, Ro follows the pointer on fine-pointer devices and includes front/rear orbit depth.
- Ro's two eyes are large, tall egg-shaped luminous ovals matching `docs/RO V 003.png`; do not make them circular, small, narrow, or pupil-based.
- Respect `prefers-reduced-motion`.

## Source ownership

- `src/main.jsx`: public funnel, guided chat, prototype registration, external dashboard handoff.
- `src/styles.css`: core public styling, responsive behavior, hero, and Ro stage.
- `src/product-polish.css`: public navigation and responsive refinements.
- `src/interaction-motion.css`: public interactive motion.
- `src/motion-system.css`: component-level reveal system and widget transitions.
- `src/no-motion.css`: hero protection and reduced-motion policy.
- `src/palette-modern.css`: selected palette overrides.
- `ro-widget/`: reusable Ro widget; keep it portable and namespaced.
- `public/assets/`: all browser runtime assets; no CDN dependency.
- `docs/`: supplied design references, provenance, licensing, and checksums.

## Change discipline

- Do not edit generated `dist/` output; it is ignored. Rebuild it with `npm run build`.
- Do not commit `node_modules/`, real `.env` files, logs, caches, or build output.
- Keep package versions exact and commit `package-lock.json` after dependency changes.
- If a checked asset is intentionally replaced, update `docs/asset-checksums.sha256` and `docs/ASSETS.md`.
- Search for accidental remote runtime assets and missing `/assets/*` references before handoff.
