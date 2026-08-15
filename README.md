# Port Sense / Port Risk — SIH Project

Demurrage intelligence website for Indian MSME exporters.

## Structure

```text
C:\SIH\
├── port-sense/       ← Next.js website (this app)
├── data-sources/     ← Official data proof (screenshots + manifest)
└── assets/           ← Brand and equipment images
```

## Run locally

```bash
cd C:\SIH\port-sense
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Marketing home (navy hero, container focal) |
| `/dashboard` | Demurrage risk dashboard |
| `/about` | About us |
| `/services` | Product services |
| `/contact` | Contact form |

## Brand

- **Product name:** Set in `.env.local` → `NEXT_PUBLIC_PRODUCT_NAME=Port Sense` or `Port Risk`
- **Colors:** Navy `#0A1628` + Container Orange `#E8621A`

## Data sources

See `C:\SIH\data-sources\manifest.json` and `screenshots/` for official source documentation.
