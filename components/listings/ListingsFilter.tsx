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
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { getAllListings, getAllCategories } from "@/redux/actions/userActions";
import { getAllExperienceLevels } from "@/redux/actions/experienceLevelActions";
import { categorySlugMap } from "@/utils/constants/categorySlugMap";

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
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { allListings, categories } = useAppSelector((state) => state.user);
  const { experienceLevels: reduxExperienceLevels, loading: experienceLevelsLoading } = useAppSelector((state) => state.experienceLevel);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  
  // Track if we're loading from URL to prevent infinite loop
  const isInitialLoadRef = useRef(true);
  const isUpdatingURLRef = useRef(false);

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
    return categories.map(cat => {
      const count = allListings.filter(listing => {
        const listingCategoryId = listing.categoryInfo?._id || listing.category;
        const listingCategoryName = listing.categoryInfo?.name;
        return listingCategoryId === cat._id || listingCategoryName === cat.name;
      }).length;

      const slugFromData = (cat as any).slug as string | undefined;
      const slugFromMap = Object.entries(categorySlugMap).find(([, name]) => name === cat.name)?.[0];

      return {
        id: cat._id,
        value: cat._id,
        label: cat.name,
        slug: slugFromData || slugFromMap || normalizeText(cat.name),
        count
      };
    });
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

  // Helper function to normalize Turkish characters for slug comparison
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

  const categoryIdToSlug = useCallback((categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    if (!category) return categoryId;

    const slugFromData = (category as any).slug as string | undefined;
    if (slugFromData) return slugFromData;

    const mapEntry = Object.entries(categorySlugMap).find(([, name]) => name === category.name);
    if (mapEntry) return mapEntry[0];

    return normalizeText(category.name);
  }, [categories]);

  // Helper function to convert name/id to slug (locations & instruments)
  const valueToSlug = useCallback((value: string) => {
    return normalizeText(value);
  }, []);

  // Helper function to convert slug to name by matching with available options
  const slugToName = (slug: string, options: Array<{ id: string; name: string }>): string | null => {
    const decoded = decodeURIComponent(slug);
    // First try direct match
    const directMatch = options.find(opt => opt.name === decoded || opt.id === decoded);
    if (directMatch) {
      return directMatch.name;
    }
    // Then try slug match
    const slugMatch = options.find(opt => normalizeText(opt.name) === normalizeText(decoded));
    if (slugMatch) {
      return slugMatch.name;
    }
    return null;
  };

  // Function to update URL with current filters
  const updateURL = useCallback((filters: {
    categories: string[];
    locations: string[];
    experience: string[];
    instruments: string[];
  }) => {
    isUpdatingURLRef.current = true;
    
    const params = new URLSearchParams();
    
    // Add categories to URL
    filters.categories.forEach(category => {
      const slug = categoryIdToSlug(category);
      params.append('category', slug);
    });
    
    // Add locations to URL
    filters.locations.forEach(location => {
      const slug = valueToSlug(location);
      params.append('location', slug);
    });
    
    // Add instruments to URL
    filters.instruments.forEach(instrument => {
      const slug = valueToSlug(instrument);
      params.append('instrument', slug);
    });
    
    // Update URL without page reload
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, { scroll: false });
    
    // Reset flag after a short delay to allow URL update to complete
    setTimeout(() => {
      isUpdatingURLRef.current = false;
    }, 100);
  }, [pathname, router, categoryIdToSlug, valueToSlug]);

  const clearFilters = useCallback(() => {
    isUpdatingURLRef.current = true;
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedExperience([]);
    setSelectedInstruments([]);
    // Clear URL parameters
    router.replace(pathname, { scroll: false });
    setTimeout(() => {
      isUpdatingURLRef.current = false;
    }, 100);
  }, [router, pathname]);

  // Notify parent component when filters change and update URL
  useEffect(() => {
    const filters = {
      categories: selectedCategories,
      locations: selectedLocations,
      experience: selectedExperience,
      instruments: selectedInstruments
    };
    
    onFiltersChange?.(filters);
    
    // Update URL when filters change (but not on initial load from URL)
    if (!isInitialLoadRef.current) {
      updateURL(filters);
    }
  }, [selectedCategories, selectedLocations, selectedExperience, selectedInstruments, onFiltersChange, updateURL]);

  // Handle URL parameters on component mount and when URL changes
  useEffect(() => {
    // Skip if we're currently updating the URL ourselves
    if (isUpdatingURLRef.current) {
      return;
    }
    
    // Wait for data to be loaded
    if (categories.length === 0 || allListings.length === 0) {
      return;
    }
    
    // Get all category parameters (can be multiple)
    const categoryParams = searchParams.getAll('category');
    const instrumentParams = searchParams.getAll('instrument');
    const locationParams = searchParams.getAll('location');
    
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
        const slugMatch = categoryOptions.find(opt => opt.slug === decoded);
        if (slugMatch) return slugMatch.value;

        const mapName = categorySlugMap[decoded];
        if (mapName) {
          const matchByName = categoryOptions.find(opt => opt.label === mapName);
          if (matchByName) return matchByName.value;
        }

        const normalizedDecoded = normalizeText(decoded);
        const normalizedMatch = categoryOptions.find(opt => normalizeText(opt.slug) === normalizedDecoded || normalizeText(opt.label) === normalizedDecoded);
        if (normalizedMatch) return normalizedMatch.value;

        const matchById = categoryOptions.find(opt => opt.value === decoded);
        if (matchById) return matchById.value;

        return null;
      }).filter((value): value is string => Boolean(value));
      
      // Filter out invalid categories and only keep those that exist in categoryOptions
      const validCategories = decodedCategories.filter(catId => 
        categoryOptions.some(opt => opt.value === catId)
      );
      
      newFilters.categories = validCategories;
    }
    
    // Set location filter from URL - convert slug to name
    if (locationParams.length > 0) {
      const decodedLocations = locationParams.map(param => {
        const locationName = slugToName(param, locations);
        return locationName || decodeURIComponent(param);
      });
      newFilters.locations = decodedLocations;
    }
    
    // Set instrument filter from URL - convert slug to name
    if (instrumentParams.length > 0) {
      const decodedInstruments = instrumentParams.map(param => {
        const instrumentName = slugToName(param, instruments);
        return instrumentName || decodeURIComponent(param);
      });
      newFilters.instruments = decodedInstruments;
    }
    
    // Only update state if there are actual changes to prevent unnecessary re-renders
    setSelectedCategories(prev => {
      const prevSorted = [...prev].sort();
      const newSorted = [...newFilters.categories].sort();
      const hasChanged = JSON.stringify(prevSorted) !== JSON.stringify(newSorted);
      return hasChanged ? newFilters.categories : prev;
    });
    
    setSelectedLocations(prev => {
      const prevSorted = [...prev].sort();
      const newSorted = [...newFilters.locations].sort();
      const hasChanged = JSON.stringify(prevSorted) !== JSON.stringify(newSorted);
      return hasChanged ? newFilters.locations : prev;
    });
    
    setSelectedExperience(prev => {
      const prevSorted = [...prev].sort();
      const newSorted = [...newFilters.experience].sort();
      const hasChanged = JSON.stringify(prevSorted) !== JSON.stringify(newSorted);
      return hasChanged ? newFilters.experience : prev;
    });
    
    setSelectedInstruments(prev => {
      const prevSorted = [...prev].sort();
      const newSorted = [...newFilters.instruments].sort();
      const hasChanged = JSON.stringify(prevSorted) !== JSON.stringify(newSorted);
      return hasChanged ? newFilters.instruments : prev;
    });
    
    // Mark initial load as complete after setting filters from URL
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
    }
  }, [searchParams, categories, categoryOptions, locations, instruments, allListings.length]);

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
                  id={`category-${category.value}`}
                  checked={selectedCategories.includes(category.value)}
                  onCheckedChange={() => handleCategoryToggle(category.value)}
                />
                <label
                  htmlFor={`category-${category.value}`}
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
