"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { register } from "@/redux/actions/userActions"
import { useRouter } from "next/navigation"

export function RegistrationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [kvkkAccepted, setKvkkAccepted] = useState(false)
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.user)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      return
    }

    try {
      const result = await dispatch(register({
        name: firstName,
        surname: lastName,
        email,
        password,
      }))
      
      if (register.fulfilled.match(result)) {
        router.push(`/dogrulama?email=${encodeURIComponent(email)}`)
      }
    } catch (err) {
      console.error("Registration error:", err)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleRegister} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Hesap Oluştur</h1>
                <p className="text-muted-foreground text-balance">
                  Bandbul'a katıl ve ilanlarını paylaş
                </p>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="grid gap-3">
                <Label htmlFor="firstName">Ad</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Adınız"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="lastName">Soyad</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Soyadınız"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              
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
                <Label htmlFor="password">Parola</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Parolanızı girin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Parola Tekrar</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="Parolanızı tekrar girin"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="kvkk" 
                  checked={kvkkAccepted}
                  onCheckedChange={(checked) => setKvkkAccepted(checked as boolean)}
                  required 
                />
                <Label 
                  htmlFor="kvkk" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <a href="/kvkk" className="underline underline-offset-4 hover:text-primary">
                    KVKK Metni</a>'ni okudum ve kabul ediyorum.
                </Label>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Hesap Oluşturuluyor..." : "Hesap Oluştur"}
              </Button>
              
              
              <div className="text-center text-sm">
                Zaten hesabınız var mı?{" "}
                <a href="/giris" className="underline underline-offset-4">
                  Giriş yap
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
