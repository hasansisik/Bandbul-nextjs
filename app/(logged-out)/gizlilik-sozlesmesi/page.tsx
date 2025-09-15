"use client";

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
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-foreground">{privacyPolicyData.title}</h1>
          </div>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Kişisel verilerinizin korunması ve gizliliğiniz bizim için çok önemlidir.
          </p>
        </div>

        {/* Privacy Icons */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Güvenli Veri</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Verileriniz güvenli sunucularda şifrelenmiş olarak saklanır
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Şeffaflık</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Verilerinizin nasıl kullanıldığı konusunda tam şeffaflık
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">KVKK Uyumlu</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                6698 sayılı KVKK'ya tam uyumlu veri işleme
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Policy Content */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-card/50 backdrop-blur rounded-2xl border border-border/50 p-8 shadow-sm">
            <div className="prose max-w-none prose-headings:text-foreground prose-p:text-muted-foreground dark:prose-invert">
              <div className="whitespace-pre-line leading-relaxed text-sm">
                {privacyPolicyData.content}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur rounded-2xl p-6 text-center border border-border/50 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Gizlilik Hakkında Sorularınız mı Var?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Gizlilik politikamız hakkında sorularınız varsa bizimle iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleKVKKContact}
                className="bg-primary hover:bg-primary/90 px-6 py-2 text-sm rounded-md"
              >
                KVKK Sayfasına Git
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
