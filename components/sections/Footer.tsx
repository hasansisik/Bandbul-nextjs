import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const footerLinks = {
    main: [
      { name: "Hakkımızda", href: "#" },
      { name: "İletişim", href: "/iletisim" },
      { name: "Prodüksiyon", href: "#" },
      { name: "2. El Enstrüman", href: "#" }
    ],
    listings: [
      { name: "Grup Arıyorum", href: "/ilanlar" },
      { name: "Müzisyen Arıyorum", href: "/ilanlar" },
      { name: "Ders Almak İstiyorum", href: "/ilanlar" }
    ],
    support: [
      { name: "S.S.S.", href: "/sss" },
      { name: "İlan Kuralları", href: "/ilan-kurallari" },
      { name: "Gizlilik Sözleşmesi", href: "/gizlilik-sozlesmesi" },
      { name: "KVKK", href: "/kvkk" }
    ]
  };

  const socialLinks = [
    { icon: <Facebook className="h-4 w-4" />, href: "#", label: "Facebook" },
    { icon: <Twitter className="h-4 w-4" />, href: "#", label: "Twitter" },
    { icon: <Instagram className="h-4 w-4" />, href: "#", label: "Instagram" },
    { icon: <Youtube className="h-4 w-4" />, href: "#", label: "YouTube" }
  ];

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10 mb-10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Link href="/">
                <Image
                  src="/bandbul-logo.png"
                  alt="Bandbul Logo"
                  width={100}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
              Müzik tutkunları için tasarlanmış platform. Grup bulma, enstrüman alım-satım ve müzik prodüksiyonu için tek adres.
            </p>
            <div className="flex space-x-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ANASAYFA */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 text-sm">Anasayfa</h3>
            <ul className="space-y-2">
              {footerLinks.main.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-gray-700 transition-colors text-sm block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İLANLAR */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 text-sm">İlanlar</h3>
            <ul className="space-y-2">
              {footerLinks.listings.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-gray-700 transition-colors text-sm block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* DESTEK */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 text-sm">Destek</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-gray-700 transition-colors text-sm block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center">
                <Mail className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">E-posta</p>
                <a href="mailto:info@bandbul.com" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                  info@bandbul.com
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center">
                <Phone className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Telefon</p>
                <a href="tel:+902121234567" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                  +90 212 123 45 67
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Adres</p>
                <p className="text-sm text-gray-700">
                  İstanbul, Türkiye
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
          <div className="text-sm text-gray-400">
            © 2025 Bandbul. Tüm hakları saklıdır.
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <Link href="/gizlilik-sozlesmesi" className="hover:text-gray-600 transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/ilan-kurallari" className="hover:text-gray-600 transition-colors">
              Kullanım Şartları
            </Link>
            <Link href="/kvkk" className="hover:text-gray-600 transition-colors">
              KVKK
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
