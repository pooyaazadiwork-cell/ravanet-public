# Asset provenance and integrity

All browser-facing assets used by the public site are committed under `public/assets/`. The application does **not** fetch the logo, hero media, fonts, scripts, or styles from a CDN at runtime.

## Brand assets

| Local file | Source retained for provenance | SHA-256 |
| --- | --- | --- |
| `public/assets/logo-light.png` | `https://github.com/pooyaazadiwork-cell/rava/releases/download/rava/logo.light.PNG` | `978092429e2315854abddceda8b070678ee21a238de51e5d80b3bc6ff76cd2ad` |
| `public/assets/ravanet-hero-loop.mp4` | `https://github.com/pooyaazadiwork-cell/rava/releases/download/rava/ravanet-hero-loop.mp4` | `5947e39d7d7d78c1cbc766e08ad96b54efc1201be8bca2cfe6b89e39535b57de` |

Both files were downloaded into this repository and checksum-verified on 2026-09-05. The source links above are historical provenance only; they are not referenced by the running application.

## Local typography

The repository carries Vazirmatn 33.003 static TrueType files for weights 200–800:

- `public/assets/vazirmatn-200.ttf`
- `public/assets/vazirmatn-300.ttf`
- `public/assets/vazirmatn-400.ttf`
- `public/assets/vazirmatn-500.ttf`
- `public/assets/vazirmatn-600.ttf`
- `public/assets/vazirmatn-700.ttf`
- `public/assets/vazirmatn-800.ttf`

Vazirmatn is distributed under the SIL Open Font License 1.1. The required license text is committed as `public/assets/Vazirmatn-OFL.txt`. Upstream project: `https://github.com/rastikerdar/vazirmatn`.

## Design references

These user-supplied source references are retained under `docs/` so a future implementation session can inspect the intended Ro character and color system:

- `docs/RO V 003.png` (Ro expression sheet)
- `docs/RO_CHARACTER_PROMPT.md`
- `docs/Ravanet_Color_Palettes.txt`

They are reference material, not runtime dependencies.

## Verify integrity

The machine-readable checksum list is `docs/asset-checksums.sha256`. Verify it on any clone with:

```bash
npm run verify:assets
```

To verify manually on a Unix-like system:

```bash
sha256sum --check docs/asset-checksums.sha256
```

If an asset is intentionally replaced, review its origin and rights, then update the corresponding checksum in `docs/asset-checksums.sha256` and this document where applicable.
