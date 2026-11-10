import type { CourseModule } from "../curriculum";
import { backendBundle } from "./backend";
import { systemsBundle } from "./systems";
import { embeddedBundle } from "./embedded";
import { desktopBundle } from "./desktop";
import { mobileBundle } from "./mobile";
import { cliBundle } from "./cli";
import { wasmBundle } from "./wasm";
import { compilerBundle } from "./compiler";
import { securityBundle } from "./security";
import { gameBundle } from "./game";
import { dataBundle } from "./data";
import { aiBundle } from "./ai";
import { blockchainBundle } from "./blockchain";

export const specializationBundles = [backendBundle, systemsBundle, embeddedBundle, desktopBundle, mobileBundle, cliBundle, wasmBundle, compilerBundle, securityBundle, gameBundle, dataBundle, aiBundle, blockchainBundle];
export const specializations = specializationBundles.map(bundle => bundle.track);
export const specializationLessons = specializationBundles.flatMap(bundle => bundle.lessons);
export const specializationModules: CourseModule[] = specializations.map(track => ({
  id: `track-${track.id}`, title: track.shortTitle, description: track.description,
  color: track.color, icon: "book", level: "Chuyên sâu",
}));
