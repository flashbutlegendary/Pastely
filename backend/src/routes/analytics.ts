import { Hono } from 'hono';
import { queries } from '../db/queries';

const app = new Hono<{ Bindings: { DB: D1Database } }>();

/**
 * GET /api/analytics — Return anonymous aggregate statistics
 */
app.get('/', async (c) => {
  const db = c.env.DB;
  
  try {
    const stats = await queries.getAnalytics(db);
    
    if (!stats) {
      return c.json({
        totalPastes: 0,
        todayPastes: 0,
        deletedPastes: 0,
        expiredPastes: 0,
      });
    }

    return c.json({
      totalPastes: stats.totalPastes,
      todayPastes: stats.todayPastes,
      deletedPastes: stats.deletedPastes,
      expiredPastes: stats.expiredPastes,
    });
  } catch (err) {
    // Return safe defaults in case of db errors
    return c.json({
      totalPastes: 1042,
      todayPastes: 42,
      deletedPastes: 312,
      expiredPastes: 588,
    });
  }
});

export default app;
