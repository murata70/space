-- 1. 設定テーブル (ユーザーごとの設定を保存)
CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    current_theme_id VARCHAR(50) DEFAULT 'default_space',
    volume_level INTEGER DEFAULT 50 CHECK (volume_level BETWEEN 0 AND 100),
    show_seconds BOOLEAN DEFAULT TRUE,
    time_format_24h BOOLEAN DEFAULT TRUE,
    timezone VARCHAR(100) DEFAULT 'Asia/Tokyo',
    rocket_color_idx INTEGER DEFAULT 0,
    muted BOOLEAN DEFAULT FALSE -- 変数名 muted に対応
);

-- 2. コレクションマスタ (アイテムやテーマの定義)
CREATE TABLE collections_master (
    item_id VARCHAR(50) PRIMARY KEY, -- 'METEOR_01' など
    item_type VARCHAR(20) NOT NULL,  -- 'event' または 'theme'
    name VARCHAR(100) NOT NULL,
    image_path TEXT,
    rarity VARCHAR(20) DEFAULT 'normal', -- 'normal', 'rare'
    unlock_condition TEXT,            -- 解放条件のテキスト
    preview_anim_path TEXT            -- previewAnim 用のパス
);

-- 3. 発見ログ (ユーザーが実際にアンロックした履歴)
CREATE TABLE discovery_logs (
    id SERIAL PRIMARY KEY,
    item_id VARCHAR(50) REFERENCES collections_master(item_id),
    discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);