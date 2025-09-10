"use client"

import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hook"
import { 
  getAllListings, 
  deleteListing, 
  getAllCategories,
  getAllInstruments
} from "@/redux/actions/userActions"
import { toast } from "sonner"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../../components/ui/breadcrumb"
import { SidebarTrigger } from "../../../components/ui/sidebar"
import { Edit, Trash2, Plus, MapPin, Calendar, User, Music } from "lucide-react"
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
import { DataTable } from "../../../components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

export default function ListingsPage() {
  const dispatch = useAppDispatch()
  const { allListings, listingsLoading, categories, categoriesLoading, instruments, instrumentsLoading } = useAppSelector((state) => state.user)

  // Load listings, categories and instruments on component mount
  useEffect(() => {
    dispatch(getAllListings({}))
    dispatch(getAllCategories({}))
    dispatch(getAllInstruments({}))
  }, [dispatch])

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteListing(id))
      // Refresh listings after deletion
      dispatch(getAllListings({}))
      toast.success("İlan başarıyla silindi.")
    } catch (err) {
      console.error("Delete listing error:", err)
      toast.error("İlan silinirken bir hata oluştu.")
    }
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
        const variant = status === "active" ? "default" : "secondary"
        const label = status === "active" ? "Aktif" : "Pasif"
        
        return <Badge variant={variant} className="text-xs">{label}</Badge>
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
        return (
          <div className="flex gap-2">
            <Link href={`/dashboard/listings/form?id=${listing._id}`}>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                <Edit className="h-3 w-3" />
              </Button>
            </Link>
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
              console.log("Categories changed:", newCategories)
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
    </div>
  )
}
