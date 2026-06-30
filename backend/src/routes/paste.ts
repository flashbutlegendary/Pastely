import { Hono } from 'hono';
import { queries } from '../db/queries';
import { rateLimiter, trackWrongCodeAttempt, checkWrongCodeBlocker } from '../middleware/rateLimit';

const app = new Hono<{ Bindings: { DB: D1Database; MAX_PASTE_SIZE_BYTES: string } }>();

// 32-character safe alphabet
const SAFE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// Helpers to generate random codes/tokens
function generateRandomCode(length = 6): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += SAFE_ALPHABET.charAt(Math.floor(Math.random() * SAFE_ALPHABET.length));
  }
  return result;
}

function generateDeleteToken(): string {
  // Simple alphanumeric secure token
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * 1. POST /api/paste — Create paste
 */
app.post(
  '/',
  rateLimiter({ limit: 10, windowMs: 60 * 1000, message: 'Too many pastes created. Please wait a minute.' }, 'post'),
  async (c) => {
    const db = c.env.DB;
    const maxSize = parseInt(c.env.MAX_PASTE_SIZE_BYTES || '102400', 10);

    let body: any;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ code: 'SERVER_ERROR', message: 'Invalid JSON payload.' }, 400);
    }

    const { code, title, encryptedPayload, iv, contentType, size, expiresIn, maxViews } = body;

    // Validate size and presence
    if (!encryptedPayload || !iv) {
      return c.json({ code: 'SERVER_ERROR', message: 'encryptedPayload and iv are required.' }, 400);
    }

    if (typeof size !== 'number' || size > maxSize) {
      return c.json({ code: 'PAYLOAD_TOO_LARGE', message: `Payload size exceeds maximum limit of ${maxSize / 1024} KB.` }, 413);
    }

    // Determine code
    let finalCode = '';
    if (code) {
      // Validate custom code format
      const trimmed = code.toUpperCase().trim();
      const codeReg = new RegExp(`^[${SAFE_ALPHABET}]{4,8}$`);
      if (!codeReg.test(trimmed)) {
        return c.json({ code: 'INVALID_CODE', message: 'Custom code must be 4 to 8 characters using safe alphabet.' }, 400);
      }

      // Check availability
      const taken = await queries.codeExists(db, trimmed);
      if (taken) {
        return c.json({ code: 'CODE_TAKEN', message: 'This code is already taken.' }, 409);
      }
      finalCode = trimmed;
    } else {
      // Generate random unique code
      let attempts = 0;
      let unique = false;
      while (!unique && attempts < 10) {
        finalCode = generateRandomCode(6);
        const taken = await queries.codeExists(db, finalCode);
        if (!taken) {
          unique = true;
        }
        attempts++;
      }
      if (!unique) {
        return c.json({ code: 'SERVER_ERROR', message: 'Failed to generate a unique code. Try again.' }, 500);
      }
    }

    // Expiry calculation
    const now = Date.now();
    let expiresAt: number | null = null;
    if (expiresIn === '10m') expiresAt = now + 10 * 60 * 1000;
    else if (expiresIn === '1h') expiresAt = now + 60 * 60 * 1000;
    else if (expiresIn === '24h') expiresAt = now + 24 * 60 * 60 * 1000;
    else if (expiresIn === '7d') expiresAt = now + 7 * 24 * 60 * 60 * 1000;
    // else remains null (Never)

    const deleteToken = generateDeleteToken();
    const newPaste = {
      id: crypto.randomUUID(),
      code: finalCode,
      title: title || null,
      encryptedPayload,
      iv,
      contentType: contentType || 'text/plain',
      size,
      createdAt: now,
      expiresAt,
      maxViews: maxViews || null,
      deleteToken,
      passwordHash: null,
    };

    // Save in D1 DB
    await queries.createPaste(db, newPaste);

    // Record analytics asynchronously
    c.executionCtx.waitUntil(queries.recordPasteCreation(db));

    return c.json({
      code: finalCode,
      deleteToken,
      createdAt: now,
      expiresAt,
    }, 201);
  }
);

/**
 * 2. GET /api/paste/:code — Retrieve paste
 */
app.get(
  '/:code',
  checkWrongCodeBlocker,
  rateLimiter({ limit: 60, windowMs: 60 * 1000, message: 'Too many paste requests. Slow down.' }, 'get'),
  async (c) => {
    const db = c.env.DB;
    const code = c.req.param('code').toUpperCase().trim();

    const paste = await queries.getPasteByCode(db, code);

    // If not found
    if (!paste) {
      trackWrongCodeAttempt(c);
      return c.json({ code: 'NOT_FOUND', message: 'Paste not found.' }, 404);
    }

    const now = Date.now();

    // Check expiration
    if (paste.expiresAt && now > paste.expiresAt) {
      c.executionCtx.waitUntil(queries.recordPasteExpiration(db));
      c.executionCtx.waitUntil(queries.deletePastePermanently(db, code));
      return c.json({ code: 'EXPIRED', message: 'This paste has expired.' }, 410);
    }

    // Check views
    if (paste.maxViews && paste.views >= paste.maxViews) {
      c.executionCtx.waitUntil(queries.deletePastePermanently(db, code));
      return c.json({ code: 'MAX_VIEWS_REACHED', message: 'This paste has exceeded its maximum views and was deleted.' }, 410);
    }

    // Increment views
    const nextViews = paste.views + 1;
    await queries.incrementViews(db, code);

    // If this view reaches the limit, soft-burn it (mark burned=1 so next callers block, and delete later)
    if (paste.maxViews && nextViews >= paste.maxViews) {
      c.executionCtx.waitUntil(queries.markAsBurned(db, code));
      // Delete in background
      c.executionCtx.waitUntil(queries.deletePastePermanently(db, code));
    }

    return c.json({
      code: paste.code,
      title: paste.title,
      encryptedPayload: paste.encryptedPayload,
      iv: paste.iv,
      contentType: paste.contentType,
      size: paste.size,
      createdAt: paste.createdAt,
      expiresAt: paste.expiresAt,
      views: nextViews,
      maxViews: paste.maxViews,
      remainingViews: paste.maxViews ? Math.max(0, paste.maxViews - nextViews) : null,
    });
  }
);

/**
 * 3. GET /api/paste/:code/exists — Check code availability
 */
app.get('/:code/exists', async (c) => {
  const db = c.env.DB;
  const code = c.req.param('code').toUpperCase().trim();
  const exists = await queries.codeExists(db, code);
  return c.json({ exists }, exists ? 200 : 404);
});

/**
 * 4. DELETE /api/paste/:code — Creator manual deletion
 */
app.delete('/:code', async (c) => {
  const db = c.env.DB;
  const code = c.req.param('code').toUpperCase().trim();
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ code: 'SERVER_ERROR', message: 'Unauthorized. Delete token is required.' }, 401);
  }

  const deleteToken = authHeader.substring(7); // Remove 'Bearer '
  const paste = await queries.getPasteByCode(db, code);

  if (!paste) {
    return c.json({ code: 'NOT_FOUND', message: 'Paste not found or already deleted.' }, 404);
  }

  // Validate token
  if (paste.deleteToken !== deleteToken) {
    return c.json({ code: 'SERVER_ERROR', message: 'Invalid delete token.' }, 403);
  }

  // Delete paste
  const success = await queries.deletePastePermanently(db, code);
  if (success) {
    c.executionCtx.waitUntil(queries.recordPasteDeletion(db));
    return c.json({ success: true, message: 'Paste deleted successfully.' });
  }

  return c.json({ code: 'SERVER_ERROR', message: 'Failed to delete paste.' }, 500);
});

export default app;
