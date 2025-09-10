"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle } from "lucide-react"

interface ListingRulesDialogProps {
  isOpen: boolean
  onClose: () => void
  onApprove: () => void
}

export function ListingRulesDialog({ isOpen, onClose, onApprove }: ListingRulesDialogProps) {
  const [isApproved, setIsApproved] = useState(false)

  const handleApprove = () => {
    if (isApproved) {
      onApprove()
      setIsApproved(false) // Reset for next time
    }
  }

  const handleClose = () => {
    setIsApproved(false) // Reset when closing
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            İLAN KURALLARI
          </DialogTitle>
          <DialogDescription className="text-base">
            İlanınızı oluşturmadan önce lütfen aşağıdaki kuralları okuyun ve onaylayın.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="space-y-3 text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-200">
                Lütfen ilanınızı düzgün Türkçe ve yazım kurallarına uygun şekilde hazırlayın.
              </p>
              <p className="text-amber-700 dark:text-amber-300">
                İlan başlığında ve metninde gereksiz büyük harf, karakter ve dejenere kelimeler kullanmayın.
              </p>
              <p className="text-amber-700 dark:text-amber-300">
                Ayrıca, ilanınızı ilgili bölüme kaydedin ve mümkün olduğunca detaylı bir şekilde kendinizi açıklayın.
              </p>
              <p className="font-medium text-amber-800 dark:text-amber-200">
                İlanınızın yayınlanabilmesi için yukarıdaki kurallara dikkat edin. Teşekkürler!
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="approve-rules"
              checked={isApproved}
              onCheckedChange={(checked) => setIsApproved(checked as boolean)}
            />
            <label
              htmlFor="approve-rules"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Yukarıdaki kuralları okudum ve onaylıyorum
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            İptal
          </Button>
          <Button 
            onClick={handleApprove}
            disabled={!isApproved}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Onaylıyorum
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
