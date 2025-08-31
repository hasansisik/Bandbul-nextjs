"use client";

import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { listingRulesData } from "@/lib/staticData";
import Link from "next/link";

export default function ListingRulesPage() {
  const handleSupportContact = () => {
    window.location.href = "/iletisim";
  };

  const handleFAQContact = () => {
    window.location.href = "/sss";
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-gray-600" />
            <h1 className="text-3xl font-bold text-gray-900">{listingRulesData.title}</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            {listingRulesData.description}
          </p>
        </div>

        {/* Rules */}
        <div className="max-w-4xl mx-auto space-y-6">
          {listingRulesData.rules.map((rule) => (
            <div key={rule.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">{rule.id}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {rule.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {rule.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Notice */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Önemli Uyarı
                </h3>
                <p className="text-yellow-700">
                  Bu kurallara uymayan ilanlar otomatik olarak kaldırılabilir ve hesabınız geçici olarak askıya alınabilir. 
                  Tekrarlanan ihlaller durumunda hesabınız kalıcı olarak kapatılabilir.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Sorularınız mı Var?
            </h2>
            <p className="text-gray-600 mb-6">
              İlan kuralları hakkında sorularınız varsa destek ekibimizle iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleSupportContact}
                className="bg-black hover:bg-gray-800"
              >
                İletişim Sayfasına Git
              </Button>
              <Button 
                onClick={handleFAQContact}
                variant="outline" 
                className="border-gray-200 hover:bg-gray-50"
              >
                S.S.S. Sayfasına Git
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
