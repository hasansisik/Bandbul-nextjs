"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getRecentPosts } from "@/lib/blogData";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const BlogSection = () => {
  const blogPosts = getRecentPosts(6);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (!isDragging) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.max(1, blogPosts.length - 3));
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [blogPosts.length, isDragging]);

  // Mouse/Touch event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if clicking on empty space, not on links
    if ((e.target as HTMLElement).closest('a')) return;
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(currentIndex * 25);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    const newIndex = Math.round((scrollLeft - walk) / 25);
    setCurrentIndex(Math.max(0, Math.min(newIndex, blogPosts.length - 4)));
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only start dragging if touching empty space, not on links
    if ((e.target as HTMLElement).closest('a')) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(currentIndex * 25);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    const newIndex = Math.round((scrollLeft - walk) / 25);
    setCurrentIndex(Math.max(0, Math.min(newIndex, blogPosts.length - 4)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <section className="py-16 bg-muted/10">
      <div className="container mx-auto">
        <div className="max-w-8xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">İlginizi Çekebilecek Bilgiler</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Blog bölümünde ilginizi çekebilecek yazılar bulabilirsiniz.
            </p>
          </div>

          {/* Blog Posts Carousel */}
          <div className="relative">
            <div 
              ref={carouselRef}
              className="overflow-hidden cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="flex transition-transform duration-700 ease-in-out select-none"
                style={{ 
                  transform: `translateX(-${currentIndex * 25}%)`,
                  pointerEvents: isDragging ? 'none' : 'auto'
                }}
              >
                {blogPosts.map((post) => (
                  <div key={post.id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-3">
                    <div className="h-full bg-card border border-border rounded-lg overflow-hidden">
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <Link href={`/blog/${post.slug}`}>
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        {/* Read Time - Top Right */}
                        <div className="absolute top-3 right-3">
                          <div className="flex items-center gap-1 text-xs text-foreground bg-background/90 px-2 py-1 rounded">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Link href={`/blog/kategori/${post.categorySlug}`}>
                            <Badge 
                              variant="outline" 
                              className="text-xs border-border cursor-pointer hover:bg-muted"
                            >
                              {post.category}
                            </Badge>
                          </Link>
                        </div>
                        
                        <Link href={`/blog/${post.slug}`}>
                          <h3 className="font-semibold text-lg leading-tight mb-3 line-clamp-2 text-foreground">
                            {post.title}
                          </h3>
                        </Link>
                        
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(post.publishedDate).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-1">
              {Array.from({ length: Math.max(1, blogPosts.length - 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-primary w-4' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link href="/blog">
              <Button variant="outline" size="lg" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-300 border-border">
                Tüm Yazıları Gör
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
