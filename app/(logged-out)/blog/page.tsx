import BlogPage from "@/components/BlogPage";
import { Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
  return { title: "Bandbul- Blog" };
}
export default function BlogServerPage() {
  return <BlogPage />
}