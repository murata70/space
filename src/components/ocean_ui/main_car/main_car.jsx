import { useEffect, useState } from "react";
import "./main_car.css";

const publicUrl = process.env.PUBLIC_URL || "";

const carFrames = [
    `${publicUrl}/assets/ocean_image/main_car/main_car1.png`,
    `${publicUrl}/assets/ocean_image/main_car/main_car2.png`,
];

export default function MainCar() {

    const [frame, setFrame] = useState(0);

    useEffect(() => {

        const interval = setInterval(() => {
            setFrame((prev) => (prev + 1) % 2);
        }, 100);

        return () => clearInterval(interval);

    }, []);

    return (
        <div className="main-car-position">
            <div className="main-car-wrapper">

                <img
                    src={carFrames[frame]}
                    alt="main car"
                    className="main-car-image"
                    draggable="false"
                />

            </div>
        </div>
    );
}