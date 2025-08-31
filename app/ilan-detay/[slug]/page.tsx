"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  User,
  Star,
  ArrowLeft,
  Share2,
  Phone,
  Mail,
  Award
} from "lucide-react";
import { listingsData, type ListingItem } from "@/lib/listingsData";
import { generateSlug } from "@/lib/utils";

export default function ListingDetailPage() {
  const params = useParams();
  const [listing, setListing] = useState<ListingItem | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Find listing by slug
    const foundListing = listingsData.find(item => {
      const itemSlug = generateSlug(item.title);
      return itemSlug === params.slug;
    });

    if (foundListing) {
      setListing(foundListing);
    }
  }, [params.slug]);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (!listing) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">İlan bulunamadı.</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:text-gray-900"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200">
              <img 
                src={listing.image} 
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-white/90 text-gray-700 border-gray-200">
                  {listing.category}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 bg-white/90 hover:bg-white shadow-sm"
                  onClick={handleFavorite}
                >
                  <Heart 
                    className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 bg-white/90 hover:bg-white shadow-sm"
                >
                  <Share2 className="h-5 w-5 text-gray-600" />
                </Button>
              </div>
            </div>

            {/* Title and Rating */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {listing.title}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {listing.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {listing.postedDate}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold text-gray-700">{listing.rating}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Açıklama</h2>
              <p className="text-gray-700 leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Detaylar</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">İlan Sahibi</p>
                    <p className="font-medium text-gray-900">{listing.author}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Deneyim</p>
                    <Badge variant="outline" className="text-sm border-gray-200">
                      {listing.experience}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim</h3>
              {isLoggedIn ? (
                <div className="space-y-3">
                  <Button className="w-full bg-black hover:bg-gray-800">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Mesaj Gönder
                  </Button>
                  <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50">
                    <Phone className="h-4 w-4 mr-2" />
                    Telefon Et
                  </Button>
                  <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50">
                    <Mail className="h-4 w-4 mr-2" />
                    E-posta Gönder
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-3">İletişim kurmak için giriş yapın</p>
                  <Button className="w-full bg-black hover:bg-gray-800">
                    Giriş Yap
                  </Button>
                </div>
              )}
            </div>

            {/* Category Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori</h3>
              <Badge className="text-sm bg-gray-50 text-gray-700 border-gray-200">
                {listing.category}
              </Badge>
            </div>

            {/* Similar Listings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Benzer İlanlar</h3>
              <div className="space-y-3">
                {listingsData
                  .filter(item => item.category === listing.category && item.id !== listing.id)
                  .slice(0, 3)
                  .map(item => (
                    <div key={item.id} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-100">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-16 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500">{item.location}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
