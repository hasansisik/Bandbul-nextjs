"use client"

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getSettingsAdmin,
  updateSettings,
  createSettings,
  getSettingsStats
} from "@/redux/actions/settingsActions";
import { getAllCategories } from "@/redux/actions/userActions";
import { toast } from "sonner";
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
  _id: string;
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
    light: string;
    dark: string;
  };
  metadata: {
    title: string;
    description: string;
    keywords: string;
    author: string;
  };
  header: {
    mainMenu: HeaderMenuItem[];
    categories: string[];
  };
  footer: {
    main: FooterLink[];
    listings: string[];
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
  seo: {
    googleAnalytics: string;
    googleTagManager: string;
    metaTags: string;
  };

}

export default function SettingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    settings,
    stats,
    loading,
    error,
    message
  } = useSelector((state: RootState) => state.settings);

  const { categories } = useSelector((state: RootState) => state.user);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isFooterListingCategoryModalOpen, setIsFooterListingCategoryModalOpen] = useState(false);

  const [localSettings, setLocalSettings] = useState<SettingsData>({
    logo: {
      light: "",
      dark: ""
    },
    metadata: {
      title: "Bandbul - Müzisyen Buluşma Platformu",
      description: "Müzisyenlerin buluştuğu, ilan verdiği ve müzik dünyasında kendilerini geliştirdiği platform",
      keywords: "müzik, müzisyen, ilan, grup, konser, müzik aleti, müzik eğitimi",
      author: "Bandbul"
    },
    header: {
      mainMenu: [],
      categories: []
    },
    footer: {
      main: [
        { name: "Anasayfa", href: "/" },
        { name: "İlanlar", href: "/ilanlar" },
        { name: "Blog", href: "/blog" },
        { name: "İletişim", href: "/iletisim" }
      ],
      listings: [],
      support: [
        { name: "S.S.S.", href: "/sss" },
        { name: "İlan Kuralları", href: "/ilan-kurallari" },
        { name: "Gizlilik Sözleşmesi", href: "/gizlilik-sozlesmesi" },
        { name: "KVKK", href: "/kvkk" }
      ],
      social: {
        facebook: "",
        twitter: "",
        instagram: "",
        youtube: ""
      }
    },
    contact: {
      email: "info@bandbul.com",
      phone: "+90 212 123 45 67",
      address: "İstanbul, Türkiye",
      workingHours: "Pazartesi - Cuma, 09:00 - 18:00",
      companyDescription: "Müzisyenlerin buluştuğu, ilan verdiği ve müzik dünyasında kendilerini geliştirdiği platform. Amatör ve profesyonel müzisyenlerin bir araya geldiği, müzik projelerini hayata geçirdiği güvenli bir ortam."
    },
    seo: {
      googleAnalytics: "",
      googleTagManager: "",
      metaTags: ""
    },

  });

  // Load settings and categories on component mount
  useEffect(() => {
    dispatch(getSettingsAdmin());
    dispatch(getAllCategories({}));
    dispatch(getSettingsStats());
    document.title = "Admin-Ayarlar";
  }, [dispatch]);

  // Handle success and error messages with Sonner
  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
    }
  }, [message, error]);

  // Update local settings when Redux settings change
  useEffect(() => {
    if (settings) {
      // Use backend settings directly, only add defaults for missing fields
      setLocalSettings({
        logo: {
          light: settings.logo?.light || "",
          dark: settings.logo?.dark || ""
        },
        metadata: {
          title: settings.metadata?.title || "Bandbul - Müzisyen Buluşma Platformu",
          description: settings.metadata?.description || "Müzisyenlerin buluştuğu, ilan verdiği ve müzik dünyasında kendilerini geliştirdiği platform",
          keywords: settings.metadata?.keywords || "müzik, müzisyen, ilan, grup, konser, müzik aleti, müzik eğitimi",
          author: settings.metadata?.author || "Bandbul"
        },
        header: {
          mainMenu: settings.header?.mainMenu || [],
          categories: settings.header?.categories || []
        },
        footer: {
          main: settings.footer?.main?.length > 0 ? settings.footer.main : [
            { name: "Anasayfa", href: "/" },
            { name: "İlanlar", href: "/ilanlar" },
            { name: "Blog", href: "/blog" },
            { name: "İletişim", href: "/iletisim" }
          ],
          listings: settings.footer?.listings || [],
          support: settings.footer?.support?.length > 0 ? settings.footer.support : [
            { name: "S.S.S.", href: "/sss" },
            { name: "İlan Kuralları", href: "/ilan-kurallari" },
            { name: "Gizlilik Sözleşmesi", href: "/gizlilik-sozlesmesi" },
            { name: "KVKK", href: "/kvkk" }
          ],
          social: {
            facebook: settings.footer?.social?.facebook || "",
            twitter: settings.footer?.social?.twitter || "",
            instagram: settings.footer?.social?.instagram || "",
            youtube: settings.footer?.social?.youtube || ""
          }
        },
        contact: {
          email: settings.contact?.email || "info@bandbul.com",
          phone: settings.contact?.phone || "+90 212 123 45 67",
          address: settings.contact?.address || "İstanbul, Türkiye",
          workingHours: settings.contact?.workingHours || "Pazartesi - Cuma, 09:00 - 18:00",
          companyDescription: settings.contact?.companyDescription || "Müzisyenlerin buluştuğu, ilan verdiği ve müzik dünyasında kendilerini geliştirdiği platform. Amatör ve profesyonel müzisyenlerin bir araya geldiği, müzik projelerini hayata geçirdiği güvenli bir ortam."
        },
        seo: {
          googleAnalytics: settings.seo?.googleAnalytics || "",
          googleTagManager: settings.seo?.googleTagManager || "",
          metaTags: settings.seo?.metaTags || ""
        },

      });
    } else {
      // If no settings exist, keep the default state
      setLocalSettings(prev => prev);
    }
  }, [settings]);

  const [isSaving, setIsSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState<{ light: boolean; dark: boolean }>({
    light: false,
    dark: false
  });

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>, logoType: 'light' | 'dark') => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Set loading state
        setLogoUploading(prev => ({ ...prev, [logoType]: true }));

        // Show immediate feedback
        toast.info(`${logoType === 'light' ? 'Açık' : 'Koyu'} logo yükleniyor: ${file.name}`);

        // Import and use your Cloudinary utility
        const { uploadImageToCloudinary } = await import('@/utils/cloudinary');
        const cloudinaryUrl = await uploadImageToCloudinary(file);

        // Update local settings with Cloudinary URL
        setLocalSettings(prev => ({
          ...prev,
          logo: { ...prev.logo, [logoType]: cloudinaryUrl }
        }));

        toast.success(`${logoType === 'light' ? 'Açık' : 'Koyu'} logo başarıyla yüklendi`);
      } catch (error) {
        console.error('Logo upload error:', error);
        toast.error('Logo yüklenirken bir hata oluştu');
      } finally {
        // Clear loading state
        setLogoUploading(prev => ({ ...prev, [logoType]: false }));
      }
    }
  };

  const handleMetadataChange = (field: keyof SettingsData['metadata'], value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
  };

  const handleHeaderMenuChange = (index: number, field: keyof HeaderMenuItem, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      header: {
        ...prev.header,
        mainMenu: prev.header.mainMenu.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const handleFooterLinkChange = (section: 'main' | 'support', index: number, field: keyof FooterLink, value: string) => {
    setLocalSettings(prev => ({
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
    setLocalSettings(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        social: { ...prev.footer.social, [platform]: value }
      }
    }));
  };

  const handleContactChange = (field: keyof SettingsData['contact'], value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (settings?._id) {
        // Update existing settings
        const updateData = {
          logo: {
            light: localSettings.logo.light,
            dark: localSettings.logo.dark
          },
          metadata: localSettings.metadata,
          header: localSettings.header,
          footer: localSettings.footer,
          contact: localSettings.contact,
          seo: localSettings.seo
        };
        await dispatch(updateSettings({ id: settings._id, formData: updateData })).unwrap();
        toast.success('Ayarlar başarıyla güncellendi');
      } else {
        // Create new settings
        const createData = {
          logo: {
            light: localSettings.logo.light,
            dark: localSettings.logo.dark
          },
          metadata: localSettings.metadata,
          header: localSettings.header,
          footer: localSettings.footer,
          contact: localSettings.contact,
          seo: localSettings.seo
        };
        await dispatch(createSettings(createData)).unwrap();
        toast.success('Ayarlar başarıyla oluşturuldu');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Ayarlar kaydedilirken bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const addHeaderMenuItem = () => {
    setLocalSettings(prev => ({
      ...prev,
      header: {
        ...prev.header,
        mainMenu: [...prev.header.mainMenu, { name: "Yeni Menü", href: "/yeni" }]
      }
    }));
  };

  const addDefaultMenuItems = () => {
    setLocalSettings(prev => ({
      ...prev,
      header: {
        ...prev.header,
        mainMenu: [
          { name: "Anasayfa", href: "/" },
          { name: "İlanlar", href: "/ilanlar" },
          { name: "Blog", href: "/blog" },
          { name: "İletişim", href: "/iletisim" }
        ]
      },
      footer: {
        ...prev.footer,
        main: [
          { name: "Anasayfa", href: "/" },
          { name: "İlanlar", href: "/ilanlar" },
          { name: "Blog", href: "/blog" },
          { name: "İletişim", href: "/iletisim" }
        ],
        listings: [],
        support: [
          { name: "S.S.S.", href: "/sss" },
          { name: "İlan Kuralları", href: "/ilan-kurallari" },
          { name: "Gizlilik Sözleşmesi", href: "/gizlilik-sozlesmesi" },
          { name: "KVKK", href: "/kvkk" }
        ]
      },
      metadata: {
        title: "Bandbul - Müzisyen Buluşma Platformu",
        description: "Müzisyenlerin buluştuğu, ilan verdiği ve müzik dünyasında kendilerini geliştirdiği platform",
        keywords: "müzik, müzisyen, ilan, grup, konser, müzik aleti, müzik eğitimi",
        author: "Bandbul"
      },
      contact: {
        email: "info@bandbul.com",
        phone: "+90 212 123 45 67",
        address: "İstanbul, Türkiye",
        workingHours: "Pazartesi - Cuma, 09:00 - 18:00",
        companyDescription: "Müzisyenlerin buluştuğu, ilan verdiği ve müzik dünyasında kendilerini geliştirdiği platform. Amatör ve profesyonel müzisyenlerin bir araya geldiği, müzik projelerini hayata geçirdiği güvenli bir ortam."
      }
    }));
  };


  const addFooterMenuItem = () => {
    setLocalSettings(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        main: [...prev.footer.main, { name: "Yeni Link", href: "/yeni" }]
      }
    }));
  };

  const addSupportMenuItem = () => {
    setLocalSettings(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        support: [...prev.footer.support, { name: "Yeni Destek Linki", href: "/yeni" }]
      }
    }));
  };

  const removeFooterMenuItem = (section: 'main' | 'support', index: number) => {
    setLocalSettings(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        [section]: prev.footer[section].filter((_, i) => i !== index)
      }
    }));
  };

  const removeHeaderMenuItem = (index: number) => {
    setLocalSettings(prev => ({
      ...prev,
      header: {
        ...prev.header,
        mainMenu: prev.header.mainMenu.filter((_, i) => i !== index)
      }
    }));
  };

  const addCategoryFromModal = (category: any) => {
    // Kategori zaten ekli mi kontrol et
    if (localSettings.header.categories.find((cat: any) => cat._id === category._id)) {
      return;
    }

    setLocalSettings(prev => ({
      ...prev,
      header: {
        ...prev.header,
        categories: [...prev.header.categories, category._id]
      }
    }));

    setIsCategoryModalOpen(false);
  };

  const addFooterListingCategoryFromModal = (category: any) => {
    // Kategori zaten ekli mi kontrol et
    if (localSettings.footer.listings.find((cat: any) => cat === category._id)) {
      return;
    }

    setLocalSettings(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        listings: [...prev.footer.listings, category._id]
      }
    }));

    setIsFooterListingCategoryModalOpen(false);
  };

  const removeCategoryItem = (index: number) => {
    setLocalSettings(prev => ({
      ...prev,
      header: {
        ...prev.header,
        categories: prev.header.categories.filter((_, i) => i !== index)
      }
    }));
  };

  const removeFooterListingCategoryItem = (index: number) => {
    setLocalSettings(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        listings: prev.footer.listings.filter((_, i) => i !== index)
      }
    }));
  };

  const moveCategoryUp = (index: number) => {
    if (index === 0) return;
    setLocalSettings(prev => {
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
    if (index === localSettings.header.categories.length - 1) return;
    setLocalSettings(prev => {
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

  const moveFooterListingCategoryUp = (index: number) => {
    if (index === 0) return;
    setLocalSettings(prev => {
      const newCategories = [...prev.footer.listings];
      [newCategories[index], newCategories[index - 1]] = [newCategories[index - 1], newCategories[index]];
      return {
        ...prev,
        footer: {
          ...prev.footer,
          listings: newCategories
        }
      };
    });
  };

  const moveFooterListingCategoryDown = (index: number) => {
    if (index === localSettings.footer.listings.length - 1) return;
    setLocalSettings(prev => {
      const newCategories = [...prev.footer.listings];
      [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
      return {
        ...prev,
        footer: {
          ...prev.footer,
          listings: newCategories
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
            <div className="grid md:grid-cols-2 gap-6">
              {/* Light Logo */}
              <div className="text-center">
                <Label htmlFor="light-logo-upload" className="block mb-2">Açık Tema Logo</Label>
                <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center mx-auto mb-3">
                  {localSettings.logo.light ? (
                    <img
                      src={localSettings.logo.light}
                      alt="Light Logo"
                      className="w-20 h-20 object-contain"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <Input
                  id="light-logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLogoChange(e, 'light')}
                  className="text-sm"
                  disabled={logoUploading.light}
                />
                {logoUploading.light && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-3 h-3 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                      Logo yükleniyor...
                    </div>
                  </div>
                )}
                {localSettings.logo.light && (
                  <div className="mt-2">
                    <Label className="text-xs text-muted-foreground">Cloudinary URL:</Label>
                    <Input
                      value={localSettings.logo.light}
                      readOnly
                      className="text-xs mt-1"
                      placeholder="Cloudinary URL burada görünecek"
                    />
                  </div>
                )}
              </div>

              {/* Dark Logo */}
              <div className="text-center">
                <Label htmlFor="dark-logo-upload" className="block mb-2">Koyu Tema Logo</Label>
                <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center mx-auto mb-3 bg-gray-800">
                  {localSettings.logo.dark ? (
                    <img
                      src={localSettings.logo.dark}
                      alt="Dark Logo"
                      className="w-20 h-20 object-contain"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <Input
                  id="dark-logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLogoChange(e, 'dark')}
                  className="text-sm"
                  disabled={logoUploading.dark}
                />
                {logoUploading.dark && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-3 h-3 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                      Logo yükleniyor...
                    </div>
                  </div>
                )}
                {localSettings.logo.dark && (
                  <div className="mt-2">
                    <Label className="text-xs text-muted-foreground">Cloudinary URL:</Label>
                    <Input
                      value={localSettings.logo.dark}
                      readOnly
                      className="text-xs mt-1"
                      placeholder="Cloudinary URL burada görünecek"
                    />
                  </div>
                )}
              </div>


            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              PNG, JPG veya SVG formatında logo yükleyin. Açık ve koyu tema için ayrı logolar önerilir.
            </p>
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
                  value={localSettings.metadata.title}
                  onChange={(e) => handleMetadataChange('title', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="author">Yazar</Label>
                <Input
                  id="author"
                  value={localSettings.metadata.author}
                  onChange={(e) => handleMetadataChange('author', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={localSettings.metadata.description}
                onChange={(e) => handleMetadataChange('description', e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="keywords">Anahtar Kelimeler</Label>
              <Input
                id="keywords"
                value={localSettings.metadata.keywords}
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
                <div className="flex gap-2">
                  {localSettings.header.mainMenu.length === 0 && (
                    <Button onClick={addDefaultMenuItems} size="sm" variant="outline">
                      Varsayılan Menüleri Ekle
                    </Button>
                  )}
                  <Button onClick={addHeaderMenuItem} size="sm">
                    Menü Ekle
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                {localSettings.header.mainMenu.map((item: HeaderMenuItem, index: number) => (
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
                      {categories.map((category: any) => {
                        const isAlreadyAdded = localSettings.header.categories.find((cat: any) => cat === category._id);
                        return (
                          <div key={category._id} className="flex items-center justify-between p-3 border rounded-lg">
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
                {localSettings.header.categories.map((categoryId: string, index: number) => {
                  const category = categories.find((cat: any) => cat._id === categoryId);
                  return (
                    <div key={categoryId} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <Input
                          value={category?.name || ''}
                          disabled
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
                          disabled={index === localSettings.header.categories.length - 1}
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
                  );
                })}
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

            {/* Listings Categories */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">İlan Kategorileri</h3>
                <Dialog open={isFooterListingCategoryModalOpen} onOpenChange={setIsFooterListingCategoryModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Kategori Ekle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>İlan Kategorisi Ekle</DialogTitle>
                      <DialogDescription>
                        Mevcut kategorilerden seçim yaparak ekleyin
                      </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {categories.map((category: any) => {
                        const isAlreadyAdded = localSettings.footer.listings.find((cat: any) => cat === category._id);
                        return (
                          <div key={category._id} className="flex items-center justify-between p-3 border rounded-lg">
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
                                  onClick={() => addFooterListingCategoryFromModal(category)}
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
                {localSettings.footer.listings.map((categoryId: string, index: number) => {
                  const category = categories.find((cat: any) => cat._id === categoryId);
                  return (
                    <div key={categoryId} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <Input
                          value={category?.name || ''}
                          disabled
                          placeholder="Kategori Adı"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveFooterListingCategoryUp(index)}
                          disabled={index === 0}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveFooterListingCategoryDown(index)}
                          disabled={index === localSettings.footer.listings.length - 1}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFooterListingCategoryItem(index)}
                        >
                          Sil
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Main Links */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Ana Linkler</h3>
                <Button onClick={addFooterMenuItem} size="sm">
                  Menü Ekle
                </Button>
              </div>
              <div className="space-y-3">
                {localSettings.footer.main.map((item: FooterLink, index: number) => (
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFooterMenuItem('main', index)}
                    >
                      Sil
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Support Links */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Destek Linkleri</h3>
                <Button onClick={addSupportMenuItem} size="sm">
                  Menü Ekle
                </Button>
              </div>
              <div className="space-y-3">
                {localSettings.footer.support.map((item: FooterLink, index: number) => (
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFooterMenuItem('support', index)}
                    >
                      Sil
                    </Button>
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
                    value={localSettings.footer.social.facebook}
                    onChange={(e) => handleSocialChange('facebook', e.target.value)}
                    className="mt-2"
                    placeholder="Facebook URL"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={localSettings.footer.social.twitter}
                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                    className="mt-2"
                    placeholder="Twitter URL"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={localSettings.footer.social.instagram}
                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                    className="mt-2"
                    placeholder="Instagram URL"
                  />
                </div>
                <div>
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={localSettings.footer.social.youtube}
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
                  value={localSettings.contact.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className="mt-2"
                  placeholder="info@bandbul.com"
                />
              </div>
              <div>
                <Label htmlFor="contact-phone">Telefon</Label>
                <Input
                  id="contact-phone"
                  value={localSettings.contact.phone}
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
                value={localSettings.contact.address}
                onChange={(e) => handleContactChange('address', e.target.value)}
                className="mt-2"
                placeholder="İstanbul, Türkiye"
              />
            </div>
            <div>
              <Label htmlFor="contact-hours">Çalışma Saatleri</Label>
              <Input
                id="contact-hours"
                value={localSettings.contact.workingHours}
                onChange={(e) => handleContactChange('workingHours', e.target.value)}
                className="mt-2"
                placeholder="Pazartesi - Cuma, 09:00 - 18:00"
              />
            </div>
            <div>
              <Label htmlFor="contact-description">Şirket Açıklaması</Label>
              <Textarea
                id="contact-description"
                value={localSettings.contact.companyDescription}
                onChange={(e) => handleContactChange('companyDescription', e.target.value)}
                className="mt-2"
                rows={3}
                placeholder="Şirket hakkında kısa açıklama"
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              SEO Ayarları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="google-analytics">Google Analytics ID</Label>
                <Input
                  id="google-analytics"
                  value={localSettings.seo.googleAnalytics}
                  onChange={(e) => setLocalSettings(prev => ({
                    ...prev,
                    seo: { ...prev.seo, googleAnalytics: e.target.value }
                  }))}
                  className="mt-2"
                  placeholder="GA-XXXXXXXXX-X"
                />
              </div>
              <div>
                <Label htmlFor="google-tag-manager">Google Tag Manager ID</Label>
                <Input
                  id="google-tag-manager"
                  value={localSettings.seo.googleTagManager}
                  onChange={(e) => setLocalSettings(prev => ({
                    ...prev,
                    seo: { ...prev.seo, googleTagManager: e.target.value }
                  }))}
                  className="mt-2"
                  placeholder="GTM-XXXXXXX"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="meta-tags">Ek Meta Etiketleri</Label>
              <Textarea
                id="meta-tags"
                value={localSettings.seo.metaTags}
                onChange={(e) => setLocalSettings(prev => ({
                  ...prev,
                  seo: { ...prev.seo, metaTags: e.target.value }
                }))}
                className="mt-2"
                rows={3}
                placeholder="Ek meta etiketleri buraya ekleyin..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
