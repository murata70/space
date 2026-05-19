import { useEffect, useRef, useState } from "react";

import collectionMaster_ocean from "../../../data/collectionMaster_ocean";

import PassingVehicle from "../passing/PassingVehicle";
import "./OceanFlowController.css";

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
    ???????
  */
  useEffect(() => {
    const interval = setInterval(() => {
      spawnPassingVehicle();
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  /*
    ?R???N?V????????
  */
  useEffect(() => {
    const interval = setInterval(() => {
      spawnCollectionFlow();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  /*
    ???????????
  */
  const spawnPassingVehicle = () => {
    if (collectionRunningRef.current) return;

    // ???2??
    if (passingVehicles.length >= 2) return;

    const now = Date.now();

    // ??????
    if (now - lastSpawnTimeRef.current < 4000) return;

    lastSpawnTimeRef.current = now;

    const randomIndex = Math.floor(
      Math.random() * passingImages.length
    );

    const image = passingImages[randomIndex];

    const id = vehicleIdRef.current++;

    const newVehicle = {
      id,
      image,
    };

    setPassingVehicles((prev) => [...prev, newVehicle]);
  };

  /*
    ?????
  */
  const handleVehicleComplete = (id) => {
    setPassingVehicles((prev) =>
      prev.filter((vehicle) => vehicle.id !== id)
    );
  };

  /*
    ?R???N?V????????
  */
  const spawnCollectionFlow = () => {
    if (collectionRunningRef.current) return;

    // ??????????????
    if (passingVehicles.length > 0) return;

    if (!collectionMaster_ocean.length) return;

    let nextIndex = Math.floor(
      Math.random() * collectionMaster_ocean.length
    );

    // ?????R???N?V?????A???h?~
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
    ?R???N?V?????I??
  */
  const handleCollectionComplete = () => {
    collectionRunningRef.current = false;

    setCurrentCollectionFlow(null);
  };

  const CollectionFlowComponent = currentCollectionFlow;

  return (
    <div className="ocean-flow-layer">
      {passingVehicles.map((vehicle) => (
        <PassingVehicle
          key={vehicle.id}
          image={vehicle.image}
          onComplete={() => handleVehicleComplete(vehicle.id)}
        />
      ))}

      {CollectionFlowComponent && (
        <CollectionFlowComponent onComplete={handleCollectionComplete} />
      )}
    </div>
  );
}