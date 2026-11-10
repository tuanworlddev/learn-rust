#!/usr/bin/env node
import { importCourse, parseImportArgs } from "./lib/course-import.mjs";

try {
  const result = await importCourse(parseImportArgs(process.argv.slice(2)));
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
