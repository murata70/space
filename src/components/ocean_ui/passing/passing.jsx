import { useEffect, useMemo } from "react";
import "./passing.css";

const publicUrl = process.env.PUBLIC_URL || "";

const passingImages = [
  `${publicUrl}/assets/ocean_image/passing/passing_car1.png`,
  `${publicUrl}/assets/ocean_image/passing/passing_car2.png`,
  `${publicUrl}/assets/ocean_image/passing/passing_car3.png`,
  `${publicUrl}/assets/ocean_image/passing/passing_car4.png`,
  `${publicUrl}/assets/ocean_image/passing/passing_car5.png`,
  `${publicUrl}/assets/ocean_image/passing/passing_car6.png`,
  `${publicUrl}/assets/ocean_image/passing/passing_car7.png`,
  `${publicUrl}/assets/ocean_image/passing/passing_car8.png`,
  `${publicUrl}/assets/ocean_image/passing/passing_car9.png`,
  `${publicUrl}/assets/ocean_image/passing/passing_car10.png`,
  `${publicUrl}/assets/ocean_image/passing/passing_car11.png`,
];

// 直近3回記録
const recentImages = [];

export default function PassingVehicle({
  lane = "middle",
  onComplete,
}) {
  /*
    直近3回を除外してランダム選択
  */
  const image = useMemo(() => {
    let candidates = passingImages.filter(
      (img) => !recentImages.includes(img)
    );

    // 全候補消失対策
    if (candidates.length === 0) {
      candidates = [...passingImages];
    }

    const selected =
      candidates[
        Math.floor(Math.random() * candidates.length)
      ];

    recentImages.push(selected);

    if (recentImages.length > 3) {
      recentImages.shift();
    }

    return selected;
  }, []);

  /*
    流れ終わったら削除
  */
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`passing-wrapper ${lane}`}>
      <img
        src={image}
        className="passing-car"
        alt="passing car"
      />
    </div>
  );
}