import React, { useEffect, useState } from "react";
import "./Clock.css";

const Clock = () => {

    const [time, setTime] = useState("");

    useEffect(() => {

        const updateClock = () => {

            const settings =
                JSON.parse(localStorage.getItem("user_settings")) || {};

            const {
                sec = true,
                is24h = true,
                tz = "Asia/Osaka"
            } = settings;

            const now = new Date();

            const options = {
                hour: "2-digit",
                minute: "2-digit",
                hour12: !is24h,
                timeZone: tz
            };

            // sec ON の時だけ秒表示
            if (sec) {
                options.second = "2-digit";
            }

            const formattedTime =
                now.toLocaleTimeString("ja-JP", options);

            setTime(formattedTime);
        };

        updateClock();

        const interval = setInterval(updateClock, 1000);

        return () => clearInterval(interval);

    }, []);

    return (
        <div className="clock">
            {time}
        </div>
    );
};

export default Clock;