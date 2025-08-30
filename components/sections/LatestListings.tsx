"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, Music, Users, BookOpen } from "lucide-react";

const LatestListings = () => {
  const listings = [
    {
      id: 1,
      title: "DENEYİMLİ TROMPETÇİ ARANIYOR!!",
      city: "Bayburt",
      type: "Müzisyen Arıyorum",
      instrument: "Trompet",
      icon: <Music className="h-4 w-4" />
    },
    {
      id: 2,
      title: "Kadın vokal, jazz stili, downtempo, lounge",
      city: "İstanbul",
      type: "Müzisyen Arıyorum",
      instrument: "Vokal",
      icon: <Music className="h-4 w-4" />
    },
    {
      id: 3,
      title: "İstanbul Trip-hop grubu veya dj arıyorum (duo tercih)",
      city: "İstanbul",
      type: "Müzisyen Arıyorum",
      instrument: "Klavye",
      icon: <Music className="h-4 w-4" />
    },
    {
      id: 4,
      title: "İleri seviye gitar dersi",
      city: "İzmir",
      type: "Ders Almak İstiyorum",
      instrument: "Gitar",
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      id: 5,
      title: "Gitar Dersi Verilir",
      city: "İstanbul",
      type: "Ders Almak İstiyorum",
      instrument: "Gitar",
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      id: 6,
      title: "Hobi projeye bass gitarist aranıyor",
      city: "İstanbul",
      type: "Müzisyen Arıyorum",
      instrument: "Bas Gitar",
      icon: <Music className="h-4 w-4" />
    },
    {
      id: 7,
      title: "Hobi projeye vokal aranıyor",
      city: "İstanbul",
      type: "Müzisyen Arıyorum",
      instrument: "Vokal",
      icon: <Music className="h-4 w-4" />
    },
    {
      id: 8,
      title: "Hardcore, Metalcore grup arıyorum",
      city: "İstanbul",
      type: "Grup Arıyorum",
      instrument: "Gitar",
      icon: <Users className="h-4 w-4" />
    },
    {
      id: 9,
      title: "Davulcu ilanı",
      city: "İstanbul",
      type: "Grup Arıyorum",
      instrument: "Davul",
      icon: <Users className="h-4 w-4" />
    },
    {
      id: 10,
      title: "Ankara grup arıyorum",
      city: "Ankara",
      type: "Grup Arıyorum",
      instrument: "Gitar",
      icon: <Users className="h-4 w-4" />
    }
  ];

  const categories = [
    { value: "all", label: "Tüm İlanlar", count: listings.length },
    { value: "group", label: "Grup Arıyorum", count: listings.filter(l => l.type === "Grup Arıyorum").length },
    { value: "musician", label: "Müzisyen Arıyorum", count: listings.filter(l => l.type === "Müzisyen Arıyorum").length },
    { value: "lesson", label: "Ders Almak İstiyorum", count: listings.filter(l => l.type === "Ders Almak İstiyorum").length }
  ];

  const getFilteredListings = (category: string) => {
    if (category === "all") return listings;
    if (category === "group") return listings.filter(l => l.type === "Grup Arıyorum");
    if (category === "musician") return listings.filter(l => l.type === "Müzisyen Arıyorum");
    if (category === "lesson") return listings.filter(l => l.type === "Ders Almak İstiyorum");
    return listings;
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">En Yeni İlanlar</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Temel kategorilerde verilen son ilanları buradan takip edebilirsin.
            </p>
          </div>

          {/* Category Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category.value} value={category.value} className="flex items-center gap-2">
                  {category.label}
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.value} value={category.value}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredListings(category.value).map((listing) => (
                    <Card key={listing.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 text-primary">
                            {listing.icon}
                            <Badge variant="outline" className="text-xs">
                              {listing.type}
                            </Badge>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {listing.instrument}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardTitle className="text-lg mb-3 line-clamp-2">
                          {listing.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <MapPin className="h-4 w-4" />
                          {listing.city}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Hepsini Gör
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestListings;
