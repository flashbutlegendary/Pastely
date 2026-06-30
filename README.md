# Pastely — Paste once. Open anywhere.

Pastely is a production-quality, privacy-first web application designed to transfer text, code snippets, links, notes, and clipboard content between devices instantly.

---

## Technical Highlights

- **Zero-Knowledge Encryption**: AES-GCM 256-bit symmetric encryption runs entirely in the browser using the Web Crypto API. The encryption key is stored inside the URL fragment identifier (`#k=...`), which means it remains local and is **never transmitted to the server**.
- **Edge Native Stack**: Built for Cloudflare Workers (edge compute routing) and Cloudflare D1 (SQLite database at the edge) for maximum performance and global latency optimization.
- **Debounced Code Checking**: Custom codes (4–8 characters using a safe confusable-free alphabet) are checked for availability on-the-fly.
- **Browser History**: Stores the last 10 created codes locally in the browser (`localStorage`) for quick retrieval without any remote tracking.
- **Manual Deletions**: Creators get a unique `deleteToken` to manually delete pastes.
- **Hourly Cron Cleanup**: A Cloudflare Workers scheduled trigger runs every hour to wipe expired records completely from the database.

---

## Project Structure

```
e:/Pastely/
├── frontend/                        # React + Vite + TypeScript (Tailwind + Framer Motion)
│   ├── src/
│   │   ├── features/                # Landing, Home, Create, Success, Join, View, History, FAQ, etc.
│   │   ├── components/ui/           # Button, Card, Input, Textarea, Badge, Modal, Spinner
│   │   ├── components/layout/       # Navbar, Footer, PageWrapper, Layout
│   │   ├── lib/                     # crypto.ts, api.ts, codegen.ts, history.ts, qr.ts
│   │   ├── hooks/                   # useTheme, useClipboard, useDragDrop
│   │   ├── types/                   # TypeScript interfaces
│   │   └── main.tsx                 # Bootstrapper
│   └── package.json
│
└── backend/                         # Cloudflare Workers (Hono Router)
    ├── src/
    │   ├── db/schema.sql            # SQLite migration script
    │   ├── db/queries.ts            # D1 query mappings
    │   ├── routes/                  # Paste & Analytics API endpoints
    │   ├── middleware/              # CORS & rate limiting check
    │   ├── cron.ts                  # Scheduled cleanup worker
    │   └── index.ts                 # Base app handler
    ├── wrangler.toml                # Wrangler settings & D1 bindings
    └── package.json
```

---

## Local Development Setup

To run Pastely locally, ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize a local D1 database:
   ```bash
   npx wrangler d1 create pastely-db
   ```
4. Run migrations locally:
   ```bash
   npx wrangler d1 execute pastely-db --local --file=src/db/schema.sql
   ```
5. Spin up the local development worker:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server (proxies `/api` requests to your local Workers instance on port `8787`):
   ```bash
   npm run dev
   ```

---

## Production Deployment to Cloudflare

Deploying Pastely to your Cloudflare account is simple using Wrangler.

### 1. Database Creation
Create the production D1 database:
```bash
npx wrangler d1 create pastely-db
```
*Note the `database_id` returned in the output.*

### 2. Configure wrangler.toml
Open `backend/wrangler.toml` and update the `database_id` with your created database ID:
```toml
[[d1_databases]]
binding = "DB"
database_name = "pastely-db"
database_id = "PASTELY_D1_DATABASE_ID_PLACEHOLDER" # <-- Replace this
```

### 3. Deploy Database Migrations
Apply the SQL schema to the production database:
```bash
npx wrangler d1 execute pastely-db --remote --file=src/db/schema.sql
```

### 4. Deploy the Backend Worker
From the `backend` directory, publish the Worker:
```bash
npm run deploy
```

### 5. Deploy the Frontend Pages
1. Build the production assets inside the `frontend` directory:
   ```bash
   npm run build
   ```
2. Deploy the built static folder `dist/` directly to Cloudflare Pages:
   ```bash
   npx wrangler pages deploy dist/ --project-name=pastely-web
   ```
