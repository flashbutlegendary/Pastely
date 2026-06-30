import { queries } from './db/queries';

/**
 * Cleanup routine executed by scheduled crons.
 * Purges expired database records and updates expiration analytics.
 */
export async function runCronCleanup(db: D1Database): Promise<void> {
  const now = Date.now();

  try {
    // 1. Count the number of expired pastes to purge
    const expiredCountResult = await db
      .prepare('SELECT COUNT(1) as count FROM pastes WHERE expiresAt IS NOT NULL AND expiresAt < ?')
      .bind(now)
      .first<{ count: number }>();

    const count = expiredCountResult?.count || 0;

    if (count > 0) {
      // 2. Perform batched database cleanup and analytics logging
      const deleteStmt = db.prepare('DELETE FROM pastes WHERE expiresAt IS NOT NULL AND expiresAt < ?').bind(now);
      const updateAnalyticsStmt = db.prepare('UPDATE analytics SET expiredPastes = expiredPastes + ? WHERE id = "global"').bind(count);

      await db.batch([deleteStmt, updateAnalyticsStmt]);
      console.log(`[Cron Cleanup] Successfully purged ${count} expired pastes.`);
    } else {
      console.log('[Cron Cleanup] No expired pastes found to purge.');
    }
  } catch (err) {
    console.error('[Cron Cleanup] Error during expired paste purges:', err);
  }
}
