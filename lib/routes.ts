/** Stable, shareable URLs. Legacy hash URLs are migrated by the client shell. */
export function routeHref(route: string): string {
  if (route === "lo-trinh" || route === "tong-quan" || !route) return "/";
  if (route === "di-lam") return "/phong-van";
  return `/${route.split("/").map(encodeURIComponent).join("/")}`;
}
