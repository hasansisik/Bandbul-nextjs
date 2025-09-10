"use client"

import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hook"
import { 
  getAllInstruments, 
  createInstrument, 
  updateInstrument, 
  deleteInstrument, 
  toggleInstrumentStatus
} from "@/redux/actions/instrumentActions"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Plus, Trash2, Music, Edit, Eye, EyeOff } from "lucide-react"
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

interface InstrumentManagementModalProps {
  triggerButton?: React.ReactNode
}

export default function InstrumentManagementModal({
  triggerButton
}: InstrumentManagementModalProps) {
  const dispatch = useAppDispatch()
  const { instruments, loading: instrumentsLoading, error: instrumentsError } = useAppSelector((state) => state.instrument)
  
  const [isOpen, setIsOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingInstrument, setEditingInstrument] = useState<any>(null)
  const [newInstrumentName, setNewInstrumentName] = useState("")
  const [editInstrumentName, setEditInstrumentName] = useState("")

  // Load instruments when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(getAllInstruments({}))
    }
  }, [isOpen, dispatch])

  // Error handling
  useEffect(() => {
    if (instrumentsError) {
      toast.error(instrumentsError)
    }
  }, [instrumentsError])

  const handleCreateInstrument = async () => {
    if (!newInstrumentName.trim()) {
      toast.error("Enstrüman adı gereklidir")
      return
    }

    try {
      const result = await dispatch(createInstrument({ name: newInstrumentName.trim() }))
      if (createInstrument.fulfilled.match(result)) {
        toast.success("Enstrüman başarıyla oluşturuldu!")
        setNewInstrumentName("")
        setIsCreateDialogOpen(false)
        dispatch(getAllInstruments({}))
      }
    } catch (error) {
      console.error("Create instrument error:", error)
    }
  }

  const handleUpdateInstrument = async () => {
    if (!editInstrumentName.trim()) {
      toast.error("Enstrüman adı gereklidir")
      return
    }

    if (!editingInstrument) return

    try {
      const result = await dispatch(updateInstrument({
        id: editingInstrument._id,
        formData: { name: editInstrumentName.trim() }
      }))
      if (updateInstrument.fulfilled.match(result)) {
        toast.success("Enstrüman başarıyla güncellendi!")
        setEditInstrumentName("")
        setEditingInstrument(null)
        setIsEditDialogOpen(false)
        dispatch(getAllInstruments({}))
      }
    } catch (error) {
      console.error("Update instrument error:", error)
    }
  }

  const handleDeleteInstrument = async (instrumentId: string) => {
    try {
      const result = await dispatch(deleteInstrument(instrumentId))
      if (deleteInstrument.fulfilled.match(result)) {
        toast.success("Enstrüman başarıyla silindi!")
        dispatch(getAllInstruments({}))
      }
    } catch (error) {
      console.error("Delete instrument error:", error)
    }
  }

  const handleToggleStatus = async (instrumentId: string) => {
    try {
      const result = await dispatch(toggleInstrumentStatus(instrumentId))
      if (toggleInstrumentStatus.fulfilled.match(result)) {
        toast.success("Enstrüman durumu güncellendi!")
        dispatch(getAllInstruments({}))
      }
    } catch (error) {
      console.error("Toggle instrument status error:", error)
    }
  }

  const openEditDialog = (instrument: any) => {
    setEditingInstrument(instrument)
    setEditInstrumentName(instrument.name)
    setIsEditDialogOpen(true)
  }

  const closeEditDialog = () => {
    setEditingInstrument(null)
    setEditInstrumentName("")
    setIsEditDialogOpen(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {triggerButton || (
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Enstrümanlar
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Enstrüman Yönetimi
            </DialogTitle>
            <DialogDescription>
              Müzik enstrümanlarını yönetin, yeni enstrümanlar ekleyin veya mevcut enstrümanları düzenleyin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Create New Instrument Button */}
            <div className="flex justify-end">
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Yeni Enstrüman
              </Button>
            </div>

            {/* Instruments List */}
            {instrumentsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Enstrümanlar yükleniyor...</p>
              </div>
            ) : instruments.length > 0 ? (
              <div className="space-y-2">
                {instruments.map((instrument) => (
                  <div key={instrument._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Music className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{instrument.name}</h3>
                        <Badge variant={instrument.active ? "default" : "secondary"} className="text-xs mt-1">
                          {instrument.active ? "Aktif" : "Pasif"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(instrument)}
                        className="h-8"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Düzenle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(instrument._id)}
                        className="h-8"
                      >
                        {instrument.active ? (
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
                            <AlertDialogTitle>Enstrümanı Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{instrument.name}" enstrümanını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteInstrument(instrument._id)}
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
                  <Music className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Henüz hiç enstrüman yok</h3>
                <p className="text-muted-foreground mb-4">İlk enstrümanınızı oluşturarak başlayın</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Enstrüman
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

      {/* Create Instrument Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Enstrüman</DialogTitle>
            <DialogDescription>
              Yeni bir müzik enstrümanı ekleyin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="instrument-name" className="text-sm font-medium">
                Enstrüman Adı
              </label>
              <Input
                id="instrument-name"
                placeholder="Örn: Gitar, Piyano, Davul..."
                value={newInstrumentName}
                onChange={(e) => setNewInstrumentName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleCreateInstrument}>
              Oluştur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Instrument Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={closeEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enstrümanı Düzenle</DialogTitle>
            <DialogDescription>
              Enstrüman bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-instrument-name" className="text-sm font-medium">
                Enstrüman Adı
              </label>
              <Input
                id="edit-instrument-name"
                placeholder="Enstrüman adı..."
                value={editInstrumentName}
                onChange={(e) => setEditInstrumentName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              İptal
            </Button>
            <Button onClick={handleUpdateInstrument}>
              Güncelle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
