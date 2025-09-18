"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store"
import { getBlogById, createBlog, updateBlog, deleteBlog } from "@/redux/actions/blogActions"
import { getAllBlogCategories } from "@/redux/actions/blogCategoryActions"
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
import RichTextEditor from "../../../../components/ui/RichTextEditor"

function BlogFormPageContent() {
  const dispatch = useDispatch<AppDispatch>()
  const { currentBlog, loading, error } = useSelector((state: RootState) => state.blog)
  const { categories: blogCategories, loading: categoriesLoading } = useSelector((state: RootState) => state.blogCategory)
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
    featured: false,
    status: "published"
  })

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    // Load blog categories
    dispatch(getAllBlogCategories({}))
    
    if (isEditing && editId) {
      dispatch(getBlogById(editId))
    }
  }, [editId, isEditing, dispatch])

  useEffect(() => {
    if (currentBlog && isEditing) {
      setFormData({
        title: currentBlog.title,
        excerpt: currentBlog.excerpt,
        content: currentBlog.content,
        author: currentBlog.author,
        category: currentBlog.category,
        tags: currentBlog.tags,
        image: currentBlog.image,
        featured: currentBlog.featured || false,
        status: currentBlog.status || "published"
      })
      setSelectedTags(currentBlog.tags)
    }
  }, [currentBlog, isEditing])

  // Error handling effect
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const imageUrl = await uploadImageToCloudinary(file)
      setFormData(prev => ({ ...prev, image: imageUrl }))
      toast.success("Görsel başarıyla yüklendi!")
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
      toast.error("Blog başlığı gereklidir")
      return
    }
    if (!formData.content.trim()) {
      toast.error("Blog içeriği gereklidir")
      return
    }
    if (!formData.author.trim()) {
      toast.error("Yazar adı gereklidir")
      return
    }
    if (!formData.category) {
      toast.error("Kategori seçimi gereklidir")
      return
    }
    
    const blogData = {
      title: formData.title.trim(),
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim(),
      author: formData.author.trim(),
      category: formData.category,
      tags: selectedTags,
      image: formData.image,
      featured: formData.featured,
      status: formData.status
    }

    try {
      if (isEditing && editId) {
        // Güncelleme işlemi
        const result = await dispatch(updateBlog({ id: editId, formData: blogData }))
        if (updateBlog.fulfilled.match(result)) {
          toast.success("Blog yazısı başarıyla güncellendi!")
          router.replace("/dashboard/blog", { scroll: false })
        } else {
          // Error is already handled in the action
          return
        }
      } else {
        // Yeni ekleme işlemi
        const result = await dispatch(createBlog(blogData))
        if (createBlog.fulfilled.match(result)) {
          toast.success("Blog yazısı başarıyla oluşturuldu!")
          router.replace("/dashboard/blog", { scroll: false })
        } else {
          // Error is already handled in the action
          return
        }
      }
    } catch (error) {
      console.error("Blog işlemi hatası:", error)
      toast.error("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.")
    }
  }

  const handleDelete = async () => {
    if (editId && confirm("Bu blog yazısını silmek istediğinizden emin misiniz?")) {
      try {
        await dispatch(deleteBlog(editId))
        toast.success("Blog yazısı silindi!")
        router.replace("/dashboard/blog", { scroll: false })
      } catch (error) {
        console.error("Silme hatası:", error)
        toast.error("Bir hata oluştu. Lütfen tekrar deneyin.")
      }
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

  const addMultipleTags = (tagsString: string) => {
    // Virgülle ayrılmış etiketleri temizle ve ayır
    const tags = tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
    
    // Mevcut etiketlere ekle (duplicate kontrolü ile)
    const newTags = tags.filter(tag => !selectedTags.includes(tag))
    if (newTags.length > 0) {
      setSelectedTags([...selectedTags, ...newTags])
    }
    setTagInput("")
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // Enter tuşuna basıldığında virgül kontrolü yap
      if (tagInput.includes(',')) {
        addMultipleTags(tagInput)
      } else {
        addTag(tagInput.trim())
      }
    }
  }

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTagInput(value)
    
    // Eğer virgül varsa otomatik olarak etiketleri ayır ve ekle
    if (value.includes(',')) {
      addMultipleTags(value)
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
              ? `"${currentBlog?.title}" yazısını düzenleyin` 
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
                  "{currentBlog?.title}" başlıklı blog yazısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
              <div className="text-xs text-muted-foreground">
                Veya manuel olarak URL girin:
              </div>
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
                onChange={(html) =>
                  setFormData({ ...formData, content: html })
                }
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
                      {blogCategories.filter(cat => cat.active).map((category) => (
                        <SelectItem key={category._id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <CategoryManagementModal
                    categories={blogCategories}
                    onCategoriesChange={() => dispatch(getAllBlogCategories({}))}
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
                  <div className="space-y-2">
                    <Input
                      placeholder="Etiket ekle... (virgülle ayırarak toplu ekleyebilirsiniz)"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyPress={handleTagInputKeyPress}
                    />
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (tagInput.includes(',')) {
                            addMultipleTags(tagInput)
                          } else {
                            addTag(tagInput.trim())
                          }
                        }}
                        disabled={!tagInput.trim()}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ekle
                      </Button>
                      {tagInput.includes(',') && (
                        <span className="text-xs text-muted-foreground self-center">
                          Virgülle ayrılmış etiketler otomatik eklenecek
                        </span>
                      )}
                    </div>
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

              {/* Durum */}
              <div className="space-y-2">
                <Label htmlFor="status">Durum</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Durum seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Yayınlanmış</SelectItem>
                    <SelectItem value="draft">Taslak</SelectItem>
                    <SelectItem value="archived">Arşivlenmiş</SelectItem>
                  </SelectContent>
                </Select>
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

export default function BlogFormPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <BlogFormPageContent />
    </Suspense>
  )
}
