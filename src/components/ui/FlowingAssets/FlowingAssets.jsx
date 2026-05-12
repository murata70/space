import { useEffect, useState, useRef } from "react";
import data from "../../../data/collections/collections.json";
import "./FlowingAssets.css";

export default function FlowingAssets() {

  const [items, setItems] = useState([]);
  const historyRef = useRef([]);

  useEffect(() => {

    const spawn = () => {

      // ランダム選択
      const pool = data;

      const target =
        pool[Math.floor(Math.random() * pool.length)];

      // constellationは画像ランダム
      let image;

      if (target.type === "random") {
        image =
          target.images[
            Math.floor(Math.random() * target.images.length)
          ];
      }

      // cycle系は初期画像
      else if (target.type === "cycle") {
        image = target.images[0];
      }

      else {
        image = target.images[0];
      }

      const newItem = {
        id: Date.now(),
        metaId: target.id,
        name: target.name,
        speed: target.speed,
        type: target.type,
        images: target.images,
        imageIndex: 0,
        image
      };

      setItems(prev => [...prev, newItem]);

      // 履歴保存（図鑑用）
      if (!historyRef.current.includes(target.id)) {
        historyRef.current.push(target.id);
      }
    };

    const interval = setInterval(spawn, 3000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="flow-layer">

      {items.map(item => (

        <img
          key={item.id}
          src={item.image}
          className="flow-item"
          style={{
            animationDuration: `${item.speed * 10}s`
          }}
        />

      ))}

    </div>
  );
}