"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Music, Users, Briefcase, Clipboard, MapPin, Filter } from "lucide-react";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { getAllListings, getAllCategories } from "@/redux/actions/userActions";

const HeroSection = () => {
  const dispatch = useAppDispatch();
  const { allListings, categories } = useAppSelector((state) => state.user);
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showInstrumentDropdown, setShowInstrumentDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [instrumentSearchTerm, setInstrumentSearchTerm] = useState("");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");

  // Refs for dropdown containers
  const categoryRef = useRef<HTMLDivElement>(null);
  const instrumentRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Load data on component mount
  useEffect(() => {
    if (allListings.length === 0) {
      dispatch(getAllListings({}));
    }
    if (categories.length === 0) {
      dispatch(getAllCategories({}));
    }
  }, [dispatch, allListings.length, categories.length]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (instrumentRef.current && !instrumentRef.current.contains(event.target as Node)) {
        setShowInstrumentDropdown(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get filter options from Redux state
  const categoryOptions = categories.map(cat => ({
    value: cat._id,
    label: cat.name,
    count: allListings.filter(listing => listing.category === cat._id).length
  }));
  const instruments = Array.from(new Set(allListings.map(listing => listing.instrument).filter(Boolean)));
  const locations = Array.from(new Set(allListings.map(listing => listing.location)));

  // Helper function to normalize Turkish characters for search
  const normalizeText = (text: string) => {
    return text
      .normalize('NFD') // Decompose characters (İ becomes I + combining dot)
      .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritical marks
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c');
  };

  // Filter options based on search terms (case insensitive with Turkish character normalization)
  const filteredCategoryOptions = categoryOptions.filter(category =>
    normalizeText(category.label).includes(normalizeText(categorySearchTerm))
  );
  const filteredInstruments = instruments.filter(instrument =>
    normalizeText(instrument || '').includes(normalizeText(instrumentSearchTerm))
  );
  const filteredLocations = locations.filter(location => {
    const searchTerm = normalizeText(locationSearchTerm.trim());
    const locationNormalized = normalizeText(location);
    return locationNormalized.includes(searchTerm);
  });

  const searchOptions = [
    {
      id: "find-talent",
      label: "Müzisyen Bul",
      icon: <Music className="h-4 w-4" />,
      active: true
    },
    {
      id: "browse-jobs",
      label: "İlanları Görüntüle",
      icon: <Users className="h-4 w-4" />,
      active: false
    }
  ];

  const filterOptions = [
    {
      id: "search-type",
      label: "NE ARIYORSUN",
      icon: <Briefcase className="h-4 w-4 text-gray-600" />,
      placeholder: selectedCategory || "NE ARIYORSUN",
      onClick: () => setShowCategoryDropdown(!showCategoryDropdown)
    },
    {
      id: "instrument",
      label: "ENSTRÜMAN",
      icon: <Clipboard className="h-4 w-4 text-gray-600" />,
      placeholder: selectedInstrument || "ENSTRÜMAN",
      onClick: () => setShowInstrumentDropdown(!showInstrumentDropdown)
    },
    {
      id: "city",
      label: "ŞEHİR",
      icon: <MapPin className="h-4 w-4 text-gray-600" />,
      placeholder: selectedLocation || "ŞEHİR",
      onClick: () => setShowLocationDropdown(!showLocationDropdown)
    }
  ];

  const handleFilter = () => {
    const params = new URLSearchParams();
    
    if (selectedCategory) {
      // Convert Turkish category name to URL slug
      const categorySlugMap: Record<string, string> = {
        'Grup Arıyorum': 'grup-ariyorum',
        'Müzisyen Arıyorum': 'muzisyen-ariyorum',
        'Ders Almak İstiyorum': 'ders-almak-istiyorum',
        'Ders Veriyorum': 'ders-veriyorum',
        'Enstrüman Satıyorum': 'enstruman-satiyorum',
        'Stüdyo Kiralıyorum': 'studyo-kiraliyorum'
      };
      params.set('category', categorySlugMap[selectedCategory] || selectedCategory.toLowerCase().replace(/\s+/g, '-'));
    }
    
    if (selectedInstrument) {
      params.set('instrument', selectedInstrument);
    }
    
    if (selectedLocation) {
      params.set('location', selectedLocation);
    }
    
    // Navigate to listings page with filters
    const queryString = params.toString();
    window.location.href = `/ilanlar${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <section className="relative flex items-center mt-8 h-[500px] md:h-[500px] px-4">
      {/* Background with padding only */}
      <div className="container mx-auto relative z-10 rounded-3xl overflow-visible h-full">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 rounded-3xl overflow-hidden">
          <Image
            src="/hero.jpg"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="max-w-6xl mx-auto h-full flex flex-col justify-center px-6 md:px-4">
          {/* Text Content */}
          <div className="text-white mb-8 md:mb-12 relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
              Yeni Bir İlan Ver
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-6 md:mb-8 max-w-2xl">
              Yeni bir ilan verirken
              Kendini en iyi şekilde ifade etmeyi unutma
            </p>
          </div>

          {/* Search Card - Below text, centered */}
          <div className="max-w-4xl relative z-50">
            <Card className="bg-white/30 backdrop-blur border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
              <CardContent className="p-0">
                {/* Filter Options */}
                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                  {/* Category Filter */}
                  <div className="flex-1 relative" ref={categoryRef}>
                    <div
                      onClick={() => {
                        setShowCategoryDropdown(!showCategoryDropdown);
                        if (!showCategoryDropdown) {
                          setCategorySearchTerm("");
                        }
                      }}
                      className="bg-white/90 backdrop-blur rounded-lg px-3 md:px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-white transition-colors border border-white/20 h-10 md:h-10"
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <Briefcase className="h-4 w-4 text-gray-600" />
                        <div className="text-xs md:text-sm text-gray-900 font-medium">
                          {selectedCategory || "NE ARIYORSUN"}
                        </div>
                      </div>
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {/* Category Dropdown */}
                    {showCategoryDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden">
                        {/* Search Input */}
                        <div className="p-3 border-b border-gray-100">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type="text"
                              placeholder="Kategori ara..."
                              value={categorySearchTerm}
                              onChange={(e) => setCategorySearchTerm(e.target.value)}
                              className="pl-10 pr-4 py-2 text-sm border-gray-200 focus:border-gray-300 focus:ring-0"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto scrollbar-hide">
                          {filteredCategoryOptions.length > 0 ? (
                            filteredCategoryOptions.map((category) => (
                              <div
                                key={category.value}
                                onClick={() => {
                                  setSelectedCategory(category.label);
                                  setShowCategoryDropdown(false);
                                  setCategorySearchTerm("");
                                }}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-900 transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                              >
                                {category.label}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                              Kategori bulunamadı
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Instrument Filter */}
                  <div className="flex-1 relative" ref={instrumentRef}>
                    <div
                      onClick={() => {
                        setShowInstrumentDropdown(!showInstrumentDropdown);
                        if (!showInstrumentDropdown) {
                          setInstrumentSearchTerm("");
                        }
                      }}
                      className="bg-white/90 backdrop-blur rounded-lg px-3 md:px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-white transition-colors border border-white/20 h-10 md:h-10"
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <Clipboard className="h-4 w-4 text-gray-600" />
                        <div className="text-xs md:text-sm text-gray-900 font-medium">
                          {selectedInstrument || "ENSTRÜMAN"}
                        </div>
                      </div>
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {/* Instrument Dropdown */}
                    {showInstrumentDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden">
                        {/* Search Input */}
                        <div className="p-3 border-b border-gray-100">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type="text"
                              placeholder="Enstrüman ara..."
                              value={instrumentSearchTerm}
                              onChange={(e) => setInstrumentSearchTerm(e.target.value)}
                              className="pl-10 pr-4 py-2 text-sm border-gray-200 focus:border-gray-300 focus:ring-0"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto scrollbar-hide">
                          {filteredInstruments.length > 0 ? (
                            filteredInstruments.map((instrument) => (
                              <div
                                key={instrument}
                                onClick={() => {
                                  setSelectedInstrument(instrument || '');
                                  setShowInstrumentDropdown(false);
                                  setInstrumentSearchTerm("");
                                }}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-900 transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                              >
                                {instrument}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                              Enstrüman bulunamadı
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location Filter */}
                  <div className="flex-1 relative" ref={locationRef}>
                    <div
                      onClick={() => {
                        setShowLocationDropdown(!showLocationDropdown);
                        if (!showLocationDropdown) {
                          setLocationSearchTerm("");
                        }
                      }}
                      className="bg-white/90 backdrop-blur rounded-lg px-3 md:px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-white transition-colors border border-white/20 h-10 md:h-10"
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <div className="text-xs md:text-sm text-gray-900 font-medium">
                          {selectedLocation || "ŞEHİR"}
                        </div>
                      </div>
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {/* Location Dropdown */}
                    {showLocationDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden">
                        {/* Search Input */}
                        <div className="p-3 border-b border-gray-100">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type="text"
                              placeholder="Şehir ara..."
                              value={locationSearchTerm}
                              onChange={(e) => setLocationSearchTerm(e.target.value)}
                              className="pl-10 pr-4 py-2 text-sm border-gray-200 focus:border-gray-300 focus:ring-0"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto scrollbar-hide">
                          {filteredLocations.length > 0 ? (
                            filteredLocations.map((location) => (
                              <div
                                key={location}
                                onClick={() => {
                                  setSelectedLocation(location);
                                  setShowLocationDropdown(false);
                                  setLocationSearchTerm("");
                                }}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-900 transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                              >
                                {location}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                              Şehir bulunamadı
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Filter Button */}
                  <Button 
                    onClick={handleFilter}
                    className="bg-black hover:bg-gray-700 text-white px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-medium flex items-center justify-center gap-2 h-10 md:h-10 w-full md:w-auto"
                  >
                    <Filter className="h-3 w-3" />
                    İlan Ara
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
