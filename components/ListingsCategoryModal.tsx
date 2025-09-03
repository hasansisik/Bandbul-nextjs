"use client"

import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hook"
import { 
  getAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  toggleCategoryStatus,
  getAllListings
} from "@/redux/actions/userActions"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Plus, Trash2, Music, MapPin, Edit, Eye, EyeOff } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Badge } from "./ui/badge"
import { toast } from "sonner"

interface ListingsCategoryModalProps {
  categories: string[]
  onCategoriesChange: (categories: string[]) => void
  triggerButton?: React.ReactNode
}

export default function ListingsCategoryModal({
  categories,
  onCategoriesChange,
  triggerButton
}: ListingsCategoryModalProps) {
  const [newCategory, setNewCategory] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [editName, setEditName] = useState("")

  const dispatch = useAppDispatch()
  const { categories: reduxCategories, categoriesLoading, allListings, listingsLoading } = useAppSelector((state) => state.user)

  // Load categories and listings on component mount
  useEffect(() => {
    if (isOpen) {
      dispatch(getAllCategories({}))
      dispatch(getAllListings({}))
    }
  }, [dispatch, isOpen])

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        await dispatch(createCategory({ name: newCategory.trim() }))
        setNewCategory("")
        // Refresh categories
        dispatch(getAllCategories({}))
        toast.success("Kategori başarıyla eklendi.")
      } catch (err) {
        toast.error("Kategori eklenirken bir hata oluştu.")
      }
    }
  }

  const handleUpdateCategory = async () => {
    if (editingCategory && editName.trim() && editName !== editingCategory.name) {
      try {
        await dispatch(updateCategory({ 
          id: editingCategory._id, 
          formData: { name: editName.trim() } 
        }))
        setEditingCategory(null)
        setEditName("")
        // Refresh categories
        dispatch(getAllCategories({}))
        toast.success("Kategori başarıyla güncellendi.")
      } catch (err) {
        toast.error("Kategori güncellenirken bir hata oluştu.")
      }
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      try {
        await dispatch(deleteCategory(categoryId))
        // Refresh categories
        dispatch(getAllCategories({}))
        toast.success("Kategori başarıyla silindi.")
      } catch (err) {
        toast.error("Kategori silinirken bir hata oluştu.")
      }
    }
  }

  const handleToggleCategoryStatus = async (categoryId: string) => {
    try {
      await dispatch(toggleCategoryStatus(categoryId))
      // Refresh categories
      dispatch(getAllCategories({}))
      toast.success("Kategori durumu başarıyla değiştirildi.")
    } catch (err) {
      toast.error("Kategori durumu değiştirilirken bir hata oluştu.")
    }
  }

  const getCategoryStats = (categoryId: string) => {
    const category = reduxCategories.find(cat => cat._id === categoryId)
    if (!category) return { count: 0, locations: 0, types: 0 }
    
    const listingsInCategory = allListings.filter(listing => listing.category === categoryId)
    const locations = Array.from(new Set(listingsInCategory.map(l => l.location)))
    const types = Array.from(new Set(listingsInCategory.map(l => l.type).filter(Boolean)))
    
    return {
      count: listingsInCategory.length,
      locations: locations.length,
      types: types.length
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
          <DialogTitle>İlan Kategorileri Yönetimi</DialogTitle>
          <DialogDescription>
            Müzik ilanları için kategorileri yönetin, ekleyin veya silin.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Yeni Kategori Ekleme */}
          <div className="space-y-4">
            <h3 className="font-medium">Yeni Kategori Ekle</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Kategori adı..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <Button 
                onClick={handleAddCategory} 
                disabled={!newCategory.trim() || categoriesLoading}
              >
                {categoriesLoading ? "Ekleniyor..." : "Ekle"}
              </Button>
            </div>
          </div>

          {/* Mevcut Kategoriler */}
          <div className="space-y-4">
            <h3 className="font-medium">Mevcut Kategoriler</h3>
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
                          <div className="flex gap-2">
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              placeholder="Kategori adı..."
                              className="flex-1"
                            />
                            <Button 
                              size="sm" 
                              onClick={handleUpdateCategory}
                              disabled={!editName.trim() || editName === category.name}
                            >
                              Kaydet
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setEditingCategory(null)
                                setEditName("")
                              }}
                            >
                              İptal
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="font-medium flex items-center gap-2">
                              <Music className="h-4 w-4 text-blue-500" />
                              {category.name}
                              {!category.active && (
                                <Badge variant="secondary" className="text-xs">Pasif</Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Badge variant="secondary" className="text-xs">{stats.count} ilan</Badge>
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {stats.locations} konum
                              </span>
                              {stats.types > 0 && (
                                <span className="flex items-center gap-1">
                                  <Badge variant="outline" className="text-xs">{stats.types} tür</Badge>
                                </span>
                              )}
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
                            title={stats.count > 0 ? "Bu kategoride ilan bulunduğu için silinemez" : "Kategoriyi sil"}
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
