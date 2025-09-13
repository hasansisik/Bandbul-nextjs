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
import { logout, getAllCategories, loadUser, getUnreadCount } from "@/redux/actions/userActions";
import { getNotificationStats } from "@/redux/actions/notificationActions";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useCallback, useRef } from "react";
import { getSettings } from "@/redux/actions/settingsActions";
import { useTheme } from "next-themes";
import { useSocket } from "@/hooks/useSocket";
import { playNotificationSound } from "@/utils/soundNotification";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const { isAuthenticated, user, categories, loading: userLoading, unreadCount } = useAppSelector((state) => state.user);
  const { settings, loading: settingsLoading } = useAppSelector((state) => state.settings);
  const { stats: notificationStats, loading: notificationLoading } = useAppSelector((state) => state.notification);
  
  // Sound notification functionality
  const lastMessageIdRef = useRef<string | null>(null);
  const lastNotificationIdRef = useRef<string | null>(null);

  // Handle new message from WebSocket
  const handleNewMessage = useCallback((socketMessage: any) => {
    // Only play sound for new messages (not from current user)
    if (socketMessage.senderId !== user?._id) {
      const messageId = socketMessage.id || socketMessage._id;
      
      // Check if this is a new message (not already processed)
      if (messageId && messageId !== lastMessageIdRef.current) {
        lastMessageIdRef.current = messageId;
      }
    }
    
    // Refresh message count immediately for real-time updates
    dispatch(getUnreadCount());
  }, [dispatch, user?._id]);

  // Handle messages read from WebSocket
  const handleMessagesRead = useCallback((data: { conversationId: string; readBy: string; readAt: string }) => {
    // Refresh message count when messages are read
    dispatch(getUnreadCount());
  }, [dispatch]);

  // Handle new notification from WebSocket
  const handleNewNotification = useCallback((notification: any) => {
    const notificationId = notification.id || notification._id;
    
    // Check if this is a new notification (not already processed)
    if (notificationId && notificationId !== lastNotificationIdRef.current) {
      lastNotificationIdRef.current = notificationId;
    }
    
    // Refresh notification count
    dispatch(getNotificationStats());
  }, [dispatch]);

  // WebSocket connection for real-time updates
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const { isConnected } = useSocket({ 
    token, 
    userId: user?._id,
    onNewMessage: handleNewMessage,
    onNewNotification: handleNewNotification,
    onMessagesRead: handleMessagesRead
  });

  // Fetch settings, categories and user data on component mount
  useEffect(() => {
    dispatch(getSettings());
    dispatch(getAllCategories({}));
    
    // Always try to load user data if token exists
    const token = localStorage.getItem("accessToken");
    
    if (token && (!isAuthenticated || !user)) {
      dispatch(loadUser());
    }
  }, [dispatch, pathname, isAuthenticated, user]); // Trigger on every pathname change

  // Track previous counts for sound notifications
  const prevMessageCountRef = useRef<number>(0);
  const prevNotificationCountRef = useRef<number>(0);

  // Fetch counters when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getNotificationStats());
      dispatch(getUnreadCount());
      
      // Set up smart polling for counters - only when page is visible and user is active
      let interval: NodeJS.Timeout | null = null;
      
      const startPolling = () => {
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
          // Only poll if page is visible and user is authenticated
          if (document.visibilityState === 'visible' && isAuthenticated) {
            dispatch(getNotificationStats());
            dispatch(getUnreadCount());
          }
        }, 10000); // 10 seconds for faster updates
      };
      
      const stopPolling = () => {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      };
      
      // Start polling when page becomes visible
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          // Immediately fetch when page becomes visible
          dispatch(getNotificationStats());
          dispatch(getUnreadCount());
          startPolling();
        } else {
          stopPolling();
        }
      };
      
      // Start initial polling
      startPolling();
      
      // Listen for visibility changes
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        stopPolling();
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [dispatch, isAuthenticated]);

  // Play sound when message count increases
  useEffect(() => {
    if (isAuthenticated && unreadCount !== undefined) {
      if (prevMessageCountRef.current >= 0 && unreadCount > prevMessageCountRef.current) {
        // Message count increased, play sound
        console.log('Message count increased:', prevMessageCountRef.current, '->', unreadCount);
        playNotificationSound(0.5);
      }
      prevMessageCountRef.current = unreadCount;
    }
  }, [unreadCount, isAuthenticated]);

  // Track notification count (no sound)
  useEffect(() => {
    if (isAuthenticated && notificationStats?.unread !== undefined) {
      if (prevNotificationCountRef.current >= 0 && notificationStats.unread > prevNotificationCountRef.current) {
        // Notification count increased, but no sound
        console.log('Notification count increased:', prevNotificationCountRef.current, '->', notificationStats.unread);
      }
      prevNotificationCountRef.current = notificationStats.unread;
    }
  }, [notificationStats?.unread, isAuthenticated]);

  const mainMenuItems = settings?.header?.mainMenu || [];

  // Function to create category slug for URL
  const createCategorySlug = (categoryName: string) => {
    return categoryName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '-');
  };

  const categoryItems = settings?.header?.categories?.map((categoryId: string) => {
    // Find category from fetched categories
    const category = categories.find(cat => cat._id === categoryId || cat.slug === categoryId);
    
    if (category) {
      // Use the category name to generate a proper slug
      const categorySlug = createCategorySlug(category.name);
      return {
        name: category.name,
        href: `/ilanlar?category=${categorySlug}`
      };
    }
    
    // Fallback to static mapping if category not found
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

  // Function to refresh counters
  const refreshCounters = () => {
    if (isAuthenticated) {
      dispatch(getNotificationStats());
      dispatch(getUnreadCount());
    }
  };

  // Get unread counts for display
  const notificationUnreadCount = notificationStats?.unread || 0;
  const messageUnreadCount = unreadCount || 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b border-border/50">
      {/* Top Header */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Search */}
            <div className="flex items-center space-x-2 lg:space-x-4 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <Link href="/">
                  <Image
                    src={
                      theme === "dark" 
                        ? (settings?.logo?.dark || settings?.logo?.light || "/bandbul-logo.png")
                        : (settings?.logo?.light || "/bandbul-logo.png")
                    }
                    alt="Bandbul Logo"
                    width={120}
                    height={40}
                    className="h-8 w-auto"
                    priority
                  />
                </Link>
              </div>
              
              {/* Search Bar - Close to Logo */}
              <div className="hidden lg:block relative max-w-md w-full">
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

              {/* İlan Ver Button - Only on large screens */}
              <div className="hidden lg:block flex-shrink-0">
                <Button
                  onClick={() => {
                    if (isAuthenticated) {
                      router.push("/profil?tab=listings&action=create");
                    } else {
                      const redirectUrl = encodeURIComponent("/profil?tab=listings&action=create");
                      router.push(`/giris?redirect=${redirectUrl}`);
                    }
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 h-10 whitespace-nowrap"
                  size="sm"
                >
                  İlan Ver
                </Button>
              </div>
            </div>

            {/* Desktop Content - Center - Only on large screens */}
            <div className="hidden lg:flex items-center flex-1 justify-center">
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
            <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
              {/* Desktop Actions - Only on large screens */}
              <div className="hidden lg:flex items-center space-x-4">
                <ThemeToggle />
                
                {isAuthenticated ? (
                  <>
                    <Link href="/bildirimler" onClick={refreshCounters}>
                      <Button variant="ghost" size="sm" className="hover:bg-accent relative">
                        <Bell className="h-5 w-5" />
                        {notificationUnreadCount > 0 && (
                          <Badge 
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold min-w-[20px] bg-orange-400 hover:bg-orange-500 text-white border-0"
                          >
                            {notificationUnreadCount > 99 ? '99+' : notificationUnreadCount}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                    <Link href="/mesajlar" onClick={refreshCounters}>
                      <Button variant="ghost" size="sm" className="hover:bg-accent relative">
                        <MessageCircle className="h-5 w-5" />
                        {messageUnreadCount > 0 && (
                          <Badge 
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold min-w-[20px] bg-orange-500 hover:bg-orange-500 text-white border-0"
                          >
                            {messageUnreadCount > 99 ? '99+' : messageUnreadCount}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                    <Link href="/profil">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors overflow-hidden">
                          {userLoading ? (
                            <div className="w-full h-full bg-muted animate-pulse rounded-full" />
                          ) : user?.profile?.picture ? (
                            <Image 
                              src={user.profile.picture} 
                              alt="Profile" 
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                              priority
                              unoptimized
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

              {/* Mobile/Tablet Actions - Show on screens smaller than lg */}
              <div className="lg:hidden flex items-center space-x-2">
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

      {/* Bottom Navigation - Categories - Only on large screens */}
      <div className="hidden lg:block">
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

      {/* Mobile/Tablet Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur">
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
              
              {/* Mobile İlan Ver Button */}
              <div className="mt-3">
                <Button
                  onClick={() => {
                    closeMenu();
                    if (isAuthenticated) {
                      router.push("/profil?tab=listings&action=create");
                    } else {
                      const redirectUrl = encodeURIComponent("/profil?tab=listings&action=create");
                      router.push(`/giris?redirect=${redirectUrl}`);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white font-medium h-12"
                  size="sm"
                >
                  İlan Ver
                </Button>
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
                    <Link href="/bildirimler" onClick={() => { closeMenu(); refreshCounters(); }}>
                      <Button variant="outline" size="sm" className="w-full border-border hover:bg-accent justify-start relative">
                        <Bell className="h-4 w-4 mr-2" />
                        Bildirimler
                        {notificationUnreadCount > 0 && (
                          <Badge 
                            className="absolute right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold min-w-[20px] bg-orange-400 hover:bg-orange-500 text-white border-0"
                          >
                            {notificationUnreadCount > 99 ? '99+' : notificationUnreadCount}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                    <Link href="/mesajlar" onClick={() => { closeMenu(); refreshCounters(); }}>
                      <Button variant="outline" size="sm" className="w-full border-border hover:bg-accent justify-start relative">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Mesajlar
                        {messageUnreadCount > 0 && (
                          <Badge 
                            className="absolute right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold min-w-[20px] bg-orange-500 hover:bg-orange-500 text-white border-0"
                          >
                            {messageUnreadCount > 99 ? '99+' : messageUnreadCount}
                          </Badge>
                        )}
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
