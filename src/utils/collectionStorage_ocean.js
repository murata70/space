const STORAGE_KEY = "ocean_collections";

/**
 * データ取得（常に安全に配列で返す）
 */
export const getOceanCollections = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);

    // 新形式対応
    if (Array.isArray(parsed)) return parsed;
    if (parsed?.items) return parsed.items;

    return [];
  } catch (e) {
    console.warn("Ocean collections parse error:", e);
    return [];
  }
};

/**
 * 保存
 */
export const saveOceanCollection = (item) => {
  try {
    const current = getOceanCollections();

    const exists = current.some((i) => i.id === item.id);
    if (exists) return;

    const updated = [...current, item];

    const completed = updated.length >= 11;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        items: updated,
        completed,
      })
    );
  } catch (e) {
    console.warn("Ocean save error:", e);
  }
};

/**
 * クリア
 */
export const clearOceanCollections = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("Ocean clear error:", e);
  }
};