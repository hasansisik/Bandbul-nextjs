"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Share2, 
  Copy, 
  Check, 
  Facebook, 
  Twitter, 
  MessageCircle,
  Mail
} from "lucide-react";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  url: string;
}

export default function ShareModal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  url 
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  
  // Convert localhost URL to bandbul.com URL
  const getProductionUrl = (url: string) => {
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      return url.replace(/https?:\/\/[^\/]+/, 'https://bandbul.com');
    }
    return url;
  };

  const productionUrl = getProductionUrl(url);
  const shareText = `${title}${description ? ` - ${description}` : ''}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productionUrl);
      setCopied(true);
      toast.success('Link kopyalandı!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
      toast.error('Link kopyalanamadı');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description || '',
          url: productionUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productionUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productionUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${productionUrl}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToEmail = () => {
    const subject = encodeURIComponent(shareText);
    const body = encodeURIComponent(`${description || ''}\n\n${productionUrl}`);
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Paylaş
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Link Copy Section */}
          <div className="space-y-2">
            <Label htmlFor="share-url">İlan Linki</Label>
            <div className="flex gap-2">
              <Input
                id="share-url"
                value={productionUrl}
                readOnly
                className="text-sm"
              />
              <Button
                onClick={handleCopyLink}
                size="sm"
                variant="outline"
                className="px-3"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Native Share (Mobile) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button
              onClick={handleNativeShare}
              className="w-full"
              variant="default"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Paylaş
            </Button>
          )}

          {/* Social Media Options */}
          <div className="space-y-3">
            <Label>Sosyal Medya</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={shareToFacebook}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              
              <Button
                onClick={shareToTwitter}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                Twitter
              </Button>
              
              <Button
                onClick={shareToWhatsApp}
                variant="outline"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
                WhatsApp
              </Button>
              
              <Button
                onClick={shareToEmail}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-gray-600" />
                E-posta
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
