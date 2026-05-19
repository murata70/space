import { useEffect } from "react";
import "./FlagBannerFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function FlagBannerFlow({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 15000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flag-banner-flow">
      <img
        src={`${publicUrl}/assets/ocean_image/collections/flag_banner.png`}
        alt="flag banner"
        className="flag-banner-image"
      />
    </div>
  );
}