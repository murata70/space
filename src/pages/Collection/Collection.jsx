import "./Collection.css";
import { useState } from "react";

/**
 * コレクションマスタ（DB想定）
 */
const COLLECTIONS = [
  { id: "ufo", name: "UFO", unlockCond: "ランダム出現" },
  { id: "end_credit", name: "エンドクレジット", unlockCond: "？？？" },
  { id: "satellite", name: "人工衛星", unlockCond: "一定時間経過" },
  { id: "superman", name: "スーパーマン", unlockCond: "高速イベント" },
  { id: "black_hole", name: "ブラックホール", unlockCond: "低確率" },
  { id: "meteor_shower", name: "流星群", unlockCond: "一定確率" },
  { id: "meteor", name: "隕石", unlockCond: "初期解放" },
  { id: "glowing_cat", name: "ひかるねこ", unlockCond: "？？？" },
  { id: "lost_astronaut", name: "助からない宇宙飛行士", unlockCond: "低確率" },
  { id: "constellation_animal", name: "星座の動物", unlockCond: "夜間" },
  { id: "giant_ship", name: "巨大宇宙船", unlockCond: "特定条件" },
];

/**
 * DB想定：解放済み
 */
const unlocked = ["meteor", "ufo", "satellite"];

/**
 * 未読管理
 */
const eventLog = ["ufo"];

const THEMES = [
  { id: "space", name: "宇宙" },
  { id: "ocean", name: "海（coming soon）", locked: true },
  { id: "forest", name: "森（coming soon）", locked: true },
];

const Collection = () => {
  const [hovered, setHovered] = useState(null);
  const [themeOpen, setThemeOpen] = useState(false);

  return (
    <div className="collection-wrap">

      {/* 左メイン図鑑 */}
      <div className="collection-main">
        <h1 className="title">COLLECTION</h1>

        <div className="grid">
          {COLLECTIONS.map((item) => {
            const isUnlocked = unlocked.includes(item.id);
            const isNew = eventLog.includes(item.id);

            return (
              <div
                key={item.id}
                className={`card ${!isUnlocked ? "locked" : ""}`}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {!isUnlocked ? (
                  <div className="lock">
                    <p>???</p>
                    <span>{item.unlockCond}</span>
                  </div>
                ) : (
                  <>
                    <div className="name">{item.name}</div>

                    {isNew && <div className="new">NEW</div>}

                    {hovered === item.id && (
                      <div className="preview">
                        ? preview anim
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 右タブ */}
      <div className="theme-area">
        <div
          className="theme-tab"
          onMouseEnter={() => setThemeOpen(true)}
          onMouseLeave={() => setThemeOpen(false)}
        >
          THEMES
        </div>

        <div className={`theme-panel ${themeOpen ? "open" : ""}`}>
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