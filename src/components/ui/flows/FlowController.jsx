import { useEffect, useState, useRef } from "react";
import collectionMaster from "../../../data/collectionMaster";
import { saveCollection } from "../../../utils/collectionStorage";

export default function FlowController({ theme = "space" }) {
  const [currentFlow, setCurrentFlow] = useState(null);

  const usedIndexRef = useRef(null);
  const currentItemRef = useRef(null);

  useEffect(() => {
    spawnNext();
  }, []);

  const spawnNext = () => {
    if (!collectionMaster.length) return;

    let nextIndex = Math.floor(
      Math.random() * collectionMaster.length
    );

    // ˜A‘±“¯‚¶–hŽ~
    if (collectionMaster.length > 1) {
      while (nextIndex === usedIndexRef.current) {
        nextIndex = Math.floor(
          Math.random() * collectionMaster.length
        );
      }
    }

    usedIndexRef.current = nextIndex;

    const selected = collectionMaster[nextIndex];

    currentItemRef.current = selected;

    setCurrentFlow(() => selected.component);
  };

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

    setCurrentFlow(null);

    setTimeout(() => {
      spawnNext();
    }, 1500);
  };

  if (!currentFlow) return null;

  const FlowComponent = currentFlow;

  return <FlowComponent onComplete={handleComplete} />;
}