import { readFileSync } from "node:fs";
import { dirname, resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { Script } from "node:vm";
import ts from "typescript";

const dataRoot = fileURLToPath(new URL("../../src/data/", import.meta.url));

/** Build-time loading of this repository's trusted TypeScript data modules.
 * No network dependency, loader flags, or new runtime package is required.
 * This is not a sandbox for importing third-party/untrusted TypeScript. */
export function readCourseSource({ foundationOnly = false } = {}) {
  const cache = new Map();
  function load(file) {
    const path = resolve(file);
    const local = relative(dataRoot, path);
    if (local.startsWith(`..${sep}`) || local === ".." || !path.endsWith(".ts")) throw new Error("Course data import must stay in src/data.");
    if (cache.has(path)) return cache.get(path).exports;
    const source = readFileSync(path, "utf8");
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }, fileName: path, reportDiagnostics: true });
    if (compiled.diagnostics?.some(item => item.category === ts.DiagnosticCategory.Error)) throw new Error(`Invalid TypeScript data module: ${local}`);
    const dataModule = { exports: {} };
    cache.set(path, dataModule);
    const requireData = specifier => {
      if (!specifier.startsWith(".")) throw new Error(`Unexpected course data dependency: ${specifier}`);
      const target = resolve(dirname(path), specifier);
      try { return load(target.endsWith(".ts") ? target : `${target}.ts`); }
      catch (error) {
        if (error.code !== "ENOENT") throw error;
        return load(resolve(target, "index.ts"));
      }
    };
    const fn = new Script(`(function (exports, require, module) {\n${compiled.outputText}\n})`, { filename: path }).runInThisContext();
    fn(dataModule.exports, requireData, dataModule);
    return dataModule.exports;
  }
  const base = load(resolve(dataRoot, "curriculum.ts"));
  const advanced = foundationOnly ? { specializationModules: [], specializationLessons: [], specializations: [] } : load(resolve(dataRoot, "specializations/index.ts"));
  return { modules: [...base.modules, ...advanced.specializationModules], lessons: [...base.lessons, ...advanced.specializationLessons], specializations: advanced.specializations };
}
