"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid3X3, List } from "lucide-react";
import { useState } from "react";

interface ListingsHeaderProps {
  onSearch?: (query: string) => void;
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onFilterClick?: () => void;
  viewMode?: 'grid' | 'list';
}

const ListingsHeader = ({ onSearch, onViewModeChange, onFilterClick, viewMode = 'grid' }: ListingsHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch?.(searchQuery);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    onViewModeChange?.(mode);
  };

  const handleFilterClick = () => {
    onFilterClick?.();
  };

  return (
    <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Title and Description */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Müzik İlanları</h1>
          <p className="text-gray-600 text-base">
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
              className="pr-12 h-12 bg-gray-50 border-gray-200 focus:border-gray-400"
            />
            <Button
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 p-0 bg-black hover:bg-gray-800"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex h-12 px-6 border-gray-200 hover:bg-gray-50"
            onClick={handleFilterClick}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtrele
          </Button>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className={`h-10 w-10 p-0 rounded-r-none ${viewMode === 'grid' ? 'bg-black hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              onClick={() => handleViewModeChange('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className={`h-10 w-10 p-0 rounded-l-none ${viewMode === 'list' ? 'bg-black hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              onClick={() => handleViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-8 mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-600">Toplam:</span>
          <span className="text-sm font-semibold text-gray-900">1,247 ilan</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-600">Aktif:</span>
          <span className="text-sm font-semibold text-gray-900">892 ilan</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-600">Bugün:</span>
          <span className="text-sm font-semibold text-gray-900">23 yeni</span>
        </div>
      </div>
    </div>
  );
};

export default ListingsHeader;
