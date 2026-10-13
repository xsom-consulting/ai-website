import { Composition } from "remotion";
import { ExtensionLoop, EXTENSION_SECONDS } from "./ExtensionLoop";
import { FleetHero, FLEET_HERO_SECONDS } from "./fleet/FleetHero";
import { HowBlockFilm, HOW_BLOCK_SECONDS } from "./fleet/HowBlock";
import { HowFilm, HOW_SECONDS, HOW_TOPICS } from "./fleet/HowFilm";
import { HomeFilm, HOME_SECONDS } from "./HomeFilm";

const FILM = { fps: 24, width: 1920, height: 1080 };

export function Root() {
  return (
    <>
      {(["fr", "en"] as const).map((lang) => (
        <Composition key={`home-${lang}`} id={`home-${lang}`} component={HomeFilm} defaultProps={{ lang }} durationInFrames={HOME_SECONDS * FILM.fps} {...FILM} />
      ))}
      <Composition id="extension" component={ExtensionLoop} durationInFrames={EXTENSION_SECONDS * 30} fps={30} width={1920} height={1080} />
      {(["fr", "en"] as const).map((lang) => (
        <Composition key={`fleet-hero-${lang}`} id={`fleet-hero-${lang}`} component={FleetHero} defaultProps={{ lang }} durationInFrames={FLEET_HERO_SECONDS * FILM.fps} {...FILM} />
      ))}
      {(["fr", "en"] as const).map((lang) => (
        <Composition key={`fleet-how-block-${lang}`} id={`fleet-how-block-${lang}`} component={HowBlockFilm} defaultProps={{ lang }} durationInFrames={HOW_BLOCK_SECONDS * 30} fps={30} width={1920} height={1080} />
      ))}
      {HOW_TOPICS.flatMap((topic) =>
        (["fr", "en"] as const).map((lang) => (
          <Composition key={`fleet-how-${topic}-${lang}`} id={`fleet-how-${topic}-${lang}`} component={HowFilm} defaultProps={{ topic, lang }} durationInFrames={HOW_SECONDS * 30} fps={30} width={1920} height={1080} />
        )),
      )}
    </>
  );
}
