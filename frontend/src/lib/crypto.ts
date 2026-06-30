/**
 * Browser-side AES-GCM 256-bit encryption using the Web Crypto API.
 * The encryption key is NEVER sent to the server — it lives only in the URL fragment.
 *
 * Flow:
 *   1. generateKey()         → CryptoKey + base64 export
 *   2. encrypt(text, key)    → { ciphertext, iv } (both base64)
 *   3. Key exported to base64 → embedded in URL #k=<base64key>
 *   4. Server stores ciphertext + iv only
 *   5. Receiver: importKey(base64) → decrypt(ciphertext, iv, key) → plaintext
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // bytes (96 bits — recommended for AES-GCM)

// ─── Key Generation ───────────────────────────────────────────────────────────

/** Generate a new AES-GCM 256-bit CryptoKey */
export async function generateKey(): Promise<CryptoKey> {
  return window.crypto.subtle.generateKey(
    { name: ALGORITHM, length: KEY_LENGTH },
    true,           // extractable — we need to export it for the URL
    ['encrypt', 'decrypt']
  );
}

/** Export a CryptoKey to URL-safe base64 string */
export async function exportKey(key: CryptoKey): Promise<string> {
  const raw = await window.crypto.subtle.exportKey('raw', key);
  return bufferToBase64Url(raw);
}

/** Import a CryptoKey from URL-safe base64 string */
export async function importKey(base64Key: string): Promise<CryptoKey> {
  const raw = base64UrlToBuffer(base64Key);
  return window.crypto.subtle.importKey(
    'raw',
    raw,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,          // not extractable after import
    ['decrypt']
  );
}

// ─── Encryption ───────────────────────────────────────────────────────────────

export interface EncryptedPayload {
  ciphertext: string; // base64url
  iv: string;         // base64url
}

/** Encrypt plaintext string with a CryptoKey */
export async function encrypt(
  plaintext: string,
  key: CryptoKey
): Promise<EncryptedPayload> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const cipherBuffer = await window.crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );

  return {
    ciphertext: bufferToBase64Url(cipherBuffer),
    iv: bufferToBase64Url(iv.buffer),
  };
}

// ─── Decryption ───────────────────────────────────────────────────────────────

/** Decrypt base64url-encoded ciphertext with a CryptoKey */
export async function decrypt(
  ciphertext: string,
  iv: string,
  key: CryptoKey
): Promise<string> {
  const cipherBuffer = base64UrlToBuffer(ciphertext);
  const ivBuffer = base64UrlToBuffer(iv);

  const plainBuffer = await window.crypto.subtle.decrypt(
    { name: ALGORITHM, iv: ivBuffer },
    key,
    cipherBuffer
  );

  const decoder = new TextDecoder();
  return decoder.decode(plainBuffer);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** ArrayBuffer → URL-safe base64 (no +/= padding issues) */
function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** URL-safe base64 → ArrayBuffer */
function base64UrlToBuffer(base64Url: string): ArrayBuffer {
  const base64 = base64Url
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(base64Url.length + ((4 - (base64Url.length % 4)) % 4), '=');

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// ─── Key from URL fragment ────────────────────────────────────────────────────

/** Extract the encryption key from a URL fragment: #k=<base64key> */
export function extractKeyFromFragment(fragment: string): string | null {
  // fragment may start with '#' or not
  const hash = fragment.startsWith('#') ? fragment.slice(1) : fragment;
  const params = new URLSearchParams(hash);
  return params.get('k');
}

/** Build URL fragment string from base64 key */
export function buildKeyFragment(base64Key: string): string {
  return `#k=${base64Key}`;
}

/** Full encrypt-and-key-generate flow */
export async function encryptContent(plaintext: string): Promise<{
  encryptedPayload: string;
  iv: string;
  keyBase64: string;
}> {
  const key = await generateKey();
  const keyBase64 = await exportKey(key);
  const { ciphertext, iv } = await encrypt(plaintext, key);
  return { encryptedPayload: ciphertext, iv, keyBase64 };
}

/** Full decrypt flow — importKey + decrypt in one call */
export async function decryptContent(
  ciphertext: string,
  iv: string,
  keyBase64: string
): Promise<string> {
  const key = await importKey(keyBase64);
  return decrypt(ciphertext, iv, key);
}
