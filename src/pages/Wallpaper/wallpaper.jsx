import React from "react";
import "./Settings.css";

const Settings = () => {
    return (
        <div className="settings">
            <h2>設定</h2>

            <div>🔊</div>

            <div>
                <label>
                    秒表示
                    <input type="checkbox" />
                </label>
            </div>

            <div>
                <label>
                    24時間表示
                    <input type="checkbox" />
                </label>
            </div>

            <div>
                <select>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="UTC">UTC</option>
                </select>
            </div>
        </div>
    );
};

export default Settings;