import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// メンバーが作った各ファイルをインポート
import Home from './pages/Home/Home';
import Wallpaper from './pages/Wallpaper/Wallpaper';
import Settings from './pages/Settings/Settings';
import Collection from './pages/Collection/Collection';

function App() {
    return (
        <Router>
            <Routes>
                {/* URLのパスと、表示するコンポーネントを紐付けます */}
                <Route path="/" element={<Home />} />
                <Route path="/wallpaper" element={<Wallpaper />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/collection" element={<Collection />} />
            </Routes>
        </Router>
    );
}

export default App;