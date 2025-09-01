"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ListingsHeader from "@/components/listings/ListingsHeader";
import ListingsFilter from "@/components/listings/ListingsFilter";
import ListingsGrid from "@/components/listings/ListingsGrid";
import ListingsPagination from "@/components/listings/ListingsPagination";

// Mapping between URL slugs and Turkish category names
const categorySlugMap: Record<string, string> = {
  'grup-ariyorum': 'Grup Arıyorum',
  'muzisyen-ariyorum': 'Müzisyen Arıyorum',
  'ders-almak-istiyorum': 'Ders Almak İstiyorum',
  'ders-veriyorum': 'Ders Veriyorum',
  'enstruman-satiyorum': 'Enstrüman Satıyorum',
  'studyo-kiraliyorum': 'Stüdyo Kiralıyorum'
};

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    locations: [] as string[],
    experience: [] as string[],
    instruments: [] as string[]
  });

  // Handle URL parameters on page load
  useEffect(() => {
    const searchParam = searchParams.get('search');
    
    if (searchParam) {
      setSearchQuery(searchParam);
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
      <div className="container mx-auto px-4 py-8">
        <ListingsHeader
          viewMode={viewMode}
          onSearch={handleSearch}
          onViewModeChange={handleViewModeChange}
          onFilterClick={handleFilterClick}
          searchQuery={searchQuery}
        />

        <div className="flex gap-8 mt-8">
          {/* Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <ListingsFilter
                onFiltersChange={handleFiltersChange}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            <ListingsGrid
              searchQuery={searchQuery}
              selectedCategories={activeFilters.categories}
              selectedLocations={activeFilters.locations}
              selectedExperience={activeFilters.experience}
              selectedInstruments={activeFilters.instruments}
              viewMode={viewMode}
              onClearFilters={clearAllFilters}
            />
            <div className="mt-8">
              <ListingsPagination />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
