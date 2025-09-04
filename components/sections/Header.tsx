"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Menu, User, Search, Bell, MessageCircle, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { logout } from "@/redux/actions/userActions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSettings } from "@/redux/actions/settingsActions";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  const { settings, loading: settingsLoading } = useAppSelector((state) => state.settings);

  // Fetch settings on component mount
  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  const mainMenuItems = settings?.header?.mainMenu || [];

  const categoryItems = settings?.header?.categories?.map((categoryId: string) => {
    // Map category IDs to proper objects with name and href
    const categoryMap: { [key: string]: { name: string; href: string } } = {
      "grup-ariyorum": { name: "Grup Arıyorum", href: "/ilanlar?category=grup-ariyorum" },
      "muzisyen-ariyorum": { name: "Müzisyen Arıyorum", href: "/ilanlar?category=muzisyen-ariyorum" },
      "ders-almak-istiyorum": { name: "Ders Almak İstiyorum", href: "/ilanlar?category=ders-almak-istiyorum" },
      "ders-veriyorum": { name: "Ders Veriyorum", href: "/ilanlar?category=ders-veriyorum" },
      "enstruman-satiyorum": { name: "Enstrüman Satıyorum", href: "/ilanlar?category=enstruman-satiyorum" },
      "studyo-kiraliyorum": { name: "Stüdyo Kiralıyorum", href: "/ilanlar?category=studyo-kiraliyorum" }
    };
    
    return categoryMap[categoryId] || { name: "Kategori", href: "/ilanlar" };
  }) || [];

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsMenuOpen(false); // Close mobile menu when searching
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

  const closeMenu = () => {
    setIsMenuOpen(false);
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
                    src={settings?.logo?.light || "/bandbul-logo.png"}
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
                {settingsLoading ? (
                  // Loading skeleton for main menu
                  <>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-4 bg-muted rounded animate-pulse w-16" />
                    ))}
                  </>
                ) : (
                  mainMenuItems.map((item: any) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))
                )}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-4">
                <ThemeToggle />
                
                {isAuthenticated ? (
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
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors overflow-hidden">
                          {user?.profile?.picture ? (
                            <img 
                              src={user.profile.picture} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      </div>
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="border-border hover:bg-accent">
                      Çıkış Yap
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/giris">
                      <Button variant="outline" size="sm" className="border-border hover:bg-accent">
                        Giriş Yap
                      </Button>
                    </Link>
                    <Link href="/kayitol">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Kayıt Ol
                      </Button>
                    </Link>
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
            {settingsLoading ? (
              // Loading skeleton for categories
              <>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-4 bg-muted rounded animate-pulse w-24" />
                ))}
              </>
            ) : (
              categoryItems.map((item: any, index: number) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))
            )}
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
                  {settingsLoading ? (
                    // Loading skeleton for mobile main menu
                    <>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-4 bg-muted rounded animate-pulse" />
                      ))}
                    </>
                  ) : (
                    mainMenuItems.map((item: any) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeMenu}
                        className="text-sm font-medium transition-colors hover:text-primary p-2 rounded-md hover:bg-accent"
                      >
                        {item.name}
                      </Link>
                    ))
                  )}
                </div>
              </div>
              
              {/* Categories */}
              <div className="border-t border-border/50 pt-4">
                <h4 className="font-semibold text-sm mb-2 text-foreground">Kategoriler</h4>
                <div className="grid grid-cols-1 gap-2">
                  {settingsLoading ? (
                    // Loading skeleton for mobile categories
                    <>
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-4 bg-muted rounded animate-pulse" />
                      ))}
                    </>
                  ) : (
                    categoryItems.map((item: any, index: number) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={closeMenu}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors p-2 rounded-md hover:bg-accent"
                      >
                        {item.name}
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-border/50">
                  <Link href="/giris" onClick={closeMenu}>
                    <Button variant="outline" size="sm" className="w-full border-border hover:bg-accent">
                      Giriş Yap
                    </Button>
                  </Link>
                  <Link href="/kayitol" onClick={closeMenu}>
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                      Kayıt Ol
                    </Button>
                  </Link>
                </div>
              )}
              {isAuthenticated && (
                <div className="space-y-4 pt-4 border-t border-border/50">
                  {/* User Actions */}
                  <div className="flex flex-col space-y-2">
                    <Link href="/bildirimler" onClick={closeMenu}>
                      <Button variant="outline" size="sm" className="w-full border-border hover:bg-accent justify-start">
                        <Bell className="h-4 w-4 mr-2" />
                        Bildirimler
                      </Button>
                    </Link>
                    <Link href="/mesajlar" onClick={closeMenu}>
                      <Button variant="outline" size="sm" className="w-full border-border hover:bg-accent justify-start">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Mesajlar
                      </Button>
                    </Link>
                    <Link href="/profil" onClick={closeMenu}>
                      <Button variant="outline" size="sm" className="w-full border-border hover:bg-accent justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Profil
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Logout */}
                  <Button variant="outline" size="sm" onClick={handleLogout} className="w-full border-border hover:bg-accent">
                    Çıkış Yap
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
