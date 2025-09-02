"use client"

import { useState } from "react"
import { listingsData, ListingItem } from "@/lib/listingsData"
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
import { DataTable } from "../../../components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

export default function ListingsPage() {
  const [listings, setListings] = useState<ListingItem[]>(listingsData)

  const handleDelete = (id: number) => {
    setListings(listings.filter(listing => listing.id !== id))
  }

  const formatDate = (dateString: string) => {
    return dateString
  }

  const columns: ColumnDef<ListingItem>[] = [
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
      accessorKey: "author",
      header: "İlan Sahibi",
      cell: ({ row }) => <span className="text-sm font-medium">{row.getValue("author")}</span>,
    },
    {
      accessorKey: "category",
      header: "Kategori",
      cell: ({ row }) => <Badge variant="secondary" className="text-xs font-medium">{row.getValue("category")}</Badge>,
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
      accessorKey: "postedDate",
      header: "Tarih",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.getValue("postedDate"))}</span>,
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }) => {
        const listing = row.original
        return (
          <div className="flex gap-2">
            <Link href={`/dashboard/listings/form?id=${listing.id}`}>
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
                    onClick={() => handleDelete(listing.id)}
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
            categories={Array.from(new Set(listings.map(l => l.category)))}
            onCategoriesChange={(newCategories) => {
              // Kategorileri güncelle
              setListings(prev => prev.map(listing => {
                if (!newCategories.includes(listing.category)) {
                  return { ...listing, category: newCategories[0] || "Diğer" }
                }
                return listing
              }))
            }}
          />
          
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
        <DataTable columns={columns} data={listings} />
      </div>
    </div>
  )
}
