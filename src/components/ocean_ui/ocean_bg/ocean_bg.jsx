import React from "react";
import MainCar from "../main_car/main_car";
import "./ocean_bg.css";

const publicUrl = process.env.PUBLIC_URL || "";

const road1Url = `${publicUrl}/assets/ocean_image/background_ocean/background_road1.png`;
const road2Url = `${publicUrl}/assets/ocean_image/background_ocean/background_road2.png`;

const OceanBg = ({ showMainCar = false, passingMountRef = null }) => {
    return (
        <>
            <div className="ocean-road-layer ocean-road1">
                <div className="road-layer road1">
                    <div
                        className="road-track"
                        style={{
                            backgroundImage: `url('${road1Url}')`,
                        }}
                    />
                    <div
                        className="road-track"
                        style={{
                            backgroundImage: `url('${road1Url}')`,
                        }}
                    />
                </div>
            </div>

            {showMainCar ? (
                <div className="ocean-main-car-layer">
                    <MainCar />
                </div>
            ) : null}

            <div className="ocean-passing-layer" ref={passingMountRef} />

            <div className="ocean-road-layer ocean-road2">
                <div className="road-layer road2">
                    <div
                        className="road-track"
                        style={{
                            backgroundImage: `url('${road2Url}')`,
                        }}
                    />
                    <div
                        className="road-track"
                        style={{
                            backgroundImage: `url('${road2Url}')`,
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default OceanBg;
