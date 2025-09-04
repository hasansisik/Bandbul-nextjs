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
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
              <Badge className={`text-xs border ${getCategoryColor(listing.categoryInfo?.name || listing.category)}`}>
                {listing.categoryInfo?.name || listing.category}
              </Badge>
            </div>
            
            {/* Instrument Badge - Top Right */}
            {listing.instrument && (
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                <Badge className="text-xs border bg-blue-100 text-blue-800 border-blue-200">
                  🎵 {listing.instrument}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3 sm:p-5">
            {/* Title */}
            <h3 className="font-semibold text-card-foreground text-sm line-clamp-2 flex-1 mr-2 leading-tight mb-2 sm:mb-3">
              {listing.title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-xs mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
              {listing.description}
            </p>

            {/* Location and Date */}
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="hidden sm:inline">{listing.location}</span>
                <span className="sm:hidden">{listing.location.length > 15 ? listing.location.substring(0, 15) + '...' : listing.location}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('tr-TR') : 'Yeni'}
              </div>
            </div>

            {/* Author and Experience */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-muted flex items-center justify-center overflow-hidden">
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
                <span className="hidden sm:inline">
                  {listing.authorInfo 
                    ? `${listing.authorInfo.name} ${listing.authorInfo.surname}` 
                    : listing.user 
                    ? `${listing.user.name} ${listing.user.surname}` 
                    : 'Bilinmeyen'
                  }
                </span>
                <span className="sm:hidden">
                  {listing.authorInfo 
                    ? `${listing.authorInfo.name} ${listing.authorInfo.surname}`.length > 12 
                      ? `${listing.authorInfo.name} ${listing.authorInfo.surname}`.substring(0, 12) + '...'
                      : `${listing.authorInfo.name} ${listing.authorInfo.surname}`
                    : listing.user 
                    ? `${listing.user.name} ${listing.user.surname}`.length > 12
                      ? `${listing.user.name} ${listing.user.surname}`.substring(0, 12) + '...'
                      : `${listing.user.name} ${listing.user.surname}`
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
        <div className="px-3 sm:px-5 pb-3">
          <div className="flex items-center justify-end">
            {isLoggedIn && (
              <Button size="sm" className="h-7 sm:h-8 px-3 sm:px-4 bg-black hover:bg-gray-800 text-xs sm:text-sm">
                <MessageCircle className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">İletişim</span>
                <span className="sm:hidden">Mesaj</span>
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
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-48 h-32 overflow-hidden flex-shrink-0">
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
          <div className="flex-1 p-3 sm:p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-card-foreground text-sm sm:text-base flex-1 mr-4">
                {listing.title}
              </h3>
            </div>

            <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2">
              {listing.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
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
      <div className="px-3 sm:px-5 pb-3">
        <div className="flex items-center justify-end">
          {isLoggedIn && (
            <Button size="sm" className="h-7 sm:h-8 px-3 sm:px-4 bg-black hover:bg-gray-800 text-xs sm:text-sm">
              <MessageCircle className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">İletişim</span>
              <span className="sm:hidden">Mesaj</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
