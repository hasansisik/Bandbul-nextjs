import ListingRulesPage from "@/components/ListingRulePage";
import { Metadata } from "next";
export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Bandbul- İlan Kuralları" };
}
export default function ListingRulesServerPage() {
  return (
    <div>
      <ListingRulesPage />
    </div>
  )
}