"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Settings, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Category, addCategory, deleteCategory } from "../lib/categoriesData"

interface CategoryManagementModalProps {
  categories: Category[]
  onCategoriesChange: (categories: Category[]) => void
  triggerButton?: React.ReactNode
}

export default function CategoryManagementModal({
  categories,
  onCategoriesChange,
  triggerButton
}: CategoryManagementModalProps) {
  const [newCategory, setNewCategory] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.find(cat => cat.name === newCategory.trim())) {
      const newCat = addCategory(newCategory.trim())
      const updatedCategories = [...categories, newCat]
      onCategoriesChange(updatedCategories)
      setNewCategory("")
      setIsOpen(false)
    }
  }

  const handleDeleteCategory = (categoryId: number) => {
    if (confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      deleteCategory(categoryId)
      const updatedCategories = categories.filter(cat => cat.id !== categoryId)
      onCategoriesChange(updatedCategories)
    }
  }

  const defaultTriggerButton = (
    <Button variant="outline" className="flex items-center gap-2">
      <Settings className="h-4 w-4" />
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
            <h3 className="font-medium">Yeni Kategori Ekle</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Kategori adı..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <Button onClick={handleAddCategory} disabled={!newCategory.trim()}>
                Ekle
              </Button>
            </div>
          </div>

          {/* Mevcut Kategoriler */}
          <div className="space-y-4">
            <h3 className="font-medium">Mevcut Kategoriler</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{category.name}</div>
                    {category.description && (
                      <div className="text-sm text-muted-foreground">{category.description}</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {category.postCount} yazı • {category.createdAt}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-destructive hover:text-destructive"
                      disabled={category.postCount > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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
