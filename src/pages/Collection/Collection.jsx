import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Collection.css";

import StarField from "../../components/ui/StarField/StarField";
import Slide from "../../components/ui/Slide/Slide";

import { getCollections } from "../../utils/collectionStorage";

import { COLLECTION_MASTER } from "../../data/collectionMaster";

const THEMES = [
  { id: "space", name: "宇宙" },
  { id: "ocean", name: "海", locked: true },
  { id: "forest", name: "森", locked: true },
];

export default function Collection() {

  const navigate = useNavigate();

  const [owned, setOwned] = useState([]);

  useEffect(() => {

    const saved = getCollections();

    setOwned(saved);

  }, []);

  return (
    <div className="collection-wrap">

      <div className="collection-main">

        <StarField />

        <h1 className="title">
          COLLECTION
        </h1>

        {/* =========================
            グリッド
        ========================= */}
        <div className="grid">

          {COLLECTION_MASTER.map((item) => {

            const unlocked =
              owned.find((o) => o.id === item.id);

            return (

              <div
                key={item.id}
                className={`card ${
                  unlocked ? "unlocked" : "locked"
                }`}
              >

                {unlocked ? (
                  <>

                    <img
                      src={`/assets/image/collections/${item.image}`}
                      alt={item.name}
                      className="collection-image"
                    />

                    <div className="collection-name">
                      {item.name}
                    </div>

                  </>
                ) : (

                  <div className="unknown">
                    ?
                  </div>

                )}

              </div>

            );
          })}

        </div>

        {/* =========================
            戻るボタン
        ========================= */}
        <button
          className="back-btn"
          onClick={() => navigate("/wallpaper")}
        >
          ← WALLPAPER
        </button>

      </div>

      <Slide
        title="THEMES"
        items={THEMES}
      />

    </div>
  );
}