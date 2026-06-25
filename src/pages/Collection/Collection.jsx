import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Collection.css";

import Slide from "../../components/ui/Slide/Slide";
import AppFloatingWindow from "../../components/layout/AppFloatingWindow";
import ThemeConfirmDialog from "../../components/ui/ThemeConfirmDialog/ThemeConfirmDialog";
import {
    useCollectionThemeSelect,
} from "../../hooks/useCollectionThemeSelect";

import { getCollections } from "../../utils/collectionStorage";
import { hasObservedZodiacSigns } from "../../utils/zodiacObservationStorage";
import collectionMaster from "../../data/collectionMaster";
import ZodiacCollectionImage from "../../components/ui/ZodiacCollectionImage/ZodiacCollectionImage";

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
    const { themes, pendingTheme, requestTheme, confirmTheme, cancelTheme, refreshThemeUnlockState } =
        useCollectionThemeSelect();

    const [owned, setOwned] = useState([]);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const saved = getCollections();
        const items = Array.isArray(saved) ? saved : saved?.items || [];

        setOwned(items);
        setCompleted(items.length >= collectionMaster.length);
        refreshThemeUnlockState();
    }, [refreshThemeUnlockState]);

    const isOwned = (id) => owned.some((item) => item.id === id);

    const isCardUnlocked = (item) => {
        if (item.id !== "zodiac") return isOwned(item.id);
        return isOwned(item.id) && hasObservedZodiacSigns();
    };

    return (
        <AppFloatingWindow
            passthroughSelectors={COLLECTION_PASSTHROUGH}
            onDismiss={() => navigate("/wallpaper")}
        >
            <div className="collection-wrap">
                <div className="collection-main">
                    <h1 className="title">COLLECTION</h1>

                    {completed && (
                        <div className="complete-badge">COMPLETE</div>
                    )}

                    <div className="grid">
                        {collectionMaster.map((item) => {
                            const unlocked = isCardUnlocked(item);

                            return (
                                <div
                                    key={item.id}
                                    className={`card ${unlocked ? "" : "locked"}`}
                                >
                                    {unlocked ? (
                                        <>
                                            {item.id === "zodiac" ? (
                                                <ZodiacCollectionImage alt={item.name} />
                                            ) : (
                                                <img
                                                    src={item.images?.[0]}
                                                    alt={item.name}
                                                    className="collection-image"
                                                    draggable="false"
                                                />
                                            )}
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
                </div>

                <div className="slide-wrapper--inline">
                    <Slide
                        title="THEMES"
                        items={themes}
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
