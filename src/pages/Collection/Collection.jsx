import "./Collection.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Slide from "../../components/ui/Slide/Slide";
import StarField from "../../components/ui/StarField/StarField";
import FlowingAssets from "../../components/ui/FlowingAssets/FlowingAssets";

import data from "../../data/collections/collections.json";

const THEMES = [
  { id: "space", name: "宇宙" },
  { id: "ocean", name: "海（coming soon）", locked: true },
  { id: "forest", name: "森（coming soon）", locked: true }
];

export default function Collection() {

  const navigate = useNavigate();

  const [hovered, setHovered] = useState(null);
  const [unlocked, setUnlocked] = useState({});

  const COLLECTIONS = data;

  const unlock = (id) => {
    setUnlocked(prev => ({
      ...prev,
      [id]: true
    }));
  };

  return (
    <div className="collection-wrap">

      {/* 背景流れ */}
      <FlowingAssets />

      <div className="collection-main">

        <StarField />

        <h1 className="title">COLLECTION</h1>

        <div className="grid">

          {COLLECTIONS.map(item => {

            const isOpen = unlocked[item.id];

            return (
              <div
                key={item.id}
                className="card"
                onClick={() => unlock(item.id)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
              >

                <div className="unknown">
                  {isOpen ? item.name : "???"}
                </div>

                {hovered === item.id && !isOpen && (
                  <div className="preview" />
                )}

              </div>
            );

          })}

        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/wallpaper")}
        >
          ← 壁紙に戻る
        </button>

      </div>

      <Slide title="THEMES" items={THEMES} />

    </div>
  );
}