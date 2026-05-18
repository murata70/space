import { useEffect, useRef, useState } from "react";

import collectionMaster_ocean from "../../../data/collectionMaster_ocean";

import PassingVehicle from "../passing/PassingVehicle";

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

export default function OceanFlowController() {
  const [passingVehicles, setPassingVehicles] = useState([]);
  const [currentCollectionFlow, setCurrentCollectionFlow] = useState(null);

  const usedCollectionIndexRef = useRef(null);

  const vehicleIdRef = useRef(0);

  const lastSpawnTimeRef = useRef(0);

  const collectionRunningRef = useRef(false);

  /*
    一般車生成
  */
  useEffect(() => {
    const interval = setInterval(() => {
      spawnPassingVehicle();
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  /*
    コレクション生成
  */
  useEffect(() => {
    const interval = setInterval(() => {
      spawnCollectionFlow();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  /*
    一般車生成処理
  */
  const spawnPassingVehicle = () => {
    if (collectionRunningRef.current) return;

    // 最大2台
    if (passingVehicles.length >= 2) return;

    const now = Date.now();

    // 車間距離
    if (now - lastSpawnTimeRef.current < 4000) return;

    lastSpawnTimeRef.current = now;

    const randomIndex = Math.floor(
      Math.random() * passingImages.length
    );

    const image = passingImages[randomIndex];

    const id = vehicleIdRef.current++;

    const lane = Math.random() > 0.5 ? "upper" : "lower";

    const newVehicle = {
      id,
      image,
      lane,
    };

    setPassingVehicles((prev) => [...prev, newVehicle]);
  };

  /*
    一般車削除
  */
  const handleVehicleComplete = (id) => {
    setPassingVehicles((prev) =>
      prev.filter((vehicle) => vehicle.id !== id)
    );
  };

  /*
    コレクション生成
  */
  const spawnCollectionFlow = () => {
    if (collectionRunningRef.current) return;

    // 一般車がいる場合は待つ
    if (passingVehicles.length > 0) return;

    if (!collectionMaster_ocean.length) return;

    let nextIndex = Math.floor(
      Math.random() * collectionMaster_ocean.length
    );

    // 同じコレクション連続防止
    if (collectionMaster_ocean.length > 1) {
      while (nextIndex === usedCollectionIndexRef.current) {
        nextIndex = Math.floor(
          Math.random() * collectionMaster_ocean.length
        );
      }
    }

    usedCollectionIndexRef.current = nextIndex;

    const selected = collectionMaster_ocean[nextIndex];

    collectionRunningRef.current = true;

    setCurrentCollectionFlow(() => selected.component);
  };

  /*
    コレクション終了
  */
  const handleCollectionComplete = () => {
    collectionRunningRef.current = false;

    setCurrentCollectionFlow(null);
  };

  const CollectionFlowComponent = currentCollectionFlow;

  return (
    <>
      {/* 一般車 */}
      {passingVehicles.map((vehicle) => (
        <PassingVehicle
          key={vehicle.id}
          image={vehicle.image}
          lane={vehicle.lane}
          onComplete={() =>
            handleVehicleComplete(vehicle.id)
          }
        />
      ))}

      {/* コレクション */}
      {CollectionFlowComponent && (
        <CollectionFlowComponent
          onComplete={handleCollectionComplete}
        />
      )}
    </>
  );
}