"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, MapPin, Calendar, User, Star } from "lucide-react";
import Link from "next/link";
import { getRecentListings, getListingsByType, type ListingItem } from "@/lib/listingsData";
import { generateSlug } from "@/lib/utils";

const LatestListings = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const listings = activeTab === "all" 
    ? getRecentListings(6) 
    : getListingsByType(activeTab, 6);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Grup Arıyorum":
        return "🎸";
      case "Ders Veriyorum":
        return "🎵";
      case "Enstrüman Satıyorum":
        return "🎹";
      case "Stüdyo Kiralıyorum":
        return "🎙️";
      case "Müzisyen Arıyorum":
        return "🎤";
      case "Ders Almak İstiyorum":
        return "📚";
      default:
        return "🎵";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Grup Arıyorum":
        return "bg-primary/10 text-primary border-primary/20";
      case "Ders Veriyorum":
        return "bg-primary/10 text-primary border-primary/20";
      case "Enstrüman Satıyorum":
        return "bg-primary/10 text-primary border-primary/20";
      case "Stüdyo Kiralıyorum":
        return "bg-primary/10 text-primary border-primary/20";
      case "Müzisyen Arıyorum":
        return "bg-primary/10 text-primary border-primary/20";
      case "Ders Almak İstiyorum":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const tabs = [
    { id: "all", label: "Tümü", count: getRecentListings(100).length },
    { id: "grup-ariyorum", label: "Grup Arıyorum", count: getListingsByType("Grup Arıyorum", 100).length },
    { id: "ders-veriyorum", label: "Ders Veriyorum", count: getListingsByType("Ders Veriyorum", 100).length },
    { id: "enstruman-satiyorum", label: "Enstrüman Satıyorum", count: getListingsByType("Enstrüman Satıyorum", 100).length },
  ];

  return (
    <section className="py-16 bg-muted/10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Son İlanlar</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Müzik dünyasından en yeni ilanları keşfedin. Grup arayanlar, ders verenler ve daha fazlası.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-accent"
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-card/50 backdrop-blur border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={listing.image} 
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className={`text-xs ${getCategoryColor(listing.category)}`}>
                    {getCategoryIcon(listing.category)} {listing.category}
                  </Badge>
                </div>

                {/* Favorite Button */}
                <div className="absolute top-3 right-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 bg-background/90 hover:bg-background"
                    onClick={() => toggleFavorite(listing.id)}
                  >
                    <Heart 
                      className={`h-4 w-4 ${favorites.includes(listing.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                    />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Title */}
                <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2">
                  {listing.title}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1">
                  {listing.description}
                </p>

                {/* Meta Info - Location and Date */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {listing.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {listing.postedDate}
                  </div>
                </div>

                {/* Author and Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{listing.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-foreground">{listing.rating}</span>
                  </div>
                </div>

                {/* Action Buttons - At the bottom */}
                <div className="flex gap-2 mt-auto">
                  <Link href={`/ilan-detay/${generateSlug(listing.title)}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-border hover:bg-accent">
                      Detayları Gör
                    </Button>
                  </Link>
                  {isLoggedIn && (
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/ilanlar">
            <Button className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg rounded-xl">
              Tüm İlanları Gör
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestListings;
