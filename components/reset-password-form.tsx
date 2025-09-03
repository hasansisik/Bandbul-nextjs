"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { resetPassword } from "@/redux/actions/userActions"

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [passwordToken, setPasswordToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { loading, message, error } = useAppSelector((state) => state.user)

  // Pre-fill email from URL params if available
  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      return
    }

    if (newPassword.length < 6) {
      return
    }

    try {
      const result = await dispatch(resetPassword({
        email,
        passwordToken: Number(passwordToken),
        newPassword,
      }))

      if (resetPassword.fulfilled.match(result)) {
        setTimeout(() => {
          router.push("/giris")
        }, 2000)
      }
    } catch (err) {
      console.error("Reset password error:", err)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleResetPassword} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Yeni Şifre Belirleme</h1>
                <p className="text-muted-foreground text-balance">
                  E-posta adresinize gönderilen kodu ve yeni şifrenizi girin
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
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="passwordToken">Doğrulama Kodu</Label>
                <Input
                  id="passwordToken"
                  type="text"
                  placeholder="1234"
                  value={passwordToken}
                  onChange={(e) => setPasswordToken(e.target.value)}
                  maxLength={4}
                  pattern="[0-9]{4}"
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="newPassword">Yeni Şifre</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Yeni şifrenizi girin"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Şifrenizi tekrar girin"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Şifre Değiştiriliyor..." : "Şifreyi Değiştir"}
              </Button>

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
