/**
 * Safe alphabet for short codes (32 characters).
 * Excludes easily confused characters: O, 0, I, 1, L.
 */
export const SAFE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * Generates a random code of a specified length using the safe alphabet.
 */
export function generateRandomCode(length: number = 6): string {
  let result = '';
  const charactersLength = SAFE_ALPHABET.length;
  // Use crypto.getRandomValues for cryptographic randomness
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    result += SAFE_ALPHABET.charAt(randomValues[i] % charactersLength);
  }
  return result;
}

/**
 * Validates whether a custom code satisfies the format rules:
 * - 4 to 8 characters
 * - Only characters from the safe alphabet (case-insensitive conversion recommended)
 */
export function validateCustomCode(code: string): { isValid: boolean; error?: string } {
  const cleanCode = code.toUpperCase().trim();
  if (cleanCode.length < 4 || cleanCode.length > 8) {
    return { isValid: false, error: 'Code must be between 4 and 8 characters.' };
  }

  for (let i = 0; i < cleanCode.length; i++) {
    if (!SAFE_ALPHABET.includes(cleanCode[i])) {
      return {
        isValid: false,
        error: `Invalid character '${code[i]}'. Only alphanumeric characters are allowed (excluding 0, O, 1, I, L).`
      };
    }
  }

  return { isValid: true };
}
