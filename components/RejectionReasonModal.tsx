"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, X } from "lucide-react"

interface RejectionReasonModalProps {
  isOpen: boolean
  onClose: () => void
  listing: any
}

export function RejectionReasonModal({ 
  isOpen, 
  onClose, 
  listing 
}: RejectionReasonModalProps) {
  if (!listing) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            İlan Reddedildi
          </DialogTitle>
          <DialogDescription>
            "{listing.title}" başlıklı ilanınız reddedildi.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rejection Reason */}
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Red Nedeni:
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                  {listing.rejectionReason || 'Belirtilmemiş neden'}
                </p>
              </div>
            </div>
          </div>

          {/* What to do next */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Ne yapabilirsiniz?
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• İlanınızı düzenleyerek tekrar gönderebilirsiniz</li>
              <li>• Red nedenini dikkate alarak gerekli değişiklikleri yapabilirsiniz</li>
              <li>• Yeni bir ilan oluşturabilirsiniz</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Anladım
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
