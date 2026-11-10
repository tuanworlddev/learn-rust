import type { CourseCatalog } from "../course-types";
export const CATALOG_SCHEMA_VERSION: 1;
export const MAX_CATALOG_BYTES: number;
export function validateCatalog(value: unknown): CourseCatalog;
export function canonicalCatalog(value: unknown): string;
export function parseCourseExport(value: unknown): CourseCatalog;
