"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface ListingsPaginationProps {
  totalListings: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const ListingsPagination = ({ totalListings, currentPage = 1, onPageChange }: ListingsPaginationProps) => {
  const [page, setPage] = useState(currentPage);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalListings / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (newPage: number | string) => {
    if (typeof newPage === 'number') {
      setPage(newPage);
      onPageChange?.(newPage);
    }
  };

  // Don't show pagination if there are no listings
  if (totalListings === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between bg-card rounded-xl p-6 shadow-sm border border-border">
      {/* Page Info */}
      <div className="text-sm text-muted-foreground">
        Sayfa <span className="font-semibold text-card-foreground">{page}</span> / <span className="font-semibold text-card-foreground">{totalPages}</span> - Toplam <span className="font-semibold text-card-foreground">{totalListings.toLocaleString()}</span> ilan
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="h-9 w-9 p-0 border-border hover:bg-accent"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum, index) => (
            <div key={index}>
              {pageNum === '...' ? (
                <div className="flex items-center justify-center w-9 h-9">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </div>
              ) : (
                <Button
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum as number)}
                  className={`h-9 w-9 p-0 ${page === pageNum ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'border-border hover:bg-accent'}`}
                >
                  {pageNum}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="h-9 w-9 p-0 border-border hover:bg-accent"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Items Per Page */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sayfa başına:</span>
        <Select defaultValue="12">
          <SelectTrigger className="w-[80px] border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="24">24</SelectItem>
            <SelectItem value="48">48</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ListingsPagination;
