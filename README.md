# Arcana Garden

A tarot reading and learning platform powered by AI. Get personalized card readings, explore all 78 cards in a visual library, and keep a journal of your readings — all grounded in thoughtful, real-life interpretations.

**Live:** [arcana-garden.vercel.app](https://arcana-garden.vercel.app)

---

## Features

- **AI-Powered Readings** — Single card or 3-card (Past/Present/Future) spreads with streaming responses from Claude. Input your question, emotional context, and zodiac sign for a personalized reading.
- **Card Library** — Browse all 78 tarot cards with search and filter by Major Arcana or suit. Each card has its own detail page with upright and reversed meanings.
- **Daily Card** — A new card each day with AI-generated contextual reflection.
- **Reading Journal** — Save readings with personal notes and revisit your history.
- **3D Animations** — Interactive floating card animations on the hero section using Three.js and React Three Fiber.
- **Study Section** — Learn tarot fundamentals and card symbolism.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| AI | Anthropic Claude API (streaming) |
| 3D | Three.js, React Three Fiber, Drei |
| Animation | Framer Motion, GSAP |
| Analytics | Upstash Redis |
| Deployment | Vercel |

---

## Getting Started

**Prerequisites:** Node.js 18+, an Anthropic API key, and an Upstash Redis instance.

```bash
git clone https://github.com/URSA0112/arcana-garden.git
cd arcana-garden
npm install
```

Create a `.env.local` file in the project root:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key

# Upstash Redis (for analytics and reading logs)
KV_REST_API_URL=your_upstash_redis_url
KV_REST_API_TOKEN=your_upstash_write_token
KV_REST_API_READ_ONLY_TOKEN=your_upstash_read_only_token

# Admin dashboard password
ADMIN_TOKEN=your_admin_password
```

```bash
npm run dev
# http://localhost:3000
```

---

## Project Structure

```
app/
├── api/
│   ├── reading/       # Streaming Claude reading endpoint
│   ├── track/         # Visitor analytics
│   └── admin/         # Admin data endpoints
├── components/        # Shared UI components
├── reading/           # Reading page + interaction logic
├── library/           # Card library + individual card pages
├── journal/           # User reading journal
├── study/             # Educational content
└── admin/             # Password-protected analytics dashboard

lib/
├── tarot-data.ts      # Complete 78-card deck data
├── logger.ts          # Redis logging
├── storage.ts         # Browser storage utilities
└── astronomy.ts       # Zodiac calculations

public/                # Card images (78 cards + card back)
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Claude API key for readings |
| `KV_REST_API_URL` | Yes | Upstash Redis endpoint |
| `KV_REST_API_TOKEN` | Yes | Upstash write token |
| `KV_REST_API_READ_ONLY_TOKEN` | Yes | Upstash read-only token |
| `ADMIN_TOKEN` | Yes | Admin dashboard password |

---

## Deployment

The app is configured for Vercel. Push to `main` to trigger a deploy. Make sure all environment variables are set in your Vercel project settings.

```bash
npm run build   # Verify the build locally before pushing
```

---

## License

MIT
