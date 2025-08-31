"use client";

import { useState, useCallback } from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import ListingsHeader from "@/components/listings/ListingsHeader";
import ListingsFilter from "@/components/listings/ListingsFilter";
import ListingsGrid from "@/components/listings/ListingsGrid";
import ListingsPagination from "@/components/listings/ListingsPagination";

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
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
    setSearchQuery("");
    setActiveFilters({
      categories: [],
      locations: [],
      experience: []
    });
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <ListingsHeader 
          viewMode={viewMode}
          onSearch={handleSearch}
          onViewModeChange={handleViewModeChange}
          onFilterClick={handleFilterClick}
        />
        <div className="grid lg:grid-cols-4 gap-8 mt-8">
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden'}`}>
            <ListingsFilter onFiltersChange={handleFiltersChange} />
          </div>
          <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            <ListingsGrid 
              viewMode={viewMode}
              searchQuery={searchQuery}
              selectedCategories={activeFilters.categories}
              selectedLocations={activeFilters.locations}
              selectedExperience={activeFilters.experience}
              onClearFilters={clearAllFilters}
            />
            <ListingsPagination />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
