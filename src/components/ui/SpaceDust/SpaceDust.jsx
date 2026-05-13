import React from "react";
import "./SpaceDust.css";

const particles = Array.from({ length: 40 });

const SpaceDust = () => {

    return (
        <div className="space-dust">

            {particles.map((_, i) => (

                <div
                    key={i}
                    className="dust-particle"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 10}s`,
                        animationDuration: `${40 + Math.random() * 60}s`,
                    }}
                />

            ))}

        </div>
    );
};

export default SpaceDust;