import PrivacyPolicyPage from "@/components/PrivacyPolicyPage";
import { Metadata } from "next";

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Bandbul- Gizlilik Sözleşmesi" };
}
export default function PrivacyPolicyServerPage() {
  return (
    <div>
      <PrivacyPolicyPage />
    </div>
  )
}