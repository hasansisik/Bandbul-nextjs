"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { createContact } from "@/redux/actions/contactActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle
} from "lucide-react";

export default function ContactPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, message, error } = useSelector((state: RootState) => state.contact);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(createContact(formData)).unwrap();
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      }, 3000);
    } catch (error) {
      console.error('Contact submission error:', error);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "E-posta",
      value: "info@bandbul.com",
      description: "Genel sorularınız için"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Telefon",
      value: "+90 212 123 45 67",
      description: "Hızlı destek için"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Adres",
      value: "İstanbul, Türkiye",
      description: "Merkez ofisimiz"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Çalışma Saatleri",
      value: "Pazartesi - Cuma",
      description: "09:00 - 18:00"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            İletişim
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Sorularınız, önerileriniz veya işbirliği talepleriniz için bizimle iletişime geçin. 
            En kısa sürede size dönüş yapacağız.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card/50 backdrop-blur rounded-2xl border border-border/50 p-8 shadow-sm">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">Mesaj Gönder</h2>
                <p className="text-muted-foreground">
                  Formu doldurun, size en kısa sürede dönüş yapalım.
                </p>
              </div>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">Mesajınız Gönderildi!</h3>
                  <p className="text-muted-foreground">
                    Teşekkür ederiz. En kısa sürede size dönüş yapacağız.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Ad Soyad
                      </label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Adınız ve soyadınız"
                        className="border-border focus:border-ring bg-background/50 backdrop-blur"
                        disabled={loading}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        E-posta
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="ornek@email.com"
                        className="border-border focus:border-ring bg-background/50 backdrop-blur"
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Telefon Numarası
                    </label>
                                          <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+90 5XX XXX XX XX"
                        className="border-border focus:border-ring bg-background/50 backdrop-blur"
                        disabled={loading}
                      />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Konu
                    </label>
                                          <Input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleChange("subject", e.target.value)}
                        placeholder="Mesajınızın konusu"
                        className="border-border focus:border-ring bg-background/50 backdrop-blur"
                        disabled={loading}
                        required
                      />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Mesaj
                    </label>
                                          <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="Mesajınızı buraya yazın..."
                        rows={6}
                        className="border-border focus:border-ring bg-background/50 backdrop-blur resize-none"
                        disabled={loading}
                        required
                      />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 py-3 text-lg rounded-xl"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Gönderiliyor...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Mesaj Gönder
                      </div>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Company Info */}
              <div className="bg-card/50 backdrop-blur rounded-2xl border border-border/50 p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-foreground">Bandbul</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Müzik endüstrisinde profesyonel hizmet veren platformumuz, 
                  müzisyenler ve müzik severler için güvenilir bir ortam sağlar.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-border">Müzik Platformu</Badge>
                  <Badge variant="outline" className="border-border">Güvenilir</Badge>
                  <Badge variant="outline" className="border-border">Profesyonel</Badge>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-card/50 backdrop-blur rounded-2xl border border-border/50 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">İletişim Bilgileri</h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{info.title}</h4>
                        <p className="text-foreground font-medium mb-1">{info.value}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-card/50 backdrop-blur rounded-2xl border border-border/50 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Sık Sorulan Sorular</h3>
                <p className="text-muted-foreground mb-4">
                  Genel sorularınızın cevaplarını S.S.S. bölümümüzde bulabilirsiniz.
                </p>
                <Button variant="outline" className="border-border hover:bg-accent">
                  S.S.S. Sayfasına Git
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
