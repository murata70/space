import "./Slide.css";
import { useState } from "react";

const Slide = ({
  title = "THEMES",
  items = [],
  width = 260,
  tabWidth = 60,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="slide-area"
      style={{ width: `${tabWidth}px` }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >

      {/* タブ */}
      <div className="slide-tab">
        {title}
      </div>

      {/* パネル */}
      <div
        className={`slide-panel ${open ? "open" : ""}`}
        style={{
          width: `${width}px`,
          right: open ? `${tabWidth}px` : `-${width}px`,
        }}
      >
        <h2 className="slide-title">{title}</h2>

        {items.map((item) => (
          <div
            key={item.id}
            className={`slide-item ${item.locked ? "locked" : ""}`}
          >
            {item.name}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Slide;