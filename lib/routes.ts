/** Stable lesson links and redirects preserve existing progress and bookmarks. */
export function routeHref(route: string): string {
  if (["lo-trinh", "tong-quan", "bai-hoc", "chuyen-sau", ""].includes(route)) return "/";
  if (route === "di-lam") return "/phong-van";
  if (route.startsWith("chuyen-sau/")) route = "khoa-hoc/" + route.slice("chuyen-sau/".length);
  return "/" + route.split("/").map(encodeURIComponent).join("/");
}
