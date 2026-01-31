1→# Agent Development Guide
2→
3→## Setup & Commands
4→```bash
5→npm install                    # Install dependencies
6→npm run dev                    # Start dev server (http://localhost:8080)
7→npm run build                  # Build for production
8→npm run build:cli              # Build CLI tool
9→npm run lint                   # Run ESLint
10→npm run test                   # Run tests (Vitest)
11→npm run test:watch             # Run tests in watch mode
12→```
13→
14→## Tech Stack
15→- **Framework**: React 18 + TypeScript 5 + Vite
16→- **UI**: Tailwind CSS + shadcn/ui (Radix UI primitives)
17→- **i18n**: react-i18next (EN/KR support)
18→- **Testing**: Vitest + Testing Library + jsdom
19→- **CLI**: Commander.js + chalk
20→
21→## Architecture
22→- `src/` - Main React app (MCP config converter UI)
23→- `cli/` - CLI tool for syncing MCP configs across editors
24→- `src/components/` - UI components (shadcn/ui based)
25→- `src/pages/` - Route pages
26→- `src/lib/` - Utilities and converters
27→- Path alias: `@/` maps to `src/`
28→
29→## Code Conventions
30→- TypeScript strict mode, no unused vars linting disabled
31→- Functional React components with hooks
32→- Import from `@/` alias for internal modules
33→- ESLint config uses flat config format
34→