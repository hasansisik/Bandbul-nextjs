"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

const SearchSection = () => {
  const searchTypes = [
    "Hepsini Seç",
    "Grup Arıyorum",
    "Müzisyen Arıyorum",
    "Ders Almak İstiyorum"
  ];

  const instruments = [
    "Hepsini Seç",
    "Gitar",
    "Bas Gitar",
    "Davul",
    "Piano",
    "Klavye",
    "Saksafon",
    "Keman",
    "Vokal",
    "Kontrabas",
    "Trompet"
  ];

  const cities = [
    "Hepsini Seç",
    "Adana", "Adıyaman", "Afyon", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin",
    "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa",
    "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ",
    "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
    "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri",
    "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa",
    "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize",
    "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon",
    "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt",
    "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova",
    "Karabük", "Kilis", "Osmaniye", "Düzce"
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Section Title */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">NE ARIYORSUN</h2>
                  <p className="text-muted-foreground">İhtiyacınıza uygun ilanları bulun</p>
                </div>

                {/* Search Filters */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Search Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">İlan Türü</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Hepsini Seç" />
                      </SelectTrigger>
                      <SelectContent>
                        {searchTypes.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase()}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Instrument */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ENSTRÜMAN</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Hepsini Seç" />
                      </SelectTrigger>
                      <SelectContent>
                        {instruments.map((instrument) => (
                          <SelectItem key={instrument} value={instrument.toLowerCase()}>
                            {instrument}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ŞEHİR</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Hepsini Seç" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city.toLowerCase()}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Filter Button */}
                <div className="flex justify-center pt-4">
                  <Button className="px-8">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrele
                  </Button>
                </div>

                {/* Quick Filters */}
                <div className="pt-6 border-t">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      Grup Arıyorum
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      Müzisyen Arıyorum
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      Ders Almak İstiyorum
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      Gitar
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      İstanbul
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
