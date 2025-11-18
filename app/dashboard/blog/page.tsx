"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store"
import { getAllBlogs, deleteBlog } from "@/redux/actions/blogActions"
import { BlogPost } from "@/redux/actions/blogActions"
import { getAllBlogCategories } from "@/redux/actions/blogCategoryActions"
import { toast } from "sonner"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../../components/ui/breadcrumb"
import { SidebarTrigger } from "../../../components/ui/sidebar"
import { Edit, Trash2, Plus } from "lucide-react"
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
import CategoryManagementModal from "../../../components/CategoryManagementModal"
import { DataTable } from "../../../components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

export default function BlogPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { blogs, loading, error, blogStats } = useSelector((state: RootState) => state.blog)
  const { categories: blogCategories } = useSelector((state: RootState) => state.blogCategory)

  useEffect(() => {
    dispatch(getAllBlogs({}))
    dispatch(getAllBlogCategories({}))
    document.title = "Admin-Blog";
  }, [dispatch])

  const handleDelete = async (id: string) => {
    if (confirm("Bu blog yazısını silmek istediğinizden emin misiniz?")) {
      try {
        await dispatch(deleteBlog(id))
        toast.success("Blog yazısı başarıyla silindi!")
      } catch (error) {
        console.error("Delete error:", error)
        toast.error("Blog yazısı silinirken bir hata oluştu.")
      }
    }
  }



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  const columns: ColumnDef<BlogPost>[] = [
    {
      accessorKey: "image",
      header: "Görsel",
      cell: ({ row }) => {
        const post = row.original
        return (
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted/50 border">
            {post.image && post.image !== "/blogexample.jpg" ? (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <div className={`w-full h-full bg-muted flex items-center justify-center ${post.image && post.image !== "/blogexample.jpg" ? 'hidden' : ''}`}>
              <span className="text-xs text-muted-foreground">Görsel Yok</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "title",
      header: "Başlık",
      cell: ({ row }) => {
        const post = row.original
        return (
          <div className="space-y-1">
            <div className="font-medium text-base leading-tight">{post.title}</div>
            <div className="text-xs text-muted-foreground line-clamp-2">{post.excerpt.substring(0, 60)}...</div>
          </div>
        )
      },
    },
    {
      accessorKey: "author",
      header: "Yazar",
      cell: ({ row }) => <span className="text-sm font-medium">{row.getValue("author")}</span>,
    },
    {
      accessorKey: "category",
      header: "Kategori",
      cell: ({ row }) => <Badge variant="secondary" className="text-xs font-medium">{row.getValue("category")}</Badge>,
    },
    {
      accessorKey: "publishedDate",
      header: "Tarih",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.getValue("publishedDate"))}</span>,
    },
    {
      accessorKey: "featured",
      header: "Durum",
      cell: ({ row }) => {
        const featured = row.getValue("featured") as boolean
        return featured ? (
          <Badge variant="default" className="text-xs">Öne Çıkan</Badge>
        ) : (
          <Badge variant="outline" className="text-xs">Normal</Badge>
        )
      },
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }) => {
        const post = row.original
        return (
          <div className="flex gap-2">
            <Link href={`/dashboard/blog/form?id=${post._id}`}>
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
                  <AlertDialogTitle>Blog Yazısını Sil</AlertDialogTitle>
                  <AlertDialogDescription>
                    "{post.title}" başlıklı blog yazısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(post._id!)}
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
              <BreadcrumbPage>Blog</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Blog Yönetimi</h1>
          <p className="text-sm text-muted-foreground">Blog yazılarınızı yönetin ve düzenleyin</p>
        </div>
        <div className="flex gap-2">
          <CategoryManagementModal
            categories={blogCategories}
            onCategoriesChange={() => dispatch(getAllBlogCategories({}))}
          />
          
          <Link href="/dashboard/blog/form">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Yeni Blog Yazısı
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Toplam Yazı</div>
            <div className="text-2xl font-bold">{blogStats?.total || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Öne Çıkan</div>
            <div className="text-2xl font-bold">{blogStats?.featured || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Yayınlanan</div>
            <div className="text-2xl font-bold">{blogStats?.published || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Taslak</div>
            <div className="text-2xl font-bold">{blogStats?.draft || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Kategoriler</div>
            <div className="text-2xl font-bold">{blogCategories.length}</div>
          </CardContent>
        </Card>
      </div>



            {/* Blog Posts Table */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Blog Yazıları</h2>
          <p className="text-sm text-muted-foreground">Tüm blog yazılarınızı görüntüleyin, düzenleyin ve yönetin</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Yükleniyor...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-destructive">Hata: {error}</div>
          </div>
        ) : (
          <DataTable columns={columns} data={blogs} />
        )}
      </div>
      </div>
    )
  }
