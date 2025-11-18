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
} from "./ui/alert-dialog"
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
  const { categories: reduxCategories, categoriesLoading, allListings, listingsLoading, categoriesError } = useAppSelector((state) => state.user)

  // Load categories and listings on component mount
  useEffect(() => {
    if (isOpen) {
      dispatch(getAllCategories({}))
      dispatch(getAllListings({ limit: '1000', status: 'active' }))
    }
  }, [dispatch, isOpen])

  // Error handling effect
  useEffect(() => {
    if (categoriesError) {
      toast.error(categoriesError)
    }
  }, [categoriesError])

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        const result = await dispatch(createCategory({ name: newCategory.trim() }))
        if (createCategory.fulfilled.match(result)) {
          setNewCategory("")
          // Refresh categories
          dispatch(getAllCategories({}))
          toast.success("Kategori başarıyla eklendi.")
        } else {
          // Error is already handled in the action
          return
        }
      } catch (err) {
        console.error("Add category error:", err)
        toast.error("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.")
      }
    }
  }

  const handleUpdateCategory = async () => {
    if (editingCategory && editName.trim() && editName !== editingCategory.name) {
      try {
        const result = await dispatch(updateCategory({ 
          id: editingCategory._id, 
          formData: { name: editName.trim() } 
        }))
        if (updateCategory.fulfilled.match(result)) {
          setEditingCategory(null)
          setEditName("")
          // Refresh categories
          dispatch(getAllCategories({}))
          toast.success("Kategori başarıyla güncellendi.")
        } else {
          // Error is already handled in the action
          return
        }
      } catch (err) {
        console.error("Update category error:", err)
        toast.error("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.")
      }
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const result = await dispatch(deleteCategory(categoryId))
      
      if (deleteCategory.fulfilled.match(result)) {
        // Refresh categories
        dispatch(getAllCategories({}))
        toast.success("Kategori başarıyla silindi.")
      } else {
        // Error is already handled in the action
        return
      }
    } catch (err) {
      console.error("Delete category error:", err)
      toast.error("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.")
    }
  }

  const handleToggleCategoryStatus = async (categoryId: string) => {
    try {
      const result = await dispatch(toggleCategoryStatus(categoryId))
      if (toggleCategoryStatus.fulfilled.match(result)) {
        // Refresh categories
        dispatch(getAllCategories({}))
        toast.success("Kategori durumu başarıyla değiştirildi.")
      } else {
        // Error is already handled in the action
        return
      }
    } catch (err) {
      console.error("Toggle category status error:", err)
      toast.error("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.")
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
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                disabled={stats.count > 0}
                                title={stats.count > 0 ? "Bu kategoride ilan bulunduğu için silinemez" : "Kategoriyi sil"}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Kategoriyi Sil</AlertDialogTitle>
                                <AlertDialogDescription>
                                  "{category.name}" kategorisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCategory(category._id)}
                                  className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                  Sil
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
