# My Security Kit

A full-stack Next.js application for your essential security needs.

## Getting Started

Install dependencies:
```bash
pnpm install
```

Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

Backend API routes are located in `src/app/api/`. Example:
- `GET /api/health` - Health check endpoint

## Development

- **Frontend**: Add components in `src/components/`, pages in `src/app/`
- **Backend**: Add API routes in `src/app/api/`
- **Shared Logic**: Add utilities in `src/lib/`, types in `src/types/`
- **Hooks**: Add custom hooks in `src/hooks/`

## Build

```bash
pnpm build
pnpm start
```

So currently we have,
1. Network scan
2. Image Meta data
3. Phishing attack detection
4. URL vulnerability scan 