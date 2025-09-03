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
  ChevronRight
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
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Modern Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
              <span className="hover:text-foreground cursor-pointer transition-colors duration-200 hover:underline">İlanlar</span>
              <ChevronRight className="h-4 w-4" />
              <span className="hover:text-foreground cursor-pointer transition-colors duration-200 hover:underline">{listing.category}</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-semibold truncate max-w-xs">{listing.title}</span>
            </nav>

            {/* Enhanced Image */}
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-card/50 backdrop-blur group">
              <img 
                src={listing.image} 
                alt={listing.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-6 left-6">
                <Badge className="bg-background/95 text-foreground border-0 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-sm">
                  {listing.category}
                </Badge>
              </div>
              <div className="absolute top-6 right-6 flex gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-12 w-12 p-0 bg-background/95 hover:bg-background shadow-lg backdrop-blur-sm rounded-full transition-all duration-200 hover:scale-110"
                >
                  <Share2 className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            </div>

            {/* Enhanced Title and Rating */}
            <div className="bg-card/50 backdrop-blur rounded-3xl p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-foreground mb-6 leading-tight">
                    {listing.title}
                  </h1>
                  <div className="flex items-center gap-8 text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">{listing.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">{listing.postedDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Description */}
            <div className="bg-card/50 backdrop-blur rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                Açıklama
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {listing.description}
              </p>
            </div>

            {/* Enhanced Details */}
            <div className="bg-card/50 backdrop-blur rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                Detaylar
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/30 hover:bg-background/50 transition-colors duration-200">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">İlan Sahibi</p>
                    <p className="font-semibold text-foreground text-lg">{listing.author}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/30 hover:bg-background/50 transition-colors duration-200">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Deneyim</p>
                    <Badge variant="outline" className="text-sm border-primary/20 bg-primary/10 text-primary px-3 py-1">
                      {listing.experience}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-8">
            {/* Enhanced Similar Listings */}
            <div className="bg-card/50 backdrop-blur rounded-3xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Benzer İlanlar
              </h3>
              <div className="space-y-4">
                {listingsData
                  .filter(item => item.category === listing.category && item.id !== listing.id)
                  .slice(0, 3)
                  .map(item => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-2xl hover:bg-background/30 cursor-pointer transition-all duration-200 hover:scale-[1.02] group">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-20 h-16 object-cover rounded-xl group-hover:rounded-2xl transition-all duration-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
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
