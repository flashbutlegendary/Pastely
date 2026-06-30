-- Drop tables if they exist to allow clean migrations during setup
DROP TABLE IF EXISTS pastes;
DROP TABLE IF EXISTS analytics;

-- Main Pastes Table
CREATE TABLE pastes (
  id               TEXT PRIMARY KEY,
  code             TEXT UNIQUE NOT NULL,
  title            TEXT,
  encryptedPayload TEXT NOT NULL,         -- ciphertext (base64)
  iv               TEXT NOT NULL,          -- AES-GCM IV (base64)
  contentType      TEXT NOT NULL DEFAULT 'text/plain',
  size             INTEGER NOT NULL DEFAULT 0,
  createdAt        INTEGER NOT NULL,       -- Unix ms
  expiresAt        INTEGER,                -- NULL = never
  views            INTEGER DEFAULT 0,
  maxViews         INTEGER,                -- NULL = unlimited
  deleteToken      TEXT NOT NULL,          -- authentication token for creator manual deletions
  passwordHash     TEXT,                   -- reserved for future pass-protected pastes
  burned           INTEGER DEFAULT 0       -- 1 = reached view limit and is soft-purged (permanently deleted in D1 shortly after)
);

-- Anonymous Aggregated Analytics Table
CREATE TABLE analytics (
  id              TEXT PRIMARY KEY DEFAULT 'global',
  totalPastes     INTEGER DEFAULT 0,
  deletedPastes   INTEGER DEFAULT 0,
  expiredPastes   INTEGER DEFAULT 0,
  todayDate       TEXT,                    -- YYYY-MM-DD
  todayPastes     INTEGER DEFAULT 0
);

-- Seed global analytics row
INSERT INTO analytics (id, totalPastes, deletedPastes, expiredPastes, todayDate, todayPastes)
VALUES ('global', 0, 0, 0, '', 0);

-- Indexes for performance
CREATE UNIQUE INDEX idx_code ON pastes(code);
CREATE INDEX idx_expires ON pastes(expiresAt);
CREATE INDEX idx_delete_token ON pastes(deleteToken);
