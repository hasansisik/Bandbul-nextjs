import { ProfileEditPage } from "@/components/ProfileEditPage"
import { AuthMiddleware } from "@/components/AuthMiddleware"
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Bandbul- Profil Düzenle" };
}

export default function ProfileEdit() {
  return (
    <AuthMiddleware>
      <div className="min-h-screen bg-background">
        <ProfileEditPage />
      </div>
    </AuthMiddleware>
  )
}
