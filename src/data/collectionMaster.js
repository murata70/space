const publicUrl = process.env.PUBLIC_URL || "";

import UFOFlow from "../components/ui/flows/UFOFlow/UFOFlow";
import MeteorFlow from "../components/ui/flows/MeteorFlow/MeteorFlow";
import CatFlow from "../components/ui/flows/CatFlow/CatFlow";
import AstronautFlow from "../components/ui/flows/AstronautFlow/AstronautFlow";
import BlackHoleFlow from "../components/ui/flows/BlackHoleFlow/BlackHoleFlow";
import FlagFlow from "../components/ui/flows/FlagFlow/FlagFlow";
import GiantSpaceshipFlow from "../components/ui/flows/GiantSpaceshipFlow/GiantSpaceshipFlow";
import MeteorShowerFlow from "../components/ui/flows/MeteorShowerFlow/MeteorShowerFlow";
import OrbitalFlow from "../components/ui/flows/OrbitalFlow/OrbitalFlow";
import SupermanFlow from "../components/ui/flows/SupermanFlow/SupermanFlow";
import ZodiacFlow from "../components/ui/flows/ZodiacFlow/ZodiacFlow";

const collectionMaster = [
  {
    id: "ufo",
    name: "UFO",
    component: UFOFlow,
    images: [`${publicUrl}/assets/image/collections/ufo.png`],
  },
  {
    id: "meteor",
    name: "隕石",
    component: MeteorFlow,
    images: [`${publicUrl}/assets/image/collections/meteor1.png`],
  },
  {
    id: "twink_cat",
    name: "ひかるねこ",
    component: CatFlow,
    images: [`${publicUrl}/assets/image/collections/twinkling_cat1.png`],
  },
  {
    id: "astronaut",
    name: "もう助からない宇宙飛行士",
    component: AstronautFlow,
    images: [`${publicUrl}/assets/image/collections/astronaut.png`],
  },
  {
    id: "blackhole",
    name: "ブラックホール",
    component: BlackHoleFlow,
    images: [`${publicUrl}/assets/image/collections/blackhole.png`],
  },
  {
    id: "flag",
    name: "エンドクレジット",
    component: FlagFlow,
    images: [`${publicUrl}/assets/image/collections/flag.png`],
  },
  {
    id: "giant_spaceship",
    name: "巨大宇宙船",
    component: GiantSpaceshipFlow,
    images: [`${publicUrl}/assets/image/collections/giant_spaceship.png`],
  },
  {
    id: "meteor_shower",
    name: "流星群",
    component: MeteorShowerFlow,
    images: [`${publicUrl}/assets/image/collections/meteor_shower.png`],
  },
  {
    id: "orbital",
    name: "人工衛星",
    component: OrbitalFlow,
    images: [`${publicUrl}/assets/image/collections/orbital.png`],
  },
  {
    id: "superman",
    name: "スーパーマン",
    component: SupermanFlow,
    images: [`${publicUrl}/assets/image/collections/superman.png`],
  },
  {
    id: "zodiac",
    name: "星座",
    component: ZodiacFlow,
    images: [],
  },
];

export default collectionMaster;