"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Bell
} from "lucide-react"
import { type ListingItem } from "@/lib/listingsData"

// Mock user data - in real app this would come from authentication/API
const mockUser = {
  id: 1,
  firstName: "Ahmet",
  lastName: "Yılmaz",
  email: "ahmet.yilmaz@email.com",
  phone: "+90 555 123 45 67",
  joinDate: "2024-01-15",
  location: "İstanbul, Türkiye",
  avatar: null, // Will be updated when user uploads profile picture
  bio: "Profesyonel müzik öğretmeni ve gitarist. 10+ yıllık deneyimle klasik ve modern müzik eğitimi veriyorum.",
  totalReviews: 127,
  totalListings: 3,
  skills: ["Gitar", "Piyano", "Müzik Teorisi", "Kompozisyon"],
  isOnline: true
}

// Mock user listings - matching ListingItem interface
const mockListings: ListingItem[] = [
  {
    id: 1,
    title: "Gitar Dersi - Başlangıç Seviyesi",
    description: "Temel gitar teknikleri ve akorlar öğretilir. Haftada 2 saat.",
    category: "Ders Veriyorum",
    location: "İstanbul",
    image: "/blogexample.jpg",
    author: "Ahmet Yılmaz",
    postedDate: "2 saat önce",
    experience: "İleri",
    instrument: "Gitar",
    type: "Ders Veriyorum"
  },
  {
    id: 2,
    title: "Piyano Dersi - Orta Seviye",
    description: "Klasik müzik ve modern parçalar üzerine çalışmalar.",
    category: "Ders Veriyorum",
    location: "İstanbul",
    image: "/blogexample.jpg",
    author: "Ahmet Yılmaz",
    postedDate: "1 gün önce",
    experience: "Profesyonel",
    instrument: "Piyano",
    type: "Ders Veriyorum"
  },
  {
    id: 3,
    title: "Rock Grubu için Gitarist Arıyoruz",
    description: "Deneyimli gitarist arıyoruz. Rock müzik yapmak istiyoruz.",
    category: "Grup Arıyorum",
    location: "İstanbul",
    image: "/blogexample.jpg",
    author: "Ahmet Yılmaz",
    postedDate: "3 gün önce",
    experience: "Orta",
    instrument: "Gitar",
    type: "Grup Arıyorum"
  }
]

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

const instruments = [
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
  const [userData, setUserData] = useState(mockUser)
  const [listings, setListings] = useState(mockListings)
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  // New listing form state
  const [newListing, setNewListing] = useState<Partial<ListingItem>>({
    title: "",
    description: "",
    category: "",
    location: "",
    experience: "",
    instrument: "",
    type: "",
    image: "/blogexample.jpg", // Default image
    author: `${userData.firstName} ${userData.lastName}`,
    postedDate: "Şimdi"
  })

  const handleEditProfile = () => {
    // Navigate to profile editing page
    window.location.href = '/profil-duzenle'
  }

  const handleSaveProfile = () => {
    // In real app, this would save to API
    setIsEditing(false)
  }

  const handleDeleteListing = (listingId: number) => {
    setListings(listings.filter(listing => listing.id !== listingId))
  }

  const handleToggleListingStatus = (listingId: number) => {
    // In real app, this would toggle the listing status in the database
    console.log("Toggle listing status:", listingId)
  }

  const handleCreateListing = () => {
    if (!newListing.title || !newListing.description || !newListing.category) {
      alert("Lütfen tüm gerekli alanları doldurun.")
      return
    }

    const listing: ListingItem = {
      id: Date.now(), // Simple ID generation
      title: newListing.title!,
      description: newListing.description!,
      category: newListing.category!,
      location: newListing.location || userData.location,
      image: newListing.image || "/blogexample.jpg",
      author: `${userData.firstName} ${userData.lastName}`,
      postedDate: "Şimdi",
      experience: newListing.experience || "Orta",
      instrument: newListing.instrument || "",
      type: newListing.type || newListing.category!
    }

    setListings([listing, ...listings])
    setNewListing({
      title: "",
      description: "",
      category: "",
      location: "",
      experience: "",
      instrument: "",
      type: "",
      image: "/blogexample.jpg",
      author: `${userData.firstName} ${userData.lastName}`,
      postedDate: "Şimdi"
    })
    setShowCreateForm(false)
  }

  const getStatusBadge = (listing: ListingItem) => {
    // For now, all listings are considered active
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
                {userData.skills.map((skill, index) => (
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
                  Yeni İlan Oluştur
                </Button>
              </div>
              {/* Create Listing Form */}
              {showCreateForm && (
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                  <h3 className="text-lg font-semibold text-card-foreground mb-6">Yeni İlan Oluştur</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium text-card-foreground">İlan Başlığı *</Label>
                        <Input 
                          id="title" 
                          placeholder="İlan başlığını girin" 
                          value={newListing.title}
                          onChange={(e) => setNewListing({...newListing, title: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium text-card-foreground">Kategori *</Label>
                        <Select 
                          value={newListing.category} 
                          onValueChange={(value) => setNewListing({...newListing, category: value, type: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Kategori seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instrument" className="text-sm font-medium text-card-foreground">Enstrüman</Label>
                        <Select 
                          value={newListing.instrument} 
                          onValueChange={(value) => setNewListing({...newListing, instrument: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Enstrüman seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {instruments.map((instrument) => (
                              <SelectItem key={instrument} value={instrument}>
                                {instrument}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-sm font-medium text-card-foreground">Deneyim Seviyesi</Label>
                        <Select 
                          value={newListing.experience} 
                          onValueChange={(value) => setNewListing({...newListing, experience: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Deneyim seviyesi" />
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
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-medium text-card-foreground">Konum</Label>
                        <Input 
                          id="location" 
                          placeholder="Konum" 
                          value={newListing.location}
                          onChange={(e) => setNewListing({...newListing, location: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="image" className="text-sm font-medium text-card-foreground">Görsel URL</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="image" 
                            placeholder="Görsel URL'si" 
                            value={newListing.image}
                            onChange={(e) => setNewListing({...newListing, image: e.target.value})}
                          />
                          <Button variant="outline" size="sm">
                            <Upload className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-card-foreground">Açıklama *</Label>
                      <Textarea 
                        id="description" 
                        placeholder="İlan açıklamasını detaylı bir şekilde girin" 
                        rows={4}
                        value={newListing.description}
                        onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                        İptal
                      </Button>
                      <Button onClick={handleCreateListing} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        İlan Oluştur
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {/* Listings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                    <div className="relative">
                      <img 
                        src={listing.image} 
                        alt={listing.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-background/90 text-foreground border-0 shadow-sm">
                          {listing.category}
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
                          {listing.postedDate}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleToggleListingStatus(listing.id)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Düzenle
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {/* View functionality */}}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="hover:bg-destructive/10 hover:border-destructive hover:text-destructive"
                          onClick={() => handleDeleteListing(listing.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {listings.length === 0 && (
                <div className="bg-card rounded-xl p-12 text-center border border-border shadow-sm">
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
  )
}
