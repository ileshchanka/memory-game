const STORAGE_KEY = 'memory-game-results';
const TOP_SIZE = 10;

/**
 * @typedef {{ id: string, moves: number, date: number }} GameResult
 */

/** @returns {GameResult[]} */
export function loadResults() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** @param {GameResult} result */
export function saveResult(result) {
  const results = loadResults();
  if (results.some(({ id }) => id === result.id)) return;

  results.push(result);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    // Storage is unavailable (private mode, quota) — the game still works.
  }
}

/** Fewest moves first; on a tie the earlier game ranks higher. */
export function getTopResults() {
  return loadResults()
    .sort((a, b) => a.moves - b.moves || a.date - b.date)
    .slice(0, TOP_SIZE);
}

/** @param {number} timestamp */
export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
}
