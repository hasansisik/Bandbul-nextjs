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
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-foreground">{listingRulesData.title}</h1>
          </div>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {listingRulesData.description}
          </p>
        </div>

        {/* Rules */}
        <div className="max-w-4xl mx-auto space-y-4 mb-8">
          {listingRulesData.rules.map((rule) => (
            <div key={rule.id} className="bg-card/50 backdrop-blur rounded-2xl border border-border/50 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">{rule.id}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {rule.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {rule.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Notice */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-yellow-50/50 backdrop-blur border border-yellow-200/50 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                  Önemli Uyarı
                </h3>
                <p className="text-yellow-700 text-sm leading-relaxed">
                  Bu kurallara uymayan ilanlar otomatik olarak kaldırılabilir ve hesabınız geçici olarak askıya alınabilir. 
                  Tekrarlanan ihlaller durumunda hesabınız kalıcı olarak kapatılabilir.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur rounded-2xl p-6 text-center border border-border/50 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Sorularınız mı Var?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              İlan kuralları hakkında sorularınız varsa destek ekibimizle iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleSupportContact}
                className="bg-primary hover:bg-primary/90 px-6 py-2 text-sm rounded-md"
              >
                İletişim Sayfasına Git
              </Button>
              <Button 
                onClick={handleFAQContact}
                variant="outline" 
                className="border-border hover:bg-accent px-6 py-2 text-sm rounded-md"
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
