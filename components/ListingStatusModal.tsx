"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  CheckCircle, 
  XCircle, 
  Archive, 
  Clock, 
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react"

interface ListingStatusModalProps {
  isOpen: boolean
  onClose: () => void
  listing: any
  onStatusChange: (status: string, reason?: string) => void
  isAdmin?: boolean
}

export function ListingStatusModal({ 
  isOpen, 
  onClose, 
  listing, 
  onStatusChange, 
  isAdmin = false 
}: ListingStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(listing?.status || 'pending')
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectionReason, setShowRejectionReason] = useState(false)

  const statusOptions = [
    {
      value: 'active',
      label: 'Aktif',
      description: 'İlan yayında ve görünür',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      value: 'pending',
      label: 'Onay Bekliyor',
      description: 'Admin onayı bekleniyor',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    },
    {
      value: 'archived',
      label: 'Arşivlenen',
      description: 'İlan arşivlendi, düzenlenebilir',
      icon: Archive,
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      borderColor: 'border-gray-200 dark:border-gray-800'
    },
    {
      value: 'rejected',
      label: 'Reddedilen',
      description: 'İlan reddedildi',
      icon: XCircle,
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      borderColor: 'border-red-200 dark:border-red-800'
    }
  ]

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status)
    if (status === 'rejected') {
      setShowRejectionReason(true)
    } else {
      setShowRejectionReason(false)
      setRejectionReason('')
    }
  }

  const handleConfirm = () => {
    if (selectedStatus === 'rejected' && !rejectionReason.trim()) {
      return
    }
    onStatusChange(selectedStatus, rejectionReason)
    onClose()
  }

  const getStatusInfo = (status: string) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0]
  }

  const currentStatusInfo = getStatusInfo(listing?.status || 'pending')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${currentStatusInfo.color.split(' ')[0]}`} />
            İlan Durumu Yönetimi
          </DialogTitle>
          <DialogDescription>
            "{listing?.title}" ilanının durumunu yönetin
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status Display */}
          <div className="p-4 rounded-lg border bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Mevcut Durum</span>
              <Badge className={currentStatusInfo.color}>
                <currentStatusInfo.icon className="w-3 h-3 mr-1" />
                {currentStatusInfo.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentStatusInfo.description}
            </p>
            {listing?.rejectionReason && (
              <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Red Nedeni:</p>
                    <p className="text-sm text-red-700 dark:text-red-300">{listing.rejectionReason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Yeni Durum Seçin</Label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((option) => {
                const Icon = option.icon
                const isSelected = selectedStatus === option.value
                const isDisabled = !isAdmin && (option.value === 'active' || option.value === 'rejected')
                
                return (
                  <button
                    key={option.value}
                    onClick={() => !isDisabled && handleStatusChange(option.value)}
                    disabled={isDisabled}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected 
                        ? `${option.borderColor} border-2 bg-muted` 
                        : 'border-border hover:bg-muted/50'
                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{option.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                    {isDisabled && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {isAdmin ? 'Admin yetkisi gerekli' : 'Sadece admin yapabilir'}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Rejection Reason */}
          {showRejectionReason && (
            <div className="space-y-2">
              <Label htmlFor="rejection-reason" className="text-sm font-medium">
                Red Nedeni *
              </Label>
              <Textarea
                id="rejection-reason"
                placeholder="İlanın neden reddedildiğini açıklayın..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Bu neden kullanıcıya gösterilecektir.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={selectedStatus === 'rejected' && !rejectionReason.trim()}
          >
            {selectedStatus === 'rejected' ? 'Reddet' : 
             selectedStatus === 'active' ? 'Onayla' : 
             'Durumu Değiştir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
