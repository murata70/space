import React from "react";
import "./ocean_bg.css";

const OceanBg = () => {

    return (
        <div className="ocean-road-wrapper">

            {/* road1 */}
            <div className="road-layer road1">

                <div
                    className="road-track"
                    style={{
                        backgroundImage:
                            "url('/assets/ocean_image/background_ocean/background_road1.png')",
                    }}
                />

                <div
                    className="road-track"
                    style={{
                        backgroundImage:
                            "url('/assets/ocean_image/background_ocean/background_road1.png')",
                    }}
                />

            </div>

            {/* road2 */}
            <div className="road-layer road2">

                <div
                    className="road-track"
                    style={{
                        backgroundImage:
                            "url('/assets/ocean_image/background_ocean/background_road2.png')",
                    }}
                />

                <div
                    className="road-track"
                    style={{
                        backgroundImage:
                            "url('/assets/ocean_image/background_ocean/background_road2.png')",
                    }}
                />

            </div>

        </div>
    );
};

export default OceanBg;