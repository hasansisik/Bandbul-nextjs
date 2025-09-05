"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, HelpCircle, Clock, Shield, Users, MessageCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { createContact } from "@/redux/actions/contactActions";

const SupportSection = () => {
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

  return (
    <section className="py-20 bg-gradient-to-br from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <MessageCircle className="h-8 w-8" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-foreground">Destek Birimi</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Müzik yolculuğunuzda size yardımcı olmak için buradayız
              </p>
              <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
                Sorularınız, önerileriniz veya teknik destek için bizimle iletişime geçin
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card/50 backdrop-blur rounded-2xl shadow-sm border border-border/50 p-8 lg:p-10">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-2">Mesaj Gönder</h3>
              <p className="text-sm text-muted-foreground">
                Aşağıdaki formu doldurarak bize ulaşabilirsiniz
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Ad Soyad *
                    </label>
                    <Input 
                      placeholder="Adınız ve soyadınız" 
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="border-border focus:border-ring focus:ring-1 focus:ring-ring/20 h-11 bg-background/50 backdrop-blur"
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      E-posta *
                    </label>
                    <Input 
                      type="email" 
                      placeholder="ornek@email.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="border-border focus:border-ring focus:ring-1 focus:ring-ring/20 h-11 bg-background/50 backdrop-blur"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Telefon Numarası
                  </label>
                  <Input 
                    type="tel"
                    placeholder="+90 5XX XXX XX XX"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="border-border focus:border-ring focus:ring-1 focus:ring-ring/20 h-11 bg-background/50 backdrop-blur"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Konu *
                  </label>
                  <Input 
                    placeholder="Mesajınızın konusu"
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    className="border-border focus:border-ring focus:ring-1 focus:ring-ring/20 h-11 bg-background/50 backdrop-blur"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Mesajınız *
                  </label>
                  <Textarea 
                    placeholder="Bize iletmek istediğiniz mesajı buraya yazabilirsiniz..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className="border-border focus:border-ring focus:ring-1 focus:ring-ring/20 resize-none bg-background/50 backdrop-blur"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="flex justify-center pt-4">
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg rounded-md text-sm"
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
                </div>
              </form>
            )}
          </div>

          {/* Support Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Hızlı Yanıt</h3>
              <p className="text-sm text-muted-foreground">
                24 saat içinde yanıt alın
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Güvenli İletişim</h3>
              <p className="text-sm text-muted-foreground">
                Verileriniz güvende
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Uzman Destek</h3>
              <p className="text-sm text-muted-foreground">
                Deneyimli ekibimiz
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
