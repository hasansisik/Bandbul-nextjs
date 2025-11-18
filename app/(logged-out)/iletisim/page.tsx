import ContactPage from "@/components/ContactPage";
import { Metadata } from "next";

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Bandbul- İletişim" };
}
export default function ContactServerPage() {
  return (
    <div>
      <ContactPage />
    </div>
  )
}