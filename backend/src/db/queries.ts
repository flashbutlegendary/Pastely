export interface DatabasePaste {
  id: string;
  code: string;
  title: string | null;
  encryptedPayload: string;
  iv: string;
  contentType: string;
  size: number;
  createdAt: number;
  expiresAt: number | null;
  views: number;
  maxViews: number | null;
  deleteToken: string;
  passwordHash: string | null;
  burned: number;
}

export interface DatabaseAnalytics {
  totalPastes: number;
  deletedPastes: number;
  expiredPastes: number;
  todayDate: string;
  todayPastes: number;
}

export const queries = {
  /**
   * Get a paste by its short code.
   */
  async getPasteByCode(db: D1Database, code: string): Promise<DatabasePaste | null> {
    return await db
      .prepare('SELECT * FROM pastes WHERE code = ? AND burned = 0')
      .bind(code)
      .first<DatabasePaste>();
  },

  /**
   * Insert a new paste.
   */
  async createPaste(
    db: D1Database,
    paste: Omit<DatabasePaste, 'views' | 'burned'>
  ): Promise<boolean> {
    const result = await db
      .prepare(
        `INSERT INTO pastes (id, code, title, encryptedPayload, iv, contentType, size, createdAt, expiresAt, maxViews, deleteToken, passwordHash, burned)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
      )
      .bind(
        paste.id,
        paste.code,
        paste.title || null,
        paste.encryptedPayload,
        paste.iv,
        paste.contentType,
        paste.size,
        paste.createdAt,
        paste.expiresAt,
        paste.maxViews,
        paste.deleteToken,
        paste.passwordHash || null
      )
      .run();

    return result.success;
  },

  /**
   * Increment view counter.
   */
  async incrementViews(db: D1Database, code: string): Promise<void> {
    await db.prepare('UPDATE pastes SET views = views + 1 WHERE code = ?').bind(code).run();
  },

  /**
   * Mark a paste as burned (soft deletion before total cron purges).
   */
  async markAsBurned(db: D1Database, code: string): Promise<void> {
    await db.prepare('UPDATE pastes SET burned = 1 WHERE code = ?').bind(code).run();
  },

  /**
   * Delete a paste permanently from the database.
   */
  async deletePastePermanently(db: D1Database, code: string): Promise<boolean> {
    const result = await db.prepare('DELETE FROM pastes WHERE code = ?').bind(code).run();
    return result.success;
  },

  /**
   * Check if a code exists.
   */
  async codeExists(db: D1Database, code: string): Promise<boolean> {
    const result = await db
      .prepare('SELECT 1 FROM pastes WHERE code = ?')
      .bind(code)
      .first();
    return !!result;
  },

  // ─── Analytics Queries ──────────────────────────────────────────────────────

  /**
   * Get current aggregate analytics stats.
   */
  async getAnalytics(db: D1Database): Promise<DatabaseAnalytics | null> {
    return await db
      .prepare('SELECT totalPastes, deletedPastes, expiredPastes, todayDate, todayPastes FROM analytics WHERE id = "global"')
      .first<DatabaseAnalytics>();
  },

  /**
   * Record a new paste creation in global aggregate stats (with daily reset support).
   */
  async recordPasteCreation(db: D1Database): Promise<void> {
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Check if the daily tracker date matches today
    const current = await this.getAnalytics(db);
    
    if (current && current.todayDate !== todayStr) {
      // Date changed: reset daily count to 1 and update date
      await db
        .prepare(
          `UPDATE analytics 
           SET totalPastes = totalPastes + 1, 
               todayPastes = 1, 
               todayDate = ? 
           WHERE id = "global"`
        )
        .bind(todayStr)
        .run();
    } else {
      // Same date: increment counters
      await db
        .prepare(
          `UPDATE analytics 
           SET totalPastes = totalPastes + 1, 
               todayPastes = todayPastes + 1 
           WHERE id = "global"`
        )
        .run();
    }
  },

  /**
   * Increment the counter for manually deleted pastes.
   */
  async recordPasteDeletion(db: D1Database): Promise<void> {
    await db.prepare('UPDATE analytics SET deletedPastes = deletedPastes + 1 WHERE id = "global"').run();
  },

  /**
   * Increment the counter for automatically expired pastes.
   */
  async recordPasteExpiration(db: D1Database, count: number = 1): Promise<void> {
    await db
      .prepare('UPDATE analytics SET expiredPastes = expiredPastes + ? WHERE id = "global"')
      .bind(count)
      .run();
  }
};
