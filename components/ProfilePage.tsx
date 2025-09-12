"use client"

import { useState, useEffect, useRef } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hook"
import { useSearchParams } from "next/navigation"
import { getUserListings, createListing, updateListing, deleteListing, getAllCategories, getAllInstruments, loadUser } from "@/redux/actions/userActions"
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
import { Skeleton } from "@/components/ui/skeleton"
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
  Save,
  AlertCircle,
  Archive,
  Clock3
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
import { RejectionReasonModal } from "@/components/RejectionReasonModal"
import { ListingRulesDialog } from "@/components/ListingRulesDialog"

// Skeleton components for loading states
const ProfileHeaderSkeleton = () => (
  <div className="bg-background border-b border-border">
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  </div>
)

const ProfileStatsSkeleton = () => (
  <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
    <Skeleton className="h-6 w-32 mb-4" />
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Skeleton className="w-5 h-5 mr-3" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-8" />
      </div>
    </div>
  </div>
)

const SkillsSkeleton = () => (
  <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
    <Skeleton className="h-6 w-20 mb-4" />
    <div className="flex flex-wrap gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-14 rounded-full" />
    </div>
  </div>
)

const BioSkeleton = () => (
  <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
    <Skeleton className="h-6 w-24 mb-4" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
)

const ListingsGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <Skeleton className="w-full h-48" />
        <div className="p-5">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-3" />
          <div className="space-y-2 mb-4">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    ))}
  </div>
)


const experienceLevels = [
  "Başlangıç",
  "Orta", 
  "İleri",
  "Profesyonel"
]

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


export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingListing, setEditingListing] = useState<any>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [operationMessage, setOperationMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false)
  const [selectedRejectedListing, setSelectedRejectedListing] = useState<any>(null)
  const [listingRulesDialogOpen, setListingRulesDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [showFormTimer, setShowFormTimer] = useState<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  
  // Function to show operation messages and auto-clear them
  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setOperationMessage({ type, text })
    
    // Scroll to top when error occurs
    if (type === 'error') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    
    // Auto-clear message after 5 seconds
    setTimeout(() => {
      setOperationMessage(null)
    }, 5000)
  }
  
  // Get user data and listings from Redux
  const { user, userListings, listingsLoading, categories, categoriesLoading, instruments, instrumentsLoading, loading } = useAppSelector((state) => state.user)
  
  // Transform Redux user data to component format
  const userData = user && user.name ? {
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
  } : null
  
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

  // Load user data, listings, categories and instruments on component mount
  useEffect(() => {
    // First, try to load user data if not already loaded
    const token = localStorage.getItem("accessToken")
    if (token && !user) {
      dispatch(loadUser())
    }
    
    // Then load other data if user is available
    if (user) {
      dispatch(getUserListings())
      dispatch(getAllCategories({}))
      dispatch(getAllInstruments({}))
    }
  }, [dispatch, user])


  // Check URL parameters for tab and action
  useEffect(() => {
    const tab = searchParams.get('tab')
    const action = searchParams.get('action')
    
    if (tab === 'listings' && action === 'create') {
      setShowCreateForm(true)
    }
  }, [searchParams])

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (showFormTimer) {
        clearTimeout(showFormTimer)
      }
    }
  }, [showFormTimer])

  const handleEditProfile = () => {
    // Navigate to profile editing page
    window.location.href = '/profil-duzenle'
  }

  const handleCreateListingClick = () => {
    setShowCreateForm(true)
    // Start timer to show modal after 3 seconds
    const timer = setTimeout(() => {
      setListingRulesDialogOpen(true)
    }, 3000)
    setShowFormTimer(timer)
  }

  const handleApproveRules = () => {
    setListingRulesDialogOpen(false)
  }

  const handleCloseRules = () => {
    setListingRulesDialogOpen(false)
    // Close form when modal is cancelled
    setShowCreateForm(false)
    // Clear timer if it exists
    if (showFormTimer) {
      clearTimeout(showFormTimer)
      setShowFormTimer(null)
    }
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

  // Function to create title slug for URL
  const createTitleSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  const handleViewListing = (listing: any) => {
    // If listing is rejected, show rejection reason modal
    if (listing.status === 'rejected') {
      setSelectedRejectedListing(listing)
      setRejectionModalOpen(true)
      return
    }
    
    // Navigate to listing detail page using title slug
    window.location.href = `/ilan-detay/${createTitleSlug(listing.title)}`
  }

  const handleCancelEdit = () => {
    // Clear timer if it exists
    if (showFormTimer) {
      clearTimeout(showFormTimer)
      setShowFormTimer(null)
    }
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

  const handleArchiveListing = async (listingId: string) => {
    try {
      const result = await dispatch(updateListing({
        id: listingId,
        formData: { status: 'archived' }
      }))
      if (updateListing.fulfilled.match(result)) {
        showMessage('success', "İlan başarıyla arşivlendi.")
        dispatch(getUserListings())
      } else if (updateListing.rejected.match(result)) {
        const errorMessage = typeof result.payload === 'string' ? result.payload : "İlan arşivlenirken bir hata oluştu."
        showMessage('error', errorMessage)
      }
    } catch (err) {
      console.error("Archive listing error:", err)
      showMessage('error', "İlan arşivlenirken bir hata oluştu.")
    }
  }

  const handleSetPendingListing = async (listingId: string) => {
    try {
      const result = await dispatch(updateListing({
        id: listingId,
        formData: { status: 'pending' }
      }))
      if (updateListing.fulfilled.match(result)) {
        showMessage('success', "İlan onay bekliyor durumuna alındı.")
        dispatch(getUserListings())
      } else if (updateListing.rejected.match(result)) {
        const errorMessage = typeof result.payload === 'string' ? result.payload : "İlan durumu değiştirilirken bir hata oluştu."
        showMessage('error', errorMessage)
      }
    } catch (err) {
      console.error("Set pending listing error:", err)
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
        location: newListing.location || userData?.location || "Türkiye",
        image: newListing.image || "/blogexample.jpg",
        experience: newListing.experience || "Orta",
        instrument: newListing.instrument || "",
        status: 'pending' // Yeni ilanlar ve güncellemeler onay bekliyor durumuna gider
      }

      if (editingListing) {
        // Update existing listing
        const result = await dispatch(updateListing({
          id: editingListing._id,
          formData: listingData
        }))
        
        if (updateListing.fulfilled.match(result)) {
          showMessage('success', "İlan başarıyla güncellendi ve onay bekliyor durumuna alındı!")
          handleCancelEdit()
          dispatch(getUserListings())
        } else if (updateListing.rejected.match(result)) {
          const errorMessage = typeof result.payload === 'string' ? result.payload : "İlan güncellenirken bir hata oluştu."
          showMessage('error', errorMessage)
        }
      } else {
        // Create new listing
        const result = await dispatch(createListing(listingData))
        
        if (createListing.fulfilled.match(result)) {
          showMessage('success', "İlan başarıyla oluşturuldu ve onay bekliyor durumuna alındı!")
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

  const getInstrumentName = (instrumentId: string) => {
    const instrument = instruments.find(inst => inst._id === instrumentId)
    return instrument ? instrument.name : "Bilinmeyen Enstrüman"
  }

  const getStatusBadge = (listing: any) => {
    switch (listing.status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Aktif</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Onay Bekliyor</Badge>
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Arşivlenen</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Reddedilen</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Bilinmiyor</Badge>
    }
  }

  const getStatusBorderColor = (listing: any) => {
    switch (listing.status) {
      case 'active':
        return 'border-green-200 dark:border-green-800'
      case 'pending':
        return 'border-yellow-200 dark:border-yellow-800'
      case 'archived':
        return 'border-gray-200 dark:border-gray-800'
      case 'rejected':
        return 'border-red-200 dark:border-red-800'
      default:
        return 'border-border'
    }
  }

  // Filter listings based on active tab
  const getFilteredListings = () => {
    if (activeTab === 'all') {
      return userListings
    }
    return userListings.filter(listing => {
      switch (activeTab) {
        case 'archived':
          return listing.status === 'archived'
        case 'pending':
          return listing.status === 'pending'
        case 'active':
          return listing.status === 'active'
        default:
          return true
      }
    })
  }

  // Get count for each tab
  const getTabCounts = () => {
    return {
      all: userListings.length,
      archived: userListings.filter(l => l.status === 'archived').length,
      pending: userListings.filter(l => l.status === 'pending').length,
      active: userListings.filter(l => l.status === 'active').length
    }
  }

  // Show loading skeleton if user data is not loaded yet
  if (loading || !user || !userData) {
    return (
      <div className="min-h-screen bg-background">
        <ProfileHeaderSkeleton />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Skeletons */}
            <div className="lg:col-span-1 space-y-6">
              <ProfileStatsSkeleton />
              <SkillsSkeleton />
            </div>
            {/* Main Content Skeletons */}
            <div className="lg:col-span-3 space-y-6">
              <BioSkeleton />
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-9 w-32" />
                </div>
                <ListingsGridSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header - Responsive */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Profile Info */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {userData.avatar ? (
                    <img 
                      src={userData.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-foreground text-lg sm:text-xl font-bold">
                      {userData.firstName[0]}{userData.lastName[0]}
                    </span>
                  )}
                </div>
                {userData.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 border-2 border-background rounded-full"></div>
                )}
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-foreground">
                  {userData.firstName} {userData.lastName}
                </h1>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                  <span>•</span>
                  <span>{userData.location}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons - Responsive */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex gap-2 sm:gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-border hover:bg-accent flex-1 sm:flex-none text-xs sm:text-sm"
                  onClick={() => window.location.href = '/mesajlar'}
                >
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Mesajlar</span>
                  <span className="sm:hidden">Mesaj</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-border hover:bg-accent flex-1 sm:flex-none text-xs sm:text-sm"
                  onClick={() => window.location.href = '/bildirimler'}
                >
                  <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Bildirimler</span>
                  <span className="sm:hidden">Bildirim</span>
                </Button>
              </div>
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm"
                onClick={handleEditProfile}
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Profil Düzenle</span>
                <span className="sm:hidden">Profil Düzenle</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Operation Messages Display */}
      {operationMessage && (
        <div className="container mx-auto px-4 max-w-7xl mt-6 mb-4">
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
                  <Badge key={index} variant="secondary" className="text-xs px-4 py-2 rounded-full">
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
              {/* Header with button - always visible */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">İlanlarım</h2>
                <Button onClick={editingListing ? () => setShowCreateForm(!showCreateForm) : handleCreateListingClick} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  {editingListing ? "İlanı Düzenle" : "Yeni İlan Oluştur"}
                </Button>
              </div>

              {/* Status Tabs - Show above form when form is closed, below form when form is open */}
              {!showCreateForm && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'all'
                        ? 'bg-foreground text-background'
                        : 'bg-background text-foreground border border-border hover:bg-accent'
                    }`}
                  >
                    Tümü ({getTabCounts().all})
                  </button>
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'active'
                        ? 'bg-foreground text-background'
                        : 'bg-background text-foreground border border-border hover:bg-accent'
                    }`}
                  >
                    Yayında ({getTabCounts().active})
                  </button>
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'pending'
                        ? 'bg-foreground text-background'
                        : 'bg-background text-foreground border border-border hover:bg-accent'
                    }`}
                  >
                    Beklemede ({getTabCounts().pending})
                  </button>
                  <button
                    onClick={() => setActiveTab('archived')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'archived'
                        ? 'bg-foreground text-background'
                        : 'bg-background text-foreground border border-border hover:bg-accent'
                    }`}
                  >
                    Arşiv ({getTabCounts().archived})
                  </button>
                </div>
              )}
              
              {/* Create Listing Form - Shows when form is open */}
              {showCreateForm && (
                <div className="space-y-6">
                  {/* Form Header with Close Button */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-foreground">
                      {editingListing ? "İlanı Düzenle" : "Yeni İlan Oluştur"}
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleCancelEdit}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
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

                  {/* Sağ Sidebar - Desktop Order */}
                  <div className="hidden lg:block space-y-6">
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
                          {instrumentsLoading ? (
                            <div className="text-sm text-muted-foreground">Enstrümanlar yükleniyor...</div>
                          ) : (
                            <Select value={newListing.instrument} onValueChange={(value) => setNewListing({...newListing, instrument: value})}>
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

                        {/* Şehir */}
                        <div className="space-y-2">
                          <Label htmlFor="location" className="flex items-center gap-2">
                            Şehir
                          </Label>
                          <Select value={newListing.location} onValueChange={(value) => setNewListing({...newListing, location: value})}>
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

                  {/* Mobile Order - Genel Ayarlar first, then Yayınla */}
                  <div className="lg:hidden space-y-6">
                    {/* Genel Ayarlar - Mobile First */}
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
                          {instrumentsLoading ? (
                            <div className="text-sm text-muted-foreground">Enstrümanlar yükleniyor...</div>
                          ) : (
                            <Select value={newListing.instrument} onValueChange={(value) => setNewListing({...newListing, instrument: value})}>
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

                        {/* Şehir */}
                        <div className="space-y-2">
                          <Label htmlFor="location" className="flex items-center gap-2">
                            Şehir
                          </Label>
                          <Select value={newListing.location} onValueChange={(value) => setNewListing({...newListing, location: value})}>
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

                    {/* Yayınla/Kaydet - Mobile Second */}
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
                  </div>
                </div>
              </div>
              )}

              {/* Separator between form and listings */}
              {showCreateForm && (
                <Separator className="my-6" />
              )}

              {/* İlanlarım title and Status Tabs - Show below form when form is open */}
              {showCreateForm && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">İlanlarım</h2>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'all'
                          ? 'bg-foreground text-background'
                          : 'bg-background text-foreground border border-border hover:bg-accent'
                      }`}
                    >
                      Tümü ({getTabCounts().all})
                    </button>
                    <button
                      onClick={() => setActiveTab('active')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'active'
                          ? 'bg-foreground text-background'
                          : 'bg-background text-foreground border border-border hover:bg-accent'
                      }`}
                    >
                      Yayında ({getTabCounts().active})
                    </button>
                    <button
                      onClick={() => setActiveTab('pending')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'pending'
                          ? 'bg-foreground text-background'
                          : 'bg-background text-foreground border border-border hover:bg-accent'
                      }`}
                    >
                      Beklemede ({getTabCounts().pending})
                    </button>
                    <button
                      onClick={() => setActiveTab('archived')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'archived'
                          ? 'bg-foreground text-background'
                          : 'bg-background text-foreground border border-border hover:bg-accent'
                      }`}
                    >
                      Arşiv ({getTabCounts().archived})
                    </button>
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
                ) : getFilteredListings().length > 0 ? (
                  getFilteredListings().map((listing) => (
                    <div key={listing._id} className={`bg-card rounded-xl border-2 ${getStatusBorderColor(listing)} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group`}>
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
                        {listing.status === 'rejected' && (
                          <div className="absolute top-3 left-3">
                            <div className="bg-red-500 text-white p-1 rounded-full">
                              <AlertCircle className="w-4 h-4" />
                            </div>
                          </div>
                        )}
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
                                {getInstrumentName(listing.instrument)}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3 mr-1" />
                            {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('tr-TR') : 'Yeni'}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {/* Arşivle butonu - sadece aktif ve onay bekleyen ilanlar için */}
                          {(listing.status === 'active' || listing.status === 'pending') && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1"
                                >
                                  <Archive className="w-4 h-4 mr-1" />
                                  Arşivle
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>İlanı Arşivle</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    "{listing.title}" başlıklı ilanı arşivlemek istediğinizden emin misiniz? Arşivlenen ilanlar görünmez olur.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>İptal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleArchiveListing(listing._id)}
                                    className="bg-orange-500 text-white hover:bg-orange-600"
                                  >
                                    Arşivle
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                          
                          {/* Onay Bekliyora Al butonu - sadece arşivlenen ilanlar için */}
                          {listing.status === 'archived' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1"
                                >
                                  <Clock3 className="w-4 h-4 mr-1" />
                                  Onay Bekliyora Al
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>İlanı Onay Bekliyora Al</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    "{listing.title}" başlıklı ilanı onay bekliyor durumuna almak istediğinizden emin misiniz? İlan tekrar moderasyon sürecine girecek.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>İptal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleSetPendingListing(listing._id)}
                                    className="bg-yellow-500 text-white hover:bg-yellow-600"
                                  >
                                    Onay Bekliyora Al
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
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
                            className={listing.status === 'rejected' ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : ''}
                          >
                            {listing.status === 'rejected' ? (
                              <AlertCircle className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
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
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">
                      {userListings.length === 0 
                        ? "Henüz hiç ilanınız yok" 
                        : `Bu kategoride ilan bulunmuyor`
                      }
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {userListings.length === 0 
                        ? "İlk ilanınızı oluşturarak başlayın ve müşterilerinizle buluşun."
                        : "Farklı bir kategori seçin veya yeni ilan oluşturun."
                      }
                    </p>
                    <Button onClick={handleCreateListingClick} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" />
                      {userListings.length === 0 ? "İlk İlanınızı Oluşturun" : "Yeni İlan Oluştur"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Reason Modal */}
      <RejectionReasonModal
        isOpen={rejectionModalOpen}
        onClose={() => setRejectionModalOpen(false)}
        listing={selectedRejectedListing}
      />

      {/* Listing Rules Dialog */}
      <ListingRulesDialog
        isOpen={listingRulesDialogOpen}
        onClose={handleCloseRules}
        onApprove={handleApproveRules}
      />
    </div>
  )
}
