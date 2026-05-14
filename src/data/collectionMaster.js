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
  },

  {
    id: "meteor",
    name: "隕石",
    component: MeteorFlow,
  },

  {
    id: "cat",
    name: "ひかるねこ",
    component: CatFlow,
  },

  {
    id: "astronaut",
    name: "宇宙飛行士",
    component: AstronautFlow,
  },

  {
    id: "blackhole",
    name: "ブラックホール",
    component: BlackHoleFlow,
  },

  {
    id: "flag",
    name: "エンドクレジット",
    component: FlagFlow,
  },

  {
    id: "giant_spaceship",
    name: "巨大宇宙船",
    component: GiantSpaceshipFlow,
  },

  {
    id: "meteor_shower",
    name: "流星群",
    component: MeteorShowerFlow,
  },

  {
    id: "orbital",
    name: "人工衛星",
    component: OrbitalFlow,
  },

  {
    id: "superman",
    name: "スーパーマン",
    component: SupermanFlow,
  },

  {
    id: "zodiac",
    name: "星座",
    component: ZodiacFlow,
  },
];

export default collectionMaster;