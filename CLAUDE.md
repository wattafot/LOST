# CLAUDE.md

ALWAYS fix warnings / errors before you commit or push
always find the best approach, writing clean code, isolating components and so on.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (uses Turbopack for faster builds)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`

## Project Architecture

This is a Next.js 15 application using the App Router architecture with TypeScript and Tailwind CSS.

### Tech Stack

- **Framework**: Next.js 15.4.1 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Geist and Geist Mono (via next/font/google)
- **Linting**: ESLint with Next.js configs

### Project Structure

- `app/` - App Router directory containing pages and layouts
  - `layout.tsx` - Root layout with font configuration and metadata
  - `page.tsx` - Home page component
  - `globals.css` - Global styles and Tailwind imports
- `public/` - Static assets (SVG icons)
- TypeScript configuration uses path mapping with `@/*` for root-level imports

### Key Configuration

- **TypeScript**: Strict mode enabled, targeting ES2017
- **ESLint**: Uses Next.js core-web-vitals and TypeScript configs
- **Next.js**: Default configuration with Turbopack enabled for dev mode

The codebase follows Next.js App Router conventions with TypeScript throughout. Components use Tailwind for styling with CSS variables for theming (dark mode support via CSS classes).
