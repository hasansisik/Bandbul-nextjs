"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/redux/hook"
import { 
  createListing, 
  updateListing, 
  deleteListing, 
  getAllCategories,
  getAllInstruments,
  getAllListings
} from "@/redux/actions/userActions"
import { uploadImageToCloudinary } from "@/utils/cloudinary"
import { toast } from "sonner"
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

function ListingsFormContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const editId = searchParams.get('id')
  const isEditing = !!editId
  
  const { categories, categoriesLoading, instruments, instrumentsLoading, allListings, listingsLoading, listingsError } = useAppSelector((state) => state.user)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    image: "",
    experience: "",
    instrument: ""
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [listing, setListing] = useState<any>(null)

  // Load categories, instruments and listings on component mount
  useEffect(() => {
    dispatch(getAllCategories({}))
    dispatch(getAllInstruments({}))
    dispatch(getAllListings({}))
  }, [dispatch])

  // Load listing data for editing
  useEffect(() => {
    if (isEditing && editId && allListings.length > 0) {
      const foundListing = allListings.find(l => l._id === editId)
      if (foundListing) {
        setListing(foundListing)
        setFormData({
          title: foundListing.title,
          description: foundListing.description,
          category: foundListing.category,
          location: foundListing.location,
          image: foundListing.image,
          experience: foundListing.experience || "",
          instrument: foundListing.instrument || ""
        })
      }
    }
  }, [editId, isEditing, allListings])

  // Error handling effect
  useEffect(() => {
    if (listingsError) {
      toast.error(listingsError)
    }
  }, [listingsError])

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const imageUrl = await uploadImageToCloudinary(file)
      setFormData(prev => ({ ...prev, image: imageUrl }))
          } catch (error) {
        console.error('Image upload error:', error)
        toast.error('Görsel yükleme başarısız. Lütfen tekrar deneyin.')
      } finally {
        setUploading(false)
      }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Form validation
    if (!formData.title.trim()) {
      toast.error("İlan başlığı gereklidir")
      return
    }
    if (!formData.description.trim()) {
      toast.error("İlan açıklaması gereklidir")
      return
    }
    if (!formData.category) {
      toast.error("Kategori seçimi gereklidir")
      return
    }
    if (!formData.location.trim()) {
      toast.error("Konum bilgisi gereklidir")
      return
    }
    if (!formData.experience) {
      toast.error("Deneyim seviyesi seçimi gereklidir")
      return
    }
    
    setLoading(true)
    
    const listingData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      location: formData.location.trim(),
      image: formData.image,
      experience: formData.experience,
      instrument: formData.instrument
    }
    
    try {
      if (isEditing && listing) {
        // Update existing listing
        const result = await dispatch(updateListing({
          id: listing._id,
          formData: listingData
        }))
        if (updateListing.fulfilled.match(result)) {
          toast.success("İlan başarıyla güncellendi!")
          router.replace("/dashboard/listings", { scroll: false })
        } else {
          // Error is already handled in the action
          return
        }
      } else {
        // Create new listing
        const result = await dispatch(createListing(listingData))
        if (createListing.fulfilled.match(result)) {
          toast.success("İlan başarıyla oluşturuldu!")
          router.replace("/dashboard/listings", { scroll: false })
        } else {
          // Error is already handled in the action
          return
        }
      }
    } catch (err) {
      console.error("Listing operation error:", err)
      toast.error("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (listing && confirm("Bu ilanı silmek istediğinizden emin misiniz?")) {
      try {
        await dispatch(deleteListing(listing._id))
                  toast.success("İlan silindi!")
        router.replace("/dashboard/listings", { scroll: false })
      } catch (err) {
        console.error("Delete listing error:", err)
                  toast.error("Silme işlemi başarısız. Lütfen tekrar deneyin.")
      }
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const experienceLevels = ["Başlangıç", "Orta", "İleri", "Profesyonel"]
  
  const turkishCities = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin",
    "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa",
    "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan",
    "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkâri", "Hatay", "Isparta",
    "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
    "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla",
    "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt",
    "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak",
    "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman",
    "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye",
    "Düzce"
  ]

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
                  <p className="text-gray-600 mb-2">Görsel eklemek için dosya seçin</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button 
                      variant="outline" 
                      className="cursor-pointer"
                      disabled={uploading}
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      {uploading ? "Yükleniyor..." : "Görsel Seç"}
                    </Button>
                  </label>
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
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={6}
                required
              />
            </CardContent>
          </Card>
        </div>

        {/* Sağ Sidebar - Her iki modda da aynı */}
        <div className="space-y-6">
          {/* Yayınla/Kaydet */}
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Kaydet" : "Yayınla"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={loading} onClick={handleSubmit}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Kaydediliyor..." : (isEditing ? "Güncelle" : "Yayınla")}
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
              {/* Kategori */}
              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                {categoriesLoading ? (
                  <div className="text-sm text-muted-foreground">Kategoriler yükleniyor...</div>
                ) : (
                  <div className="flex gap-2">
                    <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                      <SelectTrigger className="flex-1">
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
                    
                  </div>
                )}
              </div>

              {/* Enstrüman */}
              <div className="space-y-2">
                <Label htmlFor="instrument">Enstrüman</Label>
                {instrumentsLoading ? (
                  <div className="text-sm text-muted-foreground">Enstrümanlar yükleniyor...</div>
                ) : (
                  <Select value={formData.instrument} onValueChange={(value) => handleChange("instrument", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Enstrüman seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {instruments
                        .filter(inst => inst.active)
                        .map((instrument) => (
                          <SelectItem key={instrument._id} value={instrument._id}>
                            {instrument.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
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

              {/* Şehir */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Şehir *
                </Label>
                <Select value={formData.location} onValueChange={(value) => handleChange("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Şehir seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {turkishCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ListingsFormPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <ListingsFormContent />
    </Suspense>
  )
}
