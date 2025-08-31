"use client";

import { useState } from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  User,
  Building
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Form submitted:", formData);
    setSubmitSuccess(true);
    setIsSubmitting(false);
    
    // Reset form after successful submission
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        category: ""
      });
      setSubmitSuccess(false);
    }, 3000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuickCall = () => {
    window.location.href = "tel:+902121234567";
  };

  const handleQuickEmail = () => {
    window.location.href = "mailto:info@bandbul.com";
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageCircle className="h-8 w-8 text-gray-600" />
            <h1 className="text-3xl font-bold text-gray-900">İletişim</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Sorularınız, önerileriniz veya işbirliği talepleriniz için bizimle iletişime geçin.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Mesaj Gönderin</h2>
            
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Adınız ve soyadınız"
                    required
                    className="border-gray-200 focus:border-gray-400"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="ornek@email.com"
                    required
                    className="border-gray-200 focus:border-gray-400"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon Numarası
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+90 5XX XXX XX XX"
                  className="border-gray-200 focus:border-gray-400"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Konu *
                </label>
                <Select value={formData.category} onValueChange={(value) => handleChange("category", value)} disabled={isSubmitting}>
                  <SelectTrigger className="border-gray-200 focus:border-gray-400">
                    <SelectValue placeholder="Konu seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="genel">Genel Bilgi</SelectItem>
                    <SelectItem value="teknik">Teknik Destek</SelectItem>
                    <SelectItem value="ilan">İlan Desteği</SelectItem>
                    <SelectItem value="uyelik">Üyelik</SelectItem>
                    <SelectItem value="isbirligi">İşbirliği</SelectItem>
                    <SelectItem value="oneri">Öneri/Şikayet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık *
                </label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  placeholder="Mesajınızın başlığı"
                  required
                  className="border-gray-200 focus:border-gray-400"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mesaj *
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Mesajınızı buraya yazın..."
                  rows={6}
                  required
                  className="border-gray-200 focus:border-gray-400 resize-none"
                  disabled={isSubmitting}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 h-12"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Mesaj Gönder
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Company Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Bandbul</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Müzik tutkunları için tasarlanmış platform. Grup bulma, enstrüman alım-satım ve müzik prodüksiyonu için tek adres.
              </p>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">İletişim Bilgileri</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">E-posta</p>
                    <a href="mailto:info@bandbul.com" className="text-gray-900 font-medium hover:text-gray-700">
                      info@bandbul.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefon</p>
                    <a href="tel:+902121234567" className="text-gray-900 font-medium hover:text-gray-700">
                      +90 212 123 45 67
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Adres</p>
                    <p className="text-gray-900 font-medium">
                      İstanbul, Türkiye
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Çalışma Saatleri</p>
                    <p className="text-gray-900 font-medium">
                      Pazartesi - Cuma<br />
                      09:00 - 18:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İletişim</h3>
              <div className="space-y-3">
                <Button 
                  onClick={handleQuickCall}
                  className="w-full bg-black hover:bg-gray-800"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Hemen Ara
                </Button>
                <Button 
                  onClick={handleQuickEmail}
                  variant="outline" 
                  className="w-full border-gray-200 hover:bg-gray-50"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  E-posta Gönder
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
