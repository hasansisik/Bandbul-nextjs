"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { getSettings } from "@/redux/actions/settingsActions";

export function WhatsAppFloatingButton() {
  const dispatch = useDispatch();
  const { settings, loading } = useSelector((state: RootState) => state.settings);

  // Fetch settings on component mount
  useEffect(() => {
    if (!settings && !loading) {
      dispatch(getSettings() as any);
    }
  }, [dispatch, settings, loading]);

  // Get phone number from settings and format it
  const getWhatsAppNumber = () => {
    if (!settings?.contact?.phone) return null;
    
    let phone = settings.contact.phone;
    
    // Remove any existing country code
    phone = phone.replace(/^\+90/, '').replace(/^90/, '');
    
    // Add +90 prefix
    return `+90${phone}`;
  };

  // Open WhatsApp with the phone number
  const openWhatsApp = () => {
    const phoneNumber = getWhatsAppNumber();
    if (phoneNumber) {
      const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const phoneNumber = getWhatsAppNumber();

  return (
    <>
      {phoneNumber && (
        <div className="fixed bottom-6 left-6 z-50">
          <Button
            onClick={openWhatsApp}
            size="sm"
            className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="WhatsApp ile iletişime geç"
            title={`WhatsApp: ${phoneNumber}`}
          >
            <MessageCircle className="h-5 w-5 text-white" />
          </Button>
        </div>
      )}
    </>
  );
}
