import { notFound, permanentRedirect } from "next/navigation";
import LearningPage from "@/components/learning-page";
import { getPageInfo, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ path: string[] }> };
async function resolveRoute({ params }: Props) {
  const route = (await params).path.join("/");
  if (route === "di-lam") permanentRedirect("/phong-van");
  if (["lo-trinh", "tong-quan", "bai-hoc", "chuyen-sau"].includes(route)) permanentRedirect("/");
  if (route.startsWith("chuyen-sau/")) permanentRedirect("/khoa-hoc/" + route.slice("chuyen-sau/".length));
  if (!await getPageInfo(route)) notFound();
  return route;
}
export async function generateMetadata(props: Props) { return pageMetadata(await resolveRoute(props)); }
export default async function Page(props: Props) { return <LearningPage route={await resolveRoute(props)} />; }
