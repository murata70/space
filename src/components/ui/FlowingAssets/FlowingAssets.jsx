import { useEffect, useRef, useState } from "react";
import "./FlowingAssets.css";

import { saveCollection } from "../../../utils/collectionStorage";
import { COLLECTION_MASTER } from "../../../data/collectionMaster";

// JSON
import collections from "../../../data/collections/collections.json";
import events from "../../../data/collections/events.json";
import cats from "../../../data/collections/cats.json";
import zodiac from "../../../data/collections/zodiac.json";

const FLOW_TIME = 25;
const WAIT_TIME = 3000;

export default function FlowingAssets() {

  const [item, setItem] = useState(null);

  const historyRef = useRef([]);

  // =========================
  // 図鑑IDへ変換
  // =========================
  const normalize = (path) => {

    if (!path) return null;

    const file = path.split("/").pop().toLowerCase();

    let targetFile = file;

    // =========================
    // 流星群だけ特殊変換
    // =========================
    if (file === "ryuseigun.png") {
      targetFile = "meteor_shower.png";
    }

    const hit = COLLECTION_MASTER.find((c) =>
      targetFile === c.image.toLowerCase()
    );

    if (!hit) {
      console.log("❌ 未一致:", targetFile);
      return null;
    }

    return {
      id: hit.id,
      name: hit.name,
      path: `/assets/image/collections/${hit.image}`,
    };
  };

  useEffect(() => {

    let timer;

    // =========================
    // 全データ統合
    // =========================
    const pools = [

      ...(collections.contents || []),

      ...(events.events || []),

      ...(cats.cats || []),

      ...(zodiac.zodiac || [])

    ].map((item) => {

      return {
        ...item,
        path: item.path || item.image_path,
      };

    });

    // =========================
    // 出現
    // =========================
    const spawn = () => {

      // 重複防止
      const available = pools.filter(
        (i) => !historyRef.current.includes(i.path)
      );

      const target =
        available.length > 0
          ? available
          : pools;

      const random =
        target[Math.floor(Math.random() * target.length)];

      // 履歴更新
      historyRef.current = [
        ...historyRef.current,
        random.path
      ].slice(-5);

      // =========================
      // 表示
      // =========================
      setItem({
        id: Date.now(),
        path: random.path,
        size: Math.random() * 120 + 120,
        top: Math.random() * 80 - 10,
        speed: 25,
      });

      // =========================
      // 保存
      // =========================
      const normalized = normalize(random.path);

      if (normalized) {
        saveCollection(normalized);
      }

      timer = setTimeout(() => {
        spawn();
      }, WAIT_TIME + FLOW_TIME * 1000);

    };

    spawn();

    return () => clearTimeout(timer);

  }, []);

  if (!item) return null;

  return (
    <div className="flowing-layer">

      <img
        key={item.id}
        src={item.path}
        alt="asset"
        className="flowing-object"
        style={{
          top: `${item.top}%`,
          width: `${item.size}px`,
          left: "100vw",
          animationDuration: `${item.speed}s`,
        }}
      />

    </div>
  );
}