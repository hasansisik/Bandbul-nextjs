"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageCircle, 
  MapPin, 
  Calendar, 
  User,
  Music
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { listingsData, type ListingItem, searchListings, getListingsByCategory, getListingsByType } from "@/lib/listingsData";
import { generateSlug } from "@/lib/utils";

interface ListingsGridProps {
  searchQuery?: string;
  selectedCategories?: string[];
  selectedLocations?: string[];
  selectedExperience?: string[];
  selectedInstruments?: string[];
  onClearFilters?: () => void;
  viewMode?: 'grid' | 'list';
}

const ListingsGrid = ({ 
  searchQuery = "", 
  selectedCategories = [], 
  selectedLocations = [], 
  selectedExperience = [],
  selectedInstruments = [],
  onClearFilters,
  viewMode = 'grid'
}: ListingsGridProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [filteredListings, setFilteredListings] = useState<ListingItem[]>(listingsData);

  const getTimeFromString = useCallback((timeString: string) => {
    const now = new Date();
    if (timeString.includes("saat")) {
      const hours = parseInt(timeString.match(/(\d+)/)?.[1] || "0");
      return now.getTime() - (hours * 60 * 60 * 1000);
    } else if (timeString.includes("gün")) {
      const days = parseInt(timeString.match(/(\d+)/)?.[1] || "0");
      return now.getTime() - (days * 24 * 60 * 60 * 1000);
    } else if (timeString.includes("hafta")) {
      const weeks = parseInt(timeString.match(/(\d+)/)?.[1] || "0");
      return now.getTime() - (weeks * 7 * 24 * 60 * 60 * 1000);
    }
    return now.getTime();
  }, []);

  const sortListings = useCallback((listings: ListingItem[], sortType: string) => {
    const sorted = [...listings];
    
    switch (sortType) {
      case "newest":
        return sorted.sort((a, b) => {
          const aTime = getTimeFromString(a.postedDate);
          const bTime = getTimeFromString(b.postedDate);
          return bTime - aTime;
        });
      case "oldest":
        return sorted.sort((a, b) => {
          const aTime = getTimeFromString(a.postedDate);
          const bTime = getTimeFromString(b.postedDate);
          return aTime - bTime;
        });
      case "popular":
        return sorted; // No rating to sort by
      default:
        return sorted;
    }
  }, [getTimeFromString]);

  // Apply filters and search
  useEffect(() => {
    let filtered = listingsData;

    // Apply search
    if (searchQuery.trim()) {
      filtered = searchListings(searchQuery);
    }

    // Apply category filters
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(listing => selectedCategories.includes(listing.category));
    }

    // Apply location filters
    if (selectedLocations.length > 0) {
      filtered = filtered.filter(listing => selectedLocations.includes(listing.location));
    }

                // Apply experience filters
            if (selectedExperience.length > 0) {
              filtered = filtered.filter(listing => selectedExperience.includes(listing.experience));
            }

            // Apply instrument filters
            if (selectedInstruments.length > 0) {
              filtered = filtered.filter(listing => 
                listing.instrument && selectedInstruments.includes(listing.instrument)
              );
            }

            // Apply sorting
            filtered = sortListings(filtered, sortBy);

            setFilteredListings(filtered);
          }, [searchQuery, sortBy, selectedCategories, selectedLocations, selectedExperience, selectedInstruments, sortListings]);



  const getCategoryColor = useCallback((category: string) => {
    switch (category) {
      case "Grup Arıyorum":
        return "bg-muted text-muted-foreground border-border";
      case "Ders Veriyorum":
        return "bg-muted text-muted-foreground border-border";
      case "Enstrüman Satıyorum":
        return "bg-muted text-muted-foreground border-border";
      case "Stüdyo Kiralıyorum":
        return "bg-muted text-muted-foreground border-border";
      case "Müzisyen Arıyorum":
        return "bg-muted text-muted-foreground border-border";
      case "Ders Almak İstiyorum":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  }, []);

  const renderListingCard = (listing: ListingItem) => (
    <div key={listing.id} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group">
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
              {listing.category}
            </Badge>
          </div>

        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title and Rating */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-card-foreground text-sm line-clamp-2 flex-1 mr-2 leading-tight">
              {listing.title}
            </h3>

          </div>

          {/* Description */}
          <p className="text-muted-foreground text-xs mb-4 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>

          {/* Location and Date */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {listing.location}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {listing.postedDate}
            </div>
          </div>

          {/* Author and Experience */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              {listing.author}
            </div>
            <Badge variant="outline" className="text-xs border-border">
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
  );

  const renderListingRow = (listing: ListingItem) => (
    <div key={listing.id} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <Link href={`/ilan-detay/${generateSlug(listing.title)}`} className="block">
        <div className="flex">
          {/* Image */}
          <div className="relative w-48 h-32 overflow-hidden flex-shrink-0">
            <img 
              src={listing.image} 
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2">
              <Badge className={`text-xs border ${getCategoryColor(listing.category)}`}>
                {listing.category}
              </Badge>
            </div>

          </div>

          {/* Content */}
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-card-foreground text-base flex-1 mr-4">
                {listing.title}
              </h3>

            </div>

            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {listing.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {listing.location}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {listing.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {listing.postedDate}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs border-border">
                  {listing.experience}
                </Badge>
              </div>
            </div>
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
  );

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <div className="flex items-center justify-between bg-card rounded-lg p-4 shadow-sm border border-border">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground font-medium">Sırala:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px] border-border">
              <SelectValue placeholder="Sıralama seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">En Yeni</SelectItem>
              <SelectItem value="oldest">En Eski</SelectItem>
              <SelectItem value="popular">Popülerlik</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          {filteredListings.length} ilan bulundu
        </span>
      </div>

      {/* Listings */}
      {viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(renderListingCard)}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map(renderListingRow)}
        </div>
      )}

      {/* No Results */}
      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Arama kriterlerinize uygun ilan bulunamadı.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={onClearFilters}
          >
            Filtreleri Temizle
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListingsGrid;
