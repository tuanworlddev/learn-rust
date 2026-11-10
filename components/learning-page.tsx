import LearningApp from "./learning-app";
import { pageStructuredData } from "@/lib/seo";

export default function LearningPage({ route }: { route: string }) {
  const data = pageStructuredData(route);
  return <>
    {data.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />}
    <LearningApp initialRoute={route} />
  </>;
}
