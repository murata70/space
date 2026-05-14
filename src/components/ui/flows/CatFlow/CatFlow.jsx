import { useEffect, useState } from "react";
import "./CatFlow.css";

const frames = [
  "/assets/image/collections/twinkling_cat1.png",
  "/assets/image/collections/twinkling_cat2.png",
  "/assets/image/collections/twinkling_cat3.png",
];

export default function CatFlow({ onComplete }) {

  const [frame, setFrame] = useState(0);

  useEffect(() => {

    const frameLoop = setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length);
    }, 200);

    const finishTimer = setTimeout(() => {
      onComplete?.();
    }, 6000);

    return () => {
      clearInterval(frameLoop);
      clearTimeout(finishTimer);
    };

  }, [onComplete]);

  return (
    <div className="cat-flow">
      <img
        src={frames[frame]}
        alt="cat"
        className="cat-image"
      />
    </div>
  );
}