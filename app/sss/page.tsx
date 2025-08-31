"use client";

import { useState } from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
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
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="h-8 w-8 text-gray-600" />
            <h1 className="text-3xl font-bold text-gray-900">Sıkça Sorulan Sorular</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Bandbul platformu hakkında en çok sorulan sorular ve cevapları
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqData.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 text-lg">
                  {item.question}
                </h3>
                {openItems.includes(item.id) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openItems.includes(item.id) && (
                <div className="px-6 pb-4 border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed pt-4">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Sorunuzu Bulamadınız mı?
            </h2>
            <p className="text-gray-600 mb-6">
              Aradığınız cevabı bulamadıysanız, destek ekibimizle iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleSupportContact}
                className="bg-black hover:bg-gray-800"
              >
                İletişim Sayfasına Git
              </Button>
              <Button 
                onClick={handleEmailContact}
                variant="outline" 
                className="border-gray-200 hover:bg-gray-50"
              >
                E-posta Gönder
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
