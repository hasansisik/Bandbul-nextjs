"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
import { listingsData, type ListingItem } from "@/lib/listingsData";
import { generateSlug } from "@/lib/utils";

export default function ListingDetailPage() {
  const params = useParams();
  const [listing, setListing] = useState<ListingItem | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Find listing by slug
    const foundListing = listingsData.find(item => {
      const itemSlug = generateSlug(item.title);
      return itemSlug === params.slug;
    });

    if (foundListing) {
      setListing(foundListing);
    }
  }, [params.slug]);



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
            <span className="hover:text-foreground cursor-pointer transition-colors">İlanlar</span>
            <ChevronRight className="h-4 w-4" />
            <span className="hover:text-foreground cursor-pointer transition-colors">{listing.category}</span>
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
                    {listing.category}
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
                      <span>{listing.postedDate}</span>
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
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">İlan Sahibi</p>
                      <p className="font-medium text-foreground">{listing.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deneyim</p>
                      <Badge variant="outline" className="text-sm">
                        {listing.experience}
                      </Badge>
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
                {isLoggedIn ? (
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
                  {listingsData
                    .filter(item => item.category === listing.category && item.id !== listing.id)
                    .slice(0, 3)
                    .map(item => (
                      <div key={item.id} className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
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
