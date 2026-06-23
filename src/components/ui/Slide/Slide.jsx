import "./Slide.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useElectronCursorPoll } from "../../../hooks/useElectronCursorPoll";
import { isPointOverSlideZone } from "../../../utils/slideHitTest";

const CLOSE_DELAY_MS = 100;

const Slide = ({
    title = "THEMES",
    items = [],
    onSelect,
    className = "",
    style,
    /** コレクション用: THEMES タブで開き、維持ゾーンから離れたら閉じる */
    expandOnHover = false,
}) => {
    const [open, setOpen] = useState(false);
    const areaRef = useRef(null);
    const openRef = useRef(false);
    const closeTimerRef = useRef(null);
    const lastPointRef = useRef({ x: null, y: null });

    openRef.current = open;

    const rootClass = [
        "slide-area",
        expandOnHover ? "slide-area--hover-expand" : "",
        expandOnHover && open ? "is-hovered" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const clearCloseTimer = useCallback(() => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }, []);

    const readCursorPoint = useCallback(async () => {
        if (typeof window.electron?.getCursorClientPoint === "function") {
            try {
                const pt = await window.electron.getCursorClientPoint();
                if (pt?.inWindow && pt.x != null && pt.y != null) {
                    return { x: pt.x, y: pt.y };
                }
            } catch {
                /* ignore */
            }
        }

        const { x, y } = lastPointRef.current;
        if (x != null && y != null) {
            return { x, y };
        }

        return null;
    }, []);

    const scheduleClose = useCallback(() => {
        if (closeTimerRef.current) return;

        closeTimerRef.current = setTimeout(async () => {
            closeTimerRef.current = null;
            const root = areaRef.current;
            if (!root || !openRef.current) return;

            const point = await readCursorPoint();
            if (point) {
                const stillOver = isPointOverSlideZone(
                    root,
                    point.x,
                    point.y,
                    true
                );
                if (stillOver) return;
            }

            setOpen(false);
        }, CLOSE_DELAY_MS);
    }, [readCursorPoint]);

    const syncOpenFromPoint = useCallback(
        (clientX, clientY) => {
            const root = areaRef.current;
            if (!root) return;

            if (clientX != null && clientY != null) {
                lastPointRef.current = { x: clientX, y: clientY };
            }

            const isOpen = openRef.current;

            if (!isOpen) {
                if (clientX == null || clientY == null) return;

                if (isPointOverSlideZone(root, clientX, clientY, false)) {
                    clearCloseTimer();
                    setOpen(true);
                }
                return;
            }

            if (clientX == null || clientY == null) {
                scheduleClose();
                return;
            }

            if (isPointOverSlideZone(root, clientX, clientY, true)) {
                clearCloseTimer();
                if (typeof window.electron?.setIgnoreMouse === "function") {
                    window.electron.setIgnoreMouse(false);
                }
                return;
            }

            scheduleClose();
        },
        [clearCloseTimer, scheduleClose]
    );

    const hasCursorPoll =
        expandOnHover &&
        typeof window.electron?.getCursorClientPoint === "function";

    useElectronCursorPoll(syncOpenFromPoint, hasCursorPoll, 24);

    useEffect(() => {
        if (!expandOnHover) return undefined;

        const onMouseMove = (e) => syncOpenFromPoint(e.clientX, e.clientY);
        const onPointerMove = (e) => syncOpenFromPoint(e.clientX, e.clientY);

        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("pointermove", onPointerMove, { passive: true });

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("pointermove", onPointerMove);
            clearCloseTimer();
            setOpen(false);
        };
    }, [expandOnHover, syncOpenFromPoint, clearCloseTimer]);

    const handleTabMouseEnter = useCallback(() => {
        if (!expandOnHover) return;
        clearCloseTimer();
        setOpen(true);
        if (typeof window.electron?.setIgnoreMouse === "function") {
            window.electron.setIgnoreMouse(false);
        }
    }, [expandOnHover, clearCloseTimer]);

    return (
        <div ref={areaRef} className={rootClass} style={style}>
            <div
                className="slide-tab"
                role={expandOnHover ? "presentation" : "button"}
                tabIndex={expandOnHover ? -1 : 0}
                aria-expanded={open}
                aria-label={title}
                onMouseEnter={expandOnHover ? handleTabMouseEnter : undefined}
                onClick={
                    expandOnHover
                        ? undefined
                        : () => setOpen((prev) => !prev)
                }
                onKeyDown={
                    expandOnHover
                        ? undefined
                        : (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  setOpen((prev) => !prev);
                              }
                          }
                }
            >
                {title}
            </div>

            <div
                className={expandOnHover ? "slide-panel" : `slide-panel ${open ? "open" : ""}`}
                aria-hidden={!open}
            >
                <h2 className="slide-title">{title}</h2>

                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`slide-item ${item.locked ? "locked" : ""}`}
                        onClick={() => !item.locked && onSelect?.(item.id)}
                    >
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Slide;
