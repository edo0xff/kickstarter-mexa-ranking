export type TrendDirection = 'up' | 'down' | 'same' | 'new';

export interface TrendResult {
  direction: TrendDirection;
  /** Positive = moved up (improved rank), negative = moved down */
  delta: number;
}

/**
 * Build a rank map from an ordered list, keyed by a unique string key.
 * Rank is 1-based.
 */
export function buildRankMap<T>(
  items: T[],
  keyFn: (item: T) => string,
): Map<string, number> {
  const map = new Map<string, number>();
  items.forEach((item, idx) => {
    map.set(keyFn(item), idx + 1);
  });
  return map;
}

/**
 * Compute trend for a single item given its current rank and a lookup map of last ranks.
 */
export function computeTrend(
  currentRank: number,
  key: string,
  lastRankMap: Map<string, number>,
): TrendResult {
  const lastRank = lastRankMap.get(key);
  if (lastRank === undefined) {
    return { direction: 'new', delta: 0 };
  }
  const delta = lastRank - currentRank; // positive → improved (moved up)
  if (delta > 0) return { direction: 'up', delta };
  if (delta < 0) return { direction: 'down', delta };
  return { direction: 'same', delta: 0 };
}
