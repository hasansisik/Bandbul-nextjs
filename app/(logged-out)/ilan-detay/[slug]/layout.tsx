// ilan-detay/[slug]/layout.tsx
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Bandbul- İlan Detay" };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}