"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {  Send, HelpCircle } from "lucide-react";
import { useState } from "react";

const SupportSection = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle message submission
    setMessage("");
  };

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <HelpCircle className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Destek Birimi</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Eğer birşeylerin eksik veya hatalı olduğunu düşünüyorsan, bize mesaj atabilirsin.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ad Soyad</label>
                    <Input placeholder="Adınız ve soyadınız" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">E-posta</label>
                    <Input type="email" placeholder="ornek@email.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Konu</label>
                  <Input placeholder="Mesajınızın konusu" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mesajınız</label>
                  <Textarea 
                    placeholder="Bize iletmek istediğiniz mesajı buraya yazabilirsiniz..."
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="flex justify-center">
                  <Button type="submit" size="lg" className="px-8">
                    <Send className="h-4 w-4 mr-2" />
                    Gönder
                  </Button>
                </div>
              </form>

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <h4 className="font-semibold mb-2">Hızlı Yanıt</h4>
                    <p className="text-sm text-muted-foreground">
                      24 saat içinde yanıt alırsınız
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Uzman Destek</h4>
                    <p className="text-sm text-muted-foreground">
                      Müzik uzmanlarından destek
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Güvenli İletişim</h4>
                    <p className="text-sm text-muted-foreground">
                      Kişisel bilgileriniz güvende
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
