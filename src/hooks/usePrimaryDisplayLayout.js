import { useEffect } from "react";

function applyLayoutToElement(el, layout) {
    if (!el || !layout?.primary) return;
    const { primary } = layout;
    el.style.setProperty("--primary-offset-x", `${primary.offsetX}px`);
    el.style.setProperty("--primary-offset-y", `${primary.offsetY}px`);
    el.style.setProperty("--primary-width", `${primary.width}px`);
    el.style.setProperty("--primary-height", `${primary.height}px`);
}

/**
 * マルチモニター時、メインディスプレイの矩形を CSS 変数でルートに設定する。
 * .primary-monitor-ui がその範囲に UI を収める。
 */
export function usePrimaryDisplayLayout(rootRef) {
    useEffect(() => {
        const root = rootRef?.current;
        if (!root) return undefined;

        const apply = (layout) => applyLayoutToElement(root, layout);

        window.electron?.getDisplayLayout?.().then(apply);

        const unsubscribe = window.electron?.onDisplayLayoutChanged?.(apply);

        const onResize = () => {
            window.electron?.getDisplayLayout?.().then(apply);
        };
        window.addEventListener("resize", onResize);

        return () => {
            unsubscribe?.();
            window.removeEventListener("resize", onResize);
        };
    }, [rootRef]);
}
