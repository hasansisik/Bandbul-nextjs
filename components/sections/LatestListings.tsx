"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { getAllListings } from "@/redux/actions/userActions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ListingCard from "@/components/listings/ListingCard";

const LatestListings = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useAppDispatch();
  const { allListings, listingsLoading } = useAppSelector((state) => state.user);

  // Load listings on component mount
  useEffect(() => {
    if (allListings.length === 0) {
      dispatch(getAllListings({}));
    }
  }, [dispatch, allListings.length]);

  // Filter listings based on active tab
  const getFilteredListings = () => {
    if (activeTab === "all") {
      return allListings.slice(0, 6);
    }
    
    // Map tab IDs to category names
    const categoryMap: Record<string, string> = {
      'grup-ariyorum': 'Grup Arıyorum',
      'ders-veriyorum': 'Ders Veriyorum',
      'enstruman-satiyorum': 'Enstrüman Satıyorum',
      'studyo-kiraliyorum': 'Stüdyo Kiralıyorum',
      'muzisyen-ariyorum': 'Müzisyen Arıyorum',
      'ders-almak-istiyorum': 'Ders Almak İstiyorum'
    };
    
    const categoryName = categoryMap[activeTab];
    if (!categoryName) return allListings.slice(0, 6);
    
    return allListings
      .filter(listing => listing.categoryInfo?.name === categoryName)
      .slice(0, 6);
  };

  const listings = getFilteredListings();





  const getTabCounts = () => {
    const categoryMap: Record<string, string> = {
      'grup-ariyorum': 'Grup Arıyorum',
      'ders-veriyorum': 'Ders Veriyorum',
      'enstruman-satiyorum': 'Enstrüman Satıyorum',
      'studyo-kiraliyorum': 'Stüdyo Kiralıyorum',
      'muzisyen-ariyorum': 'Müzisyen Arıyorum',
      'ders-almak-istiyorum': 'Ders Almak İstiyorum'
    };

    return [
      { id: "all", label: "Tümü", count: allListings.length },
      { id: "grup-ariyorum", label: "Grup Arıyorum", count: allListings.filter(l => l.categoryInfo?.name === 'Grup Arıyorum').length },
      { id: "ders-veriyorum", label: "Ders Veriyorum", count: allListings.filter(l => l.categoryInfo?.name === 'Ders Veriyorum').length },
      { id: "enstruman-satiyorum", label: "Enstrüman Satıyorum", count: allListings.filter(l => l.categoryInfo?.name === 'Enstrüman Satıyorum').length },
    ];
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
          {tabs.map((tab) => (
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
          ))}
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
            <Button className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg rounded-xl">
              Tüm İlanları Gör
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestListings;
