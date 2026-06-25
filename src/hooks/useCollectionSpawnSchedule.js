import { useCallback, useEffect, useRef } from "react";
import { DAY_MS, planSpawnOffsetsForDay } from "../utils/collectionSpawnSchedule";

/**
 * 24時間に2〜4回、ランダムなタイミングでコレクション出現を試みる。
 * onSpawn が false を返した場合は pending となり、retryPendingSpawn で再試行する。
 */
export function useCollectionSpawnSchedule(onSpawn) {
    const onSpawnRef = useRef(onSpawn);
    const timersRef = useRef([]);
    const pendingRef = useRef(false);

    onSpawnRef.current = onSpawn;

    const clearTimers = useCallback(() => {
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
    }, []);

    const trySpawn = useCallback(() => {
        const spawned = onSpawnRef.current?.() === true;
        if (spawned) {
            pendingRef.current = false;
        } else {
            pendingRef.current = true;
        }
        return spawned;
    }, []);

    const retryPendingSpawn = useCallback(() => {
        if (!pendingRef.current) return false;
        return trySpawn();
    }, [trySpawn]);

    const scheduleDay = useCallback(() => {
        clearTimers();
        const offsets = planSpawnOffsetsForDay();

        offsets.forEach((offset) => {
            const id = setTimeout(() => trySpawn(), offset);
            timersRef.current.push(id);
        });

        const rolloverId = setTimeout(() => scheduleDay(), DAY_MS);
        timersRef.current.push(rolloverId);
    }, [clearTimers, trySpawn]);

    useEffect(() => {
        scheduleDay();
        return clearTimers;
    }, [scheduleDay, clearTimers]);

    return { retryPendingSpawn };
}
