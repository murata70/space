import { useCallback, useRef, useState } from "react";
import collectionMaster from "../../../data/collectionMaster";
import { saveCollection } from "../../../utils/collectionStorage";
import { pickRandomCollectionItem } from "../../../utils/collectionSpawnSchedule";
import { useCollectionSpawnSchedule } from "../../../hooks/useCollectionSpawnSchedule";

export default function FlowController({ theme = "space" }) {
  const [currentFlow, setCurrentFlow] = useState(null);

  const currentItemRef = useRef(null);
  const isRunningRef = useRef(false);

  const attemptSpawn = useCallback(() => {
    if (isRunningRef.current) return false;
    if (!collectionMaster.length) return false;

    const selected = pickRandomCollectionItem(collectionMaster);
    if (!selected) return false;

    isRunningRef.current = true;
    currentItemRef.current = selected;
    setCurrentFlow(() => selected.component);
    return true;
  }, []);

  const { retryPendingSpawn } = useCollectionSpawnSchedule(attemptSpawn);

  const handleComplete = () => {
    const item = currentItemRef.current;

    if (item) {
      saveCollection(
        {
          id: item.id,
          name: item.name,
          images: item.images,
        },
        theme
      );
    }

    isRunningRef.current = false;
    currentItemRef.current = null;
    setCurrentFlow(null);
    retryPendingSpawn();
  };

  if (!currentFlow) return null;

  const FlowComponent = currentFlow;

  return <FlowComponent onComplete={handleComplete} />;
}
