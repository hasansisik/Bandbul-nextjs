import { RegistrationForm } from "@/components/registration-form"
import { Metadata } from "next";

export const dynamic = 'force-static' 

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Bandbul- Kayit Ol" };
}

export default function RegisterPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegistrationForm />
      </div>
    </div>
  )
}
