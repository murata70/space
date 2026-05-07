import "./Collection.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * 仮データ（未確定状態）
 */
const COLLECTIONS = Array.from({ length: 11 }).map((_, i) => ({
  id: i,
}));

const THEMES = [
  { id: "space", name: "宇宙" },
  { id: "ocean", name: "海（coming soon）", locked: true },
  { id: "forest", name: "森（coming soon）", locked: true },
];

const Collection = () => {
  const [hovered, setHovered] = useState(null);
  const [themeOpen, setThemeOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="collection-wrap">

      {/* メイン */}
      <div className="collection-main">
        <h1 className="title">COLLECTION</h1>

        <div className="grid">
          {COLLECTIONS.map((item) => (
            <div
              key={item.id}
              className="card"
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="unknown">???</div>

              {hovered === item.id && (
                <div className="preview" />
              )}
            </div>
          ))}
        </div>

        {/* 戻るボタン */}
        <button
          className="back-btn"
          onClick={() => navigate("/wallpaper")}
        >
          ← 壁紙に戻る
        </button>
      </div>

      {/* テーマエリア */}
      <div
        className="theme-area"
        onMouseEnter={() => setThemeOpen(true)}
        onMouseLeave={() => setThemeOpen(false)}
      >

        {/* タブ */}
        <div className="theme-tab">
          THEMES
        </div>

        {/* パネル */}
        <div className={`theme-panel ${themeOpen ? "open" : ""}`}>
          <h2 className="theme-title">THEMES</h2>

          {THEMES.map((t) => (
            <div
              key={t.id}
              className={`theme-item ${t.locked ? "locked" : ""}`}
            >
              {t.name}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default Collection;