"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { verifyEmail, againEmail, clearError } from "@/redux/actions/userActions"

export function EmailVerificationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [resendLoading, setResendLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { loading, message, error, isAuthenticated } = useAppSelector((state) => state.user)

  // Clear messages when component mounts and set email from URL
  useEffect(() => {
    dispatch(clearError())
    const emailFromUrl = searchParams.get("email")
    if (emailFromUrl) {
      setEmail(emailFromUrl)
    }
  }, [dispatch, searchParams])

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    // Ensure email is always available from URL params
    const emailToUse = searchParams.get("email") || email

    try {
      const result = await dispatch(verifyEmail({
        email: emailToUse,
        verificationCode: Number(verificationCode),
      }))

      if (verifyEmail.fulfilled.match(result)) {
        setTimeout(() => {
          router.push("/giris")
        }, 2000)
      }
    } catch (err) {
      console.error("Verification error:", err)
    }
  }

  const handleResendCode = async () => {
    try {
      setResendLoading(true)
      // Ensure email is always available from URL params
      const emailToUse = searchParams.get("email") || email
      if (!emailToUse) {
        console.error("No email available for resend")
        return
      }
      await dispatch(againEmail(emailToUse))
    } catch (err) {
      console.error("Resend error:", err)
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleVerifyEmail} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">E-posta Doğrulama</h1>
                <p className="text-muted-foreground text-balance">
                  E-posta adresinize gönderilen 4 haneli doğrulama kodunu girin
                </p>
              </div>
              
              {message && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md text-sm">
                  {message}
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}



              <div className="grid gap-3">
                <Label htmlFor="verificationCode">Doğrulama Kodu</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="1234"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={4}
                  pattern="[0-9]{4}"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Doğrulanıyor..." : "E-postayı Doğrula"}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendCode}
                  disabled={loading || resendLoading || !email}
                  className="text-sm"
                >
                  {resendLoading ? "Gönderiliyor..." : "Kod Tekrar Gönder"}
                </Button>
              </div>

              <div className="text-center text-sm">
                <a href="/giris" className="underline underline-offset-4">
                  Giriş sayfasına dön
                </a>
              </div>
            </div>
          </form>
          
          <div className="bg-muted relative hidden md:block">
            <img
              src="/hero.jpg"
              alt="Hero Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Devam ederek <a href="/ilan-kurallari">Kullanım Koşulları</a>{" "}
        ve <a href="/gizlilik-sozlesmesi">Gizlilik Politikası</a>'nı kabul etmiş olursunuz.
      </div>
    </div>
  )
}
