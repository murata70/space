import collectionMaster from "../data/collectionMaster";
import { getCollections } from "./collectionStorage";

export const OCEAN_THEME_UNLOCK_MESSAGE =
    "テーマ「宇宙」のコレクションをコンプリートしたらアンロック";

/** 宇宙テーマのコレクションをすべて獲得済みか */
export function isSpaceCollectionComplete() {
    const saved = getCollections();
    const items = Array.isArray(saved) ? saved : saved?.items || [];
    return items.length >= collectionMaster.length;
}
