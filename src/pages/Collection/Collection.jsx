import "./Collection.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Slide from "../../components/ui/Slide/Slide";
import StarField from "../../components/ui/StarField/StarField";

/**
 * 仮データ
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

  const navigate = useNavigate();

  return (
    <div className="collection-wrap">

      {/* メイン */}
      <div className="collection-main">

        {/* 星背景 */}
        <StarField />

        <h1 className="title">
          COLLECTION
        </h1>

        <div className="grid">

          {COLLECTIONS.map((item) => (

            <div
              key={item.id}
              className="card"
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >

              <div className="unknown">
                ???
              </div>

              {hovered === item.id && (
                <div className="preview" />
              )}

            </div>

          ))}

        </div>

        {/* 戻る */}
        <button
          className="back-btn"
          onClick={() => navigate("/wallpaper")}
        >
          ← 壁紙に戻る
        </button>

      </div>

      {/* スライド */}
      <Slide
        title="THEMES"
        items={THEMES}
      />

    </div>
  );
};

export default Collection;