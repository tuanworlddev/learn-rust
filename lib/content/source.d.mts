import type { CourseCatalog } from "../course-types";
export class CourseContentError extends Error { code: string; constructor(code: string); }
export function courseContentSource(env?: Record<string, string | undefined>): "bundled" | "supabase";
export function fetchPublishedCatalog(env?: Record<string, string | undefined>, fetcher?: typeof fetch): Promise<CourseCatalog>;
export function createPublishedCatalogReader(options?: { load?: () => Promise<CourseCatalog>; now?: () => number; ttlMs?: number }): () => Promise<CourseCatalog>;
