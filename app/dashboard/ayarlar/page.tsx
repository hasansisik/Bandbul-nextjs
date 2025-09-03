"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings2, 
  Image as ImageIcon, 
  Globe, 
  Menu, 
  Link as LinkIcon,
  Mail,
  Phone,
  MapPin,
  Clock,
  Save,
  Upload,
  ChevronUp,
  ChevronDown,
  Plus
} from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface HeaderMenuItem {
  name: string;
  href: string;
}

interface CategoryItem {
  id: number;
  name: string;
}

interface FooterLink {
  name: string;
  href: string;
}

interface ContactInfo {
  icon: string;
  title: string;
  value: string;
  description: string;
}

interface SettingsData {
  logo: {
    current: string;
    new?: File;
  };
  metadata: {
    title: string;
    description: string;
    keywords: string;
    author: string;
  };
  header: {
    mainMenu: HeaderMenuItem[];
    categories: CategoryItem[];
  };
  footer: {
    main: FooterLink[];
    listings: FooterLink[];
    support: FooterLink[];
    social: {
      facebook: string;
      twitter: string;
      instagram: string;
      youtube: string;
    };
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    workingHours: string;
    companyDescription: string;
  };
}

export default function SettingsPage() {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  // Hazır kategoriler
  const availableCategories: CategoryItem[] = [
    { id: 1, name: "Müzik Prodüksiyon" },
    { id: 2, name: "Enstrüman" },
    { id: 3, name: "Müzik Eğitimi" },
    { id: 4, name: "Grup Kurma" },
    { id: 5, name: "Stüdyo Hizmetleri" },
    { id: 6, name: "Müzik Etkinlikleri" },
    { id: 7, name: "Müzik Teknolojisi" },
    { id: 8, name: "Müzik Tarihi" },
    { id: 9, name: "Müzik Terapisi" },
    { id: 10, name: "Müzik Endüstrisi" }
  ];

  const [settings, setSettings] = useState<SettingsData>({
    logo: {
      current: "/bandbul-logo.png"
    },
    metadata: {
      title: "Bandbul - Müzik Platformu",
      description: "Müzik tutkunları için tasarlanmış platform. Grup bulma, enstrüman alım-satım ve müzik prodüksiyonu için tek adres.",
      keywords: "müzik, grup, enstrüman, prodüksiyon, müzisyen",
      author: "Bandbul Team"
    },
    header: {
      mainMenu: [
        { name: "Anasayfa", href: "/" },
        { name: "İlanlar", href: "/ilanlar" },
        { name: "Blog", href: "/blog" },
        { name: "İletişim", href: "/iletisim" }
      ],
      categories: [
        { id: 1, name: "Müzik Prodüksiyon" },
        { id: 2, name: "Enstrüman" },
        { id: 3, name: "Müzik Eğitimi" },
        { id: 4, name: "Grup Kurma" },
        { id: 5, name: "Stüdyo Hizmetleri" },
        { id: 6, name: "Müzik Etkinlikleri" }
      ]
    },
    footer: {
      main: [
        { name: "Anasayfa", href: "/" },
        { name: "İlanlar", href: "/ilanlar" },
        { name: "Blog", href: "/blog" },
        { name: "İletişim", href: "/iletisim" }
      ],
      listings: [
        { name: "Grup Arıyorum", href: "/grup-arirorum" },
        { name: "Müzisyen Arıyorum", href: "/muzisyen-arirorum" },
        { name: "Ders Almak İstiyorum", href: "/ders-almak-istiyorum" }
      ],
      support: [
        { name: "S.S.S.", href: "/sss" },
        { name: "İlan Kuralları", href: "/ilan-kurallari" },
        { name: "Gizlilik Sözleşmesi", href: "/gizlilik-sozlesmesi" },
        { name: "KVKK", href: "/kvkk" }
      ],
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        youtube: "#"
      }
    },
    contact: {
      email: "info@bandbul.com",
      phone: "+90 212 123 45 67",
      address: "İstanbul, Türkiye",
      workingHours: "Pazartesi - Cuma, 09:00 - 18:00",
      companyDescription: "Müzik endüstrisinde profesyonel hizmet veren platformumuz, müzisyenler ve müzik severler için güvenilir bir ortam sağlar."
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSettings(prev => ({
        ...prev,
        logo: { ...prev.logo, new: file }
      }));
    }
  };

  const handleMetadataChange = (field: keyof SettingsData['metadata'], value: string) => {
    setSettings(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
  };

  const handleHeaderMenuChange = (index: number, field: keyof HeaderMenuItem, value: string) => {
    setSettings(prev => ({
      ...prev,
      header: {
        ...prev.header,
        mainMenu: prev.header.mainMenu.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const handleCategoryChange = (index: number, field: keyof CategoryItem, value: string) => {
    setSettings(prev => ({
      ...prev,
      header: {
        ...prev.header,
        categories: prev.header.categories.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const handleFooterLinkChange = (section: keyof Omit<SettingsData['footer'], 'social'>, index: number, field: keyof FooterLink, value: string) => {
    setSettings(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        [section]: prev.footer[section].map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const handleSocialChange = (platform: keyof SettingsData['footer']['social'], value: string) => {
    setSettings(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        social: { ...prev.footer.social, [platform]: value }
      }
    }));
  };

  const handleContactChange = (field: keyof SettingsData['contact'], value: string) => {
    setSettings(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    // Here you would typically save to your backend
  };

  const addHeaderMenuItem = () => {
    setSettings(prev => ({
      ...prev,
      header: {
        ...prev.header,
        mainMenu: [...prev.header.mainMenu, { name: "Yeni Menü", href: "/yeni" }]
      }
    }));
  };

  const removeHeaderMenuItem = (index: number) => {
    setSettings(prev => ({
      ...prev,
      header: {
        ...prev.header,
        mainMenu: prev.header.mainMenu.filter((_, i) => i !== index)
      }
    }));
  };

  const addCategoryFromModal = (category: CategoryItem) => {
    // Kategori zaten ekli mi kontrol et
    if (settings.header.categories.find(cat => cat.id === category.id)) {
      return;
    }
    
    setSettings(prev => ({
      ...prev,
      header: {
        ...prev.header,
        categories: [...prev.header.categories, category]
      }
    }));
    
    setIsCategoryModalOpen(false);
  };

  const removeCategoryItem = (index: number) => {
    setSettings(prev => ({
      ...prev,
      header: {
        ...prev.header,
        categories: prev.header.categories.filter((_, i) => i !== index)
      }
    }));
  };

  const moveCategoryUp = (index: number) => {
    if (index === 0) return;
    setSettings(prev => {
      const newCategories = [...prev.header.categories];
      [newCategories[index], newCategories[index - 1]] = [newCategories[index - 1], newCategories[index]];
      return {
        ...prev,
        header: {
          ...prev.header,
          categories: newCategories
        }
      };
    });
  };

  const moveCategoryDown = (index: number) => {
    if (index === settings.header.categories.length - 1) return;
    setSettings(prev => {
      const newCategories = [...prev.header.categories];
      [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
      return {
        ...prev,
        header: {
          ...prev.header,
          categories: newCategories
        }
      };
    });
  };

  return (
    <>
      {/* Header with Sidebar Toggle */}
      <div className="flex items-center gap-4 mb-2">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Ayarlar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Site Ayarları</h1>
            <p className="text-muted-foreground">
              Logo, metadata, menüler ve iletişim bilgilerini düzenleyin
            </p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-8"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Kaydediliyor...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Tüm Değişiklikleri Kaydet
              </div>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Logo Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Logo Ayarları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                {settings.logo.current ? (
                  <img 
                    src={settings.logo.current} 
                    alt="Current Logo" 
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="logo-upload">Logo Yükle</Label>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  PNG, JPG veya SVG formatında logo yükleyin
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metadata Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Meta Veriler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Site Başlığı</Label>
                <Input
                  id="title"
                  value={settings.metadata.title}
                  onChange={(e) => handleMetadataChange('title', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="author">Yazar</Label>
                <Input
                  id="author"
                  value={settings.metadata.author}
                  onChange={(e) => handleMetadataChange('author', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={settings.metadata.description}
                onChange={(e) => handleMetadataChange('description', e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="keywords">Anahtar Kelimeler</Label>
              <Input
                id="keywords"
                value={settings.metadata.keywords}
                onChange={(e) => handleMetadataChange('keywords', e.target.value)}
                className="mt-2"
                placeholder="Virgülle ayırarak yazın"
              />
            </div>
          </CardContent>
        </Card>

        {/* Header Menu Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Menu className="h-5 w-5" />
              Header Menü Ayarları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Menu */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Ana Menü</h3>
                <Button onClick={addHeaderMenuItem} size="sm">
                  Menü Ekle
                </Button>
              </div>
              <div className="space-y-3">
                {settings.header.mainMenu.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <Input
                        value={item.name}
                        onChange={(e) => handleHeaderMenuChange(index, 'name', e.target.value)}
                        placeholder="Menü Adı"
                      />
                      <Input
                        value={item.href}
                        onChange={(e) => handleHeaderMenuChange(index, 'href', e.target.value)}
                        placeholder="Link"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeHeaderMenuItem(index)}
                    >
                      Sil
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Categories */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Kategoriler</h3>
                <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Kategori Ekle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Kategori Ekle</DialogTitle>
                      <DialogDescription>
                        Mevcut kategorilerden seçim yaparak ekleyin
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {availableCategories.map((category) => {
                        const isAlreadyAdded = settings.header.categories.find(cat => cat.id === category.id);
                        return (
                          <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{category.name}</div>
                            </div>
                            <div className="flex gap-2">
                              {isAlreadyAdded ? (
                                <Badge variant="secondary" className="text-xs">
                                  Zaten Eklendi
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => addCategoryFromModal(category)}
                                >
                                  Ekle
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
                              <div className="space-y-3">
                  {settings.header.categories.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <Input
                          value={item.name}
                          onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                          placeholder="Kategori Adı"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveCategoryUp(index)}
                          disabled={index === 0}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveCategoryDown(index)}
                          disabled={index === settings.header.categories.length - 1}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeCategoryItem(index)}
                        >
                          Sil
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Footer Ayarları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Ana Linkler</h3>
              <div className="space-y-3">
                {settings.footer.main.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <Input
                        value={item.name}
                        onChange={(e) => handleFooterLinkChange('main', index, 'name', e.target.value)}
                        placeholder="Link Adı"
                      />
                      <Input
                        value={item.href}
                        onChange={(e) => handleFooterLinkChange('main', index, 'href', e.target.value)}
                        placeholder="Link"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Listings Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">İlan Linkleri</h3>
              <div className="space-y-3">
                {settings.footer.listings.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <Input
                        value={item.name}
                        onChange={(e) => handleFooterLinkChange('listings', index, 'name', e.target.value)}
                        placeholder="Link Adı"
                      />
                      <Input
                        value={item.href}
                        onChange={(e) => handleFooterLinkChange('listings', index, 'href', e.target.value)}
                        placeholder="Link"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Support Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Destek Linkleri</h3>
              <div className="space-y-3">
                {settings.footer.support.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <Input
                        value={item.name}
                        onChange={(e) => handleFooterLinkChange('support', index, 'name', e.target.value)}
                        placeholder="Link Adı"
                      />
                      <Input
                        value={item.href}
                        onChange={(e) => handleFooterLinkChange('support', index, 'href', e.target.value)}
                        placeholder="Link"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Sosyal Medya</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={settings.footer.social.facebook}
                    onChange={(e) => handleSocialChange('facebook', e.target.value)}
                    className="mt-2"
                    placeholder="Facebook URL"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={settings.footer.social.twitter}
                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                    className="mt-2"
                    placeholder="Twitter URL"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={settings.footer.social.instagram}
                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                    className="mt-2"
                    placeholder="Instagram URL"
                  />
                </div>
                <div>
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={settings.footer.social.youtube}
                    onChange={(e) => handleSocialChange('youtube', e.target.value)}
                    className="mt-2"
                    placeholder="YouTube URL"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              İletişim Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-email">E-posta</Label>
                <Input
                  id="contact-email"
                  value={settings.contact.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className="mt-2"
                  placeholder="info@bandbul.com"
                />
              </div>
              <div>
                <Label htmlFor="contact-phone">Telefon</Label>
                <Input
                  id="contact-phone"
                  value={settings.contact.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  className="mt-2"
                  placeholder="+90 212 123 45 67"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="contact-address">Adres</Label>
              <Input
                id="contact-address"
                value={settings.contact.address}
                onChange={(e) => handleContactChange('address', e.target.value)}
                className="mt-2"
                placeholder="İstanbul, Türkiye"
              />
            </div>
            <div>
              <Label htmlFor="contact-hours">Çalışma Saatleri</Label>
              <Input
                id="contact-hours"
                value={settings.contact.workingHours}
                onChange={(e) => handleContactChange('workingHours', e.target.value)}
                className="mt-2"
                placeholder="Pazartesi - Cuma, 09:00 - 18:00"
              />
            </div>
            <div>
              <Label htmlFor="contact-description">Şirket Açıklaması</Label>
              <Textarea
                id="contact-description"
                value={settings.contact.companyDescription}
                onChange={(e) => handleContactChange('companyDescription', e.target.value)}
                className="mt-2"
                rows={3}
                placeholder="Şirket hakkında kısa açıklama"
              />
            </div>
          </CardContent>
        </Card>


      </div>
    </>
  );
}
