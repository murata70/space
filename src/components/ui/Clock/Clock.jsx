import React, { useEffect, useState } from "react";
import "./Clock.css";

const Clock = () => {

    const [time, setTime] = useState("");

    useEffect(() => {

        const updateClock = () => {

            let settings = {};

            /* localStorage 読み込み */
            try {
                settings =
                    JSON.parse(
                        localStorage.getItem("user_settings")
                    ) || {};
            } catch (error) {
                console.error(
                    "設定の読み込み失敗",
                    error
                );
            }

            /* 設定取得 */
            const {
                sec = true,
                is24h = true,
                tz = "Asia/Tokyo"
            } = settings;

            /* timezone防御 */
            let safeTz = tz;

            if (safeTz === "Asia/Osaka") {
                safeTz = "Asia/Tokyo";
            }

            const now = new Date();

            const options = {
                hour: "2-digit",
                minute: "2-digit",
                hour12: !is24h,
                timeZone: safeTz
            };

            // sec ON の時だけ秒表示
            if (sec) {
                options.second = "2-digit";
            }

            //時計表記 AM / PM
            const formattedTime =
                now.toLocaleTimeString("en-US", options);

            setTime(formattedTime);
        };

        /* 初回実行 */
        updateClock();

        /* 1秒ごと更新 */
        const interval = setInterval(updateClock, 1000);

        /* cleanup */
        return () => clearInterval(interval);

    }, []);

    return (
        <div className="clock">
            {time}
        </div>
    );
};

export default Clock;