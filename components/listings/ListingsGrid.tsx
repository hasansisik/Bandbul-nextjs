"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useCallback, useMemo } from "react";
import ListingCard from "./ListingCard";
import { categorySlugMap } from "@/utils/constants/categorySlugMap";
interface ListingsGridProps {
  listings: any[];
  listingsLoading: boolean;
  searchQuery?: string;
  selectedCategories?: string[];
  selectedLocations?: string[];
  selectedExperience?: string[];
  selectedInstruments?: string[];
  onClearFilters?: () => void;
  viewMode?: 'grid' | 'list';
  currentPage?: number;
  itemsPerPage?: number;
  onFilteredCountChange?: (count: number) => void;
}

const ListingsGrid = ({ 
  listings,
  listingsLoading,
  searchQuery = "", 
  selectedCategories = [], 
  selectedLocations = [], 
  selectedExperience = [],
  selectedInstruments = [],
  onClearFilters,
  viewMode = 'grid',
  currentPage = 1,
  itemsPerPage = 12,
  onFilteredCountChange
}: ListingsGridProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [filteredListings, setFilteredListings] = useState<any[]>([]);

  // Calculate paginated listings
  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredListings.slice(startIndex, endIndex);
  }, [filteredListings, currentPage, itemsPerPage]);

  const sortListings = useCallback((listings: any[], sortType: string) => {
    const sorted = [...listings];
    
    switch (sortType) {
      case "newest":
        return sorted.sort((a, b) => {
          const aTime = new Date(a.createdAt || 0).getTime();
          const bTime = new Date(b.createdAt || 0).getTime();
          return bTime - aTime;
        });
      case "oldest":
        return sorted.sort((a, b) => {
          const aTime = new Date(a.createdAt || 0).getTime();
          const bTime = new Date(b.createdAt || 0).getTime();
          return aTime - bTime;
        });
      case "popular":
        return sorted; // No rating to sort by
      default:
        return sorted;
    }
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = listings;

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(listing => {
        const instrumentName = listing.instrumentInfo?.name || listing.instrument;
        return listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          instrumentName?.toLowerCase().includes(searchQuery.toLowerCase())
      });
    }

    const isLikelyObjectId = (value: string | undefined) => {
      if (!value) return false;
      return /^[a-fA-F0-9]{24}$/.test(value);
    };

    const normalizeText = (text: string) => {
      return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    };

    // Apply category filters
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(listing => {
        const listingCategoryId = isLikelyObjectId(listing.categoryInfo?._id)
          ? listing.categoryInfo?._id
          : isLikelyObjectId(listing.category) ? listing.category : undefined;
        const listingCategoryName = listing.categoryInfo?.name || (!isLikelyObjectId(listing.category) ? listing.category : undefined);
        const listingCategorySlug = listing.categoryInfo?.slug || (listingCategoryName ? normalizeText(listingCategoryName) : undefined);

        return selectedCategories.some(selectedCategory => {
          if (listingCategoryId && selectedCategory === listingCategoryId) {
            return true;
          }

          // Check if it's a slug (contains hyphens) and convert to Turkish name
          if (selectedCategory.includes('-')) {
            const turkishName = categorySlugMap[selectedCategory];
            if (turkishName && listingCategoryName === turkishName) {
              return true;
            }

            if (listingCategorySlug && selectedCategory === listingCategorySlug) {
              return true;
            }
          }

          // If it's already a Turkish name, compare directly
          if (listingCategoryName && listingCategoryName === selectedCategory) {
            return true;
          }

          return false;
        });
      });
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
      filtered = filtered.filter(listing => {
        const instrumentName = listing.instrumentInfo?.name || listing.instrument;
        return instrumentName && selectedInstruments.includes(instrumentName);
      });
    }

    // Apply sorting
    filtered = sortListings(filtered, sortBy);

    setFilteredListings(filtered);
  }, [listings, searchQuery, sortBy, selectedCategories, selectedLocations, selectedExperience, selectedInstruments, sortListings]);

  // Notify parent component of filtered count changes
  useEffect(() => {
    onFilteredCountChange?.(filteredListings.length);
  }, [filteredListings.length, onFilteredCountChange]);









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
          {filteredListings.length} / {listings.length} ilan
        </span>
      </div>

      {/* Listings */}
      {listingsLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">İlanlar yükleniyor...</p>
        </div>
      ) : filteredListings.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedListings.map((listing) => (
              <ListingCard 
                key={listing._id} 
                listing={listing} 
                viewMode="grid" 
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedListings.map((listing) => (
              <ListingCard 
                key={listing._id} 
                listing={listing} 
                viewMode="list" 
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {searchQuery || selectedCategories.length > 0 || selectedLocations.length > 0 || selectedExperience.length > 0 || selectedInstruments.length > 0
              ? "Arama kriterlerinize uygun ilan bulunamadı."
              : "Henüz ilan bulunmuyor."
            }
          </p>
          {(searchQuery || selectedCategories.length > 0 || selectedLocations.length > 0 || selectedExperience.length > 0 || selectedInstruments.length > 0) && onClearFilters && (
            <Button onClick={onClearFilters} variant="outline" className="mt-4">
              Filtreleri Temizle
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ListingsGrid;
