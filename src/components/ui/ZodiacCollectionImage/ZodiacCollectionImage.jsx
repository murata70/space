import { useEffect, useMemo, useState } from "react";
import { getObservedZodiacImageUrls } from "../../../utils/zodiacObservationStorage";
import "./ZodiacCollectionImage.css";

const INTERVAL_MS = 2500;

export default function ZodiacCollectionImage({ alt = "星座" }) {
    const images = useMemo(() => getObservedZodiacImageUrls(), []);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return undefined;

        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, INTERVAL_MS);

        return () => clearInterval(timer);
    }, [images.length]);

    if (!images.length) return null;

    return (
        <div className="zodiac-collection-image" aria-hidden={images.length > 1}>
            {images.map((src, imageIndex) => (
                <img
                    key={src}
                    src={src}
                    alt={alt}
                    className={`collection-image zodiac-collection-image__frame${
                        imageIndex === index ? " is-active" : ""
                    }`}
                    draggable="false"
                />
            ))}
        </div>
    );
}
