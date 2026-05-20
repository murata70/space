import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Collection.css";

import Slide from "../../components/ui/Slide/Slide";
import AppFloatingWindow from "../../components/layout/AppFloatingWindow";

import { getOceanCollections } from "../../utils/collectionStorage_ocean";
import collectionMaster_ocean from "../../data/collectionMaster_ocean";

const COLLECTION_PASSTHROUGH = [
    ".app-floating-window",
    ".app-floating-shell",
    ".collection-wrap",
    ".collection-main",
    ".slide-wrapper--inline",
    ".slide-area",
    ".slide-tab",
    ".slide-panel",
];

const THEMES = [
    { id: "space", name: "宇宙" },
    { id: "ocean", name: "海", locked: false },
    { id: "forest", name: "未定", locked: true },
];

export default function CollectionOcean() {
    const navigate = useNavigate();

    const [owned, setOwned] = useState([]);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const data = getOceanCollections();
        const items = Array.isArray(data) ? data : data?.items || [];

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

        if (themeId === "space") {
            navigate("/collection");
        } else {
            navigate("/collection_ocean");
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
                        {collectionMaster_ocean.map((item) => {
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
                        onClick={() => navigate("/wallpaper_ocean")}
                    >
                        ← WALLPAPER
                    </button>
                </div>

                <div className="slide-wrapper--inline">
                    <Slide
                        title="THEMES"
                        items={THEMES}
                        expandOnHover
                        onSelect={handleThemeSelect}
                    />
                </div>
            </div>
        </AppFloatingWindow>
    );
}
