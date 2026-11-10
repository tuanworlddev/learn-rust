#!/usr/bin/env node
import { courseContentSource, fetchPublishedCatalog } from "../lib/content/source.mjs";

try {
  const source = courseContentSource();
  if (source === "bundled") {
    console.log("Course content: bundled. Use content:export to validate the repository catalog.");
  } else {
    const catalog = await fetchPublishedCatalog();
    console.log(JSON.stringify({ source, status: "published catalog valid", modules: catalog.modules.length, lessons: catalog.lessons.length, specializations: catalog.specializations.length }, null, 2));
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
