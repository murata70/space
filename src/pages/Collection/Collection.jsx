import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Collection.css";

import Slide from "../../components/ui/Slide/Slide";
import AppFloatingWindow from "../../components/layout/AppFloatingWindow";
import ThemeConfirmDialog from "../../components/ui/ThemeConfirmDialog/ThemeConfirmDialog";
import {
    useCollectionThemeSelect,
    COLLECTION_THEMES,
} from "../../hooks/useCollectionThemeSelect";

import { getCollections } from "../../utils/collectionStorage";
import collectionMaster from "../../data/collectionMaster";

const COLLECTION_PASSTHROUGH = [
    ".app-floating-window",
    ".app-floating-shell",
    ".collection-wrap",
    ".collection-main",
    ".slide-wrapper--inline",
    ".slide-area",
    ".slide-tab",
    ".slide-panel",
    ".theme-confirm-overlay",
    ".theme-confirm-dialog",
    ".theme-confirm-btn",
    ".theme-confirm-close",
];

export default function Collection() {
    const navigate = useNavigate();
    const { pendingTheme, requestTheme, confirmTheme, cancelTheme } =
        useCollectionThemeSelect();

    const [owned, setOwned] = useState([]);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const saved = getCollections();
        const items = Array.isArray(saved) ? saved : saved?.items || [];

        setOwned(items);
        setCompleted(items.length >= collectionMaster.length);
    }, []);

    const isOwned = (id) => owned.some((item) => item.id === id);

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

                <div className="slide-wrapper--inline">
                    <Slide
                        title="THEMES"
                        items={COLLECTION_THEMES}
                        expandOnHover
                        onSelect={requestTheme}
                    />
                </div>
            </div>

            <ThemeConfirmDialog
                open={Boolean(pendingTheme)}
                themeName={pendingTheme?.name ?? ""}
                onConfirm={confirmTheme}
                onCancel={cancelTheme}
            />
        </AppFloatingWindow>
    );
}
