import { useEffect, useRef } from "react";

/**
 * 壁紙モード: メインプロセスのカーソル座標をポーリング（mousemove だけでは不足する場合の補完）
 */
export function useElectronCursorPoll(onMove, enabled, intervalMs = 32) {
    const onMoveRef = useRef(onMove);
    onMoveRef.current = onMove;

    useEffect(() => {
        if (!enabled) return undefined;
        if (typeof window.electron?.getCursorClientPoint !== "function") {
            return undefined;
        }

        let cancelled = false;

        const tick = async () => {
            if (cancelled) return;
            try {
                const pt = await window.electron.getCursorClientPoint();
                if (pt?.inWindow) {
                    onMoveRef.current(pt.x, pt.y);
                } else {
                    onMoveRef.current(null, null);
                }
            } catch {
                /* ignore */
            }
            if (!cancelled) {
                setTimeout(tick, intervalMs);
            }
        };

        tick();

        return () => {
            cancelled = true;
        };
    }, [enabled, intervalMs]);
}
