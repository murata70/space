/** passing の次回出現までの最短・最長（秒） */
export const PASSING_SPAWN_INTERVAL_MIN_MS = 15_000;
export const PASSING_SPAWN_INTERVAL_MAX_MS = 180_000;

/** 15〜180秒の間でランダムな出現間隔（ms） */
export function getPassingSpawnDelayMs() {
    const span =
        PASSING_SPAWN_INTERVAL_MAX_MS - PASSING_SPAWN_INTERVAL_MIN_MS;
    return PASSING_SPAWN_INTERVAL_MIN_MS + Math.random() * span;
}
