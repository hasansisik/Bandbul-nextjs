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
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { getAllListings, getAllCategories } from "@/redux/actions/userActions";
import { getAllExperienceLevels } from "@/redux/actions/experienceLevelActions";

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
  const dispatch = useAppDispatch();
  const { allListings, categories } = useAppSelector((state) => state.user);
  const { experienceLevels: reduxExperienceLevels, loading: experienceLevelsLoading } = useAppSelector((state) => state.experienceLevel);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);

  // Load data on component mount
  useEffect(() => {
    if (allListings.length === 0) {
      dispatch(getAllListings({ limit: '1000', status: 'active' }));
    }
    if (categories.length === 0) {
      dispatch(getAllCategories({}));
    }
    if (reduxExperienceLevels.length === 0) {
      dispatch(getAllExperienceLevels({ active: true }));
    }
  }, [dispatch, allListings.length, categories.length, reduxExperienceLevels.length]);

  const categoryOptions = useMemo(() => {
    return categories.map(cat => ({
      value: cat.name, // Use category name instead of ID for filtering
      label: cat.name,
      count: allListings.filter(listing => listing.categoryInfo?.name === cat.name || listing.category === cat.name).length
    }));
  }, [categories, allListings]);

  // Get unique locations from Redux state
  const locations = Array.from(new Set(allListings.map(listing => listing.location)))
    .map(location => ({
      id: location, // Use actual location name for filtering
      name: location,
      count: allListings.filter(listing => listing.location === location).length
    }));

  // Get unique instruments from Redux state (using populated instrumentInfo)
  const instruments = Array.from(new Set(
    allListings
      .map(listing => listing.instrumentInfo?.name || listing.instrument)
      .filter(Boolean)
  ))
    .map(instrument => ({
      id: instrument!, // Use actual instrument name for filtering
      name: instrument!,
      count: allListings.filter(listing => 
        (listing.instrumentInfo?.name || listing.instrument) === instrument
      ).length
    }));

  const experienceLevels = useMemo(() => {
    return reduxExperienceLevels
      .filter(level => level.active)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(level => ({
        id: level.name,
        name: level.name,
        count: allListings.filter(l => l.experience === level.name).length
      }))
  }, [reduxExperienceLevels, allListings])

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
    // Get all category parameters (can be multiple)
    const categoryParams = searchParams.getAll('category');
    const instrumentParam = searchParams.get('instrument');
    const locationParam = searchParams.get('location');
    
    // Mapping between URL slugs and Turkish category names
    const categorySlugMap: Record<string, string> = {
      'grup-ariyorum': 'Grup Arıyorum',
      'muzisyen-ariyorum': 'Müzisyen Arıyorum',
      'ders-almak-istiyorum': 'Ders Almak İstiyorum',
      'ders-veriyorum': 'Ders Veriyorum',
      'profesyonel-ders-veriyorum': 'Profesyonel Ders Veriyorum',
      'enstruman-satiyorum': 'Enstrüman Satıyorum',
      'studyo-kiraliyorum': 'Stüdyo Kiralıyorum'
    };
    
    const newFilters = {
      categories: [] as string[],
      locations: [] as string[],
      experience: [] as string[],
      instruments: [] as string[]
    };
    
    // Set category filters from URL - handle multiple categories
    if (categoryParams.length > 0) {
      const decodedCategories = categoryParams.map(param => {
        const decoded = decodeURIComponent(param);
        // Check if it's a slug that needs mapping
        if (categorySlugMap[decoded]) {
          return categorySlugMap[decoded];
        }
        // Check if it's already a category name (direct match)
        // Try to match with existing categories
        const matchingCategory = categories.find(cat => 
          cat.name === decoded || 
          cat.name.toLowerCase().replace(/\s+/g, '-') === decoded.toLowerCase()
        );
        if (matchingCategory) {
          return matchingCategory.name;
        }
        // Return decoded value as-is (might be a direct category name)
        return decoded;
      });
      
      // Filter out invalid categories and only keep those that exist in categoryOptions
      const validCategories = decodedCategories.filter(catName => 
        categoryOptions.some(opt => opt.value === catName || opt.label === catName)
      );
      
      newFilters.categories = validCategories;
    }
    
    // Set location filter from URL
    if (locationParam) {
      newFilters.locations = [decodeURIComponent(locationParam)];
    }
    
    // Set instrument filter from URL
    if (instrumentParam) {
      newFilters.instruments = [decodeURIComponent(instrumentParam)];
    }
    
    // Only update state if there are changes to prevent unnecessary re-renders
    setSelectedCategories(prev => {
      const hasChanged = JSON.stringify(prev.sort()) !== JSON.stringify(newFilters.categories.sort());
      return hasChanged ? newFilters.categories : prev;
    });
    
    setSelectedLocations(prev => {
      const hasChanged = JSON.stringify(prev.sort()) !== JSON.stringify(newFilters.locations.sort());
      return hasChanged ? newFilters.locations : prev;
    });
    
    setSelectedExperience(prev => {
      const hasChanged = JSON.stringify(prev.sort()) !== JSON.stringify(newFilters.experience.sort());
      return hasChanged ? newFilters.experience : prev;
    });
    
    setSelectedInstruments(prev => {
      const hasChanged = JSON.stringify(prev.sort()) !== JSON.stringify(newFilters.instruments.sort());
      return hasChanged ? newFilters.instruments : prev;
    });
  }, [searchParams, categories, categoryOptions]);

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
          {categoryOptions.map((category) => (
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
    </div>
  );
};

export default ListingsFilter;
