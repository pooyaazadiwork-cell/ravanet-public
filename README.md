# Ravanet public experience

The public Persian RTL website for Ravanet (روانت): an empathy-first mental-health entry experience, guided conversation with Ro, and a low-pressure prototype registration flow.

This repository is deliberately **public-site only**. It does not contain the previously prototyped user or therapist dashboards. A separately developed dashboard connects through `VITE_DASHBOARD_URL`.

## What is included

- Complete React/Vite source for the public landing journey
- Guided chat and invited registration prototype
- Original reusable Ro widget and exported `RoFace` component
- Mouse-following Ro stage with reference-based eye and orbit treatment
- Local Ravanet logo and hero-loop video
- Local Vazirmatn weights 200–800 and the SIL OFL license text
- Responsive Persian RTL styling and reduced-motion support
- Supplied Ro expression sheet, character prompt, and palette references
- Asset source documentation and SHA-256 verification tooling
- Exact direct dependency versions and npm lockfile

There are no CDN-hosted runtime assets. The UI prototype also has no API, database, authentication, analytics, or persistent browser storage.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm (the lockfile uses lockfile version 3)

Check your environment:

```bash
node --version
npm --version
```

## Clone and run

```bash
git clone https://github.com/YOUR_ORG/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
npm ci
cp .env.example .env.local   # optional; add the dashboard URL when available
npm run dev
```

Vite listens on `0.0.0.0` so the site works in local, container, and Arena preview environments. Open the URL printed by Vite.

If the dashboard is not available yet, either delete `.env.local` or leave `VITE_DASHBOARD_URL` empty:

```dotenv
VITE_DASHBOARD_URL=
```

## Build and validate

```bash
# Verify committed media, fonts, license, and design-reference checksums
npm run verify:assets

# Create the production output in dist/
npm run build

# Run both checks in sequence
npm run verify

# Preview the production build
npm run preview
```

`dist/` is generated and intentionally ignored. Build it in CI or on the deployment platform rather than committing it. `.github/workflows/verify.yml` runs `npm ci` and `npm run verify` on pushes to `main` and on pull requests.

## Connect the separate dashboard

Create an ignored `.env.local` file:

```dotenv
VITE_DASHBOARD_URL=https://dashboard.example.com
```

`VITE_DASHBOARD_URL` is a Vite build-time value, so restart the development server after changing it and set it in the deployment platform before running `npm run build`.

Behavior:

- **Unset/empty:** all “دنیای من” dashboard links are hidden; the registration-complete button closes the flow and returns to the public site.
- **Set:** header, mobile-menu, and footer dashboard links appear; the registration-complete CTA navigates to the same external URL.

Use an absolute HTTPS URL in production. The handoff is currently simple navigation only: the public prototype does not send messages, registration fields, tokens, or personal data to that URL. The dashboard owns real authentication, user-specific data, consent records, memory, sessions, therapist workflows, scheduling, and backend integration.

If a future authenticated handoff is required, define it explicitly with the dashboard/backend team (for example, an authorization-code or server-created one-time exchange). Do not place personal data, chat history, or durable credentials in query parameters.

### Suggested prompt for the dashboard’s Arena session

> Clone this repository and read `README.md`, `AGENTS.md`, `ro-widget/README.md`, and `docs/README.md`. Treat it as the source of truth for the Ravanet public visual system and Ro. Keep the dashboard implementation in its separate project. Connect the public site using `VITE_DASHBOARD_URL`. If Ro is needed in the dashboard, reuse `ro-widget/RavanetRoWidget.jsx` with `ro-widget/ro-widget.css` rather than redrawing the character. Run `npm ci` and `npm run verify` before making integration changes.

## Reuse the Ro widget

The portable implementation is in:

```text
ro-widget/RavanetRoWidget.jsx
ro-widget/ro-widget.css
ro-widget/README.md
```

Basic use in a React app:

```jsx
import RavanetRoWidget from './ro-widget/RavanetRoWidget.jsx';

export default function App() {
  return <RavanetRoWidget />;
}
```

Without an `onSend` callback it uses local prototype responses. For a real service, provide an asynchronous callback:

```jsx
<RavanetRoWidget
  onSend={async (text, history) => {
    const response = await fetch('/api/ro/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, history }),
    });
    const data = await response.json();
    return data.message;
  }}
/>
```

The consuming system is responsible for authentication, authorization, consent, rate limits, moderation, privacy, retention, safety behavior, and error handling. Ro must not be represented as a therapist, diagnostic authority, or emergency service.

See `ro-widget/README.md` for controlled state, supported moods, responsive behavior, accessibility, and the recommended API shape.

## Project structure

```text
.
├── AGENTS.md                       # Guardrails and handoff instructions for coding agents
├── README.md                       # Clone, build, integration, and deployment guide
├── .env.example                    # Optional external dashboard URL
├── .github/workflows/verify.yml    # Locked install, asset check, production build CI
├── index.html                      # Persian RTL Vite entry document
├── package.json                    # Exact direct dependency versions and scripts
├── package-lock.json               # Reproducible npm dependency graph
├── vite.config.js                  # React plugin and preview-host configuration
├── src/
│   ├── main.jsx                    # Public funnel, guided chat, registration prototype
│   ├── styles.css                  # Core public and responsive styles
│   ├── product-polish.css          # Navigation and layout refinements
│   ├── interaction-motion.css      # Public interaction motion
│   ├── motion-system.css           # Component-level reveals and widget transitions
│   ├── no-motion.css               # Hero protection and reduced-motion rules
│   └── palette-modern.css          # Final palette overrides
├── ro-widget/
│   ├── RavanetRoWidget.jsx         # Reusable widget and RoFace export
│   ├── ro-widget.css               # Namespaced widget styles
│   └── README.md                   # Widget integration contract
├── public/assets/                  # Logo, hero MP4, local fonts, font license
├── docs/                           # Design sources, provenance, and checksums
└── scripts/verify-assets.mjs       # Cross-platform integrity verifier
```

## Design sources and local assets

- `docs/README.md` explains the retained design references and authoritative palette.
- `docs/ASSETS.md` records asset origin, font licensing, and integrity procedure.
- `docs/asset-checksums.sha256` contains machine-readable checksums.
- `public/assets/` contains every browser-facing image, video, and font used by the app.

The final palette is:

| Role | Value |
| --- | --- |
| Background | `#0D0D0D` |
| Secondary surface | `#303030` |
| Primary accent | `#B7FF00` |
| Light text/elements | `#D8D8D8` |

## Deployment

This is a static Vite application:

1. Set `VITE_DASHBOARD_URL` in the deployment environment if the dashboard is ready.
2. Run `npm ci`.
3. Run `npm run verify`.
4. Publish `dist/`.

Common static hosts can use:

- build command: `npm run build`
- output directory: `dist`

The current asset references assume the site is served from the domain root (`/`). If deploying under a subpath such as `https://example.github.io/repository/`, update the Vite base and public asset references as part of that deployment configuration. A custom domain or root-path deployment requires no such change.

## Push this folder to a new GitHub repository

Create an **empty** GitHub repository (do not pre-create a README, `.gitignore`, or license), then run from this project root:

```bash
git init
git add .
git commit -m "Initial Ravanet public website handoff"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/YOUR_REPOSITORY.git
git push -u origin main
```

Before pushing, confirm that ignored/generated files are absent from the commit:

```bash
git status --short
git ls-files | grep -E '(^|/)(node_modules|dist|\.npm)/|(^|/)\.env($|\.)' || true
```

`.env.example` should be tracked; real `.env` files must not be tracked.

## Development guardrails

Read `AGENTS.md` before changing the funnel, Ro, motion, assets, or dashboard boundary. Key constraints include:

- do not reintroduce internal user or therapist dashboards;
- preserve the empathy-first Persian public funnel and optional human-therapy framing;
- preserve the original Ro widget and reference-based large vertical oval eyes;
- do not transform, scale, filter, parallax, or desaturate the hero loop;
- keep motion restrained, component-level, and reduced-motion aware;
- keep runtime media and fonts local.

## Licensing and ownership

Vazirmatn's SIL Open Font License 1.1 is included at `public/assets/Vazirmatn-OFL.txt`. No general software/content license has been selected in this handoff. The repository owner should add the appropriate project license and confirm rights for Ravanet brand media and supplied design materials before granting third-party reuse.
