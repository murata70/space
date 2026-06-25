/** background_road1 (.road1 / roadScroll1) と同じ: 画面幅を 18 秒でスクロール */
export const OCEAN_ROAD1_SCROLL_DURATION_MS = 18_000;

export const PASSING_ROAD_SYNC_PROBABILITY = 0.1;
export const PASSING_ROAD_DRIFT_DELAY_MIN_MS = 2_000;
export const PASSING_ROAD_DRIFT_DELAY_MAX_MS = 5_000;
/** 道路同期時に下へずらす量（親要素の高さに対する比率） */
export const PASSING_ROAD_DRIFT_OFFSET_RATIO = 0.04;

/** 10% の確率で 2〜5 秒後に道路同期へ切り替える遅延(ms)。それ以外は null */
export function rollPassingRoadSyncDelayMs() {
    if (Math.random() >= PASSING_ROAD_SYNC_PROBABILITY) {
        return null;
    }

    const span =
        PASSING_ROAD_DRIFT_DELAY_MAX_MS - PASSING_ROAD_DRIFT_DELAY_MIN_MS;
    return PASSING_ROAD_DRIFT_DELAY_MIN_MS + Math.random() * span;
}
