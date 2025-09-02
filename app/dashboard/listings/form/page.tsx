"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { listingsData, ListingItem } from "@/lib/listingsData"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import { Checkbox } from "../../../../components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Badge } from "../../../../components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../../../components/ui/breadcrumb"
import { SidebarTrigger } from "../../../../components/ui/sidebar"
import { Save, Trash2, Image as ImageIcon, X, Plus, MapPin, Music, User } from "lucide-react"
import Link from "next/link"
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
} from "../../../../components/ui/alert-dialog"
import ListingsCategoryModal from "../../../../components/ListingsCategoryModal"

export default function ListingsFormPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const editId = searchParams.get('id')
  const isEditing = !!editId
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    image: "",
    author: "",
    experience: "",
    instrument: ""
  })

  const [loading, setLoading] = useState(false)
  const [listing, setListing] = useState<ListingItem | null>(null)
  const [categoriesList, setCategoriesList] = useState<string[]>([])

  useEffect(() => {
    // Kategorileri listingsData'dan al
    const categories = Array.from(new Set(listingsData.map(l => l.category)))
    setCategoriesList(categories)

    if (isEditing && editId) {
      const foundListing = listingsData.find(l => l.id === parseInt(editId))
      if (foundListing) {
        setListing(foundListing)
        setFormData({
          title: foundListing.title,
          description: foundListing.description,
          category: foundListing.category,
          location: foundListing.location,
          image: foundListing.image,
          author: foundListing.author,
          experience: foundListing.experience || "",
          instrument: foundListing.instrument || ""
        })
      }
    }
  }, [editId, isEditing])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    if (isEditing && listing) {
      // Güncelleme işlemi
      const updatedListing = {
        ...listing,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        image: formData.image,
        author: formData.author,
        experience: formData.experience,
        instrument: formData.instrument
      }

      // İlanı güncelle
      const listingIndex = listingsData.findIndex(l => l.id === listing.id)
      if (listingIndex !== -1) {
        listingsData[listingIndex] = updatedListing
      }

      console.log("Güncellenmiş ilan:", updatedListing)
      alert("İlan başarıyla güncellendi!")
    } else {
      // Yeni ekleme işlemi
      const newListing = {
        id: Date.now(),
        postedDate: "Şimdi",
        ...formData
      }

      // Yeni ilanı ekle
      listingsData.push(newListing)

      console.log("Yeni ilan:", newListing)
      alert("İlan başarıyla oluşturuldu!")
    }
    
    setLoading(false)
    router.replace("/dashboard/listings", { scroll: false })
  }

  const handleDelete = () => {
    if (listing && confirm("Bu ilanı silmek istediğinizden emin misiniz?")) {
      // İlanı sil
      const listingIndex = listingsData.findIndex(l => l.id === listing.id)
      if (listingIndex !== -1) {
        listingsData.splice(listingIndex, 1)
      }
      
      console.log("İlan silindi:", listing.id)
      alert("İlan silindi!")
      router.replace("/dashboard/listings", { scroll: false })
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const experienceLevels = ["Başlangıç", "Orta", "İleri", "Profesyonel"]
  const instrumentTypes = ["Gitar", "Piyano", "Davul", "Vokal", "Bas Gitar", "Klavye", "Trompet", "Keman", "Diğer"]

  return (
    <div className="space-y-6">
      {/* Header with Sidebar Toggle and Breadcrumb */}
      <div className="flex items-center gap-4 mb-6 mt-2">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/listings">İlanlar</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isEditing ? "Düzenle" : "Yeni İlan"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? "İlanı Düzenle" : "Yeni İlan"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing 
              ? `"${listing?.title}" ilanını düzenleyin` 
              : "Yeni bir müzik ilanı oluşturun"
            }
          </p>
        </div>
        {isEditing && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Sil
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>İlanı Sil</AlertDialogTitle>
                <AlertDialogDescription>
                  "{listing?.title}" başlıklı ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

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
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
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
              {formData.image ? (
                <div className="relative">
                  <img 
                    src={formData.image} 
                    alt="İlan görseli" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleChange("image", "")}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Görsel eklemek için URL girin</p>
                </div>
              )}
              <Input
                placeholder="Görsel URL'si girin..."
                value={formData.image}
                onChange={(e) => handleChange("image", e.target.value)}
              />
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
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={6}
                required
              />
            </CardContent>
          </Card>

          {/* Düzenleme sırasında sağdaki veriler solda gözüksün */}
          {isEditing && (
            <>
              {/* Genel Ayarlar */}
              <Card>
                <CardHeader>
                  <CardTitle>Genel Ayarlar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* İlan Sahibi */}
                  <div className="space-y-2">
                    <Label htmlFor="author" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      İlan Sahibi *
                    </Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => handleChange("author", e.target.value)}
                      placeholder="Adınız"
                      required
                    />
                  </div>



                  {/* Kategori */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori *</Label>
                    <div className="flex gap-2">
                      <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesList.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <ListingsCategoryModal
                        categories={categoriesList}
                        onCategoriesChange={setCategoriesList}
                        triggerButton={
                          <Button variant="outline" size="sm" className="px-3">
                            <Plus className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </div>
                  </div>

                  {/* Enstrüman */}
                  <div className="space-y-2">
                    <Label htmlFor="instrument">Enstrüman</Label>
                    <Select value={formData.instrument} onValueChange={(value) => handleChange("instrument", value)}>
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
                    <Select value={formData.experience} onValueChange={(value) => handleChange("experience", value)}>
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
                      Konum *
                    </Label>
                    <Input
                      id="location"
                      placeholder="Şehir, ilçe..."
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Sağ Sidebar - Sadece yeni ekleme sırasında gözüksün */}
        {!isEditing && (
          <div className="space-y-6">
            {/* Yayınla */}
            <Card>
              <CardHeader>
                <CardTitle>Yayınla</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={loading} onClick={handleSubmit}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Kaydediliyor..." : "Yayınla"}
                  </Button>
                  <Link href="/dashboard/listings">
                    <Button variant="outline">İptal</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Genel Ayarlar */}
            <Card>
              <CardHeader>
                <CardTitle>Genel Ayarlar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* İlan Sahibi */}
                <div className="space-y-2">
                  <Label htmlFor="author" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    İlan Sahibi *
                  </Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleChange("author", e.target.value)}
                    placeholder="Adınız"
                    required
                  />
                </div>



                {/* Kategori */}
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori *</Label>
                  <div className="flex gap-2">
                    <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesList.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <ListingsCategoryModal
                      categories={categoriesList}
                      onCategoriesChange={setCategoriesList}
                      triggerButton={
                        <Button variant="outline" size="sm" className="px-3">
                          <Plus className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                </div>

                {/* Enstrüman */}
                <div className="space-y-2">
                  <Label htmlFor="instrument">Enstrüman</Label>
                  <Select value={formData.instrument} onValueChange={(value) => handleChange("instrument", value)}>
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
                  <Select value={formData.experience} onValueChange={(value) => handleChange("experience", value)}>
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
              </CardContent>
            </Card>

            {/* Konum */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Konum
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Şehir, ilçe..."
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  required
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Düzenleme sırasında sağ tarafta sadece yayınla butonu */}
        {isEditing && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kaydet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={loading} onClick={handleSubmit}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Kaydediliyor..." : "Güncelle"}
                  </Button>
                  <Link href="/dashboard/listings">
                    <Button variant="outline">İptal</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
