import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import collectionMaster_ocean from "../../../data/collectionMaster_ocean";
import { saveOceanCollection } from "../../../utils/collectionStorage_ocean";
import { pickRandomCollectionItem } from "../../../utils/collectionSpawnSchedule";
import { useCollectionSpawnSchedule } from "../../../hooks/useCollectionSpawnSchedule";
import PassingVehicle from "../passing/PassingVehicle";
import { PASSING_CAR_PROFILES } from "../passing/passingCarProfiles";
import { rollPassingRoadSyncDelayMs } from "../passing/passingRoadSync";
import { getPassingSpawnDelayMs } from "../passing/passingSpawnSchedule";

const publicUrl = process.env.PUBLIC_URL || "";
const PASSING_VEHICLE_COUNT = 13;

function pickRandomPassingVehicle() {
  const index = Math.floor(Math.random() * PASSING_VEHICLE_COUNT) + 1;
  const profile = PASSING_CAR_PROFILES[index] ?? {
    size: "default",
    position: null,
  };

  return {
    image: `${publicUrl}/assets/ocean_image/passing/passing_car${index}.png`,
    size: profile.size,
    position: profile.position,
    roadSyncDelayMs: rollPassingRoadSyncDelayMs(),
  };
}

export default function OceanFlowController({ passingMount = null }) {
  const [passingVehicles, setPassingVehicles] = useState([]);
  const [currentCollectionFlow, setCurrentCollectionFlow] = useState(null);

  const vehicleIdRef = useRef(0);
  const collectionRunningRef = useRef(false);
  const currentItemRef = useRef(null);
  const passingVehiclesRef = useRef([]);

  useEffect(() => {
    passingVehiclesRef.current = passingVehicles;
  }, [passingVehicles]);

  const spawnPassingVehicle = useCallback(() => {
    if (collectionRunningRef.current) return;

    const id = vehicleIdRef.current++;

    setPassingVehicles((prev) => {
      const vehicle = pickRandomPassingVehicle();
      const next = [...prev, { id, ...vehicle }];
      passingVehiclesRef.current = next;
      return next;
    });
  }, []);

  const spawnPassingVehicleRef = useRef(spawnPassingVehicle);
  spawnPassingVehicleRef.current = spawnPassingVehicle;

  useEffect(() => {
    let cancelled = false;
    let timerId = null;

    const scheduleNext = () => {
      timerId = setTimeout(() => {
        if (cancelled) return;
        spawnPassingVehicleRef.current();
        scheduleNext();
      }, getPassingSpawnDelayMs());
    };

    scheduleNext();

    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, []);

  const attemptCollectionSpawn = useCallback(() => {
    if (collectionRunningRef.current) return false;
    if (passingVehiclesRef.current.length > 0) return false;
    if (!collectionMaster_ocean?.length) return false;

    const selected = pickRandomCollectionItem(collectionMaster_ocean);
    if (!selected) return false;

    collectionRunningRef.current = true;
    currentItemRef.current = selected;
    setCurrentCollectionFlow(() => selected.component);
    return true;
  }, []);

  const { retryPendingSpawn } = useCollectionSpawnSchedule(attemptCollectionSpawn);

  const handleVehicleComplete = (id) => {
    setPassingVehicles((prev) => {
      const next = prev.filter((v) => v.id !== id);
      passingVehiclesRef.current = next;
      return next;
    });
    retryPendingSpawn();
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

    currentItemRef.current = null;
    setCurrentCollectionFlow(null);
    retryPendingSpawn();
  };

  const CollectionFlowComponent = currentCollectionFlow;

  const passingLayer =
    passingMount &&
    createPortal(
      <>
        {passingVehicles.map((v) => (
          <PassingVehicle
            key={v.id}
            image={v.image}
            size={v.size}
            position={v.position}
            roadSyncDelayMs={v.roadSyncDelayMs}
            onComplete={() => handleVehicleComplete(v.id)}
          />
        ))}
      </>,
      passingMount
    );

  return (
    <>
      {passingLayer}
      <div className="ocean-flow-layer">
        {CollectionFlowComponent && (
          <CollectionFlowComponent onComplete={handleCollectionComplete} />
        )}
      </div>
    </>
  );
}
