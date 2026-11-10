import "server-only";
import { cache } from "react";
import { modules, lessons } from "@/src/data/curriculum";
import { specializations, specializationLessons, specializationModules } from "@/src/data/specializations";
import type { CourseCatalog } from "./course-types";
import { validateCatalog } from "./content/catalog.mjs";
import { courseContentSource, createPublishedCatalogReader } from "./content/source.mjs";

const readPublishedCatalog = createPublishedCatalogReader();

/** React cache deduplicates metadata/page/JSON-LD reads within one request.
 * A validated Supabase snapshot is reused for at most 30 seconds; failure never serves bundled
 * lessons under a production Supabase configuration. */
export const getCourseCatalog = cache(async (): Promise<CourseCatalog> => {
  if (courseContentSource() === "supabase") return readPublishedCatalog();
  return validateCatalog({
    modules: [...modules, ...specializationModules],
    lessons: [...lessons, ...specializationLessons],
    specializations,
  });
});
