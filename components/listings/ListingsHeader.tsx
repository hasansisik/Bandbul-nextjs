"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid3X3, List, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getAllListings } from "@/redux/actions/userActions";

interface ListingsHeaderProps {
  onSearch?: (query: string) => void;
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onFilterClick?: () => void;
  viewMode?: 'grid' | 'list';
  searchQuery?: string;
}

const ListingsHeader = ({ onSearch, onViewModeChange, onFilterClick, viewMode = 'grid', searchQuery: propSearchQuery = "" }: ListingsHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState(propSearchQuery);
  const dispatch = useAppDispatch();
  const { allListings, listingsLoading } = useAppSelector((state) => state.user);

  // Update local state when prop changes
  React.useEffect(() => {
    setSearchQuery(propSearchQuery);
  }, [propSearchQuery]);

  // Fetch listings when component mounts
  useEffect(() => {
    dispatch(getAllListings({}));
  }, [dispatch]);

  // Calculate statistics
  const calculateStats = () => {
    if (!allListings || allListings.length === 0) {
      return { total: 0, active: 0, today: 0 };
    }

    const total = allListings.length;
    const active = allListings.filter(listing => listing.status === 'active').length;
    
    // Calculate today's new listings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCount = allListings.filter(listing => {
      const listingDate = new Date(listing.createdAt);
      listingDate.setHours(0, 0, 0, 0);
      return listingDate.getTime() === today.getTime();
    }).length;

    return { total, active, today: todayCount };
  };

  const stats = calculateStats();

  const handleSearch = () => {
    onSearch?.(searchQuery);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    onViewModeChange?.(mode);
  };

  const handleFilterClick = () => {
    onFilterClick?.();
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch?.("");
  };

  return (
    <div className="bg-card/50 backdrop-blur rounded-xl p-8 border border-border/50 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Title and Description */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Müzik İlanları</h1>
          <p className="text-muted-foreground text-base">
            Grup arayanlar, müzisyen arayanlar ve ders verenler için ilanlar
          </p>
        </div>

        {/* Search and View Controls */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 lg:flex-none lg:w-80">
            <Input
              placeholder="İlan ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pr-20 h-12 bg-background/50 backdrop-blur border-border focus:border-ring"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              {searchQuery && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearSearch}
                  className="h-10 w-10 p-0 hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="sm"
                className="h-10 w-10 p-0 bg-primary hover:bg-primary/90"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filter Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex h-12 px-6 border-border hover:bg-accent"
            onClick={handleFilterClick}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtrele
          </Button>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-border rounded-lg bg-muted/50">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className={`h-10 w-10 p-0 rounded-r-none ${viewMode === 'grid' ? 'bg-primary hover:bg-primary/90' : 'hover:bg-accent'}`}
              onClick={() => handleViewModeChange('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className={`h-10 w-10 p-0 rounded-l-none ${viewMode === 'list' ? 'bg-primary hover:bg-primary/90' : 'hover:bg-accent'}`}
              onClick={() => handleViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-8 mt-8 pt-6 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full"></div>
          <span className="text-sm text-muted-foreground">Toplam:</span>
          <span className="text-sm font-semibold text-foreground">
            {listingsLoading ? "Yükleniyor..." : `${stats.total.toLocaleString()} ilan`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <span className="text-sm text-muted-foreground">Aktif:</span>
          <span className="text-sm font-semibold text-foreground">
            {listingsLoading ? "Yükleniyor..." : `${stats.active.toLocaleString()} ilan`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-muted-foreground">Bugün:</span>
          <span className="text-sm font-semibold text-foreground">
            {listingsLoading ? "Yükleniyor..." : `${stats.today} yeni ilan`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListingsHeader;
