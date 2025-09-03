"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, MapPin, Calendar, Music } from "lucide-react";
import Link from "next/link";

interface ListingCardProps {
  listing: any;
  viewMode: 'grid' | 'list';
  isLoggedIn?: boolean;
}

const ListingCard = ({ listing, viewMode, isLoggedIn = false }: ListingCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Grup Arıyorum":
        return "bg-muted text-muted-foreground border-border";
      case "Ders Veriyorum":
        return "bg-muted text-muted-foreground border-border";
      case "Enstrüman Satıyorum":
        return "bg-muted text-muted-foreground border-border";
      case "Stüdyo Kiralıyorum":
        return "bg-muted text-muted-foreground border-border";
      case "Müzisyen Arıyorum":
        return "bg-muted text-muted-foreground border-border";
      case "Ders Almak İstiyorum":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (viewMode === 'grid') {
    return (
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <Link href={`/ilan-detay/${listing._id}`} className="block">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden">
            <img 
              src={listing.image} 
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Category Badge - Top Left */}
            <div className="absolute top-3 left-3">
              <Badge className={`text-xs border ${getCategoryColor(listing.categoryInfo?.name || listing.category)}`}>
                {listing.categoryInfo?.name || listing.category}
              </Badge>
            </div>
            
            {/* Instrument Badge - Top Right */}
            {listing.instrument && (
              <div className="absolute top-3 right-3">
                <Badge className="text-xs border bg-blue-100 text-blue-800 border-blue-200">
                  🎵 {listing.instrument}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Title */}
            <h3 className="font-semibold text-card-foreground text-sm line-clamp-2 flex-1 mr-2 leading-tight mb-3">
              {listing.title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-xs mb-4 line-clamp-2 leading-relaxed">
              {listing.description}
            </p>

            {/* Location and Date */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {listing.location}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('tr-TR') : 'Yeni'}
              </div>
            </div>

            {/* Author and Experience */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {listing.authorInfo?.profile?.picture ? (
                    <img 
                      src={listing.authorInfo.profile.picture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : listing.user?.picture ? (
                    <img 
                      src={listing.user.picture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">
                      {listing.authorInfo?.name?.[0] || listing.user?.name?.[0] || 'U'}
                    </span>
                  )}
                </div>
                <span>
                  {listing.authorInfo 
                    ? `${listing.authorInfo.name} ${listing.authorInfo.surname}` 
                    : listing.user 
                    ? `${listing.user.name} ${listing.user.surname}` 
                    : 'Bilinmeyen'
                  }
                </span>
              </div>
              <Badge variant="outline" className="text-xs border-border">
                {listing.experience}
              </Badge>
            </div>
          </div>
        </Link>

        {/* Actions */}
        <div className="px-5 pb-3">
          <div className="flex items-center justify-end">
            {isLoggedIn && (
              <Button size="sm" className="h-8 px-4 bg-black hover:bg-gray-800">
                <MessageCircle className="h-3 w-3 mr-1" />
                İletişim
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <Link href={`/ilan-detay/${listing._id}`} className="block">
        <div className="flex">
          {/* Image */}
          <div className="relative w-48 h-32 overflow-hidden flex-shrink-0">
            <img 
              src={listing.image} 
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Category Badge - Top Left */}
            <div className="absolute top-2 left-2">
              <Badge className={`text-xs border ${getCategoryColor(listing.categoryInfo?.name || listing.category)}`}>
                {listing.categoryInfo?.name || listing.category}
              </Badge>
            </div>
            
            {/* Instrument Badge - Top Right */}
            {listing.instrument && (
              <div className="absolute top-2 right-2">
                <Badge className="text-xs border bg-blue-100 text-blue-800 border-blue-200">
                  🎵 {listing.instrument}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-card-foreground text-base flex-1 mr-4">
                {listing.title}
              </h3>
            </div>

            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {listing.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {listing.location}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {listing.authorInfo?.profile?.picture ? (
                      <img 
                        src={listing.authorInfo.profile.picture} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : listing.user?.picture ? (
                      <img 
                        src={listing.user.picture} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground">
                        {listing.authorInfo?.name?.[0] || listing.user?.name?.[0] || 'U'}
                      </span>
                    )}
                  </div>
                  <span>
                    {listing.authorInfo 
                      ? `${listing.authorInfo.name} ${listing.authorInfo.surname}` 
                      : listing.user 
                      ? `${listing.user.name} ${listing.user.surname}` 
                      : 'Bilinmeyen'
                    }
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('tr-TR') : 'Yeni'}
                </div>
                <div className="flex items-center gap-1">
                  <Music className="h-4 w-4" />
                  <span>{listing.instrument || 'Belirtilmemiş'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs border-border">
                  {listing.experience}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="px-5 pb-3">
        <div className="flex items-center justify-end">
          {isLoggedIn && (
            <Button size="sm" className="h-8 px-4 bg-black hover:bg-gray-800">
              <MessageCircle className="h-3 w-3 mr-1" />
              İletişim
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
