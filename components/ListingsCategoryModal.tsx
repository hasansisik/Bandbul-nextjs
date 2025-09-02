"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Plus, Trash2, Music, MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { listingsData } from "../lib/listingsData"

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

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.find(cat => cat === newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()]
      onCategoriesChange(updatedCategories)
      setNewCategory("")
      setIsOpen(false)
    }
  }

  const handleDeleteCategory = (categoryName: string) => {
    if (confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      const updatedCategories = categories.filter(cat => cat !== categoryName)
      onCategoriesChange(updatedCategories)
    }
  }

  const getCategoryStats = (categoryName: string) => {
    const listingsInCategory = listingsData.filter(listing => listing.category === categoryName)
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
              <Button onClick={handleAddCategory} disabled={!newCategory.trim()}>
                Ekle
              </Button>
            </div>
          </div>

          {/* Mevcut Kategoriler */}
          <div className="space-y-4">
            <h3 className="font-medium">Mevcut Kategoriler</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {categories.map((category) => {
                const stats = getCategoryStats(category)
                return (
                  <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium flex items-center gap-2">
                        <Music className="h-4 w-4 text-blue-500" />
                        {category}
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
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category)}
                        className="text-destructive hover:text-destructive"
                        disabled={stats.count > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
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
