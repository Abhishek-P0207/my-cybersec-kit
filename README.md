# Cybersec Kit

A modern, elegant security toolkit built with Next.js and shadcn/ui. Features a beautiful landing page and comprehensive security analysis tools.

## Features

- 🎨 Beautiful landing page with gradient design
- 🌓 Dark mode support with theme toggle
- 🔐 5 Security tools:
  1. Vulnerability Scanner
  2. Git Repository Scanner
  3. Image Metadata Extractor
  4. Network Scanner
  5. Phishing Detector
- 📊 Security dashboard with metrics
- 👤 User profile and settings
- 🎯 Clean, simplified sidebar navigation

## Getting Started

Install dependencies:
```bash
pnpm install
```

Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.
Dashboard is at [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

## Project Structure

- `/` - Landing page
- `/dashboard` - Main security dashboard
- `/tools/*` - Individual security tools
- `/settings` - User settings and preferences

## Tech Stack

- Next.js 16
- React 19
- shadcn/ui components
- Tailwind CSS v4
- TypeScript
- next-themes for dark mode

## Build

```bash
pnpm build
pnpm start
``` 