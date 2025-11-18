"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { register, clearError } from "@/redux/actions/userActions"
import { useRouter } from "next/navigation"
import { GoogleAuthButton } from "@/components/GoogleAuthButton"

export function RegistrationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [kvkkAccepted, setKvkkAccepted] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.user)
  const router = useRouter()

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  // Password validation function
  const validatePassword = (password: string) => {
    const minLength = 5
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasSpecialChar = /[.,!]/.test(password)
    
    if (password.length < minLength) {
      return "Parola en az 5 karakter olmalıdır"
    }
    if (!hasUpperCase) {
      return "Parola en az bir büyük harf içermelidir"
    }
    if (!hasLowerCase) {
      return "Parola en az bir küçük harf içermelidir"
    }
    if (!hasSpecialChar) {
      return "Parola en az bir özel karakter (.,!) içermelidir"
    }
    return ""
  }

  // Clear errors when user starts typing
  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      dispatch(clearError())
    }
    setter(e.target.value)
  }

  // Handle password change with validation
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setPasswordError(validatePassword(newPassword))
    if (error) {
      dispatch(clearError())
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate password before submission
    const passwordValidationError = validatePassword(password)
    if (passwordValidationError) {
      setPasswordError(passwordValidationError)
      return
    }
    
    if (password !== confirmPassword) {
      return
    }

    try {
      const result = await dispatch(register({
        name: firstName,
        surname: lastName,
        email,
        password,
        birthDate: birthDate || undefined,
      }))
      
      if (register.fulfilled.match(result)) {
        // Clear any messages before navigating
        dispatch(clearError())
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
                  onChange={handleInputChange(setFirstName)}
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
                  onChange={handleInputChange(setLastName)}
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
                  onChange={handleInputChange(setEmail)}
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
                  onChange={handlePasswordChange}
                  required 
                  className={passwordError ? "border-red-500" : ""}
                />
                {passwordError && (
                  <p className="text-sm text-red-600">{passwordError}</p>
                )}
                <div className="text-xs text-muted-foreground">
                  Parola en az 5 karakter, büyük harf, küçük harf ve özel karakter (.,!) içermelidir
                </div>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Parola Tekrar</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="Parolanızı tekrar girin"
                  value={confirmPassword}
                  onChange={handleInputChange(setConfirmPassword)}
                  required 
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="birthDate">Doğum Tarihi</Label>
                <Input 
                  id="birthDate" 
                  type="date" 
                  value={birthDate}
                  onChange={handleInputChange(setBirthDate)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="kvkk" 
                  checked={kvkkAccepted}
                  onCheckedChange={(checked) => {
                    if (error) {
                      dispatch(clearError())
                    }
                    setKvkkAccepted(checked as boolean)
                  }}
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

              <GoogleAuthButton mode="register" className="w-full" />
              
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
