"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useSearchParams, useRouter } from "next/navigation"
import { blogPosts, BlogPost } from "@/lib/blogData"
import { categories, Category } from "@/lib/categoriesData"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
const RichTextEditor = dynamic(() => import("../../../../components/ui/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[400px] p-4 border rounded-md bg-gray-50">
      <div className="text-gray-400">Editör yükleniyor...</div>
    </div>
  ),
})
import { Checkbox } from "../../../../components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Badge } from "../../../../components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../../../components/ui/breadcrumb"
import { SidebarTrigger } from "../../../../components/ui/sidebar"
import { Save, Trash2, Image as ImageIcon, X, Plus } from "lucide-react"
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
import CategoryManagementModal from "../../../../components/CategoryManagementModal"

export default function BlogFormPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const editId = searchParams.get('id')
  const isEditing = !!editId
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    tags: [] as string[],
    image: "",
    featured: false
  })

  const [loading, setLoading] = useState(false)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [categoriesList, setCategoriesList] = useState<Category[]>(categories)

  useEffect(() => {
    if (isEditing && editId) {
      const foundPost = blogPosts.find(p => p.id === parseInt(editId))
      if (foundPost) {
        setPost(foundPost)
        setFormData({
          title: foundPost.title,
          excerpt: foundPost.excerpt,
          content: foundPost.content,
          author: foundPost.author,
          category: foundPost.category,
          tags: foundPost.tags,
          image: foundPost.image,
          featured: foundPost.featured || false
        })
        setSelectedTags(foundPost.tags)
      }
    }
  }, [editId, isEditing])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    if (isEditing && post) {
      // Güncelleme işlemi
      const updatedPost = {
        ...post,
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        category: formData.category,
        tags: selectedTags,
        image: formData.image,
        featured: formData.featured,
        slug: formData.title.toLowerCase()
          .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
          .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        categorySlug: formData.category.toLowerCase()
          .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
          .replace(/\s+/g, '-')
      }

      // Blog yazısını güncelle
      const postIndex = blogPosts.findIndex(p => p.id === post.id)
      if (postIndex !== -1) {
        blogPosts[postIndex] = updatedPost
      }

      console.log("Güncellenmiş blog yazısı:", updatedPost)
      alert("Blog yazısı başarıyla güncellendi!")
    } else {
      // Yeni ekleme işlemi
      const newPost = {
        id: Date.now(),
        slug: formData.title.toLowerCase()
          .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
          .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        publishedDate: new Date().toISOString().split('T')[0],
        readTime: "5 dk",
        categorySlug: formData.category.toLowerCase()
          .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
          .replace(/\s+/g, '-'),
        ...formData,
        tags: selectedTags
      }

      // Yeni blog yazısını ekle
      blogPosts.push(newPost)

      console.log("Yeni blog yazısı:", newPost)
      alert("Blog yazısı başarıyla oluşturuldu!")
    }
    
    setLoading(false)
    router.replace("/dashboard/blog", { scroll: false })
  }

  const handleDelete = () => {
    if (post && confirm("Bu blog yazısını silmek istediğinizden emin misiniz?")) {
      // Blog yazısını sil
      const postIndex = blogPosts.findIndex(p => p.id === post.id)
      if (postIndex !== -1) {
        blogPosts.splice(postIndex, 1)
      }
      
      console.log("Blog yazısı silindi:", post.id)
      alert("Blog yazısı silindi!")
      router.replace("/dashboard/blog", { scroll: false })
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
    setTagInput("")
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput.trim())
    }
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
              <BreadcrumbLink href="/dashboard/blog">Blog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isEditing ? "Düzenle" : "Yeni Yazı"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Blog Yazısını Düzenle" : "Yeni Blog Yazısı"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing 
              ? `"${post?.title}" yazısını düzenleyin` 
              : "Yeni bir blog yazısı oluşturun"
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
              <AlertDialogTitle>Blog Yazısını Sil</AlertDialogTitle>
              <AlertDialogDescription>
                "{post?.title}" başlıklı blog yazısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
              <CardTitle>Başlık</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Blog yazısı başlığı..."
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
                    alt="Blog görseli" 
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

          {/* İçerik */}
          <Card>
            <CardHeader>
              <CardTitle>İçerik</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                content={formData.content}
                onChange={(html) => handleChange("content", html)}
                placeholder="Blog yazısının detaylı içeriğini yazın..."
                className="min-h-[400px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sağ Sidebar - Genel Veriler */}
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
                  {loading ? "Kaydediliyor..." : (isEditing ? "Güncelle" : "Yayınla")}
                </Button>
                <Link href="/dashboard/blog">
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
              {/* Yazar */}
              <div className="space-y-2">
                <Label htmlFor="author">Yazar *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleChange("author", e.target.value)}
                  placeholder="Yazar adı"
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
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                    </SelectContent>
                  </Select>
                  
                  <CategoryManagementModal
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

              {/* Etiketler */}
              <div className="space-y-2">
                <Label>Etiketler</Label>
                <div className="space-y-3">
                  {/* Mevcut etiketler */}
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Etiket ekleme */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Etiket ekle..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagInputKeyPress}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => addTag(tagInput.trim())}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  

                </div>
              </div>

              {/* Öne Çıkan */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleChange("featured", checked)}
                />
                <Label htmlFor="featured">Öne çıkan yazı olarak işaretle</Label>
              </div>
            </CardContent>
          </Card>

          {/* Özet */}
          <Card>
            <CardHeader>
              <CardTitle>Özet</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Blog yazısının kısa özeti..."
                value={formData.excerpt}
                onChange={(e) => handleChange("excerpt", e.target.value)}
                rows={4}
                required
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
