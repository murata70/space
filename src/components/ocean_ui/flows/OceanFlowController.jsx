import { useEffect, useState, useRef } from "react";
import collectionMaster_ocean from "../../../data/collectionMaster_ocean";
import { saveOceanCollection } from "../../../utils/collectionStorage_ocean";

const publicUrl = process.env.PUBLIC_URL || "";

export default function OceanFlowController() {
  const [passingVehicles, setPassingVehicles] = useState([]);
  const [currentCollectionFlow, setCurrentCollectionFlow] = useState(null);

  const usedCollectionIndexRef = useRef(null);
  const sequentialCollectionIndexRef = useRef(0);
  const vehicleIdRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);
  const collectionRunningRef = useRef(false);
  const currentItemRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      spawnPassingVehicle();
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      spawnCollectionFlow();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const spawnPassingVehicle = () => {
    if (collectionRunningRef.current) return;
    if (passingVehicles.length >= 2) return;

    const now = Date.now();
    if (now - lastSpawnTimeRef.current < 4000) return;

    lastSpawnTimeRef.current = now;

    const randomIndex = Math.floor(
      Math.random() * 10
    );

    const id = vehicleIdRef.current++;

    setPassingVehicles((prev) => [
      ...prev,
      { id, image: `${publicUrl}/assets/ocean_image/passing/passing_car${randomIndex + 1}.png` }
    ]);
  };

  const handleVehicleComplete = (id) => {
    setPassingVehicles((prev) =>
      prev.filter((v) => v.id !== id)
    );
  };

  const spawnCollectionFlow = () => {
    if (collectionRunningRef.current) return;
    if (passingVehicles.length > 0) return;
    if (!collectionMaster_ocean?.length) return;

    let nextIndex;

    nextIndex =
      sequentialCollectionIndexRef.current %
      collectionMaster_ocean.length;

    sequentialCollectionIndexRef.current += 1;

    const selected = collectionMaster_ocean[nextIndex];

    if (!selected) return;

    collectionRunningRef.current = true;
    currentItemRef.current = selected;

    setCurrentCollectionFlow(() => selected.component);
  };

  const handleCollectionComplete = () => {
    collectionRunningRef.current = false;

    const item = currentItemRef.current;

    if (item) {
      saveOceanCollection({
        id: item.id,
        name: item.name,
        images: item.images,
      });
    }

    setCurrentCollectionFlow(null);
  };

  const CollectionFlowComponent = currentCollectionFlow;

  return (
    <div
      className="ocean-flow-layer"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 3,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {passingVehicles.map((v) => (
        <div key={v.id}>
          {/* ここはあなたの PassingVehicle に置き換え */}
        </div>
      ))}

      {CollectionFlowComponent && (
        <CollectionFlowComponent onComplete={handleCollectionComplete} />
      )}
    </div>
  );
}