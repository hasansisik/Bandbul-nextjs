"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { getAllListings, getAllCategories } from "@/redux/actions/userActions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ListingCard from "@/components/listings/ListingCard";

const LatestListings = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useAppDispatch();
  const { allListings, listingsLoading, categories, categoriesLoading } = useAppSelector((state) => state.user);

  // Load listings and categories on component mount
  useEffect(() => {
    if (allListings.length === 0) {
      dispatch(getAllListings({ limit: '1000', status: 'active' }));
    }
    if (categories.length === 0) {
      dispatch(getAllCategories({}));
    }
  }, [dispatch, allListings.length, categories.length]);

  // Filter listings based on active tab
  const getFilteredListings = () => {
    if (activeTab === "all") {
      return allListings.slice(0, 6);
    }
    
    // Find category by slug or ID
    const category = categories.find(cat => 
      cat.slug === activeTab || 
      cat._id === activeTab ||
      createCategorySlug(cat.name) === activeTab
    );
    
    if (!category) return allListings.slice(0, 6);
    
    return allListings
      .filter(listing => listing.categoryInfo?.name === category.name)
      .slice(0, 6);
  };

  // Function to create category slug for URL (same as Header)
  const createCategorySlug = (categoryName: string) => {
    return categoryName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '-');
  };

  const listings = getFilteredListings();


  const getTabCounts = () => {
    // Always include "All" tab
    const tabs = [
      { id: "all", label: "Tümü", count: allListings.length }
    ];

    // Add dynamic category tabs
    if (categories && categories.length > 0) {
      categories.forEach(category => {
        const count = allListings.filter(listing => 
          listing.categoryInfo?.name === category.name
        ).length;
        
        // Only show categories that have listings or are important
        if (count > 0 || ['Grup Arıyorum', 'Ders Veriyorum', 'Enstrüman Satıyorum', 'Stüdyo Kiralıyorum', 'Müzisyen Arıyorum', 'Ders Almak İstiyorum'].includes(category.name)) {
          tabs.push({
            id: category.slug || createCategorySlug(category.name),
            label: category.name,
            count: count
          });
        }
      });
    }

    return tabs;
  };

  const tabs = getTabCounts();

  return (
    <section className="py-16 bg-muted/10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">En Yeni İlanlar</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Temel kategorilerde verilen son ilanları buradan takip edebilirsin.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categoriesLoading ? (
            // Loading skeleton for tabs
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-10 bg-muted rounded-lg animate-pulse w-24" />
              ))}
            </>
          ) : (
            tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-accent"
                  }`}
              >
                {tab.label}
                <span className="ml-2 text-xs opacity-75">({tab.count})</span>
              </button>
            ))
          )}
        </div>

        {/* Listings Grid */}
        {listingsLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-card/50 backdrop-blur border border-border/50 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-muted"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-muted rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {listings.map((listing) => (
              <ListingCard 
                key={listing._id} 
                listing={listing} 
                viewMode="grid" 
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Henüz ilan bulunmuyor.</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link href="/ilanlar">
          <Button variant="outline" size="default" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-300 border-border">
          Tüm İlanları Gör
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestListings;
