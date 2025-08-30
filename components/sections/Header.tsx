"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Menu, User, Search, Bell, MessageCircle, Heart, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const mainMenuItems = [
    "Anasayfa",
    "İlanlar", 
    "Blog",
    "İletişim"
  ];

  const categoryItems = [
    "Grup Arıyorum",
    "Müzisyen Arıyorum", 
    "Ders Almak İstiyorum"
  ];

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b">
      {/* Top Header */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/bandbul-logo.png"
                alt="Bandbul Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </div>
            
            {/* Search Bar - Ortada ve geniş */}
            <div className="hidden md:flex relative flex-1 mx-8">
              <Input
                placeholder="Hangi müzik hizmetini arıyorsunuz?"
                className="pr-12 bg-muted/50 border-0 focus-visible:ring-1 h-12 w-full"
              />
              <Button
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 p-0 bg-primary hover:bg-primary/90"
                variant="default"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* Ana Menü ve User Actions - Sağda */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {/* Ana Menü */}
              <nav className="hidden md:flex items-center space-x-6 px-20">
                {mainMenuItems.map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>

              <ThemeToggle />
              
              {isLoggedIn ? (
                <>
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer" onClick={handleLogout}>
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  </div>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="hidden md:flex" onClick={handleLogin}>
                    Giriş Yap
                  </Button>
                  <Button size="sm" className="hidden md:flex">
                    Kayıt Ol
                  </Button>
                </>
              )}

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
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
              <a
                key={index}
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Input
                  placeholder="Hangi müzik hizmetini arıyorsunuz?"
                  className="pr-12 h-12"
                />
                <Button
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 p-0 bg-primary hover:bg-primary/90"
                  variant="default"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-4">
              {/* Main Menu */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Ana Menü</h4>
                <div className="grid grid-cols-2 gap-2">
                  {mainMenuItems.map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-sm font-medium transition-colors hover:text-primary p-2 rounded-md hover:bg-muted"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Categories */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm mb-2">Kategoriler</h4>
                <div className="grid grid-cols-1 gap-2">
                  {categoryItems.map((item, index) => (
                    <a
                      key={index}
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors p-2 rounded-md hover:bg-muted"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>

              {!isLoggedIn && (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full" onClick={handleLogin}>
                    Giriş Yap
                  </Button>
                  <Button size="sm" className="w-full">
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
