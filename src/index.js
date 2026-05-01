import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // 司令塔である App.jsx を読み込みます

// CSSをプロジェクト全体に適用したい場合はここでインポートします
// import './index.css'; 

// public/index.html にある <div id="root"></div> を探して、そこにReactを起動させます
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        {/* 司令塔の App コンポーネントを画面に描画します */}
        <App />
    </React.StrictMode>
);