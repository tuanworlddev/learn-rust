import LearningPage from "@/components/learning-page";
import { pageMetadata } from "@/lib/seo";
export function generateMetadata() { return pageMetadata("lo-trinh"); }
export default function Home() { return <LearningPage route="lo-trinh" />; }
