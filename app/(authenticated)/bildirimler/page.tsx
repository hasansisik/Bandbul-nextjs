import { NotificationsPage } from "@/components/NotificationsPage"
import { AuthMiddleware } from "@/components/AuthMiddleware"

export default function Notifications() {
  return (
    <AuthMiddleware>
      <div className="min-h-screen bg-background">
        <NotificationsPage />
      </div>
    </AuthMiddleware>
  )
}
