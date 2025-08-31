"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, Music, Users, BookOpen, Star, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { getRecentListings, getListingsByType, type ListingItem } from "@/lib/listingsData";

const LatestListings = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // User authentication state

  const recentListings = getRecentListings(12);

  const categories = [
    { value: "all", label: "Tüm İlanlar", count: recentListings.length },
    { value: "Grup Arıyorum", label: "Grup Arıyorum", count: getListingsByType("Grup Arıyorum").length },
    { value: "Müzisyen Arıyorum", label: "Müzisyen Arıyorum", count: getListingsByType("Müzisyen Arıyorum").length },
    { value: "Ders Veriyorum", label: "Ders Veriyorum", count: getListingsByType("Ders Veriyorum").length }
  ];

  const getFilteredListings = (category: string) => {
    if (category === "all") return recentListings;
    return getListingsByType(category);
  };

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
        return <Users className="h-4 w-4" />;
      case "Müzisyen Arıyorum":
        return <Music className="h-4 w-4" />;
      case "Ders Veriyorum":
      case "Ders Almak İstiyorum":
        return <BookOpen className="h-4 w-4" />;
      case "Enstrüman Satıyorum":
        return <Music className="h-4 w-4" />;
      case "Stüdyo Kiralıyorum":
        return <Music className="h-4 w-4" />;
      default:
        return <Music className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Grup Arıyorum":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "Müzisyen Arıyorum":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "Ders Veriyorum":
      case "Ders Almak İstiyorum":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "Enstrüman Satıyorum":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "Stüdyo Kiralıyorum":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">En Yeni İlanlar</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Temel kategorilerde verilen son ilanları buradan takip edebilirsin.
            </p>
          </div>

          {/* Category Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white border border-gray-200">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.value} 
                  value={category.value} 
                  className="flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
                >
                  {category.label}
                  <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-700">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.value} value={category.value}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredListings(category.value).map((listing) => (
                    <div key={listing.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                      {/* Image */}
                      <div className="relative aspect-video overflow-hidden">
                        <img 
                          src={listing.image} 
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className={`text-xs border ${getCategoryColor(listing.category)}`}>
                            {listing.category}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                          onClick={() => toggleFavorite(listing.id)}
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
                            <Clock className="h-3 w-3" />
                            {listing.postedDate}
                          </div>
                        </div>

                        {/* Instrument and Experience */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            {getCategoryIcon(listing.category)}
                            {listing.instrument}
                          </div>
                          <Badge variant="outline" className="text-xs border-gray-200">
                            {listing.experience}
                          </Badge>
                        </div>

                        {/* Actions */}
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
              </TabsContent>
            ))}
          </Tabs>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-gray-200 hover:bg-gray-50">
              Hepsini Gör
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestListings;
