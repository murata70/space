import { useEffect, useState } from "react";
import { getOceanCollections } from "../../utils/collectionStorage_ocean";
import collectionMaster_ocean from "../../data/collectionMaster_ocean";

import "./Collection_ocean.css";

export default function Collection_ocean() {
  const [owned, setOwned] = useState([]);

  useEffect(() => {
    const data = getOceanCollections();
    setOwned(data);
  }, []);

  const isOwned = (id) => {
    return owned.some((item) => item.id === id);
  };

  return (
    <div className="ocean-collection-wrapper">
      <div className="ocean-title"> Ocean Collection</div>

      <div className="ocean-grid">
        {collectionMaster_ocean.map((item) => (
          <div
            key={item.id}
            className={`ocean-card ${isOwned(item.id) ? "owned" : "locked"}`}
          >
            <div className="ocean-image">
              <img src={item.images[0]} alt={item.name} />
            </div>

            <div className="ocean-name">{item.name}</div>

            {!isOwned(item.id) && (
              <div className="ocean-lock"> Locked</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}