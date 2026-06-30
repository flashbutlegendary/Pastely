import { HistoryEntry } from '../types/paste';

const HISTORY_KEY = 'pastely_history';
const MAX_HISTORY_ENTRIES = 10;

/**
 * Get all history entries from localStorage.
 */
export function getLocalHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    // Filter out expired items based on current time
    const now = Date.now();
    return parsed.filter((item: HistoryEntry) => {
      if (item.expiresAt === null) return true;
      return item.expiresAt > now;
    });
  } catch (e) {
    console.error('Failed to parse local history', e);
    return [];
  }
}

/**
 * Add a new entry to the local history.
 */
export function addHistoryEntry(entry: Omit<HistoryEntry, 'createdAt'>): void {
  try {
    const history = getLocalHistory();
    
    // Prevent duplicates
    const filtered = history.filter((item) => item.code !== entry.code);
    
    const newEntry: HistoryEntry = {
      ...entry,
      createdAt: Date.now(),
    };
    
    // Add to the beginning of the list
    const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY_ENTRIES);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save history entry', e);
  }
}

/**
 * Remove an entry from history (e.g. when deleted by user).
 */
export function removeHistoryEntry(code: string): void {
  try {
    const history = getLocalHistory();
    const updated = history.filter((item) => item.code !== code);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to remove history entry', e);
  }
}

/**
 * Clear all history entries.
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear history', e);
  }
}
