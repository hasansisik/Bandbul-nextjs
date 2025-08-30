import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    main: [
      { name: "Hakkımızda", href: "#" },
      { name: "İletişim", href: "#" },
      { name: "Prodüksiyon", href: "#" },
      { name: "2. El Enstrüman", href: "#" }
    ],
    listings: [
      { name: "Grup Arıyorum", href: "#" },
      { name: "Müzisyen Arıyorum", href: "#" },
      { name: "Ders Almak İstiyorum", href: "#" }
    ],
    support: [
      { name: "S.S.S.", href: "#" },
      { name: "İlan Kuralları", href: "#" },
      { name: "Destek Birimi", href: "#" },
      { name: "Gizlilik Sözleşmesi", href: "#" },
      { name: "KVKK", href: "#" }
    ]
  };

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
    { icon: <Youtube className="h-5 w-5" />, href: "#", label: "YouTube" }
  ];

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="outline" className="text-lg font-bold px-3 py-1">
                BANDBUL
              </Badge>
            </div>
            <p className="text-muted-foreground mb-4">
              Müzik için her şey
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ANASAYFA */}
          <div>
            <h3 className="font-semibold mb-4">ANASAYFA</h3>
            <ul className="space-y-2">
              {footerLinks.main.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* İLANLAR */}
          <div>
            <h3 className="font-semibold mb-4">İLANLAR</h3>
            <ul className="space-y-2">
              {footerLinks.listings.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* DESTEK */}
          <div>
            <h3 className="font-semibold mb-4">DESTEK</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2025 - Tüm hakları saklıdır.
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <a href="mailto:info@bandbul.com" className="flex items-center space-x-2 hover:text-primary transition-colors">
              <Mail className="h-4 w-4" />
              <span>info@bandbul.com</span>
            </a>
            <a href="tel:+902121234567" className="flex items-center space-x-2 hover:text-primary transition-colors">
              <Phone className="h-4 w-4" />
              <span>+90 212 123 45 67</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
