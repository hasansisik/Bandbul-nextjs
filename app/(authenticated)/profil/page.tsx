import { ProfilePage } from "@/components/ProfilePage"
import { AuthMiddleware } from "@/components/AuthMiddleware"
import { Metadata } from "next";

type GenerateMetadataProps = {
  params: Record<string, string | string[] | undefined>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ searchParams }: GenerateMetadataProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  const hasQueryParams = resolvedSearchParams && Object.keys(resolvedSearchParams).length > 0
  const title = hasQueryParams ? "İlan Ver" : "Profil"

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
