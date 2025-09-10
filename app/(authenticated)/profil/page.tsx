import { ProfilePage } from "@/components/ProfilePage"
import { AuthMiddleware } from "@/components/AuthMiddleware"

export default function Profile() {
  return (
    <AuthMiddleware>
      <div className="min-h-screen bg-background">
        <ProfilePage />
      </div>
    </AuthMiddleware>
  )
}
