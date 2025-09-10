import { ProfileEditPage } from "@/components/ProfileEditPage"
import { AuthMiddleware } from "@/components/AuthMiddleware"

export default function ProfileEdit() {
  return (
    <AuthMiddleware>
      <div className="min-h-screen bg-background">
        <ProfileEditPage />
      </div>
    </AuthMiddleware>
  )
}
