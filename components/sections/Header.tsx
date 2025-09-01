"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Menu, User, Search, Bell, MessageCircle, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mainMenuItems = [
    { name: "Anasayfa", href: "/" },
    { name: "İlanlar", href: "/ilanlar" },
    { name: "Blog", href: "/blog" },
    { name: "İletişim", href: "/iletisim" }
  ];

  const categoryItems = [
    { name: "Grup Arıyorum", href: "/ilanlar?category=grup-ariyorum" },
    { name: "Müzisyen Arıyorum", href: "/ilanlar?category=muzisyen-ariyorum" },
    { name: "Ders Almak İstiyorum", href: "/ilanlar?category=ders-almak-istiyorum" },
    { name: "Ders Veriyorum", href: "/ilanlar?category=ders-veriyorum" },
    { name: "Enstrüman Satıyorum", href: "/ilanlar?category=enstruman-satiyorum" },
    { name: "Stüdyo Kiralıyorum", href: "/ilanlar?category=studyo-kiraliyorum" }
  ];

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/ilanlar?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b border-border/50">
      {/* Top Header */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Search */}
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-shrink-0">
                <Link href="/">
                  <Image
                    src="/bandbul-logo.png"
                    alt="Bandbul Logo"
                    width={120}
                    height={40}
                    className="h-8 w-auto"
                    priority
                  />
                </Link>
              </div>
              
              {/* Search Bar - Close to Logo */}
              <div className="hidden md:block relative max-w-md w-full">
                <Input
                  placeholder="Hangi müzik hizmetini arıyorsunuz?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-20 bg-muted/30 border-border/50 focus-visible:ring-1 focus-visible:ring-ring h-10 w-full"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                  {searchQuery && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={clearSearch}
                      className="h-8 w-8 p-0 hover:bg-accent"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={handleSearch}
                    className="h-8 w-8 p-0 bg-primary hover:bg-primary/90"
                    variant="default"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Desktop Content - Center */}
            <div className="hidden md:flex items-center flex-1 justify-center">
              {/* Ana Menü */}
              <nav className="flex items-center space-x-6">
                {mainMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-4">
                <ThemeToggle />
                
                {isLoggedIn ? (
                  <>
                    <Link href="/bildirimler">
                      <Button variant="ghost" size="sm" className="hover:bg-accent">
                        <Bell className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/mesajlar">
                      <Button variant="ghost" size="sm" className="hover:bg-accent">
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/profil">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      </div>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="border-border hover:bg-accent" onClick={handleLogin}>
                      Giriş Yap
                    </Button>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Kayıt Ol
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Actions */}
              <div className="md:hidden flex items-center space-x-2">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="hover:bg-accent"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Categories */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-8 py-3">
            {categoryItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Input
                  placeholder="Hangi müzik hizmetini arıyorsunuz?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-20 h-12 bg-muted/30 border-border/50"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                  {searchQuery && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={clearSearch}
                      className="h-10 w-10 p-0 hover:bg-accent"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={handleSearch}
                    className="h-10 w-10 p-0 bg-primary hover:bg-primary/90"
                    variant="default"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-4">
              {/* Main Menu */}
              <div>
                <h4 className="font-semibold text-sm mb-2 text-foreground">Ana Menü</h4>
                <div className="grid grid-cols-2 gap-2">
                  {mainMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium transition-colors hover:text-primary p-2 rounded-md hover:bg-accent"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Categories */}
              <div className="border-t border-border/50 pt-4">
                <h4 className="font-semibold text-sm mb-2 text-foreground">Kategoriler</h4>
                <div className="grid grid-cols-1 gap-2">
                  {categoryItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors p-2 rounded-md hover:bg-accent"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {!isLoggedIn && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-border/50">
                  <Button variant="outline" size="sm" className="w-full border-border hover:bg-accent" onClick={handleLogin}>
                    Giriş Yap
                  </Button>
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                    Kayıt Ol
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
