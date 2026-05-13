const STORAGE_KEY = "space_collections";

/**
 * 取得済みコレクション一覧を取得
 */
export const getCollections = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * コレクション追加
 */
export const saveCollection = (item) => {
  const current = getCollections();

  // 重複防止
  const exists = current.some((i) => i.id === item.id);
  if (exists) return;

  const updated = [...current, item];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

/**
 * 全削除（デバッグ用）
 */
export const clearCollections = () => {
  localStorage.removeItem(STORAGE_KEY);
};