"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store"
import { 
  getAllBlogCategories, 
  createBlogCategory, 
  updateBlogCategory, 
  deleteBlogCategory, 
  toggleBlogCategoryStatus
} from "@/redux/actions/blogCategoryActions"
import { getAllBlogs } from "@/redux/actions/blogActions"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Plus, Trash2, Edit, Eye, EyeOff, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { toast } from "sonner"

interface CategoryManagementModalProps {
  categories: any[]
  onCategoriesChange: (categories: any[]) => void
  triggerButton?: React.ReactNode
}

export default function CategoryManagementModal({
  categories,
  onCategoriesChange,
  triggerButton
}: CategoryManagementModalProps) {
  const [newCategory, setNewCategory] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")

  const dispatch = useDispatch<AppDispatch>()
  const { categories: reduxCategories, loading: categoriesLoading } = useSelector((state: RootState) => state.blogCategory)
  const { blogs } = useSelector((state: RootState) => state.blog)

  // Load categories and blogs on component mount
  useEffect(() => {
    if (isOpen) {
      dispatch(getAllBlogCategories({}))
      dispatch(getAllBlogs({}))
    }
  }, [dispatch, isOpen])

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        await dispatch(createBlogCategory({ 
          name: newCategory.trim(),
          description: newDescription.trim() || undefined
        }))
        setNewCategory("")
        setNewDescription("")
        // Refresh categories
        dispatch(getAllBlogCategories({}))
        toast.success("Blog kategorisi başarıyla eklendi.")
      } catch (err) {
        toast.error("Blog kategorisi eklenirken bir hata oluştu.")
      }
    }
  }

  const handleUpdateCategory = async () => {
    if (editingCategory && editName.trim() && (editName !== editingCategory.name || editDescription !== editingCategory.description)) {
      try {
        await dispatch(updateBlogCategory({ 
          id: editingCategory._id, 
          formData: { 
            name: editName.trim(),
            description: editDescription.trim() || undefined
          } 
        }))
        setEditingCategory(null)
        setEditName("")
        setEditDescription("")
        // Refresh categories
        dispatch(getAllBlogCategories({}))
        toast.success("Blog kategorisi başarıyla güncellendi.")
      } catch (err) {
        toast.error("Blog kategorisi güncellenirken bir hata oluştu.")
      }
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm("Bu blog kategorisini silmek istediğinizden emin misiniz?")) {
      try {
        await dispatch(deleteBlogCategory(categoryId))
        // Refresh categories
        dispatch(getAllBlogCategories({}))
        toast.success("Blog kategorisi başarıyla silindi.")
      } catch (err) {
        toast.error("Blog kategorisi silinirken bir hata oluştu.")
      }
    }
  }

  const handleToggleCategoryStatus = async (categoryId: string) => {
    try {
      await dispatch(toggleBlogCategoryStatus(categoryId))
      // Refresh categories
      dispatch(getAllBlogCategories({}))
      toast.success("Blog kategorisi durumu başarıyla değiştirildi.")
    } catch (err) {
      toast.error("Blog kategorisi durumu değiştirilirken bir hata oluştu.")
    }
  }

  const getCategoryStats = (categoryId: string) => {
    const category = reduxCategories.find(cat => cat._id === categoryId)
    if (!category) return { count: 0 }
    
    const blogsInCategory = blogs.filter(blog => blog.category === category.name)
    
    return {
      count: blogsInCategory.length
    }
  }

  const defaultTriggerButton = (
    <Button variant="outline" className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      Kategoriler
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || defaultTriggerButton}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Kategori Yönetimi</DialogTitle>
          <DialogDescription>
            Blog yazıları için kategorileri yönetin, ekleyin veya silin.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Yeni Kategori Ekleme */}
          <div className="space-y-4">
            <h3 className="font-medium">Yeni Blog Kategorisi Ekle</h3>
            <div className="space-y-3">
              <Input
                placeholder="Kategori adı..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <Input
                placeholder="Açıklama (opsiyonel)..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <Button 
                onClick={handleAddCategory} 
                disabled={!newCategory.trim() || categoriesLoading}
                className="w-full"
              >
                {categoriesLoading ? "Ekleniyor..." : "Ekle"}
              </Button>
            </div>
          </div>

          {/* Mevcut Kategoriler */}
          <div className="space-y-4">
            <h3 className="font-medium">Mevcut Blog Kategorileri</h3>
            {categoriesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Kategoriler yükleniyor...</p>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2">
                {reduxCategories.map((category) => {
                  const stats = getCategoryStats(category._id)
                  const isEditing = editingCategory?._id === category._id
                  
                  return (
                    <div key={category._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        {isEditing ? (
                          <div className="space-y-2">
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              placeholder="Kategori adı..."
                              className="flex-1"
                            />
                            <Input
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              placeholder="Açıklama..."
                              className="flex-1"
                            />
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={handleUpdateCategory}
                                disabled={!editName.trim() || (editName === category.name && editDescription === category.description)}
                              >
                                Kaydet
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setEditingCategory(null)
                                  setEditName("")
                                  setEditDescription("")
                                }}
                              >
                                İptal
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="font-medium flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-500" />
                              {category.name}
                              {!category.active && (
                                <Badge variant="secondary" className="text-xs">Pasif</Badge>
                              )}
                            </div>
                            {category.description && (
                              <div className="text-sm text-muted-foreground mt-1">{category.description}</div>
                            )}
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Badge variant="secondary" className="text-xs">{stats.count} blog yazısı</Badge>
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      {!isEditing && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingCategory(category)
                              setEditName(category.name)
                              setEditDescription(category.description || "")
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleCategoryStatus(category._id)}
                            title={category.active ? "Pasif yap" : "Aktif yap"}
                          >
                            {category.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category._id)}
                            className="text-destructive hover:text-destructive"
                            disabled={stats.count > 0}
                            title={stats.count > 0 ? "Bu kategoride blog yazısı bulunduğu için silinemez" : "Kategoriyi sil"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Kapat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
