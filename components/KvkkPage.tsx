"use client";

import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import { kvkkData } from "@/lib/staticData";
import Link from "next/link";

export default function KVKKPage() {
  const handlePrivacyContact = () => {
    window.location.href = "/gizlilik-sozlesmesi";
  };

  const handleSupportContact = () => {
    window.location.href = "/iletisim";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-foreground">{kvkkData.title}</h1>
          </div>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Kişisel Verilerin Korunması Kanunu kapsamında veri işleme faaliyetlerimiz.
          </p>
        </div>

        {/* KVKK Icons */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Veri Güvenliği</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Kişisel verileriniz güvenli şekilde işlenir ve korunur
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Şeffaflık</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Veri işleme süreçlerimiz tamamen şeffaf ve açıktır
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Yasal Uyum</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                6698 sayılı KVKK'ya tam uyumlu veri işleme
              </p>
            </div>
          </div>
        </div>

        {/* KVKK Content */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-card/50 backdrop-blur rounded-2xl border border-border/50 p-8 shadow-sm">
            <div className="prose max-w-none prose-headings:text-foreground prose-p:text-muted-foreground dark:prose-invert">
              <div className="whitespace-pre-line leading-relaxed text-sm">
                {kvkkData.content}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur rounded-2xl p-6 text-center border border-border/50 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              KVKK Hakkında Sorularınız mı Var?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              KVKK kapsamında veri işleme faaliyetlerimiz hakkında sorularınız varsa bizimle iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handlePrivacyContact}
                className="bg-primary hover:bg-primary/90 px-6 py-2 text-sm rounded-md"
              >
                Gizlilik Politikası
              </Button>
              <Button 
                onClick={handleSupportContact}
                variant="outline" 
                className="border-border hover:bg-accent px-6 py-2 text-sm rounded-md"
              >
                İletişim Sayfasına Git
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
