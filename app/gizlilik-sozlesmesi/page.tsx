"use client";

import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import { privacyPolicyData } from "@/lib/staticData";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const handleKVKKContact = () => {
    window.location.href = "/kvkk";
  };

  const handleSupportContact = () => {
    window.location.href = "/iletisim";
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-gray-600" />
            <h1 className="text-3xl font-bold text-gray-900">{privacyPolicyData.title}</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Kişisel verilerinizin korunması ve gizliliğiniz bizim için çok önemlidir.
          </p>
        </div>

        {/* Privacy Icons */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Güvenli Veri</h3>
              <p className="text-gray-600 text-sm">
                Verileriniz güvenli sunucularda şifrelenmiş olarak saklanır
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Şeffaflık</h3>
              <p className="text-gray-600 text-sm">
                Verilerinizin nasıl kullanıldığı konusunda tam şeffaflık
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">KVKK Uyumlu</h3>
              <p className="text-gray-600 text-sm">
                6698 sayılı KVKK'ya tam uyumlu veri işleme
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Policy Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {privacyPolicyData.content}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Gizlilik Hakkında Sorularınız mı Var?
            </h2>
            <p className="text-gray-600 mb-6">
              Gizlilik politikamız hakkında sorularınız varsa bizimle iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleKVKKContact}
                className="bg-black hover:bg-gray-800"
              >
                KVKK Sayfasına Git
              </Button>
              <Button 
                onClick={handleSupportContact}
                variant="outline" 
                className="border-gray-200 hover:bg-gray-50"
              >
                İletişim Sayfasına Git
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
