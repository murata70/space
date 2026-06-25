import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Collection.css";

import Slide from "../../components/ui/Slide/Slide";
import AppFloatingWindow from "../../components/layout/AppFloatingWindow";
import ThemeConfirmDialog from "../../components/ui/ThemeConfirmDialog/ThemeConfirmDialog";
import {
    useCollectionThemeSelect,
} from "../../hooks/useCollectionThemeSelect";
import {
    useOceanThemeAccessGuard,
    useOceanWallpaperDismissRoute,
} from "../../hooks/useOceanThemeAccess";

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
    ".theme-confirm-overlay",
    ".theme-confirm-dialog",
    ".theme-confirm-btn",
    ".theme-confirm-close",
];

export default function CollectionOcean() {
    const navigate = useNavigate();
    useOceanThemeAccessGuard();
    const dismissRoute = useOceanWallpaperDismissRoute();
    const { themes, pendingTheme, requestTheme, confirmTheme, cancelTheme, refreshThemeUnlockState } =
        useCollectionThemeSelect();

    const [owned, setOwned] = useState([]);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const data = getOceanCollections();
        const items = Array.isArray(data) ? data : data?.items || [];

        setOwned(items);
        setCompleted(items.length >= collectionMaster_ocean.length);
        refreshThemeUnlockState();
    }, [refreshThemeUnlockState]);

    const isOwned = (id) => owned.some((item) => item.id === id);

    return (
        <AppFloatingWindow
            passthroughSelectors={COLLECTION_PASSTHROUGH}
            onDismiss={() => navigate(dismissRoute)}
        >
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
