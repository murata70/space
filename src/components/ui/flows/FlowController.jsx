import { useEffect, useState, useRef } from "react";
import collectionMaster from "../../../data/collectionMaster";

export default function FlowController() {
  const [currentFlow, setCurrentFlow] = useState(null);
  const usedIndexRef = useRef(null);

  useEffect(() => {
    spawnNext();
  }, []);

  const spawnNext = () => {
    if (!collectionMaster.length) return;

    let nextIndex = Math.floor(Math.random() * collectionMaster.length);

    // ˜A‘±“¯‚¶–h~
    if (collectionMaster.length > 1) {
      while (nextIndex === usedIndexRef.current) {
        nextIndex = Math.floor(Math.random() * collectionMaster.length);
      }
    }

    usedIndexRef.current = nextIndex;

    const selected = collectionMaster[nextIndex];

    setCurrentFlow(() => selected.component);
  };

  const handleComplete = () => {
    setCurrentFlow(null);

    setTimeout(() => {
      spawnNext();
    }, 1500); // ­‚µŠÔ‚ğ‹ó‚¯‚é
  };

  if (!currentFlow) return null;

  const FlowComponent = currentFlow;

  return <FlowComponent onComplete={handleComplete} />;
}