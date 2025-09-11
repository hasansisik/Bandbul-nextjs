"use client"

import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hook"
import { 
  getAllListings, 
  deleteListing, 
  getAllCategories,
  getAllInstruments,
  approveListing,
  rejectListing,
  getPendingListings,
  toggleListingStatus
} from "@/redux/actions/userActions"
import { toast } from "sonner"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../../components/ui/breadcrumb"
import { SidebarTrigger } from "../../../components/ui/sidebar"
import { Edit, Trash2, Plus, MapPin, Calendar, User, Music, Settings, CheckCircle, XCircle, Clock, Archive } from "lucide-react"
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
} from "../../../components/ui/alert-dialog"
import ListingsCategoryModal from "../../../components/ListingsCategoryModal"
import InstrumentManagementModal from "../../../components/InstrumentManagementModal"
import { ListingStatusModal } from "../../../components/ListingStatusModal"
import { DataTable } from "../../../components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

export default function ListingsPage() {
  const dispatch = useAppDispatch()
  const { allListings, listingsLoading, categories, categoriesLoading, instruments, instrumentsLoading, user } = useAppSelector((state) => state.user)
  
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState('all')

  // Load listings, categories and instruments on component mount
  useEffect(() => {
    dispatch(getAllListings({ status: statusFilter }))
    dispatch(getAllCategories({}))
    dispatch(getAllInstruments({}))
  }, [dispatch, statusFilter])

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus)
  }

  const handleStatusChange = async (status: string, reason?: string) => {
    if (!selectedListing) return

    try {
      if (status === 'active') {
        await dispatch(approveListing(selectedListing._id))
        toast.success("İlan başarıyla onaylandı.")
      } else if (status === 'rejected') {
        await dispatch(rejectListing({ id: selectedListing._id, reason: reason || 'Belirtilmemiş neden' }))
        toast.success("İlan reddedildi.")
      } else {
        // For other status changes, use the existing toggle function
        await dispatch(toggleListingStatus(selectedListing._id))
        toast.success("İlan durumu güncellendi.")
      }
      
      // Refresh listings
      dispatch(getAllListings({ status: statusFilter }))
    } catch (err) {
      console.error("Status change error:", err)
      toast.error("Durum değiştirilirken bir hata oluştu.")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteListing(id))
      // Refresh listings after deletion
      dispatch(getAllListings({ status: statusFilter }))
      toast.success("İlan başarıyla silindi.")
    } catch (err) {
      console.error("Delete listing error:", err)
      toast.error("İlan silinirken bir hata oluştu.")
    }
  }

  const openStatusModal = (listing: any) => {
    setSelectedListing(listing)
    setStatusModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Yeni"
    try {
      return new Date(dateString).toLocaleDateString('tr-TR')
    } catch {
      return dateString
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

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "image",
      header: "Görsel",
      cell: ({ row }) => {
        const listing = row.original
        return (
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted/50 border">
            {listing.image ? (
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Görsel Yok</span>
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "title",
      header: "Başlık",
      cell: ({ row }) => {
        const listing = row.original
        return (
          <div className="space-y-1">
            <div className="font-medium text-base leading-tight">{listing.title}</div>
            <div className="text-xs text-muted-foreground line-clamp-2">{listing.description.substring(0, 60)}...</div>
          </div>
        )
      },
    },
    {
      accessorKey: "authorInfo",
      header: "İlan Sahibi",
      cell: ({ row }) => {
        const listing = row.original
        const author = listing.authorInfo
        if (author) {
          return <span className="text-sm font-medium">{author.name} {author.surname}</span>
        }
        return <span className="text-sm text-muted-foreground">Bilinmiyor</span>
      },
    },
    {
      accessorKey: "category",
      header: "Kategori",
      cell: ({ row }) => {
        const listing = row.original
        const categoryName = getCategoryName(listing.category)
        return <Badge variant="secondary" className="text-xs font-medium">{categoryName}</Badge>
      },
    },
    {
      accessorKey: "instrument",
      header: "Enstrüman",
      cell: ({ row }) => {
        const listing = row.original
        if (listing.instrumentInfo) {
          return <Badge variant="outline" className="text-xs font-medium">{listing.instrumentInfo.name}</Badge>
        }
        const instrumentName = getInstrumentName(listing.instrument)
        return <Badge variant="outline" className="text-xs font-medium">{instrumentName}</Badge>
      },
    },
    {
      accessorKey: "location",
      header: "Konum",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {row.getValue("location")}
        </div>
      ),
    },
    {
      accessorKey: "experience",
      header: "Deneyim",
      cell: ({ row }) => {
        const experience = row.getValue("experience") as string
        let variant: "default" | "secondary" | "outline" = "outline"
        
        if (experience === "Profesyonel") variant = "default"
        else if (experience === "İleri") variant = "secondary"
        
        return <Badge variant={variant} className="text-xs">{experience}</Badge>
      },
    },
    {
      accessorKey: "status",
      header: "Durum",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const getStatusInfo = (status: string) => {
          switch (status) {
            case 'active':
              return { label: 'Aktif', variant: 'default' as const, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' }
            case 'pending':
              return { label: 'Onay Bekliyor', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' }
            case 'archived':
              return { label: 'Arşivlenen', variant: 'outline' as const, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' }
            case 'rejected':
              return { label: 'Reddedilen', variant: 'destructive' as const, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
            default:
              return { label: 'Bilinmiyor', variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' }
          }
        }
        
        const statusInfo = getStatusInfo(status)
        
        return (
          <div className="flex items-center gap-2">
            <Badge variant={statusInfo.variant} className={`text-xs ${statusInfo.color}`}>
              {statusInfo.label}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => openStatusModal(row.original)}
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Tarih",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.getValue("createdAt"))}</span>,
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }) => {
        const listing = row.original
        const isAdmin = user?.role === 'admin'
        const isOwner = listing.user === user?._id || listing.user?._id === user?._id
        
        return (
          <div className="flex gap-2">
            {/* Edit button - only for owner or admin */}
            {(isOwner || isAdmin) && (
              <Link href={`/dashboard/listings/form?id=${listing._id}`}>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                  <Edit className="h-3 w-3" />
                </Button>
              </Link>
            )}
            
            {/* Delete button - only for owner or admin */}
            {(isOwner || isAdmin) && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>İlanı Sil</AlertDialogTitle>
                    <AlertDialogDescription>
                      "{listing.title}" başlıklı ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                      {isAdmin && !isOwner && (
                        <span className="block mt-2 text-yellow-600 dark:text-yellow-400">
                          Bu ilan başka bir kullanıcıya ait. Admin olarak siliyorsunuz.
                        </span>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(listing._id)}
                      className="bg-destructive text-white hover:bg-destructive/90"
                    >
                      Sil
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      {/* Header with Sidebar Toggle and Breadcrumb */}
      <div className="flex items-center gap-4 mb-4">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>İlanlar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">İlan Yönetimi</h1>
          <p className="text-sm text-muted-foreground">Müzik ilanlarınızı yönetin ve düzenleyin</p>
        </div>
        <div className="flex gap-2">
          <ListingsCategoryModal
            categories={categories.map(cat => cat.name)}
            onCategoriesChange={(newCategories) => {
              // This is now handled by Redux, but keeping for compatibility
            }}
          />
          
          <InstrumentManagementModal />
          
          <Link href="/dashboard/listings/form">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Yeni İlan
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Durum Filtresi:</span>
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Durum seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="pending">Onay Bekliyor</SelectItem>
              <SelectItem value="archived">Arşivlenen</SelectItem>
              <SelectItem value="rejected">Reddedilen</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Listings Table */}
      <div className="space-y-4">
        {listingsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">İlanlar yükleniyor...</p>
          </div>
        ) : allListings.length > 0 ? (
          <DataTable columns={columns} data={allListings} />
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Henüz hiç ilan yok</h3>
            <p className="text-muted-foreground mb-4">İlk ilanınızı oluşturarak başlayın</p>
            
          </div>
        )}
      </div>

      {/* Status Management Modal */}
      <ListingStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        listing={selectedListing}
        onStatusChange={handleStatusChange}
        isAdmin={user?.role === 'admin'}
      />
    </div>
  )
}
