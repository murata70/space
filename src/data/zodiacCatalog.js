const publicUrl = process.env.PUBLIC_URL || "";

/** 実ファイル名に合わせた12星座マスタ（aries のみ小文字） */
export const ZODIAC_SIGNS = [
    { id: "aquarius", name: "みずがめ座", file: "Aquarius.png" },
    { id: "aries", name: "おひつじ座", file: "aries.png" },
    { id: "cancer", name: "かに座", file: "Cancer.png" },
    { id: "capricorn", name: "やぎ座", file: "Capricorn.png" },
    { id: "gemini", name: "ふたご座", file: "Gemini.png" },
    { id: "leo", name: "しし座", file: "Leo.png" },
    { id: "libra", name: "てんびん座", file: "Libra.png" },
    { id: "pisces", name: "うお座", file: "Pisces.png" },
    { id: "sagittarius", name: "いて座", file: "Sagittarius.png" },
    { id: "scorpio", name: "さそり座", file: "Scorpio.png" },
    { id: "taurus", name: "おうし座", file: "Taurus.png" },
    { id: "virgo", name: "おとめ座", file: "Virgo.png" },
];

export function getZodiacImageUrl(sign) {
    if (!sign) return "";
    return `${publicUrl}/assets/image/collections/${sign.file}`;
}

export function getZodiacSignById(id) {
    return ZODIAC_SIGNS.find((sign) => sign.id === id) ?? null;
}

export function pickRandomZodiacSign() {
    return ZODIAC_SIGNS[Math.floor(Math.random() * ZODIAC_SIGNS.length)];
}
