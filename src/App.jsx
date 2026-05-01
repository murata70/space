import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 作成した各ページをインポート

import Home from './pages/Home/Home';
import Wallpaper from './pages/Wallpaper/Wallpaper';
import Settings from './pages/Settings/Settings';
import Collection from './pages/Collection/Collection';

function App() {
    return (
        <Router>
            <Routes>
                {/* http://localhost:5173/ の時 */}
                <Route path="/" element={<Home />} />

                {/* http://localhost:5173/wallpaper の時 */}
                <Route path="/wallpaper" element={<Wallpaper />} />

                {/* http://localhost:5173/settings の時 */}
                <Route path="/settings" element={<Settings />} />

                 http://localhost:5173/collection の時 
                {/*<Route path="/collection" element={<Collection />} /> */}

                {/* 存在しないURLが打たれた時はHomeへ */}
                <Route path="*" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;