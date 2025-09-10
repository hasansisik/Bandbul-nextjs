"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { login, clearError, loadUser } from "@/redux/actions/userActions"
import { useRouter, useSearchParams } from "next/navigation"
import { GoogleAuthButton } from "@/components/GoogleAuthButton"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Clear any existing error when component mounts
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const result = await dispatch(login({ email, password }))
      if (login.fulfilled.match(result)) {
        // Load user data after successful login
        await dispatch(loadUser())
        
        // Check for redirect parameter
        const redirectUrl = searchParams.get('redirect')
        
        // Role-based redirect
        const userRole = result.payload.role
        if (userRole === 'admin') {
          router.push("/dashboard")
        } else if (redirectUrl) {
          // Decode and redirect to the originally requested page
          const decodedUrl = decodeURIComponent(redirectUrl)
          router.push(decodedUrl)
        } else {
          router.push("/")
        }
      }
    } catch (err) {
      console.error("Login error:", err)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleLogin} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Tekrar Hoş Geldiniz</h1>
                <p className="text-muted-foreground text-balance">
                  Bandbul hesabınıza giriş yapın
                </p>
              </div>
              
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
                <div className="flex items-center">
                  <Label htmlFor="password">Parola</Label>
                  <a
                    href="/sifremi-unuttum"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Parolanızı mı unuttunuz?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Veya
                  </span>
                </div>
              </div>

              <GoogleAuthButton mode="login" />

              <div className="text-center text-sm">
                Hesabınız yok mu?{" "}
                <a href="/kayitol" className="underline underline-offset-4">
                  Kayıt ol
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
