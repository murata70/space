import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Collection.css";

import StarField from "../../components/ui/StarField/StarField";
import Slide from "../../components/ui/Slide/Slide";

import { getCollections } from "../../utils/collectionStorage";
import collectionMaster from "../../data/collectionMaster";

const THEMES = [
    { id: "space", name: "宇宙" },
    { id: "ocean", name: "海", locked: false },
    { id: "forest", name: "未定", locked: true },
];

export default function Collection() {
    const navigate = useNavigate();
    const [owned, setOwned] = useState([]);

    useEffect(() => {
        const saved = getCollections();
        setOwned(saved);
    }, []);

    // テーマが選択されたときの処理
    const handleThemeSelect = (themeId) => {
        // 確認ポップアップを表示
        const currentTheme = THEMES.find(t => t.id === themeId);
        const confirmChange = window.confirm(`この壁紙（${currentTheme.name}）に設定しますか？`);

        if (confirmChange) {
            // Wallpaper画面へ選択したテーマIDを状態として持って遷移
            navigate("/wallpaper", { state: { themeId } });
        }
    };

    return (
        <div className="collection-wrap">
            <div className="collection-main">
                <StarField />

                <h1 className="title">COLLECTION</h1>

                <div className="grid">
                    {collectionMaster.map((item) => {
                        const unlocked = owned.some(
                            (o) => o.id === item.id
                        );

                        return (
                            <div
                                key={item.id}
                                className={`card ${unlocked ? "unlocked" : "locked"
                                    }`}
                            >
                                {unlocked ? (
                                    <>
                                        <img
                                            src={item.images?.[0]}
                                            alt={item.name}
                                            className="collection-image"
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
                    onClick={() => navigate("/wallpaper")}
                >
                    ← WALLPAPER
                </button>
            </div>

            <Slide title="THEMES" items={THEMES} onSelect={handleThemeSelect} />
        </div>
    );
}