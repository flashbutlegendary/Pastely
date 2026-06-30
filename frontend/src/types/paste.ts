// ─── Paste Types ─────────────────────────────────────────────────────────────

export type ExpiryOption = '10m' | '1h' | '24h' | '7d' | 'never';
export type MaxViewsOption = 1 | 5 | 10 | 25 | null; // null = unlimited
export type ContentType = 'text/plain' | 'text/markdown' | 'application/json' | string;

export interface CreatePasteRequest {
  code?: string;              // optional custom code
  title?: string;
  encryptedPayload: string;   // AES-GCM ciphertext (base64)
  iv: string;                 // AES-GCM IV (base64)
  contentType: ContentType;
  size: number;               // bytes of original plaintext
  expiresIn: ExpiryOption;
  maxViews: MaxViewsOption;
}

export interface CreatePasteResponse {
  code: string;
  deleteToken: string;
  createdAt: number;          // Unix ms
  expiresAt: number | null;
}

export interface PasteRecord {
  code: string;
  title: string | null;
  encryptedPayload: string;
  iv: string;
  contentType: ContentType;
  size: number;
  createdAt: number;
  expiresAt: number | null;
  views: number;
  maxViews: number | null;
}

export interface ViewPasteResponse extends PasteRecord {
  remainingViews: number | null;
}

// ─── History ─────────────────────────────────────────────────────────────────

export interface HistoryEntry {
  code: string;
  title: string | null;
  createdAt: number;      // Unix ms
  expiresAt: number | null;
  deleteToken: string;
  shareUrl: string;       // Full URL with #k= fragment
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface AnalyticsData {
  totalPastes: number;
  todayPastes: number;
  deletedPastes: number;
  expiredPastes: number;
}

// ─── API Errors ───────────────────────────────────────────────────────────────

export type ApiErrorCode =
  | 'NOT_FOUND'
  | 'EXPIRED'
  | 'MAX_VIEWS_REACHED'
  | 'CODE_TAKEN'
  | 'INVALID_CODE'
  | 'PAYLOAD_TOO_LARGE'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
}
