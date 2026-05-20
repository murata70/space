import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Collection_ocean.css";
import "../../components/ui/Slide/Slide_ocean.css";

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
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const data = getOceanCollections();
    const items = Array.isArray(data) ? data : data.items || [];

    setOwned(items);
    setCompleted(items.length >= collectionMaster_ocean.length);
  }, []);

  const isOwned = (id) => owned.some((item) => item.id === id);

  const handleThemeSelect = (themeId) => {
    const current = THEMES.find((t) => t.id === themeId);

    const ok = window.confirm(
      `この壁紙（${current.name}）に設定しますか？`
    );

    if (!ok) return;

    if (themeId === "ocean") {
      navigate("/collection_ocean");
    } else if (themeId === "space") {
      navigate("/collection");
    } else {
      navigate("/wallpaper_ocean");
    }
  };

  return (
    <div className="collection-wrap">

      <div className="collection-main">

        <h1 className="title">COLLECTION</h1>

        {completed && (
          <div className="complete-badge">COMPLETE</div>
        )}

        <div className="grid">
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

      <div className="slide-wrapper slide-wrapper--dock">
        <Slide
          title="THEMES"
          items={THEMES}
          onSelect={handleThemeSelect}
        />
      </div>

    </div>
  );
}