"use client";

import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Shield, Lock, FileText, Mail, Phone } from "lucide-react";
import { kvkkData } from "@/lib/staticData";

export default function KVKKPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-gray-600" />
            <h1 className="text-3xl font-bold text-gray-900">{kvkkData.title}</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında bilgilendirme
          </p>
        </div>

        {/* KVKK Overview */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Veri Güvenliği</h3>
              <p className="text-gray-600 text-sm">
                Kişisel verileriniz güvenli şekilde işlenir ve korunur
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Yasal Uyum</h3>
              <p className="text-gray-600 text-sm">
                6698 sayılı KVKK'ya tam uyumlu veri işleme süreçleri
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Haklarınız</h3>
              <p className="text-gray-600 text-sm">
                Kişisel veri sahibi olarak sahip olduğunuz tüm haklar
              </p>
            </div>
          </div>
        </div>

        {/* KVKK Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {kvkkData.content}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              KVKK İletişim Bilgileri
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">E-posta</h3>
                <p className="text-gray-600">kvkk@bandbul.com</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Telefon</h3>
                <p className="text-gray-600">+90 212 123 45 67</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Yazılı Başvuru</h3>
                <p className="text-gray-600">Şirket merkezimize</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              İlgili Sayfalar
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 border-gray-200 hover:bg-gray-50">
                Gizlilik Sözleşmesi
              </Button>
              <Button variant="outline" className="h-12 border-gray-200 hover:bg-gray-50">
                Destek Birimi
              </Button>
              <Button variant="outline" className="h-12 border-gray-200 hover:bg-gray-50">
                S.S.S.
              </Button>
              <Button variant="outline" className="h-12 border-gray-200 hover:bg-gray-50">
                İlan Kuralları
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
