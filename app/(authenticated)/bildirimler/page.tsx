import { NotificationsPage } from "@/components/NotificationsPage"
import { AuthMiddleware } from "@/components/AuthMiddleware"
import { Metadata } from "next";
export async function generateMetadata(): Promise<Metadata> {
  return { title: "Bandbul- Bildirimler", };
}
export default function Notifications() {
  return (
    <AuthMiddleware>
      <div className="min-h-screen bg-background">
        <NotificationsPage />
      </div>
    </AuthMiddleware>
  )
}

