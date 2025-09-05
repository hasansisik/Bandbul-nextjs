"use client";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getSettings } from "@/redux/actions/settingsActions";
import { useTheme } from "next-themes";

const Footer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const { settings, loading: settingsLoading } = useSelector((state: RootState) => state.settings);

  // Fetch settings on component mount
  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);
  const footerLinks = {
    main: settings?.footer?.main || [
      { name: "Anasayfa", href: "/" },
      { name: "İlanlar", href: "/ilanlar" },
      { name: "Blog", href: "/blog" },
      { name: "İletişim", href: "/iletisim" }
    ],
    listings: settings?.populatedFooterListings || [],
    support: settings?.footer?.support || [
      { name: "S.S.S.", href: "/sss" },
      { name: "İlan Kuralları", href: "/ilan-kurallari" },
      { name: "Gizlilik Sözleşmesi", href: "/gizlilik-sozlesmesi" },
      { name: "KVKK", href: "/kvkk" }
    ]
  };

  const socialLinks = [
    { icon: <Facebook className="h-4 w-4" />, href: settings?.footer?.social?.facebook || "#", label: "Facebook" },
    { icon: <Twitter className="h-4 w-4" />, href: settings?.footer?.social?.twitter || "#", label: "Twitter" },
    { icon: <Instagram className="h-4 w-4" />, href: settings?.footer?.social?.instagram || "#", label: "Instagram" },
    { icon: <Youtube className="h-4 w-4" />, href: settings?.footer?.social?.youtube || "#", label: "YouTube" }
  ];

  return (
    <footer className="bg-background/95 backdrop-blur border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
                {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10 mb-10">
          {settingsLoading ? (
            // Loading skeleton for footer
            <>
              <div className="lg:col-span-1">
                <div className="mb-4">
                  <div className="w-24 h-8 bg-muted rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-full" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                </div>
                <div className="flex space-x-2 mt-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-muted rounded-md animate-pulse" />
                  ))}
                </div>
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="h-4 bg-muted rounded animate-pulse w-20 mb-3" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-3 bg-muted rounded animate-pulse w-24" />
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {/* Brand Section */}
              <div className="lg:col-span-1">
                <div className="mb-4">
                  <Link href="/">
                    <Image
                      src={
                        theme === "dark" 
                          ? (settings?.logo?.dark || settings?.logo?.light || "/bandbul-logo.png")
                          : (settings?.logo?.light || "/bandbul-logo.png")
                      }
                      alt="Bandbul Logo"
                      width={100}
                      height={32}
                      className="h-8 w-auto"
                    />
                  </Link>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
                  {settings?.contact?.companyDescription || 
                    "Müzik tutkunları için tasarlanmış platform. Grup bulma, enstrüman alım-satım ve müzik prodüksiyonu için tek adres."
                  }
                </p>
                <div className="flex space-x-2">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="w-8 h-8 rounded-md bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* ANASAYFA */}
              <div>
                <h3 className="font-medium text-foreground mb-3 text-sm">Sayfalar</h3>
                <ul className="space-y-2">
                  {footerLinks.main.map((link: any, index: number) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* İLANLAR */}
              <div>
                <h3 className="font-medium text-foreground mb-3 text-sm">İlanlar</h3>
                <ul className="space-y-2">
                  {footerLinks.listings.map((category: any, index: number) => (
                    <li key={category._id || index}>
                      <Link
                        href={`/ilanlar?kategori=${category._id}`}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm block"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DESTEK */}
              <div>
                <h3 className="font-medium text-foreground mb-3 text-sm">Destek</h3>
                <ul className="space-y-2">
                  {footerLinks.support.map((link: any, index: number) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Contact Info */}
        <div className="mb-8">
          {settingsLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-md animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted rounded animate-pulse w-16" />
                    <div className="h-4 bg-muted rounded animate-pulse w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-md bg-muted/50 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/70 uppercase tracking-wide">E-posta</p>
                  <a href={`mailto:${settings?.contact?.email || 'info@bandbul.com'}`} className="text-sm text-foreground hover:text-primary transition-colors">
                    {settings?.contact?.email || "info@bandbul.com"}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-md bg-muted/50 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/70 uppercase tracking-wide">Telefon</p>
                  <a href={`tel:${settings?.contact?.phone || '+902121234567'}`} className="text-sm text-foreground hover:text-primary transition-colors">
                    {settings?.contact?.phone || "+90 212 123 45 67"}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-md bg-muted/50 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/70 uppercase tracking-wide">Adres</p>
                  <p className="text-sm text-foreground">
                    {settings?.contact?.address || "İstanbul, Türkiye"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator className="mb-6 bg-border/50" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2025 Bandbul. Tüm hakları saklıdır.
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link href="/gizlilik-sozlesmesi" className="hover:text-foreground transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/ilan-kurallari" className="hover:text-foreground transition-colors">
              Kullanım Şartları
            </Link>
            <Link href="/kvkk" className="hover:text-foreground transition-colors">
              KVKK
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
