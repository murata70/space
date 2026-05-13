import UFOFlow from "./flows/UFOFlow";
import FlagFlow from "./flows/FlagFlow";
import OrbitalFlow from "./flows/OrbitalFlow";
import SupermanFlow from "./flows/SupermanFlow";
import BlackHoleFlow from "./flows/BlackHoleFlow";
import MeteorShowerFlow from "./flows/MeteorShowerFlow";
import MeteorFlow from "./flows/MeteorFlow";
import CatFlow from "./flows/CatFlow";
import AstronautFlow from "./flows/AstronautFlow";
import ZodiacFlow from "./flows/ZodiacFlow";
import GiantSpaceshipFlow from "./flows/GiantSpaceshipFlow";

export default function FlowController({ item }) {

  switch (item.id) {

    case "ufo":
      return <UFOFlow item={item} />

    case "flag":
      return <FlagFlow item={item} />

    case "orbital":
      return <OrbitalFlow item={item} />

    case "superman":
      return <SupermanFlow item={item} />

    case "blackhole":
      return <BlackHoleFlow item={item} />

    case "meteor_shower":
      return <MeteorShowerFlow item={item} />

    case "meteor":
      return <MeteorFlow item={item} />

    case "cat":
      return <CatFlow item={item} />

    case "astronaut":
      return <AstronautFlow item={item} />

    case "zodiac":
      return <ZodiacFlow item={item} />

    case "giant_spaceship":
      return <GiantSpaceshipFlow item={item} />

    default:
      return null;
  }
