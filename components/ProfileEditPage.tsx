"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save, X, Plus, Upload, User } from "lucide-react"

// Mock user data - in real app this would come from authentication/API
interface UserData {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  joinDate: string
  location: string
  bio: string
  skills: string[]
  avatar: string | null
}

const mockUser: UserData = {
  id: 1,
  firstName: "Ahmet",
  lastName: "Yılmaz",
  email: "ahmet.yilmaz@email.com",
  phone: "+90 555 123 45 67",
  joinDate: "2024-01-15",
  location: "İstanbul, Türkiye",
  bio: "Profesyonel müzik öğretmeni ve gitarist. 10+ yıllık deneyimle klasik ve modern müzik eğitimi veriyorum.",
  skills: ["Gitar", "Piyano", "Müzik Teorisi", "Kompozisyon"],
  avatar: null // Will store uploaded image URL
}

export function ProfileEditPage() {
  const [userData, setUserData] = useState<UserData>(mockUser)
  const [newSkill, setNewSkill] = useState("")

  const handleSave = () => {
    // In real app, this would save to API
    alert("Profil başarıyla güncellendi!")
    window.location.href = '/profil'
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In real app, this would upload to server and get URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setUserData({...userData, avatar: e.target?.result as string})
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !userData.skills.includes(newSkill.trim())) {
      setUserData({
        ...userData,
        skills: [...userData.skills, newSkill.trim()]
      })
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setUserData({
      ...userData,
      skills: userData.skills.filter(skill => skill !== skillToRemove)
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSkill()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/profil'}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri Dön
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Profil Düzenle</h1>
                <p className="text-muted-foreground">Kişisel bilgilerinizi ve yeteneklerinizi güncelleyin</p>
              </div>
            </div>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Save className="w-4 h-4 mr-2" />
              Kaydet
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Profile Picture */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h2 className="text-xl font-semibold text-card-foreground mb-6">Profil Resmi</h2>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {userData.avatar ? (
                    <img 
                      src={userData.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar" className="text-sm font-medium text-card-foreground">
                  Profil resmi yükle
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('avatar')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Resim Seç
                  </Button>
                  {userData.avatar && (
                    <Button 
                      variant="outline" 
                      onClick={() => setUserData({...userData, avatar: null})}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                      Kaldır
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG veya GIF formatında, maksimum 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h2 className="text-xl font-semibold text-card-foreground mb-6">Kişisel Bilgiler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-card-foreground">Ad</Label>
                <Input
                  id="firstName"
                  value={userData.firstName}
                  onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-card-foreground">Soyad</Label>
                <Input
                  id="lastName"
                  value={userData.lastName}
                  onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-card-foreground">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-card-foreground">Telefon</Label>
                <Input
                  id="phone"
                  value={userData.phone}
                  onChange={(e) => setUserData({...userData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location" className="text-sm font-medium text-card-foreground">Konum</Label>
                <Input
                  id="location"
                  value={userData.location}
                  onChange={(e) => setUserData({...userData, location: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* About Me */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h2 className="text-xl font-semibold text-card-foreground mb-6">Hakkımda</h2>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium text-card-foreground">Kendinizi tanıtın</Label>
              <Textarea
                id="bio"
                value={userData.bio}
                onChange={(e) => setUserData({...userData, bio: e.target.value})}
                rows={4}
                placeholder="Deneyimlerinizi, uzmanlık alanlarınızı ve müzik geçmişinizi anlatın..."
              />
            </div>
          </div>

          {/* Skills */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h2 className="text-xl font-semibold text-card-foreground mb-6">Yetenekler</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Yeni yetenek ekleyin..."
                />
                <Button 
                  onClick={handleAddSkill}
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {userData.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-sm px-3 py-1 flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
