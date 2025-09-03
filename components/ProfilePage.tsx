"use client"

import { useState, useEffect, useRef } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hook"
import { getUserListings, createListing, updateListing, deleteListing, toggleListingStatus, getAllCategories } from "@/redux/actions/userActions"
import { toast } from "sonner"
import { uploadImageToCloudinary } from "@/utils/cloudinary"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Edit, 
  Plus, 
  Trash2, 
  Eye, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  Upload, 
  Users,
  Award,
  Clock,
  MessageCircle,
  Settings,
  User,
  Briefcase,
  Share2,
  Bell,
  Music,
  ImageIcon,
  X,
  Save
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Default user data structure
const defaultUser = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  joinDate: "",
  location: "Türkiye",
  avatar: null,
  bio: "Henüz bir biyografi eklenmemiş.",
  totalReviews: 0,
  totalListings: 0,
  skills: ["Müzik"],
  isOnline: false
}

// Available categories and types based on existing data
const categories = [
  "Müzisyen Arıyorum",
  "Ders Veriyorum", 
  "Ders Almak İstiyorum",
  "Grup Arıyorum",
  "Enstrüman Satıyorum",
  "Stüdyo Kiralıyorum"
]

const experienceLevels = [
  "Başlangıç",
  "Orta", 
  "İleri",
  "Profesyonel"
]

const instrumentTypes = [
  "Gitar",
  "Piyano",
  "Davul",
  "Bas Gitar",
  "Vokal",
  "Trompet",
  "Klavye",
  "Keman",
  "Saksafon",
  "Flüt",
  "Diğer"
]

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingListing, setEditingListing] = useState<any>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [operationMessage, setOperationMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const dispatch = useAppDispatch()
  
  // Function to show operation messages and auto-clear them
  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setOperationMessage({ type, text })
    // Auto-clear message after 5 seconds
    setTimeout(() => {
      setOperationMessage(null)
    }, 5000)
  }
  
  // Get user data and listings from Redux
  const { user, userListings, listingsLoading, categories, categoriesLoading } = useAppSelector((state) => state.user)
  
  // Transform Redux user data to component format
  const userData = user ? {
    firstName: user.name || "",
    lastName: user.surname || "",
    email: user.email || "",
    phone: user.profile?.phoneNumber || "",
    joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : "",
    location: user.address?.city || "Türkiye",
    avatar: user.profile?.picture || null,
    bio: user.profile?.bio || "Henüz bir biyografi eklenmemiş.",
    totalReviews: 0, // Will come from API later
    totalListings: userListings.length,
    skills: user.profile?.skills || ["Müzik"],
    isOnline: true
  } : defaultUser
  
  // New listing form state
  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    experience: "",
    instrument: "",
    image: ""
  })

  // Load user listings and categories on component mount
  useEffect(() => {
    if (user) {
      dispatch(getUserListings())
      dispatch(getAllCategories({}))
    }
  }, [dispatch, user])

  // Debug: Monitor userListings changes
  useEffect(() => {
    console.log("userListings changed:", userListings.length, userListings)
  }, [userListings])

  const handleEditProfile = () => {
    // Navigate to profile editing page
    window.location.href = '/profil-duzenle'
  }

  const handleSaveProfile = () => {
    // In real app, this would save to API
    setIsEditing(false)
  }

  const handleEditListing = (listing: any) => {
    setEditingListing(listing)
    setNewListing({
      title: listing.title,
      description: listing.description,
      category: listing.category,
      location: listing.location,
      experience: listing.experience || "Orta",
      instrument: listing.instrument || "",
      image: listing.image
    })
    setShowCreateForm(true)
  }

  const handleViewListing = (listing: any) => {
    // Navigate to listing detail page
    window.location.href = `/ilan-detay/${listing._id}`
  }

  const handleCancelEdit = () => {
    setEditingListing(null)
    setNewListing({
      title: "",
      description: "",
      category: "",
      location: "",
      experience: "",
      instrument: "",
      image: ""
    })
    setShowCreateForm(false)
  }

  const handleDeleteListing = async (listingId: string) => {
    try {
      const result = await dispatch(deleteListing(listingId))
      if (deleteListing.fulfilled.match(result)) {
        showMessage('success', "İlan başarıyla silindi.")
        // Refresh listings
        dispatch(getUserListings())
      } else if (deleteListing.rejected.match(result)) {
        const errorMessage = typeof result.payload === 'string' ? result.payload : "İlan silinirken bir hata oluştu."
        showMessage('error', errorMessage)
      }
    } catch (err) {
      console.error("Delete listing error:", err)
      showMessage('error', "İlan silinirken bir hata oluştu.")
    }
  }

  const handleToggleListingStatus = async (listingId: string) => {
    try {
      const result = await dispatch(toggleListingStatus(listingId))
      if (toggleListingStatus.fulfilled.match(result)) {
        showMessage('success', "İlan durumu başarıyla değiştirildi.")
        // Refresh listings
        dispatch(getUserListings())
      } else if (toggleListingStatus.rejected.match(result)) {
        const errorMessage = typeof result.payload === 'string' ? result.payload : "İlan durumu değiştirilirken bir hata oluştu."
        showMessage('error', errorMessage)
      }
    } catch (err) {
      console.error("Toggle listing status error:", err)
      showMessage('error', "İlan durumu değiştirilirken bir hata oluştu.")
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Lütfen geçerli bir resim dosyası seçin.")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Resim dosyası 5MB'dan küçük olmalıdır.")
      return
    }

    setImageUploading(true)
    try {
      const imageUrl = await uploadImageToCloudinary(file)
      setNewListing({ ...newListing, image: imageUrl })
      showMessage('success', "Görsel başarıyla yüklendi!")
    } catch (error) {
      console.error("Image upload error:", error)
      showMessage('error', "Görsel yüklenirken bir hata oluştu.")
    } finally {
      setImageUploading(false)
    }
  }

  const handleCreateListing = async () => {
    if (!newListing.title || !newListing.description || !newListing.category) {
      showMessage('error', "Lütfen tüm gerekli alanları doldurun.")
      return
    }

    try {
      const listingData = {
        title: newListing.title,
        description: newListing.description,
        category: newListing.category,
        location: newListing.location || userData.location,
        image: newListing.image || "/blogexample.jpg",
        experience: newListing.experience || "Orta",
        instrument: newListing.instrument || ""
      }

      if (editingListing) {
        // Update existing listing
        console.log("Updating listing with data:", listingData)
        const result = await dispatch(updateListing({
          id: editingListing._id,
          formData: listingData
        }))
        
        if (updateListing.fulfilled.match(result)) {
          console.log("Listing updated successfully:", result.payload)
          showMessage('success', "İlan başarıyla güncellendi!")
          handleCancelEdit()
          dispatch(getUserListings())
        } else if (updateListing.rejected.match(result)) {
          const errorMessage = typeof result.payload === 'string' ? result.payload : "İlan güncellenirken bir hata oluştu."
          showMessage('error', errorMessage)
        }
      } else {
        // Create new listing
        console.log("Creating listing with data:", listingData)
        const result = await dispatch(createListing(listingData))
        
        if (createListing.fulfilled.match(result)) {
          console.log("Listing created successfully:", result.payload)
          console.log("Current userListings before refresh:", userListings.length)
          
          showMessage('success', "İlan başarıyla oluşturuldu!")
          handleCancelEdit()
          dispatch(getUserListings())
        } else if (createListing.rejected.match(result)) {
          const errorMessage = typeof result.payload === 'string' ? result.payload : "İlan oluşturulurken bir hata oluştu."
          showMessage('error', errorMessage)
        }
      }
    } catch (err) {
      console.error("Listing operation error:", err)
      showMessage('error', editingListing ? "İlan güncellenirken bir hata oluştu." : "İlan oluşturulurken bir hata oluştu.")
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId)
    return category ? category.name : "Bilinmeyen Kategori"
  }

  const getStatusBadge = (listing: any) => {
    if (listing.status === 'inactive') {
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Pasif</Badge>
    }
    return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Aktif</Badge>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {userData.avatar ? (
                    <img 
                      src={userData.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-foreground text-xl font-bold">
                      {userData.firstName[0]}{userData.lastName[0]}
                    </span>
                  )}
                </div>
                {userData.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-background rounded-full"></div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {userData.firstName} {userData.lastName}
                </h1>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>•</span>
                  <span>{userData.location}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-border hover:bg-accent"
                onClick={() => window.location.href = '/mesajlar'}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Mesajlar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-border hover:bg-accent"
                onClick={() => window.location.href = '/bildirimler'}
              >
                <Bell className="w-4 h-4 mr-2" />
                Bildirimler
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleEditProfile}>
                <Settings className="w-4 h-4 mr-2" />
                Düzenle
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Operation Messages Display */}
      {operationMessage && (
        <div className="container mx-auto px-4 max-w-7xl mb-4">
          <div className={`p-4 rounded-lg border ${
            operationMessage.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
              : operationMessage.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
              : 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {operationMessage.type === 'success' && (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {operationMessage.type === 'error' && (
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {operationMessage.type === 'info' && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <span className="font-medium">{operationMessage.text}</span>
              </div>
              <button
                onClick={() => setOperationMessage(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Stats */}
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h3 className="font-semibold text-card-foreground mb-4">Profil İstatistikleri</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 text-muted-foreground mr-3" />
                    <span className="text-sm text-muted-foreground">Toplam İlan</span>
                  </div>
                  <span className="font-semibold text-card-foreground">{userData.totalListings}</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h3 className="font-semibold text-card-foreground mb-4">Yetenekler</h3>
              <div className="flex flex-wrap gap-2">
                {userData.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Bio Section */}
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h2 className="text-xl font-semibold text-card-foreground mb-4">Hakkımda</h2>
              <p className="text-muted-foreground leading-relaxed">{userData.bio}</p>
            </div>

            {/* Listings Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">İlanlarım</h2>
                <Button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  {editingListing ? "İlanı Düzenle" : "Yeni İlan Oluştur"}
                </Button>
              </div>
              
              {/* Create Listing Form */}
              {showCreateForm && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Ana İçerik Alanı - Sol Taraf */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Başlık */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Music className="h-5 w-5" />
                          İlan Başlığı
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Input
                          placeholder="İlan başlığı..."
                          value={newListing.title}
                          onChange={(e) => setNewListing({...newListing, title: e.target.value})}
                          className="text-xl font-medium"
                          required
                        />
                      </CardContent>
                    </Card>

                    {/* Görsel Alanı */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ImageIcon className="h-5 w-5" />
                          Görsel
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {newListing.image ? (
                          <div className="relative">
                            <img 
                              src={newListing.image} 
                              alt="İlan görseli" 
                              className="w-full h-64 object-cover rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setNewListing({...newListing, image: ""})}
                              className="absolute top-2 right-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                                                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-600 mb-2">Görsel yüklemek için tıklayın</p>
                              <p className="text-sm text-gray-500 mb-4">PNG, JPG, GIF (max 5MB)</p>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                              <Button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={imageUploading}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              >
                                {imageUploading ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Yükleniyor...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Görsel Seç
                                  </>
                                )}
                              </Button>
                            </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Açıklama */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Açıklama</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="İlan detaylarını yazın..."
                          value={newListing.description}
                          onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                          rows={6}
                          required
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sağ Sidebar */}
                  <div className="space-y-6">
                    {/* Yayınla/Kaydet */}
                    <Card>
                      <CardHeader>
                        <CardTitle>{editingListing ? "Kaydet" : "Yayınla"}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-2">
                          <Button onClick={handleCreateListing} className="flex-1">
                            <Save className="h-4 w-4 mr-2" />
                            {editingListing ? "Güncelle" : "İlan Oluştur"}
                          </Button>
                          <Button variant="outline" onClick={handleCancelEdit}>
                            İptal
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Genel Ayarlar */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Genel Ayarlar</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Kategori */}
                        <div className="space-y-2">
                          <Label htmlFor="category">Kategori *</Label>
                          {categoriesLoading ? (
                            <div className="text-sm text-muted-foreground">Kategoriler yükleniyor...</div>
                          ) : (
                            <Select value={newListing.category} onValueChange={(value) => setNewListing({...newListing, category: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Kategori seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories
                                  .filter(cat => cat.active)
                                  .map((category) => (
                                    <SelectItem key={category._id} value={category._id}>
                                      {category.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>

                        {/* Enstrüman */}
                        <div className="space-y-2">
                          <Label htmlFor="instrument">Enstrüman</Label>
                          <Select value={newListing.instrument} onValueChange={(value) => setNewListing({...newListing, instrument: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Enstrüman seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {instrumentTypes.map((instrument) => (
                                <SelectItem key={instrument} value={instrument}>
                                  {instrument}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Deneyim Seviyesi */}
                        <div className="space-y-2">
                          <Label htmlFor="experience">Deneyim Seviyesi</Label>
                          <Select value={newListing.experience} onValueChange={(value) => setNewListing({...newListing, experience: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Deneyim seviyesi seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {experienceLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Konum */}
                        <div className="space-y-2">
                          <Label htmlFor="location" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Konum
                          </Label>
                          <Input
                            id="location"
                            placeholder="Şehir, ilçe..."
                            value={newListing.location}
                            onChange={(e) => setNewListing({...newListing, location: e.target.value})}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              
              {/* Listings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listingsLoading ? (
                  <div className="col-span-full text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">İlanlar yükleniyor...</p>
                  </div>
                ) : userListings.length > 0 ? (
                  userListings.map((listing) => (
                    <div key={listing._id} className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                      <div className="relative">
                        <img 
                          src={listing.image} 
                          alt={listing.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-background/90 text-foreground border-0 shadow-sm">
                            {getCategoryName(listing.category)}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          {getStatusBadge(listing)}
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-muted-foreground transition-colors">
                          {listing.title}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          {listing.location}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {listing.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {listing.experience}
                            </Badge>
                            {listing.instrument && (
                              <Badge variant="secondary" className="text-xs">
                                {listing.instrument}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3 mr-1" />
                            {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('tr-TR') : 'Yeni'}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                {listing.status === 'active' ? 'Pasif Yap' : 'Aktif Yap'}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>İlan Durumunu Değiştir</AlertDialogTitle>
                                <AlertDialogDescription>
                                  "{listing.title}" başlıklı ilanın durumunu {listing.status === 'active' ? 'pasif' : 'aktif'} yapmak istediğinizden emin misiniz?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleToggleListingStatus(listing._id)}
                                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                  {listing.status === 'active' ? 'Pasif Yap' : 'Aktif Yap'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditListing(listing)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewListing(listing)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="hover:bg-destructive/10 hover:border-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>İlanı Sil</AlertDialogTitle>
                                <AlertDialogDescription>
                                  "{listing.title}" başlıklı ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteListing(listing._id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Sil
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-card rounded-xl p-12 text-center border border-border shadow-sm">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">Henüz hiç ilanınız yok</h3>
                    <p className="text-muted-foreground mb-6">İlk ilanınızı oluşturarak başlayın ve müşterilerinizle buluşun.</p>
                    <Button onClick={() => setShowCreateForm(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" />
                      İlk İlanınızı Oluşturun
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
