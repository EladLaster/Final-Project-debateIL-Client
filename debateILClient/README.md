## AI Debate Arena - Client (React + Vite)

Front-end client for an intelligent debating platform (Real-time debates, Replays, Gamification). Originally scaffolded in Hebrew (RTL); now migrated to English (LTR). Future multi-language support is planned.

### Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start development server with HMR  |
| `npm run build`   | Create production build in `dist/` |
| `npm run preview` | Preview locally after building     |
| `npm run lint`    | Run ESLint over the project        |

### Tech Stack

- React 19
- Vite 7
- React Router DOM (client-side routing)
- Axios (future API calls)
- Tailwind CSS (utility-first styling)

### Folder Structure

```
src/
  api/          // Server communication helpers / axios instances
  components/   // Reusable UI components (Buttons, Cards, Lists ...)
  context/      // React Context (Auth, Theme, Debate State)
  hooks/        // Custom hooks (useDebate, useAuth ...)
  layouts/      // Layout shells (MainLayout, AdminLayout ...)
  pages/        // Route-level pages (Home, Debate, Replay, Profile, Admin)
  styles/       // Global CSS / variables
  utils/        // Utility helpers (formatters, constants, validators)
  App.jsx       // Route definitions
  main.jsx      // App entry point
```

### Current Routes

| Path           | Description          |
| -------------- | -------------------- |
| `/`            | Home (placeholder)   |
| `/debate/:id`  | Live debate view     |
| `/replay/:id`  | Debate replay viewer |
| `/profile/:id` | User profile         |
| `/admin`       | Admin dashboard      |
| `*`            | 404 fallback         |

### Short Roadmap

1. Map former static HTML into atomic UI components (Card, Stats, DebateCard, Avatar ...)
2. Theme + variants (colors, dark overlay, gradients) via CSS variables or Tailwind theme extension
3. State management:
   - Phase 1: Context + useReducer
   - Later (if complexity rises): Zustand or Redux Toolkit
4. Backend integration (configure axios base instance with interceptors in `api/`)
5. Real-time layer (WebSocket / SSE) for live debate updates + audience voting
6. Event capture model (timeline) for replay (design required)
7. Internationalization (react-i18next) for future languages
8. Unit tests: Vitest + React Testing Library
9. E2E tests: Playwright or Cypress
10. Performance: Lazy load heavy routes (React.lazy + Suspense)

### Initial Design System Targets

Foundational components: Button, Badge, Card, Avatar, StatTile, Tabs, ProgressBar, ScoreTag.
Goal: Consistency + future portability (mobile/native wrappers).

### Suggested State Layer (MVP)

```
context/
  DebateContext.jsx  // Debates list, current debate, votes
  AuthContext.jsx    // Authenticated user, permissions, tokens
```

### Example axios base (to be added later)

```
api/http.js
import axios from 'axios';
export const http = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api' });
http.interceptors.request.use(cfg => cfg); // Add Authorization headers etc.
```

### Code Quality

- ESLint installed
- Recommended next: Prettier + Husky (pre-commit), possibly lint-staged

### Environment Variables (.env.local)

```
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000/ws
```

### Getting Started

```
npm install
npm run dev
Open: http://localhost:5173
```

### Open Design / Architecture Questions

1. Replay data model: raw chronological events vs. snapshots per round?
2. User rating: Elo-based? Point accumulation? AI scoring integration?
3. Authentication: Email/password? OAuth? Magic link?
4. Anti-spam for audience votes? Server-side rate limiting & heuristics.

### Contributing

To add a new component: create a folder `components/ComponentName` with `index.jsx` (and optional `styles.css` if needed).

---

Auto-generated foundational README (originally Hebrew) — feel free to refine and expand.

### Tailwind CSS

The project uses Tailwind for fast incremental UI work without premature theming constraints.

#### Relevant Files

- `tailwind.config.js` – theme configuration & extensions
- `postcss.config.js` – PostCSS plugin pipeline
- `src/index.css` – base `@tailwind` directives

#### Example Usage

```jsx
<button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
  Save
</button>
```

#### Utility Class Ordering (Suggested)

- Order: Layout > Display > Spacing > Typography > Color > Effects > State
- Example: `flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded shadow hover:bg-gray-800`

#### Basic Component Pattern

```jsx
export function Card({ title, children }) {
  return (
    <section className="rounded border bg-white shadow-sm p-4">
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      {children}
    </section>
  );
}
```

#### RTL Considerations

Tailwind itself is direction-agnostic. An RTL root (`dir="rtl"`) can be enabled when a Hebrew (or other RTL) locale is added. Current build is LTR English.

#### Next Styling Steps

1. Define color system in theme (brand primary / success / danger)
2. Add variant classes for debate states (live / scheduled / finished)
3. Build core primitives (Button, Badge, Card)
4. Introduce Dark Mode (`darkMode: 'class'`)
5. Add Typography plugin for richer prose styling

### Internationalization (Planned)

We will integrate `react-i18next` once a second language is required. Current codebase is cleanly English; RTL helper styles remain available if Hebrew returns.
