-- 初期データの挿入 (マスタデータ)
INSERT INTO collections_master (item_id, item_type, name, rarity, unlock_condition) VALUES
('THEME_NEON', 'theme', 'ネオン・トレース', 'rare', 'イベントを10個収集'),
('EVENT_CAT', 'event', '宇宙猫の通過', 'normal', '最初から出現');

-- 初期のユーザー設定
INSERT INTO user_settings (volume_level, show_seconds) VALUES (70, TRUE);