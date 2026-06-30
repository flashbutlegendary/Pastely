import { Hono } from 'hono';
import { cors } from 'hono/cors';
import pasteRouter from './routes/paste';
import analyticsRouter from './routes/analytics';
import { runCronCleanup } from './cron';

const app = new Hono<{ Bindings: { DB: D1Database } }>();

// 1. CORS Middleware configuration
app.use(
  '*',
  cors({
    origin: (origin) => {
      // Allow localhost for development and pastely origins for prod
      if (!origin) return '*';
      if (origin.startsWith('http://localhost:') || origin.endsWith('pastely.app') || origin.endsWith('pages.dev')) {
        return origin;
      }
      return origin; // Fallback to reflect origin safely
    },
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
);

// 2. Health check route
app.get('/api/health', (c) => c.json({ status: 'healthy', timestamp: Date.now() }));

// 3. Mount child routes
app.route('/api/paste', pasteRouter);
app.route('/api/analytics', analyticsRouter);

// 4. Fallback route handler
app.all('*', (c) => c.json({ code: 'NOT_FOUND', message: 'API Endpoint not found.' }, 404));

// 5. Cloudflare Scheduled Cron Handler Export
export default {
  fetch: app.fetch,

  async scheduled(event: any, env: { DB: D1Database }, ctx: any) {
    console.log(`[Cron Trigger] Scheduled event fired at ${event.scheduledTime}`);
    ctx.waitUntil(runCronCleanup(env.DB));
  },
};
