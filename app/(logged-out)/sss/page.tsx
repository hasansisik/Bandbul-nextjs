"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { faqData } from "@/lib/staticData";
import Link from "next/link";

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSupportContact = () => {
    window.location.href = "/iletisim";
  };

  const handleEmailContact = () => {
    window.location.href = "mailto:destek@bandbul.com";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-foreground">Sıkça Sorulan Sorular</h1>
          </div>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Bandbul platformu hakkında en çok sorulan sorular ve cevapları
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-3 mb-8">
          {faqData.map((item) => (
            <div key={item.id} className="bg-card/50 backdrop-blur rounded-2xl border border-border/50 overflow-hidden shadow-sm">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <h3 className="font-semibold text-foreground text-base">
                  {item.question}
                </h3>
                {openItems.includes(item.id) ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
              </button>
              {openItems.includes(item.id) && (
                <div className="px-6 pb-4 border-t border-border/50">
                  <p className="text-muted-foreground leading-relaxed pt-4 text-sm">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur rounded-2xl p-6 text-center border border-border/50 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Sorunuzu Bulamadınız mı?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Aradığınız cevabı bulamadıysanız, destek ekibimizle iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleSupportContact}
                className="bg-primary hover:bg-primary/90 px-6 py-2 text-sm rounded-md"
              >
                İletişim Sayfasına Git
              </Button>
              <Button 
                onClick={handleEmailContact}
                variant="outline" 
                className="border-border hover:bg-accent px-6 py-2 text-sm rounded-md"
              >
                E-posta Gönder
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
