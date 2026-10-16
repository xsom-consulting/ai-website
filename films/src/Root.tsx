import { Composition } from "remotion";
import { AiHero, AI_HERO_SECONDS } from "./AiHero";
import { ExtensionLoop, EXTENSION_SECONDS } from "./ExtensionLoop";
import { FleetHero, FLEET_HERO_SECONDS } from "./fleet/FleetHero";
import { HowBlockFilm, HOW_BLOCK_SECONDS } from "./fleet/HowBlock";
import { HowFilm, HOW_SECONDS, HOW_TOPICS } from "./fleet/HowFilm";
import { HomeFilm, HOME_SECONDS } from "./HomeFilm";
import { FleetAd, AD_FPS, AD_SECONDS } from "./fleet/v2/FleetAd";
import { HowV2, HOW_V2_FPS, howV2Seconds } from "./fleet/v2/HowV2";

const FILM = { fps: 24, width: 1920, height: 1080 };

export function Root() {
  return (
    <>
      {(["fr", "en"] as const).map((lang) => (
        <Composition key={`home-${lang}`} id={`home-${lang}`} component={HomeFilm} defaultProps={{ lang }} durationInFrames={HOME_SECONDS * FILM.fps} {...FILM} />
      ))}
      <Composition id="ai-hero" component={AiHero} durationInFrames={AI_HERO_SECONDS * FILM.fps} {...FILM} />
      <Composition id="extension" component={ExtensionLoop} durationInFrames={EXTENSION_SECONDS * 30} fps={30} width={1920} height={1080} />
      {(["fr", "en"] as const).map((lang) => (
        <Composition key={`fleet-hero-${lang}`} id={`fleet-hero-${lang}`} component={FleetHero} defaultProps={{ lang }} durationInFrames={FLEET_HERO_SECONDS * FILM.fps} {...FILM} />
      ))}
      {(["fr", "en"] as const).map((lang) => (
        <Composition key={`fleet-how-block-${lang}`} id={`fleet-how-block-${lang}`} component={HowBlockFilm} defaultProps={{ lang }} durationInFrames={HOW_BLOCK_SECONDS * 30} fps={30} width={1920} height={1080} />
      ))}
      {(["fr", "en"] as const).map((lang) => (
        <Composition key={`fleet-ad-${lang}`} id={`fleet-ad-${lang}`} component={FleetAd} defaultProps={{ lang }} durationInFrames={AD_SECONDS * AD_FPS} fps={AD_FPS} width={1920} height={1080} />
      ))}
      {(["fr", "en"] as const).map((lang) => (
        <Composition key={`fleet-how-v2-${lang}`} id={`fleet-how-v2-${lang}`} component={HowV2} defaultProps={{ lang }} durationInFrames={Math.round(howV2Seconds(lang) * HOW_V2_FPS)} fps={HOW_V2_FPS} width={1920} height={1080} />
      ))}
      {HOW_TOPICS.flatMap((topic) =>
        (["fr", "en"] as const).map((lang) => (
          <Composition key={`fleet-how-${topic}-${lang}`} id={`fleet-how-${topic}-${lang}`} component={HowFilm} defaultProps={{ topic, lang }} durationInFrames={HOW_SECONDS * 30} fps={30} width={1920} height={1080} />
        )),
      )}
    </>
  );
}
