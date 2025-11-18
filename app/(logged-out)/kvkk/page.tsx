import KVKKPage from "@/components/KvkkPage";
import { Metadata } from "next";

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Bandbul- KVKK" };
}
export default function KVKKServerPage() {
  return (
    <div>
      <KVKKPage />
    </div>
  )
}