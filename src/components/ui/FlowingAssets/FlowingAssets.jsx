import React, { useEffect, useState } from "react";
import collectionData from "../../../data/collection.json";
import "./FlowingAssets.css";

const FlowingAssets = () => {
    const [activeItems, setActiveItems] = useState([]);

    useEffect(() => {
        // 全アセット（惑星＋コンテンツ）を結合
        const allAssets = [...collectionData.planets, ...collectionData.contents];

        const spawnItem = () => {
            const randomAsset = allAssets[Math.floor(Math.random() * allAssets.length)];
            const newItem = {
                ...randomAsset,
                instanceId: Date.now(), // 一意のキー
                top: Math.random() * 80 + "%", // 出現する高さ（ランダム）
                duration: Math.random() * 10 + 15 + "s" // 流れる速度（ランダム）
            };

            setActiveItems((prev) => [...prev, newItem]);

            // 画面外に消えた頃（30秒後）に配列から削除
            setTimeout(() => {
                setActiveItems((prev) => prev.filter(i => i.instanceId !== newItem.instanceId));
            }, 30000);
        };

        const timer = setInterval(spawnItem, 5000); // 5秒ごとに出現
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flowing-container">
            {activeItems.map((item) => (
                <img
                    key={item.instanceId}
                    src={item.path}
                    className="flowing-item"
                    style={{ top: item.top, animationDuration: item.duration }}
                    alt={item.name}
                />
            ))}
        </div>
    );
};

export default FlowingAssets;