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
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">{kvkkData.title}</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Kişisel Verilerin Korunması Kanunu kapsamında veri işleme faaliyetlerimiz.
          </p>
        </div>

        {/* KVKK Icons */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Veri Güvenliği</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Kişisel verileriniz güvenli şekilde işlenir ve korunur
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Şeffaflık</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Veri işleme süreçlerimiz tamamen şeffaf ve açıktır
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Yasal Uyum</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                6698 sayılı KVKK'ya tam uyumlu veri işleme
              </p>
            </div>
          </div>
        </div>

        {/* KVKK Content */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-card/50 backdrop-blur rounded-2xl border border-border/50 p-12 shadow-sm">
            <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground dark:prose-invert">
              <div className="whitespace-pre-line leading-relaxed text-lg">
                {kvkkData.content}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur rounded-2xl p-8 text-center border border-border/50 shadow-sm">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              KVKK Hakkında Sorularınız mı Var?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              KVKK kapsamında veri işleme faaliyetlerimiz hakkında sorularınız varsa bizimle iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handlePrivacyContact}
                className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg rounded-xl"
              >
                Gizlilik Politikası
              </Button>
              <Button 
                onClick={handleSupportContact}
                variant="outline" 
                className="border-border hover:bg-accent px-8 py-3 text-lg rounded-xl"
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
