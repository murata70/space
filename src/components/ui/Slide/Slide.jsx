import "./Slide.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useElectronCursorPoll } from "../../../hooks/useElectronCursorPoll";
import { isPointOverSlideHoverZone } from "../../../utils/slideHitTest";

const Slide = ({
    title = "THEMES",
    items = [],
    onSelect,
    className = "",
    style,
    /** コレクション用: ホバーで開き、ホバー解除で閉じる（クリックでは固定しない） */
    expandOnHover = false,
}) => {
    const [open, setOpen] = useState(false);
    const areaRef = useRef(null);

    const rootClass = [
        "slide-area",
        expandOnHover ? "slide-area--hover-expand" : "",
        expandOnHover && open ? "is-hovered" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const updateHover = useCallback((clientX, clientY) => {
        const root = areaRef.current;
        if (!root) return;

        if (clientX == null || clientY == null) {
            setOpen(false);
            return;
        }

        const over = isPointOverSlideHoverZone(root, clientX, clientY);
        setOpen((prev) => (prev === over ? prev : over));

        if (over && typeof window.electron?.setIgnoreMouse === "function") {
            window.electron.setIgnoreMouse(false);
        }
    }, []);

    const hasCursorPoll =
        expandOnHover &&
        typeof window.electron?.getCursorClientPoint === "function";

    useElectronCursorPoll(updateHover, hasCursorPoll, 32);

    useEffect(() => {
        if (!expandOnHover || hasCursorPoll) return undefined;

        const onMouseMove = (e) => updateHover(e.clientX, e.clientY);
        const onPointerMove = (e) => updateHover(e.clientX, e.clientY);

        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("pointermove", onPointerMove, { passive: true });

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("pointermove", onPointerMove);
            setOpen(false);
        };
    }, [expandOnHover, hasCursorPoll, updateHover]);

    return (
        <div ref={areaRef} className={rootClass} style={style}>
            <div
                className="slide-tab"
                role={expandOnHover ? "presentation" : "button"}
                tabIndex={expandOnHover ? -1 : 0}
                aria-expanded={open}
                aria-label={title}
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

            <div className={expandOnHover ? "slide-panel" : `slide-panel ${open ? "open" : ""}`} aria-hidden={!open}>
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
