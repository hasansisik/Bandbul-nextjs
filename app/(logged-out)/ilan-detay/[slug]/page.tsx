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
  Award
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
      <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">İlan bulunamadı.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur">
              <img 
                src={listing.image} 
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-background/90 text-foreground border-border/50">
                  {listing.category}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 bg-background/90 hover:bg-background shadow-sm"
                >
                  <Share2 className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            </div>

            {/* Title and Rating */}
            <div className="bg-card/50 backdrop-blur rounded-2xl border border-border/50 p-8 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-4">
                    {listing.title}
                  </h1>
                  <div className="flex items-center gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {listing.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {listing.postedDate}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Description */}
            <div className="bg-card/50 backdrop-blur rounded-2xl border border-border/50 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Açıklama</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {listing.description}
              </p>
            </div>

            {/* Details */}
            <div className="bg-card/50 backdrop-blur rounded-2xl border border-border/50 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Detaylar</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <User className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">İlan Sahibi</p>
                    <p className="font-semibold text-foreground text-lg">{listing.author}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Award className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Deneyim</p>
                    <Badge variant="outline" className="text-sm border-border bg-primary/10 text-primary">
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
            <div className="bg-card/50 backdrop-blur rounded-2xl border border-border/50 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-6">İletişim</h3>
              {isLoggedIn ? (
                <div className="space-y-4">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Mesaj Gönder
                  </Button>
                  <Button variant="outline" className="w-full border-border hover:bg-accent">
                    <Phone className="h-4 w-4 mr-2" />
                    Telefon Et
                  </Button>
                  <Button variant="outline" className="w-full border-border hover:bg-accent">
                    <Mail className="h-4 w-4 mr-2" />
                    E-posta Gönder
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">İletişim kurmak için giriş yapın</p>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Giriş Yap
                  </Button>
                </div>
              )}
            </div>

            {/* Category Info */}
            <div className="bg-card/50 backdrop-blur rounded-2xl border border-border/50 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-4">Kategori</h3>
              <Badge className="text-sm bg-primary/10 text-primary border-primary/20">
                {listing.category}
              </Badge>
            </div>

            {/* Similar Listings */}
            <div className="bg-card/50 backdrop-blur rounded-2xl border border-border/50 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-6">Benzer İlanlar</h3>
              <div className="space-y-4">
                {listingsData
                  .filter(item => item.category === listing.category && item.id !== listing.id)
                  .slice(0, 3)
                  .map(item => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-xl hover:bg-accent/50 cursor-pointer border border-border/50 transition-colors">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-20 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground truncate">
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
    </main>
  );
}
