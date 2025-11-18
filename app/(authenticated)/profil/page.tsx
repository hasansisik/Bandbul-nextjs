import { ProfilePage } from "@/components/ProfilePage"
import { AuthMiddleware } from "@/components/AuthMiddleware"
import { Metadata } from "next";

export async function generateMetadata({ params, searchParams }: any): Promise<Metadata> {
  let title = "Profil";
  if (searchParams && Object.keys(searchParams).length > 0) {
    title = "İlan Ver";
  }

  return { title: `Bandbul-  ${title}` };
}
export default function Profile() {
  return (
    <AuthMiddleware>
      <div className="min-h-screen bg-background">
        <ProfilePage />
      </div>
    </AuthMiddleware>
  )
}
