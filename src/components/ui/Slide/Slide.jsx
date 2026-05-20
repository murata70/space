import "./Slide.css";
import { useState } from "react";

const Slide = ({
    title = "THEMES",
    items = [],
    onSelect,
    className = "",
    style,
}) => {
    const [open, setOpen] = useState(false);

    const rootClass = ["slide-area", className].filter(Boolean).join(" ");

    return (
        <div
            className={rootClass}
            style={style}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <div
                className="slide-tab"
                role="button"
                tabIndex={0}
                aria-expanded={open}
                aria-label={title}
                onClick={() => setOpen((prev) => !prev)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOpen((prev) => !prev);
                    }
                }}
            >
                {title}
            </div>

            <div
                className={`slide-panel ${open ? "open" : ""}`}
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
