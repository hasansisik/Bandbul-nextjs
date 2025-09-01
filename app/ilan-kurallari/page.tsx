"use client";

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
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">{listingRulesData.title}</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {listingRulesData.description}
          </p>
        </div>

        {/* Rules */}
        <div className="max-w-4xl mx-auto space-y-6 mb-12">
          {listingRulesData.rules.map((rule) => (
            <div key={rule.id} className="bg-card/50 backdrop-blur rounded-2xl border border-border/50 p-8 shadow-sm">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">{rule.id}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {rule.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {rule.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Notice */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-yellow-50/50 backdrop-blur border border-yellow-200/50 rounded-2xl p-8">
            <div className="flex items-start gap-6">
              <AlertTriangle className="h-8 w-8 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-yellow-800 mb-4">
                  Önemli Uyarı
                </h3>
                <p className="text-yellow-700 text-lg leading-relaxed">
                  Bu kurallara uymayan ilanlar otomatik olarak kaldırılabilir ve hesabınız geçici olarak askıya alınabilir. 
                  Tekrarlanan ihlaller durumunda hesabınız kalıcı olarak kapatılabilir.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur rounded-2xl p-8 text-center border border-border/50 shadow-sm">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Sorularınız mı Var?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              İlan kuralları hakkında sorularınız varsa destek ekibimizle iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleSupportContact}
                className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg rounded-xl"
              >
                İletişim Sayfasına Git
              </Button>
              <Button 
                onClick={handleFAQContact}
                variant="outline" 
                className="border-border hover:bg-accent px-8 py-3 text-lg rounded-xl"
              >
                S.S.S. Sayfasına Git
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
