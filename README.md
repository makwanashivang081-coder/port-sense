# Port Sense / Port Risk — SIH Project

Demurrage intelligence website for Indian MSME exporters.

## Structure

```text
port-sense/                 ← this git repo (Next.js app + layer packages)
  packages/layer1…7         ← engines (see ARCHITECTURE.md)
  src/lib/layer2…7          ← UI-facing facts / cost / lanes / clock
  src/app                   ← pages
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
| `/dashboard` | Compare Indian ports for a destination |
| `/25-26` | 2025–26 cargo tonnes + wait money lost |
| `/about` | About us |
| `/services` | Product services |
| `/contact` | Contact form |

## Brand

- **Product name:** Set in `.env.local` → `NEXT_PUBLIC_PRODUCT_NAME=Port Sense` or `Port Risk`
- **Colors:** Navy `#0A1628` + Container Orange `#E8621A`

## Data sources

See `ARCHITECTURE.md` and `C:\SIH\data-sources\manifest.json` for official source documentation.
