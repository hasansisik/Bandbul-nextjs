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
  Phone,
  Mail,
  Award,
  ChevronRight,
  Star,
  Clock
} from "lucide-react";
import { useAppSelector } from "@/redux/hook";
import { getAllListings, loadUser } from "@/redux/actions/userActions";
import { useAppDispatch } from "@/redux/hook";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { allListings, listingsLoading, isAuthenticated, user } = useAppSelector((state) => state.user);
  const [listing, setListing] = useState<any>(null);

  useEffect(() => {
    // Load user and listings
    dispatch(loadUser());
    if (allListings.length === 0) {
      dispatch(getAllListings({}));
    }
  }, [dispatch, allListings.length]);

  useEffect(() => {
    // Find listing by ID (slug parameter)
    if (allListings.length > 0) {
      const foundListing = allListings.find(item => item._id === params.slug);
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
                <div className="grid md:grid-cols-2 gap-4">
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
                        {listing.experience}
                    </div>
                  </div>
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
                    <Button className="w-full" size="lg">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Mesaj Gönder
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <Phone className="h-4 w-4 mr-2" />
                      Telefon Et
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <Mail className="h-4 w-4 mr-2" />
                      E-posta Gönder
                    </Button>
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
                <h3 className="text-lg font-semibold text-foreground mb-4">Benzer İlanlar</h3>
                <div className="space-y-4">
                  {allListings
                    .filter(item => item.category === listing.category && item._id !== listing._id)
                    .slice(0, 3)
                    .map(item => (
                      <div key={item._id} className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-16 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">{item.location}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
