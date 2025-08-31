"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, HelpCircle, Clock, Shield, Users, MessageCircle } from "lucide-react";
import { useState } from "react";

const SupportSection = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle message submission
    setMessage("");
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <MessageCircle className="h-8 w-8" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-gray-900">Destek Birimi</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Müzik yolculuğunuzda size yardımcı olmak için buradayız
              </p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Sorularınız, önerileriniz veya teknik destek için bizimle iletişime geçin
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-10">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mesaj Gönder</h3>
              <p className="text-sm text-muted-foreground">
                Aşağıdaki formu doldurarak bize ulaşabilirsiniz
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Ad Soyad *
                  </label>
                  <Input 
                    placeholder="Adınız ve soyadınız" 
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    E-posta *
                  </label>
                  <Input 
                    type="email" 
                    placeholder="ornek@email.com"
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Konu *
                </label>
                <Input 
                  placeholder="Mesajınızın konusu"
                  className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Mesajınız *
                </label>
                <Textarea 
                  placeholder="Bize iletmek istediğiniz mesajı buraya yazabilirsiniz..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
                  required
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="px-10 h-12 bg-primary hover:bg-primary/90 transition-colors duration-200 text-base font-medium"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Mesajı Gönder
                </Button>
              </div>
            </form>
          </div>

          {/* Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-4 group-hover:bg-blue-100 transition-colors duration-200">
                <Clock className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-base mb-2 text-gray-900">Hızlı Yanıt</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                24 saat içinde detaylı yanıt alırsınız
              </p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-50 text-green-600 mb-4 group-hover:bg-green-100 transition-colors duration-200">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-base mb-2 text-gray-900">Uzman Destek</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Deneyimli müzik uzmanlarından profesyonel destek
              </p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 text-purple-600 mb-4 group-hover:bg-purple-100 transition-colors duration-200">
                <Shield className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-base mb-2 text-gray-900">Güvenli İletişim</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kişisel bilgileriniz tamamen güvende ve korunur
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <HelpCircle className="h-4 w-4" />
              <span>Başka bir sorunuz mu var? Bize ulaşın</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
