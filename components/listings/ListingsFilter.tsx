"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Filter, 
  MapPin, 
  Music, 
  Users, 
  X,
  ChevronDown
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { getCategories, getTypes, listingsData } from "@/lib/listingsData";

interface ListingsFilterProps {
  onFiltersChange?: (filters: {
    categories: string[];
    locations: string[];
    experience: string[];
  }) => void;
}

const ListingsFilter = ({ onFiltersChange }: ListingsFilterProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);

  const categories = getCategories();
  const types = getTypes();

  // Get unique locations from data
  const locations = Array.from(new Set(listingsData.map(listing => listing.location)))
    .map(location => ({
      id: location.toLowerCase().replace(/\s+/g, '-'),
      name: location,
      count: listingsData.filter(listing => listing.location === location).length
    }));

  const experienceLevels = [
    { id: "baslangic", name: "Başlangıç", count: listingsData.filter(l => l.experience === "Başlangıç").length },
    { id: "orta", name: "Orta", count: listingsData.filter(l => l.experience === "Orta").length },
    { id: "ileri", name: "İleri", count: listingsData.filter(l => l.experience === "İleri").length },
    { id: "profesyonel", name: "Profesyonel", count: listingsData.filter(l => l.experience === "Profesyonel").length }
  ];

  const handleCategoryToggle = useCallback((categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const handleLocationToggle = useCallback((locationId: string) => {
    setSelectedLocations(prev => 
      prev.includes(locationId) 
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  }, []);

  const handleExperienceToggle = useCallback((experienceId: string) => {
    setSelectedExperience(prev => 
      prev.includes(experienceId) 
        ? prev.filter(id => id !== experienceId)
        : [...prev, experienceId]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedExperience([]);
  }, []);

  // Notify parent component when filters change
  useEffect(() => {
    onFiltersChange?.({
      categories: selectedCategories,
      locations: selectedLocations,
      experience: selectedExperience
    });
  }, [selectedCategories, selectedLocations, selectedExperience, onFiltersChange]);

  const hasActiveFilters = selectedCategories.length > 0 || selectedLocations.length > 0 || selectedExperience.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <Filter className="h-4 w-4 text-gray-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Filtreler</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Temizle
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center">
            <Music className="h-3 w-3 text-gray-600" />
          </div>
          Kategoriler
        </h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.value} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={category.value}
                  checked={selectedCategories.includes(category.value)}
                  onCheckedChange={() => handleCategoryToggle(category.value)}
                />
                <label
                  htmlFor={category.value}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {category.label}
                </label>
              </div>
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                {category.count}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Locations */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center">
            <MapPin className="h-3 w-3 text-gray-600" />
          </div>
          Lokasyonlar
        </h4>
        <div className="space-y-2">
          {locations.map((location) => (
            <div key={location.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={location.id}
                  checked={selectedLocations.includes(location.id)}
                  onCheckedChange={() => handleLocationToggle(location.id)}
                />
                <label
                  htmlFor={location.id}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {location.name}
                </label>
              </div>
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                {location.count}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Experience Level */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center">
            <Users className="h-3 w-3 text-gray-600" />
          </div>
          Deneyim Seviyesi
        </h4>
        <div className="space-y-2">
          {experienceLevels.map((level) => (
            <div key={level.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={level.id}
                  checked={selectedExperience.includes(level.id)}
                  onCheckedChange={() => handleExperienceToggle(level.id)}
                />
                <label
                  htmlFor={level.id}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {level.name}
                </label>
              </div>
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                {level.count}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Filters */}
      <Button className="w-full bg-black hover:bg-gray-800" size="sm">
        Filtreleri Uygula
      </Button>
    </div>
  );
};

export default ListingsFilter;
