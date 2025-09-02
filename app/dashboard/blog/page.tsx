"use client"

import { useState } from "react"
import { blogPosts, BlogPost } from "@/lib/blogData"
import { categories, Category } from "@/lib/categoriesData"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../../components/ui/breadcrumb"
import { SidebarTrigger } from "../../../components/ui/sidebar"
import { Edit, Trash2, Plus, Eye } from "lucide-react"
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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts)
  const [categoriesList, setCategoriesList] = useState<Category[]>(categories)

  const handleDelete = (id: number) => {
    setPosts(posts.filter(post => post.id !== id))
  }



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

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
              <BreadcrumbPage>Blog</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blog Yönetimi</h1>
          <p className="text-muted-foreground">Blog yazılarınızı yönetin ve düzenleyin</p>
        </div>
        <div className="flex gap-2">
          <CategoryManagementModal
            categories={categoriesList}
            onCategoriesChange={setCategoriesList}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Yazı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Öne Çıkan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.filter(p => p.featured).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategoriler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriesList.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bu Ay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.filter(p => {
                const postDate = new Date(p.publishedDate)
                const now = new Date()
                return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear()
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Yazıları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Görsel</th>
                  <th className="text-left p-2">Başlık</th>
                  <th className="text-left p-2">Yazar</th>
                  <th className="text-left p-2">Kategori</th>
                  <th className="text-left p-2">Tarih</th>
                  <th className="text-left p-2">Durum</th>
                  <th className="text-left p-2">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        {post.image ? (
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">Görsel Yok</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium text-base">{post.title}</div>
                        <div className="text-xs text-muted-foreground">{post.excerpt.substring(0, 50)}...</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="text-sm">{post.author}</span>
                    </td>
                    <td className="p-2">
                      <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                    </td>
                    <td className="p-2">
                      <span className="text-sm text-muted-foreground">{formatDate(post.publishedDate)}</span>
                    </td>
                    <td className="p-2">
                      {post.featured ? (
                        <Badge variant="default" className="text-xs">Öne Çıkan</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Normal</Badge>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Link href={`/dashboard/blog/form?id=${post.id}`}>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
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
                                onClick={() => handleDelete(post.id)}
                                className="bg-destructive text-white hover:bg-destructive/90"
                              >
                                Sil
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
