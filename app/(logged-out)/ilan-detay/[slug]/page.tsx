"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  MapPin, 
  Calendar, 
  User,
  ArrowLeft,
  Share2,
  Award,
  ChevronRight,
  Star,
  Clock,
  Music
} from "lucide-react";
import { useAppSelector } from "@/redux/hook";
import { getAllListings, loadUser } from "@/redux/actions/userActions";
import { useAppDispatch } from "@/redux/hook";
import ShareModal from "@/components/ShareModal";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { allListings, listingsLoading, isAuthenticated, user } = useAppSelector((state) => state.user);
  const [listing, setListing] = useState<any>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Function to create title slug for URL
  const createTitleSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  useEffect(() => {
    // Load user and listings
    dispatch(loadUser());
    if (allListings.length === 0) {
      dispatch(getAllListings({}));
    }
  }, [dispatch, allListings.length]);

  useEffect(() => {
    // Find listing by title slug
    if (allListings.length > 0) {
      const foundListing = allListings.find(item => {
        const titleSlug = createTitleSlug(item.title);
        return titleSlug === params.slug;
      });
      if (foundListing) {
        setListing(foundListing);
      }
    }
  }, [params.slug, allListings]);

  // Function to create category slug for URL
  const createCategorySlug = (categoryName: string) => {
    return categoryName.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '-');
  };

  // Function to handle category click in breadcrumb
  const handleCategoryClick = () => {
    const categoryName = listing.categoryInfo?.name || listing.category;
    const categorySlug = createCategorySlug(categoryName);
    router.push(`/ilanlar?category=${categorySlug}`);
  };

  // Function to handle listings click in breadcrumb
  const handleListingsClick = () => {
    router.push('/ilanlar');
  };

  // Function to handle message button click
  const handleMessageClick = () => {
    if (listing && isAuthenticated) {
      const recipientId = listing.authorInfo?._id || listing.user?._id;
      const recipientName = listing.authorInfo 
        ? `${listing.authorInfo.name} ${listing.authorInfo.surname}` 
        : listing.user 
        ? `${listing.user.name} ${listing.user.surname}` 
        : 'Bilinmeyen';
      
      if (recipientId && recipientId !== user?._id) {
        router.push(`/mesajlar?recipientId=${recipientId}&recipientName=${encodeURIComponent(recipientName)}`);
      }
    }
  };

  // Function to handle share button click
  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };



  if (listingsLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground text-lg">İlan yükleniyor...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">İlan bulunamadı.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
            <span 
              onClick={handleListingsClick}
              className="hover:text-foreground cursor-pointer transition-colors"
            >
              İlanlar
            </span>
            <ChevronRight className="h-4 w-4" />
            <span 
              onClick={handleCategoryClick}
              className="hover:text-foreground cursor-pointer transition-colors"
            >
              {listing.categoryInfo?.name || listing.category}
            </span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium truncate max-w-xs">{listing.title}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Image */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                <img 
                  src={listing.image} 
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="font-medium">
                    {listing.categoryInfo?.name || listing.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 bg-background/90 hover:bg-background rounded-full"
                    onClick={handleShareClick}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Title and Meta */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">
                    {listing.title}
                  </h1>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('tr-TR') : 'Yeni'}</span>
                    </div>
                  </div>
                </div>


              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Açıklama</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Detaylar</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                      {listing.authorInfo?.profile?.picture ? (
                        <img 
                          src={listing.authorInfo.profile.picture} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : listing.user?.picture ? (
                        <img 
                          src={listing.user.picture} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">İlan Sahibi</p>
                      <p className="font-medium text-foreground">
                        {listing.authorInfo 
                          ? `${listing.authorInfo.name} ${listing.authorInfo.surname}` 
                          : listing.user 
                          ? `${listing.user.name} ${listing.user.surname}` 
                          : 'Bilinmeyen'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deneyim</p>
                      <p className="font-medium text-foreground">{listing.experience}</p>
                    </div>
                  </div>
                  {listing.instrument && (
                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Music className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Enstrüman</p>
                        <p className="font-medium text-foreground">{listing.instrument}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-card border rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">İletişim</h3>
                {isAuthenticated ? (
                  <div className="space-y-3">
                    {/* Only show message button if not own listing */}
                    {((listing.authorInfo?._id || listing.user?._id) !== user?._id) ? (
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={handleMessageClick}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Mesaj Gönder
                      </Button>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-muted-foreground text-sm">Bu sizin ilanınız</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">İletişim kurmak için giriş yapın</p>
                    <Button className="w-full" size="lg">
                      Giriş Yap
                    </Button>
                  </div>
                )}
              </div>

              {/* Similar Listings */}
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Benzer İlanlar</h3>
                <div className="space-y-2">
                  {allListings
                    .filter(item => (item.categoryInfo?.name || item.category) === (listing.categoryInfo?.name || listing.category) && item._id !== listing._id)
                    .slice(0, 4)
                    .map(item => (
                      <div 
                        key={item._id} 
                        onClick={() => router.push(`/ilan-detay/${createTitleSlug(item.title)}`)}
                        className="group flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-200"
                      >
                        {/* Image */}
                        <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
                            {item.title}
                          </h4>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{item.location}</span>
                            </div>
                            
                            {item.instrument && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Music className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{item.instrument}</span>
                              </div>
                            )}
                            
                            {item.experience && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Award className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{item.experience}</span>
                              </div>
                            )}
                            
                            {/* Category as text - positioned at the bottom */}
                            <div className="text-xs text-muted-foreground">
                              {item.categoryInfo?.name || item.category}
                            </div>
                          </div>
                        </div>
                        
                        {/* Arrow */}
                        <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                </div>
                {allListings.filter(item => (item.categoryInfo?.name || item.category) === (listing.categoryInfo?.name || listing.category) && item._id !== listing._id).length === 0 && (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center">
                      <Music className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Bu kategoride başka ilan bulunmuyor.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={listing?.title || ''}
        description={listing?.description || ''}
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />
    </main>
  );
}
