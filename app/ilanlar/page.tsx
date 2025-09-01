"use client";

import { useState, useCallback } from "react";
import ListingsHeader from "@/components/listings/ListingsHeader";
import ListingsFilter from "@/components/listings/ListingsFilter";
import ListingsGrid from "@/components/listings/ListingsGrid";
import ListingsPagination from "@/components/listings/ListingsPagination";

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    locations: [] as string[],
    experience: [] as string[]
  });

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
  }) => {
    setActiveFilters(filters);
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({
      categories: [],
      locations: [],
      experience: []
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
              viewMode={viewMode}
              onClearFilters={clearAllFilters}
            />
            <ListingsPagination />
          </div>
        </div>
      </div>
    </main>
  );
}
