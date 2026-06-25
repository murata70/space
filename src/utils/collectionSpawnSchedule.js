const DAY_MS = 24 * 60 * 60 * 1000;

/** 24時間あたりの出現回数（2〜4） */
export function pickDailySpawnCount() {
    return 2 + Math.floor(Math.random() * 3);
}

/**
 * 次の24時間枠内での出現タイミング（ミリ秒オフセット）を昇順で返す
 */
export function planSpawnOffsetsForDay(count = pickDailySpawnCount()) {
    const offsets = Array.from({ length: count }, () => Math.random() * DAY_MS);
    offsets.sort((a, b) => a - b);
    return offsets;
}

/** コレクション配列から完全ランダムに1件選ぶ（連続同一もあり得る） */
export function pickRandomCollectionItem(master) {
    if (!master?.length) return null;
    return master[Math.floor(Math.random() * master.length)];
}

export { DAY_MS };
