"use client"

import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hook"
import { 
  getAllExperienceLevels, 
  createExperienceLevel, 
  updateExperienceLevel, 
  deleteExperienceLevel, 
  toggleExperienceLevelStatus
} from "@/redux/actions/experienceLevelActions"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Plus, Trash2, Users, Edit, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react"
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
import { Label } from "./ui/label"

interface ExperienceLevelManagementModalProps {
  triggerButton?: React.ReactNode
}

export default function ExperienceLevelManagementModal({
  triggerButton
}: ExperienceLevelManagementModalProps) {
  const dispatch = useAppDispatch()
  const { experienceLevels, loading: experienceLevelsLoading, error: experienceLevelsError } = useAppSelector((state) => state.experienceLevel)
  
  const [isOpen, setIsOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingLevel, setEditingLevel] = useState<any>(null)
  const [newLevelName, setNewLevelName] = useState("")
  const [newLevelOrder, setNewLevelOrder] = useState(0)
  const [editLevelName, setEditLevelName] = useState("")
  const [editLevelOrder, setEditLevelOrder] = useState(0)

  // Load experience levels when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(getAllExperienceLevels({}))
    }
  }, [isOpen, dispatch])

  // Error handling
  useEffect(() => {
    if (experienceLevelsError) {
      toast.error(experienceLevelsError)
    }
  }, [experienceLevelsError])

  const handleCreateLevel = async () => {
    if (!newLevelName.trim()) {
      toast.error("Deneyim seviyesi adı gereklidir")
      return
    }

    try {
      const result = await dispatch(createExperienceLevel({ 
        name: newLevelName.trim(),
        order: newLevelOrder || 0
      }))
      if (createExperienceLevel.fulfilled.match(result)) {
        toast.success("Deneyim seviyesi başarıyla oluşturuldu!")
        setNewLevelName("")
        setNewLevelOrder(0)
        setIsCreateDialogOpen(false)
        dispatch(getAllExperienceLevels({}))
      }
    } catch (error) {
      console.error("Create experience level error:", error)
    }
  }

  const handleUpdateLevel = async () => {
    if (!editLevelName.trim()) {
      toast.error("Deneyim seviyesi adı gereklidir")
      return
    }

    if (!editingLevel) return

    try {
      const result = await dispatch(updateExperienceLevel({
        id: editingLevel._id,
        formData: { 
          name: editLevelName.trim(),
          order: editLevelOrder
        }
      }))
      if (updateExperienceLevel.fulfilled.match(result)) {
        toast.success("Deneyim seviyesi başarıyla güncellendi!")
        setEditLevelName("")
        setEditLevelOrder(0)
        setEditingLevel(null)
        setIsEditDialogOpen(false)
        dispatch(getAllExperienceLevels({}))
      }
    } catch (error) {
      console.error("Update experience level error:", error)
    }
  }

  const handleDeleteLevel = async (levelId: string) => {
    try {
      const result = await dispatch(deleteExperienceLevel(levelId))
      if (deleteExperienceLevel.fulfilled.match(result)) {
        toast.success("Deneyim seviyesi başarıyla silindi!")
        dispatch(getAllExperienceLevels({}))
      }
    } catch (error) {
      console.error("Delete experience level error:", error)
    }
  }

  const handleToggleStatus = async (levelId: string) => {
    try {
      const result = await dispatch(toggleExperienceLevelStatus(levelId))
      if (toggleExperienceLevelStatus.fulfilled.match(result)) {
        toast.success("Deneyim seviyesi durumu güncellendi!")
        dispatch(getAllExperienceLevels({}))
      }
    } catch (error) {
      console.error("Toggle experience level status error:", error)
    }
  }

  const handleOrderChange = async (levelId: string, newOrder: number) => {
    try {
      const result = await dispatch(updateExperienceLevel({
        id: levelId,
        formData: { order: newOrder }
      }))
      if (updateExperienceLevel.fulfilled.match(result)) {
        dispatch(getAllExperienceLevels({}))
      }
    } catch (error) {
      console.error("Update order error:", error)
    }
  }

  const openEditDialog = (level: any) => {
    setEditingLevel(level)
    setEditLevelName(level.name)
    setEditLevelOrder(level.order || 0)
    setIsEditDialogOpen(true)
  }

  const closeEditDialog = () => {
    setEditingLevel(null)
    setEditLevelName("")
    setEditLevelOrder(0)
    setIsEditDialogOpen(false)
  }

  const sortedLevels = [...experienceLevels].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {triggerButton || (
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Deneyim Seviyeleri
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="!max-w-[95vw] w-[95vw] sm:!max-w-[85vw] sm:w-[85vw] md:!max-w-[75vw] md:w-[75vw] lg:!max-w-[65vw] lg:w-[65vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Deneyim Seviyesi Yönetimi
            </DialogTitle>
            <DialogDescription>
              Deneyim seviyelerini yönetin, yeni seviyeler ekleyin veya mevcut seviyeleri düzenleyin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Create New Level Button */}
            <div className="flex justify-end">
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Yeni Deneyim Seviyesi
              </Button>
            </div>

            {/* Experience Levels List */}
            {experienceLevelsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Deneyim seviyeleri yükleniyor...</p>
              </div>
            ) : sortedLevels.length > 0 ? (
              <div className="space-y-2">
                {sortedLevels.map((level, index) => (
                  <div key={level._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{level.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={level.active ? "default" : "secondary"} className="text-xs">
                            {level.active ? "Aktif" : "Pasif"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Sıra: {level.order || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOrderChange(level._id, (level.order || 0) - 1)}
                        disabled={index === 0}
                        className="h-8 w-8 p-0"
                        title="Yukarı taşı"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOrderChange(level._id, (level.order || 0) + 1)}
                        disabled={index === sortedLevels.length - 1}
                        className="h-8 w-8 p-0"
                        title="Aşağı taşı"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(level)}
                        className="h-8"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Düzenle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(level._id)}
                        className="h-8"
                      >
                        {level.active ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Pasif Yap
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Aktif Yap
                          </>
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Deneyim Seviyesini Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{level.name}" deneyim seviyesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteLevel(level._id)}
                              className="bg-destructive text-white hover:bg-destructive/90"
                            >
                              Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Henüz hiç deneyim seviyesi yok</h3>
                <p className="text-muted-foreground mb-4">İlk deneyim seviyenizi oluşturarak başlayın</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Deneyim Seviyesi
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Kapat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Experience Level Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Deneyim Seviyesi</DialogTitle>
            <DialogDescription>
              Yeni bir deneyim seviyesi ekleyin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="level-name" className="text-sm font-medium">
                Deneyim Seviyesi Adı
              </Label>
              <Input
                id="level-name"
                placeholder="Örn: Başlangıç, Orta, İleri..."
                value={newLevelName}
                onChange={(e) => setNewLevelName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="level-order" className="text-sm font-medium">
                Sıra (0 = en üstte)
              </Label>
              <Input
                id="level-order"
                type="number"
                placeholder="0"
                value={newLevelOrder}
                onChange={(e) => setNewLevelOrder(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleCreateLevel}>
              Oluştur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Experience Level Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={closeEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deneyim Seviyesini Düzenle</DialogTitle>
            <DialogDescription>
              Deneyim seviyesi bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-level-name" className="text-sm font-medium">
                Deneyim Seviyesi Adı
              </Label>
              <Input
                id="edit-level-name"
                placeholder="Deneyim seviyesi adı..."
                value={editLevelName}
                onChange={(e) => setEditLevelName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-level-order" className="text-sm font-medium">
                Sıra (0 = en üstte)
              </Label>
              <Input
                id="edit-level-order"
                type="number"
                placeholder="0"
                value={editLevelOrder}
                onChange={(e) => setEditLevelOrder(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              İptal
            </Button>
            <Button onClick={handleUpdateLevel}>
              Güncelle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

