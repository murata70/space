import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Collection_ocean.css";

import Slide from "../../components/ui/Slide/Slide";

import { getOceanCollections } from "../../utils/collectionStorage_ocean";
import collectionMaster_ocean from "../../data/collectionMaster_ocean";

const THEMES = [
  { id: "space", name: "宇宙" },
  { id: "ocean", name: "海", locked: false },
  { id: "forest", name: "未定", locked: true },
];

export default function Collection_ocean() {
  const navigate = useNavigate();
  const [owned, setOwned] = useState([]);

  useEffect(() => {
    const data = getOceanCollections();
    setOwned(data);
  }, []);

  const isOwned = (id) => owned.some((item) => item.id === id);

  const handleThemeSelect = (themeId) => {
    const current = THEMES.find(t => t.id === themeId);
    const ok = window.confirm(`この壁紙（${current.name}）に設定しますか？`);

    if (ok) {
      if (themeId === "ocean") {
        navigate("/wallpaper_ocean");
      } else {
        navigate("/wallpaper");
      }
    }
  };

  return (
    <div
      className="collection-wrap ocean-theme"
      style={{
        fontFamily: `"Yu Gothic", "Hiragino Sans", "Meiryo", sans-serif`,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textRendering: "geometricPrecision",
      }}
    >
      <div className="collection-main">

        <h1 className="title">OCEAN COLLECTION</h1>

        <div className="grid ocean-like-grid">
          {collectionMaster_ocean.map((item) => {
            const unlocked = isOwned(item.id);

            return (
              <div
                key={item.id}
                className={`card ${unlocked ? "unlocked" : "locked"}`}
              >
                {unlocked ? (
                  <>
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="collection-image"
                      draggable="false"
                    />
                    <div className="collection-name">
                      {item.name}
                    </div>
                  </>
                ) : (
                  <div className="unknown">?</div>
                )}
              </div>
            );
          })}
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/wallpaper_ocean")}
        >
          ← WALLPAPER
        </button>

      </div>

      <Slide
        title="THEMES"
        items={THEMES}
        onSelect={handleThemeSelect}
      />
    </div>
  );
}