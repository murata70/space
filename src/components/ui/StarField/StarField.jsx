import React, { useEffect, useState } from "react";
import "./StarField.css";

const STAR_COUNT = 80;

const STAR_COLORS = [
    "#ffffff",
    "#9fd3ff",
    "#ffd6a5",
];

const createStar = () => {

    const size = Math.random() * 2.5 + 1;

    const speed = 0.02 + size * 0.035;

    return {
        id: Math.random(),

        x: window.innerWidth + Math.random() * 300,

        y: Math.random() * window.innerHeight,

        speed,

        color:
            STAR_COLORS[
            Math.floor(Math.random() * STAR_COLORS.length)
            ],

        size,

        blink:
            Math.random() * 3 + 2,

        opacity:
            Math.random() * 0.6 + 0.2,
    };
};

const StarField = () => {

    const [stars, setStars] = useState([]);

    /**
     * ��������
     */
    useEffect(() => {

        const initialStars = Array.from(
            { length: STAR_COUNT },
            () => ({
                ...createStar(),
                x: Math.random() * window.innerWidth,
            })
        );

        setStars(initialStars);

    }, []);

    /**
     * �ړ�
     */
    useEffect(() => {

        const interval = setInterval(() => {

            setStars((prev) =>
                prev.map((star) => ({
                    ...star,
                    x: star.x - star.speed,
                }))
            );

        }, 16);

        return () => clearInterval(interval);

    }, []);

    /**
     * �Đ���
     */
    useEffect(() => {

        const interval = setInterval(() => {

            setStars((prev) =>
                prev.map((star) => {

                    if (star.x < -20) {
                        return createStar();
                    }

                    return star;
                })
            );

        }, 300);

        return () => clearInterval(interval);

    }, []);

    return (
        <div className="stars">

            {stars.map((star) => (

                <div
                    key={star.id}
                    className="star"
                    style={{
                        left: `${star.x}px`,
                        top: `${star.y}px`,

                        width: `${star.size}px`,
                        height: `${star.size}px`,

                        background: star.color,

                        opacity: star.opacity,

                        animationDuration: `${star.blink}s`,

                        boxShadow:
                            `0 0 ${star.size * 4}px ${star.color}`,
                    }}
                />

            ))}

        </div>
    );
};

export default StarField;