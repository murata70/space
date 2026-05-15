import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home/Home';
import Wallpaper from './pages/Wallpaper/Wallpaper';
import Settings from './pages/Settings/Settings';
import Collection from './pages/Collection/Collection';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/wallpaper" element={<Wallpaper />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;