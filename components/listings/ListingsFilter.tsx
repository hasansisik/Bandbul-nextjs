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
import { useSearchParams } from "next/navigation";
import { getCategories, getTypes, listingsData } from "@/lib/listingsData";

interface ListingsFilterProps {
  onFiltersChange?: (filters: {
    categories: string[];
    locations: string[];
    experience: string[];
    instruments: string[];
  }) => void;
}

const ListingsFilter = ({ onFiltersChange }: ListingsFilterProps) => {
  const searchParams = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);

  const categories = getCategories();
  const types = getTypes();

  // Get unique locations from data
  const locations = Array.from(new Set(listingsData.map(listing => listing.location)))
    .map(location => ({
      id: location.toLowerCase().replace(/\s+/g, '-'),
      name: location,
      count: listingsData.filter(listing => listing.location === location).length
    }));

  // Get unique instruments from data
  const instruments = Array.from(new Set(listingsData.map(listing => listing.instrument).filter(Boolean)))
    .map(instrument => ({
      id: instrument!.toLowerCase().replace(/\s+/g, '-'),
      name: instrument!,
      count: listingsData.filter(listing => listing.instrument === instrument).length
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

  const handleInstrumentToggle = useCallback((instrumentId: string) => {
    setSelectedInstruments(prev => 
      prev.includes(instrumentId) 
        ? prev.filter(id => id !== instrumentId)
        : [...prev, instrumentId]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedExperience([]);
    setSelectedInstruments([]);
  }, []);

  // Notify parent component when filters change
  useEffect(() => {
    onFiltersChange?.({
      categories: selectedCategories,
      locations: selectedLocations,
      experience: selectedExperience,
      instruments: selectedInstruments
    });
  }, [selectedCategories, selectedLocations, selectedExperience, selectedInstruments, onFiltersChange]);

  // Handle URL parameters on component mount
  useEffect(() => {
    const categorySlug = searchParams.get('category');
    const instrumentParam = searchParams.get('instrument');
    const locationParam = searchParams.get('location');
    
    // Mapping between URL slugs and Turkish category names
    const categorySlugMap: Record<string, string> = {
      'grup-ariyorum': 'Grup Arıyorum',
      'muzisyen-ariyorum': 'Müzisyen Arıyorum',
      'ders-almak-istiyorum': 'Ders Almak İstiyorum',
      'ders-veriyorum': 'Ders Veriyorum',
      'enstruman-satiyorum': 'Enstrüman Satıyorum',
      'studyo-kiraliyorum': 'Stüdyo Kiralıyorum'
    };
    
    const newFilters = {
      categories: [] as string[],
      locations: [] as string[],
      experience: [] as string[],
      instruments: [] as string[]
    };
    
    // Set category filter
    if (categorySlug && categorySlugMap[categorySlug]) {
      newFilters.categories = [categorySlugMap[categorySlug]];
    }
    
    // Set location filter
    if (locationParam) {
      newFilters.locations = [locationParam.toLowerCase().replace(/\s+/g, '-')];
    }
    
    // Set instrument filter
    if (instrumentParam) {
      newFilters.instruments = [instrumentParam.toLowerCase().replace(/\s+/g, '-')];
    }
    
    // Update state
    setSelectedCategories(newFilters.categories);
    setSelectedLocations(newFilters.locations);
    setSelectedExperience(newFilters.experience);
    setSelectedInstruments(newFilters.instruments);
  }, [searchParams]);

  const hasActiveFilters = selectedCategories.length > 0 || selectedLocations.length > 0 || selectedExperience.length > 0 || selectedInstruments.length > 0;

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-card-foreground">Filtreler</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Temizle
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center">
            <Music className="h-3 w-3 text-muted-foreground" />
          </div>
          Kategoriler
        </h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.value} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={category.value}
                  checked={selectedCategories.includes(category.value)}
                  onCheckedChange={() => handleCategoryToggle(category.value)}
                />
                <label
                  htmlFor={category.value}
                  className="text-sm text-card-foreground cursor-pointer"
                >
                  {category.label}
                </label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Locations */}
      <div className="mb-6">
        <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center">
            <MapPin className="h-3 w-3 text-muted-foreground" />
          </div>
          Lokasyonlar
        </h4>
        <div className="space-y-2">
          {locations.map((location) => (
            <div key={location.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={location.id}
                  checked={selectedLocations.includes(location.id)}
                  onCheckedChange={() => handleLocationToggle(location.id)}
                />
                <label
                  htmlFor={location.id}
                  className="text-sm text-card-foreground cursor-pointer"
                >
                  {location.name}
                </label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {location.count}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Instruments */}
      <div className="mb-6">
        <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center">
            <Music className="h-3 w-3 text-muted-foreground" />
          </div>
          Enstrümanlar
        </h4>
        <div className="space-y-2">
          {instruments.map((instrument) => (
            <div key={instrument.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={instrument.id}
                  checked={selectedInstruments.includes(instrument.id)}
                  onCheckedChange={() => handleInstrumentToggle(instrument.id)}
                />
                <label
                  htmlFor={instrument.id}
                  className="text-sm text-card-foreground cursor-pointer"
                >
                  {instrument.name}
                </label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {instrument.count}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Experience Level */}
      <div className="mb-6">
        <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center">
            <Users className="h-3 w-3 text-muted-foreground" />
          </div>
          Deneyim Seviyesi
        </h4>
        <div className="space-y-2">
          {experienceLevels.map((level) => (
            <div key={level.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={level.id}
                  checked={selectedExperience.includes(level.id)}
                  onCheckedChange={() => handleExperienceToggle(level.id)}
                />
                <label
                  htmlFor={level.id}
                  className="text-sm text-card-foreground cursor-pointer"
                >
                  {level.name}
                </label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {level.count}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Filters */}
      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="sm">
        Filtreleri Uygula
      </Button>
    </div>
  );
};

export default ListingsFilter;
