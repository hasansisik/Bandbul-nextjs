"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { getAllListings } from "@/redux/actions/userActions";
import ListingsHeader from "@/components/listings/ListingsHeader";
import ListingsFilter from "@/components/listings/ListingsFilter";
import ListingsGrid from "@/components/listings/ListingsGrid";
import ListingsPagination from "@/components/listings/ListingsPagination";

function ListingsPageContent() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { allListings, listingsLoading } = useAppSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    locations: [] as string[],
    experience: [] as string[],
    instruments: [] as string[]
  });

  // Load listings on component mount
  useEffect(() => {
    if (allListings.length === 0) {
      dispatch(getAllListings({}));
    }
  }, [dispatch, allListings.length]);

  // Function to normalize Turkish characters for URL comparison
  const normalizeTurkishChars = (str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '-');
  };

  // Handle URL parameters on page load
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const categoryParam = searchParams.get('category');
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    if (categoryParam) {
      // Normalize the category parameter from URL
      const normalizedCategory = decodeURIComponent(categoryParam);
      setActiveFilters(prev => ({
        ...prev,
        categories: [normalizedCategory]
      }));
    }
  }, [searchParams]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  const handleFilterClick = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);

  const handleFiltersChange = useCallback((filters: {
    categories: string[];
    locations: string[];
    experience: string[];
    instruments: string[];
  }) => {
    setActiveFilters(filters);
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({
      categories: [],
      locations: [],
      experience: [],
      instruments: []
    });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <ListingsHeader
          viewMode={viewMode}
          onSearch={handleSearch}
          onViewModeChange={handleViewModeChange}
          onFilterClick={handleFilterClick}
          searchQuery={searchQuery}
        />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Sidebar - Show on top for mobile, sidebar for desktop */}
          {showFilters && (
            <div className="w-full lg:w-80 flex-shrink-0 order-1 lg:order-1">
              <ListingsFilter
                onFiltersChange={handleFiltersChange}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 order-2 lg:order-2">
            <ListingsGrid
              listings={allListings}
              listingsLoading={listingsLoading}
              searchQuery={searchQuery}
              selectedCategories={activeFilters.categories}
              selectedLocations={activeFilters.locations}
              selectedExperience={activeFilters.experience}
              selectedInstruments={activeFilters.instruments}
              viewMode={viewMode}
              onClearFilters={clearAllFilters}
            />
            <div className="mt-8">
              <ListingsPagination totalListings={allListings.length} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <ListingsPageContent />
    </Suspense>
  );
}
