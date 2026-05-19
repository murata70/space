const publicUrl = process.env.PUBLIC_URL || "";

// ocean flows
import CarriageFlow from "../components/ocean_ui/flows/CarriageFlow/CarriageFlow";
import FlagBannerFlow from "../components/ocean_ui/flows/FlagBannerFlow/FlagBannerFlow";
import FuturisticCarFlow from "../components/ocean_ui/flows/FuturisticCarFlow/FuturisticCarFlow";
import Astronaut2Flow from "../components/ocean_ui/flows/Astronaut2Flow/Astronaut2Flow";
import ShipFlow from "../components/ocean_ui/flows/ShipFlow/ShipFlow";
import RacingCarFlow from "../components/ocean_ui/flows/RacingCarFlow/RacingCarFlow";
import ShinkansenFlow from "../components/ocean_ui/flows/ShinkansenFlow/ShinkansenFlow";
import SportsCarFlow from "../components/ocean_ui/flows/SportsCarFlow/SportsCarFlow";
import TrainFlow from "../components/ocean_ui/flows/TrainFlow/TrainFlow";
import VintageCarFlow from "../components/ocean_ui/flows/VintageCarFlow/VintageCarFlow";
import SupermanFlow from "../components/ocean_ui/flows/SupermanFlow/SupermanFlow";

const collectionMaster_ocean = [
    {
        id: "carriage",
        name: "馬車",
        component: CarriageFlow,
        images: [`${publicUrl}/assets/ocean_image/collections/carriage.png`],
    },
    {
        id: "flag_banner",
        name: "エンドクレジット",
        component: FlagBannerFlow,
        images: [`${publicUrl}/assets/ocean_image/collections/flag_banner.png`],
    },
    {
        id: "futuristic_car",
        name: "未来の車",
        component: FuturisticCarFlow,
        images: [`${publicUrl}/assets/ocean_image/collections/futuristic_car.png`],
    },
    {
        id: "astronaut2",
        name: "助かった宇宙人",
        component: Astronaut2Flow,
        images: [`${publicUrl}/assets/ocean_image/collections/astronaut2.png`],
    },
    {
        id: "ship",
        name: "海賊船",
        component: ShipFlow,
        images: [`${publicUrl}/assets/ocean_image/collections/ship.png`],
    },
    {
        id: "racing_car",
        name: "レーシングカー",
        component: RacingCarFlow,
        images: [`${publicUrl}/assets/ocean_image/collections/racing_car.png`],
    },
    {
        id: "shinkansen",
        name: "新幹線",
        component: ShinkansenFlow,
        images: [`${publicUrl}/assets/ocean_image/collections/shinkansen.png`],
    },
    {
        id: "sports_car",
        name: "スポーツカー",
        component: SportsCarFlow,
        images: [`${publicUrl}/assets/ocean_image/collections/sports_car.png`],
    },
    {
        id: "train",
        name: "汽車",
        component: TrainFlow,
        images: [`${publicUrl}/assets/ocean_image/collections/train.png`],
    },
    {
        id: "vintage_car",
        name: "ヴィンテージカー",
        component: VintageCarFlow,
        images: [`${publicUrl}/assets/ocean_image/collections/vintage_car.png`],
    },
    {
        id: "superman",
        name: "スーパーマン",
        component: SupermanFlow,
        images: [`${publicUrl}/assets/ocean_image/collections/superman.png`],
    },
];

export default collectionMaster_ocean;