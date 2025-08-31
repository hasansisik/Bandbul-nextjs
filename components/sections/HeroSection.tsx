import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Music, Users, Briefcase, Clipboard, MapPin, Filter } from "lucide-react";
import Image from "next/image";

const HeroSection = () => {
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
      placeholder: "NE ARIYORSUN"
    },
    {
      id: "instrument",
      label: "ENSTRÜMAN",
      icon: <Clipboard className="h-4 w-4 text-gray-600" />,
      placeholder: "ENSTRÜMAN"
    },
    {
      id: "city",
      label: "ŞEHİR",
      icon: <MapPin className="h-4 w-4 text-gray-600" />,
      placeholder: "ŞEHİR"
    }
  ];

  return (
    <section className="relative flex items-center mt-8 h-[500px]">
      {/* Background with padding only */}
      <div className="container mx-auto relative z-10 rounded-3xl overflow-hidden h-full">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
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

        <div className="max-w-6xl mx-auto h-full flex flex-col justify-center">
          {/* Text Content */}
          <div className="text-white mb-12 relative z-10 ">
            <h1 className="text-6xl md:text-6xl font-bold leading-tight">
              Yeni Bir İlan Ver
            </h1>
            <p className="text-2xl text-gray-200 mb-8 max-w-2xl">
              Yeni bir ilan verirken
              Kendini en iyi şekilde ifade etmeyi unutma            </p>
          </div>

          {/* Search Card - Below text, centered */}
          <div className="max-w-4xl relative z-10">
            <Card className="bg-white/30 backdrop-blur border-white/20 rounded-3xl p-8 shadow-2xl">
              <CardContent className="p-0">
                {/* Filter Options */}
                <div className="flex gap-4">
                  {filterOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex-1 bg-white/90 backdrop-blur rounded-lg px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-white transition-colors border border-white/20 h-10"
                    >
                      <div className="flex items-center gap-3">
                        {option.icon}
                        <div className="text-sm text-gray-900 font-medium">{option.placeholder}</div>
                      </div>
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  ))}
                  
                  {/* Filter Button */}
                  <Button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 h-10">
                    <Filter className="h-3 w-3" />
                    Filtrele
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
