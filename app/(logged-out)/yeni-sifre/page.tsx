import { Suspense } from "react"
import { ResetPasswordForm } from "@/components/reset-password-form"
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Bandbul- Şifre Sıfırlama" };
}
export default function ResetPasswordPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Suspense fallback={<div>Yükleniyor...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
