import "server-only";
import { cache } from "react";
import { modules, lessons } from "@/src/data/curriculum";
import { specializations, specializationLessons, specializationModules } from "@/src/data/specializations";
import type { CourseCatalog } from "./course-types";
import { validateCatalog } from "./content/catalog.mjs";
import { courseContentSource, createPublishedCatalogReader } from "./content/source.mjs";

const readPublishedCatalog = createPublishedCatalogReader();
let bundledCatalog: CourseCatalog | undefined;

/** React cache deduplicates metadata/page/JSON-LD reads within one request.
 * Supabase publication is revalidated every 30 seconds; failure never serves
 * bundled lessons under a production Supabase configuration. Static bundled
 * content is validated once per server process, on its first use. */
export const getCourseCatalog = cache(async (): Promise<CourseCatalog> => {
  if (courseContentSource() === "supabase") return readPublishedCatalog();
  return bundledCatalog ??= validateCatalog({
    modules: [...modules, ...specializationModules],
    lessons: [...lessons, ...specializationLessons],
    specializations,
  });
});
