import type { Metadata } from "next";
import AuthCallback from "@/components/auth-callback";

export const metadata: Metadata = {
  title: "Xác nhận tài khoản",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function AuthCallbackPage() {
  return <AuthCallback />;
}
