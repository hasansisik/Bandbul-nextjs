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
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "Ders Veriyorum":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "Enstrüman Satıyorum":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "Stüdyo Kiralıyorum":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "Müzisyen Arıyorum":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "Ders Almak İstiyorum":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const tabs = [
    { id: "all", label: "Tümü", count: getRecentListings(100).length },
    { id: "grup-ariyorum", label: "Grup Arıyorum", count: getListingsByType("Grup Arıyorum", 100).length },
    { id: "ders-veriyorum", label: "Ders Veriyorum", count: getListingsByType("Ders Veriyorum", 100).length },
    { id: "enstruman-satiyorum", label: "Enstrüman Satıyorum", count: getListingsByType("Enstrüman Satıyorum", 100).length },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Son İlanlar</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
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
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
            <div key={listing.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <Link href={`/ilan-detay/${generateSlug(listing.title)}`} className="block">
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={`text-xs border ${getCategoryColor(listing.category)}`}>
                      {getCategoryIcon(listing.category)} {listing.category}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(listing.id);
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 ${favorites.includes(listing.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                    />
                  </Button>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title and Rating */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 mr-2 leading-tight">
                      {listing.title}
                    </h3>
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-700 font-medium">{listing.rating}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-xs mb-4 line-clamp-2 leading-relaxed">
                    {listing.description}
                  </p>

                  {/* Location and Date */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {listing.location}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {listing.postedDate}
                    </div>
                  </div>

                  {/* Author and Experience */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      {listing.author}
                    </div>
                    <Badge variant="outline" className="text-xs border-gray-200">
                      {listing.experience}
                    </Badge>
                  </div>
                </div>
              </Link>

              {/* Actions */}
              <div className="px-5 pb-5">
                <div className="flex items-center justify-end">
                  {isLoggedIn && (
                    <Button size="sm" className="h-8 px-4 bg-black hover:bg-gray-800">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      İletişim
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
            <Button className="bg-black hover:bg-gray-800 px-8 py-3">
              Tüm İlanları Görüntüle
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestListings;
