import { getZodiacImageUrl, getZodiacSignById } from "../data/zodiacCatalog";

const STORAGE_KEY = "space_zodiac_observations";

export function getObservedZodiacSignIds() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function recordZodiacObservation(signId) {
    if (!signId || !getZodiacSignById(signId)) return;

    const current = getObservedZodiacSignIds();
    if (current.includes(signId)) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, signId]));
}

/** 観測順の画像 URL 一覧（先頭が最初に観測した星座） */
export function getObservedZodiacImageUrls() {
    return getObservedZodiacSignIds()
        .map((id) => getZodiacImageUrl(getZodiacSignById(id)))
        .filter(Boolean);
}

export function hasObservedZodiacSigns() {
    return getObservedZodiacImageUrls().length > 0;
}
