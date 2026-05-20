import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Collection.css";

import Slide from "../../components/ui/Slide/Slide";
import AppFloatingWindow from "../../components/layout/AppFloatingWindow";

import { getCollections } from "../../utils/collectionStorage";
import collectionMaster from "../../data/collectionMaster";

const COLLECTION_PASSTHROUGH = [
    ".app-floating-window",
    ".app-floating-shell",
    ".collection-wrap",
    ".collection-main",
    ".slide-wrapper--dock",
];

const THEMES = [
    { id: "space", name: "宇宙" },
    { id: "ocean", name: "海", locked: false },
    { id: "forest", name: "未定", locked: true },
];

export default function Collection() {
    const navigate = useNavigate();

    const [owned, setOwned] = useState([]);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const saved = getCollections();
        const items = Array.isArray(saved) ? saved : saved?.items || [];

        setOwned(items);
        setCompleted(items.length >= collectionMaster.length);
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
        } else {
            navigate("/collection");
        }
    };

    return (
        <AppFloatingWindow passthroughSelectors={COLLECTION_PASSTHROUGH}>
            <div className="collection-wrap">
                <div className="collection-main">
                    <h1 className="title">COLLECTION</h1>

                    {completed && (
                        <div className="complete-badge">COMPLETE</div>
                    )}

                    <div className="grid">
                        {collectionMaster.map((item) => {
                            const unlocked = isOwned(item.id);

                            return (
                                <div
                                    key={item.id}
                                    className={`card ${unlocked ? "" : "locked"}`}
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
                        type="button"
                        className="back-btn"
                        onClick={() => navigate("/wallpaper")}
                    >
                        ← WALLPAPER
                    </button>
                </div>

                <div className="slide-wrapper--dock">
                    <Slide
                        title="THEMES"
                        items={THEMES}
                        onSelect={handleThemeSelect}
                    />
                </div>
            </div>
        </AppFloatingWindow>
    );
}
