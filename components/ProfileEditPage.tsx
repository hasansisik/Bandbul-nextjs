"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { editProfile, loadUser, getAllInstruments } from "@/redux/actions/userActions"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, X, Plus, Upload, User, Loader2 } from "lucide-react"
import { uploadImageToCloudinary } from "@/utils/cloudinary"

// User data interface for editing
interface UserData {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  bio: string
  skills: string[]
  avatar: string | null
}

export function ProfileEditPage() {
  const [newSkill, setNewSkill] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user, loading, instruments, instrumentsLoading } = useAppSelector((state) => state.user)
  
  // Transform Redux user data to component format
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: [],
    avatar: null
  })
  
  // Initialize userData when user data is available
  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.name || "",
        lastName: user.surname || "",
        email: user.email || "",
        phone: user.profile?.phoneNumber || "",
        location: user.address?.city || "Türkiye",
        bio: user.profile?.bio || "",
        skills: user.profile?.skills || [],
        avatar: user.profile?.picture || null
      })
    }
  }, [user])

  // Load instruments on component mount
  useEffect(() => {
    dispatch(getAllInstruments({}))
  }, [dispatch])

  const handleSave = async () => {
    if (!user) return
    
    setIsLoading(true)
    
    try {
      const result = await dispatch(editProfile({
        name: userData.firstName,
        email: userData.email,
        password: "", // Not changing password
        address: {
          city: userData.location,
          state: user.address?.state || "",
          street: user.address?.street || "",
          postalCode: user.address?.postalCode || "",
          country: user.address?.country || "Turkey"
        },
        phoneNumber: userData.phone,
        picture: userData.avatar || undefined,
        bio: userData.bio,
        skills: userData.skills
      }))
      
      if (editProfile.fulfilled.match(result)) {
        // Reload user data to get updated information
        await dispatch(loadUser())
        router.push('/profil')
      }
    } catch (err) {
      console.error("Profile update error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      try {
        // Upload to Cloudinary
        const imageUrl = await uploadImageToCloudinary(file)
        setUserData({...userData, avatar: imageUrl})
      } catch (error) {
        console.error('Image upload error:', error)
        alert('Resim yüklenirken bir hata oluştu. Lütfen tekrar deneyin.')
      } finally {
        setIsUploading(false)
      }
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
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
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
                  {isUploading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : userData.avatar ? (
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
                    disabled={isUploading}
                    className="flex items-center gap-2"
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {isUploading ? "Yükleniyor..." : "Resim Seç"}
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
