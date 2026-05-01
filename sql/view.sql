-- アンロック状況一覧を出すためのビュー
-- 変数名 unlocked に対応させています
CREATE OR REPLACE VIEW view_collection_status AS
SELECT 
    m.item_id,
    m.name,
    m.item_type,
    m.rarity,
    m.unlock_condition,
    CASE WHEN l.item_id IS NOT NULL THEN TRUE ELSE FALSE END AS unlocked,
    l.discovered_at
FROM collections_master m
LEFT JOIN (SELECT DISTINCT item_id, discovered_at FROM discovery_logs) l 
ON m.item_id = l.item_id;